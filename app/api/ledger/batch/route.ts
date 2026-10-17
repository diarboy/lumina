import { NextResponse } from 'next/server'
import { utils, read } from 'xlsx'
import { db } from '@/lib/db'
import { sql } from 'drizzle-orm'

const userId = (request: Request) => request.headers.get('x-user-id') || 'demo-user'
const required = ['tanggal', 'jam', 'judul akta', 'pihak']

function normalizeTime(value: unknown) {
  if (value instanceof Date) return value.toISOString().slice(11, 16)
  const text = String(value ?? '').trim()
  if (/^\d{1,2}:\d{2}$/.test(text)) return text.padStart(5, '0')
  if (typeof value === 'number') {
    const minutes = Math.round(value * 24 * 60)
    return `${String(Math.floor(minutes / 60) % 24).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`
  }
  return text
}

function inferType(title: string) {
  const value = title.toLowerCase()
  if (value.includes('kredit')) return 'Perjanjian Kredit'
  if (value.includes('pendirian')) return 'Pendirian PT'
  if (value.includes('jual beli')) return 'PPJB'
  if (value.includes('fidusia')) return 'Fidusia'
  return 'Lainnya'
}

export async function POST(request: Request) {
  const form = await request.formData()
  const file = form.get('file')
  if (!(file instanceof File)) return NextResponse.json({ error: 'File XLSX wajib dipilih.' }, { status: 400 })
  const workbook = read(Buffer.from(await file.arrayBuffer()), { cellDates: true })
  const sheet = workbook.Sheets[workbook.SheetNames[0]]
  const rows = utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: '' })
  const headers = Object.keys(rows[0] ?? {}).map((header) => header.toLowerCase().trim())
  const missing = required.filter((header) => !headers.includes(header))
  if (missing.length) return NextResponse.json({ error: `Kolom wajib tidak ditemukan: ${missing.join(', ')}.` }, { status: 422 })
  if (!rows.length) return NextResponse.json({ error: 'File tidak memiliki data.' }, { status: 422 })

  const actor = userId(request)
  const result = await db.transaction(async (tx) => {
    const batch = await tx.execute<{ id: string }>(sql`INSERT INTO ledger_batches (user_id, source_name, status, row_count, created_at, committed_at) VALUES (${actor}, ${file.name}, 'validated', ${rows.length}, now(), now()) RETURNING id`)
    const batchId = batch.rows[0].id
    const existing = await tx.execute<{ deed_number: number; repertorium: number; deed_time: string }>(sql`SELECT deed_number, repertorium, deed_time::text FROM ledger_deeds WHERE user_id = ${actor} AND deed_date = CURRENT_DATE FOR UPDATE`)
    let nextNumber = Math.max(0, ...existing.rows.map((row) => row.deed_number)) + 1
    let nextRepertorium = Math.max(0, ...existing.rows.map((row) => row.repertorium)) + 1
    let previousTime = existing.rows.sort((a, b) => a.deed_time.localeCompare(b.deed_time)).at(-1)?.deed_time ?? '00:00:00'
    const values: Array<{ date: string; time: string; number: number; repertorium: number; title: string; type: string; parties: string[]; row: number }> = []
    for (const [index, row] of rows.entries()) {
      const date = String(row['Tanggal'] ?? row['tanggal']).slice(0, 10)
      const time = normalizeTime(row['Jam'] ?? row['jam'])
      const title = String(row['Judul Akta'] ?? row['judul akta']).trim()
      const parties = String(row['Pihak'] ?? row['pihak']).split(';').map((party) => party.trim()).filter(Boolean)
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^\d{2}:\d{2}$/.test(time) || !title || !parties.length) throw new Error(`Baris ${index + 2} tidak valid.`)
      if (date === new Date().toISOString().slice(0, 10) && time <= previousTime.slice(0, 5)) throw new Error(`Baris ${index + 2} melanggar urutan jam.`)
      values.push({ date, time, number: nextNumber++, repertorium: nextRepertorium++, title, type: inferType(title), parties, row: index + 2 })
      previousTime = `${time}:00`
    }
    for (const value of values) await tx.execute(sql`INSERT INTO ledger_deeds (batch_id, user_id, deed_date, deed_time, deed_number, repertorium, title, deed_type, parties, row_number) VALUES (${batchId}, ${actor}, ${value.date}, ${value.time}, ${value.number}, ${value.repertorium}, ${value.title}, ${value.type}, ${JSON.stringify(value.parties)}::jsonb, ${value.row})`)
    return { batchId, count: values.length, firstNumber: values[0].number, lastNumber: values.at(-1)?.number }
  })
  return NextResponse.json(result, { status: 201 })
}

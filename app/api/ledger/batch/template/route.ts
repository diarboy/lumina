import { NextResponse } from 'next/server'
import { utils, write } from 'xlsx'

export async function GET() {
  const rows = Array.from({ length: 20 }, (_, index) => ({ Tanggal: '2026-10-09', Jam: `${String(9 + Math.floor(index / 4)).padStart(2, '0')}:${String((index % 4) * 15).padStart(2, '0')}`, 'Judul Akta': index % 2 ? 'Perjanjian Kredit dan Jaminan Fidusia' : 'Akta Pendirian Perseroan Terbatas', Pihak: index % 2 ? 'PT Contoh Finance; Budi Santoso' : 'PT Contoh Nusantara' }))
  const workbook = utils.book_new()
  utils.book_append_sheet(workbook, utils.json_to_sheet(rows), 'Input Batch')
  const buffer = write(workbook, { type: 'buffer', bookType: 'xlsx' })
  return new NextResponse(buffer, { headers: { 'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'Content-Disposition': 'attachment; filename="template-input-batch-20-akta.xlsx"' } })
}

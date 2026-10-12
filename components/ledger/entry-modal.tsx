'use client'

import { useState } from 'react'
import { Plus, Trash2, Upload, X } from 'lucide-react'
import type { DeedForm, Party, Deed } from '@/types'

type Props = {
  type: 'single' | 'batch'
  form: DeedForm
  setForm: (form: DeedForm) => void
  batchName: string
  setBatchName: (value: string) => void
  quickTimes: string[]
  lastDeed?: Deed
  onClose: () => void
  onSave: (file?: File) => void
}

const inputClass = 'rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15'

export function EntryModal({ type, form, setForm, batchName, setBatchName, quickTimes, lastDeed, onClose, onSave }: Props) {
  const [selectedFile, setSelectedFile] = useState<File | undefined>()
  const [qqRows, setQqRows] = useState<number[]>(() => form.parties.flatMap((party, index) => party.qq?.trim() ? [index] : []))
  const [approvalRows, setApprovalRows] = useState<number[]>(() => form.parties.flatMap((party, index) => party.approval?.trim() ? [index] : []))

  const updateParty = (index: number, key: keyof Party, value: string) => {
    setForm({ ...form, parties: form.parties.map((party, i) => i === index ? { ...party, [key]: value } : party) })
  }

  const addParty = () => setForm({ ...form, parties: [...form.parties, { name: '', qq: '', approval: '' }] })
  const removeParty = (index: number) => {
    setForm({ ...form, parties: form.parties.filter((_, i) => i !== index) })
    setQqRows(qqRows.filter((row) => row !== index).map((row) => row > index ? row - 1 : row))
    setApprovalRows(approvalRows.filter((row) => row !== index).map((row) => row > index ? row - 1 : row))
  }
  const addQq = (index: number) => setQqRows((rows) => rows.includes(index) ? rows : [...rows, index])
  const removeQq = (index: number) => {
    setQqRows((rows) => rows.filter((row) => row !== index))
    updateParty(index, 'qq', '')
  }
  const addApproval = (index: number) => setApprovalRows((rows) => rows.includes(index) ? rows : [...rows, index])
  const removeApproval = (index: number) => {
    setApprovalRows((rows) => rows.filter((row) => row !== index))
    updateParty(index, 'approval', '')
  }

  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 p-4 backdrop-blur-sm">
    <div role="dialog" aria-modal="true" aria-labelledby="entry-dialog-title" className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-border bg-card p-6 shadow-2xl">
      <div className="flex items-start justify-between gap-4">
        <div><h3 id="entry-dialog-title" className="text-lg font-semibold">{type === 'single' ? 'Input satuan' : 'Input batch'}</h3><p className="mt-1 text-sm text-muted-foreground">{type === 'single' ? 'Validasi kronologi dan rincian akta sebelum commit.' : 'Upload XLSX untuk validasi dan commit atomik.'}</p></div>
        <button onClick={onClose} aria-label="Tutup dialog" className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted"><X className="size-4" /></button>
      </div>
      {type === 'batch' ? <div className="mt-6 flex flex-col gap-4">
        <label className="flex flex-col gap-2 text-sm font-medium">File batch (.xlsx)<input type="file" accept=".xlsx,.xls" onChange={(e) => { const file = e.target.files?.[0]; setSelectedFile(file); setBatchName(file?.name ?? '') }} className="rounded-xl border border-dashed border-input bg-background px-3 py-6 text-sm font-normal" /></label>
        <p className="text-xs text-muted-foreground">Kolom wajib: Tanggal, Jam, Judul Akta, Pihak. Pisahkan lebih dari satu pihak dengan titik koma (;).</p>
        <a href="/api/ledger/batch/template" download className="text-sm font-medium text-primary underline">Download template 20 akta</a>
        <button disabled={!batchName} onClick={() => onSave(selectedFile)} className="flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"><Upload className="size-4" />Upload &amp; proses batch</button>
      </div> : <div className="mt-6 flex flex-col gap-5">
        {lastDeed && <section className="overflow-hidden rounded-2xl border border-border bg-muted/20" aria-label="Riwayat akta terakhir">
          <div className="flex items-center justify-between border-b border-border/70 px-4 py-3"><div><p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Riwayat terbaru</p><p className="mt-0.5 text-sm font-semibold text-foreground">Akta terakhir dicatat</p></div><span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">{lastDeed.time}</span></div>
          <div className="grid gap-3 px-4 py-3 sm:grid-cols-[auto_1fr] sm:items-start"><div className="rounded-xl bg-background px-3 py-2 text-center"><p className="text-[10px] uppercase tracking-wider text-muted-foreground">Nomor</p><p className="mt-0.5 text-base font-bold tabular-nums">{lastDeed.number}</p></div><div className="min-w-0"><p className="truncate text-sm font-medium">{lastDeed.title}</p><p className="mt-1 truncate text-xs text-muted-foreground">{lastDeed.parties}</p><p className="mt-2 text-xs text-muted-foreground">Pencatatan berikutnya disarankan setelah jeda 15 menit.</p></div></div>
        </section>}
        <div className="grid gap-4 sm:grid-cols-2"><label className="flex flex-col gap-2 text-sm font-medium">Tanggal<input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className={inputClass} /></label><label className="flex flex-col gap-2 text-sm font-medium">Jam akta<input type="time" step="900" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} className={inputClass} /><span className="flex flex-wrap gap-1.5" aria-label="Pilihan waktu 15 menit">{quickTimes.map((time) => <button type="button" key={time} onClick={() => setForm({ ...form, time })} className={`rounded-lg border px-2 py-1 text-xs transition ${form.time === time ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:border-primary/50'}`}>{time}</button>)}</span></label></div>
        <label className="flex flex-col gap-2 text-sm font-medium">Judul akta<input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Contoh: Akta Pendirian Perseroan Terbatas" className={inputClass} /><span className="text-xs font-normal text-muted-foreground">Jenis akta akan dikenali otomatis dari judul.</span></label>
        <fieldset className="flex flex-col gap-3"><legend className="text-sm font-medium">Para pihak</legend><p className="text-xs text-muted-foreground">Tambahkan pihak yang terlibat. Setiap pihak dapat memiliki persetujuan atau pihak qq secara terpisah.</p>{form.parties.map((party, index) => <div key={index} className="rounded-xl border border-border/70 bg-muted/20 p-3"><div className="flex items-start gap-2"><div className="flex min-w-0 flex-1 flex-col gap-2"><label className="text-xs font-medium text-muted-foreground">Pihak {index + 1}<input value={party.name} onChange={(e) => updateParty(index, 'name', e.target.value)} placeholder={`Nama pihak ${index + 1}`} className={`${inputClass} mt-1.5 w-full`} /></label>{qqRows.includes(index) && <label className="text-xs font-medium text-muted-foreground">Pihak qq {index + 1}<input value={party.qq ?? ''} onChange={(e) => updateParty(index, 'qq', e.target.value)} placeholder={`Nama pihak qq ${index + 1} (opsional)`} className={`${inputClass} mt-1.5 w-full`} /></label>}{approvalRows.includes(index) && <label className="text-xs font-medium text-muted-foreground">Persetujuan pihak {index + 1}<input value={party.approval ?? ''} onChange={(e) => updateParty(index, 'approval', e.target.value)} placeholder={`Nama pemberi persetujuan ${index + 1}`} className={`${inputClass} mt-1.5 w-full`} /></label>}</div>{index > 0 && <button type="button" onClick={() => removeParty(index)} aria-label={`Hapus pihak ${index + 1}`} className="mt-6 rounded-lg p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"><Trash2 className="size-4" /></button>}</div><div className="mt-2 flex flex-wrap justify-end gap-3">{approvalRows.includes(index) ? <button type="button" onClick={() => removeApproval(index)} className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive"><X className="size-3.5" />Hapus persetujuan</button> : <button type="button" onClick={() => addApproval(index)} className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"><Plus className="size-3.5" />Persetujuan</button>}{qqRows.includes(index) ? <button type="button" onClick={() => removeQq(index)} className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive"><X className="size-3.5" />Hapus qq</button> : <button type="button" onClick={() => addQq(index)} className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"><Plus className="size-3.5" />QQ</button>}</div></div>)}<button type="button" onClick={addParty} className="inline-flex items-center gap-1.5 self-start text-sm font-medium text-primary hover:underline"><Plus className="size-4" />Tambah pihak</button></fieldset>
        <button onClick={() => onSave()} className="rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90">Simpan akta</button>
      </div>}
    </div>
  </div>
}

'use client'

import { useMemo, useState } from 'react'
import { Bell, SunMoon } from 'lucide-react'
import { Sidebar, MobileMenuButton } from '@/components/ledger/sidebar'
import { Dashboard, ManagementPage } from '@/components/ledger/pages'
import { EntryModal } from '@/components/ledger/entry-modal'
import { createTodayForm, getLastTime, getNextNumber, getNextRepertorium, inferDeedType, initialDeeds, nextQuarter } from '@/types'
import type { Deed, DeedForm, NavKey } from '@/types'

export default function Page() {
  const [dark, setDark] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeNav, setActiveNav] = useState<NavKey>('Dashboard')
  const [modal, setModal] = useState<'single' | 'batch' | null>(null)
  const [deeds, setDeeds] = useState<Deed[]>(initialDeeds)
  const [notice, setNotice] = useState('')
  const [form, setForm] = useState<DeedForm>(() => createTodayForm(getLastTime(initialDeeds)))
  const [batchName, setBatchName] = useState('')
  const lastTime = getLastTime(deeds)
  const quickTimes = useMemo(() => [nextQuarter(lastTime), nextQuarter(nextQuarter(lastTime)), nextQuarter(nextQuarter(nextQuarter(lastTime))), nextQuarter(nextQuarter(nextQuarter(nextQuarter(lastTime))))], [lastTime])

  function openEntry(type: 'single' | 'batch') { setForm(createTodayForm(lastTime)); setBatchName(''); setModal(type) }
  function saveSingle() { if (!form.title.trim() || !form.parties.some(party => party.name.trim())) return setNotice('Judul akta dan minimal satu pihak wajib diisi.'); if (form.time <= lastTime) return setNotice(`Jam akta harus setelah pencatatan terakhir (${lastTime}).`); const next = getNextNumber(deeds); setDeeds([{ number: next, repertorium: getNextRepertorium(deeds), title: form.title.trim(), parties: form.parties.filter(p => p.name.trim()).map(p => p.qq ? `${p.name.trim()} qq ${p.qq.trim()}` : p.name.trim()).join(' • '), type: inferDeedType(form.title), time: form.time, status: 'Menunggu' }, ...deeds]); setModal(null); setNotice(`Akta ${next} berhasil dicatat. Rincian transaksi masuk antrean validasi.`) }
  function saveBatch() { if (!batchName) return setNotice('Pilih file CSV atau Excel terlebih dahulu.'); setModal(null); setNotice(`Batch ${batchName} diterima dan masuk antrean validasi.`) }

  return <div className={dark ? 'dark' : 'light'}><div className="min-h-screen bg-background text-foreground"><Sidebar active={activeNav} open={mobileOpen} onClose={() => setMobileOpen(false)} onSelect={key => { setActiveNav(key); setMobileOpen(false); setNotice('') }} /><main className="lg:pl-[248px]"><header className="sticky top-0 z-20 flex h-[72px] items-center justify-between border-b border-border/70 bg-background/90 px-5 backdrop-blur-xl sm:px-8"><div className="flex items-center gap-3"><MobileMenuButton onClick={() => setMobileOpen(true)} /><div className="hidden h-8 w-px bg-border sm:block" /><div><p className="text-xs text-muted-foreground">Kamis, 9 Oktober 2026</p><h1 className="text-base font-semibold tracking-tight">Selamat pagi, Ardiansyah</h1></div></div><div className="flex items-center gap-2"><button className="relative flex size-9 items-center justify-center rounded-xl border border-border/70 text-muted-foreground hover:bg-muted" aria-label="Notifikasi" onClick={() => setNotice('Tidak ada notifikasi baru.')}><Bell className="size-[17px]" /><span className="absolute right-2 top-2 size-1.5 rounded-full bg-amber-500" /></button><button onClick={() => setDark(value => !value)} className="flex size-9 items-center justify-center rounded-xl border border-border/70 text-muted-foreground hover:bg-muted" aria-label="Ubah tema"><SunMoon className="size-[17px]" /></button></div></header><div className="mx-auto max-w-[1440px] p-5 sm:p-8">{notice && <div role="status" className="mb-5 flex items-center justify-between rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-400"><span>{notice}</span><button onClick={() => setNotice('')} aria-label="Tutup notifikasi">×</button></div>}{activeNav === 'Dashboard' ? <Dashboard deeds={deeds.slice(0, 6)} onNew={() => openEntry('single')} onBatch={() => openEntry('batch')} /> : <ManagementPage activeNav={activeNav} deeds={deeds} onNew={() => openEntry(activeNav === 'Input Batch' ? 'batch' : 'single')} onNotice={setNotice} />}</div></main>{modal && <EntryModal type={modal} form={form} setForm={setForm} batchName={batchName} setBatchName={setBatchName} quickTimes={quickTimes} onClose={() => setModal(null)} onSave={modal === 'single' ? saveSingle : saveBatch} />}</div></div>
}

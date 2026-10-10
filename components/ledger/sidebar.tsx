'use client'

import { Activity, BookOpen, ClipboardCheck, FileText, LayoutDashboard, Menu, SlidersHorizontal, Users, X } from 'lucide-react'
import type { NavKey } from '@/types'

const items: { group: string; entries: [NavKey, typeof LayoutDashboard][] }[] = [
  { group: 'Workspace', entries: [['Dashboard', LayoutDashboard], ['Buku Notaris', BookOpen], ['Repertorium', ClipboardCheck], ['Input Batch', FileText]] },
  { group: 'Management', entries: [['Pengguna', Users], ['Audit Trail', Activity], ['Pengaturan', SlidersHorizontal]] },
]

export function Sidebar({ active, open, onSelect, onClose }: { active: NavKey; open: boolean; onSelect: (key: NavKey) => void; onClose: () => void }) {
  return <>
    {open && <button className="fixed inset-0 z-30 bg-foreground/20 backdrop-blur-sm lg:hidden" onClick={onClose} aria-label="Tutup menu" />}
    <aside className={`fixed inset-y-0 left-0 z-40 flex w-[248px] flex-col border-r border-border/70 bg-sidebar px-4 py-5 transition-transform lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="flex items-center justify-between px-3"><div className="flex items-center gap-2.5"><div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground"><BookOpen className="size-[18px]" /></div><div><p className="text-sm font-semibold tracking-tight">E-LEDGER</p><p className="text-[10px] font-medium tracking-[0.18em] text-muted-foreground">REKAPTA</p></div></div><button onClick={onClose} className="rounded-lg p-1 text-muted-foreground lg:hidden" aria-label="Tutup menu"><X className="size-4" /></button></div>
      <div className="mt-9 flex flex-1 flex-col gap-7">{items.map(({ group, entries }) => <div key={group}><p className="px-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">{group}</p><nav className="mt-2 flex flex-col gap-1">{entries.map(([label, Icon]) => <button key={label} onClick={() => onSelect(label)} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${active === label ? 'bg-sidebar-accent font-medium text-sidebar-foreground' : 'text-muted-foreground hover:bg-sidebar-accent/70 hover:text-foreground'}`}><Icon className="size-[17px]" />{label}{label === 'Input Batch' && <span className="ml-auto rounded-md bg-amber-500/15 px-1.5 py-0.5 text-[10px] font-semibold text-amber-600">NEW</span>}</button>)}</nav></div>)}<div className="mt-auto rounded-2xl border border-border/70 bg-card p-3.5"><div className="flex items-center gap-2"><span className="size-2 rounded-full bg-emerald-500" /><span className="text-xs font-medium">Sistem beroperasi normal</span></div><p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">Semua transaksi tersinkronisasi secara realtime.</p></div></div>
      <div className="mt-5 flex items-center gap-3 border-t border-border/70 px-2 pt-4"><div className="flex size-9 items-center justify-center rounded-full bg-foreground text-xs font-semibold text-background">AR</div><div className="min-w-0 flex-1"><p className="truncate text-xs font-semibold">Ardiansyah</p><p className="text-[11px] text-muted-foreground">Administrator</p></div></div>
    </aside>
  </>
}

export function MobileMenuButton({ onClick }: { onClick: () => void }) { return <button onClick={onClick} className="rounded-lg p-2 text-muted-foreground hover:bg-muted lg:hidden" aria-label="Buka menu"><Menu className="size-5" /></button> }

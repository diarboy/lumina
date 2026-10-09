'use client'

import { useState } from 'react'
import {
  Activity,
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  Bell,
  BookOpen,
  CalendarDays,
  Check,
  ChevronDown,
  ClipboardCheck,
  FileDown,
  FileText,
  Filter,
  LayoutDashboard,
  Menu,
  MoreHorizontal,
  Plus,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  SunMoon,
  Users,
  X,
} from 'lucide-react'

const deeds = [
  { number: '00128', repertorium: 'R-02481', title: 'Perjanjian Kredit & Jaminan Fidusia', parties: 'PT Arunika Finance • Bima Santoso', type: 'Fidusia', time: '09:15', status: 'Tervalidasi' },
  { number: '00127', repertorium: 'R-02480', title: 'Akta Pendirian Perseroan Terbatas', parties: 'PT Langit Timur Nusantara', type: 'Pendirian PT', time: '08:45', status: 'Tervalidasi' },
  { number: '00126', repertorium: 'R-02479', title: 'Perjanjian Pengikatan Jual Beli', parties: 'Nadia Permata • Fajar Hidayat', type: 'PPJB', time: '08:30', status: 'Tervalidasi' },
  { number: '00125', repertorium: 'R-02478', title: 'Kuasa Membebankan Hak Tanggungan', parties: 'Bank Kencana • Rudi Hartono', type: 'SKMHT', time: '08:15', status: 'Menunggu' },
]

const activity = [
  { icon: Check, color: 'text-emerald-500', bg: 'bg-emerald-500/10', text: 'Batch 20 akta berhasil divalidasi dan committed', time: '10 menit lalu' },
  { icon: FileDown, color: 'text-sky-500', bg: 'bg-sky-500/10', text: 'Laporan repertorium September diekspor', time: '1 jam lalu' },
  { icon: ShieldCheck, color: 'text-violet-500', bg: 'bg-violet-500/10', text: 'Kebijakan akses diperbarui oleh Admin', time: '3 jam lalu' },
]

function StatCard({ label, value, detail, trend, icon: Icon, tone }: { label: string; value: string; detail: string; trend?: string; icon: typeof FileText; tone: string }) {
  return (
    <div className="rounded-2xl border border-border/70 bg-card p-5 shadow-sm shadow-black/[0.02] transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div className={`flex size-10 items-center justify-center rounded-xl ${tone}`}><Icon className="size-[18px]" /></div>
        {trend && <span className="flex items-center gap-1 text-xs font-medium text-emerald-600"><ArrowUpRight className="size-3.5" />{trend}</span>}
      </div>
      <p className="mt-5 text-sm text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-semibold tracking-tight text-foreground">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{detail}</p>
    </div>
  )
}

export default function Page() {
  const [dark, setDark] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeNav, setActiveNav] = useState('Dashboard')
  const [showNew, setShowNew] = useState(false)

  return (
    <div className={dark ? 'dark' : ''}>
      <div className="min-h-screen bg-background text-foreground">
        <aside className={`fixed inset-y-0 left-0 z-40 flex w-[248px] flex-col border-r border-border/70 bg-sidebar px-4 py-5 transition-transform lg:translate-x-0 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="flex items-center justify-between px-3">
            <div className="flex items-center gap-2.5"><div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground"><BookOpen className="size-[18px]" /></div><div><p className="text-sm font-semibold tracking-tight">E-LEDGER</p><p className="text-[10px] font-medium tracking-[0.18em] text-muted-foreground">REKAPTA</p></div></div>
            <button onClick={() => setMobileOpen(false)} className="rounded-lg p-1 text-muted-foreground lg:hidden" aria-label="Tutup menu"><X className="size-4" /></button>
          </div>
          <div className="mt-9 flex flex-1 flex-col gap-7">
            <div><p className="px-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Workspace</p><nav className="mt-2 flex flex-col gap-1">
              {[['Dashboard', LayoutDashboard], ['Buku Notaris', BookOpen], ['Repertorium', ClipboardCheck], ['Input Batch', FileText]].map(([label, Icon]) => <button key={label as string} onClick={() => setActiveNav(label as string)} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${activeNav === label ? 'bg-sidebar-accent font-medium text-sidebar-foreground' : 'text-muted-foreground hover:bg-sidebar-accent/70 hover:text-foreground'}`}><Icon className="size-[17px]" />{label as string}{label === 'Input Batch' && <span className="ml-auto rounded-md bg-amber-500/15 px-1.5 py-0.5 text-[10px] font-semibold text-amber-600">NEW</span>}</button>)}
            </nav></div>
            <div><p className="px-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Management</p><nav className="mt-2 flex flex-col gap-1">{[[Users, 'Pengguna'], [Activity, 'Audit Trail'], [SlidersHorizontal, 'Pengaturan']].map(([Icon, label]) => <button key={label as string} onClick={() => setActiveNav(label as string)} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted-foreground transition hover:bg-sidebar-accent/70 hover:text-foreground"><Icon className="size-[17px]" />{label as string}</button>)}</nav></div>
            <div className="mt-auto rounded-2xl border border-border/70 bg-card p-3.5"><div className="flex items-center gap-2"><span className="size-2 rounded-full bg-emerald-500 shadow-[0_0_0_3px] shadow-emerald-500/15" /><span className="text-xs font-medium">Sistem beroperasi normal</span></div><p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">Semua transaksi tersinkronisasi secara realtime.</p><div className="mt-3 h-1 overflow-hidden rounded-full bg-muted"><div className="h-full w-[98%] rounded-full bg-emerald-500" /></div></div>
          </div>
          <div className="mt-5 flex items-center gap-3 border-t border-border/70 px-2 pt-4"><div className="flex size-9 items-center justify-center rounded-full bg-foreground text-xs font-semibold text-background">AR</div><div className="min-w-0 flex-1"><p className="truncate text-xs font-semibold">Ardiansyah</p><p className="text-[11px] text-muted-foreground">Administrator</p></div><ChevronDown className="size-4 text-muted-foreground" /></div>
        </aside>

        {mobileOpen && <button onClick={() => setMobileOpen(false)} className="fixed inset-0 z-30 bg-foreground/20 backdrop-blur-sm lg:hidden" aria-label="Tutup sidebar" />}
        <main className="lg:pl-[248px]">
          <header className="sticky top-0 z-20 flex h-[72px] items-center justify-between border-b border-border/70 bg-background/90 px-5 backdrop-blur-xl sm:px-8"><div className="flex items-center gap-3"><button onClick={() => setMobileOpen(true)} className="rounded-lg p-2 text-muted-foreground hover:bg-muted lg:hidden" aria-label="Buka menu"><Menu className="size-5" /></button><div className="hidden h-8 w-px bg-border sm:block" /><div><p className="text-xs text-muted-foreground">Kamis, 9 Oktober 2026</p><h1 className="text-base font-semibold tracking-tight">Selamat pagi, Ardiansyah</h1></div></div><div className="flex items-center gap-2"><button className="hidden size-9 items-center justify-center rounded-xl border border-border/70 text-muted-foreground transition hover:bg-muted sm:flex" aria-label="Cari"><Search className="size-[17px]" /></button><button className="relative flex size-9 items-center justify-center rounded-xl border border-border/70 text-muted-foreground transition hover:bg-muted" aria-label="Notifikasi"><Bell className="size-[17px]" /><span className="absolute right-2 top-2 size-1.5 rounded-full bg-amber-500" /></button><button onClick={() => setDark(!dark)} className="flex size-9 items-center justify-center rounded-xl border border-border/70 text-muted-foreground transition hover:bg-muted" aria-label="Ubah tema"><SunMoon className="size-[17px]" /></button></div></header>
          <div className="mx-auto max-w-[1440px] p-5 sm:p-8"><section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-primary/5 px-2.5 py-1 text-[11px] font-medium text-primary"><Sparkles className="size-3" /> Ringkasan operasional</div><h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Overview</h2><p className="mt-1 text-sm text-muted-foreground">Pantau pencatatan dan integritas data akta kantor Anda.</p></div><div className="flex items-center gap-2"><button className="flex items-center gap-2 rounded-xl border border-border/70 bg-card px-3.5 py-2.5 text-sm font-medium shadow-sm transition hover:bg-muted"><CalendarDays className="size-4 text-muted-foreground" /> 1–31 Okt 2026 <ChevronDown className="size-3.5 text-muted-foreground" /></button><button onClick={() => setShowNew(true)} className="flex items-center gap-2 rounded-xl bg-primary px-3.5 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition hover:opacity-90"><Plus className="size-4" /> Akta baru</button></div></section>
            <section className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><StatCard label="Total akta bulan ini" value="128" detail="12 lebih banyak dari Sep" trend="10.3%" icon={FileText} tone="bg-sky-500/10 text-sky-600" /><StatCard label="Nomor repertorium" value="24,981" detail="Nomor kumulatif terakhir" icon={BookOpen} tone="bg-violet-500/10 text-violet-600" /><StatCard label="Batch diproses" value="24" detail="100% berhasil divalidasi" trend="8.7%" icon={ClipboardCheck} tone="bg-emerald-500/10 text-emerald-600" /><StatCard label="Waktu rata-rata" value="42 detik" detail="Per entri akta" trend="18.2%" icon={Activity} tone="bg-amber-500/10 text-amber-600" /></section>
            <section className="mt-6 grid gap-6 xl:grid-cols-[1.45fr_1fr]"><div className="rounded-2xl border border-border/70 bg-card p-5 shadow-sm sm:p-6"><div className="flex items-start justify-between"><div><h3 className="font-semibold tracking-tight">Aktivitas pencatatan</h3><p className="mt-1 text-xs text-muted-foreground">Jumlah akta yang tercatat selama bulan berjalan</p></div><button className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted" aria-label="Opsi grafik"><MoreHorizontal className="size-[18px]" /></button></div><div className="mt-6 flex h-[180px] items-end gap-2 sm:gap-3">{[42, 56, 44, 68, 52, 78, 61, 72, 88, 66, 94, 82, 100, 76, 91, 86, 69, 84, 93, 77, 96, 88, 100, 91, 78, 86, 99, 84, 94, 100].map((height, i) => <div key={i} className="group flex h-full flex-1 flex-col justify-end gap-2"><div className={`w-full rounded-t-md transition hover:opacity-80 ${i === 28 ? 'bg-primary' : 'bg-primary/15'}`} style={{ height: `${height}%` }} /><span className="text-center text-[9px] text-muted-foreground">{i % 5 === 0 ? i + 1 : ''}</span></div>)}</div><div className="mt-2 flex items-center justify-between border-t border-border/60 pt-3 text-[11px] text-muted-foreground"><span>1 Okt</span><span>10 Okt</span><span>20 Okt</span><span>31 Okt</span></div></div>
              <div className="rounded-2xl border border-border/70 bg-card p-5 shadow-sm sm:p-6"><div className="flex items-start justify-between"><div><h3 className="font-semibold tracking-tight">Integritas sistem</h3><p className="mt-1 text-xs text-muted-foreground">Status kesehatan data saat ini</p></div><ShieldCheck className="size-5 text-emerald-500" /></div><div className="mt-6 flex items-center gap-5"><div className="relative flex size-[124px] shrink-0 items-center justify-center rounded-full" style={{ background: 'conic-gradient(#10b981 0deg 352deg, color-mix(in oklab, var(--muted) 80%, transparent) 352deg 360deg)' }}><div className="flex size-[96px] flex-col items-center justify-center rounded-full bg-card"><span className="text-2xl font-semibold">98.7%</span><span className="text-[10px] text-muted-foreground">healthy</span></div></div><div className="flex flex-col gap-3 text-xs"><div><p className="text-muted-foreground">Duplikasi nomor</p><p className="mt-0.5 font-semibold text-emerald-600">0 terdeteksi</p></div><div><p className="text-muted-foreground">Nomor terlewat</p><p className="mt-0.5 font-semibold text-emerald-600">0 terdeteksi</p></div><div><p className="text-muted-foreground">Audit terakhir</p><p className="mt-0.5 font-semibold">Baru saja</p></div></div></div><div className="mt-5 flex items-center gap-2 rounded-xl bg-emerald-500/8 px-3 py-2.5 text-xs text-emerald-700 dark:text-emerald-400"><Check className="size-3.5" /> Semua validasi sistem berjalan normal</div></div></section>
            <section className="mt-6 grid gap-6 xl:grid-cols-[1.45fr_1fr]"><div className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm"><div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/70 p-5 sm:px-6"><div><h3 className="font-semibold tracking-tight">Pencatatan terbaru</h3><p className="mt-1 text-xs text-muted-foreground">Akta terakhir yang masuk ke ledger</p></div><div className="flex items-center gap-2"><button className="flex items-center gap-1.5 rounded-lg border border-border/70 px-2.5 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted"><Filter className="size-3.5" /> Filter</button><button className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted" aria-label="Opsi tabel"><MoreHorizontal className="size-[18px]" /></button></div></div><div className="overflow-x-auto"><table className="w-full min-w-[640px] text-left text-xs"><thead className="bg-muted/40 text-[10px] uppercase tracking-wider text-muted-foreground"><tr><th className="px-6 py-3 font-medium">No. Akta</th><th className="px-3 py-3 font-medium">Judul akta</th><th className="px-3 py-3 font-medium">Jenis</th><th className="px-3 py-3 font-medium">Waktu</th><th className="px-6 py-3 text-right font-medium">Status</th></tr></thead><tbody className="divide-y divide-border/60">{deeds.map((deed) => <tr key={deed.number} className="transition hover:bg-muted/30"><td className="px-6 py-4"><p className="font-semibold">{deed.number}</p><p className="mt-0.5 text-[10px] text-muted-foreground">{deed.repertorium}</p></td><td className="max-w-[240px] px-3 py-4"><p className="truncate font-medium">{deed.title}</p><p className="mt-1 truncate text-[10px] text-muted-foreground">{deed.parties}</p></td><td className="px-3 py-4 text-muted-foreground">{deed.type}</td><td className="px-3 py-4 text-muted-foreground">{deed.time}</td><td className="px-6 py-4 text-right"><span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-[10px] font-medium ${deed.status === 'Menunggu' ? 'bg-amber-500/10 text-amber-600' : 'bg-emerald-500/10 text-emerald-600'}`}><span className="size-1.5 rounded-full bg-current" />{deed.status}</span></td></tr>)}</tbody></table></div><div className="border-t border-border/70 px-6 py-3"><button className="text-xs font-medium text-muted-foreground transition hover:text-foreground">Lihat semua pencatatan <ArrowDownRight className="ml-1 inline size-3.5 rotate-[-45deg]" /></button></div></div>
              <div className="rounded-2xl border border-border/70 bg-card p-5 shadow-sm sm:p-6"><div className="flex items-start justify-between"><div><h3 className="font-semibold tracking-tight">Aktivitas terbaru</h3><p className="mt-1 text-xs text-muted-foreground">Jejak aktivitas workspace</p></div><button className="text-xs font-medium text-muted-foreground hover:text-foreground">Lihat semua</button></div><div className="mt-5 flex flex-col gap-5">{activity.map(({ icon: Icon, color, bg, text, time }) => <div className="flex gap-3" key={text}><div className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${bg} ${color}`}><Icon className="size-4" /></div><div><p className="text-xs font-medium leading-relaxed">{text}</p><p className="mt-1 text-[10px] text-muted-foreground">{time}</p></div></div>)}</div><div className="mt-6 rounded-xl border border-dashed border-border p-3"><div className="flex items-center gap-2 text-xs font-medium"><AlertTriangle className="size-3.5 text-amber-500" /> Perlu perhatian</div><p className="mt-1.5 text-[11px] leading-relaxed text-muted-foreground">1 pencatatan menunggu validasi notaris.</p><button className="mt-2 text-[11px] font-medium text-foreground underline underline-offset-2">Tinjau sekarang</button></div></div></section>
          </div>
        </main>
        {showNew && <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 p-5 backdrop-blur-sm"><div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl"><div className="flex items-start justify-between"><div><h3 className="text-lg font-semibold">Tambah akta baru</h3><p className="mt-1 text-sm text-muted-foreground">Mulai pencatatan akta secara kronologis.</p></div><button onClick={() => setShowNew(false)} className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted" aria-label="Tutup dialog"><X className="size-4" /></button></div><div className="mt-6 flex flex-col gap-3"><button className="flex items-center gap-3 rounded-xl border border-border p-4 text-left transition hover:bg-muted"><div className="flex size-9 items-center justify-center rounded-lg bg-sky-500/10 text-sky-600"><FileText className="size-4" /></div><div><p className="text-sm font-medium">Input satuan</p><p className="mt-0.5 text-xs text-muted-foreground">Catat satu akta baru ke ledger.</p></div></button><button className="flex items-center gap-3 rounded-xl border border-border p-4 text-left transition hover:bg-muted"><div className="flex size-9 items-center justify-center rounded-lg bg-violet-500/10 text-violet-600"><ClipboardCheck className="size-4" /></div><div><p className="text-sm font-medium">Input batch</p><p className="mt-0.5 text-xs text-muted-foreground">Import beberapa akta sekaligus.</p></div></button></div></div></div>}
      </div>
    </div>
  )
}

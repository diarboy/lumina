import type { LucideIcon } from 'lucide-react'

export type NavKey = 'Dashboard' | 'Buku Notaris' | 'Repertorium' | 'Input Batch' | 'Pengguna' | 'Audit Trail' | 'Pengaturan'
export type DeedStatus = 'Tervalidasi' | 'Menunggu'
export type Deed = { number: string; repertorium: string; title: string; parties: string; type: string; time: string; status: DeedStatus }
export type Party = { name: string; qq: string }
export type DeedForm = { date: string; time: string; title: string; parties: Party[] }
export type NavItem = [NavKey, LucideIcon]

export const initialDeeds: Deed[] = [
  { number: '00128', repertorium: 'R-02481', title: 'Perjanjian Kredit & Jaminan Fidusia', parties: 'PT Arunika Finance • Bima Santoso', type: 'Fidusia', time: '09:15', status: 'Tervalidasi' },
  { number: '00127', repertorium: 'R-02480', title: 'Akta Pendirian Perseroan Terbatas', parties: 'PT Langit Timur Nusantara', type: 'Pendirian PT', time: '08:45', status: 'Tervalidasi' },
  { number: '00126', repertorium: 'R-02479', title: 'Perjanjian Pengikatan Jual Beli', parties: 'Nadia Permata • Fajar Hidayat', type: 'PPJB', time: '08:30', status: 'Tervalidasi' },
  { number: '00125', repertorium: 'R-02478', title: 'Kuasa Membebankan Hak Tanggungan', parties: 'Bank Kencana • Rudi Hartono', type: 'SKMHT', time: '08:15', status: 'Menunggu' },
]

export const navGroups = [
  { title: 'Workspace', items: [['Dashboard', 'LayoutDashboard'], ['Buku Notaris', 'BookOpen'], ['Repertorium', 'ClipboardCheck'], ['Input Batch', 'FileText']] },
  { title: 'Management', items: [['Pengguna', 'Users'], ['Audit Trail', 'Activity'], ['Pengaturan', 'SlidersHorizontal']] },
] as const

export const pageDescriptions: Record<NavKey, string> = {
  Dashboard: 'Pantau pencatatan dan integritas data akta kantor Anda.',
  'Buku Notaris': 'Kelola seluruh pencatatan akta kantor secara kronologis.',
  Repertorium: 'Pantau nomor repertorium dan validasi urutan pencatatan.',
  'Input Batch': 'Import dan validasi beberapa akta sekaligus.',
  Pengguna: 'Kelola pengguna, peran, dan hak akses workspace.',
  'Audit Trail': 'Telusuri seluruh jejak perubahan data dan aktivitas pengguna.',
  Pengaturan: 'Konfigurasi profil kantor, preferensi, dan kebijakan sistem.',
}

export function nextQuarter(time: string) { const [h, m] = time.split(':').map(Number); const total = h * 60 + m + 15; return `${String(Math.floor(total / 60) % 24).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}` }
export function inferDeedType(title: string) { const value = title.toLowerCase(); if (value.includes('kredit')) return 'Perjanjian Kredit'; if (value.includes('pendirian')) return 'Pendirian PT'; if (value.includes('jual beli')) return 'PPJB'; if (value.includes('fidusia')) return 'Fidusia'; return 'Lainnya' }
export function createTodayForm(lastTime: string): DeedForm { return { date: new Date().toISOString().slice(0, 10), time: nextQuarter(lastTime), title: '', parties: [{ name: '', qq: '' }] } }

export const iconMap = { LayoutDashboard: 'LayoutDashboard', BookOpen: 'BookOpen', ClipboardCheck: 'ClipboardCheck', FileText: 'FileText', Users: 'Users', Activity: 'Activity', SlidersHorizontal: 'SlidersHorizontal' } as const
export type IconName = keyof typeof iconMap

export const auditEvents = [
  ['10:42', 'Ardiansyah', 'Mencatat akta baru 00128', 'Akta satuan', 'success'],
  ['10:31', 'Siti Rahma', 'Memvalidasi batch #B-024', 'Input batch', 'success'],
  ['09:18', 'Ardiansyah', 'Mengubah kebijakan akses', 'Pengaturan', 'warning'],
  ['08:55', 'Budi Santoso', 'Masuk ke dalam sistem', 'Autentikasi', 'neutral'],
] as const

export const users = [
  ['Ardiansyah', 'ardiansyah@rekapta.id', 'Administrator', 'Aktif'],
  ['Siti Rahma', 'siti.rahma@rekapta.id', 'Notaris', 'Aktif'],
  ['Budi Santoso', 'budi.santoso@rekapta.id', 'Operator', 'Aktif'],
] as const

export const settings = [
  ['Profil kantor', 'Informasi identitas dan detail kantor notaris'],
  ['Preferensi pencatatan', 'Interval waktu, zona waktu, dan format nomor'],
  ['Keamanan & akses', 'Kebijakan sesi, peran, dan autentikasi'],
] as const

export const getLastTime = (deeds: Deed[]) => deeds[0]?.time ?? '09:15'
export const getNextNumber = (deeds: Deed[]) => String(129 + Math.max(0, deeds.length - initialDeeds.length)).padStart(5, '0')
export const getNextRepertorium = (deeds: Deed[]) => `R-${2482 + Math.max(0, deeds.length - initialDeeds.length)}`

export type { LucideIcon }

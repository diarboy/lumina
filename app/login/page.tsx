'use client'

import { FormEvent, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, KeyRound, ShieldCheck } from 'lucide-react'
import { authClient } from '@/lib/auth-client'

type Mode = 'login' | 'signup' | 'reset'
const rules = [
  ['length', 'Minimal 7 karakter', (value: string) => value.length > 6],
  ['lower', 'Huruf kecil (a–z)', (value: string) => /[a-z]/.test(value)],
  ['upper', 'Huruf besar (A–Z)', (value: string) => /[A-Z]/.test(value)],
  ['number', 'Angka (0–9)', (value: string) => /\d/.test(value)],
  ['symbol', 'Simbol (!@#$)', (value: string) => /[^A-Za-z0-9]/.test(value)],
] as const

function PasswordGuide({ password }: { password: string }) {
  const passed = rules.filter(([, , test]) => test(password)).length
  const level = passed <= 1 ? 1 : passed <= 3 ? 2 : passed === 4 ? 3 : 4
  const strength = !password ? 'Belum diisi' : ['Lemah', 'Sedang', 'Kuat', 'Sangat kuat'][level - 1]
  const color = level === 1 ? 'bg-destructive' : level === 2 ? 'bg-orange-500' : level === 3 ? 'bg-emerald-500' : 'bg-primary'
  return <div className="rounded-xl border border-border bg-muted/30 p-3">
    <div className="flex items-center justify-between text-xs"><span className="font-medium">Kekuatan password</span><span className="font-semibold">{strength}</span></div>
    <div className="mt-2 grid grid-cols-4 gap-1" aria-label={`Kekuatan password: ${strength}`}>
      {[1, 2, 3, 4].map((segment) => <span key={segment} className={`h-2 rounded-full ${segment <= level && password ? color : 'bg-border'}`} />)}
    </div>
    <div className="mt-2 flex justify-between text-[10px] font-medium text-muted-foreground"><span>Lemah</span><span>Sedang</span><span>Kuat</span><span>Sangat kuat</span></div>
    <p className="mt-3 text-[11px] font-medium text-muted-foreground">Gunakan &gt;6 karakter, huruf besar-kecil, angka, dan simbol.</p>
    <ul className="mt-1 grid grid-cols-2 gap-x-3 gap-y-1 text-[11px] text-muted-foreground">{rules.map(([key, label, test]) => <li key={key} className={test(password) ? 'text-emerald-600' : ''}>{test(password) ? '✓' : '○'} {label}</li>)}</ul>
  </div>
}

export default function LoginPage() {
  const router = useRouter(); const [mode, setMode] = useState<Mode>('login'); const [username, setUsername] = useState(''); const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const [show, setShow] = useState(false); const [error, setError] = useState(''); const [message, setMessage] = useState('')
  const score = useMemo(() => rules.filter(([, , test]) => test(password)).length, [password])
  async function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); setError(''); setMessage(''); if (mode === 'signup' && score < 5) return setError('Lengkapi seluruh indikator password sebelum membuat akun.'); const result = mode === 'signup' ? await authClient.signUp.email({ email, password, name: username }) : mode === 'reset' ? await authClient.requestPasswordReset({ email, redirectTo: `${window.location.origin}/reset-password` }) : await authClient.signIn.email({ email, password }); if (result.error) return setError('Permintaan tidak dapat diproses. Periksa kembali data yang dimasukkan.'); if (mode === 'reset') return setMessage('Jika email terdaftar, instruksi reset password telah dikirim.'); router.push('/'); router.refresh() }
  const title = mode === 'login' ? 'Masuk ke E-Ledger' : mode === 'signup' ? 'Buat akun pengguna' : 'Reset password'
  return <main className="flex min-h-screen items-center justify-center bg-background px-5 py-10 text-foreground"><div className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-border/70 bg-card shadow-2xl lg:grid-cols-[0.9fr_1.1fr]"><section className="hidden bg-primary p-10 text-primary-foreground lg:flex lg:flex-col lg:justify-between"><div><div className="mb-12 flex items-center gap-3"><div className="flex size-10 items-center justify-center rounded-xl bg-primary-foreground/15"><KeyRound /></div><span className="text-lg font-semibold">E-Ledger</span></div><p className="max-w-sm text-4xl font-semibold leading-tight tracking-tight">Pencatatan akta yang tertib, aman, dan terukur.</p></div><div className="flex items-center gap-2 text-sm text-primary-foreground/75"><ShieldCheck /> Data dilindungi dengan session aman</div></section><section className="p-6 sm:p-10"><div className="mx-auto max-w-md"><div className="mb-8 lg:hidden"><p className="text-lg font-semibold">E-Ledger</p><p className="text-sm text-muted-foreground">Sistem pencatatan akta</p></div><h1 className="text-2xl font-semibold tracking-tight">{title}</h1><p className="mt-2 text-sm text-muted-foreground">{mode === 'login' ? 'Gunakan email dan password Anda untuk melanjutkan.' : mode === 'signup' ? 'Lengkapi data untuk membuat akses pengguna baru.' : 'Masukkan email untuk menerima tautan pemulihan.'}</p><form onSubmit={submit} className="mt-8 flex flex-col gap-4">{mode === 'signup' && <label className="flex flex-col gap-2 text-sm font-medium">Username<input required value={username} onChange={e => setUsername(e.target.value)} className="h-11 rounded-xl border border-border bg-background px-3 outline-none ring-primary focus:ring-2" placeholder="Nama pengguna" /></label>}<label className="flex flex-col gap-2 text-sm font-medium">Email<input required type="email" value={email} onChange={e => setEmail(e.target.value)} className="h-11 rounded-xl border border-border bg-background px-3 outline-none ring-primary focus:ring-2" placeholder="nama@kantor.id" /></label>{mode !== 'reset' && <><label className="flex flex-col gap-2 text-sm font-medium">Password<div className="relative"><input required type={show ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} className="h-11 w-full rounded-xl border border-border bg-background px-3 pr-11 outline-none ring-primary focus:ring-2" placeholder="Masukkan password" /><button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-2.5 text-muted-foreground" aria-label={show ? 'Sembunyikan password' : 'Tampilkan password'}>{show ? <EyeOff /> : <Eye />}</button></div></label>{mode === 'signup' && <PasswordGuide password={password} />}</>}{error && <p role="alert" className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>}{message && <p role="status" className="rounded-lg bg-emerald-500/10 px-3 py-2 text-sm text-emerald-700">{message}</p>}<button className="h-11 rounded-xl bg-primary font-semibold text-primary-foreground">{mode === 'login' ? 'Masuk' : mode === 'signup' ? 'Buat akun' : 'Kirim instruksi reset'}</button></form><div className="mt-6 flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">{mode === 'login' && <button onClick={() => setMode('reset')} className="font-medium text-foreground underline-offset-4 hover:underline">Lupa password?</button>}{mode !== 'signup' && <button onClick={() => setMode('signup')} className="font-medium text-foreground underline-offset-4 hover:underline">Buat akun</button>}{mode !== 'login' && <button onClick={() => setMode('login')} className="font-medium text-foreground underline-offset-4 hover:underline">Sudah punya akun? Masuk</button>}</div></div></section></div></main>
}

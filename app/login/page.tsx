'use client'

import { FormEvent, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, KeyRound, ShieldCheck } from 'lucide-react'
import { authClient } from '@/lib/auth-client'

type Mode = 'login' | 'signup' | 'reset'

function passwordScore(password: string) {
  return [password.length > 6, /[a-z]/.test(password), /[A-Z]/.test(password), /\d/.test(password), /[^A-Za-z0-9]/.test(password)].filter(Boolean).length
}

export default function LoginPage() {
  const router = useRouter()
  const [mode, setMode] = useState<Mode>('login')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const score = useMemo(() => passwordScore(password), [password])

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setMessage('')
    if (mode === 'signup' && score < 5) return setError('Password harus lebih dari 6 karakter dan memuat huruf besar, huruf kecil, angka, serta simbol.')
    const result = mode === 'signup'
      ? await authClient.signUp.email({ email, password, name: username })
      : mode === 'reset'
        ? await authClient.requestPasswordReset({ email, redirectTo: `${window.location.origin}/reset-password` })
        : await authClient.signIn.email({ email, password })
    if (result.error) return setError('Permintaan tidak dapat diproses. Periksa kembali data yang dimasukkan.')
    if (mode === 'reset') return setMessage('Jika email terdaftar, instruksi reset password telah dikirim.')
    router.push('/')
    router.refresh()
  }

  const title = mode === 'login' ? 'Masuk ke E-Ledger' : mode === 'signup' ? 'Buat akun pengguna' : 'Reset password'
  return <main className="flex min-h-screen items-center justify-center bg-background px-5 py-10 text-foreground"><div className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-border/70 bg-card shadow-2xl lg:grid-cols-[0.9fr_1.1fr]"><section className="hidden bg-primary p-10 text-primary-foreground lg:flex lg:flex-col lg:justify-between"><div><div className="mb-12 flex items-center gap-3"><div className="flex size-10 items-center justify-center rounded-xl bg-primary-foreground/15"><KeyRound /></div><span className="text-lg font-semibold">E-Ledger</span></div><p className="max-w-sm text-4xl font-semibold leading-tight tracking-tight">Pencatatan akta yang tertib, aman, dan terukur.</p></div><div className="flex items-center gap-2 text-sm text-primary-foreground/75"><ShieldCheck /> Data dilindungi dengan session aman</div></section><section className="p-6 sm:p-10"><div className="mx-auto max-w-md"><div className="mb-8 lg:hidden"><p className="text-lg font-semibold">E-Ledger</p><p className="text-sm text-muted-foreground">Sistem pencatatan akta</p></div><h1 className="text-2xl font-semibold tracking-tight">{title}</h1><p className="mt-2 text-sm text-muted-foreground">{mode === 'login' ? 'Gunakan email dan password Anda untuk melanjutkan.' : mode === 'signup' ? 'Lengkapi data untuk membuat akses pengguna baru.' : 'Masukkan email untuk menerima tautan pemulihan.'}</p><form onSubmit={submit} className="mt-8 flex flex-col gap-4">{mode === 'signup' && <label className="flex flex-col gap-2 text-sm font-medium">Username<input required value={username} onChange={e => setUsername(e.target.value)} className="h-11 rounded-xl border border-border bg-background px-3 outline-none ring-primary focus:ring-2" placeholder="Nama pengguna" /></label>}<label className="flex flex-col gap-2 text-sm font-medium">Email<input required type="email" value={email} onChange={e => setEmail(e.target.value)} className="h-11 rounded-xl border border-border bg-background px-3 outline-none ring-primary focus:ring-2" placeholder="nama@contoh.com" /></label>{mode !== 'reset' && <label className="flex flex-col gap-2 text-sm font-medium">Password<div className="relative"><input required type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} className="h-11 w-full rounded-xl border border-border bg-background px-3 pr-11 outline-none ring-primary focus:ring-2" placeholder="Masukkan password" /><button type="button" onClick={() => setShowPassword(value => !value)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}>{showPassword ? <EyeOff /> : <Eye />}</button></div>{mode === 'signup' && <><div className="flex gap-1">{[0,1,2,3,4].map(item => <span key={item} className={`h-1.5 flex-1 rounded-full ${item < score ? 'bg-primary' : 'bg-muted'}`} />)}</div><span className="text-xs text-muted-foreground">{score === 5 ? 'Password kuat' : 'Gunakan &gt;6 karakter, huruf besar-kecil, angka, dan simbol.'}</span></>}</label>}{error && <p role="alert" className="text-sm text-destructive">{error}</p>}{message && <p role="status" className="text-sm text-emerald-600">{message}</p>}<button type="submit" className="h-11 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition hover:opacity-90">{mode === 'login' ? 'Masuk' : mode === 'signup' ? 'Daftar' : 'Kirim tautan reset'}</button></form><div className="mt-6 flex flex-col gap-3 text-center text-sm text-muted-foreground">{mode === 'login' && <><button onClick={() => setMode('reset')} className="text-primary hover:underline">Lupa password?</button><p>Belum punya akun? <button onClick={() => setMode('signup')} className="font-medium text-primary hover:underline">Daftar</button></p></>}{mode === 'signup' && <p>Sudah punya akun? <button onClick={() => setMode('login')} className="font-medium text-primary hover:underline">Masuk</button></p>}{mode === 'reset' && <button onClick={() => setMode('login')} className="font-medium text-primary hover:underline">Kembali ke login</button>}</div><Link href="/" className="mt-8 block text-center text-xs text-muted-foreground hover:text-foreground">Kembali ke dashboard</Link></div></section></div></main>
}

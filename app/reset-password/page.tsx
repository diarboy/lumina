'use client'

import { FormEvent, Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { authClient } from '@/lib/auth-client'

function ResetPasswordForm() {
  const router = useRouter()
  const params = useSearchParams()
  const token = params.get('token') ?? ''
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    if (password.length <= 6 || !/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/\d/.test(password) || !/[^A-Za-z0-9]/.test(password)) {
      setError('Password harus lebih dari 6 karakter dan memenuhi semua indikator keamanan.')
      return
    }
    const result = await authClient.resetPassword({ newPassword: password, token })
    if (result.error) {
      setError('Tautan reset tidak valid atau sudah kedaluwarsa.')
      return
    }
    setMessage('Password berhasil diperbarui.')
    setTimeout(() => router.push('/login'), 800)
  }

  return <form onSubmit={submit} className="flex w-full max-w-md flex-col gap-4 rounded-3xl border border-border bg-card p-8 shadow-xl"><h1 className="text-2xl font-semibold">Buat password baru</h1><p className="text-sm text-muted-foreground">Gunakan password kuat dengan huruf besar-kecil, angka, dan simbol.</p><input required type="password" value={password} onChange={e => setPassword(e.target.value)} className="h-11 rounded-xl border border-border bg-background px-3 outline-none ring-primary focus:ring-2" placeholder="Password baru" />{error && <p className="text-sm text-destructive">{error}</p>}{message && <p className="text-sm text-emerald-600">{message}</p>}<button className="h-11 rounded-xl bg-primary font-semibold text-primary-foreground">Simpan password</button></form>
}

export default function ResetPasswordPage() {
  return <main className="flex min-h-screen items-center justify-center bg-background px-5"><Suspense fallback={<div className="text-sm text-muted-foreground">Memuat formulir reset...</div>}><ResetPasswordForm /></Suspense></main>
}

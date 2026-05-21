"use client"

import { useState, useTransition } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"

interface Props {
  fromParam?: string
  initialError?: string
}

export function LoginForm({ fromParam, initialError }: Props) {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState(initialError ?? "")
  const [pending, startTransition] = useTransition()

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim() || !password.trim()) {
      setError("Complete su correo y contraseña.")
      return
    }
    setError("")
    startTransition(async () => {
      const res = await signIn("credentials", {
        email:    email.trim().toLowerCase(),
        password,
        redirect: false,
      })
      if (res?.error) {
        setError("Credenciales incorrectas o sin permiso administrativo.")
        return
      }
      router.replace(fromParam && fromParam.startsWith("/") ? fromParam : "/dashboard")
      router.refresh()
    })
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div>
        <label className="eyebrow block mb-2" style={{ fontSize: 9 }}>
          CORREO ELECTRÓNICO
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => { setEmail(e.target.value); setError("") }}
          autoComplete="email"
          autoFocus
          className="w-full bg-transparent text-white text-[16px] py-2
                     border-b border-[var(--color-border)]
                     outline-none focus:border-[var(--color-gold)]
                     transition-colors"
          placeholder="correo@gutierrezolivaabogados.com"
        />
      </div>

      <div>
        <label className="eyebrow block mb-2" style={{ fontSize: 9 }}>
          CONTRASEÑA
        </label>
        <div className="flex items-center border-b border-[var(--color-border)]">
          <input
            type={showPass ? "text" : "password"}
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError("") }}
            autoComplete="current-password"
            className="flex-1 bg-transparent text-white text-[16px] py-2 outline-none"
            placeholder="••••••••"
          />
          <button
            type="button"
            onClick={() => setShowPass((v) => !v)}
            className="text-silver text-[11px] uppercase tracking-[1.5px] px-2"
          >
            {showPass ? "Ocultar" : "Ver"}
          </button>
        </div>
      </div>

      {!!error && (
        <p className="text-[var(--color-error)] text-[13px]">{error}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full h-[52px] bg-wine text-white
                   font-sans font-semibold text-[13px] uppercase tracking-[2px]
                   rounded-[10px] disabled:opacity-50 transition-opacity"
      >
        {pending ? "Ingresando…" : "Ingresar"}
      </button>
    </form>
  )
}

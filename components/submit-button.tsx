"use client"

import { useFormStatus } from "react-dom"

type Variant = "gold" | "ghost" | "wine"

interface Props {
  children: React.ReactNode
  variant?: Variant
  pendingLabel?: string
  className?: string
}

export function SubmitButton({
  children,
  variant = "gold",
  pendingLabel = "Procesando…",
  className = "",
}: Props) {
  const { pending } = useFormStatus()
  const cls = variant === "gold" ? "btn-gold" : variant === "wine" ? "btn-wine" : "btn-ghost"
  return (
    <button type="submit" disabled={pending} className={`${cls} ${className}`}>
      {pending ? pendingLabel : children}
    </button>
  )
}

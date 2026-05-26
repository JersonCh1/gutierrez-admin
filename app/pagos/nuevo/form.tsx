"use client"

import { useState, useTransition } from "react"
import { registrarPagoManual } from "../actions"

const METODOS = [
  { value: "YAPE",      label: "Yape" },
  { value: "BCP",       label: "BCP (cuenta o CCI)" },
  { value: "BBVA",      label: "BBVA" },
  { value: "INTERBANK", label: "Interbank" },
  { value: "EFECTIVO",  label: "Efectivo" },
  { value: "OTRO",      label: "Otro" },
] as const

export function NuevoPagoForm() {
  const [pending, start] = useTransition()
  const [err, setErr] = useState<string | null>(null)

  async function onSubmit(formData: FormData) {
    setErr(null)
    start(async () => {
      const res = await registrarPagoManual(formData)
      if (res && !res.ok) setErr(res.error ?? "Error al registrar pago.")
    })
  }

  return (
    <form action={onSubmit} className="space-y-8 mt-10">
      <div>
        <label htmlFor="concepto" className="field-label">Concepto</label>
        <input id="concepto" name="concepto" required maxLength={200} placeholder="Ej. Consulta inicial · Carlos Mendoza" className="input-editorial" />
      </div>

      <div className="grid grid-cols-2 gap-8">
        <div>
          <label htmlFor="email" className="field-label">Email del cliente</label>
          <input id="email" name="email" type="email" required placeholder="cliente@ejemplo.com" className="input-editorial" />
        </div>
        <div>
          <label htmlFor="monto" className="field-label">Monto (S/)</label>
          <input id="monto" name="monto" required inputMode="decimal" placeholder="200.00" className="input-editorial" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8">
        <div>
          <label htmlFor="metodo" className="field-label">Método de pago</label>
          <select id="metodo" name="metodo" required className="select-editorial">
            {METODOS.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="referencia" className="field-label">Referencia (opcional)</label>
          <input id="referencia" name="referencia" maxLength={120} placeholder="N.º operación, voucher, código" className="input-editorial" />
        </div>
      </div>

      {err && <p className="flash-err">{err}</p>}

      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={pending} className="btn-gold">
          {pending ? "Registrando…" : "Registrar pago"}
        </button>
      </div>
    </form>
  )
}

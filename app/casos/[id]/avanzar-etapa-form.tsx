"use client"

import { useState, useTransition } from "react"
import { avanzarEtapa } from "./actions"

const ETAPAS = [
  { value: "INVESTIGACION_PRELIMINAR",   label: "Investigación preliminar" },
  { value: "INVESTIGACION_PREPARATORIA", label: "Investigación preparatoria" },
  { value: "ETAPA_INTERMEDIA",           label: "Etapa intermedia" },
  { value: "JUZGAMIENTO",                label: "Juzgamiento" },
  { value: "IMPUGNACION",                label: "Impugnación" },
  { value: "EJECUCION_SENTENCIA",        label: "Ejecución de sentencia" },
] as const

type EtapaValue = (typeof ETAPAS)[number]["value"]

interface Props {
  casoId: string
  etapaActual: EtapaValue
}

export function AvanzarEtapaForm({ casoId, etapaActual }: Props) {
  const idx = ETAPAS.findIndex((e) => e.value === etapaActual)
  const siguientes = ETAPAS.slice(idx + 1)
  const [destino, setDestino] = useState<EtapaValue | "">(siguientes[0]?.value ?? "")
  const [open, setOpen] = useState(false)
  const [pending, start] = useTransition()
  const [err, setErr] = useState<string | null>(null)

  if (siguientes.length === 0) {
    return <p className="text-silver text-[13px] italic">Caso en última etapa procesal.</p>
  }

  async function onSubmit(formData: FormData) {
    setErr(null)
    start(async () => {
      const res = await avanzarEtapa(formData)
      if (!res.ok) setErr(res.error ?? "Error al avanzar etapa.")
      else setOpen(false)
    })
  }

  if (!open) {
    return (
      <button type="button" onClick={() => setOpen(true)} className="btn-ghost">
        Avanzar etapa →
      </button>
    )
  }

  return (
    <form action={onSubmit} className="space-y-4 max-w-[440px] border border-[var(--color-border-2)] p-6">
      <input type="hidden" name="casoId" value={casoId} />
      <div>
        <label htmlFor="destino" className="field-label">Avanzar a</label>
        <select
          id="destino"
          name="destino"
          required
          value={destino}
          onChange={(e) => setDestino(e.target.value as EtapaValue)}
          className="select-editorial"
        >
          {siguientes.map((e) => (
            <option key={e.value} value={e.value}>{e.label}</option>
          ))}
        </select>
      </div>
      {err && <p className="flash-err">{err}</p>}
      <div className="flex gap-3">
        <button type="submit" disabled={pending} className="btn-gold">
          {pending ? "Avanzando…" : "Confirmar avance"}
        </button>
        <button type="button" onClick={() => setOpen(false)} disabled={pending} className="btn-ghost">
          Cancelar
        </button>
      </div>
    </form>
  )
}

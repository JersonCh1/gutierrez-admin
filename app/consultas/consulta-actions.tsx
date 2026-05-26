"use client"

import { useState, useTransition } from "react"
import { cancelarConsulta, completarConsulta, confirmarConsulta } from "./actions"

interface Props {
  id: string
  estado: string
  tipo: string
  fechaActualISO: string
}

function defaultDateTime(iso: string) {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) {
    const now = new Date()
    return { date: now.toISOString().slice(0, 10), time: "09:00" }
  }
  // Convertir a hora Lima para los inputs
  const lima = new Date(d.toLocaleString("en-US", { timeZone: "America/Lima" }))
  const yyyy = lima.getFullYear()
  const mm   = String(lima.getMonth() + 1).padStart(2, "0")
  const dd   = String(lima.getDate()).padStart(2, "0")
  const hh   = String(lima.getHours()).padStart(2, "0")
  const min  = String(lima.getMinutes()).padStart(2, "0")
  return { date: `${yyyy}-${mm}-${dd}`, time: `${hh}:${min}` }
}

export function ConsultaActions({ id, estado, tipo, fechaActualISO }: Props) {
  const [open, setOpen] = useState(false)
  const [pending, start] = useTransition()
  const [err, setErr] = useState<string | null>(null)
  const def = defaultDateTime(fechaActualISO)

  if (estado === "CANCELADA" || estado === "COMPLETADA") {
    return <span className="text-silver text-[12px] italic">Sin acciones</span>
  }

  async function onConfirmar(formData: FormData) {
    setErr(null)
    start(async () => {
      const res = await confirmarConsulta(formData)
      if (!res.ok) setErr(res.error ?? "Error al confirmar.")
      else setOpen(false)
    })
  }

  async function onCancelar() {
    if (!confirm("¿Cancelar esta consulta? El cliente recibirá el aviso.")) return
    setErr(null)
    const fd = new FormData(); fd.set("id", id)
    start(async () => {
      const res = await cancelarConsulta(fd)
      if (!res.ok) setErr(res.error ?? "Error al cancelar.")
    })
  }

  async function onCompletar() {
    setErr(null)
    const fd = new FormData(); fd.set("id", id)
    start(async () => {
      const res = await completarConsulta(fd)
      if (!res.ok) setErr(res.error ?? "Error al completar.")
    })
  }

  return (
    <div className="flex flex-col gap-2 items-end">
      {!open ? (
        <div className="flex gap-2 flex-wrap justify-end">
          {estado === "PENDIENTE" && (
            <button onClick={() => setOpen(true)} disabled={pending} className="btn-gold" style={{ padding: "6px 12px", fontSize: 10 }}>
              Confirmar
            </button>
          )}
          {estado === "CONFIRMADA" && (
            <button onClick={onCompletar} disabled={pending} className="btn-ghost" style={{ padding: "6px 12px", fontSize: 10 }}>
              Marcar completada
            </button>
          )}
          {estado !== "CANCELADA" && (
            <button onClick={onCancelar} disabled={pending} className="btn-ghost" style={{ padding: "6px 12px", fontSize: 10 }}>
              Cancelar
            </button>
          )}
        </div>
      ) : (
        <form action={onConfirmar} className="space-y-3 border border-[var(--color-border-2)] p-4 w-[320px]">
          <input type="hidden" name="id" value={id} />
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="field-label">Fecha</label>
              <input type="date" name="fecha" defaultValue={def.date} required className="input-editorial" style={{ fontSize: 13 }} />
            </div>
            <div>
              <label className="field-label">Hora</label>
              <input type="time" name="hora" defaultValue={def.time} required className="input-editorial" style={{ fontSize: 13 }} />
            </div>
          </div>
          {tipo === "VIRTUAL_ZOOM" && (
            <div>
              <label className="field-label">URL Zoom</label>
              <input type="url" name="zoomUrl" placeholder="https://us02web.zoom.us/j/…" className="input-editorial" style={{ fontSize: 13 }} />
            </div>
          )}
          {err && <p className="flash-err">{err}</p>}
          <div className="flex gap-2">
            <button type="submit" disabled={pending} className="btn-gold" style={{ padding: "6px 12px", fontSize: 10 }}>
              {pending ? "Guardando…" : "Confirmar"}
            </button>
            <button type="button" onClick={() => setOpen(false)} disabled={pending} className="btn-ghost" style={{ padding: "6px 12px", fontSize: 10 }}>
              Cerrar
            </button>
          </div>
        </form>
      )}
    </div>
  )
}

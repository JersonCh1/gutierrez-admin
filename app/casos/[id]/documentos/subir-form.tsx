"use client"

import { useRef, useState, useTransition } from "react"
import { subirDocumento } from "./actions"

const TIPOS = [
  { value: "ESCRITO",      label: "Escrito" },
  { value: "RESOLUCION",   label: "Resolución" },
  { value: "NOTIFICACION", label: "Notificación" },
  { value: "OTRO",         label: "Otro" },
] as const

interface Props {
  casoId: string
  demoMode: boolean
}

export function SubirDocumentoForm({ casoId, demoMode }: Props) {
  const ref = useRef<HTMLFormElement>(null)
  const [pending, start] = useTransition()
  const [err, setErr] = useState<string | null>(null)
  const [ok,  setOk]  = useState<string | null>(null)

  async function onSubmit(formData: FormData) {
    setErr(null); setOk(null)
    start(async () => {
      const res = await subirDocumento(formData)
      if (!res.ok) {
        setErr(res.error ?? "Error al subir documento.")
      } else {
        ref.current?.reset()
        setOk(res.demo
          ? "Documento registrado en modo demo. Para guardar el archivo real, configure Cloudflare R2."
          : "Documento subido al expediente.")
      }
    })
  }

  return (
    <form ref={ref} action={onSubmit} className="space-y-6 max-w-[680px]">
      <input type="hidden" name="casoId" value={casoId} />

      {demoMode && (
        <p className="flash-ok" style={{ borderColor: "rgba(205,174,94,0.35)", background: "rgba(205,174,94,0.08)" }}>
          MODO DEMO · Cloudflare R2 no está configurado. El documento se registrará en la base
          de datos pero el archivo no se almacenará. Configure las variables <code>R2_*</code> en producción.
        </p>
      )}

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label htmlFor="tipo" className="field-label">Tipo</label>
          <select id="tipo" name="tipo" required className="select-editorial">
            {TIPOS.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="nombre" className="field-label">Nombre del documento</label>
          <input id="nombre" name="nombre" required maxLength={200} placeholder="Ej. Disposición fiscal n.º 03" className="input-editorial" />
        </div>
      </div>

      <div>
        <label htmlFor="file" className="field-label">Archivo PDF (máx 25 MB)</label>
        <input id="file" name="file" type="file" required accept="application/pdf,.pdf,image/*"
               className="block w-full text-cream text-[13px] py-2 file:mr-4 file:py-2 file:px-4 file:border file:border-[var(--color-border-2)] file:bg-transparent file:text-cream file:cursor-pointer hover:file:border-[var(--color-gold)] hover:file:text-gold" />
      </div>

      {err && <p className="flash-err">{err}</p>}
      {ok  && <p className="flash-ok">{ok}</p>}

      <div>
        <button type="submit" disabled={pending} className="btn-gold">
          {pending ? "Subiendo…" : "Subir documento"}
        </button>
      </div>
    </form>
  )
}

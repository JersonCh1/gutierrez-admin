"use client"

import { useRef, useState, useTransition } from "react"
import { responderMensaje } from "./actions"

interface Props {
  casoId: string
}

export function ResponderForm({ casoId }: Props) {
  const ref = useRef<HTMLFormElement>(null)
  const [pending, start] = useTransition()
  const [err, setErr] = useState<string | null>(null)
  const [ok, setOk] = useState(false)

  async function onSubmit(formData: FormData) {
    setErr(null); setOk(false)
    start(async () => {
      const res = await responderMensaje(formData)
      if (!res.ok) {
        setErr(res.error ?? "Error al enviar mensaje.")
      } else {
        ref.current?.reset()
        setOk(true)
      }
    })
  }

  return (
    <form ref={ref} action={onSubmit} className="space-y-3 max-w-[60ch]">
      <input type="hidden" name="casoId" value={casoId} />
      <div>
        <label htmlFor="contenido" className="field-label">Respuesta del estudio</label>
        <textarea
          id="contenido"
          name="contenido"
          required
          minLength={2}
          maxLength={4000}
          placeholder="Escriba aquí su respuesta al cliente…"
          className="textarea-editorial"
        />
      </div>
      {err && <p className="flash-err">{err}</p>}
      {ok && <p className="flash-ok">Mensaje enviado al cliente.</p>}
      <div>
        <button type="submit" disabled={pending} className="btn-gold">
          {pending ? "Enviando…" : "Enviar respuesta"}
        </button>
      </div>
    </form>
  )
}

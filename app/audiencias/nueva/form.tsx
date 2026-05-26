"use client"

import { useState, useTransition } from "react"
import { crearAudiencia } from "../actions"

interface Props {
  casos: { id: string; label: string }[]
}

const TIPOS = [
  "Audiencia de control",
  "Audiencia de prisión preventiva",
  "Audiencia preliminar",
  "Audiencia de juzgamiento",
  "Audiencia de apelación",
  "Audiencia de tutela de derechos",
  "Otra",
]

export function NuevaAudienciaForm({ casos }: Props) {
  const [pending, start] = useTransition()
  const [err, setErr] = useState<string | null>(null)

  async function onSubmit(formData: FormData) {
    setErr(null)
    start(async () => {
      const res = await crearAudiencia(formData)
      if (res && !res.ok) setErr(res.error ?? "Error al registrar la audiencia.")
    })
  }

  return (
    <form action={onSubmit} className="space-y-8 mt-10">
      <div>
        <label htmlFor="casoId" className="field-label">Caso</label>
        <select id="casoId" name="casoId" required className="select-editorial">
          {casos.map((c) => (
            <option key={c.id} value={c.id}>{c.label}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="tipo" className="field-label">Tipo de audiencia</label>
        <select id="tipo" name="tipo" required className="select-editorial">
          {TIPOS.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      <div>
        <label htmlFor="titulo" className="field-label">Título / asunto</label>
        <input id="titulo" name="titulo" required maxLength={200} placeholder="Ej. Audiencia de control del plazo" className="input-editorial" />
      </div>

      <div className="grid grid-cols-2 gap-8">
        <div>
          <label htmlFor="fecha" className="field-label">Fecha</label>
          <input id="fecha" name="fecha" type="date" required className="input-editorial" />
        </div>
        <div>
          <label htmlFor="hora" className="field-label">Hora (hora Lima)</label>
          <input id="hora" name="hora" type="time" required className="input-editorial" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8">
        <div>
          <label htmlFor="juzgado" className="field-label">Juzgado</label>
          <input id="juzgado" name="juzgado" required maxLength={200} placeholder="Ej. 3.º Juzgado de Investigación Preparatoria" className="input-editorial" />
        </div>
        <div>
          <label htmlFor="sala" className="field-label">Sala (opcional)</label>
          <input id="sala" name="sala" maxLength={80} placeholder="Ej. Sala 2" className="input-editorial" />
        </div>
      </div>

      {err && <p className="flash-err">{err}</p>}

      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={pending} className="btn-gold">
          {pending ? "Registrando…" : "Registrar audiencia"}
        </button>
      </div>
    </form>
  )
}

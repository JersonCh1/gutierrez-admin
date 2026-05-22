import { ClienteShell } from "@/components/cliente-shell"
import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import Link from "next/link"

const MODALIDAD_LABEL: Record<string, string> = {
  GRABADO:      "ON DEMAND",
  ZOOM_EN_VIVO: "EN VIVO",
  HIBRIDO:      "HÍBRIDO",
}

export default async function CursoDetalleCliente({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const curso = await prisma.curso.findUnique({
    where:   { id },
    include: { modulos: { include: { lecciones: true }, orderBy: { orden: "asc" } } },
  })
  if (!curso) notFound()

  const lecciones = curso.modulos.reduce((acc, m) => acc + m.lecciones.length, 0)

  return (
    <ClienteShell active="academia">
      <div className="px-8 py-14 max-w-[820px]">
        <Link href="/cliente/cursos" className="eyebrow text-gold inline-block mb-6" style={{ fontSize: 10 }}>← ACADEMIA</Link>

        <p className="eyebrow eyebrow-gold mb-3" style={{ fontSize: 10 }}>
          {MODALIDAD_LABEL[curso.modalidad] ?? curso.modalidad}
        </p>
        <h1 className="font-serif text-[36px] leading-[40px] text-white">{curso.titulo}</h1>
        <div className="rule-28 mt-4 mb-8" />

        <div className="grid grid-cols-3 gap-8 mb-10">
          {curso.duracionHoras && (
            <div>
              <p className="eyebrow" style={{ fontSize: 9 }}>DURACIÓN</p>
              <p className="text-cream text-[14px] mt-1">{curso.duracionHoras}h</p>
            </div>
          )}
          <div>
            <p className="eyebrow" style={{ fontSize: 9 }}>LECCIONES</p>
            <p className="text-cream text-[14px] mt-1">{lecciones}</p>
          </div>
          <div>
            <p className="eyebrow" style={{ fontSize: 9 }}>CERTIFICADO</p>
            <p className="text-cream text-[14px] mt-1">Incluido</p>
          </div>
        </div>

        <div className="mb-10">
          <p className="font-serif text-[44px] text-gold">S/ {Number(curso.precio).toFixed(0)}</p>
          <p className="text-silver text-[13px] mt-1">Acceso permanente al material</p>
        </div>

        <div className="hairline-h mb-10" />

        {curso.descripcionLarga && (
          <section className="mb-10">
            <p className="eyebrow mb-3">SOBRE EL CURSO</p>
            <p className="text-cream text-[14px] leading-[24px] max-w-[60ch] whitespace-pre-line">
              {curso.descripcionLarga}
            </p>
          </section>
        )}

        {curso.modulos.length > 0 && (
          <section className="mb-10">
            <p className="eyebrow mb-6">TEMARIO DEL CURSO</p>
            <ol className="space-y-8">
              {curso.modulos.map((m, mi) => (
                <li key={m.id}>
                  <p className="eyebrow eyebrow-gold" style={{ fontSize: 9 }}>MÓDULO {mi + 1}</p>
                  <p className="font-serif text-[20px] text-white mt-1">{m.titulo}</p>
                  <p className="text-silver text-[12px] mt-1">{m.lecciones.length} {m.lecciones.length === 1 ? "lección" : "lecciones"}</p>
                </li>
              ))}
            </ol>
          </section>
        )}

        <div className="hairline-h mb-8" />

        <button
          type="button"
          disabled
          className="w-full h-[52px] bg-wine text-white font-sans font-semibold text-[13px]
                     uppercase tracking-[2px] rounded-[10px] disabled:opacity-70"
          title="La inscripción estará habilitada cuando el estudio active las llaves de Culqi"
        >
          Inscribirme · S/ {Number(curso.precio).toFixed(0)}
        </button>
        <p className="text-silver text-[11px] mt-3 text-center">
          Pago en modo demo hasta que el estudio active sus llaves de Culqi en producción.
        </p>
      </div>
    </ClienteShell>
  )
}

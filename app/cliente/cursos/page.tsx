import { ClienteShell } from "@/components/cliente-shell"
import { prisma } from "@/lib/prisma"
import Link from "next/link"

const MODALIDAD_LABEL: Record<string, string> = {
  GRABADO:      "ON DEMAND",
  ZOOM_EN_VIVO: "EN VIVO",
  HIBRIDO:      "HÍBRIDO",
}

export default async function CursosCliente() {
  const cursos = await prisma.curso.findMany({
    where:   { activo: true },
    include: { modulos: { include: { lecciones: true } } },
    orderBy: { createdAt: "desc" },
  })

  return (
    <ClienteShell active="academia">
      <div className="px-8 py-14 max-w-[860px]">
        <p className="eyebrow mb-3" style={{ fontSize: 10 }}>GUTIÉRREZ OLIVA LEGAL TRAINING</p>
        <h1 className="font-serif text-[40px] leading-[44px] text-white">Academia.</h1>
        <div className="rule-28 mt-4 mb-14" />

        {cursos.length === 0 ? (
          <div className="max-w-[55ch]">
            <p className="eyebrow eyebrow-gold mb-2">CATÁLOGO EN PREPARACIÓN</p>
            <p className="text-silver text-[14px] leading-[22px]">
              Estamos finalizando los primeros cursos de la academia. Le avisaremos
              en cuanto haya convocatorias disponibles.
            </p>
          </div>
        ) : (
          <div className="space-y-12">
            {cursos.map((c) => {
              const lecciones = c.modulos.reduce((acc, m) => acc + m.lecciones.length, 0)
              return (
                <Link
                  key={c.id}
                  href={`/cliente/curso/${c.id}`}
                  className="block group pb-10 border-b border-[var(--color-border-2)]"
                >
                  <p className="eyebrow eyebrow-gold mb-3" style={{ fontSize: 10 }}>
                    {MODALIDAD_LABEL[c.modalidad] ?? c.modalidad}
                  </p>
                  <h2 className="font-serif text-[28px] leading-[32px] text-white group-hover:text-cream transition-colors">
                    {c.titulo}
                  </h2>
                  <p className="text-silver text-[14px] leading-[22px] mt-3 max-w-[55ch]">
                    {c.descripcion}
                  </p>
                  <div className="flex items-baseline gap-8 mt-5">
                    <p className="font-serif text-[28px] text-gold">S/ {Number(c.precio).toFixed(0)}</p>
                    {c.duracionHoras && (
                      <p className="text-silver text-[13px]">{c.duracionHoras}h · {lecciones} lecciones</p>
                    )}
                    <p className="text-gold text-[13px] ml-auto">Ver detalle →</p>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </ClienteShell>
  )
}

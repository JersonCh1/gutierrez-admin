import { AdminShell } from "@/components/admin-shell"
import { PageHeader } from "@/components/page-header"
import { EmptyState } from "@/components/empty-state"
import { Forbidden } from "@/components/forbidden"
import { StatPill } from "@/components/stat-pill"
import { prisma } from "@/lib/prisma"
import { requirePermission } from "@/lib/guard"
import { canAny } from "@/lib/permissions"

const MODALIDAD_LABEL: Record<string, string> = {
  GRABADO:      "On demand",
  ZOOM_EN_VIVO: "En vivo (Zoom)",
  HIBRIDO:      "Híbrido",
}

export default async function CursosPage() {
  const g = await requirePermission("cursos.viewAll")
  if (!g.authorized) return <AdminShell active="academia"><Forbidden /></AdminShell>

  const cursos = await prisma.curso.findMany({
    include: {
      modulos:       { include: { lecciones: true } },
      inscripciones: { where: { estado: { in: ["ACTIVA", "COMPLETADA"] } } },
    },
    orderBy: { createdAt: "desc" },
  })

  const activos = cursos.filter((c) => c.activo).length
  const totalInscritos = cursos.reduce((acc, c) => acc + c.inscripciones.length, 0)

  return (
    <AdminShell active="academia">
      <div className="px-10 py-12 max-w-[1280px]">
        <PageHeader
          eyebrow="GUTIÉRREZ OLIVA LEGAL TRAINING"
          title="Academia."
          caption="Catálogo de cursos en vivo y grabados del estudio."
        />

        <div className="grid grid-cols-3 gap-12 mb-14">
          <StatPill label="CURSOS ACTIVOS"   value={activos}        tone="gold" />
          <StatPill label="TOTAL CATÁLOGO"   value={cursos.length} />
          <StatPill label="INSCRITOS TOTAL"  value={totalInscritos} />
        </div>

        {cursos.length === 0 ? (
          <EmptyState
            eyebrow="SIN CURSOS"
            title="El catálogo está vacío."
            description={canAny(g.role, ["cursos.crud"])
              ? "Cree el primer curso desde 'Nuevo curso' arriba a la derecha. Ese curso aparecerá en la app móvil del cliente apenas lo active."
              : "El Socio Director aún no ha publicado cursos en la academia."}
          />
        ) : (
          <div className="space-y-12">
            {cursos.map((c) => {
              const lecciones = c.modulos.reduce((acc, m) => acc + m.lecciones.length, 0)
              return (
                <article key={c.id} className="grid grid-cols-12 gap-8 pb-10 border-b border-[var(--color-border-2)]">
                  <div className="col-span-8">
                    <p className="eyebrow eyebrow-gold mb-3" style={{ fontSize: 10 }}>
                      {MODALIDAD_LABEL[c.modalidad] ?? c.modalidad}
                      {!c.activo && " · BORRADOR"}
                    </p>
                    <h2 className="font-serif text-[26px] leading-[30px] text-white">{c.titulo}</h2>
                    <p className="text-silver text-[14px] leading-[22px] mt-3 max-w-[55ch]">
                      {c.descripcion}
                    </p>
                  </div>
                  <div className="col-span-4 space-y-5">
                    <div>
                      <p className="eyebrow" style={{ fontSize: 9 }}>PRECIO</p>
                      <p className="font-serif text-[28px] text-gold mt-1">S/ {Number(c.precio).toFixed(0)}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="eyebrow" style={{ fontSize: 9 }}>MÓDULOS</p>
                        <p className="text-cream text-[14px] mt-1">{c.modulos.length}</p>
                      </div>
                      <div>
                        <p className="eyebrow" style={{ fontSize: 9 }}>LECCIONES</p>
                        <p className="text-cream text-[14px] mt-1">{lecciones}</p>
                      </div>
                      <div>
                        <p className="eyebrow" style={{ fontSize: 9 }}>HORAS</p>
                        <p className="text-cream text-[14px] mt-1">{c.duracionHoras ?? "—"}</p>
                      </div>
                      <div>
                        <p className="eyebrow" style={{ fontSize: 9 }}>INSCRITOS</p>
                        <p className="text-cream text-[14px] mt-1">{c.inscripciones.length}</p>
                      </div>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </div>
    </AdminShell>
  )
}

import { AdminShell } from "@/components/admin-shell"
import { PageHeader } from "@/components/page-header"
import { EmptyState } from "@/components/empty-state"
import { Forbidden } from "@/components/forbidden"
import { StatPill } from "@/components/stat-pill"
import { prisma } from "@/lib/prisma"
import { requirePermission } from "@/lib/guard"

export default async function AudienciasPage() {
  const g = await requirePermission("audiencias.viewAny")
  if (!g.authorized) return <AdminShell active="audiencias"><Forbidden /></AdminShell>

  const now = new Date()
  const audiencias = await prisma.audiencia.findMany({
    include: { caso: { select: { titulo: true, expediente: true, cliente: { select: { name: true } } } } },
    orderBy: { fecha: "asc" },
    take: 200,
  })

  const futuras = audiencias.filter((a) => a.fecha >= now)
  const proximaSemana = futuras.filter((a) => {
    const diffDays = (a.fecha.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    return diffDays <= 7
  })

  const fmtDate = (d: Date) => d.toLocaleDateString("es-PE", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
  const fmtTime = (d: Date) => d.toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" })

  // Agrupar por mes
  const grouped = new Map<string, typeof audiencias>()
  for (const a of futuras) {
    const key = a.fecha.toLocaleDateString("es-PE", { month: "long", year: "numeric" })
    const list = grouped.get(key) ?? []
    list.push(a)
    grouped.set(key, list)
  }

  return (
    <AdminShell active="audiencias">
      <div className="px-10 py-12 max-w-[1280px]">
        <PageHeader
          eyebrow="CALENDARIO DEL PROCESO"
          title="Audiencias."
          caption="Programación cronológica de todas las audiencias del estudio."
        />

        <div className="grid grid-cols-3 gap-12 mb-14">
          <StatPill label="ESTA SEMANA"        value={proximaSemana.length} tone="gold" />
          <StatPill label="PRÓXIMAS TOTAL"     value={futuras.length} />
          <StatPill label="HISTÓRICO"          value={audiencias.length} />
        </div>

        {futuras.length === 0 ? (
          <EmptyState
            eyebrow="SIN AUDIENCIAS PRÓXIMAS"
            description="No hay audiencias programadas en este momento. Cuando un abogado registre una nueva audiencia desde el detalle del caso, aparecerá aquí."
          />
        ) : (
          <div className="space-y-12">
            {[...grouped.entries()].map(([mes, lista]) => (
              <section key={mes}>
                <p className="eyebrow eyebrow-gold mb-6 capitalize" style={{ fontSize: 11 }}>{mes}</p>
                <div className="space-y-6">
                  {lista.map((a) => (
                    <article key={a.id} className="grid grid-cols-12 gap-8 pb-6 border-b border-[var(--color-border-2)]">
                      <div className="col-span-3">
                        <p className="font-serif text-[22px] text-gold capitalize leading-tight">
                          {fmtDate(a.fecha)}
                        </p>
                        <p className="text-silver text-[14px] mt-1">{fmtTime(a.fecha)} h</p>
                      </div>
                      <div className="col-span-6">
                        <p className="eyebrow" style={{ fontSize: 9 }}>{a.tipo.toUpperCase()}</p>
                        <p className="font-serif text-[18px] text-white mt-1">{a.titulo}</p>
                        <p className="text-silver text-[13px] mt-1">
                          {a.caso.titulo} · {a.caso.cliente.name}
                        </p>
                      </div>
                      <div className="col-span-3">
                        <p className="eyebrow" style={{ fontSize: 9 }}>JUZGADO</p>
                        <p className="text-cream text-[13px] mt-1">{a.juzgado}</p>
                        {a.sala && <p className="text-silver text-[12px] mt-1">Sala {a.sala}</p>}
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </AdminShell>
  )
}

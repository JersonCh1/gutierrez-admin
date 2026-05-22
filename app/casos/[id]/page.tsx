import { AdminShell } from "@/components/admin-shell"
import { Forbidden } from "@/components/forbidden"
import { EmptyState } from "@/components/empty-state"
import { prisma } from "@/lib/prisma"
import { requirePermission } from "@/lib/guard"
import { can } from "@/lib/permissions"
import { notFound } from "next/navigation"
import Link from "next/link"

const ETAPAS = [
  "INVESTIGACION_PRELIMINAR",
  "INVESTIGACION_PREPARATORIA",
  "ETAPA_INTERMEDIA",
  "JUZGAMIENTO",
  "IMPUGNACION",
  "EJECUCION_SENTENCIA",
] as const

const ETAPA_LABEL: Record<string, string> = {
  INVESTIGACION_PRELIMINAR:   "Investigación preliminar",
  INVESTIGACION_PREPARATORIA: "Investigación preparatoria",
  ETAPA_INTERMEDIA:           "Etapa intermedia",
  JUZGAMIENTO:                "Juzgamiento",
  IMPUGNACION:                "Impugnación",
  EJECUCION_SENTENCIA:        "Ejecución de sentencia",
}

export default async function CasoDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const g = await requirePermission("casos.viewAll")
  const onlyOwn = !g.authorized && can(g.role, "casos.viewOwn")
  if (!g.authorized && !onlyOwn) {
    return <AdminShell active="casos"><Forbidden /></AdminShell>
  }

  const caso = await prisma.caso.findUnique({
    where:   { id },
    include: {
      cliente:    { select: { name: true, email: true } },
      documentos: { orderBy: { createdAt: "desc" }, take: 5 },
      audiencias: { orderBy: { fecha: "asc" }, take: 5 },
      mensajes:   { orderBy: { createdAt: "desc" }, take: 3, include: { autor: { select: { name: true } } } },
    },
  })
  if (!caso) notFound()
  if (onlyOwn && caso.abogadoId !== g.session.user.id) {
    return <AdminShell active="casos"><Forbidden /></AdminShell>
  }

  const etapaIndex = ETAPAS.indexOf(caso.etapa)

  return (
    <AdminShell active="casos">
      <div className="px-10 py-12 max-w-[1280px]">
        <Link href="/casos" className="eyebrow text-gold mb-6 inline-block">← TODOS LOS CASOS</Link>

        <header className="mb-10">
          <p className="eyebrow mb-3">EXPEDIENTE</p>
          <p className="text-silver text-[14px] mb-2">{caso.expediente ?? "Sin número de expediente"}</p>
          <h1 className="h1-serif">{caso.titulo}</h1>
          <div className="rule-28 mt-4" />
          <p className="text-silver text-[14px] leading-[22px] mt-4">
            {caso.delito} · Cliente: <span className="text-cream">{caso.cliente.name}</span>
            {caso.juzgado && <> · {caso.juzgado}</>}
          </p>
        </header>

        {/* Timeline editorial */}
        <section className="mb-14">
          <p className="eyebrow mb-6">LÍNEA DE TIEMPO DEL PROCESO</p>
          <ol className="space-y-5">
            {ETAPAS.map((e, i) => {
              const completed = i < etapaIndex
              const active    = i === etapaIndex
              return (
                <li key={e} className="flex items-start gap-4">
                  <div className={`mt-1 w-3 h-3 rounded-full shrink-0 ${
                    completed ? "bg-gold" :
                    active    ? "bg-gold ring-4 ring-[var(--color-border)]" :
                                "bg-surface2 border border-[var(--color-border-2)]"
                  }`} />
                  <div>
                    <p className={`text-[14px] ${
                      active ? "text-gold font-medium" :
                      completed ? "text-cream" :
                                  "text-silver"
                    }`}>
                      {ETAPA_LABEL[e]}
                    </p>
                  </div>
                </li>
              )
            })}
          </ol>
        </section>

        <div className="grid grid-cols-2 gap-14">
          {/* Próximas audiencias */}
          <section>
            <p className="eyebrow mb-4">PRÓXIMAS AUDIENCIAS</p>
            {caso.audiencias.length === 0 ? (
              <p className="text-silver text-[14px]">No hay audiencias programadas.</p>
            ) : (
              <div className="space-y-4">
                {caso.audiencias.map((a) => (
                  <div key={a.id} className="border-b border-[var(--color-border-2)] pb-3">
                    <p className="eyebrow eyebrow-gold" style={{ fontSize: 9 }}>{a.tipo.toUpperCase()}</p>
                    <p className="font-serif text-[18px] text-white capitalize mt-1">
                      {a.fecha.toLocaleDateString("es-PE", { weekday: "long", day: "numeric", month: "long" })}
                    </p>
                    <p className="text-silver text-[13px]">{a.juzgado}</p>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Últimos documentos */}
          <section>
            <p className="eyebrow mb-4">ÚLTIMOS DOCUMENTOS</p>
            {caso.documentos.length === 0 ? (
              <p className="text-silver text-[14px]">No hay documentos en el expediente.</p>
            ) : (
              <div className="space-y-3">
                {caso.documentos.map((d) => (
                  <div key={d.id} className="border-b border-[var(--color-border-2)] pb-3">
                    <p className="eyebrow eyebrow-gold" style={{ fontSize: 9 }}>{d.tipo}</p>
                    <p className="text-cream text-[14px] mt-1">{d.nombre}</p>
                    <p className="text-silver text-[12px]">{d.createdAt.toLocaleDateString("es-PE")}</p>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Mensajes recientes */}
        {can(g.role, "mensajes.view") && (
          <section className="mt-14">
            <p className="eyebrow mb-4">MENSAJES RECIENTES</p>
            {caso.mensajes.length === 0 ? (
              <p className="text-silver text-[14px]">No hay mensajes en este caso.</p>
            ) : (
              <div className="space-y-4 max-w-[60ch]">
                {caso.mensajes.map((m) => (
                  <div key={m.id}>
                    <p className="eyebrow eyebrow-gold" style={{ fontSize: 9 }}>
                      {m.esAbogado ? "EL ESTUDIO" : "EL CLIENTE"} · {m.autor.name}
                    </p>
                    <p className="text-cream text-[14px] leading-[22px] mt-1">{m.contenido}</p>
                    <div className="rule-28 mt-3 opacity-60" />
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {caso.documentos.length === 0 && caso.audiencias.length === 0 && caso.mensajes.length === 0 && (
          <div className="mt-14">
            <EmptyState
              eyebrow="EXPEDIENTE VACÍO"
              description="Este caso fue registrado pero aún no tiene documentos, audiencias ni mensajes asociados."
            />
          </div>
        )}
      </div>
    </AdminShell>
  )
}

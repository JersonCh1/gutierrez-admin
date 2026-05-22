import { AdminShell } from "@/components/admin-shell"
import { PageHeader } from "@/components/page-header"
import { EmptyState } from "@/components/empty-state"
import { Forbidden } from "@/components/forbidden"
import { StatPill } from "@/components/stat-pill"
import { prisma } from "@/lib/prisma"
import { requirePermission } from "@/lib/guard"
import Link from "next/link"

export default async function MensajesPage() {
  const g = await requirePermission("mensajes.view")
  if (!g.authorized) return <AdminShell active="mensajes"><Forbidden /></AdminShell>

  // Si rol = ABOGADO, sólo sus casos
  const casoWhere = g.role === "ABOGADO"
    ? { abogadoId: g.session.user.id }
    : {}

  // Agrupamos por caso: último mensaje + count de no leídos
  const casos = await prisma.caso.findMany({
    where: { ...casoWhere, mensajes: { some: {} } },
    include: {
      cliente:  { select: { name: true } },
      mensajes: {
        orderBy: { createdAt: "desc" },
        take: 1,
        include: { autor: { select: { name: true } } },
      },
      _count:   { select: { mensajes: { where: { leido: false, esAbogado: false } } } },
    },
    orderBy: { updatedAt: "desc" },
    take: 50,
  })

  const totalNoLeidos = casos.reduce((acc, c) => acc + c._count.mensajes, 0)
  const conversaciones = casos.length

  return (
    <AdminShell active="mensajes">
      <div className="px-10 py-12 max-w-[1280px]">
        <PageHeader
          eyebrow="COMUNICACIÓN DIRECTA"
          title="Mensajes."
          caption={g.role === "ABOGADO"
            ? "Hilos abiertos con sus clientes patrocinados."
            : "Bandeja unificada de todas las conversaciones del estudio."}
        />

        <div className="grid grid-cols-2 gap-12 mb-14 max-w-[520px]">
          <StatPill label="CONVERSACIONES"     value={conversaciones} />
          <StatPill label="MENSAJES SIN LEER"  value={totalNoLeidos} tone={totalNoLeidos > 0 ? "gold" : "default"} />
        </div>

        {casos.length === 0 ? (
          <EmptyState
            eyebrow="BANDEJA VACÍA"
            description="No hay mensajes activos entre el estudio y sus clientes. Cuando un cliente escriba desde la app, aparecerá aquí."
          />
        ) : (
          <div className="space-y-6">
            {casos.map((c) => {
              const ult = c.mensajes[0]
              const noLeidos = c._count.mensajes
              return (
                <Link
                  key={c.id}
                  href={`/casos/${c.id}`}
                  className="block pb-6 border-b border-[var(--color-border-2)] hover:bg-surface/30 transition-colors -mx-3 px-3"
                >
                  <div className="grid grid-cols-12 gap-6 items-start">
                    <div className="col-span-4">
                      <p className="eyebrow" style={{ fontSize: 9 }}>
                        {noLeidos > 0 && <span className="text-gold mr-2">● {noLeidos} sin leer</span>}
                        {c.expediente ?? "Sin expediente"}
                      </p>
                      <p className="font-serif text-[18px] text-white mt-1">{c.titulo}</p>
                      <p className="text-silver text-[13px] mt-1">{c.cliente.name}</p>
                    </div>
                    <div className="col-span-6">
                      <p className="eyebrow eyebrow-gold" style={{ fontSize: 9 }}>
                        {ult.esAbogado ? "EL ESTUDIO" : "EL CLIENTE"} · {ult.autor.name}
                      </p>
                      <p className="text-cream text-[14px] leading-[22px] mt-1 line-clamp-2">
                        {ult.contenido}
                      </p>
                    </div>
                    <div className="col-span-2 text-right">
                      <p className="text-silver text-[12px]">
                        {ult.createdAt.toLocaleDateString("es-PE", { day: "numeric", month: "short" })}
                      </p>
                      <p className="text-silver text-[11px] mt-1">
                        {ult.createdAt.toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </AdminShell>
  )
}

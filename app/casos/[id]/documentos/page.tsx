import Link from "next/link"
import { notFound } from "next/navigation"
import { AdminShell } from "@/components/admin-shell"
import { Forbidden } from "@/components/forbidden"
import { EmptyState } from "@/components/empty-state"
import { prisma } from "@/lib/prisma"
import { requirePermission } from "@/lib/guard"
import { can } from "@/lib/permissions"
import { SubirDocumentoForm } from "./subir-form"
import { R2_DEMO_MODE } from "@/lib/r2"

const TIPO_LABEL: Record<string, string> = {
  ESCRITO:      "Escrito",
  RESOLUCION:   "Resolución",
  NOTIFICACION: "Notificación",
  OTRO:         "Otro",
}

export default async function DocumentosCasoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const g = await requirePermission("casos.viewAll")
  const onlyOwn = !g.authorized && can(g.role, "casos.viewOwn")
  if (!g.authorized && !onlyOwn) return <AdminShell active="casos"><Forbidden /></AdminShell>

  const caso = await prisma.caso.findUnique({
    where: { id },
    select: {
      id: true, titulo: true, expediente: true, abogadoId: true,
      cliente: { select: { name: true } },
      documentos: { orderBy: { createdAt: "desc" } },
    },
  })
  if (!caso) notFound()
  if (onlyOwn && caso.abogadoId !== g.session.user.id) {
    return <AdminShell active="casos"><Forbidden /></AdminShell>
  }

  const puedeSubir = can(g.role, "documentos.upload") ||
    (can(g.role, "documentos.uploadOwn") && caso.abogadoId === g.session.user.id)

  return (
    <AdminShell active="casos">
      <div className="px-10 py-12 max-w-[1080px]">
        <Link href={`/casos/${caso.id}`} className="eyebrow text-gold mb-6 inline-block">← VOLVER AL CASO</Link>

        <header className="mb-10">
          <p className="eyebrow mb-3">EXPEDIENTE DIGITAL</p>
          <p className="text-silver text-[14px] mb-2">{caso.expediente ?? "Sin número de expediente"}</p>
          <h1 className="h1-serif">Documentos · {caso.titulo}</h1>
          <div className="rule-28 mt-4" />
          <p className="text-silver text-[14px] leading-[22px] mt-4">
            Cliente: <span className="text-cream">{caso.cliente.name}</span>
          </p>
        </header>

        {puedeSubir && (
          <section className="mb-14">
            <p className="eyebrow mb-6">SUBIR NUEVO DOCUMENTO</p>
            <SubirDocumentoForm casoId={caso.id} demoMode={R2_DEMO_MODE} />
          </section>
        )}

        <section>
          <p className="eyebrow mb-6">{caso.documentos.length} DOCUMENTO{caso.documentos.length === 1 ? "" : "S"} EN EL EXPEDIENTE</p>
          {caso.documentos.length === 0 ? (
            <EmptyState
              eyebrow="EXPEDIENTE VACÍO"
              description="Aún no hay documentos en este expediente. Suba el primer PDF desde el formulario de arriba."
            />
          ) : (
            <div className="space-y-3">
              {caso.documentos.map((d) => {
                const esDemo = d.url.startsWith("demo://")
                return (
                  <article key={d.id} className="grid grid-cols-12 gap-6 items-center pb-3 border-b border-[var(--color-border-2)]">
                    <div className="col-span-2">
                      <p className="eyebrow eyebrow-gold" style={{ fontSize: 9 }}>{TIPO_LABEL[d.tipo] ?? d.tipo}</p>
                    </div>
                    <div className="col-span-6">
                      <p className="font-serif text-[17px] text-white">{d.nombre}</p>
                      <p className="text-silver text-[12px] mt-1">{d.tamaño ?? ""}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-silver text-[12px]">{d.createdAt.toLocaleDateString("es-PE", { day: "numeric", month: "short", year: "numeric" })}</p>
                    </div>
                    <div className="col-span-2 text-right">
                      {esDemo ? (
                        <span className="text-silver text-[11px] italic">Modo demo</span>
                      ) : (
                        <a href={d.url} target="_blank" rel="noopener noreferrer" className="text-gold text-[12px] underline underline-offset-4">
                          Descargar →
                        </a>
                      )}
                    </div>
                  </article>
                )
              })}
            </div>
          )}
        </section>
      </div>
    </AdminShell>
  )
}

import Link from "next/link"
import { AdminShell } from "@/components/admin-shell"
import { Forbidden } from "@/components/forbidden"
import { PageHeader } from "@/components/page-header"
import { prisma } from "@/lib/prisma"
import { requirePermission } from "@/lib/guard"
import { NuevaAudienciaForm } from "./form"

export default async function NuevaAudienciaPage() {
  const g = await requirePermission("audiencias.crud")
  if (!g.authorized) return <AdminShell active="audiencias"><Forbidden /></AdminShell>

  // ABOGADO solo sus casos; el resto, todos.
  const where = g.role === "ABOGADO" ? { abogadoId: g.session.user.id } : {}
  const casos = await prisma.caso.findMany({
    where: { ...where, estado: { in: ["ACTIVO", "SUSPENDIDO"] } },
    select: { id: true, titulo: true, expediente: true, cliente: { select: { name: true } } },
    orderBy: { updatedAt: "desc" },
    take: 200,
  })

  const opciones = casos.map((c) => ({
    id: c.id,
    label: `${c.expediente ? c.expediente + " · " : ""}${c.titulo} · ${c.cliente.name}`,
  }))

  return (
    <AdminShell active="audiencias">
      <div className="px-10 py-12 max-w-[760px]">
        <Link href="/audiencias" className="eyebrow text-gold mb-6 inline-block">← TODAS LAS AUDIENCIAS</Link>
        <PageHeader
          eyebrow="PROGRAMACIÓN DE AUDIENCIA"
          title="Nueva audiencia."
          caption="Registre la próxima audiencia del proceso. El cliente verá la fecha, hora y juzgado en su app."
        />
        {opciones.length === 0 ? (
          <p className="text-silver text-[14px] mt-8">No tiene casos activos asignados. Cree un caso antes de programar una audiencia.</p>
        ) : (
          <NuevaAudienciaForm casos={opciones} />
        )}
      </div>
    </AdminShell>
  )
}

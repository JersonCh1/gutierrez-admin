import { AdminShell } from "@/components/admin-shell"
import { PageHeader } from "@/components/page-header"
import { EmptyState } from "@/components/empty-state"
import { EditorialTable, type Column } from "@/components/editorial-table"
import { Forbidden } from "@/components/forbidden"
import { StatPill } from "@/components/stat-pill"
import { prisma } from "@/lib/prisma"
import { requirePermission } from "@/lib/guard"
import { can } from "@/lib/permissions"
import { ConsultaActions } from "./consulta-actions"

type Row = {
  id: string
  nombre: string
  email: string
  tipo: string
  fecha: Date
  sede: string | null
  estado: string
}

const ESTADO_LABEL: Record<string, string> = {
  PENDIENTE:   "Pendiente",
  CONFIRMADA:  "Confirmada",
  CANCELADA:   "Cancelada",
  COMPLETADA:  "Completada",
}

const ESTADO_TONE: Record<string, string> = {
  PENDIENTE:   "text-gold",
  CONFIRMADA:  "text-cream",
  CANCELADA:   "text-wine-2",
  COMPLETADA:  "text-silver",
}

const TIPO_LABEL: Record<string, string> = {
  PRESENCIAL:    "Presencial",
  VIRTUAL_ZOOM:  "Virtual (Zoom)",
  EMPRESARIAL:   "Empresarial",
}

export default async function ConsultasPage() {
  const g = await requirePermission("consultas.view")
  if (!g.authorized) return <AdminShell active="consultas"><Forbidden /></AdminShell>

  const consultas = await prisma.consulta.findMany({
    orderBy: { fecha: "desc" },
    take: 200,
  })

  const rows: Row[] = consultas.map((c) => ({
    id:     c.id,
    nombre: c.nombre,
    email:  c.email,
    tipo:   c.tipo,
    fecha:  c.fecha,
    sede:   c.sede,
    estado: c.estado,
  }))

  const pendientes  = rows.filter((r) => r.estado === "PENDIENTE").length
  const confirmadas = rows.filter((r) => r.estado === "CONFIRMADA").length
  const completadas = rows.filter((r) => r.estado === "COMPLETADA").length

  const puedeActuar = can(g.role, "consultas.confirmCancel")

  const columns: Column<Row>[] = [
    { key: "nombre", label: "SOLICITANTE",  className: "col-span-3", render: (r) => <span className="font-serif text-[17px] text-white">{r.nombre}</span> },
    { key: "tipo",   label: "MODALIDAD",    className: "col-span-2", render: (r) => TIPO_LABEL[r.tipo] ?? r.tipo },
    { key: "fecha",  label: "FECHA",        className: puedeActuar ? "col-span-2" : "col-span-3", render: (r) => <span className="text-cream capitalize">{r.fecha.toLocaleDateString("es-PE", { weekday: "long", day: "numeric", month: "long" })}</span> },
    { key: "sede",   label: "SEDE",         className: puedeActuar ? "col-span-1" : "col-span-2", render: (r) => <span className="text-silver">{r.sede ?? "—"}</span> },
    { key: "est",    label: "ESTADO",       className: "col-span-2", render: (r) => <span className={ESTADO_TONE[r.estado]}>{ESTADO_LABEL[r.estado] ?? r.estado}</span> },
    ...(puedeActuar ? [{
      key: "acc", label: "ACCIONES", className: "col-span-2",
      render: (r: Row) => <ConsultaActions id={r.id} estado={r.estado} tipo={r.tipo} fechaActualISO={r.fecha.toISOString()} />,
    } satisfies Column<Row>] : []),
  ]

  return (
    <AdminShell active="consultas">
      <div className="px-10 py-12 max-w-[1280px]">
        <PageHeader
          eyebrow="AGENDAMIENTO DE CONSULTAS"
          title="Consultas."
          caption="Solicitudes de consulta del estudio (S/ 200 por sesión, virtual o presencial, 20–30 minutos)."
        />

        <div className="grid grid-cols-3 gap-12 mb-12">
          <StatPill label="PENDIENTES"  value={pendientes}  tone="gold" />
          <StatPill label="CONFIRMADAS" value={confirmadas} />
          <StatPill label="COMPLETADAS" value={completadas} />
        </div>

        {rows.length === 0 ? (
          <EmptyState
            eyebrow="SIN CONSULTAS"
            title="Aún no hay consultas agendadas."
            description="Cuando un cliente solicite una consulta desde la app o la web, aparecerá aquí lista para confirmar."
          />
        ) : (
          <EditorialTable<Row> rows={rows} columns={columns} rowKey={(r) => r.id} />
        )}
      </div>
    </AdminShell>
  )
}

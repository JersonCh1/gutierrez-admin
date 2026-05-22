import { AdminShell } from "@/components/admin-shell"
import { PageHeader } from "@/components/page-header"
import { EmptyState } from "@/components/empty-state"
import { EditorialTable, type Column } from "@/components/editorial-table"
import { Forbidden } from "@/components/forbidden"
import { StatPill } from "@/components/stat-pill"
import { prisma } from "@/lib/prisma"
import { requirePermission } from "@/lib/guard"

type Row = {
  id: string
  concepto: string
  email: string
  monto: number
  estado: string
  fecha: Date
}

const ESTADO_TONE: Record<string, string> = {
  PENDIENTE:  "text-gold",
  COMPLETADO: "text-cream",
  FALLIDO:    "text-wine-2",
}

export default async function PagosPage() {
  const g = await requirePermission("pagos.view")
  if (!g.authorized) return <AdminShell active="pagos"><Forbidden /></AdminShell>

  const pagos = await prisma.pago.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
  })

  const rows: Row[] = pagos.map((p) => ({
    id:        p.id,
    concepto:  p.concepto,
    email:     p.email,
    monto:     Number(p.monto),
    estado:    p.estado,
    fecha:     p.createdAt,
  }))

  const completados = rows.filter((r) => r.estado === "COMPLETADO")
  const totalRecaudado = completados.reduce((acc, r) => acc + r.monto, 0)
  const ahora = new Date()
  const inicioMes = new Date(ahora.getFullYear(), ahora.getMonth(), 1)
  const delMes = completados.filter((r) => r.fecha >= inicioMes).reduce((acc, r) => acc + r.monto, 0)

  const columns: Column<Row>[] = [
    { key: "concepto", label: "CONCEPTO", className: "col-span-5", render: (r) => <span className="font-serif text-[16px] text-white">{r.concepto}</span> },
    { key: "email",    label: "EMAIL",    className: "col-span-3", render: (r) => <span className="text-silver">{r.email}</span> },
    { key: "monto",    label: "MONTO",    className: "col-span-2", render: (r) => <span className="font-serif text-[18px] text-gold">S/ {r.monto.toFixed(2)}</span> },
    { key: "fecha",    label: "FECHA",    className: "col-span-1", render: (r) => <span className="text-silver text-[12px]">{r.fecha.toLocaleDateString("es-PE", { day: "numeric", month: "short" })}</span> },
    { key: "estado",   label: "ESTADO",   className: "col-span-1", render: (r) => <span className={`text-[12px] ${ESTADO_TONE[r.estado] ?? "text-silver"}`}>{r.estado}</span> },
  ]

  return (
    <AdminShell active="pagos">
      <div className="px-10 py-12 max-w-[1280px]">
        <PageHeader
          eyebrow="MOVIMIENTOS DEL ESTUDIO"
          title="Pagos."
          caption="Movimientos recibidos por Culqi, Yape y BCP. Los pagos manuales se registran desde 'Nuevo pago'."
        />

        <div className="grid grid-cols-3 gap-12 mb-14">
          <StatPill label="RECAUDADO TOTAL" value={`S/ ${totalRecaudado.toFixed(0)}`} tone="gold" />
          <StatPill label="DEL MES"         value={`S/ ${delMes.toFixed(0)}`} />
          <StatPill label="MOVIMIENTOS"     value={rows.length} />
        </div>

        {rows.length === 0 ? (
          <EmptyState
            eyebrow="SIN MOVIMIENTOS"
            title="Aún no hay pagos registrados."
            description="Cuando un cliente complete un pago (consulta o inscripción), aparecerá aquí. También puede registrar pagos manuales desde la opción 'Nuevo pago'."
          />
        ) : (
          <EditorialTable<Row> rows={rows} columns={columns} rowKey={(r) => r.id} />
        )}
      </div>
    </AdminShell>
  )
}

import { AdminShell } from "@/components/admin-shell"
import { PageHeader } from "@/components/page-header"
import { EmptyState } from "@/components/empty-state"
import { EditorialTable, type Column } from "@/components/editorial-table"
import { Forbidden } from "@/components/forbidden"
import { StatPill } from "@/components/stat-pill"
import { prisma } from "@/lib/prisma"
import { requirePermission } from "@/lib/guard"
import { can } from "@/lib/permissions"

type Row = {
  id: string
  expediente: string | null
  titulo: string
  delito: string
  etapa: string
  estado: string
  cliente: string
  updatedAt: Date
}

const ETAPA_LABEL: Record<string, string> = {
  INVESTIGACION_PRELIMINAR:   "Investigación preliminar",
  INVESTIGACION_PREPARATORIA: "Investigación preparatoria",
  ETAPA_INTERMEDIA:           "Etapa intermedia",
  JUZGAMIENTO:                "Juzgamiento",
  IMPUGNACION:                "Impugnación",
  EJECUCION_SENTENCIA:        "Ejecución de sentencia",
}

export default async function CasosPage() {
  const g = await requirePermission("casos.viewAll")
  // Si solo tiene viewOwn (ABOGADO), también permitimos pero filtramos por su userId.
  const onlyOwn = !g.authorized && can(g.role, "casos.viewOwn")
  if (!g.authorized && !onlyOwn) {
    return <AdminShell active="casos"><Forbidden /></AdminShell>
  }

  const where = onlyOwn ? { abogadoId: g.session.user.id } : {}
  const casos = await prisma.caso.findMany({
    where,
    include: { cliente: { select: { name: true } } },
    orderBy: { updatedAt: "desc" },
    take: 100,
  })

  const rows: Row[] = casos.map((c) => ({
    id:         c.id,
    expediente: c.expediente,
    titulo:     c.titulo,
    delito:     c.delito,
    etapa:      c.etapa,
    estado:     c.estado,
    cliente:    c.cliente.name,
    updatedAt:  c.updatedAt,
  }))

  const activos     = rows.filter((r) => r.estado === "ACTIVO").length
  const suspendidos = rows.filter((r) => r.estado === "SUSPENDIDO").length
  const cerrados    = rows.filter((r) => r.estado === "CERRADO").length

  const columns: Column<Row>[] = [
    { key: "exp",    label: "EXPEDIENTE",  className: "col-span-2", render: (r) => <span className="text-silver">{r.expediente ?? "—"}</span> },
    { key: "tit",    label: "CASO",        className: "col-span-4", render: (r) => <span className="font-serif text-[18px] text-white">{r.titulo}</span> },
    { key: "cli",    label: "CLIENTE",     className: "col-span-2", render: (r) => r.cliente },
    { key: "etapa",  label: "ETAPA",       className: "col-span-2", render: (r) => <span className="text-gold">{ETAPA_LABEL[r.etapa] ?? r.etapa}</span> },
    { key: "act",    label: "ACTUALIZADO", className: "col-span-2", render: (r) => <span className="text-silver">{r.updatedAt.toLocaleDateString("es-PE", { day: "numeric", month: "long" })}</span> },
  ]

  return (
    <AdminShell active="casos">
      <div className="px-10 py-12 max-w-[1280px]">
        <PageHeader
          eyebrow="EXPEDIENTES DEL ESTUDIO"
          title="Casos."
          caption={onlyOwn ? "Casos asignados a su cargo." : "Todos los casos vigentes del estudio."}
        />

        <div className="grid grid-cols-3 gap-12 mb-12">
          <StatPill label="ACTIVOS"     value={activos}     tone="gold" />
          <StatPill label="SUSPENDIDOS" value={suspendidos} />
          <StatPill label="CERRADOS"    value={cerrados} />
        </div>

        {rows.length === 0 ? (
          <EmptyState
            eyebrow="SIN CASOS"
            title="Aún no hay expedientes registrados."
            description="Cuando el estudio registre el primer caso desde 'Nuevo caso', aparecerá aquí con su línea de tiempo, audiencias y documentos."
          />
        ) : (
          <EditorialTable<Row>
            rows={rows}
            columns={columns}
            rowKey={(r) => r.id}
            rowHref={(r) => `/casos/${r.id}`}
          />
        )}
      </div>
    </AdminShell>
  )
}

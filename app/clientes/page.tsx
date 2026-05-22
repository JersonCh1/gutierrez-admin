import { AdminShell } from "@/components/admin-shell"
import { PageHeader } from "@/components/page-header"
import { EmptyState } from "@/components/empty-state"
import { EditorialTable, type Column } from "@/components/editorial-table"
import { Forbidden } from "@/components/forbidden"
import { prisma } from "@/lib/prisma"
import { requirePermission } from "@/lib/guard"

type Row = {
  id: string
  name: string
  email: string
  casos: number
  createdAt: Date
}

export default async function ClientesPage() {
  const g = await requirePermission("clientes.crud")
  if (!g.authorized) return <AdminShell active="clientes"><Forbidden /></AdminShell>

  const clientes = await prisma.user.findMany({
    where:   { role: "CLIENTE" },
    select:  {
      id: true, name: true, email: true, createdAt: true,
      _count: { select: { casos: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 200,
  })

  const rows: Row[] = clientes.map((c) => ({
    id:        c.id,
    name:      c.name,
    email:     c.email,
    casos:     c._count.casos,
    createdAt: c.createdAt,
  }))

  const columns: Column<Row>[] = [
    { key: "name",  label: "CLIENTE",          className: "col-span-4", render: (r) => <span className="font-serif text-[18px] text-white">{r.name}</span> },
    { key: "mail",  label: "CORREO",           className: "col-span-4", render: (r) => <span className="text-silver">{r.email}</span> },
    { key: "casos", label: "CASOS ACTIVOS",    className: "col-span-2", render: (r) => <span className="text-gold">{r.casos}</span> },
    { key: "fec",   label: "ALTA",             className: "col-span-2", render: (r) => <span className="text-silver">{r.createdAt.toLocaleDateString("es-PE", { day: "numeric", month: "short", year: "numeric" })}</span> },
  ]

  return (
    <AdminShell active="clientes">
      <div className="px-10 py-12 max-w-[1280px]">
        <PageHeader
          eyebrow="DIRECTORIO DE CLIENTES"
          title="Clientes."
          caption={`${rows.length} cliente${rows.length === 1 ? "" : "s"} registrado${rows.length === 1 ? "" : "s"} en el portal.`}
        />

        {rows.length === 0 ? (
          <EmptyState
            eyebrow="SIN CLIENTES"
            title="Aún no hay clientes registrados."
            description="Cuando el estudio invite a un cliente desde el módulo de casos, su acceso quedará registrado aquí."
          />
        ) : (
          <EditorialTable<Row> rows={rows} columns={columns} rowKey={(r) => r.id} />
        )}
      </div>
    </AdminShell>
  )
}

import { AdminShell } from "@/components/admin-shell"
import { PageHeader } from "@/components/page-header"
import { EmptyState } from "@/components/empty-state"
import { EditorialTable, type Column } from "@/components/editorial-table"
import { Forbidden } from "@/components/forbidden"
import { StatPill } from "@/components/stat-pill"
import { prisma } from "@/lib/prisma"
import { requirePermission } from "@/lib/guard"
import { ROLE_LABEL, type AdminRole } from "@/lib/permissions"

type Row = {
  id: string
  name: string
  email: string
  role: AdminRole
  casos: number
  createdAt: Date
}

const ROLE_TONE: Record<string, string> = {
  SUPERADMIN:      "text-gold",
  ADMIN_OPERATIVO: "text-cream",
  ABOGADO:         "text-cream",
  ASISTENTE:       "text-silver",
}

export default async function EquipoPage() {
  const g = await requirePermission("equipo.view")
  if (!g.authorized) return <AdminShell active="equipo"><Forbidden /></AdminShell>

  const team = await prisma.user.findMany({
    where:   { role: { not: "CLIENTE" } },
    select:  {
      id: true, name: true, email: true, role: true, createdAt: true,
      _count: { select: { casos: true } },
    },
    orderBy: [{ role: "asc" }, { name: "asc" }],
  })

  const rows: Row[] = team.map((u) => ({
    id:        u.id,
    name:      u.name,
    email:     u.email,
    role:      u.role as AdminRole,
    casos:     u._count.casos,
    createdAt: u.createdAt,
  }))

  const counts = {
    SUPERADMIN:      rows.filter((r) => r.role === "SUPERADMIN").length,
    ADMIN_OPERATIVO: rows.filter((r) => r.role === "ADMIN_OPERATIVO").length,
    ABOGADO:         rows.filter((r) => r.role === "ABOGADO").length,
    ASISTENTE:       rows.filter((r) => r.role === "ASISTENTE").length,
  }

  const columns: Column<Row>[] = [
    { key: "name",  label: "NOMBRE",  className: "col-span-4", render: (r) => <span className="font-serif text-[17px] text-white">{r.name}</span> },
    { key: "mail",  label: "CORREO",  className: "col-span-4", render: (r) => <span className="text-silver">{r.email}</span> },
    { key: "role",  label: "ROL",     className: "col-span-2", render: (r) => <span className={ROLE_TONE[r.role]}>{ROLE_LABEL[r.role] ?? r.role}</span> },
    { key: "casos", label: "CASOS",   className: "col-span-1", render: (r) => <span className="text-cream">{r.casos}</span> },
    { key: "fec",   label: "ALTA",    className: "col-span-1", render: (r) => <span className="text-silver text-[12px]">{r.createdAt.toLocaleDateString("es-PE", { day: "numeric", month: "short", year: "2-digit" })}</span> },
  ]

  return (
    <AdminShell active="equipo">
      <div className="px-10 py-12 max-w-[1280px]">
        <PageHeader
          eyebrow="EQUIPO PROFESIONAL"
          title="Equipo."
          caption="Integrantes del estudio y sus roles dentro del sistema."
        />

        <div className="grid grid-cols-4 gap-10 mb-14">
          <StatPill label="DIRECCIÓN"   value={counts.SUPERADMIN}      tone="gold" />
          <StatPill label="ADMINISTRACIÓN" value={counts.ADMIN_OPERATIVO} />
          <StatPill label="ABOGADOS"    value={counts.ABOGADO} />
          <StatPill label="ASISTENTES"  value={counts.ASISTENTE} />
        </div>

        {rows.length === 0 ? (
          <EmptyState eyebrow="SIN INTEGRANTES" description="No hay usuarios con rol administrativo registrados." />
        ) : (
          <EditorialTable<Row> rows={rows} columns={columns} rowKey={(r) => r.id} />
        )}
      </div>
    </AdminShell>
  )
}

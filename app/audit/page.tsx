import { AdminShell } from "@/components/admin-shell"
import { PageHeader } from "@/components/page-header"
import { EmptyState } from "@/components/empty-state"
import { Forbidden } from "@/components/forbidden"
import { requirePermission } from "@/lib/guard"

export default async function AuditPage() {
  const g = await requirePermission("audit.view")
  if (!g.authorized) return <AdminShell active="audit"><Forbidden /></AdminShell>

  return (
    <AdminShell active="audit">
      <div className="px-10 py-12 max-w-[1280px]">
        <PageHeader
          eyebrow="AUDITORÍA DEL SISTEMA"
          title="Auditoría."
          caption="Registro inmutable de las acciones del equipo. Cada acción crítica (avanzar etapa, subir documento, registrar pago) queda guardada con su autor, fecha e IP."
        />

        <EmptyState
          eyebrow="AUDITORÍA EN BLANCO"
          title="Aún no hay eventos registrados."
          description="A medida que el equipo opere el sistema, las acciones quedarán aquí para revisión interna y cumplimiento legal. Retención mínima: 5 años (Ley 29733)."
        />
      </div>
    </AdminShell>
  )
}

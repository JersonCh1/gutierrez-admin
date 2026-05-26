import Link from "next/link"
import { AdminShell } from "@/components/admin-shell"
import { Forbidden } from "@/components/forbidden"
import { PageHeader } from "@/components/page-header"
import { requirePermission } from "@/lib/guard"
import { NuevoPagoForm } from "./form"

export default async function NuevoPagoPage() {
  const g = await requirePermission("pagos.registerManual")
  if (!g.authorized) return <AdminShell active="pagos"><Forbidden /></AdminShell>

  return (
    <AdminShell active="pagos">
      <div className="px-10 py-12 max-w-[680px]">
        <Link href="/pagos" className="eyebrow text-gold mb-6 inline-block">← TODOS LOS MOVIMIENTOS</Link>
        <PageHeader
          eyebrow="REGISTRO MANUAL"
          title="Nuevo pago."
          caption="Para pagos recibidos por Yape, transferencia bancaria, efectivo u otro medio que no pasa por Culqi."
        />
        <NuevoPagoForm />
      </div>
    </AdminShell>
  )
}

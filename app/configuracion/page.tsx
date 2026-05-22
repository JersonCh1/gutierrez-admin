import { AdminShell } from "@/components/admin-shell"
import { PageHeader } from "@/components/page-header"
import { Forbidden } from "@/components/forbidden"
import { prisma } from "@/lib/prisma"
import { requirePermission } from "@/lib/guard"

export default async function ConfiguracionPage() {
  const g = await requirePermission("config.view")
  if (!g.authorized) return <AdminShell active="configuracion"><Forbidden /></AdminShell>

  const sedes = await prisma.sede.findMany({ orderBy: { orden: "asc" } })

  return (
    <AdminShell active="configuracion">
      <div className="px-10 py-12 max-w-[1280px]">
        <PageHeader
          eyebrow="DATOS INSTITUCIONALES"
          title="Configuración."
          caption="Información oficial del estudio que se muestra en la app móvil y en las comunicaciones del cliente."
        />

        {/* Identidad */}
        <section className="mb-14">
          <p className="eyebrow mb-4">IDENTIDAD DEL ESTUDIO</p>
          <div className="grid grid-cols-2 gap-12 max-w-[820px]">
            <Field label="RAZÓN SOCIAL"   value="Estudio Gutiérrez Oliva Abogados SAC" />
            <Field label="RUC"            value="20605678212" />
            <Field label="ESPECIALIDAD"   value="Litigio Penal" />
            <Field label="SLOGAN"         value="Litigio Estratégico" />
            <Field label="WHATSAPP 24 H"  value="+51 969 527 409" />
            <Field label="HORARIO"        value="Lunes a viernes · 08:00 – 18:30" />
            <Field label="EMAIL ESTUDIO"  value="estudio@gutierrezolivaabogados.com" />
            <Field label="EMAIL FUNDADOR" value="lgutierrez@gutierrezolivaabogados.com" />
          </div>
        </section>

        <div className="hairline-h mb-14" />

        {/* Sedes */}
        <section className="mb-14">
          <p className="eyebrow mb-6">SEDES</p>
          {sedes.length === 0 ? (
            <p className="text-silver text-[14px]">
              Aún no hay sedes registradas en la base. Las sedes operativas (Arequipa, Cusco, Juliaca)
              están definidas en <code className="text-cream">constants/firm.ts</code> de la app móvil.
            </p>
          ) : (
            <div className="grid grid-cols-3 gap-8">
              {sedes.map((s) => (
                <article key={s.id} className="border-l border-[var(--color-border)] pl-5">
                  <p className="eyebrow eyebrow-gold mb-2" style={{ fontSize: 10 }}>{s.nombre.toUpperCase()}</p>
                  <p className="font-serif text-[18px] text-white leading-[24px]">{s.direccion}</p>
                  <p className="text-silver text-[13px] mt-3">{s.horario}</p>
                  <p className="text-silver text-[13px]">WhatsApp: {s.whatsapp}</p>
                </article>
              ))}
            </div>
          )}
        </section>

        <div className="hairline-h mb-14" />

        {/* Canales de pago */}
        <section>
          <p className="eyebrow mb-4">CANALES DE PAGO</p>
          <div className="grid grid-cols-3 gap-12 max-w-[820px]">
            <Field label="YAPE"            value="+51 987 604 106" />
            <Field label="BCP CORRIENTE"   value="215-265325-0021" />
            <Field label="CCI INTERBANCARIO" value="002-21500-26532500-21-27" />
          </div>
        </section>
      </div>
    </AdminShell>
  )
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="eyebrow" style={{ fontSize: 9 }}>{label}</p>
      <p className="text-cream text-[15px] mt-1">{value}</p>
    </div>
  )
}

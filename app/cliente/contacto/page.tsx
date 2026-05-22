import { ClienteShell } from "@/components/cliente-shell"
import { FIRM, SEDES } from "@/lib/firm"

export default function ContactoCliente() {
  return (
    <ClienteShell active="contacto">
      <div className="px-8 py-14 max-w-[860px]">
        <p className="eyebrow mb-3" style={{ fontSize: 10 }}>CONTACTO Y SEDES</p>
        <h1 className="font-serif text-[40px] leading-[44px] text-white">Estamos cerca.</h1>
        <div className="rule-28 mt-4 mb-6" />
        <p className="text-silver text-[14px] leading-[22px] max-w-[55ch]">
          {FIRM.officeHours}. {FIRM.emergencyHours}.
        </p>

        {/* Contacto directo */}
        <section className="mt-12 mb-12">
          <p className="eyebrow mb-4">CONTACTO DIRECTO</p>
          <div className="space-y-1">
            <a
              href={FIRM.whatsapp.url}
              target="_blank"
              rel="noopener"
              className="flex items-center justify-between py-3 border-b border-[var(--color-border-2)] hover:bg-surface/30 px-2 -mx-2 transition-colors"
            >
              <span className="text-white text-[14px]">WhatsApp del estudio</span>
              <span className="text-silver text-[13px]">{FIRM.whatsapp.display}</span>
            </a>
            <a
              href={`mailto:${FIRM.emails.estudio}`}
              className="flex items-center justify-between py-3 border-b border-[var(--color-border-2)] hover:bg-surface/30 px-2 -mx-2 transition-colors"
            >
              <span className="text-white text-[14px]">Administración</span>
              <span className="text-silver text-[13px]">{FIRM.emails.estudio}</span>
            </a>
            <a
              href={`mailto:${FIRM.emails.fundador}`}
              className="flex items-center justify-between py-3 hover:bg-surface/30 px-2 -mx-2 transition-colors"
            >
              <span className="text-white text-[14px]">Dr. Luis Gutiérrez Oliva</span>
              <span className="text-silver text-[13px]">{FIRM.emails.fundador}</span>
            </a>
          </div>
        </section>

        {/* Sedes */}
        <section className="mb-12">
          <p className="eyebrow mb-6">SEDES</p>
          <div className="grid grid-cols-3 gap-8">
            {SEDES.map((s) => (
              <article key={s.key} className="border-l border-[var(--color-border)] pl-5">
                <p className="eyebrow eyebrow-gold mb-2" style={{ fontSize: 10 }}>
                  {s.city.toUpperCase()}
                  {s.status === "PROXIMA" && <span className="text-silver"> · PRÓXIMA</span>}
                </p>
                <p className="font-serif text-[17px] text-white leading-[22px]">{s.address}</p>
                {s.district && <p className="text-silver text-[12px] mt-2">{s.district}</p>}
                <div className="hairline-h mt-4 mb-4" />
                <p className="text-silver text-[12px]">{FIRM.officeHours}</p>
                <p className="text-silver text-[12px]">{FIRM.emergencyHours}</p>
                {s.maps && (
                  <a href={s.maps} target="_blank" rel="noopener" className="inline-block mt-4 text-gold text-[13px]">
                    Cómo llegar →
                  </a>
                )}
              </article>
            ))}
          </div>
        </section>

        {/* Canales de pago */}
        <section>
          <p className="eyebrow mb-4">CANALES DE PAGO</p>
          <div className="space-y-4 max-w-[440px]">
            <Field label="YAPE" value={FIRM.payments.yape} />
            <div className="hairline-h" />
            <Field label="CUENTA BCP CORRIENTE" value={FIRM.payments.bcp} />
            <div className="hairline-h" />
            <Field label="CCI INTERBANCARIO" value={FIRM.payments.cci} />
          </div>
        </section>

        <div className="text-center mt-16">
          <p className="text-silver text-[10px]">{FIRM.legalName}</p>
          <p className="text-silver text-[10px]">RUC {FIRM.ruc}</p>
        </div>
      </div>
    </ClienteShell>
  )
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="eyebrow" style={{ fontSize: 9 }}>{label}</p>
      <p className="font-serif text-[20px] text-gold mt-1">{value}</p>
    </div>
  )
}

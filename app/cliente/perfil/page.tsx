import { ClienteShell } from "@/components/cliente-shell"
import { auth, signOut } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { FIRM } from "@/lib/firm"
import Link from "next/link"

export default async function PerfilCliente() {
  const session = await auth()
  if (!session?.user) return null

  const [inscripciones, pagos] = await Promise.all([
    prisma.inscripcion.count({ where: { userId: session.user.id, estado: { in: ["ACTIVA", "COMPLETADA"] } } }),
    prisma.pago.count({ where: { email: session.user.email ?? "" } }),
  ])

  const initials = session.user.name?.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase() ?? "??"

  return (
    <ClienteShell active="perfil">
      <div className="px-8 py-14 max-w-[820px]">
        {/* Identidad */}
        <section className="flex flex-col items-center text-center mb-12">
          <div className="w-[72px] h-[72px] rounded-[10px] border border-[var(--color-border)]
                          bg-surface2 flex items-center justify-center
                          font-serif text-gold text-[28px]">
            {initials}
          </div>
          <h1 className="font-serif text-[32px] text-white mt-4">{session.user.name}</h1>
          <p className="text-silver text-[13px] mt-1">{session.user.email}</p>
          <p className="eyebrow eyebrow-gold mt-3" style={{ fontSize: 9 }}>CLIENTE</p>
        </section>

        {/* CTA agendar consulta */}
        <section className="mb-12 text-center">
          <a
            href={FIRM.whatsapp.url}
            target="_blank"
            rel="noopener"
            className="inline-block w-full max-w-[420px] h-[52px] bg-wine text-white
                       font-sans font-semibold text-[13px] uppercase tracking-[1.8px]
                       rounded-[10px] flex items-center justify-center"
          >
            Agendar consulta · S/ {FIRM.consulta.price}
          </a>
          <p className="text-silver text-[12px] mt-3">
            {FIRM.consulta.durationMinutes} min · {FIRM.consulta.modes}
          </p>
        </section>

        {/* Cuenta */}
        <section className="mb-10">
          <p className="eyebrow mb-4">CUENTA</p>
          <div className="space-y-1">
            <Row href="/cliente/caso"   label="Mi caso" />
            <Row href="/cliente/cursos" label="Mis cursos" value={`${inscripciones}`} />
            <Row href="/cliente/cursos" label="Mis certificados" value="0" />
            <Row href="/cliente/cursos" label="Historial de pagos" value={`${pagos} pago${pagos === 1 ? "" : "s"}`} last />
          </div>
        </section>

        {/* El estudio */}
        <section className="mb-10">
          <p className="eyebrow mb-4">EL ESTUDIO</p>
          <div className="space-y-1">
            <Row
              href="/cliente/contacto"
              label="Sedes y contacto"
              value="Arequipa · Cusco · Juliaca"
            />
            <a
              href={FIRM.whatsapp.url}
              target="_blank"
              rel="noopener"
              className="flex items-center justify-between py-3 border-b border-[var(--color-border-2)] hover:bg-surface/30 px-2 -mx-2 transition-colors"
            >
              <span className="text-white text-[14px]">Atención 24h en emergencias</span>
              <span className="text-silver text-[13px]">{FIRM.whatsapp.display}</span>
            </a>
            <a
              href={`mailto:${FIRM.emails.estudio}`}
              className="flex items-center justify-between py-3 hover:bg-surface/30 px-2 -mx-2 transition-colors"
            >
              <span className="text-white text-[14px]">Soporte por correo</span>
              <span className="text-silver text-[13px]">{FIRM.emails.estudio}</span>
            </a>
          </div>
        </section>

        <div className="hairline-h mb-6" />

        <form action={async () => { "use server"; await signOut({ redirectTo: "/login" }) }}>
          <button type="submit" className="text-wine-2 text-[13px] hover:text-wine transition-colors">
            Cerrar sesión
          </button>
        </form>

        <div className="mt-16 text-center">
          <p className="text-silver text-[10px] tracking-[0.3px]">{FIRM.legalName}</p>
          <p className="text-silver text-[10px] tracking-[0.3px]">RUC {FIRM.ruc}</p>
        </div>
      </div>
    </ClienteShell>
  )
}

function Row({ href, label, value, last }: { href: string; label: string; value?: string; last?: boolean }) {
  return (
    <Link
      href={href}
      className={`flex items-center justify-between py-3 ${last ? "" : "border-b border-[var(--color-border-2)]"} hover:bg-surface/30 px-2 -mx-2 transition-colors`}
    >
      <span className="text-white text-[14px]">{label}</span>
      <span className="text-silver text-[13px]">{value ?? "→"}</span>
    </Link>
  )
}

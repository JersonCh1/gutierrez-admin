import { ClienteShell } from "@/components/cliente-shell"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import Link from "next/link"

export default async function AudienciasCliente() {
  const session = await auth()
  if (!session?.user) return null

  const caso = await prisma.caso.findFirst({
    where:   { clienteId: session.user.id },
    include: { audiencias: { orderBy: { fecha: "asc" } } },
  })

  return (
    <ClienteShell active="caso">
      <div className="px-8 py-14 max-w-[820px]">
        <Link href="/cliente/caso" className="eyebrow text-gold inline-block mb-6" style={{ fontSize: 10 }}>← MI CASO</Link>

        <p className="eyebrow mb-3" style={{ fontSize: 10 }}>CALENDARIO DEL PROCESO</p>
        <h1 className="font-serif text-[34px] leading-[38px] text-white">Audiencias.</h1>
        <div className="rule-28 mt-4 mb-12" />

        {!caso?.audiencias.length ? (
          <div className="max-w-[55ch]">
            <p className="eyebrow eyebrow-gold mb-2">SIN AUDIENCIAS PROGRAMADAS</p>
            <p className="text-silver text-[14px] leading-[22px]">
              Cuando el juzgado fije una fecha, aparecerá aquí. Su abogado le avisará
              también por mensaje.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {caso.audiencias.map((a) => (
              <article key={a.id} className="pb-6 border-b border-[var(--color-border-2)]">
                <p className="eyebrow eyebrow-gold mb-2" style={{ fontSize: 10 }}>{a.tipo.toUpperCase()}</p>
                <p className="font-serif text-[22px] text-white capitalize leading-tight">
                  {a.fecha.toLocaleDateString("es-PE", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                </p>
                <p className="text-gold text-[14px] mt-1">
                  {a.fecha.toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" })} h
                </p>
                <p className="text-silver text-[13px] mt-2">{a.juzgado}{a.sala && ` · Sala ${a.sala}`}</p>
                {a.resultado && (
                  <p className="text-cream text-[13px] italic mt-2">{a.resultado}</p>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </ClienteShell>
  )
}

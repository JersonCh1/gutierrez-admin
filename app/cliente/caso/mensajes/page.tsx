import { ClienteShell } from "@/components/cliente-shell"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import Link from "next/link"

export default async function MensajesCliente() {
  const session = await auth()
  if (!session?.user) return null

  const caso = await prisma.caso.findFirst({
    where:   { clienteId: session.user.id },
    include: {
      mensajes: {
        orderBy: { createdAt: "asc" },
        include: { autor: { select: { name: true } } },
      },
    },
  })

  return (
    <ClienteShell active="caso">
      <div className="px-8 py-14 max-w-[760px]">
        <Link href="/cliente/caso" className="eyebrow text-gold inline-block mb-6" style={{ fontSize: 10 }}>← MI CASO</Link>

        <p className="eyebrow mb-3" style={{ fontSize: 10 }}>COMUNICACIÓN DIRECTA</p>
        <h1 className="font-serif text-[34px] leading-[38px] text-white">Mensajes.</h1>
        <div className="rule-28 mt-4 mb-12" />

        {!caso?.mensajes.length ? (
          <div className="max-w-[55ch]">
            <p className="eyebrow eyebrow-gold mb-2">SIN MENSAJES</p>
            <p className="text-silver text-[14px] leading-[22px]">
              Inicie la conversación con su abogado. Le responderá a la brevedad
              durante el horario de oficina.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {caso.mensajes.map((m) => (
              <article
                key={m.id}
                className={`max-w-[82%] p-4 rounded-[12px] border ${
                  m.esAbogado
                    ? "border-[var(--color-border)] bg-surface mr-auto rounded-tl-sm"
                    : "border-[var(--color-border-2)] bg-surface2 ml-auto rounded-tr-sm"
                }`}
              >
                {m.esAbogado && (
                  <p className="eyebrow eyebrow-gold mb-1" style={{ fontSize: 9 }}>
                    SU ABOGADO · {m.autor.name}
                  </p>
                )}
                <p className="text-cream text-[14px] leading-[22px]">{m.contenido}</p>
                <p className="text-silver text-[11px] mt-2">
                  {m.createdAt.toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" })}
                  {" · "}
                  {m.createdAt.toLocaleDateString("es-PE", { day: "numeric", month: "short" })}
                </p>
              </article>
            ))}
          </div>
        )}
      </div>
    </ClienteShell>
  )
}

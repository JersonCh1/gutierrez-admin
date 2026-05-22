import { ClienteShell } from "@/components/cliente-shell"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import Link from "next/link"

const TIPO_LABEL: Record<string, string> = {
  ESCRITO:      "ESCRITO",
  RESOLUCION:   "RESOLUCIÓN",
  NOTIFICACION: "NOTIFICACIÓN",
  OTRO:         "DOCUMENTO",
}

export default async function DocumentosCliente() {
  const session = await auth()
  if (!session?.user) return null

  const caso = await prisma.caso.findFirst({
    where:   { clienteId: session.user.id },
    include: { documentos: { orderBy: { createdAt: "desc" } } },
  })

  return (
    <ClienteShell active="caso">
      <div className="px-8 py-14 max-w-[820px]">
        <Link href="/cliente/caso" className="eyebrow text-gold inline-block mb-6" style={{ fontSize: 10 }}>← MI CASO</Link>

        <p className="eyebrow mb-3" style={{ fontSize: 10 }}>EXPEDIENTE DIGITAL</p>
        <h1 className="font-serif text-[34px] leading-[38px] text-white">Documentos.</h1>
        <div className="rule-28 mt-4 mb-12" />

        {!caso?.documentos.length ? (
          <div className="max-w-[55ch]">
            <p className="eyebrow eyebrow-gold mb-2">SIN DOCUMENTOS</p>
            <p className="text-silver text-[14px] leading-[22px]">
              No hay documentos en su expediente todavía. Cuando el estudio suba
              un escrito, resolución o notificación, aparecerá aquí para descarga.
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            {caso.documentos.map((d) => (
              <a
                key={d.id}
                href={d.url}
                target="_blank"
                rel="noopener"
                className="block py-4 border-b border-[var(--color-border-2)] hover:bg-surface/30 -mx-2 px-2 transition-colors"
              >
                <p className="eyebrow eyebrow-gold mb-1" style={{ fontSize: 9 }}>
                  {TIPO_LABEL[d.tipo] ?? d.tipo}
                </p>
                <p className="text-white text-[15px]">{d.nombre}</p>
                <p className="text-silver text-[12px] mt-1">
                  {d.createdAt.toLocaleDateString("es-PE", { day: "numeric", month: "long", year: "numeric" })}
                  {d.tamaño && ` · ${d.tamaño}`}
                </p>
              </a>
            ))}
          </div>
        )}
      </div>
    </ClienteShell>
  )
}

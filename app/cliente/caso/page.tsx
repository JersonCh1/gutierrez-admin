import { ClienteShell } from "@/components/cliente-shell"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { FIRM } from "@/lib/firm"
import Link from "next/link"

const ETAPAS = [
  "INVESTIGACION_PRELIMINAR",
  "INVESTIGACION_PREPARATORIA",
  "ETAPA_INTERMEDIA",
  "JUZGAMIENTO",
  "IMPUGNACION",
  "EJECUCION_SENTENCIA",
] as const

const ETAPA_LABEL: Record<string, string> = {
  INVESTIGACION_PRELIMINAR:   "Investigación preliminar",
  INVESTIGACION_PREPARATORIA: "Investigación preparatoria",
  ETAPA_INTERMEDIA:           "Etapa intermedia",
  JUZGAMIENTO:                "Juzgamiento",
  IMPUGNACION:                "Impugnación",
  EJECUCION_SENTENCIA:        "Ejecución de sentencia",
}

export default async function MiCaso() {
  const session = await auth()
  if (!session?.user) return null

  const caso = await prisma.caso.findFirst({
    where:    { clienteId: session.user.id },
    include:  {
      audiencias: { where: { fecha: { gte: new Date() } }, orderBy: { fecha: "asc" }, take: 1 },
    },
    orderBy: { updatedAt: "desc" },
  })

  if (!caso) {
    return (
      <ClienteShell active="caso">
        <div className="px-8 py-14 max-w-[760px]">
          <p className="eyebrow mb-3" style={{ fontSize: 10 }}>PORTAL DE CASOS</p>
          <h1 className="font-serif text-[34px] leading-[38px] text-white">¿Aún sin patrocinio?</h1>
          <div className="rule-28 mt-4 mb-6" />
          <p className="text-silver text-[14px] leading-[22px] max-w-[55ch]">
            Agende una consulta de S/ {FIRM.consulta.price}. Cuando su caso quede registrado,
            su expediente y línea de tiempo aparecerán aquí.
          </p>
          <a href={FIRM.whatsapp.url} target="_blank" rel="noopener" className="inline-block mt-6 text-gold text-[14px]">
            Agendar consulta — WhatsApp →
          </a>
        </div>
      </ClienteShell>
    )
  }

  const proxima = caso.audiencias[0]
  const etapaIndex = ETAPAS.indexOf(caso.etapa)

  return (
    <ClienteShell active="caso">
      <div className="px-8 py-14 max-w-[820px]">
        <p className="eyebrow mb-3" style={{ fontSize: 10 }}>PORTAL DE CASOS</p>
        {caso.expediente && <p className="text-silver text-[13px] mb-2">Expediente · {caso.expediente}</p>}
        <h1 className="font-serif text-[32px] leading-[36px] text-white">{caso.titulo}</h1>
        <p className="text-gold text-[14px] font-medium mt-3">{ETAPA_LABEL[caso.etapa]}</p>
        <div className="rule-28 mt-5" />

        {/* PRÓXIMA AUDIENCIA */}
        {proxima && (
          <section className="mt-12">
            <p className="eyebrow mb-3">PRÓXIMA AUDIENCIA</p>
            <p className="font-serif text-[22px] text-gold capitalize">
              {proxima.fecha.toLocaleDateString("es-PE", { weekday: "long", day: "numeric", month: "long" })}
            </p>
            <p className="text-white text-[14px] mt-1">{proxima.tipo}</p>
            <p className="text-silver text-[13px] mt-1">{proxima.juzgado}</p>
            <div className="hairline-h mt-10" />
          </section>
        )}

        {/* TIMELINE */}
        <section className="mt-12">
          <p className="eyebrow mb-6">LÍNEA DE TIEMPO DEL PROCESO</p>
          <ol className="space-y-5">
            {ETAPAS.map((e, i) => {
              const completed = i < etapaIndex
              const active    = i === etapaIndex
              return (
                <li key={e} className="flex items-start gap-4">
                  <div className={`mt-1 w-3 h-3 rounded-full shrink-0 ${
                    completed ? "bg-gold" :
                    active    ? "bg-gold ring-4 ring-[var(--color-border)]" :
                                "bg-surface2 border border-[var(--color-border-2)]"
                  }`} />
                  <p className={`text-[14px] ${
                    active ? "text-gold font-medium" :
                    completed ? "text-cream" : "text-silver"
                  }`}>
                    {ETAPA_LABEL[e]}
                  </p>
                </li>
              )
            })}
          </ol>
        </section>

        <div className="hairline-h mt-12" />

        {/* ACCIONES */}
        <section className="mt-10">
          <p className="eyebrow mb-4">ACCIONES</p>
          <div className="space-y-1">
            <Action href="/cliente/caso/documentos" label="Documentos del expediente" />
            <Action href="/cliente/caso/mensajes"    label="Mensajes con su abogado" />
            <Action href="/cliente/caso/audiencias"  label="Calendario de audiencias" />
            <a
              href={FIRM.whatsapp.url}
              target="_blank"
              rel="noopener"
              className="flex items-center justify-between py-3 border-b border-[var(--color-border-2)] hover:bg-surface/30 px-2 -mx-2 transition-colors"
            >
              <span className="text-white text-[14px]">Llamar al estudio</span>
              <span className="text-silver text-[13px]">{FIRM.whatsapp.display}</span>
            </a>
          </div>
        </section>
      </div>
    </ClienteShell>
  )
}

function Action({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between py-3 border-b border-[var(--color-border-2)] hover:bg-surface/30 px-2 -mx-2 transition-colors"
    >
      <span className="text-white text-[14px]">{label}</span>
      <span className="text-gold text-[14px]">→</span>
    </Link>
  )
}

import { ClienteShell } from "@/components/cliente-shell"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { FIRM } from "@/lib/firm"
import Link from "next/link"

const ETAPA_LABEL: Record<string, string> = {
  INVESTIGACION_PRELIMINAR:   "Investigación preliminar",
  INVESTIGACION_PREPARATORIA: "Investigación preparatoria",
  ETAPA_INTERMEDIA:           "Etapa intermedia",
  JUZGAMIENTO:                "Juzgamiento",
  IMPUGNACION:                "Impugnación",
  EJECUCION_SENTENCIA:        "Ejecución de sentencia",
}

export default async function InicioCliente() {
  const session = await auth()
  if (!session?.user) return null

  const [caso, cursos] = await Promise.all([
    prisma.caso.findFirst({
      where:    { clienteId: session.user.id },
      include:  { audiencias: { where: { fecha: { gte: new Date() } }, orderBy: { fecha: "asc" }, take: 1 } },
      orderBy:  { updatedAt: "desc" },
    }),
    prisma.curso.findMany({
      where:    { activo: true },
      take:     1,
      orderBy:  { createdAt: "desc" },
    }),
  ])

  const cursoDestacado = cursos[0]
  const hora = new Date().getHours()
  const saludo = hora < 12 ? "Buenos días" : hora < 19 ? "Buenas tardes" : "Buenas noches"
  const primerNombre = session.user.name?.split(" ")[0] ?? "Cliente"

  return (
    <ClienteShell active="inicio">
      <div className="px-8 py-14 max-w-[760px]">
        <p className="eyebrow mb-3" style={{ fontSize: 10 }}>ESTUDIO GUTIÉRREZ OLIVA · LITIGIO PENAL</p>
        <p className="text-silver text-[14px] mb-1">{saludo},</p>
        <h1 className="font-serif text-[44px] leading-[48px] text-white">{primerNombre}.</h1>
        <div className="rule-28 mt-5 mb-14" />

        {/* MI CASO */}
        <section className="mb-12">
          <p className="eyebrow mb-4">MI CASO</p>
          {caso ? (
            <Link href="/cliente/caso" className="block group">
              <p className="font-serif text-[26px] text-white leading-[30px] group-hover:text-cream transition-colors">
                {caso.titulo}
              </p>
              <p className="text-gold text-[14px] mt-3 font-medium">
                {ETAPA_LABEL[caso.etapa] ?? caso.etapa}
              </p>
              {caso.expediente && (
                <p className="text-silver text-[13px] mt-1">Expediente · {caso.expediente}</p>
              )}
              <p className="text-gold text-[13px] mt-4">Ver línea de tiempo →</p>
            </Link>
          ) : (
            <div>
              <p className="font-serif text-[24px] text-white">Sin caso activo.</p>
              <p className="text-silver text-[14px] leading-[22px] mt-2">
                Cuando el estudio registre su patrocinio, su expediente aparecerá aquí
                con su línea de tiempo, audiencias y documentos.
              </p>
              <a href={FIRM.whatsapp.url} target="_blank" rel="noopener" className="inline-block mt-4 text-gold text-[14px]">
                Agendar consulta · S/ {FIRM.consulta.price} →
              </a>
            </div>
          )}
        </section>

        <div className="hairline-h mb-12" />

        {/* ACADEMIA */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <p className="eyebrow">ACADEMIA</p>
            <Link href="/cliente/cursos" className="text-gold text-[13px]">Ver catálogo →</Link>
          </div>
          {cursoDestacado ? (
            <Link href={`/cliente/curso/${cursoDestacado.id}`} className="block group">
              <p className="eyebrow eyebrow-gold mb-2" style={{ fontSize: 10 }}>
                {cursoDestacado.modalidad === "GRABADO"      ? "ON DEMAND"
                 : cursoDestacado.modalidad === "ZOOM_EN_VIVO" ? "EN VIVO"
                 : "HÍBRIDO"}
              </p>
              <p className="font-serif text-[24px] text-white leading-[28px] group-hover:text-cream">
                {cursoDestacado.titulo}
              </p>
              <div className="flex items-baseline gap-4 mt-3">
                <p className="font-serif text-[24px] text-gold">S/ {Number(cursoDestacado.precio).toFixed(0)}</p>
                {cursoDestacado.duracionHoras && (
                  <p className="text-silver text-[13px]">{cursoDestacado.duracionHoras} horas de contenido</p>
                )}
              </div>
            </Link>
          ) : (
            <Link href="/cliente/cursos" className="text-gold text-[14px]">Explorar próximas convocatorias →</Link>
          )}
        </section>

        <div className="hairline-h mb-12" />

        {/* SOPORTE */}
        <section>
          <p className="eyebrow mb-4">ATENCIÓN INMEDIATA</p>
          <p className="font-serif text-[20px] text-white">{FIRM.emergencyHours}.</p>
          <p className="text-silver text-[13px] mt-2 leading-[20px]">
            {FIRM.officeHours}. Fuera de horario, escríbanos por WhatsApp.
          </p>
          <a href={FIRM.whatsapp.url} target="_blank" rel="noopener" className="inline-block mt-4 text-gold text-[14px] font-medium">
            {FIRM.whatsapp.display}
          </a>
        </section>
      </div>
    </ClienteShell>
  )
}

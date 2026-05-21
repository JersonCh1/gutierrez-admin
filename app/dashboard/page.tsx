import { AdminShell } from "@/components/admin-shell"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

const ROLE_LABEL: Record<string, string> = {
  SUPERADMIN:       "Socio Director",
  ABOGADO:          "Abogado",
  ASISTENTE:        "Asistente",
  ADMIN_OPERATIVO:  "Administración",
}

export default async function Dashboard() {
  const session = await auth()
  if (!session?.user) return null

  const [casosActivos, audienciasProximas, mensajesNoLeidos, consultasPendientes] = await Promise.all([
    prisma.caso.count({ where: { estado: "ACTIVO" } }),
    prisma.audiencia.count({ where: { fecha: { gte: new Date() } } }),
    prisma.mensaje.count({ where: { leido: false, esAbogado: false } }),
    prisma.consulta.count({ where: { estado: "PENDIENTE" } }),
  ])

  const horaPeru = new Date().toLocaleString("es-PE", { timeZone: "America/Lima", hour: "numeric" })
  const hora = parseInt(horaPeru, 10)
  const saludo = hora < 12 ? "Buenos días" : hora < 19 ? "Buenas tardes" : "Buenas noches"
  const primerNombre = session.user.name?.split(" ")[0] ?? "Doctor"

  return (
    <AdminShell active="dashboard">
      <div className="px-10 py-12 max-w-[1200px]">
        <p className="eyebrow mb-3">SALA DE MANDO</p>
        <h1 className="h1-serif">{saludo}, {primerNombre}.</h1>
        <div className="rule-28 mt-4 mb-8" />
        <p className="text-silver text-[14px] leading-[22px] max-w-[60ch]">
          {ROLE_LABEL[session.user.role] ?? session.user.role} ·{" "}
          {new Date().toLocaleDateString("es-PE", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}.
        </p>

        <div className="grid grid-cols-4 gap-10 mt-14">
          <Kpi label="CASOS ACTIVOS"          value={casosActivos} />
          <Kpi label="AUDIENCIAS PRÓXIMAS"    value={audienciasProximas} />
          <Kpi label="MENSAJES SIN LEER"      value={mensajesNoLeidos} />
          <Kpi label="CONSULTAS PENDIENTES"   value={consultasPendientes} />
        </div>

        <div className="hairline-h mt-16 mb-10" />

        <p className="eyebrow mb-6">PRÓXIMOS PASOS</p>
        <p className="text-silver text-[14px] leading-[22px] max-w-[60ch]">
          Esta es la versión inicial del panel. En las próximas iteraciones se
          incorporarán los módulos de Casos, Mensajes, Audiencias, Consultas y
          Academia, según el plan documentado en{" "}
          <code className="text-cream">ADMIN_PANEL.md</code>.
        </p>
      </div>
    </AdminShell>
  )
}

function Kpi({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <p className="eyebrow mb-3" style={{ fontSize: 10 }}>{label}</p>
      <p className="font-serif text-[44px] leading-none text-white">{value}</p>
      <div className="rule-28 mt-4 opacity-60" />
    </div>
  )
}

import Link from "next/link"
import { auth, signOut } from "@/lib/auth"
import { visibleSections, ROLE_LABEL, type AdminRole } from "@/lib/permissions"

type SectionKey =
  | "dashboard" | "casos" | "clientes" | "consultas"
  | "academia" | "audiencias" | "mensajes" | "pagos"
  | "equipo" | "configuracion" | "audit"

interface SectionDef {
  key: SectionKey
  label: string
  href: string
}

const ALL_SECTIONS: SectionDef[] = [
  { key: "dashboard",     label: "Tablero",         href: "/dashboard" },
  { key: "casos",         label: "Casos",           href: "/casos" },
  { key: "clientes",      label: "Clientes",        href: "/clientes" },
  { key: "consultas",     label: "Consultas",       href: "/consultas" },
  { key: "academia",      label: "Academia",        href: "/cursos" },
  { key: "audiencias",    label: "Audiencias",      href: "/audiencias" },
  { key: "mensajes",      label: "Mensajes",        href: "/mensajes" },
  { key: "pagos",         label: "Pagos",           href: "/pagos" },
  { key: "equipo",        label: "Equipo",          href: "/equipo" },
  { key: "configuracion", label: "Configuración",   href: "/configuracion" },
  { key: "audit",         label: "Auditoría",       href: "/audit" },
]

export async function AdminShell({
  active,
  children,
}: {
  active: SectionKey
  children: React.ReactNode
}) {
  const session = await auth()
  const user = session?.user
  if (!user) return null

  const role = user.role as AdminRole
  const visible = visibleSections(role)
  const sections = ALL_SECTIONS.filter((s) => visible.has(s.key))
  const initials = user.name?.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase() ?? "??"

  return (
    <div className="min-h-screen flex bg-bg text-white">
      <aside className="w-[260px] shrink-0 border-r border-[var(--color-border-2)] flex flex-col px-7 py-9">
        <div className="mb-10">
          <p className="eyebrow eyebrow-gold" style={{ fontSize: 9 }}>SALA DE MANDO</p>
          <div className="rule-28 mt-3" />
          <p className="text-silver text-[10px] tracking-[1.6px] uppercase mt-3 leading-tight">
            Estudio Gutiérrez Oliva
          </p>
        </div>

        <nav className="flex flex-col gap-px">
          {sections.map((s) => {
            const isActive = s.key === active
            return (
              <Link
                key={s.key}
                href={s.href}
                className={`px-3 py-2 text-[14px] transition-colors ${
                  isActive ? "text-gold" : "text-silver hover:text-cream"
                }`}
              >
                {s.label}
              </Link>
            )
          })}
        </nav>

        <div className="mt-auto pt-6 border-t border-[var(--color-border-2)] flex items-center gap-3">
          <div className="w-10 h-10 rounded-[10px] border border-[var(--color-border)] bg-surface2
                          flex items-center justify-center font-serif text-gold text-[16px]">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-[13px] truncate">{user.name}</p>
            <p className="text-silver text-[10px] uppercase tracking-[1.4px] truncate">
              {ROLE_LABEL[role]}
            </p>
          </div>
          <form action={async () => { "use server"; await signOut({ redirectTo: "/login" }) }}>
            <button type="submit" className="text-silver text-[10px] uppercase tracking-[1.5px] hover:text-wine-2 transition-colors">
              Salir
            </button>
          </form>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}

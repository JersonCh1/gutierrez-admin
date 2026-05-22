import Link from "next/link"
import { auth, signOut } from "@/lib/auth"

type ZonaCliente = "inicio" | "caso" | "academia" | "perfil" | "contacto"

const NAV: { key: ZonaCliente; label: string; href: string }[] = [
  { key: "inicio",    label: "Inicio",    href: "/cliente" },
  { key: "caso",      label: "Mi caso",   href: "/cliente/caso" },
  { key: "academia",  label: "Academia",  href: "/cliente/cursos" },
  { key: "contacto",  label: "Contacto",  href: "/cliente/contacto" },
  { key: "perfil",    label: "Perfil",    href: "/cliente/perfil" },
]

export async function ClienteShell({
  active,
  children,
}: {
  active: ZonaCliente
  children: React.ReactNode
}) {
  const session = await auth()
  const user = session?.user
  if (!user) return null

  const initials = user.name?.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase() ?? "??"

  return (
    <div className="min-h-screen bg-bg text-white">
      <header className="border-b border-[var(--color-border-2)]">
        <div className="max-w-[1100px] mx-auto px-8 py-6 flex items-center gap-10">
          <Link href="/cliente" className="flex items-baseline gap-3 shrink-0">
            <span className="eyebrow eyebrow-gold" style={{ fontSize: 10 }}>ESTUDIO GUTIÉRREZ OLIVA</span>
            <span className="text-silver text-[10px] tracking-[1.6px] uppercase">Litigio Penal</span>
          </Link>

          <nav className="flex-1 flex gap-7">
            {NAV.map((n) => (
              <Link
                key={n.key}
                href={n.href}
                className={`text-[13px] transition-colors ${
                  n.key === active
                    ? "text-gold"
                    : "text-silver hover:text-cream"
                }`}
              >
                {n.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-[10px] border border-[var(--color-border)] bg-surface2
                            flex items-center justify-center font-serif text-gold text-[14px]">
              {initials}
            </div>
            <form action={async () => { "use server"; await signOut({ redirectTo: "/login" }) }}>
              <button type="submit" className="text-silver text-[10px] uppercase tracking-[1.5px] hover:text-wine-2 transition-colors">
                Salir
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="max-w-[1100px] mx-auto">
        {children}
      </main>
    </div>
  )
}

import type { NextAuthConfig } from "next-auth"

export type AdminRole = "SUPERADMIN" | "ADMIN_OPERATIVO" | "ABOGADO" | "ASISTENTE"
export type Role = AdminRole | "CLIENTE"

const STAFF_ROLES: Role[] = ["SUPERADMIN", "ADMIN_OPERATIVO", "ABOGADO", "ASISTENTE"]

// Config compartido entre Edge (middleware) y Node (route handlers).
// NO debe importar nada que use APIs de Node como Prisma, fs, etc.
export const authConfig = {
  trustHost: true,
  session: { strategy: "jwt", maxAge: 60 * 60 * 8 },
  pages: { signIn: "/login" },
  providers: [],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = (user as { role: Role }).role
      }
      return token
    },
    async session({ session, token }) {
      session.user.id = token.id as string
      session.user.role = token.role as Role
      return session
    },
  },
} satisfies NextAuthConfig

export function isStaff(role: Role | undefined): boolean {
  if (!role) return false
  return STAFF_ROLES.includes(role)
}

declare module "next-auth" {
  interface Session {
    user: { id: string; role: Role } & import("next-auth").DefaultSession["user"]
  }
  interface User { role: Role }
}

import type { NextAuthConfig } from "next-auth"

export type AdminRole = "SUPERADMIN" | "ADMIN_OPERATIVO" | "ABOGADO" | "ASISTENTE"

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
        token.role = (user as { role: AdminRole }).role
      }
      return token
    },
    async session({ session, token }) {
      session.user.id = token.id as string
      session.user.role = token.role as AdminRole
      return session
    },
  },
} satisfies NextAuthConfig

declare module "next-auth" {
  interface Session {
    user: { id: string; role: AdminRole } & import("next-auth").DefaultSession["user"]
  }
  interface User { role: AdminRole }
}

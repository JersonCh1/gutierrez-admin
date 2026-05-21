import NextAuth, { type DefaultSession } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { prisma } from "./prisma"

export type AdminRole = "SUPERADMIN" | "ABOGADO" | "ASISTENTE" | "ADMIN_OPERATIVO"

declare module "next-auth" {
  interface Session {
    user: { id: string; role: AdminRole } & DefaultSession["user"]
  }
  interface User { role: AdminRole }
}

const ADMIN_ROLES: AdminRole[] = ["SUPERADMIN", "ABOGADO", "ASISTENTE", "ADMIN_OPERATIVO"]

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  session: { strategy: "jwt", maxAge: 60 * 60 * 8 },
  pages: { signIn: "/login" },
  providers: [
    Credentials({
      credentials: {
        email:    { label: "Correo",     type: "email" },
        password: { label: "Contraseña", type: "password" },
      },
      async authorize(creds) {
        const email = (creds?.email as string | undefined)?.trim().toLowerCase()
        const password = creds?.password as string | undefined
        if (!email || !password) return null

        const user = await prisma.user.findUnique({ where: { email } })
        if (!user?.password) return null
        if (!ADMIN_ROLES.includes(user.role as AdminRole)) return null

        const ok = await bcrypt.compare(password, user.password)
        if (!ok) return null

        return {
          id:    user.id,
          email: user.email,
          name:  user.name,
          role:  user.role as AdminRole,
        }
      },
    }),
  ],
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
})

import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { prisma } from "./prisma"
import { authConfig, type AdminRole } from "./auth.config"

const ADMIN_ROLES: AdminRole[] = ["SUPERADMIN", "ADMIN_OPERATIVO", "ABOGADO", "ASISTENTE"]

export { type AdminRole } from "./auth.config"

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
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
})

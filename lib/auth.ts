import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { prisma } from "./prisma"
import { authConfig } from "./auth.config"
import type { Role } from "./auth.config"

// El portal web acepta TODOS los roles. Cada uno se redirige a su zona:
//   CLIENTE                                  → /cliente
//   SUPERADMIN, ADMIN_OPERATIVO, ABOGADO, ASISTENTE → /dashboard
const ACCEPTED_ROLES: Role[] = [
  "SUPERADMIN", "ADMIN_OPERATIVO", "ABOGADO", "ASISTENTE", "CLIENTE",
]

export { type AdminRole, type Role } from "./auth.config"

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
        if (!ACCEPTED_ROLES.includes(user.role as Role)) return null

        const ok = await bcrypt.compare(password, user.password)
        if (!ok) return null

        return {
          id:    user.id,
          email: user.email,
          name:  user.name,
          role:  user.role as Role,
        }
      },
    }),
  ],
})

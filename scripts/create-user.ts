// npx tsx scripts/create-user.ts <email> <password> <name> <role>
// Crea o actualiza un usuario en la base. Idempotente.
import { PrismaClient } from "../lib/generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import bcrypt from "bcryptjs"
import "dotenv/config"

const VALID_ROLES = ["SUPERADMIN", "ADMIN_OPERATIVO", "ABOGADO", "ASISTENTE", "CLIENTE"] as const
type Role = (typeof VALID_ROLES)[number]

async function main() {
  const [, , email, password, name, role] = process.argv

  if (!email || !password || !name || !role) {
    console.error("Uso: npx tsx scripts/create-user.ts <email> <password> <name> <role>")
    console.error("Roles: " + VALID_ROLES.join(", "))
    process.exit(1)
  }
  if (!(VALID_ROLES as readonly string[]).includes(role)) {
    console.error("Rol inválido: " + role)
    process.exit(1)
  }
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL no está definida (revisa .env)")
    process.exit(1)
  }

  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const prisma = new PrismaClient({ adapter } as any)

  const hash = await bcrypt.hash(password, 10)
  const normalizedEmail = email.trim().toLowerCase()

  const user = await prisma.user.upsert({
    where:  { email: normalizedEmail },
    create: { email: normalizedEmail, name, password: hash, role: role as Role },
    update: { name, password: hash, role: role as Role },
    select: { id: true, email: true, name: true, role: true, createdAt: true },
  })

  console.log("\n✓ Usuario listo:")
  console.log(JSON.stringify(user, null, 2))
  await prisma.$disconnect()
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})

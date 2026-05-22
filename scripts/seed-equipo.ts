// npx tsx scripts/seed-equipo.ts
// Idempotente: crea o actualiza los 12 miembros del Estudio Gutiérrez Oliva
// con sus roles según el organigrama proporcionado por el cliente.
import { PrismaClient } from "../lib/generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import bcrypt from "bcryptjs"
import "dotenv/config"

type Role = "SUPERADMIN" | "ADMIN_OPERATIVO" | "ABOGADO" | "ASISTENTE"

interface Miembro {
  email: string
  name: string
  role: Role
  password: string
}

const TEMP_PASS = "Gutierrez2026!"  // todos cambian al primer ingreso

const EQUIPO: Miembro[] = [
  // Socio director (también disponible como SUPERADMIN para gestionar el panel)
  { email: "lgutierrez@gutierrezolivaabogados.com",   name: "Luis Enrique Gutiérrez Oliva",        role: "SUPERADMIN",      password: TEMP_PASS },

  // Administración operativa
  { email: "bruno@gutierrezolivaabogados.com",        name: "Bruno Alejandro Mattos Marchani",     role: "ADMIN_OPERATIVO", password: TEMP_PASS },

  // Abogados
  { email: "jcaceres@gutierrezolivaabogados.com",     name: "Juan Diego Cáceres Núñez del Prado",  role: "ABOGADO",         password: TEMP_PASS },
  { email: "jvera@gutierrezolivaabogados.com",        name: "Jannilson Jesús Vera Chalco",         role: "ABOGADO",         password: TEMP_PASS },
  { email: "pcornejo@gutierrezolivaabogados.com",     name: "Pool Edgar Cornejo Coaquira",         role: "ABOGADO",         password: TEMP_PASS },

  // Asistentes / colaboradores
  { email: "pferia@gutierrezolivaabogados.com",       name: "Paola Gimena Feria Feria",            role: "ASISTENTE",       password: TEMP_PASS },
  { email: "dcespedes@gutierrezolivaabogados.com",    name: "Diego Víctor Céspedes Ordóñez",       role: "ASISTENTE",       password: TEMP_PASS },
  { email: "cgutierrez@gutierrezolivaabogados.com",   name: "Cristian Rodrigo Gutiérrez Quispe",   role: "ASISTENTE",       password: TEMP_PASS },
  { email: "iruiz@gutierrezolivaabogados.com",        name: "Irma Magda Ruiz Phocco",              role: "ASISTENTE",       password: TEMP_PASS },
  { email: "rponce@gutierrezolivaabogados.com",       name: "Rafael Sergio Ponce Paz Oviedo",      role: "ASISTENTE",       password: TEMP_PASS },
  { email: "cancalle@gutierrezolivaabogados.com",     name: "Cristofer Andrés Ancalle Soto",       role: "ASISTENTE",       password: TEMP_PASS },
  { email: "maedo@gutierrezolivaabogados.com",        name: "Margiori Orue Aedo Jarette",          role: "ASISTENTE",       password: TEMP_PASS },
]

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL no está definida (revisa .env)")
    process.exit(1)
  }

  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const prisma = new PrismaClient({ adapter } as any)

  console.log(`\nSembrando ${EQUIPO.length} miembros del estudio…\n`)

  for (const m of EQUIPO) {
    const hash = await bcrypt.hash(m.password, 10)
    const u = await prisma.user.upsert({
      where:  { email: m.email },
      create: { email: m.email, name: m.name, password: hash, role: m.role },
      update: { name: m.name, password: hash, role: m.role },
      select: { email: true, role: true },
    })
    console.log(`  ✓ ${u.role.padEnd(16)} ${u.email}`)
  }

  console.log(`\nPassword temporal para todos: ${TEMP_PASS}`)
  console.log(`Cada usuario debe cambiarla al primer ingreso.\n`)

  await prisma.$disconnect()
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})

# Sala de Mando — Estudio Gutiérrez Oliva

Panel administrativo para el equipo del Estudio Gutiérrez Oliva Abogados.
Se conecta a la misma base de datos Neon que la app móvil del cliente.

## Stack

- **Next.js 16** (App Router)
- **Tailwind v4**
- **NextAuth v5 beta** (Credentials + roles)
- **Prisma 7** con adapter PG sobre **Neon PostgreSQL**
- **TypeScript** estricto

## Lenguaje visual

Mismo sistema "editorial premium" que la app móvil: hairlines dorados,
Cormorant Garamond para títulos, Inter para UI, vino (oxblood) como
único color de acción, sin sombras ni gradientes en componentes.

## Roles

- `SUPERADMIN` — Socio Director
- `ABOGADO` — equipo de abogados litigantes
- `ASISTENTE` — soporte legal
- `ADMIN_OPERATIVO` — administración del estudio

Los usuarios con rol `CLIENTE` no pueden acceder al panel.

## Variables de entorno

```env
DATABASE_URL=postgresql://...        # mismo cluster Neon
AUTH_SECRET=...                      # openssl rand -base64 32
NEXTAUTH_URL=http://localhost:3002   # o el dominio de prod
```

## Desarrollo local

```bash
npm install
npx prisma generate
npm run dev          # corre en http://localhost:3002
```

## Estado del proyecto

Sprint 0 completado: scaffold + auth + dashboard placeholder con KPIs reales.
Resto de módulos según `ADMIN_PANEL.md` del repo de la app móvil.

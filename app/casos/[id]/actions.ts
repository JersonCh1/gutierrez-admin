"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { requirePermission } from "@/lib/guard"

const ETAPAS_ORDER = [
  "INVESTIGACION_PRELIMINAR",
  "INVESTIGACION_PREPARATORIA",
  "ETAPA_INTERMEDIA",
  "JUZGAMIENTO",
  "IMPUGNACION",
  "EJECUCION_SENTENCIA",
] as const

type Etapa = (typeof ETAPAS_ORDER)[number]

const avanzarSchema = z.object({
  casoId: z.string().min(1),
  destino: z.enum(ETAPAS_ORDER),
})

export async function avanzarEtapa(formData: FormData) {
  const parsed = avanzarSchema.safeParse({
    casoId: formData.get("casoId"),
    destino: formData.get("destino"),
  })
  if (!parsed.success) return { ok: false, error: "Datos inválidos." }

  const g = await requirePermission("casos.editEtapa")
  if (!g.authorized) return { ok: false, error: "Sin permiso." }

  const caso = await prisma.caso.findUnique({ where: { id: parsed.data.casoId }, select: { abogadoId: true, etapa: true } })
  if (!caso) return { ok: false, error: "Caso no encontrado." }

  // ABOGADO solo puede mover sus propios casos.
  if (g.role === "ABOGADO" && caso.abogadoId !== g.session.user.id) {
    return { ok: false, error: "Solo el abogado asignado puede avanzar etapa." }
  }

  // No se permite retroceder (decisión de diseño: la línea de tiempo es de proceso).
  const fromIdx = ETAPAS_ORDER.indexOf(caso.etapa as Etapa)
  const toIdx   = ETAPAS_ORDER.indexOf(parsed.data.destino)
  if (toIdx <= fromIdx) return { ok: false, error: "Solo se puede avanzar hacia adelante." }

  await prisma.caso.update({
    where: { id: parsed.data.casoId },
    data:  { etapa: parsed.data.destino },
  })

  revalidatePath(`/casos/${parsed.data.casoId}`)
  revalidatePath(`/casos`)
  return { ok: true }
}

const mensajeSchema = z.object({
  casoId: z.string().min(1),
  contenido: z.string().trim().min(2, "Mensaje muy corto.").max(4000, "Mensaje muy largo."),
})

export async function responderMensaje(formData: FormData) {
  const parsed = mensajeSchema.safeParse({
    casoId: formData.get("casoId"),
    contenido: formData.get("contenido"),
  })
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Datos inválidos." }

  const g = await requirePermission("mensajes.respond")
  if (!g.authorized) return { ok: false, error: "Sin permiso." }

  const caso = await prisma.caso.findUnique({ where: { id: parsed.data.casoId }, select: { abogadoId: true } })
  if (!caso) return { ok: false, error: "Caso no encontrado." }

  if (g.role === "ABOGADO" && caso.abogadoId !== g.session.user.id) {
    return { ok: false, error: "Solo el abogado asignado puede responder en este caso." }
  }

  await prisma.$transaction([
    prisma.mensaje.create({
      data: {
        casoId: parsed.data.casoId,
        autorId: g.session.user.id,
        contenido: parsed.data.contenido,
        esAbogado: true,
        leido: true,
      },
    }),
    // Marcar como leídos los mensajes del cliente al responder.
    prisma.mensaje.updateMany({
      where: { casoId: parsed.data.casoId, esAbogado: false, leido: false },
      data:  { leido: true },
    }),
  ])

  revalidatePath(`/casos/${parsed.data.casoId}`)
  revalidatePath(`/mensajes`)
  return { ok: true }
}

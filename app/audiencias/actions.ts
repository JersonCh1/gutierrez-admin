"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { requirePermission } from "@/lib/guard"

const schema = z.object({
  casoId:  z.string().min(1, "Caso requerido."),
  titulo:  z.string().trim().min(2, "Título requerido.").max(200),
  tipo:    z.string().trim().min(2, "Tipo requerido.").max(80),
  juzgado: z.string().trim().min(2, "Juzgado requerido.").max(200),
  sala:    z.string().trim().max(80).optional(),
  fecha:   z.string().min(10, "Fecha requerida."),
  hora:    z.string().regex(/^\d{2}:\d{2}$/, "Hora inválida."),
})

export async function crearAudiencia(formData: FormData) {
  const parsed = schema.safeParse({
    casoId:  formData.get("casoId"),
    titulo:  formData.get("titulo"),
    tipo:    formData.get("tipo"),
    juzgado: formData.get("juzgado"),
    sala:    formData.get("sala") ?? undefined,
    fecha:   formData.get("fecha"),
    hora:    formData.get("hora"),
  })
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Datos inválidos." }

  const g = await requirePermission("audiencias.crud")
  if (!g.authorized) return { ok: false, error: "Sin permiso." }

  const caso = await prisma.caso.findUnique({ where: { id: parsed.data.casoId }, select: { abogadoId: true } })
  if (!caso) return { ok: false, error: "Caso no encontrado." }
  if (g.role === "ABOGADO" && caso.abogadoId !== g.session.user.id) {
    return { ok: false, error: "Solo el abogado asignado puede registrar audiencias." }
  }

  // Combinamos fecha + hora en la zona horaria de Lima (UTC-5).
  const fecha = new Date(`${parsed.data.fecha}T${parsed.data.hora}:00-05:00`)
  if (Number.isNaN(fecha.getTime())) return { ok: false, error: "Fecha/hora inválida." }

  await prisma.audiencia.create({
    data: {
      casoId:  parsed.data.casoId,
      titulo:  parsed.data.titulo,
      tipo:    parsed.data.tipo,
      juzgado: parsed.data.juzgado,
      sala:    parsed.data.sala?.trim() || null,
      fecha,
    },
  })

  revalidatePath("/audiencias")
  revalidatePath(`/casos/${parsed.data.casoId}`)
  redirect("/audiencias")
}

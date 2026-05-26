"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { requirePermission } from "@/lib/guard"

const confirmarSchema = z.object({
  id:      z.string().min(1),
  fecha:   z.string().min(10, "Fecha requerida."),
  hora:    z.string().regex(/^\d{2}:\d{2}$/, "Hora inválida."),
  zoomUrl: z.string().trim().url("URL de Zoom inválida.").optional().or(z.literal("")),
})

export async function confirmarConsulta(formData: FormData) {
  const parsed = confirmarSchema.safeParse({
    id:      formData.get("id"),
    fecha:   formData.get("fecha"),
    hora:    formData.get("hora"),
    zoomUrl: formData.get("zoomUrl") ?? "",
  })
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Datos inválidos." }

  const g = await requirePermission("consultas.confirmCancel")
  if (!g.authorized) return { ok: false, error: "Sin permiso." }

  const fecha = new Date(`${parsed.data.fecha}T${parsed.data.hora}:00-05:00`)
  if (Number.isNaN(fecha.getTime())) return { ok: false, error: "Fecha/hora inválida." }

  await prisma.consulta.update({
    where: { id: parsed.data.id },
    data: {
      estado:  "CONFIRMADA",
      fecha,
      zoomUrl: parsed.data.zoomUrl?.trim() || null,
    },
  })

  revalidatePath("/consultas")
  return { ok: true }
}

export async function cancelarConsulta(formData: FormData) {
  const id = formData.get("id")
  if (typeof id !== "string" || !id) return { ok: false, error: "Consulta inválida." }

  const g = await requirePermission("consultas.confirmCancel")
  if (!g.authorized) return { ok: false, error: "Sin permiso." }

  await prisma.consulta.update({ where: { id }, data: { estado: "CANCELADA" } })
  revalidatePath("/consultas")
  return { ok: true }
}

export async function completarConsulta(formData: FormData) {
  const id = formData.get("id")
  if (typeof id !== "string" || !id) return { ok: false, error: "Consulta inválida." }

  const g = await requirePermission("consultas.confirmCancel")
  if (!g.authorized) return { ok: false, error: "Sin permiso." }

  await prisma.consulta.update({ where: { id }, data: { estado: "COMPLETADA" } })
  revalidatePath("/consultas")
  return { ok: true }
}

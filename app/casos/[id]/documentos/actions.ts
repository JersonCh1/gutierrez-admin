"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { requirePermission } from "@/lib/guard"
import { can } from "@/lib/permissions"
import { uploadToR2, R2_DEMO_MODE, formatBytes } from "@/lib/r2"

const TIPOS = ["ESCRITO", "RESOLUCION", "NOTIFICACION", "OTRO"] as const
type Tipo = (typeof TIPOS)[number]

const metaSchema = z.object({
  casoId: z.string().min(1),
  tipo:   z.enum(TIPOS),
  nombre: z.string().trim().min(2, "Nombre requerido.").max(200),
})

const MAX_SIZE = 25 * 1024 * 1024 // 25 MB

export async function subirDocumento(formData: FormData) {
  const parsed = metaSchema.safeParse({
    casoId: formData.get("casoId"),
    tipo:   formData.get("tipo"),
    nombre: formData.get("nombre"),
  })
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Datos inválidos." }

  const file = formData.get("file")
  if (!(file instanceof File) || file.size === 0) return { ok: false, error: "Adjunte un archivo." }
  if (file.size > MAX_SIZE) return { ok: false, error: "El archivo no debe superar 25 MB." }

  const g = await requirePermission("documentos.upload")
  const ownPerm = g.authorized || can(g.role, "documentos.uploadOwn")
  if (!ownPerm) return { ok: false, error: "Sin permiso." }

  const caso = await prisma.caso.findUnique({ where: { id: parsed.data.casoId }, select: { abogadoId: true } })
  if (!caso) return { ok: false, error: "Caso no encontrado." }

  // Si solo tiene uploadOwn (ABOGADO), debe ser el abogado asignado.
  if (!g.authorized && caso.abogadoId !== g.session.user.id) {
    return { ok: false, error: "Solo el abogado asignado puede subir documentos a este caso." }
  }

  // Sanitizar nombre del archivo para la key.
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 80)
  const key = `casos/${parsed.data.casoId}/${Date.now()}_${safeName}`

  let url: string
  let size: number
  let demo = false
  try {
    const r = await uploadToR2(file, key)
    url = r.url
    size = r.size
    demo = r.demo
  } catch (e) {
    console.error("[documentos] upload error", e)
    return { ok: false, error: "No se pudo subir el archivo. Reintente en un momento." }
  }

  await prisma.documento.create({
    data: {
      casoId: parsed.data.casoId,
      nombre: parsed.data.nombre,
      tipo:   parsed.data.tipo as Tipo,
      url,
      tamaño: formatBytes(size),
    },
  })

  revalidatePath(`/casos/${parsed.data.casoId}`)
  revalidatePath(`/casos/${parsed.data.casoId}/documentos`)
  return { ok: true, demo }
}

export async function eliminarDocumento(formData: FormData) {
  const id     = formData.get("id")
  const casoId = formData.get("casoId")
  if (typeof id !== "string" || !id || typeof casoId !== "string" || !casoId) {
    return { ok: false, error: "Datos inválidos." }
  }

  const g = await requirePermission("documentos.delete")
  if (!g.authorized) return { ok: false, error: "Sin permiso." }

  await prisma.documento.delete({ where: { id } })
  revalidatePath(`/casos/${casoId}/documentos`)
  return { ok: true }
}

export { R2_DEMO_MODE }

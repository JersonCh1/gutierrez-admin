"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { requirePermission } from "@/lib/guard"

const schema = z.object({
  concepto: z.string().trim().min(2, "Concepto requerido.").max(200),
  email:    z.email("Email inválido."),
  monto:    z.string().regex(/^\d+(\.\d{1,2})?$/, "Monto inválido. Use formato 100 o 100.50."),
  metodo:   z.enum(["YAPE", "BCP", "BBVA", "INTERBANK", "EFECTIVO", "OTRO"]),
  referencia: z.string().trim().max(120).optional(),
})

export async function registrarPagoManual(formData: FormData) {
  const parsed = schema.safeParse({
    concepto:   formData.get("concepto"),
    email:      formData.get("email"),
    monto:      formData.get("monto"),
    metodo:     formData.get("metodo"),
    referencia: formData.get("referencia") ?? undefined,
  })
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Datos inválidos." }

  const g = await requirePermission("pagos.registerManual")
  if (!g.authorized) return { ok: false, error: "Sin permiso." }

  const ref = parsed.data.referencia?.trim()
  const manualId = `manual_${parsed.data.metodo}_${Date.now()}${ref ? "_" + ref.slice(0, 20) : ""}`

  await prisma.pago.create({
    data: {
      culqiChargeId: manualId,
      concepto: `${parsed.data.concepto} · ${parsed.data.metodo}${ref ? " · ref " + ref : ""}`,
      email:    parsed.data.email,
      monto:    parsed.data.monto,
      estado:   "COMPLETADO",
    },
  })

  revalidatePath("/pagos")
  redirect("/pagos")
}

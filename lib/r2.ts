// Cloudflare R2 — modo key-gated.
// Si no hay credenciales, devolvemos URL placeholder y dejamos que la UI
// muestre "modo demo". Cuando el cliente complete las env vars, sube real.

const hasR2 =
  !!process.env.R2_ACCOUNT_ID &&
  !!process.env.R2_ACCESS_KEY_ID &&
  !!process.env.R2_SECRET_ACCESS_KEY &&
  !!process.env.R2_BUCKET &&
  !!process.env.R2_PUBLIC_URL

export const R2_DEMO_MODE = !hasR2

export type R2UploadResult = {
  url: string
  demo: boolean
  size: number
  contentType: string
}

/**
 * Sube un archivo a R2 si las credenciales están presentes, o devuelve
 * una URL demo si no. Cero cambios de código entre demo y producción.
 */
export async function uploadToR2(
  file: File,
  key: string,
): Promise<R2UploadResult> {
  const buf = Buffer.from(await file.arrayBuffer())
  const contentType = file.type || "application/octet-stream"

  if (!hasR2) {
    return {
      url: `demo://r2/${key}`,
      demo: true,
      size: buf.byteLength,
      contentType,
    }
  }

  // Cargamos AWS SDK sólo si efectivamente vamos a usarlo, para no forzar
  // la dependencia en builds que aún no tengan R2 configurado. Si el
  // paquete no está instalado, caemos a modo demo con aviso en consola.
  let s3: { Client: new (cfg: unknown) => { send: (cmd: unknown) => Promise<unknown> }; Put: new (cfg: unknown) => unknown } | null = null
  try {
    // Import dinámico opcional. El módulo se carga si está instalado.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mod: any = await (new Function("m", "return import(m)") as (m: string) => Promise<unknown>)("@aws-sdk/client-s3")
    s3 = { Client: mod.S3Client, Put: mod.PutObjectCommand }
  } catch {
    console.warn("[R2] @aws-sdk/client-s3 no instalado — fallback a demo. Ejecutar: npm i @aws-sdk/client-s3")
  }
  if (!s3) {
    return { url: `demo://r2/${key}`, demo: true, size: buf.byteLength, contentType }
  }

  const client = new s3.Client({
    region: "auto",
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId:     process.env.R2_ACCESS_KEY_ID!,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    },
  })

  await client.send(new s3.Put({
    Bucket: process.env.R2_BUCKET!,
    Key: key,
    Body: buf,
    ContentType: contentType,
  }))

  const base = process.env.R2_PUBLIC_URL!.replace(/\/$/, "")
  return {
    url: `${base}/${key}`,
    demo: false,
    size: buf.byteLength,
    contentType,
  }
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

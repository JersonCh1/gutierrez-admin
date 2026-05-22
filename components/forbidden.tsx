import Link from "next/link"

export function Forbidden() {
  return (
    <div className="px-10 py-20 max-w-[60ch]">
      <p className="eyebrow eyebrow-gold mb-3">SIN PERMISO</p>
      <h1 className="h2-serif">Esta sección no está disponible para su rol.</h1>
      <div className="rule-28 mt-4 mb-6" />
      <p className="text-silver text-[14px] leading-[22px]">
        Si cree que debería tener acceso, hable con el Socio Director del estudio para
        que ajuste sus permisos.
      </p>
      <Link href="/dashboard" className="inline-block mt-6 text-gold text-[13px]">
        ← Volver al tablero
      </Link>
    </div>
  )
}

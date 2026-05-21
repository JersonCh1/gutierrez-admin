import { LoginForm } from "@/components/login-form"

export default function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; error?: string }>
}) {
  return <LoginAsync searchParams={searchParams} />
}

async function LoginAsync({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; error?: string }>
}) {
  const params = await searchParams
  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-[420px]">
        <div className="flex flex-col items-center mb-10">
          <div className="eyebrow eyebrow-gold mb-3">SALA DE MANDO</div>
          <div className="rule-28" />
          <p className="eyebrow mt-3 text-center" style={{ fontSize: 9, letterSpacing: 2 }}>
            ESTUDIO GUTIÉRREZ OLIVA · LITIGIO PENAL
          </p>
        </div>

        <div className="mb-8">
          <p className="eyebrow mb-3">ACCESO ADMINISTRATIVO</p>
          <h1 className="h1-serif">Bienvenido.</h1>
          <div className="rule-28 mt-4" />
          <p className="text-silver text-[14px] leading-[22px] mt-4">
            Esta sala es exclusiva para el equipo del estudio. Si usted es cliente,
            descargue la app móvil.
          </p>
        </div>

        <LoginForm fromParam={params.from} initialError={params.error} />
      </div>
    </main>
  )
}

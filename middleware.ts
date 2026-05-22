import NextAuth from "next-auth"
import { NextResponse } from "next/server"
import { authConfig, isStaff } from "./lib/auth.config"

const { auth } = NextAuth(authConfig)

export default auth((req) => {
  const path = req.nextUrl.pathname
  const isLogin = path.startsWith("/login")
  const isAuthApi = path.startsWith("/api/auth")
  const user = req.auth?.user
  const isAuthed = !!user?.id

  if (!isAuthed && !isLogin && !isAuthApi) {
    const url = req.nextUrl.clone()
    url.pathname = "/login"
    url.searchParams.set("from", path)
    return NextResponse.redirect(url)
  }

  if (isAuthed && isLogin) {
    const url = req.nextUrl.clone()
    url.pathname = isStaff(user?.role) ? "/dashboard" : "/cliente"
    url.search = ""
    return NextResponse.redirect(url)
  }

  // Separar zonas: cliente NO entra a /dashboard ni rutas staff;
  // staff NO debe entrar a /cliente (lo redirigimos a su panel).
  if (isAuthed) {
    const userIsStaff = isStaff(user?.role)
    const inClienteZone = path === "/cliente" || path.startsWith("/cliente/")
    const inStaffZone   = !inClienteZone && !isLogin && !isAuthApi

    if (userIsStaff && inClienteZone) {
      const url = req.nextUrl.clone()
      url.pathname = "/dashboard"
      url.search = ""
      return NextResponse.redirect(url)
    }
    if (!userIsStaff && inStaffZone && path !== "/") {
      const url = req.nextUrl.clone()
      url.pathname = "/cliente"
      url.search = ""
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/((?!_next|favicon\\.ico|public|.*\\.(?:png|jpg|jpeg|svg|webp)).*)"],
}

import NextAuth from "next-auth"
import { NextResponse } from "next/server"
import { authConfig } from "./lib/auth.config"

const { auth } = NextAuth(authConfig)

export default auth((req) => {
  const path = req.nextUrl.pathname
  const isLogin = path.startsWith("/login")
  const isAuthApi = path.startsWith("/api/auth")
  const isAuthed = !!req.auth?.user?.id

  if (!isAuthed && !isLogin && !isAuthApi) {
    const url = req.nextUrl.clone()
    url.pathname = "/login"
    url.searchParams.set("from", path)
    return NextResponse.redirect(url)
  }
  if (isAuthed && isLogin) {
    const url = req.nextUrl.clone()
    url.pathname = "/"
    url.search = ""
    return NextResponse.redirect(url)
  }
  return NextResponse.next()
})

export const config = {
  matcher: ["/((?!_next|favicon\\.ico|public|.*\\.(?:png|jpg|jpeg|svg|webp)).*)"],
}

import { auth } from "./auth"
import { can, type AdminRole, type Action } from "./permissions"
import { redirect } from "next/navigation"

export async function requireAuth() {
  const session = await auth()
  if (!session?.user) redirect("/login")
  return session
}

export async function requirePermission(action: Action) {
  const session = await requireAuth()
  const role = session.user.role as AdminRole
  if (!can(role, action)) {
    return { authorized: false as const, session, role }
  }
  return { authorized: true as const, session, role }
}

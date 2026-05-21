// Matriz de permisos del panel administrativo.
// Todo guard del proyecto se construye contra este archivo —
// nunca hardcodear roles en pages ni en endpoints.

export type AdminRole = "SUPERADMIN" | "ADMIN_OPERATIVO" | "ABOGADO" | "ASISTENTE"

export type Action =
  // Tablero
  | "dashboard.view"
  // Casos
  | "casos.viewAll"          // ver casos de cualquier abogado
  | "casos.viewOwn"          // ver solo casos donde es el abogado asignado
  | "casos.create"
  | "casos.editEtapa"        // avanzar etapa procesal
  | "casos.delete"
  // Documentos del expediente
  | "documentos.viewAny"
  | "documentos.upload"      // a cualquier caso
  | "documentos.uploadOwn"   // solo a casos donde es el abogado
  | "documentos.delete"
  // Mensajes abogado <-> cliente (confidencialidad)
  | "mensajes.view"
  | "mensajes.respond"
  // Audiencias
  | "audiencias.viewAny"
  | "audiencias.crud"
  // Bitácora interna del caso
  | "bitacora.view"
  | "bitacora.write"
  // Clientes
  | "clientes.crud"
  // Consultas (S/200)
  | "consultas.view"
  | "consultas.confirmCancel"
  | "consultas.schedule"     // solo agendar fecha
  // Pagos
  | "pagos.view"
  | "pagos.registerManual"
  // Academia
  | "cursos.viewAll"
  | "cursos.crud"
  | "cursos.editOwn"         // solo los cursos que el ABOGADO dicta
  | "cursos.uploadMaterial"
  | "cursos.emitCert"
  // Equipo
  | "equipo.view"
  | "equipo.crud"
  | "equipo.assignRole"
  // Configuración del estudio
  | "config.view"
  | "config.edit"
  // Auditoría
  | "audit.view"

const PERMISSIONS: Record<AdminRole, Set<Action>> = {
  SUPERADMIN: new Set<Action>([
    "dashboard.view",
    "casos.viewAll", "casos.create", "casos.editEtapa", "casos.delete",
    "documentos.viewAny", "documentos.upload", "documentos.delete",
    "mensajes.view", "mensajes.respond",
    "audiencias.viewAny", "audiencias.crud",
    "bitacora.view", "bitacora.write",
    "clientes.crud",
    "consultas.view", "consultas.confirmCancel", "consultas.schedule",
    "pagos.view", "pagos.registerManual",
    "cursos.viewAll", "cursos.crud", "cursos.uploadMaterial", "cursos.emitCert",
    "equipo.view", "equipo.crud", "equipo.assignRole",
    "config.view", "config.edit",
    "audit.view",
  ]),

  ADMIN_OPERATIVO: new Set<Action>([
    "dashboard.view",
    // SIN acceso a expedientes por confidencialidad legal.
    "consultas.view", "consultas.confirmCancel", "consultas.schedule",
    "pagos.view", "pagos.registerManual",
    "cursos.viewAll", "cursos.uploadMaterial",
    "equipo.view",
    "config.view",
  ]),

  ABOGADO: new Set<Action>([
    "dashboard.view",
    "casos.viewOwn", "casos.create", "casos.editEtapa",
    "documentos.uploadOwn",
    "mensajes.view", "mensajes.respond",
    "audiencias.viewAny", "audiencias.crud",
    "bitacora.view", "bitacora.write",
    "consultas.view", "consultas.schedule",
    "cursos.viewAll", "cursos.editOwn", "cursos.emitCert",
  ]),

  ASISTENTE: new Set<Action>([
    "dashboard.view",
    "casos.viewAll",
    // SIN mensajes con el cliente — confidencialidad abogado-cliente.
    "documentos.viewAny", "documentos.upload",
    "audiencias.viewAny", "audiencias.crud",
    "consultas.view", "consultas.schedule",
    "cursos.viewAll", "cursos.uploadMaterial",
  ]),
}

export function can(role: AdminRole, action: Action): boolean {
  return PERMISSIONS[role]?.has(action) ?? false
}

export function canAny(role: AdminRole, actions: Action[]): boolean {
  return actions.some((a) => can(role, a))
}

// Helper para mostrar/ocultar items del sidebar
export function visibleSections(role: AdminRole): Set<string> {
  const sections = new Set<string>(["dashboard"])
  if (canAny(role, ["casos.viewAll", "casos.viewOwn"])) sections.add("casos")
  if (can(role, "clientes.crud")) sections.add("clientes")
  if (can(role, "consultas.view")) sections.add("consultas")
  if (canAny(role, ["cursos.viewAll", "cursos.editOwn"])) sections.add("academia")
  if (can(role, "audiencias.viewAny")) sections.add("audiencias")
  if (can(role, "mensajes.view")) sections.add("mensajes")
  if (can(role, "pagos.view")) sections.add("pagos")
  if (can(role, "equipo.view")) sections.add("equipo")
  if (can(role, "config.view")) sections.add("configuracion")
  if (can(role, "audit.view")) sections.add("audit")
  return sections
}

export const ROLE_LABEL: Record<AdminRole, string> = {
  SUPERADMIN:      "Socio Director",
  ADMIN_OPERATIVO: "Administración",
  ABOGADO:         "Abogado",
  ASISTENTE:       "Asistente",
}

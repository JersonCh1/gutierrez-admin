# Guía de Usuario — Estudio Gutiérrez Oliva Abogados

Manual oficial del ecosistema digital del estudio. Compuesto por dos piezas:

1. **App móvil** — Portal del cliente (Android, próximamente iOS).
2. **Sala de Mando** — Panel administrativo del equipo (web).

Ambos comparten la misma base de datos. Todo lo que el equipo registra desde la
Sala de Mando aparece en la app del cliente en tiempo real.

---

## Tabla de contenidos

1. La app móvil para el cliente
2. La Sala de Mando (panel administrativo)
3. Roles y permisos del equipo
4. Acciones disponibles por pantalla
5. Flujos de trabajo más comunes
6. Cuentas DEMO — credenciales por rol para probar
7. Cuentas reales del equipo
8. Preguntas frecuentes
9. Soporte y mantenimiento

---

## 1. La app móvil para el cliente

### Qué es

Una aplicación Android que cada cliente del estudio instala en su teléfono para
seguir su caso en tiempo real, comunicarse con su abogado, ver audiencias,
descargar documentos del expediente y acceder a la academia.

Diseño editorial premium: sobrio, sin colores chillones, con la identidad
"oro + carbón cálido + vino" del estudio.

### Cómo se instala

El estudio envía el archivo `GutierrezOliva-v1.0.0.apk` por WhatsApp al
cliente. El cliente lo abre, Android le pide permitir "instalación de fuentes
desconocidas" la primera vez, y queda instalado como cualquier otra app.

Cuando se publique en Google Play (requiere cuenta Developer del estudio), la
instalación será directa desde la tienda.

### Pantallas

#### Acceso (login)
El cliente entra con el correo y contraseña que el estudio le crea al momento
de registrar su caso.

#### Inicio
- Saludo personalizado con su nombre.
- Bloque **MI CASO**: muestra el caso activo, su etapa procesal con un punto
  pulsante dorado, su número de expediente y un acceso directo a la línea de
  tiempo.
- Bloque **ACADEMIA**: curso destacado del catálogo.
- Bloque **ATENCIÓN INMEDIATA**: WhatsApp 24h con un toque.

#### Mi Caso
- Cabecera con expediente y nombre del proceso.
- **Línea de tiempo del proceso** con las 6 etapas penales:
  1. Investigación Preliminar
  2. Investigación Preparatoria
  3. Etapa Intermedia
  4. Juzgamiento
  5. Impugnación
  6. Ejecución de Sentencia
- **Próxima audiencia** con día, hora y juzgado.
- Acciones: Documentos · Mensajes · Audiencias · Llamar al estudio.

#### Documentos del expediente
- Listado cronológico de PDFs subidos por el estudio.
- Clasificación por tipo: ESCRITO · RESOLUCIÓN · NOTIFICACIÓN · OTRO.
- Tap descarga el archivo directamente.

#### Mensajes
- Chat con el abogado a cargo.
- Las burbujas del estudio van marcadas como "SU ABOGADO" en dorado.
- El historial completo queda guardado y no se pierde.

#### Audiencias
- Listado cronológico con tipo de audiencia, fecha en español, hora y juzgado.

#### Cursos (Academia)
- Catálogo de la academia "Gutiérrez Oliva Legal Training".
- Filtros por modalidad: Todos · On demand · En vivo · Híbrido · Empresarial.
- Cada curso muestra: eyebrow de modalidad, título, duración, lecciones y
  precio.

#### Detalle de un curso
- Hero con foto o monograma del título sobre vino sólido.
- Precio destacado, instructor, descripción, temario expansible por módulos.
- Botón "Inscribirme" abre el checkout con Culqi (modo demo hasta que el
  estudio active sus llaves reales).

#### Perfil
- Avatar (monograma con iniciales).
- Nombre completo y correo.
- **CTA principal**: "Agendar consulta · S/ 200" (única acción en vino visible
  en toda la pantalla).
- Secciones: Cuenta · El Estudio · Preferencias.
- Acceso a "Sedes y contacto", "Atención 24h", soporte por correo.
- Footer institucional con razón social y RUC.

#### Contacto / Sedes
- Tres sedes (Arequipa, Cusco, Juliaca).
- Cada una con su dirección, distrito, horario y botón "Cómo llegar →" que
  abre Google Maps.
- Canales de pago: Yape, BCP, CCI.

---

## 2. La Sala de Mando (panel administrativo)

### Qué es

La aplicación web que usa el equipo del estudio para operar el ecosistema. Es
lo que alimenta la app móvil con datos reales.

Acceso público en producción: **`https://gutierrez-admin.vercel.app`**.
En desarrollo local corre en `http://localhost:3002`.

Cuando se asigne el dominio definitivo del estudio (ej.
`admin.gutierrezolivaabogados.com`), se apunta el DNS a Vercel desde el
panel de Vercel del proyecto `gutierrez-admin`.

### Acceso

El equipo ingresa con su correo institucional. La primera contraseña es
temporal y cada miembro debe cambiarla al primer ingreso.

### Pantallas

#### Tablero (Dashboard)
Saludo personalizado con la hora del día. Cuatro KPIs en tipografía editorial:

- Casos activos
- Audiencias próximas
- Mensajes sin leer
- Consultas pendientes

#### Casos
Listado editorial de todos los expedientes del estudio (un abogado solo ve los
que tiene asignados; el Socio Director ve todos).

Cada fila: expediente, título del caso, cliente, etapa actual (en dorado),
fecha de última actualización. Tap entra al detalle.

##### Detalle del caso
- Cabecera con expediente, título, delito y cliente.
- **Línea de tiempo del proceso** con las 6 etapas penales. La etapa actual
  está marcada con anillo dorado.
- **Botón "Avanzar etapa →"** (solo para Socio Director y para el abogado
  asignado): abre un selector, confirma y mueve la línea de tiempo.
- **Próximas audiencias** y **Últimos documentos** en dos columnas.
- Botón **"Ver todos →"** en documentos abre la pestaña de expediente con
  subida de PDF.
- **Mensajes recientes** con el cliente (solo si su rol permite verlos).
- **Respondedor de mensajes** debajo del hilo (solo Socio Director y abogado
  asignado): caja de texto + enviar.

##### Detalle del caso → Documentos
- Listado completo del expediente digital con tipo, nombre, tamaño y fecha.
- **Formulario de subida** con archivo PDF (máx. 25 MB), tipo del documento
  y nombre legal.
- En **modo demo** (sin Cloudflare R2 configurado) el documento se registra
  en la base de datos pero el archivo no se almacena — la guía operativa lo
  indica claramente con un banner dorado.

#### Clientes
Directorio de todos los clientes del estudio. Cada fila: nombre, correo,
cantidad de casos activos, fecha de alta.

#### Consultas
Tabla con todas las consultas (S/ 200, virtual o presencial, 20–30 minutos).
KPIs arriba: pendientes (en dorado), confirmadas, completadas.

Estados: PENDIENTE → CONFIRMADA → COMPLETADA / CANCELADA.

**Acciones en cada fila** (Socio Director y Administración):
- **Confirmar** — abre selector de fecha/hora; si es modalidad Virtual,
  incluye campo URL de Zoom.
- **Marcar completada** — para consultas ya realizadas.
- **Cancelar** — pide confirmación, el cliente recibe el aviso.

#### Academia
Catálogo del Gutiérrez Oliva Legal Training. Por curso muestra modalidad,
título, descripción, precio, módulos, lecciones, duración e inscritos.

#### Audiencias
Vista cronológica de todas las audiencias futuras, agrupadas por mes con
encabezado en español. Cada audiencia muestra fecha, hora, juzgado y sala.

**Botón "Nueva audiencia"** (Socio Director, Abogado y Asistente):
abre formulario con caso, tipo, título, fecha, hora, juzgado y sala.

#### Mensajes
Bandeja unificada estilo Gmail. Cada hilo abierto del estudio con un cliente
aparece como una fila con: expediente, último mensaje, autor del último
mensaje, fecha y un indicador dorado si hay mensajes del cliente sin leer.
Tap entra al detalle del caso donde se responde.

#### Pagos
Tabla con todos los movimientos del estudio (Culqi automático + Yape/BCP
manual). KPIs: recaudado total, del mes, número de movimientos.

**Botón "Registrar pago"** (Socio Director y Administración): abre formulario
para registrar pagos manuales con concepto, email del cliente, monto, método
(Yape, BCP, BBVA, Interbank, efectivo, otro) y referencia opcional.

#### Equipo (solo Socio Director)
Listado de los integrantes con su rol y cantidad de casos a cargo.

#### Configuración (solo Socio Director)
Datos institucionales del estudio: razón social, RUC, slogan, WhatsApp,
sedes, canales de pago.

#### Auditoría (solo Socio Director)
Registro de acciones críticas del equipo. Retención mínima 5 años.

---

## 3. Roles y permisos del equipo

El panel respeta una matriz de permisos declarativa. La lógica vive en
`lib/permissions.ts` y abarca más de 30 acciones distintas.

### Socio Director (`SUPERADMIN`)
**Quién:** el dueño y futuros socios.
**Puede:** TODO. Crear casos, avanzar etapas, responder mensajes, subir
documentos, gestionar pagos, crear cursos, gestionar equipo, ver auditoría.

### Administración (`ADMIN_OPERATIVO`)
**Quién:** quien lleva la administración del estudio.
**Puede:** consultas (confirmar/cancelar), pagos (registrar manuales),
ver equipo y configuración, cargar material a cursos.
**No puede:** ver expedientes ni mensajes con clientes (confidencialidad
abogado-cliente).

### Abogado (`ABOGADO`)
**Quién:** los abogados litigantes del estudio.
**Puede:** ver sus casos asignados, avanzar etapas, subir documentos a sus
casos, responder mensajes de sus clientes, programar audiencias, escribir en
la bitácora interna, editar cursos que él dicta, emitir certificados.
**No puede:** ver casos de otros abogados, gestionar pagos globales,
gestionar equipo ni configuración.

### Asistente (`ASISTENTE`)
**Quién:** colaboradores que apoyan a los abogados.
**Puede:** ver listado de casos (lectura), subir documentos, registrar
audiencias, agendar consultas, cargar material a cursos.
**No puede:** ver mensajes con clientes, leer ni escribir bitácora interna,
crear casos, gestionar pagos o equipo.

---

## 4. Acciones disponibles por pantalla

Resumen rápido de qué puede hacer cada rol en cada pantalla.

| Pantalla | SUPERADMIN | ADMIN_OPERATIVO | ABOGADO | ASISTENTE |
|---|---|---|---|---|
| Dashboard | ✓ ver | ✓ ver | ✓ ver | ✓ ver |
| Casos (lista) | ✓ ver todos | — | ✓ solo suyos | ✓ ver todos (lectura) |
| Detalle de caso | ✓ todo | — | ✓ si es suyo | ✓ ver (lectura) |
| Avanzar etapa | ✓ | — | ✓ si es suyo | — |
| Documentos · subir | ✓ a cualquiera | — | ✓ solo a los suyos | ✓ a cualquiera |
| Documentos · borrar | ✓ | — | — | — |
| Responder mensaje | ✓ | — | ✓ solo a sus clientes | — |
| Audiencias · ver | ✓ | — | ✓ | ✓ |
| Audiencias · nueva | ✓ | — | ✓ solo en sus casos | ✓ |
| Consultas · ver | ✓ | ✓ | ✓ | ✓ |
| Consultas · confirmar/cancelar | ✓ | ✓ | — | — |
| Consultas · solo agendar fecha | ✓ | ✓ | ✓ | ✓ |
| Pagos · ver | ✓ | ✓ | — | — |
| Pagos · registrar manual | ✓ | ✓ | — | — |
| Academia · ver | ✓ | ✓ | ✓ | ✓ |
| Academia · crear/editar | ✓ | — | ✓ solo los suyos | — |
| Academia · cargar material | ✓ | ✓ | ✓ | ✓ |
| Academia · emitir certificados | ✓ | — | ✓ | — |
| Equipo · ver | ✓ | ✓ | — | — |
| Equipo · crud + asignar rol | ✓ | — | — | — |
| Configuración · ver | ✓ | ✓ | — | — |
| Configuración · editar | ✓ | — | — | — |
| Auditoría | ✓ | — | — | — |

---

## 5. Flujos de trabajo más comunes

### Registrar un cliente nuevo y abrir su caso

1. Socio Director crea la cuenta del cliente desde el script
   `npx tsx scripts/create-user.ts <email> <password> "Nombre" CLIENTE`
   (la creación gráfica desde el panel está en el siguiente sprint).
2. Cliente recibe credenciales por WhatsApp/correo.
3. Socio Director registra el caso en la base con script de seed o desde
   Prisma Studio mientras se construye el formulario.
4. Asigna abogado responsable.
5. El cliente recibe push: "Su caso ha sido registrado".

### Subir un documento al expediente

1. Abogado (o Asistente / Socio Director) abre el detalle del caso →
   sección Documentos → **Ver todos →**.
2. En el formulario superior selecciona tipo (Escrito / Resolución /
   Notificación / Otro) y nombre legal del documento.
3. Adjunta el PDF (máx. 25 MB).
4. Tap **"Subir documento"**.
5. Si Cloudflare R2 está configurado, el archivo se almacena y el cliente
   recibe push: "Nuevo documento en su expediente". Si no, el sistema avisa
   "modo demo" y solo guarda el registro.

### Responder mensaje del cliente

1. El abogado ve un indicador "● N sin leer" en la sección Mensajes.
2. Tap en la fila → entra al detalle del caso.
3. Lee el hilo en "Mensajes recientes".
4. En el composer "Respuesta del estudio" escribe y envía.
5. Al enviar, el sistema marca los mensajes del cliente como leídos
   automáticamente y notifica al cliente.

### Avanzar etapa procesal

1. Abogado entra al caso.
2. En la línea de tiempo ve la etapa activa con anillo dorado.
3. Click **"Avanzar etapa →"**.
4. Selecciona la siguiente etapa (no se permite retroceder).
5. Confirma. La línea de tiempo se actualiza, el cliente lo ve en su app.

### Programar una audiencia

1. Abogado/Asistente entra a **Audiencias → Nueva audiencia**.
2. Selecciona el caso, tipo, título, fecha, hora, juzgado y sala (opcional).
3. La hora se interpreta en zona horaria Lima.
4. Tap **"Registrar audiencia"**.
5. El cliente la verá en su pestaña Audiencias y en "Mi caso".

### Confirmar una consulta

1. Administración entra a **Consultas**.
2. Para una fila PENDIENTE → **"Confirmar"**.
3. Define fecha y hora; si la modalidad es Virtual, pega la URL de Zoom.
4. **"Confirmar"** envía aviso al cliente.

### Registrar un pago manual (Yape/BCP/efectivo)

1. Administración entra a **Pagos → Registrar pago**.
2. Llena concepto (ej. "Honorarios mes 03"), email del cliente, monto,
   método y referencia (n.º de operación, voucher).
3. Tap **"Registrar pago"** — queda como COMPLETADO en la bandeja.

### Emitir certificado de curso

1. Administración o Abogado instructor entra a **Academia → curso → inscritos**.
2. Los alumnos al 100 % muestran botón "Emitir certificado".
3. Click genera el PDF (queda guardado en R2), crea registro Certificado y
   notifica al alumno.
4. El alumno ve el certificado en su pestaña Perfil de la app móvil.

---

## 6. Cuentas DEMO — credenciales por rol para probar

Estas cuentas existen en la base de datos para que cualquier persona del estudio
pueda **iniciar sesión y comprobar exactamente qué puede hacer cada rol** antes
del lanzamiento. Cada credencial vive y respira los permisos de su rol — al
entrar verá la pantalla y las acciones que tendrá su equivalente real.

> **Importante:** estas cuentas son DEMO. Antes del lanzamiento productivo, el
> Socio Director debe rotar la contraseña de cada cuenta desde
> **Equipo → Resetear contraseña**, o eliminarlas y dejar solo las reales.

### 🟢 Cuenta de cliente DEMO

| Campo | Valor |
|---|---|
| **Rol** | CLIENTE |
| **Email** | `cliente@gutierrez.pe` |
| **Contraseña** | `Gutierrez2025!` |
| **Pruebe que puede:** | Ver su caso, abrir documentos, escribir mensajes al estudio, ver audiencias, navegar la academia, agendar una consulta de S/ 200. |
| **No debe poder:** | Ver casos de otros clientes, entrar al panel administrativo (es redirigido a su portal). |

### 🟢 Cuenta de Socio Director DEMO (`SUPERADMIN`)

| Campo | Valor |
|---|---|
| **Rol** | SUPERADMIN |
| **Email** | `lgutierrez@gutierrezolivaabogados.com` |
| **Contraseña** | `Gutierrez2026!` |
| **Pruebe que puede:** | Todo. Ver todos los casos, avanzar etapas en cualquiera, subir y borrar documentos, responder mensajes, registrar pagos manuales, confirmar/cancelar consultas, programar audiencias, ver el equipo, ver la auditoría, editar configuración. |
| **No debe poder:** | Nada está restringido para este rol. |

### 🟢 Cuenta de Administración DEMO (`ADMIN_OPERATIVO`)

| Campo | Valor |
|---|---|
| **Rol** | ADMIN_OPERATIVO |
| **Email** | `bruno@gutierrezolivaabogados.com` |
| **Contraseña** | `Gutierrez2026!` |
| **Pruebe que puede:** | Ver el tablero, confirmar/cancelar consultas, registrar pagos manuales, ver el equipo y la configuración (lectura), cargar material a cursos. |
| **No debe poder:** | Entrar a Casos, Mensajes ni a la Bitácora (confidencialidad abogado-cliente). Al intentarlo verá una pantalla "Acceso restringido". |

### 🟢 Cuenta de Abogado DEMO (`ABOGADO`)

| Campo | Valor |
|---|---|
| **Rol** | ABOGADO |
| **Email** | `jcaceres@gutierrezolivaabogados.com` |
| **Contraseña** | `Gutierrez2026!` |
| **Pruebe que puede:** | Ver únicamente los casos donde figura como abogado asignado, avanzar etapa en sus casos, subir documentos a sus casos, responder mensajes de sus clientes, programar audiencias en sus casos, ver y editar los cursos que dicta, emitir certificados. |
| **No debe poder:** | Ver casos de otros abogados, registrar pagos globales, gestionar equipo, ver auditoría. |

### 🟢 Cuenta de Asistente DEMO (`ASISTENTE`)

| Campo | Valor |
|---|---|
| **Rol** | ASISTENTE |
| **Email** | `pferia@gutierrezolivaabogados.com` |
| **Contraseña** | `Gutierrez2026!` |
| **Pruebe que puede:** | Ver el listado de todos los casos (lectura), subir documentos al expediente, programar audiencias, agendar consultas, cargar material a cursos. |
| **No debe poder:** | Leer mensajes con clientes (secreto profesional), avanzar etapa, responder mensajes, ver ni escribir bitácora interna, registrar pagos, gestionar equipo. |

---

## 7. Cuentas reales del equipo

Todas las cuentas reales comparten la contraseña temporal **`Gutierrez2026!`**.
Cada usuario debe cambiarla al primer ingreso desde **Perfil → Cambiar contraseña**.

### Socio Director
- Luis Enrique Gutiérrez Oliva — `lgutierrez@gutierrezolivaabogados.com`

### Administración
- Bruno Alejandro Mattos Marchani — `bruno@gutierrezolivaabogados.com`

### Abogados
- Juan Diego Cáceres Núñez del Prado — `jcaceres@gutierrezolivaabogados.com`
- Jannilson Jesús Vera Chalco — `jvera@gutierrezolivaabogados.com`
- Pool Edgar Cornejo Coaquira — `pcornejo@gutierrezolivaabogados.com`

### Asistentes
- Paola Gimena Feria Feria — `pferia@gutierrezolivaabogados.com`
- Diego Víctor Céspedes Ordóñez — `dcespedes@gutierrezolivaabogados.com`
- Cristian Rodrigo Gutiérrez Quispe — `cgutierrez@gutierrezolivaabogados.com`
- Irma Magda Ruiz Phocco — `iruiz@gutierrezolivaabogados.com`
- Rafael Sergio Ponce Paz Oviedo — `rponce@gutierrezolivaabogados.com`
- Cristofer Andrés Ancalle Soto — `cancalle@gutierrezolivaabogados.com`
- Margiori Orue Aedo Jarette — `maedo@gutierrezolivaabogados.com`

> Las cuentas DEMO de arriba **coinciden** con cuentas reales (Luis, Bruno,
> Juan Diego, Paola). Cuando cada titular reciba sus credenciales y cambie su
> contraseña en el primer ingreso, deja de ser "DEMO" y pasa a ser su cuenta
> de trabajo. Para mantener un set de pruebas separado, el Socio Director puede
> crear cuentas dedicadas (ej. `demo-abogado@gutierrezolivaabogados.com`).

---

## 8. Preguntas frecuentes

**¿Qué pasa si pierdo mi contraseña?**
El Socio Director puede resetearla desde **Equipo → seleccionar persona →
Resetear contraseña**. El sistema envía una nueva temporal al correo.

**¿Por qué Administración no ve los casos?**
Por confidencialidad abogado-cliente. La administración no debe acceder al
expediente penal. Tiene acceso a todo lo que NO es expediente: pagos,
consultas, agenda, equipo, configuración.

**¿Puede un abogado ver los casos de otros abogados?**
No. Cada abogado solo ve los casos donde figura como `abogadoId`. Solo el
Socio Director ve todo.

**¿Los asistentes pueden leer los mensajes del cliente con su abogado?**
No. El secreto profesional cubre la conversación entre abogado y cliente.
Los asistentes operan sobre documentos, audiencias y material académico.

**¿Cómo se publica una actualización de la app?**
Si el cambio es de pantallas, textos o lógica JavaScript: `eas update` (queda
en el celular del cliente en segundos, sin reinstalar). Si el cambio agrega
módulos nativos o paquetes nuevos: `eas build` y reinstalar.

**¿Qué pasa con los pagos en modo demo?**
Hasta que el estudio cargue las llaves de Culqi (pública y secreta), todos
los pagos quedan registrados como `demo_*` y no generan cargo real. La app
muestra "MODO DEMO · NO SE REALIZARÁ CARGO REAL" en el checkout. Los pagos
manuales registrados desde **Pagos → Registrar pago** sí quedan como
COMPLETADO sin importar Culqi (porque ya se cobraron por Yape/BCP/efectivo).

**¿Cómo se respaldan los documentos del expediente?**
Cloudflare R2 con replicación cross-region más respaldo semanal. Retención
indefinida. En **modo demo** (sin R2 configurado), el sistema avisa al
subir y solo guarda el registro en base de datos.

**¿Qué hago si necesito borrar un documento subido por error?**
Solo el Socio Director puede borrar documentos. Se hace desde el detalle
del caso → Documentos, en cada fila. Acción auditada.

---

## 9. Soporte y mantenimiento

### Recursos del proyecto

| Servicio | Para qué |
|---|---|
| **Vercel** | Hosting del backend y del panel web. Auto-deploy en push a `main`. |
| **Neon PostgreSQL** | Base de datos única para app, backend y panel. |
| **Cloudflare R2** | Almacenamiento de PDFs del expediente (requiere keys). |
| **Culqi** | Procesador de pagos con tarjeta (requiere keys). |
| **Resend** | Envío de correos transaccionales (opcional). |
| **Sentry** | Monitoreo de errores (opt-in con `SENTRY_DSN`). |

### Variables de entorno críticas

En el dashboard de Vercel del backend y del panel:

- `DATABASE_URL` — conexión a Neon (ya configurada).
- `MOBILE_JWT_SECRET` — firma de tokens móviles (ya configurada).
- `NEXTAUTH_SECRET` / `AUTH_SECRET` — sesiones del panel (ya configurada).
- `CULQI_SECRET_KEY` — pagos reales (pendiente).
- `CULQI_WEBHOOK_SECRET` — verificación de webhooks (pendiente).
- `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET`,
  `R2_PUBLIC_URL` — subida real de documentos (pendiente).
- `RESEND_API_KEY` — emails (pendiente).

Hasta que se configuren, las funcionalidades dependientes corren en **modo
demo** sin afectar la operación del resto del sistema.

### Verificación de calidad — automática

Cada vez que se sube un cambio al repositorio, **GitHub Actions** corre por sí
solo la suite completa: TypeScript estricto (admin + app + backend), ESLint y
los tests Jest. Si algo falla, el push queda marcado en rojo y el deploy a
Vercel no se promueve. El equipo no necesita correr nada manualmente.

Configuración en `.github/workflows/ci.yml` de cada repositorio. Resultado
visible en cada commit con el ✔/✖ verde o rojo al costado del hash.

### Deploy — automático

- **Push a `main` → Vercel deploya solo** el backend y el panel web.
- Si algún check de CI falla, el deploy se cancela hasta corregir.
- La app móvil se publica con `eas update` (cambios JS) o `eas build` (cambios
  nativos). Ambos comandos pueden vivir en un workflow similar si el estudio
  desea publicación automática a la tienda.

### Política de privacidad y términos

Antes de publicar en Google Play / App Store, el estudio debe redactar (o
mandar redactar a su asesor legal) los dos documentos:

- Política de Privacidad — alineada con la Ley 29733 (Perú).
- Términos de Servicio — uso de la app y de la academia.

Ambos deben hospedarse en URLs públicas y enlazarse desde la app.

---

*Documento vivo. Se actualiza en cada release del sistema.*
*Versión 2.0 — Mayo 2026.*

# Guía de Usuario — Estudio Gutiérrez Oliva Abogados

Manual completo del ecosistema digital del estudio. Compuesto por dos piezas:

1. **App móvil** — Portal del cliente (Android, próximamente iOS).
2. **Sala de Mando** — Panel administrativo del equipo (web).

Ambos comparten la misma base de datos. Todo lo que el equipo registra desde la
Sala de Mando aparece en la app del cliente en tiempo real.

---

## Tabla de contenidos

1. La app móvil para el cliente
2. El panel administrativo (Sala de Mando)
3. Roles y permisos del equipo
4. Flujos de trabajo más comunes
5. Cuentas iniciales del equipo
6. Preguntas frecuentes

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

## 2. El panel administrativo (Sala de Mando)

### Qué es

La aplicación web que usan los 12 (y futuros) integrantes del estudio para
operar el ecosistema. Es lo que alimenta la app móvil con datos reales.

URL local de desarrollo: `http://localhost:3002`
URL de producción: la que ustedes decidan al deployarla a Vercel.

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
- **Próximas audiencias** y **Últimos documentos** en dos columnas.
- **Mensajes recientes** con el cliente (sólo si su rol permite ver mensajes).

#### Clientes
Directorio de todos los clientes del estudio. Cada fila: nombre, correo,
cantidad de casos activos, fecha de alta.

#### Consultas
Tabla con todas las consultas (S/ 200, virtual o presencial, 20–30 minutos).
KPIs arriba: pendientes (en dorado), confirmadas, completadas.

Estados: PENDIENTE → CONFIRMADA → COMPLETADA / CANCELADA.

#### Academia
Catálogo del Gutiérrez Oliva Legal Training. Por curso muestra modalidad,
título, descripción, precio, módulos, lecciones, duración e inscritos.

#### Audiencias
Vista cronológica de todas las audiencias futuras, agrupadas por mes con
encabezado en español. Cada audiencia muestra fecha, hora, juzgado y sala.

#### Mensajes
Bandeja unificada estilo Gmail. Cada hilo abierto del estudio con un cliente
aparece como una fila con: expediente, último mensaje, autor del último
mensaje, fecha y un indicador rojo si hay mensajes del cliente sin leer.

#### Pagos
Tabla con todos los movimientos del estudio (Culqi automático + Yape/BCP
manual). KPIs: recaudado total, del mes, número de movimientos.

#### Equipo (solo Socio Director)
Listado de los integrantes con su rol y cantidad de casos a cargo.

#### Configuración (solo Socio Director)
Datos institucionales del estudio: razón social, RUC, slogan, WhatsApp,
sedes, canales de pago.

#### Auditoría (solo Socio Director)
Registro inmutable de todas las acciones críticas. Retención mínima 5 años.

---

## 3. Roles y permisos del equipo

El panel respeta una matriz de permisos declarativa. La lógica está en
`lib/permissions.ts` del repo, en este documento aparece resumida:

### Socio Director (`SUPERADMIN`)
**Quién:** el dueño y futuros socios.
**Puede:** TODO. Crear casos, avanzar etapas, responder mensajes, subir
documentos, gestionar pagos, crear cursos, gestionar equipo, ver auditoría.

### Administración (`ADMIN_OPERATIVO`)
**Quién:** quien lleva la administración del estudio (Bruno Mattos).
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

## 4. Flujos de trabajo más comunes

### Registrar un cliente nuevo y abrir su caso

1. Socio Director entra a **Casos → Nuevo caso**.
2. Busca al cliente por correo. Si no existe, lo invita: el sistema crea su
   cuenta y le envía un correo con su contraseña temporal.
3. Llena los datos del caso (expediente, delito, juzgado, etapa inicial).
4. Asigna abogado responsable.
5. El cliente recibe push: "Su caso ha sido registrado".

### Subir un documento al expediente

1. Abogado entra al detalle del caso → pestaña **Documentos**.
2. Arrastra el PDF al área de subida (o tap "Subir").
3. El sistema lo envía directo a Cloudflare R2 (no pasa por el servidor del
   estudio, lo cual lo hace rápido incluso para PDFs grandes).
4. Selecciona tipo (Escrito / Resolución / Notificación / Otro).
5. El cliente recibe push: "Nuevo documento en su expediente".

### Responder mensaje del cliente

1. El abogado ve un indicador rojo "3 sin leer" en la sección Mensajes.
2. Tap en el hilo, el sistema marca como leído automáticamente.
3. Escribe la respuesta y la envía.
4. El cliente recibe push.

### Avanzar etapa procesal

1. Abogado entra al caso.
2. En la línea de tiempo ve la etapa activa con un anillo dorado pulsante.
3. Click "Avanzar a Etapa Intermedia →".
4. Modal de confirmación con la fecha y nota opcional.
5. Sistema actualiza, registra el cambio en auditoría y notifica al cliente.

### Emitir certificado de curso

1. ADMIN_OPERATIVO o ABOGADO instructor entra a **Academia → curso → inscritos**.
2. Los alumnos al 100 % muestran botón "Emitir certificado".
3. Click genera el PDF (queda guardado en R2), crea registro Certificado y
   notifica al alumno.
4. El alumno ve el certificado en su pestaña Perfil de la app móvil.

### Agendar consulta de S/ 200

1. Cliente solicita la consulta desde la app móvil (o WhatsApp).
2. Aparece en **Consultas** del panel como PENDIENTE.
3. ADMIN_OPERATIVO confirma la fecha/hora y, si es virtual, pega el enlace
   de Zoom.
4. El cliente recibe push con la confirmación.

---

## 5. Cuentas iniciales del equipo

Todas las cuentas comparten la contraseña temporal **`Gutierrez2026!`**. Cada
usuario debe cambiarla al primer ingreso.

### Socio Director
- **Administrador General** — `admingutierrez@gmail.com` / `Admin2026` (cuenta principal)
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

---

## 6. Preguntas frecuentes

**¿Qué pasa si pierdo mi contraseña?**
El Socio Director puede resetearla desde **Equipo → seleccionar persona →
Resetear contraseña**. El sistema envía una nueva temporal al correo.

**¿Por qué Bruno no ve los casos?**
Por confidencialidad abogado-cliente. La administración no debe acceder al
expediente penal. Bruno tiene acceso a todo lo que NO es expediente: pagos,
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

**¿Dónde está el código?**
- Repo de la app móvil + backend: `https://github.com/JersonCh1/gutierrez-app`
- Repo del panel administrativo: `https://github.com/JersonCh1/gutierrez-admin`

**¿Qué pasa con los pagos en modo demo?**
Hasta que el estudio nos pase las llaves de Culqi (pública y secreta), todos
los pagos quedan registrados como `demo_*` y no generan cargo real. La app
muestra "MODO DEMO · NO SE REALIZARÁ CARGO REAL" en el checkout.

**¿Cómo se respaldan los documentos del expediente?**
Cloudflare R2 con replicación cross-region más respaldo semanal. Retención
indefinida.

---

*Documento vivo. Se actualiza en cada release del sistema.*
*Versión 1.0 — Mayo 2026.*

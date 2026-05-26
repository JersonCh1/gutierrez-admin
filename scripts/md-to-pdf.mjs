// node scripts/md-to-pdf.mjs <input.md> <output.pdf>
// Convierte un Markdown a PDF editorial de lujo usando Chrome headless.
import fs from "node:fs"
import path from "node:path"
import { execSync } from "node:child_process"
import { marked } from "marked"

const CHROME = process.env.CHROME_PATH ?? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"

const HTML_TEMPLATE = (title, body) => `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<title>${title}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>
  :root {
    --bg:        #0A0907;
    --bg-2:      #100E0A;
    --surface:   #1C1913;
    --surface-2: #272218;

    --gold:      #CDAE5E;
    --gold-2:    #E2C988;
    --gold-3:    #9A8038;
    --gold-soft: rgba(205,174,94,0.10);

    --wine:      #8A3343;
    --wine-2:    #A8424F;

    --white:     #F6F1E8;
    --cream:     #DDD2BC;
    --silver:    #A89C84;
    --steel:     #6F6856;

    --border:    rgba(205,174,94,0.34);
    --border-2:  rgba(246,241,232,0.10);
    --border-3:  rgba(205,174,94,0.18);

    --success:   #3E8E6E;

    --font-serif: "Cormorant Garamond", Georgia, serif;
    --font-sans:  "Inter", system-ui, sans-serif;
    --font-mono:  "JetBrains Mono", Consolas, monospace;
  }

  @page {
    size: A4;
    margin: 22mm 18mm 22mm 18mm;
  }

  * { box-sizing: border-box; }

  html, body {
    background: var(--bg);
    color: var(--white);
    font-family: var(--font-sans);
    font-weight: 400;
    font-size: 10.5pt;
    line-height: 1.6;
    margin: 0;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  /* ─────────────────── COVER ─────────────────── */

  .cover {
    page-break-after: always;
    min-height: 245mm;
    padding: 18mm 4mm;
    position: relative;
    background: var(--bg);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .cover-deco {
    position: absolute;
    top: 0;
    right: 0;
    width: 80pt;
    height: 80pt;
    border-right: 1px solid var(--gold);
    border-top: 1px solid var(--gold);
    opacity: 0.5;
  }
  .cover-deco-2 {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 80pt;
    height: 80pt;
    border-left: 1px solid var(--gold);
    border-bottom: 1px solid var(--gold);
    opacity: 0.5;
  }

  .cover-top {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }

  .cover-mono {
    width: 56pt;
    height: 56pt;
    border: 1px solid var(--gold);
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: var(--font-serif);
    font-size: 28pt;
    font-weight: 400;
    color: var(--gold);
    line-height: 1;
    letter-spacing: -1pt;
  }

  .cover-eyebrow {
    font-family: var(--font-sans);
    font-size: 8.5pt;
    font-weight: 500;
    letter-spacing: 2.2px;
    text-transform: uppercase;
    color: var(--gold);
    text-align: right;
  }
  .cover-eyebrow div + div { color: var(--silver); margin-top: 4pt; }

  .cover-main { margin-bottom: 4mm; }

  .cover-rule {
    width: 64pt;
    height: 1px;
    background: var(--gold);
    margin: 0 0 18pt;
  }

  .cover h1 {
    font-family: var(--font-serif);
    font-weight: 400;
    font-size: 56pt;
    line-height: 0.98;
    margin: 0;
    color: var(--white);
    letter-spacing: -1.5pt;
  }

  .cover h2 {
    font-family: var(--font-serif);
    font-weight: 400;
    font-size: 22pt;
    line-height: 1.25;
    color: var(--cream);
    margin: 16pt 0 0;
    max-width: 130mm;
  }

  .cover-bottom {
    border-top: 1px solid var(--border-3);
    padding-top: 16pt;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    font-family: var(--font-sans);
    font-size: 8.5pt;
    letter-spacing: 1.8px;
    text-transform: uppercase;
    color: var(--silver);
  }
  .cover-bottom .gold { color: var(--gold); }

  /* ─────────────────── HEADINGS ─────────────────── */

  h1, h2, h3, h4 {
    font-family: var(--font-serif);
    font-weight: 400;
    color: var(--white);
    line-height: 1.2;
    page-break-after: avoid;
  }

  h1 {
    font-size: 30pt;
    margin: 0 0 8pt;
  }

  h2 {
    font-size: 22pt;
    margin: 36pt 0 4pt;
    padding-top: 24pt;
    border-top: 1px solid var(--border);
    position: relative;
    page-break-before: auto;
  }
  h2::after {
    content: "";
    display: block;
    width: 28pt;
    height: 1px;
    background: var(--gold);
    margin-top: 10pt;
  }

  h3 {
    font-size: 15pt;
    color: var(--gold);
    font-weight: 500;
    margin: 24pt 0 4pt;
  }

  h4 {
    font-family: var(--font-sans);
    font-size: 9pt;
    font-weight: 500;
    color: var(--cream);
    text-transform: uppercase;
    letter-spacing: 1.8px;
    margin: 18pt 0 6pt;
  }

  /* ─────────────────── TEXT ─────────────────── */

  p {
    color: var(--cream);
    margin: 6pt 0 10pt;
    line-height: 1.62;
  }
  strong { color: var(--white); font-weight: 500; }
  em { color: var(--cream); font-style: italic; }

  a { color: var(--gold); text-decoration: none; border-bottom: 1px solid var(--border-3); }

  code {
    font-family: var(--font-mono);
    font-size: 9pt;
    color: var(--gold-2);
    background: var(--gold-soft);
    padding: 1.5pt 5pt;
    border-radius: 2pt;
    border: 1px solid var(--border-3);
  }

  pre {
    background: var(--bg-2);
    border: 1px solid var(--border-2);
    border-left: 2px solid var(--gold);
    padding: 12pt 14pt;
    margin: 14pt 0;
    overflow-x: auto;
    page-break-inside: avoid;
  }
  pre code {
    background: none;
    border: none;
    padding: 0;
    color: var(--cream);
    font-size: 9pt;
    line-height: 1.5;
  }

  ul, ol {
    color: var(--cream);
    margin: 6pt 0 12pt;
    padding-left: 20pt;
  }
  li { margin: 4pt 0; line-height: 1.55; }
  ul li::marker { color: var(--gold); }
  ol li::marker { color: var(--silver); font-weight: 500; }

  hr {
    border: none;
    border-top: 1px solid var(--border-2);
    margin: 26pt 0;
    page-break-after: avoid;
  }

  blockquote {
    border-left: 2px solid var(--gold);
    padding: 4pt 0 4pt 16pt;
    margin: 16pt 0;
    color: var(--cream);
    font-style: italic;
    background: var(--gold-soft);
    padding-right: 12pt;
  }
  blockquote p { color: var(--cream); margin: 4pt 0; }
  blockquote strong { color: var(--gold-2); font-style: normal; }

  /* ─────────────────── EYEBROWS ─────────────────── */

  p.eyebrow {
    font-family: var(--font-sans);
    font-size: 8.5pt;
    font-weight: 500;
    letter-spacing: 2px;
    color: var(--silver);
    text-transform: uppercase;
    margin-top: 14pt;
  }
  .eyebrow-gold { color: var(--gold) !important; }

  /* ─────────────────── TABLES ─────────────────── */

  table {
    width: 100%;
    border-collapse: collapse;
    margin: 16pt 0 22pt;
    font-size: 9.5pt;
    page-break-inside: avoid;
    border-top: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
  }
  thead { background: var(--gold-soft); }
  th {
    text-align: left;
    color: var(--gold);
    font-weight: 500;
    font-size: 8.5pt;
    text-transform: uppercase;
    letter-spacing: 1.6px;
    border-bottom: 1px solid var(--border);
    padding: 9pt 10pt 9pt 10pt;
  }
  td {
    color: var(--cream);
    padding: 8pt 10pt;
    border-bottom: 1px solid var(--border-2);
    vertical-align: top;
    line-height: 1.5;
  }
  tr:last-child td { border-bottom: none; }
  tbody tr:nth-child(even) { background: rgba(246,241,232,0.012); }
  td:first-child {
    color: var(--white);
    font-family: var(--font-serif);
    font-size: 12pt;
    font-weight: 400;
  }

  /* ─────────────────── CREDENTIAL CARDS (transformación post-marked) ─────────────────── */

  .cred-card {
    page-break-inside: avoid;
    border: 1px solid var(--border-3);
    background: var(--gold-soft);
    padding: 16pt 18pt;
    margin: 14pt 0 18pt;
    position: relative;
  }
  .cred-card::before {
    content: "";
    position: absolute;
    top: 0; left: 0;
    width: 3pt;
    height: 100%;
    background: var(--gold);
  }
  .cred-card h3 {
    margin: 0 0 10pt;
    font-size: 14pt;
    color: var(--white);
    font-family: var(--font-serif);
  }
  .cred-card .cred-grid {
    display: grid;
    grid-template-columns: 90pt 1fr;
    gap: 6pt 16pt;
    margin-top: 6pt;
  }
  .cred-card .cred-label {
    font-size: 8.5pt;
    font-weight: 500;
    letter-spacing: 1.4px;
    text-transform: uppercase;
    color: var(--silver);
  }
  .cred-card .cred-value {
    font-family: var(--font-mono);
    font-size: 10pt;
    color: var(--gold-2);
  }
  .cred-card .cred-value.text {
    font-family: var(--font-sans);
    color: var(--cream);
    font-size: 9.5pt;
    line-height: 1.5;
  }

  /* TOC */
  .toc {
    page-break-after: always;
    padding-top: 8mm;
  }
  .toc h1 {
    font-family: var(--font-serif);
    font-weight: 400;
    font-size: 32pt;
    margin: 0 0 4pt;
  }
  .toc .toc-rule {
    width: 28pt;
    height: 1px;
    background: var(--gold);
    margin: 6pt 0 26pt;
  }
  .toc ol {
    list-style: none;
    padding: 0;
    counter-reset: toc;
  }
  .toc ol li {
    counter-increment: toc;
    display: flex;
    align-items: baseline;
    gap: 12pt;
    padding: 9pt 0;
    border-bottom: 1px solid var(--border-2);
    color: var(--cream);
    font-size: 12pt;
    font-family: var(--font-serif);
  }
  .toc ol li::before {
    content: counter(toc, decimal-leading-zero);
    color: var(--gold);
    font-family: var(--font-sans);
    font-size: 9pt;
    font-weight: 500;
    letter-spacing: 1.5px;
    width: 28pt;
  }

  /* Section dividers */
  hr + h2 { margin-top: 18pt; }

  /* Inline kbd */
  kbd {
    font-family: var(--font-mono);
    font-size: 8.5pt;
    background: var(--surface);
    border: 1px solid var(--border-2);
    border-bottom: 2px solid var(--border-2);
    padding: 1pt 5pt;
    border-radius: 2pt;
    color: var(--white);
  }
</style>
</head>
<body>
${body}
</body>
</html>`

function buildCover(title, subtitle) {
  return `
    <section class="cover">
      <div class="cover-deco"></div>
      <div class="cover-deco-2"></div>
      <div class="cover-top">
        <div class="cover-mono">G</div>
        <div class="cover-eyebrow">
          <div>Sala de Mando</div>
          <div>Documento oficial · Mayo 2026</div>
        </div>
      </div>
      <div class="cover-main">
        <div class="cover-rule"></div>
        <h1>${title}</h1>
        ${subtitle ? `<h2>${subtitle}</h2>` : ""}
      </div>
      <div class="cover-bottom">
        <div><span class="gold">Estudio Gutiérrez Oliva Abogados</span><br>RUC 20605678212 · Arequipa · Cusco · Juliaca</div>
        <div>Versión 2.0</div>
      </div>
    </section>
  `
}

function buildToc(sections) {
  const lis = sections.map((s) => `<li>${s}</li>`).join("")
  return `
    <section class="toc">
      <h1>Contenido</h1>
      <div class="toc-rule"></div>
      <ol>${lis}</ol>
    </section>
  `
}

/**
 * Detecta tablas de credenciales (4 filas "Rol/Email/Contraseña/Pruebe…") y
 * las transforma en tarjetas visuales, mucho más legibles que una tabla.
 */
function transformCredentialTables(html) {
  // Capturar cada bloque <h3>…</h3>\n<table>…</table> que tenga estructura de credencial.
  return html.replace(/<h3>([^<]+)<\/h3>\s*<table>([\s\S]*?)<\/table>/g, (m, heading, tableInner) => {
    if (!/Email/i.test(tableInner) || !/Contrase/i.test(tableInner)) return m
    const rows = [...tableInner.matchAll(/<tr>\s*<td[^>]*>([\s\S]*?)<\/td>\s*<td[^>]*>([\s\S]*?)<\/td>\s*<\/tr>/g)]
    if (rows.length === 0) return m
    const grid = rows.map(([, label, value]) => {
      const cleanLabel = label.replace(/<[^>]+>/g, "").trim().replace(/[:*]+$/, "")
      const cleanValueRaw = value.trim()
      // Si contiene <code>, lo mostramos en monospace gold; si es texto largo, en sans cream.
      const isCode = /<code>/.test(cleanValueRaw)
      const cleanValue = cleanValueRaw.replace(/<code>/g, "").replace(/<\/code>/g, "")
      const valueClass = isCode ? "cred-value" : "cred-value text"
      return `<div class="cred-label">${cleanLabel}</div><div class="${valueClass}">${cleanValue}</div>`
    }).join("")
    return `<div class="cred-card"><h3>${heading}</h3><div class="cred-grid">${grid}</div></div>`
  })
}

function main() {
  const [, , input, output] = process.argv
  if (!input || !output) {
    console.error("Uso: node scripts/md-to-pdf.mjs <input.md> <output.pdf>")
    process.exit(1)
  }

  const md = fs.readFileSync(input, "utf8")
  const lines = md.split(/\r?\n/)

  // H1 inicial → portada
  let title = "Documento"
  let subtitle = ""
  if (lines[0]?.startsWith("# ")) {
    title = lines[0].replace(/^# /, "").trim()
    lines.shift()
  }
  for (const l of lines) {
    if (l.trim() === "") continue
    if (l.startsWith("#")) break
    subtitle = l.trim()
    break
  }

  // Extraer secciones del TOC (## 1. … ## 2. …) ANTES de pasar a marked.
  const sections = []
  for (const l of lines) {
    const m = l.match(/^##\s+\d+\.\s+(.+)$/)
    if (m) sections.push(m[1].trim())
  }

  // Quitar la lista manual de TOC del markdown si existe ("## Tabla de contenidos" + lista).
  const cleanedLines = []
  let skip = false
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i]
    if (/^##\s+Tabla de contenidos/i.test(l)) { skip = true; continue }
    if (skip) {
      if (/^---\s*$/.test(l) || /^##\s/.test(l)) { skip = false; if (/^##\s/.test(l)) cleanedLines.push(l); continue }
      continue
    }
    cleanedLines.push(l)
  }

  marked.setOptions({ headerIds: false, mangle: false })
  let html = marked.parse(cleanedLines.join("\n"))

  // Eyebrows: párrafos en mayúsculas
  html = html.replace(/<p>([A-ZÁÉÍÓÚÜÑ0-9 ·—•·,\-]{8,80})<\/p>/g, '<p class="eyebrow">$1</p>')

  // Transformar tablas de credenciales en tarjetas premium
  html = transformCredentialTables(html)

  const full = HTML_TEMPLATE(title, buildCover(title, subtitle) + buildToc(sections) + html)

  const tmpHtml = path.join(path.dirname(output), ".tmp-guia.html")
  fs.writeFileSync(tmpHtml, full, "utf8")

  const absOut  = path.resolve(output)
  const absHtml = path.resolve(tmpHtml)

  console.log("Generando PDF editorial con Chrome headless…")
  try {
    execSync(
      `"${CHROME}" --headless=new --disable-gpu --no-sandbox --print-to-pdf="${absOut}" --print-to-pdf-no-header "file:///${absHtml.replace(/\\/g, "/")}"`,
      { stdio: "inherit", windowsHide: true },
    )
    fs.unlinkSync(tmpHtml)
    const bytes = fs.statSync(absOut).size
    console.log(`\n✓ PDF generado: ${absOut}  (${(bytes / 1024).toFixed(0)} KB)`)
  } catch (err) {
    console.error("Falló Chrome headless:", err.message)
    console.log("HTML conservado en:", absHtml)
    process.exit(1)
  }
}

main()

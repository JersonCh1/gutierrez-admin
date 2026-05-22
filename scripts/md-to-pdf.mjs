// node scripts/md-to-pdf.mjs <input.md> <output.pdf>
// Convierte un Markdown a PDF usando Chrome headless con estilo editorial.
import fs from "node:fs"
import path from "node:path"
import { execSync } from "node:child_process"
import { marked } from "marked"

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"

const HTML_TEMPLATE = (title, body) => `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<title>${title}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
<style>
  :root {
    --bg:       #0C0B09;
    --surface:  #1C1913;
    --gold:     #CDAE5E;
    --gold-3:   #9A8038;
    --wine:     #8A3343;
    --white:    #F6F1E8;
    --cream:    #DDD2BC;
    --silver:   #A89C84;
    --border:   rgba(205,174,94,0.34);
    --border-2: rgba(246,241,232,0.13);
    --font-serif: "Cormorant Garamond", Georgia, serif;
    --font-sans:  "Inter", system-ui, sans-serif;
  }

  @page {
    size: A4;
    margin: 22mm 18mm 22mm 18mm;
  }

  html, body {
    background: var(--bg);
    color: var(--white);
    font-family: var(--font-sans);
    font-size: 11pt;
    line-height: 1.55;
    margin: 0;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  /* COVER */
  .cover {
    page-break-after: always;
    padding-top: 50mm;
  }
  .cover .eyebrow { color: var(--gold); }
  .cover .rule { width: 36px; height: 1px; background: var(--gold); margin: 14pt 0 22pt; }
  .cover h1 {
    font-family: var(--font-serif);
    font-weight: 400;
    font-size: 42pt;
    line-height: 1.05;
    margin: 0;
    color: var(--white);
  }
  .cover h2 {
    font-family: var(--font-serif);
    font-weight: 400;
    font-size: 22pt;
    line-height: 1.2;
    color: var(--cream);
    margin: 18pt 0 0;
  }
  .cover .meta {
    margin-top: 70pt;
    color: var(--silver);
    font-size: 10pt;
    letter-spacing: 1.5px;
    text-transform: uppercase;
  }

  /* GENERAL */
  h1, h2, h3, h4 {
    font-family: var(--font-serif);
    font-weight: 400;
    color: var(--white);
    line-height: 1.2;
    margin: 28pt 0 6pt;
    page-break-after: avoid;
  }
  h1 { font-size: 26pt; }
  h2 { font-size: 20pt; border-top: 1px solid var(--border); padding-top: 22pt; margin-top: 32pt; }
  h3 { font-size: 15pt; color: var(--gold); margin-top: 22pt; }
  h4 { font-size: 12pt; font-weight: 500; color: var(--cream); font-family: var(--font-sans); text-transform: uppercase; letter-spacing: 1.2px; }

  p { color: var(--cream); margin: 6pt 0 10pt; }
  strong { color: var(--white); font-weight: 600; }
  em { color: var(--cream); font-style: italic; }

  a { color: var(--gold); text-decoration: none; }

  code {
    font-family: "Consolas", "Courier New", monospace;
    font-size: 9.5pt;
    color: var(--gold);
    background: rgba(205,174,94,0.06);
    padding: 1pt 4pt;
    border-radius: 2pt;
  }

  ul, ol {
    color: var(--cream);
    margin: 6pt 0 12pt;
    padding-left: 18pt;
  }
  li { margin: 3pt 0; }
  ul li::marker { color: var(--gold); }
  ol li::marker { color: var(--silver); }

  hr {
    border: none;
    border-top: 1px solid var(--border-2);
    margin: 22pt 0;
  }

  blockquote {
    border-left: 2px solid var(--gold);
    padding-left: 14pt;
    margin: 14pt 0;
    color: var(--cream);
    font-style: italic;
  }

  /* EYEBROWS — heurística: párrafos con solo MAYÚSCULAS */
  p.eyebrow {
    font-size: 9pt;
    font-weight: 500;
    letter-spacing: 1.6px;
    color: var(--silver);
    text-transform: uppercase;
  }
  .eyebrow-gold { color: var(--gold) !important; }

  table {
    width: 100%;
    border-collapse: collapse;
    margin: 14pt 0 20pt;
    font-size: 10pt;
    page-break-inside: avoid;
  }
  th {
    text-align: left;
    color: var(--silver);
    font-weight: 500;
    font-size: 9pt;
    text-transform: uppercase;
    letter-spacing: 1.4px;
    border-bottom: 1px solid var(--border);
    padding: 6pt 8pt 6pt 0;
  }
  td {
    color: var(--cream);
    padding: 7pt 8pt 7pt 0;
    border-bottom: 1px solid var(--border-2);
    vertical-align: top;
  }
  td:first-child {
    color: var(--white);
    font-family: var(--font-serif);
    font-size: 12pt;
    width: 32%;
  }

  /* TOC */
  .toc ol { padding-left: 22pt; }
  .toc li { color: var(--cream); margin: 5pt 0; }
</style>
</head>
<body>
${body}
</body>
</html>`

function main() {
  const [, , input, output] = process.argv
  if (!input || !output) {
    console.error("Uso: node scripts/md-to-pdf.mjs <input.md> <output.pdf>")
    process.exit(1)
  }

  const md = fs.readFileSync(input, "utf8")
  const lines = md.split(/\r?\n/)

  // Strip the first H1 (title) — used for cover
  let title = "Documento"
  let subtitle = ""
  if (lines[0].startsWith("# ")) {
    title = lines[0].replace(/^# /, "").trim()
    lines.shift()
  }
  // First non-empty paragraph as subtitle
  for (const l of lines) {
    if (l.trim() === "") continue
    if (l.startsWith("#")) break
    subtitle = l.trim()
    break
  }

  marked.setOptions({ headerIds: false, mangle: false })
  let html = marked.parse(lines.join("\n"))

  // Heurística para eyebrows: párrafos en MAYÚSCULAS cortos
  html = html.replace(/<p>([A-ZÁÉÍÓÚÜÑ0-9 ·—•·,]{8,80})<\/p>/g, '<p class="eyebrow">$1</p>')

  const cover = `
    <section class="cover">
      <p class="eyebrow eyebrow-gold">SALA DE MANDO · ESTUDIO GUTIÉRREZ OLIVA</p>
      <div class="rule"></div>
      <h1>${title}</h1>
      ${subtitle ? `<h2>${subtitle}</h2>` : ""}
      <p class="meta">VERSIÓN 1.0 · MAYO 2026</p>
    </section>
  `

  const full = HTML_TEMPLATE(title, cover + html)

  const tmpHtml = path.join(path.dirname(output), ".tmp-guia.html")
  fs.writeFileSync(tmpHtml, full, "utf8")

  const absOut = path.resolve(output)
  const absHtml = path.resolve(tmpHtml)

  console.log("Generando PDF con Chrome headless…")
  try {
    execSync(
      `"${CHROME}" --headless=new --disable-gpu --no-sandbox --no-pdf-header-footer --print-to-pdf="${absOut}" "file:///${absHtml.replace(/\\/g, "/")}"`,
      { stdio: "inherit", windowsHide: true },
    )
    fs.unlinkSync(tmpHtml)
    console.log(`\n✓ PDF generado: ${absOut}`)
  } catch (err) {
    console.error("Falló Chrome headless:", err.message)
    console.log("HTML conservado en:", absHtml)
    process.exit(1)
  }
}

main()

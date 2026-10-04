const fs = require("fs");
const path = require("path");
const yaml = require("../lib/js-yaml.min.js");
const { metaCompartir } = require("./compartir.js");

const ROOT = path.join(__dirname, "..");
const YAML_PATH = path.join(ROOT, "datos", "enlaces.yaml");
const PAGINA_PATH = path.join(ROOT, "enlaces", "index.html");

function escaparHTML(valor) {
  return String(valor ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function esBilingue(valor) {
  return typeof valor === "object" && valor !== null;
}

// acepta { es, en }, o un string que no se traduce y va tal cual
function dualSpan(valor) {
  if (!esBilingue(valor)) return escaparHTML(valor);
  return `<span class="es">${escaparHTML(valor.es)}</span><span class="en">${escaparHTML(valor.en)}</span>`;
}

function itemEnlace(enlace) {
  return `              <li><a href="${escaparHTML(enlace.url)}">${dualSpan(enlace.texto ?? enlace.url)}</a></li>`;
}

function paginaEnlaces(datos) {
  return `<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" type="image/png" href="/assets/favicon.ico" />
    <title>montoyamoraga - ${escaparHTML(datos.titulo.es)}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" type="text/css" href="/css/style.css" />
${metaCompartir({
  titulo: `montoyamoraga - ${datos.titulo.es}`,
  descripcion: datos.enlaces.map((enlace) => enlace.url.replace(/^https?:\/\//, "").replace(/\/$/, "")).join(" · "),
  ruta: "/enlaces/",
})}
  </head>
  <body>
    <!-- generado por scripts/generar-enlaces.js desde datos/enlaces.yaml, no editar a mano -->
    <div class="flex-container">
      <nav id="divLeftMenu" class="left"></nav>

      <main class="right">
        <h1 class="cajita">${dualSpan(datos.titulo)}</h1>

        <div class="persona-card">
          <div class="persona-info">
            <h2 class="nombre-destacado">${escaparHTML(datos.nombre)}</h2>
            <ul>
${datos.enlaces.map(itemEnlace).join("\n")}
            </ul>
          </div>
        </div>
      </main>
    </div>

    <footer class="colophon-banner"></footer>

    <script src="/lib/js-yaml.min.js"></script>
    <script src="/js/menu.js"></script>
    <script src="/js/nav.js"></script>
    <script src="/js/script.js"></script>
  </body>
</html>
`;
}

function generar() {
  const datos = yaml.load(fs.readFileSync(YAML_PATH, "utf8"));
  if (!datos || !datos.titulo || !Array.isArray(datos.enlaces)) {
    throw new Error("datos/enlaces.yaml debe tener titulo y una lista enlaces.");
  }

  fs.writeFileSync(PAGINA_PATH, paginaEnlaces(datos));
  console.log(`Generada ${path.relative(ROOT, PAGINA_PATH)} con ${datos.enlaces.length} enlaces.`);
}

module.exports = { generar };

if (require.main === module) generar();

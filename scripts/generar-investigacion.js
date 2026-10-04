const fs = require("fs");
const path = require("path");
const yaml = require("../lib/js-yaml.min.js");
const { metaCompartir } = require("./compartir.js");

const ROOT = path.join(__dirname, "..");
const YAML_PATH = path.join(ROOT, "datos", "investigacion.yaml");
const INVESTIGACION_DIR = path.join(ROOT, "investigacion");

const EXTENSIONES_VIDEO = /\.(mp4|webm|mov)$/i;

const PROXIMAMENTE = { es: "próximamente.", en: "coming soon." };
const SIN_PROYECTOS = { es: "sin proyectos publicados", en: "no published projects" };

const ROTULOS = {
  institucion: { es: "institución", en: "institution" },
  grado: { es: "grado", en: "degree" },
  enlaces: { es: "enlaces", en: "links" },
};

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

function textoPlano(valor) {
  return esBilingue(valor) ? valor.es : valor;
}

function medioHtml(archivo, alt) {
  const src = escaparHTML(archivo);
  return EXTENSIONES_VIDEO.test(archivo)
    ? `<video controls playsinline preload="metadata" src="${src}"></video>`
    : `<img src="${src}" alt="${escaparHTML(alt)}" loading="lazy" decoding="async" />`;
}

// cada imagen o video va en su propia fila de ancho completo, después de la info
function filasMedios(proyecto) {
  return (proyecto.medios || [])
    .map(
      (archivo, i) => `
          <section class="fila fila-medio">
            <div class="fila-interior">
              ${medioHtml(archivo, `${textoPlano(proyecto.titulo)} ${i}`)}
            </div>
          </section>
`
    )
    .join("");
}

function filaTexto(grupo, proyecto) {
  const bloques = [];

  bloques.push(`              <p class="obra-meta">${dualSpan(grupo.titulo)} · ${escaparHTML(proyecto.anho)}</p>`);
  bloques.push(`              <h1 class="cajita">${dualSpan(proyecto.titulo)}</h1>`);

  const descripcion = proyecto.descripcion || [];
  if (descripcion.length > 0) {
    bloques.push(`              <p>
                ${descripcion.map((parrafo) => dualSpan(parrafo)).join("<br /><br />\n                ")}
              </p>`);
  } else if (!(proyecto.medios || []).length) {
    bloques.push(`              <p>${dualSpan(PROXIMAMENTE)}</p>`);
  }

  if ((proyecto.institucion || []).length) {
    bloques.push(`              <h2 class="cajita">${dualSpan(ROTULOS.institucion)}</h2>
              <p>
                ${proyecto.institucion.map((linea) => dualSpan(linea)).join("<br />\n                ")}
              </p>`);
  }

  if (proyecto.grado) {
    bloques.push(`              <h2 class="cajita">${dualSpan(ROTULOS.grado)}</h2>
              <p>${dualSpan(proyecto.grado)}</p>`);
  }

  if ((proyecto.enlaces || []).length) {
    const items = proyecto.enlaces
      .map((enlace) => `                <li><a href="${escaparHTML(enlace.url)}">${dualSpan(enlace.texto ?? enlace.url)}</a></li>`)
      .join("\n");
    bloques.push(`              <h2 class="cajita">${dualSpan(ROTULOS.enlaces)}</h2>
              <ul>
${items}
              </ul>`);
  }

  return `          <section class="fila fila-texto">
            <div class="fila-interior">
${bloques.join("\n\n")}
            </div>
          </section>
`;
}

function paginaProyecto(grupo, proyecto) {
  return `<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" type="image/png" href="/assets/favicon.ico" />
    <title>montoyamoraga - ${escaparHTML(textoPlano(proyecto.titulo))}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" type="text/css" href="/css/style.css" />
${metaCompartir({
  titulo: textoPlano(proyecto.titulo),
  descripcion: (proyecto.descripcion || []).length
    ? textoPlano(proyecto.descripcion[0])
    : `${textoPlano(grupo.titulo)} · ${proyecto.anho}`,
  ruta: `/investigacion/${proyecto.slug}/`,
  prevista: proyecto.prevista,
})}
  </head>
  <body>
    <div class="flex-container">
      <div class="left" id="divLeftMenu"></div>

      <div class="right right--flush">
        <div class="filas">
${filaTexto(grupo, proyecto)}${filasMedios(proyecto)}        </div>
      </div>
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

function proyectosDe(grupo) {
  return grupo.proyectos || [];
}

function cargar() {
  const grupos = yaml.load(fs.readFileSync(YAML_PATH, "utf8"));
  if (!Array.isArray(grupos)) {
    throw new Error("datos/investigacion.yaml no contiene una lista de grupos.");
  }
  return grupos;
}

function generarPaginas(grupos) {
  if (!fs.existsSync(INVESTIGACION_DIR)) fs.mkdirSync(INVESTIGACION_DIR, { recursive: true });

  const carpetasEsperadas = new Set(grupos.flatMap((grupo) => proyectosDe(grupo).map((proyecto) => proyecto.slug)));
  fs.readdirSync(INVESTIGACION_DIR)
    .filter((entrada) => fs.statSync(path.join(INVESTIGACION_DIR, entrada)).isDirectory() && !carpetasEsperadas.has(entrada))
    .forEach((entrada) =>
      console.warn(`aviso: investigacion/${entrada}/ no está en datos/investigacion.yaml (no se toca ni se borra)`)
    );

  grupos.forEach((grupo) => {
    proyectosDe(grupo).forEach((proyecto) => {
      const carpeta = path.join(INVESTIGACION_DIR, proyecto.slug);
      if (!fs.existsSync(carpeta)) fs.mkdirSync(carpeta, { recursive: true });
      fs.writeFileSync(path.join(carpeta, "index.html"), paginaProyecto(grupo, proyecto));
    });
  });

  console.log(`Generadas ${carpetasEsperadas.size} páginas en investigacion/*/index.html.`);
}

// lo usa scripts/generar-menu.js para armar la sección de investigación
function fragmentoMenu() {
  return cargar()
    .map((grupo) => {
      const items = proyectosDe(grupo).length
        ? proyectosDe(grupo)
            .map(
              (proyecto) =>
                `                <li><a href="/investigacion/${proyecto.slug}/">${escaparHTML(proyecto.anho)} - ${dualSpan(proyecto.titulo)}</a></li>`
            )
            .join("\n")
        : `                <li>${dualSpan(SIN_PROYECTOS)}</li>`;

      return `            <h5>${dualSpan(grupo.titulo)}</h5>
            <ol>
${items}
            </ol>`;
    })
    .join("\n\n");
}

function generar() {
  generarPaginas(cargar());
}

module.exports = { generar, fragmentoMenu };

if (require.main === module) generar();

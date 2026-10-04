const fs = require("fs");
const path = require("path");
const yaml = require("../lib/js-yaml.min.js");
const { metaCompartir } = require("./compartir.js");

const ROOT = path.join(__dirname, "..");
const YAML_PATH = path.join(ROOT, "datos", "ensenanza.yaml");
const ENSENANZA_DIR = path.join(ROOT, "ensenanza");

const GRUPOS = [
  { universidad: "udp", es: "pregrado - universidad diego portales", en: "undergraduate - universidad diego portales" },
  { universidad: "uchile", es: "pregrado - universidad de chile", en: "undergraduate - universidad de chile" },
  { universidad: "uai", es: "pregrado - universidad adolfo ibáñez", en: "undergraduate - universidad adolfo ibáñez" },
];

const ROTULOS = {
  institucion: { es: "institución", en: "institution" },
  fechas: { es: "fechas", en: "dates" },
  descripcion: { es: "descripción del curso", en: "course description" },
  equipo: { es: "equipo docente", en: "teaching team" },
};

function escaparHTML(valor) {
  return String(valor ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function dualSpan(bilingue) {
  return `<span class="es">${escaparHTML(bilingue.es)}</span><span class="en">${escaparHTML(bilingue.en)}</span>`;
}

function rotulo(clave) {
  return dualSpan(ROTULOS[clave]);
}

// las fotos viven en el repositorio montoyamoraga-web-media, en
// ensenanza-<slug>/jpg/, y se muestran desde su versión liviana en webp/
const WEB_MEDIA = "https://cdn.jsdelivr.net/gh/montoyamoraga/montoyamoraga-web-media@main";

function resolverImagen(slug, archivo) {
  if (/^https?:\/\//.test(archivo)) return archivo;
  const webp = archivo.replace(/\.(jpe?g)$/i, ".webp");
  return `${WEB_MEDIA}/ensenanza-${slug}/webp/${webp}`;
}

// cada imagen va en su propia fila de ancho completo, después de la info del curso
function filasImagenes(curso) {
  return curso.imagenes
    .map(
      (archivo, i) => `
          <section class="fila fila-medio">
            <div class="fila-interior">
              <img src="${escaparHTML(resolverImagen(curso.slug, archivo))}" alt="trabajo ${i}" loading="lazy" decoding="async" />
            </div>
          </section>
`
    )
    .join("");
}

function paginaCurso(curso) {
  const institucionHtml = curso.institucion
    .map((linea) => dualSpan(linea))
    .join("<br />\n              ");

  const fechasHtml = curso.fechas
    .map((fecha) =>
      fecha.url
        ? `<a href="${escaparHTML(fecha.url)}" class="enlace-curso">${dualSpan(fecha.texto)}</a>`
        : dualSpan(fecha.texto)
    )
    .join("<br />\n              ");

  const descripcionHtml = curso.descripcion.map((parrafo) => dualSpan(parrafo)).join("<br /><br />\n              ");

  const equipoHtml = curso.equipo
    .map((persona) => `${escaparHTML(persona.nombre)}: ${dualSpan(persona.rol)}`)
    .join("<br />\n              ");

  return `<!doctype html>
<html lang="es">
  <head>
    <script src="../../lib/js-yaml.min.js"></script>
    <meta charset="utf-8" />
    <link rel="icon" type="image/png" href="../../assets/favicon.ico" />
    <title>${escaparHTML(curso.slug)} - montoyamoraga</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" type="text/css" href="../../css/style.css" />
${metaCompartir({
  titulo: curso.titulo.es,
  descripcion: curso.descripcion.length ? curso.descripcion[0].es : curso.institucion.map((linea) => linea.es).join(", "),
  ruta: `/ensenanza/${curso.slug}/`,
  prevista: curso.prevista,
})}
  </head>
  <body>
    <div class="flex-container">
      <div class="left" id="divLeftMenu"></div>

      <div class="right right--flush">
        <div class="filas">
          <section class="fila fila-texto">
            <div class="fila-interior">
              <h1 class="cajita">${dualSpan(curso.titulo)}</h1>

              <h2 class="cajita">${rotulo("institucion")}</h2>
              <p>
                ${institucionHtml}
              </p>

              <h2 class="cajita">${rotulo("fechas")}</h2>
              <p>
                ${fechasHtml}
              </p>

              <h2 class="cajita">${rotulo("descripcion")}</h2>
              <p>
                ${descripcionHtml}
              </p>

              <h2 class="cajita">${rotulo("equipo")}</h2>
              <p class="credito-docente">
                ${equipoHtml}
              </p>
            </div>
          </section>
${filasImagenes(curso)}        </div>
      </div>
    </div>

    <footer class="colophon-banner"></footer>

    <script src="../../js/menu.js"></script>
    <script src="../../js/nav.js"></script>
    <script src="../../js/script.js"></script>
  </body>
</html>
`;
}

function generarPaginas(cursos) {
  if (!fs.existsSync(ENSENANZA_DIR)) fs.mkdirSync(ENSENANZA_DIR, { recursive: true });

  const carpetasEsperadas = new Set(cursos.map((curso) => curso.slug));
  fs.readdirSync(ENSENANZA_DIR)
    .filter((entrada) => fs.statSync(path.join(ENSENANZA_DIR, entrada)).isDirectory() && !carpetasEsperadas.has(entrada))
    .forEach((entrada) => console.warn(`aviso: ensenanza/${entrada}/ no está en datos/ensenanza.yaml (no se toca ni se borra)`));

  cursos.forEach((curso) => {
    const carpeta = path.join(ENSENANZA_DIR, curso.slug);
    if (!fs.existsSync(carpeta)) fs.mkdirSync(carpeta, { recursive: true });
    fs.writeFileSync(path.join(carpeta, "index.html"), paginaCurso(curso));
  });

  console.log(`Generadas ${cursos.length} páginas en ensenanza/*/index.html.`);
}

function cargar() {
  const cursos = yaml.load(fs.readFileSync(YAML_PATH, "utf8"));
  if (!Array.isArray(cursos)) {
    throw new Error("datos/ensenanza.yaml no contiene una lista de cursos.");
  }
  return cursos;
}

// lo usa scripts/generar-menu.js para armar la sección de enseñanza
function fragmentoMenu() {
  const cursos = cargar();
  const bloques = GRUPOS.map((grupo) => {
    const cursosGrupo = cursos.filter((curso) => curso.universidad === grupo.universidad);
    const items = cursosGrupo
      .map(
        (curso) =>
          `                <li><a href="/ensenanza/${curso.slug}/">${dualSpan(curso.titulo)}</a></li>`
      )
      .join("\n");

    return `            <h5><span class="es">${escaparHTML(grupo.es)}</span><span class="en">${escaparHTML(grupo.en)}</span></h5>
            <ol>
${items}
            </ol>`;
  });

  return bloques.join("\n\n");
}

function generar() {
  generarPaginas(cargar());
}

module.exports = { generar, fragmentoMenu };

if (require.main === module) generar();

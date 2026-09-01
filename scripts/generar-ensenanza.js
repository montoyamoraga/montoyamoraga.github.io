const fs = require("fs");
const path = require("path");
const yaml = require("../lib/js-yaml.min.js");

const ROOT = path.join(__dirname, "..");
const YAML_PATH = path.join(ROOT, "datos", "ensenanza.yaml");
const ENSENANZA_DIR = path.join(ROOT, "ensenanza");
const NAV_PATH = path.join(ROOT, "js", "nav.js");

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

function resolverImagen(slug, archivo) {
  return /^https?:\/\//.test(archivo) ? archivo : `images/${archivo}`;
}

function paginaCurso(curso) {
  const imagenesHtml = curso.imagenes
    .map((archivo, i) => `              <img src="${escaparHTML(resolverImagen(curso.slug, archivo))}" alt="trabajo ${i}" />`)
    .join("\n");

  const institucionHtml = curso.institucion
    .map((linea) => dualSpan(linea))
    .join("<br />\n              ");

  const fechasHtml = curso.fechas
    .map((fecha) =>
      fecha.url
        ? `<a href="${escaparHTML(fecha.url)}" style="color: blue; text-decoration: underline">${dualSpan(fecha.texto)}</a>`
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
  </head>
  <body>
    <button
      id="menu-btn"
      class="boton-piruetas"
      onclick="document.getElementById('divLeftMenu').classList.toggle('active')"
    >
      menú
    </button>

    <div class="flex-container">
      <div class="left" id="divLeftMenu"></div>

      <div class="right" style="padding: 0;">
        <div class="split-layout">

          <div class="split-left">
            <button class="img-nav-btn prev" onclick="moveImg(-1)">&#10094;</button>
            <button class="img-nav-btn next" onclick="moveImg(1)">&#10095;</button>
            <div class="img-track" id="img-track">
${imagenesHtml}
            </div>
          </div>

          <div class="split-right">
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
            <p style="font-family: monospace; font-size: 9pt">
              ${equipoHtml}
            </p>
          </div>

        </div>
      </div>
    </div>

    <footer class="colophon-banner"></footer>

    <script src="../../js/nav.js"></script>
    <script src="../../js/script.js"></script>
    <script>
      function moveImg(direction) {
        const track = document.getElementById('img-track');
        if (track) {
          track.scrollBy({ left: direction * track.clientWidth, behavior: 'smooth' });
        }
      }
    </script>
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

function fragmentoMenu(cursos) {
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

function actualizarNav(cursos) {
  const navJs = fs.readFileSync(NAV_PATH, "utf8");
  const inicio = "<!-- ENSEÑANZA:GENERADO:INICIO (no editar a mano — ver scripts/generar-ensenanza.js y datos/ensenanza.yaml) -->";
  const fin = "<!-- ENSEÑANZA:GENERADO:FIN -->";

  const indexInicio = navJs.indexOf(inicio);
  const indexFin = navJs.indexOf(fin);
  if (indexInicio === -1 || indexFin === -1) {
    throw new Error(`No se encontraron los marcadores ${inicio} / ${fin} en js/nav.js`);
  }

  const nuevoNavJs =
    navJs.slice(0, indexInicio + inicio.length) +
    "\n" +
    fragmentoMenu(cursos) +
    "\n            " +
    navJs.slice(indexFin);

  fs.writeFileSync(NAV_PATH, nuevoNavJs);
  console.log("Actualizado el menú de enseñanza en js/nav.js.");
}

function generar() {
  const cursos = yaml.load(fs.readFileSync(YAML_PATH, "utf8"));
  if (!Array.isArray(cursos)) {
    throw new Error("datos/ensenanza.yaml no contiene una lista de cursos.");
  }

  generarPaginas(cursos);
  actualizarNav(cursos);
}

module.exports = { generar };

if (require.main === module) generar();

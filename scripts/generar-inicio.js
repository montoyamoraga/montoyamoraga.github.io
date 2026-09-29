const fs = require("fs");
const path = require("path");
const yaml = require("../lib/js-yaml.min.js");
const { metaCompartir } = require("./compartir.js");

const ROOT = path.join(__dirname, "..");
const YAML_PATH = path.join(ROOT, "datos", "inicio.yaml");
const INDEX_PATH = path.join(ROOT, "index.html");

function escaparHTML(valor) {
  return String(valor ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// los párrafos de la biografía aceptan HTML (enlaces), así que no se escapan
function parrafos(biografia) {
  return biografia
    .flatMap((parrafo) => [
      `            <p class="es">\n              ${parrafo.es}\n            </p>`,
      `            <p class="en">\n              ${parrafo.en}\n            </p>`,
    ])
    .join("\n");
}

function fragmentoInicio(datos) {
  return `        <h1 class="cajita">
          <span class="es">${escaparHTML(datos.titulo.es)}</span>
          <span class="en">${escaparHTML(datos.titulo.en)}</span>
        </h1>

        <div class="persona-card">
          <div class="persona-info">
            <h2 class="nombre-destacado">${escaparHTML(datos.nombre)}</h2>
${parrafos(datos.biografia)}
          </div>
        </div>`;
}

// reemplaza lo que hay entre los marcadores inicio/fin de un archivo
function reemplazarEntreMarcadores(rutaArchivo, inicio, fin, fragmento, sangriaFin) {
  const contenido = fs.readFileSync(rutaArchivo, "utf8");
  const indexInicio = contenido.indexOf(inicio);
  const indexFin = contenido.indexOf(fin);
  if (indexInicio === -1 || indexFin === -1) {
    throw new Error(`No se encontraron los marcadores ${inicio} / ${fin} en ${path.relative(ROOT, rutaArchivo)}`);
  }

  const nuevoContenido =
    contenido.slice(0, indexInicio + inicio.length) + "\n" + fragmento + "\n" + sangriaFin + contenido.slice(indexFin);

  fs.writeFileSync(rutaArchivo, nuevoContenido);
  console.log(`Actualizado ${path.relative(ROOT, rutaArchivo)}.`);
}

function generar() {
  const datos = yaml.load(fs.readFileSync(YAML_PATH, "utf8"));
  if (!datos || !datos.titulo || !Array.isArray(datos.biografia)) {
    throw new Error("datos/inicio.yaml debe tener titulo y una lista biografia.");
  }

  reemplazarEntreMarcadores(
    INDEX_PATH,
    "<!-- INICIO:GENERADO:INICIO (no editar a mano — ver scripts/generar-inicio.js y datos/inicio.yaml) -->",
    "<!-- INICIO:GENERADO:FIN -->",
    fragmentoInicio(datos),
    "        "
  );

  reemplazarEntreMarcadores(
    INDEX_PATH,
    "<!-- COMPARTIR:GENERADO:INICIO (no editar a mano — ver scripts/generar-inicio.js y scripts/compartir.js) -->",
    "<!-- COMPARTIR:GENERADO:FIN -->",
    metaCompartir({ titulo: datos.nombre, descripcion: datos.biografia[0].es, ruta: "/" }),
    "    "
  );
}

module.exports = { generar };

if (require.main === module) generar();

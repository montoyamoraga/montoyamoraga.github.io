const fs = require("fs");
const path = require("path");
const yaml = require("../lib/js-yaml.min.js");

const ROOT = path.join(__dirname, "..");
const YAML_PATH = path.join(ROOT, "datos", "menu.yaml");
const MENU_PATH = path.join(ROOT, "js", "menu.js");

// cada generador exporta fragmentoMenu(), que arma el contenido de su sección
const GENERADORES = {
  obras: require("./generar-obras.js"),
  ensenanza: require("./generar-ensenanza.js"),
  investigacion: require("./generar-investigacion.js"),
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

// los backticks y ${ romperían el template literal de js/menu.js
function escaparTemplate(texto) {
  return texto.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$\{/g, "\\${");
}

function contenidoSeccion(seccion) {
  if (seccion.generador) {
    const generador = GENERADORES[seccion.generador];
    if (!generador) {
      throw new Error(`datos/menu.yaml: generador desconocido "${seccion.generador}".`);
    }
    return generador.fragmentoMenu();
  }

  return `            <ol>
                <li>${dualSpan(seccion.vacio)}</li>
            </ol>`;
}

function htmlSeccion(seccion) {
  if (seccion.url) {
    return `    <div class="nav-section">
        <h3><a href="${escaparHTML(seccion.url)}">${dualSpan(seccion.titulo)}</a></h3>
    </div>`;
  }

  return `    <div class="nav-section">
        <h3 class="nav-titulo">${dualSpan(seccion.titulo)}</h3>
        <div class="nav-contenido">
${contenidoSeccion(seccion)}
        </div>
    </div>`;
}

function archivoMenu(secciones) {
  const html = `
<nav class="navegacion">
    <div class="nav-section">
        <h3 class="nav-brand"><a href="/">montoyamoraga</a></h3>
    </div>

    <div class="nav-section nav-idioma">
        <h3>
            <a href="#" id="english">en</a> /
            <a href="#" id="espanol">es</a>
        </h3>
        <button class="boton-piruetas nav-toggle" aria-expanded="false" aria-controls="divLeftMenu"><span class="es">menú</span><span class="en">menu</span></button>
    </div>

${secciones.map(htmlSeccion).join("\n\n")}
</nav>
`;

  return `// generado por scripts/generar-menu.js desde datos/menu.yaml, no editar a mano.
// el comportamiento del menú vive en js/nav.js, que se carga después de este archivo.

const navbar = \`${escaparTemplate(html)}\`;
`;
}

function generar() {
  const secciones = yaml.load(fs.readFileSync(YAML_PATH, "utf8"));
  if (!Array.isArray(secciones)) {
    throw new Error("datos/menu.yaml no contiene una lista de secciones.");
  }

  secciones.forEach((seccion) => {
    const tipos = ["generador", "url", "vacio"].filter((clave) => seccion[clave]);
    if (tipos.length !== 1) {
      throw new Error(`datos/menu.yaml: la sección "${dualSpan(seccion.titulo)}" debe tener solo uno de generador, url o vacio.`);
    }
  });

  fs.writeFileSync(MENU_PATH, archivoMenu(secciones));
  console.log("Generado js/menu.js.");
}

module.exports = { generar };

if (require.main === module) generar();

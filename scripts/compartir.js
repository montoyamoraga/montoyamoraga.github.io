// etiquetas <meta> open graph ("og"), para que los enlaces compartidos
// (whatsapp, telegram, redes sociales) muestren título, descripción e imagen.
//
// las imágenes de prevista (previstas) viven en la carpeta previstas/
// del repositorio montoyamoraga-web-media. miden 1200×630 y pesan menos de
// 300 KB, porque whatsapp no muestra imágenes más pesadas.
//
// cada página usa, en orden: la prevista indicada en su YAML, la generada
// desde su primera imagen por scripts/generar-previstas.js (anotada en
// datos/previstas.json), o previstas/favicon.jpg.

const fs = require("fs");
const path = require("path");

const SITIO = "https://montoyamoraga.io";
const PREVISTAS =
  "https://cdn.jsdelivr.net/gh/montoyamoraga/montoyamoraga-web-media@main/previstas/";
const PREVISTA_POR_DEFECTO = "favicon.jpg";
const MANIFIESTO_PATH = path.join(__dirname, "..", "datos", "previstas.json");

// ruta de la página → nombre de archivo en previstas/
const previstasGeneradas = fs.existsSync(MANIFIESTO_PATH)
  ? JSON.parse(fs.readFileSync(MANIFIESTO_PATH, "utf8"))
  : {};

function escaparAtributo(valor) {
  return String(valor ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// texto plano de a lo más `largo` caracteres, cortado en un espacio
function resumir(texto, largo = 200) {
  const limpio = String(texto ?? "")
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();
  if (limpio.length <= largo) return limpio;
  return limpio.slice(0, largo).replace(/\s+\S*$/, "") + "…";
}

// acepta un nombre de archivo dentro de previstas/ o una URL completa
function urlPrevista(prevista, ruta) {
  const valor = prevista || previstasGeneradas[ruta] || PREVISTA_POR_DEFECTO;
  return /^https?:\/\//.test(valor) ? valor : PREVISTAS + valor;
}

// ruta: camino absoluto de la página en el sitio, por ejemplo /ensenanza/dis8636/
// prevista: opcional, ver urlPrevista
function metaCompartir({ titulo, descripcion, ruta, prevista }) {
  const url = SITIO + ruta;
  const imagen = urlPrevista(prevista, ruta);
  const resumen = resumir(descripcion);

  return [
    `<meta name="description" content="${escaparAtributo(resumen)}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="montoyamoraga" />`,
    `<meta property="og:locale" content="es_CL" />`,
    `<meta property="og:title" content="${escaparAtributo(titulo)}" />`,
    `<meta property="og:description" content="${escaparAtributo(resumen)}" />`,
    `<meta property="og:url" content="${escaparAtributo(url)}" />`,
    `<meta property="og:image" content="${escaparAtributo(imagen)}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
  ]
    .map((linea) => `    ${linea}`)
    .join("\n");
}

module.exports = { metaCompartir, resumir };

const fs = require("fs");
const path = require("path");
const yaml = require("../lib/js-yaml.min.js");
const { metaCompartir } = require("./compartir.js");

const ROOT = path.join(__dirname, "..");
const YAML_PATH = path.join(ROOT, "datos", "obras.yaml");
const PROYECTOS_DIR = path.join(ROOT, "proyectos");
const INDICE_PATH = path.join(PROYECTOS_DIR, "index.html");

const EXTENSIONES_VIDEO = /\.(mp4|webm|mov)$/i;
// vimeo.com/<id>, vimeo.com/<id>/<hash> (videos no listados) o player.vimeo.com/video/<id>
const URL_VIMEO = /^https?:\/\/(?:www\.|player\.)?vimeo\.com\/(?:video\/)?(\d+)(?:\/([0-9a-f]+))?/i;

const PROXIMAMENTE = { es: "próximamente.", en: "coming soon." };
const VOLVER = { es: "volver a proyectos", en: "back to projects" };
const SIN_OBRAS = { es: "sin obras publicadas", en: "no published works" };
const CREDITOS = { es: "créditos", en: "credits" };
const EXHIBICIONES = { es: "exhibiciones", en: "exhibitions" };
const ENLACES = { es: "enlaces", en: "links" };
const FOTO = { es: "foto", en: "photo" };

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

// un medio puede ser un string (la ruta del archivo) o { archivo, alt, pie, credito }
function normalizarMedio(medio) {
  return typeof medio === "string" ? { archivo: medio } : medio;
}

function vimeoHtml(id, hash, titulo) {
  const src = `https://player.vimeo.com/video/${id}${hash ? `?h=${hash}` : ""}`;
  return `<iframe src="${escaparHTML(src)}" title="${escaparHTML(titulo)}" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen loading="lazy"></iframe>`;
}

function medioHtml(medio, altPorDefecto) {
  const src = escaparHTML(medio.archivo);
  const alt = medio.alt ? textoPlano(medio.alt) : altPorDefecto;
  const vimeo = String(medio.archivo).match(URL_VIMEO);
  if (vimeo) return vimeoHtml(vimeo[1], vimeo[2], alt);
  return EXTENSIONES_VIDEO.test(medio.archivo)
    ? `<video controls playsinline preload="metadata" src="${src}"></video>`
    : `<img src="${src}" alt="${escaparHTML(alt)}" loading="lazy" decoding="async" />`;
}

function pieHtml(medio) {
  const partes = [];
  if (medio.pie) partes.push(dualSpan(medio.pie));
  if (medio.credito) partes.push(`${dualSpan(FOTO)}: ${escaparHTML(medio.credito)}`);
  return partes.length ? `\n              <p class="medio-pie">${partes.join(" · ")}</p>` : "";
}

// cada imagen o video va en su propia fila de ancho completo, después de la info
function filasMedios(obra) {
  return (obra.medios || [])
    .map(normalizarMedio)
    .map(
      (medio, i) => `
          <section class="fila fila-medio">
            <div class="fila-interior">
              ${medioHtml(medio, `${textoPlano(obra.titulo)} ${i}`)}${pieHtml(medio)}
            </div>
          </section>
`
    )
    .join("");
}

function enlaceHtml(texto, url) {
  return url ? `<a href="${escaparHTML(url)}">${texto}</a>` : texto;
}

// agrupa los créditos con el mismo rol en una sola línea, respetando el orden
function bloqueCreditos(creditos) {
  const grupos = [];
  creditos.forEach((credito) => {
    const clave = JSON.stringify(credito.rol);
    let grupo = grupos.find((g) => g.clave === clave);
    if (!grupo) {
      grupo = { clave, rol: credito.rol, nombres: [] };
      grupos.push(grupo);
    }
    grupo.nombres.push(enlaceHtml(escaparHTML(credito.nombre), credito.enlace));
  });

  return `              <h2 class="cajita">${dualSpan(CREDITOS)}</h2>
              <p>
                ${grupos.map((g) => `${dualSpan(g.rol)}: ${g.nombres.join(", ")}`).join("<br />\n                ")}
              </p>`;
}

function bloqueExhibiciones(exhibiciones) {
  const lineas = exhibiciones.map((ex) => {
    const partes = [ex.anho, ex.evento ? dualSpan(ex.evento) : null, ex.lugar ? dualSpan(ex.lugar) : null, ex.ciudad ? dualSpan(ex.ciudad) : null]
      .filter((parte) => parte !== null && parte !== undefined && parte !== "")
      .map((parte) => (typeof parte === "number" ? String(parte) : parte));
    return enlaceHtml(partes.join(", "), ex.enlace);
  });

  return `              <h2 class="cajita">${dualSpan(EXHIBICIONES)}</h2>
              <p>
                ${lineas.join("<br />\n                ")}
              </p>`;
}

function bloqueEnlaces(enlaces) {
  return `              <h2 class="cajita">${dualSpan(ENLACES)}</h2>
              <p>
                ${enlaces.map((enlace) => enlaceHtml(dualSpan(enlace.texto), enlace.url)).join("<br />\n                ")}
              </p>`;
}

function filaTexto(serie, obra) {
  const bloques = [];

  bloques.push(`              <p class="obra-meta">${dualSpan(serie.titulo)}${obra.anho ? ` · ${escaparHTML(obra.anho)}` : ""}</p>`);
  bloques.push(`              <h1 class="cajita">${dualSpan(obra.titulo)}</h1>`);

  const descripcion = obra.descripcion || [];
  if (descripcion.length > 0) {
    bloques.push(`              <p>
                ${descripcion.map((parrafo) => dualSpan(parrafo)).join("<br /><br />\n                ")}
              </p>`);
  } else if (!(obra.medios || []).length) {
    bloques.push(`              <p>${dualSpan(PROXIMAMENTE)}</p>`);
  }

  (obra.ficha || []).forEach((fila) => {
    bloques.push(`              <h2 class="cajita">${dualSpan(fila.rotulo)}</h2>
              <p>${dualSpan(fila.valor)}</p>`);
  });

  if ((obra.creditos || []).length) bloques.push(bloqueCreditos(obra.creditos));
  if ((obra.exhibiciones || []).length) bloques.push(bloqueExhibiciones(obra.exhibiciones));
  if ((obra.enlaces || []).length) bloques.push(bloqueEnlaces(obra.enlaces));

  bloques.push(`              <p><a href="/proyectos/">${dualSpan(VOLVER)}</a></p>`);

  return `          <section class="fila fila-texto">
            <div class="fila-interior">
${bloques.join("\n\n")}
            </div>
          </section>
`;
}

function paginaObra(serie, obra) {
  return `<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" type="image/png" href="/assets/favicon.ico" />
    <title>montoyamoraga - ${escaparHTML(textoPlano(obra.titulo))}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" type="text/css" href="/css/style.css" />
${metaCompartir({
  titulo: textoPlano(obra.titulo),
  descripcion: (obra.descripcion || []).length
    ? textoPlano(obra.descripcion[0])
    : `${textoPlano(serie.titulo)}${obra.anho ? ` · ${obra.anho}` : ""}`,
  ruta: `/proyectos/${serie.slug}/${obra.slug}/`,
  prevista: obra.prevista,
})}
  </head>
  <body>
    <div class="flex-container">
      <div class="left" id="divLeftMenu"></div>

      <div class="right right--flush">
        <div class="filas">
${filaTexto(serie, obra)}${filasMedios(obra)}        </div>
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

function obrasDe(serie) {
  return serie.obras || [];
}

function generarPaginas(series) {
  series.forEach((serie) => {
    const carpetaSerie = path.join(PROYECTOS_DIR, serie.slug);
    const obrasEsperadas = new Set(obrasDe(serie).map((obra) => obra.slug));
    if (fs.existsSync(carpetaSerie)) {
      fs.readdirSync(carpetaSerie)
        .filter((entrada) => fs.statSync(path.join(carpetaSerie, entrada)).isDirectory() && !obrasEsperadas.has(entrada))
        .forEach((entrada) =>
          console.warn(`aviso: proyectos/${serie.slug}/${entrada}/ no está en datos/obras.yaml (no se toca ni se borra)`)
        );
    }

    obrasDe(serie).forEach((obra) => {
      const carpeta = path.join(carpetaSerie, obra.slug);
      if (!fs.existsSync(carpeta)) fs.mkdirSync(carpeta, { recursive: true });
      fs.writeFileSync(path.join(carpeta, "index.html"), paginaObra(serie, obra));
    });
  });

  const total = series.reduce((suma, serie) => suma + obrasDe(serie).length, 0);
  console.log(`Generadas ${total} páginas en proyectos/<serie>/<obra>/index.html.`);
}

function fragmentoIndice(series) {
  return series
    .map((serie) => {
      const items = obrasDe(serie).length
        ? obrasDe(serie)
            .map(
              (obra) => `            <li class="obra-item">
              <a class="obra-link" href="/proyectos/${serie.slug}/${obra.slug}/">${dualSpan(obra.titulo)}</a>
            </li>`
            )
            .join("\n")
        : `            <li class="obra-item">${dualSpan(SIN_OBRAS)}</li>`;

      return `        <section class="serie">
          <h2 class="serie-titulo">
            ${dualSpan(serie.titulo)}
          </h2>
          <ol class="obra-lista">
${items}
          </ol>
        </section>`;
    })
    .join("\n\n");
}

// lo usa scripts/generar-menu.js para armar la sección de proyectos
function fragmentoMenu() {
  return cargar()
    .map((serie) => {
      const items = obrasDe(serie).length
        ? obrasDe(serie)
            .map((obra) => `                <li><a href="/proyectos/${serie.slug}/${obra.slug}/">${dualSpan(obra.titulo)}</a></li>`)
            .join("\n")
        : `                <li>${dualSpan(SIN_OBRAS)}</li>`;

      return `            <h5>${dualSpan(serie.titulo)}</h5>
            <ol>
${items}
            </ol>`;
    })
    .join("\n\n");
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

function actualizarIndice(series) {
  reemplazarEntreMarcadores(
    INDICE_PATH,
    "<!-- OBRAS:GENERADO:INICIO (no editar a mano — ver scripts/generar-obras.js y datos/obras.yaml) -->",
    "<!-- OBRAS:GENERADO:FIN -->",
    fragmentoIndice(series),
    "        "
  );
}

function cargar() {
  const series = yaml.load(fs.readFileSync(YAML_PATH, "utf8"));
  if (!Array.isArray(series)) {
    throw new Error("datos/obras.yaml no contiene una lista de series.");
  }
  return series;
}

function generar() {
  const series = cargar();
  generarPaginas(series);
  actualizarIndice(series);
}

module.exports = { generar, fragmentoMenu };

if (require.main === module) generar();

// genera las imágenes de prevista (1200×630 jpg) que se muestran al compartir
// un enlace de una obra, un curso o un proyecto de investigación, a partir de
// su primera imagen. las guarda en previstas/ del repositorio
// montoyamoraga-web-media y anota en datos/previstas.json qué página usa cuál,
// para que scripts/compartir.js las encuentre.
//
// las páginas sin imagen usan previstas/favicon.jpg, hecha desde
// assets/favicon.png. un campo prevista en el YAML tiene prioridad.
//
// se corre a mano en local, no en el GitHub Action, porque necesita ffmpeg y
// el repositorio montoyamoraga-web-media clonado al lado de este:
//   node scripts/generar-previstas.js
// otra ubicación del repositorio de medios: MEDIOS_DIR=/ruta node scripts/generar-previstas.js

const fs = require("fs");
const os = require("os");
const path = require("path");
const { execFileSync } = require("child_process");
const yaml = require("../lib/js-yaml.min.js");

const ROOT = path.join(__dirname, "..");
const MEDIOS_DIR = process.env.MEDIOS_DIR || path.join(ROOT, "..", "montoyamoraga-web-media");
const PREVISTAS_DIR = path.join(MEDIOS_DIR, "previstas");
const MANIFIESTO_PATH = path.join(ROOT, "datos", "previstas.json");
const FAVICON_PATH = path.join(ROOT, "assets", "favicon.png");
const PREVISTA_FAVICON = "favicon.jpg";

const URL_MEDIOS = "https://cdn.jsdelivr.net/gh/montoyamoraga/montoyamoraga-web-media@main/";
const EXTENSIONES_VIDEO = /\.(mp4|webm|mov)$/i;
const VIMEO = /^https?:\/\/(?:www\.)?vimeo\.com\/(\d+)/;
const PESO_MAXIMO = 300 * 1024; // whatsapp no muestra previstas más pesadas

const TEMPORAL = fs.mkdtempSync(path.join(os.tmpdir(), "previstas-"));

function cargar(nombre) {
  return yaml.load(fs.readFileSync(path.join(ROOT, "datos", nombre), "utf8")) || [];
}

function archivoDe(medio) {
  return typeof medio === "string" ? medio : medio.archivo;
}

// las imágenes van antes que los videos: un video solo se usa si no hay imagen
function ordenarMedios(medios) {
  const archivos = (medios || []).map(archivoDe).filter(Boolean);
  const esVideo = (archivo) => EXTENSIONES_VIDEO.test(archivo) || VIMEO.test(archivo);
  return [...archivos.filter((a) => !esVideo(a)), ...archivos.filter(esVideo)];
}

function paginas() {
  const lista = [];

  cargar("obras.yaml").forEach((serie) =>
    (serie.obras || []).forEach((obra) =>
      lista.push({
        ruta: `/proyectos/${serie.slug}/${obra.slug}/`,
        nombre: `obras-${serie.slug}-${obra.slug}.jpg`,
        prevista: obra.prevista,
        medios: ordenarMedios(obra.medios),
      })
    )
  );

  cargar("ensenanza.yaml").forEach((curso) =>
    lista.push({
      ruta: `/ensenanza/${curso.slug}/`,
      nombre: `ensenanza-${curso.slug}.jpg`,
      prevista: curso.prevista,
      medios: (curso.imagenes || []).map((imagen) =>
        /^https?:\/\//.test(imagen) ? imagen : `${URL_MEDIOS}ensenanza-${curso.slug}/jpg/${imagen}`
      ),
    })
  );

  cargar("investigacion.yaml").forEach((grupo) =>
    (grupo.proyectos || []).forEach((proyecto) =>
      lista.push({
        ruta: `/investigacion/${proyecto.slug}/`,
        nombre: `investigacion-${proyecto.slug}.jpg`,
        prevista: proyecto.prevista,
        medios: ordenarMedios(proyecto.medios),
      })
    )
  );

  return lista;
}

// del webp de previsualización vuelve al original en jpg/ o png/, que tiene más calidad
function originalDeWebp(ruta) {
  const match = ruta.match(/^(.*)\/webp\/([^/]+)\.webp$/);
  if (!match) return ruta;
  const [, carpeta, base] = match;
  for (const formato of ["jpg", "png"]) {
    for (const extension of [formato, "jpeg"]) {
      const candidato = path.join(carpeta, formato, `${base}.${extension}`);
      if (fs.existsSync(candidato)) return candidato;
    }
  }
  return ruta;
}

async function descargar(url, destino) {
  const respuesta = await fetch(url);
  if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status}`);
  fs.writeFileSync(destino, Buffer.from(await respuesta.arrayBuffer()));
  return destino;
}

// devuelve una ruta local a la imagen (o video) de origen, o null si no está
async function origenLocal(archivo, indice) {
  const vimeo = archivo.match(VIMEO);
  if (vimeo) {
    const respuesta = await fetch(`https://vimeo.com/api/oembed.json?url=${encodeURIComponent(archivo)}&width=1920`);
    if (!respuesta.ok) throw new Error(`vimeo oembed HTTP ${respuesta.status}`);
    const { thumbnail_url } = await respuesta.json();
    return descargar(thumbnail_url, path.join(TEMPORAL, `vimeo-${vimeo[1]}.jpg`));
  }

  let local = null;
  if (archivo.startsWith(URL_MEDIOS)) local = path.join(MEDIOS_DIR, decodeURIComponent(archivo.slice(URL_MEDIOS.length)));
  else if (archivo.startsWith("/")) local = path.join(ROOT, decodeURIComponent(archivo));
  else if (/^https?:\/\//.test(archivo)) {
    return descargar(archivo, path.join(TEMPORAL, `descarga-${indice}${path.extname(new URL(archivo).pathname)}`));
  }

  if (!local) return null;
  local = originalDeWebp(local);
  return fs.existsSync(local) ? local : null;
}

// recorta al centro a 1200×630 y baja la calidad hasta que pese menos de 300 KB
function recortar(origen, destino, { cuadroDeVideo = false, filtro = "lanczos" } = {}) {
  const entrada = cuadroDeVideo ? ["-ss", "1", "-i", origen, "-frames:v", "1"] : ["-i", origen, "-frames:v", "1"];
  for (const calidad of [3, 5, 7, 10, 14]) {
    execFileSync("ffmpeg", [
      "-v", "error", "-y", ...entrada,
      "-vf", `scale=1200:630:force_original_aspect_ratio=increase:flags=${filtro},crop=1200:630`,
      "-q:v", String(calidad), destino,
    ]);
    if (fs.statSync(destino).size <= PESO_MAXIMO) return;
  }
}

async function generarPrevista(pagina) {
  for (const [indice, archivo] of pagina.medios.entries()) {
    try {
      const origen = await origenLocal(archivo, indice);
      if (!origen) {
        console.warn(`aviso: ${pagina.ruta} — no se encontró ${archivo}`);
        continue;
      }
      recortar(origen, path.join(PREVISTAS_DIR, pagina.nombre), { cuadroDeVideo: EXTENSIONES_VIDEO.test(origen) });
      return pagina.nombre;
    } catch (error) {
      console.warn(`aviso: ${pagina.ruta} — no se pudo usar ${archivo}: ${error.message}`);
    }
  }
  return null;
}

async function generar() {
  if (!fs.existsSync(MEDIOS_DIR)) {
    throw new Error(`No se encontró el repositorio de medios en ${MEDIOS_DIR} (ver MEDIOS_DIR).`);
  }
  fs.mkdirSync(PREVISTAS_DIR, { recursive: true });

  // las franjas del favicon son horizontales: se amplían sin suavizar para que sigan nítidas
  recortar(FAVICON_PATH, path.join(PREVISTAS_DIR, PREVISTA_FAVICON), { filtro: "neighbor" });

  const manifiesto = {};
  const conFavicon = [];
  for (const pagina of paginas()) {
    if (pagina.prevista) continue; // la prevista elegida a mano en el YAML gana
    const nombre = await generarPrevista(pagina);
    if (nombre) manifiesto[pagina.ruta] = nombre;
    else conFavicon.push(pagina.ruta);
  }

  fs.writeFileSync(MANIFIESTO_PATH, JSON.stringify(manifiesto, null, 2) + "\n");
  fs.rmSync(TEMPORAL, { recursive: true, force: true });

  console.log(`Generadas ${Object.keys(manifiesto).length} previstas en ${path.relative(ROOT, PREVISTAS_DIR)}/.`);
  if (conFavicon.length) console.log(`Sin imagen, usan ${PREVISTA_FAVICON}:\n  ${conFavicon.join("\n  ")}`);
  console.log("Correr node scripts/generar-sitio.js para actualizar las páginas.");
}

module.exports = { generar };

if (require.main === module) {
  generar().catch((error) => {
    console.error(error.message);
    process.exit(1);
  });
}

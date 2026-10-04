# montoyamoraga.github.io

## créditos

página web creada por @montoyamoraga y desde 2026 mantenida por @janisepulveda.

## cómo se genera el sitio

cada push a `main` que cambie un archivo `datos/*.yaml` o `scripts/*.js` corre el GitHub Action `.github/workflows/generar-sitio.yml`. este corre `node scripts/generar-sitio.js`, que ejecuta todos los generadores (`generar-inicio.js`, `generar-enlaces.js`, `generar-ensenanza.js`, `generar-obras.js`, `generar-investigacion.js`, `generar-menu.js`) y commitea los cambios automáticamente. el HTML entre marcadores `GENERADO:INICIO` / `GENERADO:FIN` no se edita a mano: se edita el YAML o la plantilla del script. para agregar una sección nueva generada, crear su script con una función `generar()` exportada y sumarlo a `scripts/generar-sitio.js`.

### hook de pre-commit (recomendado)

para no tener que hacer `git pull` después de cada push, activar una vez por clon el hook que regenera el sitio antes de cada commit que toque `datos/*.yaml` o `scripts/*.js`, y agrega el HTML generado al mismo commit:

```sh
git config core.hooksPath .githooks
```

requiere node. si node no está disponible, el commit sigue igual y el GitHub Action regenera el sitio.

## previsualización al compartir enlaces

las páginas generadas incluyen etiquetas open graph (ver `scripts/compartir.js`), para que whatsapp, telegram y redes sociales muestren título, descripción e imagen. esa imagen se llama prevista, y vive en la carpeta `previstas/` del repositorio [montoyamoraga-web-media](https://github.com/montoyamoraga/montoyamoraga-web-media). cada página usa, en orden:

1. la indicada en el campo `prevista` de su YAML, si existe.
2. una generada desde la primera imagen de la obra, curso o proyecto de investigación (o desde el primer video si no hay imágenes).
3. `previstas/favicon.jpg`, hecha desde `assets/favicon.png`.

para generar las previstas del punto 2, después de agregar o cambiar imágenes, correr en local (requiere ffmpeg y el repositorio montoyamoraga-web-media clonado al lado de este):

```sh
node scripts/generar-previstas.js
node scripts/generar-sitio.js
```

el primero recorta cada imagen a 1200×630, la guarda en `previstas/` del repositorio de medios y anota en `datos/previstas.json` qué página usa cuál. hay que hacer push de ambos repositorios.

## cómo editar la página de inicio

el título y la biografía de `index.html` se generan a partir de `datos/inicio.yaml`. para editarlos, editar ese archivo (el schema está documentado en un comentario al inicio) y hacer push a `main`.

## cómo agregar un enlace

la página `enlaces/index.html` se genera completa a partir de `datos/enlaces.yaml`. para agregar, quitar o reordenar enlaces, editar ese archivo (el schema está documentado en un comentario al inicio) y hacer push a `main`.

## cómo agregar un curso de enseñanza

las páginas de `ensenanza/` y el menú de enseñanza en `js/menu.js` se generan automáticamente a partir de `datos/ensenanza.yaml`. para agregar o editar un curso:

1. editar `datos/ensenanza.yaml` (el schema está documentado en un comentario al inicio del archivo).
2. opcionalmente subir las fotos del curso al repositorio [montoyamoraga-web-media](https://github.com/montoyamoraga/montoyamoraga-web-media), en `ensenanza-<slug>/jpg/`, y listar sus nombres de archivo en `imagenes`.
3. hacer push a `main`.

el GitHub Action `.github/workflows/generar-sitio.yml` corre `node scripts/generar-sitio.js`, que regenera `ensenanza/<slug>/index.html` y el menú de enseñanza, y commitea los cambios automáticamente. también se puede correr el script a mano en local para previsualizar el resultado antes de hacer push.

## cómo agregar una obra

las páginas de obras en `proyectos/<serie>/<obra>/`, la lista de series en `proyectos/index.html` y el menú de proyectos en `js/menu.js` se generan automáticamente a partir de `datos/obras.yaml`. para agregar o editar una obra:

1. editar `datos/obras.yaml` (el schema está documentado en un comentario al inicio del archivo).
2. subir las fotos al repositorio [montoyamoraga-web-media](https://github.com/montoyamoraga/montoyamoraga-web-media) y enlazarlas desde `medios`, o usar archivos de `assets/`.
3. hacer push a `main`.

el GitHub Action `.github/workflows/generar-sitio.yml` corre `node scripts/generar-sitio.js`, que regenera esas páginas y commitea los cambios automáticamente. también se puede correr el script a mano en local para previsualizar el resultado antes de hacer push.

## cómo agregar un proyecto de investigación

las páginas de `investigacion/<slug>/` y el menú de investigación en `js/menu.js` se generan automáticamente a partir de `datos/investigacion.yaml`. para agregar o editar un proyecto (por ejemplo una tesis):

1. editar `datos/investigacion.yaml` (el schema está documentado en un comentario al inicio del archivo).
2. opcionalmente subir las fotos al repositorio [montoyamoraga-web-media](https://github.com/montoyamoraga/montoyamoraga-web-media) y enlazarlas desde `medios`.
3. hacer push a `main`.

un proyecto sin descripción ni medios se muestra como "próximamente".

## cómo editar el menú

el menú lateral se genera completo en `js/menu.js` a partir de `datos/menu.yaml`, que define el orden de las secciones y si cada una es un enlace directo (cv, enlaces, contacto), una sección vacía (performance) o una sección cuyo contenido sale de otro YAML (proyectos, enseñanza, investigación). `js/menu.js` no se edita a mano.

el comportamiento del menú (abrir y cerrar, marcar el enlace activo, el pie de página) vive en `js/nav.js`, que sí se edita a mano. toda página nueva debe cargar `js/menu.js` antes de `js/nav.js`:

```html
<script src="/js/menu.js"></script>
<script src="/js/nav.js"></script>
```

## bibliografía

- <https://medium.com/@nohanabil/building-a-multilingual-static-website-a-step-by-step-guide-7af238cc8505>
- <https://stackoverflow.com/a/68909928>

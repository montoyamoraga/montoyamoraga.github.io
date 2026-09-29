# montoyamoraga.github.io

## créditos

página web creada por @montoyamoraga y desde 2026 mantenida por @janisepulveda.

## cómo se genera el sitio

cada push a `main` que cambie un archivo `datos/*.yaml` o `scripts/*.js` corre el GitHub Action `.github/workflows/generar-sitio.yml`. este corre `node scripts/generar-sitio.js`, que ejecuta todos los generadores (`generar-inicio.js`, `generar-enlaces.js`, `generar-ensenanza.js`, `generar-obras.js`) y commitea los cambios automáticamente. el HTML entre marcadores `GENERADO:INICIO` / `GENERADO:FIN` no se edita a mano: se edita el YAML o la plantilla del script. para agregar una sección nueva generada, crear su script con una función `generar()` exportada y sumarlo a `scripts/generar-sitio.js`.

### hook de pre-commit (recomendado)

para no tener que hacer `git pull` después de cada push, activar una vez por clon el hook que regenera el sitio antes de cada commit que toque `datos/*.yaml` o `scripts/*.js`, y agrega el HTML generado al mismo commit:

```sh
git config core.hooksPath .githooks
```

requiere node. si node no está disponible, el commit sigue igual y el GitHub Action regenera el sitio.

## previsualización al compartir enlaces

las páginas generadas incluyen etiquetas open graph (ver `scripts/compartir.js`), para que whatsapp, telegram y redes sociales muestren título, descripción e imagen. esa imagen se llama prevista, y vive en la carpeta `previstas/` del repositorio [montoyamoraga-web-media](https://github.com/montoyamoraga/montoyamoraga-web-media). cada curso u obra puede indicar la suya con el campo `prevista` en su YAML; si no, se usa `previstas/sitio.jpg`.

## cómo editar la página de inicio

el título y la biografía de `index.html` se generan a partir de `datos/inicio.yaml`. para editarlos, editar ese archivo (el schema está documentado en un comentario al inicio) y hacer push a `main`.

## cómo agregar un enlace

la página `enlaces/index.html` se genera completa a partir de `datos/enlaces.yaml`. para agregar, quitar o reordenar enlaces, editar ese archivo (el schema está documentado en un comentario al inicio) y hacer push a `main`.

## cómo agregar un curso de enseñanza

las páginas de `ensenanza/` y el menú de enseñanza en `js/nav.js` se generan automáticamente a partir de `datos/ensenanza.yaml`. para agregar o editar un curso:

1. editar `datos/ensenanza.yaml` (el schema está documentado en un comentario al inicio del archivo).
2. opcionalmente subir las fotos del curso al repositorio [montoyamoraga-web-media](https://github.com/montoyamoraga/montoyamoraga-web-media), en `ensenanza-<slug>/jpg/`, y listar sus nombres de archivo en `imagenes`.
3. hacer push a `main`.

el GitHub Action `.github/workflows/generar-sitio.yml` corre `node scripts/generar-sitio.js`, que regenera `ensenanza/<slug>/index.html` y el menú de enseñanza, y commitea los cambios automáticamente. también se puede correr el script a mano en local para previsualizar el resultado antes de hacer push.

## cómo agregar una obra

las páginas de obras en `proyectos/<serie>/<obra>/`, la lista de series en `proyectos/index.html` y el menú de proyectos en `js/nav.js` se generan automáticamente a partir de `datos/obras.yaml`. para agregar o editar una obra:

1. editar `datos/obras.yaml` (el schema está documentado en un comentario al inicio del archivo).
2. subir las fotos al repositorio [montoyamoraga-web-media](https://github.com/montoyamoraga/montoyamoraga-web-media) y enlazarlas desde `medios`, o usar archivos de `assets/`.
3. hacer push a `main`.

el GitHub Action `.github/workflows/generar-sitio.yml` corre `node scripts/generar-sitio.js`, que regenera esas páginas y commitea los cambios automáticamente. también se puede correr el script a mano en local para previsualizar el resultado antes de hacer push.

## bibliografía

- <https://medium.com/@nohanabil/building-a-multilingual-static-website-a-step-by-step-guide-7af238cc8505>
- <https://stackoverflow.com/a/68909928>

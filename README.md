# montoyamoraga.github.io

## créditos

página web creada por @montoyamoraga y desde 2026 mantenida por @janisepulveda.

## cómo agregar un curso de enseñanza

las páginas de `ensenanza/` y el menú de enseñanza en `js/nav.js` se generan automáticamente a partir de `datos/ensenanza.yaml`. para agregar o editar un curso:

1. editar `datos/ensenanza.yaml` (el schema está documentado en un comentario al inicio del archivo).
2. opcionalmente agregar las fotos del curso en `ensenanza/<slug>/images/`.
3. hacer push a `main`.

el GitHub Action `.github/workflows/generar-ensenanza.yml` corre `node scripts/generar-ensenanza.js`, que regenera `ensenanza/<slug>/index.html` y el menú de enseñanza, y commitea los cambios automáticamente. también se puede correr el script a mano en local para previsualizar el resultado antes de hacer push.

## bibliografía

- <https://medium.com/@nohanabil/building-a-multilingual-static-website-a-step-by-step-guide-7af238cc8505>
- <https://stackoverflow.com/a/68909928>

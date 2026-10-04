// corre todos los generadores del sitio, en orden
const generadores = [
  require("./generar-inicio.js"),
  require("./generar-enlaces.js"),
  require("./generar-ensenanza.js"),
  require("./generar-obras.js"),
  require("./generar-investigacion.js"),
  require("./generar-menu.js"),
];

generadores.forEach((generador) => generador.generar());

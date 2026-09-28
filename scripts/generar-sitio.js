// corre todos los generadores del sitio, en orden
const generadores = [
  require("./generar-inicio.js"),
  require("./generar-ensenanza.js"),
  require("./generar-obras.js"),
];

generadores.forEach((generador) => generador.generar());

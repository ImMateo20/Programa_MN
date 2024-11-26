import {
  iniciarMetodo,
  procesarBiseccion,
} from "../utils/biseccion/metodoBiseccion.js";
import { obtenerValoresPF } from "../utils/punto_fijo/metodoPuntoFijo.js";

const mostrarPagBiseccion = (req, res) => {
  res.render("layouts/Biseccion");
};

const metodoBiseccion = async (req, res) => {
  const { expresion } = req.body;

  // console.log(expresion);
  const resultado = await iniciarMetodo(expresion);
  // console.log(resultado);
  res.send(resultado);
};

const mostrarPagPuntoFijo = (req, res) => {
  res.render("layouts/PuntoFijo");
};

const metodoPuntoFijo = async (req, res) => {
  const { expre, exprep, valorp } = req.body;
  const resultado = await obtenerValoresPF(expre, exprep, valorp);
  // console.log(resultado)
  res.send(resultado);
};

export {
  mostrarPagBiseccion,
  metodoBiseccion,
  mostrarPagPuntoFijo,
  metodoPuntoFijo,
};

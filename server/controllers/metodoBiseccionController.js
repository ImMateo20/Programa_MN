import { procesarBiseccion } from "../utils/metodoBiseccion.js";

const mostrarPagBiseccion = (req, res) => {
  res.render("layouts/Biseccion");
};

const metodoBiseccion = async (req, res) => {
  const { expresion } = req.body;

  console.log(expresion);
  procesarBiseccion(expresion);
};

export { mostrarPagBiseccion, metodoBiseccion };

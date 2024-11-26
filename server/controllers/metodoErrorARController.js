import { obtenerErrorAyR } from "../utils/error_ar/errorAbsRel.js";

const mostrarPagErrorAR = (req, res) => {
  res.render("layouts/ErrorAR");
};

// Ruta para procesar solicitudes POST
const metodoErrorAR = (req, res) => {
  //Solicitud para operar y regresar los valores de errores
  const body = req.body;

  console.log(body);

  const resultadosE = obtenerErrorAyR(
    body.valorVerdadero,
    body.valorAproximado
  );

  res.json(resultadosE);
};

export { mostrarPagErrorAR, metodoErrorAR };

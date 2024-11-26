import { crearGrafica } from "../utils/grafico/metodoGrafico.js";

const mostrarPagGraficadora = (req, res) => {
  res.render("layouts/Graficadora");
};

const metodoGrafico = async (req, res) => {
  const body = req.body;
  
  const buffer = await crearGrafica(body.expresion);

  res.setHeader("Content-Type", "image/jpg");
  res.send(buffer);
};

export { mostrarPagGraficadora, metodoGrafico };

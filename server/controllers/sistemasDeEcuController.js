import { recibirSVG_GJ } from "../utils/gaussMathJax.js";
import { recibirSVG_EG } from "../utils/eliminacionMathJax.js";

const mostrarPagGaussJordan = (req, res) => {
  res.render("layouts/GaussJordan");
};

const mostrarPagEliminacionG = (req, res) => {
  res.render("layouts/EliminacionG");
};

const mostrarPagDescomposicionLU = (req, res) => {
  res.render("layouts/DescomposicionLU");
};

const gaussJordan = async (req, res) => {
  const svg = await recibirSVG_GJ();
  res.send(svg);
};

const eliminacionGaussiana = async (req, res) => {
  const svg = await recibirSVG_EG();
  res.send(svg);
};

export {
  mostrarPagGaussJordan,
  mostrarPagEliminacionG,
  mostrarPagDescomposicionLU,
  gaussJordan,
  eliminacionGaussiana,
};

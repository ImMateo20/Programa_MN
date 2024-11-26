import { recibirSVG_GJ } from "../utils/gauss_jordan/gaussMathJax.js";
import { recibirSVG_EG } from "../utils/eliminacion_gaussiana/eliminacionMathJax.js";
import { recibirSVG_DLU } from "../utils/descomposicion_lu/descomposicionMathJax.js";
import { recibirSVG_MK } from "../utils/krilov/krilovMathJax.js";

const mostrarPagGaussJordan = (req, res) => {
  res.render("layouts/GaussJordan");
};

const mostrarPagEliminacionG = (req, res) => {
  res.render("layouts/EliminacionG");
};

const mostrarPagDescomposicionLU = (req, res) => {
  res.render("layouts/DescomposicionLU");
};

const mostrarPagKrilov = (req, res) => {
  res.render("layouts/Krilov");
};

const gaussJordan = async (req, res) => {
  const sistema = req.body;

  const svg = await recibirSVG_GJ(sistema);
  res.send(svg);
};

const eliminacionGaussiana = async (req, res) => {
  const sistema = req.body;

  const svg = await recibirSVG_EG(sistema);
  res.send(svg);
};

const descomposicionLU = async (req, res) => {
  const sistema = req.body;

  const svg = await recibirSVG_DLU(sistema);
  res.send(svg);
};

const krilov = async (req, res) => {
  const sistema = req.body;

  const svg = await recibirSVG_MK(sistema);
  res.send(svg);
};

export {
  mostrarPagGaussJordan,
  mostrarPagEliminacionG,
  mostrarPagDescomposicionLU,
  mostrarPagKrilov,
  gaussJordan,
  eliminacionGaussiana,
  descomposicionLU,
  krilov,
};

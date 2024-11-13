import express from "express";
import {
  mostrarPagGaussJordan,
  mostrarPagEliminacionG,
  mostrarPagDescomposicionLU,
  gaussJordan,
  eliminacionGaussiana,
} from "../controllers/sistemasDeEcuController.js";
const router = express.Router();

router.get("/gauss-jordan", mostrarPagGaussJordan);
router.post("/gauss-jordan/procesar", gaussJordan);
router.get("/eliminacion-g", mostrarPagEliminacionG);
router.post("/eliminacion-g/procesar", eliminacionGaussiana);
router.get("/descomposicion-lu", mostrarPagDescomposicionLU);

export default router;

import express from "express";
import {
  mostrarPagGraficadora,
  metodoGrafico,
} from "../controllers/metodoGraficoController.js";
const router = express.Router();

router.get("/metodo-grafico", mostrarPagGraficadora);
router.post("/metodo-grafico/procesar", metodoGrafico);

export default router;

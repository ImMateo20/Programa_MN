import express from "express";
import {
  mostrarPagBiseccion,
  metodoBiseccion,
  mostrarPagPuntoFijo,
  metodoPuntoFijo,
} from "../controllers/metodoBiseccionController.js";
const router = express.Router();

router.get("/metodo-biseccion", mostrarPagBiseccion);
router.post("/metodo-biseccion/procesar", metodoBiseccion);
router.get("/metodo-punto-fijo", mostrarPagPuntoFijo);
router.post("/metodo-punto-fijo/procesar", metodoPuntoFijo);

export default router;

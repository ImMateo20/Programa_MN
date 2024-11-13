import express from "express";
import {
  mostrarPagBiseccion,
  metodoBiseccion,
} from "../controllers/metodoBiseccionController.js";
const router = express.Router();

router.get("/metodo-biseccion", mostrarPagBiseccion);
router.post("/metodo-biseccion/procesar", metodoBiseccion);

export default router;

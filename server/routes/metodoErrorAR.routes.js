import express from "express";
import {
  metodoErrorAR,
  mostrarPagErrorAR,
} from "../controllers/metodoErrorARController.js";
const router = express.Router();

router.get("/metodo-error-rya", mostrarPagErrorAR);

router.post("/metodo-error-rya/procesar", metodoErrorAR);

export default router;

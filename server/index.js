// Importaciones de módulos y archivos
import express from "express";
import PORT from "./port.js";
import path from "path";
import { fileURLToPath } from "url";
import { obtenerErrorAyR } from "./utils/errorAbsRel.js";
import { crearGrafica } from "./utils/metodoGrafico.js";
import { procesarBiseccion } from "./utils/metodoBiseccion.js";
import { recibirSVGM } from "./utils/mathjax.js";
import mathjax from "mathjax-node";

// Configuración de rutas de archivo
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Inicialización de la aplicación Express
const app = express();

// Configuración del motor de vistas
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "..", "client", "views"));

// Middleware para análisis de cuerpo de solicitudes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware para servir archivos estáticos
app.use("/ruta", express.static(path.join(__dirname, "../")));

// Rutas para renderizar vistas
app.get("/", (req, res) => {
  // res.sendFile(path.join(__dirname, "../client/index.html"));

  res.render("pages/index");
});

app.get("/Error_RyA", (req, res) => {
  res.render("pages/ErrorAR");
});

app.get("/Graficadora", (req, res) => {
  res.render("pages/Graficadora");
});

app.get("/Biseccion", (req, res) => {
  res.render("pages/Biseccion");
});

app.get("/EliminacionG", (req, res) => {
  res.render("pages/EliminacionGaussiana");
});

// Ruta para procesar solicitudes POST
app.post("/operar_error_AyR", (req, res) => {
  //Solicitud para operar y regresar los valores de errores
  const body = req.body;

  console.log(body);

  const resultadosE = obtenerErrorAyR(
    body.valorVerdadero,
    body.valorAproximado
  );

  res.json(resultadosE);
});

app.post("/crear_grafica", async (req, res) => {
  //Solicitud para crear y regresar la grafica
  const body = req.body;

  const buffer = await crearGrafica(body.expresion);

  res.setHeader("Content-Type", "image/jpg");
  res.send(buffer);
});

app.post("/procesar_biseccion", async (req, res) => {
  const { expresion } = req.body;

  console.log(expresion);
  procesarBiseccion(expresion);
});

app.post("/procesar_eliminacion", async (req, res) => {
  const svg = await recibirSVGM();
  res.send(svg);
});

// Inicio del servidor
app.listen(PORT, () => {
  console.log(`El servidor está escuchando en el puerto ${PORT}`);
});

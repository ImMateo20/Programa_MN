// Importaciones de módulos y archivos
import express from "express";
import PORT from "./port.js";
import path from "path";
import { fileURLToPath } from "url";
import indexRoutes from "./routes/index.routes.js";
import metodoErrorARRoutes from "./routes/metodoErrorAR.routes.js";
import metodoBiseccionRoutes from "./routes/metodoBiseccion.routes.js";
import metodoGraficoRoutes from "./routes/metodoGrafico.routes.js";
import sistemasDeEcuacionesRoutes from "./routes/sistemasDeEcu.routes.js";

// Configuración de rutas de archivo
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Inicialización de la aplicación Express
const app = express();

// Configuración del motor de vistas

app.set("view engine", "ejs");
// app.set("views", path.join(__dirname, "..", "client", "views"));
app.set("views", path.join(__dirname, "views"));

// Middleware para análisis de cuerpo de solicitudes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware para servir archivos estáticos
// app.use("/ruta", express.static(path.join(__dirname, "../")));
app.use(express.static(path.join(__dirname, "public")));


app.use(indexRoutes);
app.use(metodoErrorARRoutes);
app.use(metodoBiseccionRoutes);
app.use(metodoGraficoRoutes);
app.use("/sistemas-de-ecuaciones", sistemasDeEcuacionesRoutes);

// Inicio del servidor
app.listen(PORT, "0.0.0.0", () => {
  console.log(`El servidor está escuchando en el puerto ${PORT}`);
});

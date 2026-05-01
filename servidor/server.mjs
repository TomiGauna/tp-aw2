import express from "express";
import path from "node:path";
import { fileURLToPath } from "url";

const PUERTO = 3000;
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* =============================
   MIDDLEWARE
============================= */
app.use(express.static(path.resolve(__dirname, "..", "cliente", "public")));

/* =============================
   RUTAS
============================= */
app.get("/", (req, res) => {
    res.sendFile(path.resolve(__dirname, "public", "index.html"));
});

app.get("/catalogo", (req, res) => {
    res.sendFile(path.resolve(__dirname, "..", "cliente", "public", "views", "catalogo.html"))
})

app.get("/favoritos", (req, res) => {
    res.sendFile(path.resolve(__dirname, "..", "cliente", "public", "views", "favoritos.html"));
});

app.get("/carrito", (req, res) => {
    res.sendFile(path.resolve(__dirname, "..", "cliente", "public", "views", "carrito.html"));
});

app.get("/confirmacion", (req, res) => {
    res.sendFile(path.resolve(__dirname, "..", "cliente", "public", "views", "confirmacionCompra.html"));
});

app.get("/producto/:id", (req, res) => {
    res.sendFile(path.resolve(__dirname, "..", "cliente", "public", "views", "ProductoDetalle.html"));
});

app.get("/login", (req, res) => {
    res.sendFile(path.resolve(__dirname, "..", "cliente", "public", "views", "login.html"));
})

/* =============================
   RUTA 404
============================= */
app.use((req, res) => {
  res.status(404).send(`
    <h1>404 - Página no encontrada</h1>
    <p>La ruta solicitada no existe.</p>
    <a href="/">Volver al inicio</a>
  `);
});

/* =============================
   SERVIDOR
============================= */
app.listen(PUERTO, () => {
  console.log(`Servidor corriendo en http://localhost:${PUERTO}`);
});


// Configuración de la app Express. No llama a listen: eso lo hace src/index.js.
const express = require("express");
const mongoose = require("mongoose");
const plantasRouter = require("./routes/plantas");
const riegosRouter = require("./routes/riegos");

const app = express();

app.use(express.json());

app.use("/api/plantas", plantasRouter);
app.use("/api/riegos", riegosRouter);

// Manejador común de errores (spec 01, sección 2). Express 5 le pasa también
// los errores de los handlers async.
app.use((error, req, res, next) => {
  if (error instanceof mongoose.Error.ValidationError) {
    const detalles = Object.fromEntries(
      Object.entries(error.errors).map(([campo, e]) => [campo, e.message]),
    );
    return res.status(400).json({ error: "Datos inválidos", detalles });
  }
  if (error.type === "entity.parse.failed") {
    return res.status(400).json({ error: "El cuerpo no es un JSON válido" });
  }
  console.error(error);
  res.status(500).json({ error: "Error interno del servidor" });
});

module.exports = app;

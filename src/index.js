// Punto de entrada: conecta a MongoDB y levanta el servidor.
require("dotenv/config");
const mongoose = require("mongoose");
const app = require("./app");

const { MONGODB_URI, PORT = 3000 } = process.env;

if (!MONGODB_URI) {
  console.error("Falta MONGODB_URI. Copia .env.example a .env y complétalo.");
  process.exit(1);
}

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Invernadero Encantado escuchando en el puerto ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("No se pudo conectar a MongoDB:", error.message);
    process.exit(1);
  });

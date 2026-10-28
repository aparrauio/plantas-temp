// Modelo Riego (spec 01, sección 1.2).
const mongoose = require("mongoose");

const riegoSchema = new mongoose.Schema(
  {
    planta: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Planta",
      required: [true, "La planta es obligatoria"],
    },
    fecha: { type: Date, default: Date.now },
    cantidadMl: {
      type: Number,
      required: [true, "La cantidad de agua es obligatoria"],
      cast: "La cantidad de agua debe ser un número",
      validate: {
        validator: (cantidad) => cantidad > 0,
        message: "La cantidad de agua debe ser mayor que 0",
      },
    },
    cuidador: { type: String, trim: true },
  },
  { versionKey: false },
);

module.exports = mongoose.model("Riego", riegoSchema);

// Modelo Planta (spec 01, sección 1.1).
const mongoose = require("mongoose");

const cuidadoEspecialSchema = new mongoose.Schema(
  {
    tipo: {
      type: String,
      trim: true,
      required: [true, "El tipo de cuidado es obligatorio"],
    },
    nota: { type: String, trim: true },
  },
  { _id: false },
);

const plantaSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      trim: true,
      required: [true, "El nombre es obligatorio"],
    },
    especie: {
      type: String,
      trim: true,
      required: [true, "La especie es obligatoria"],
    },
    ubicacion: {
      type: String,
      trim: true,
      required: [true, "La ubicación es obligatoria"],
    },
    intervaloRiegoDias: {
      type: Number,
      required: [true, "El intervalo es obligatorio"],
      cast: "El intervalo debe ser un número entero de días",
      min: [1, "El intervalo mínimo es 1 día"],
      validate: {
        validator: Number.isInteger,
        message: "El intervalo debe ser un número entero de días",
      },
    },
    enReposo: { type: Boolean, default: false },
    cuidadosEspeciales: { type: [cuidadoEspecialSchema], default: [] },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    versionKey: false,
  },
);

module.exports = mongoose.model("Planta", plantaSchema);

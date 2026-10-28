// Rutas de riegos bajo /api/riegos (spec 01, sección 2.3).
const express = require("express");
const mongoose = require("mongoose");
const Planta = require("../models/planta");
const Riego = require("../models/riego");

const router = express.Router();

router.post("/", async (req, res) => {
  // Solo se copian estos campos: la fecha la asigna el sistema (HU-1.3 no está en el sprint).
  const { planta, cantidadMl, cuidador } = req.body ?? {};

  if (planta !== undefined && !mongoose.isValidObjectId(planta)) {
    return res.status(400).json({ error: "Identificador de planta inválido" });
  }

  const riego = new Riego({ planta, cantidadMl, cuidador });
  await riego.validate();

  if (!(await Planta.exists({ _id: planta }))) {
    return res.status(404).json({ error: "La planta no existe" });
  }

  await riego.save();
  res.status(201).json(riego);
});

module.exports = router;

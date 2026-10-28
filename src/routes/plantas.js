// Rutas de plantas bajo /api/plantas (spec 01, secciones 2.1, 2.2 y 2.4).
const express = require("express");
const mongoose = require("mongoose");
const Planta = require("../models/planta");
const Riego = require("../models/riego");

const router = express.Router();

// Lista blanca: solo estos campos se copian del cuerpo; createdAt lo asigna el sistema.
const CAMPOS_PLANTA = [
  "nombre",
  "especie",
  "ubicacion",
  "intervaloRiegoDias",
  "enReposo",
  "cuidadosEspeciales",
];

const elegir = (origen, campos) =>
  Object.fromEntries(
    campos
      .filter((campo) => origen?.[campo] !== undefined)
      .map((campo) => [campo, origen[campo]]),
  );

router.post("/", async (req, res) => {
  const planta = await Planta.create(elegir(req.body, CAMPOS_PLANTA));
  res.status(201).json(planta);
});

router.get("/", async (req, res) => {
  const plantas = await Planta.find().sort({ createdAt: 1 });
  res.json(plantas);
});

router.get("/:id/riegos", async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ error: "Identificador de planta inválido" });
  }
  if (!(await Planta.exists({ _id: id }))) {
    return res.status(404).json({ error: "La planta no existe" });
  }

  const riegos = await Riego.find({ planta: id }).sort({ fecha: -1, _id: -1 });
  res.json(riegos);
});

module.exports = router;

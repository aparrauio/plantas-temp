// Tests del modelo Riego. Usan validateSync(), así que no necesitan base de datos.
const { describe, test } = require("node:test");
const assert = require("node:assert/strict");
const mongoose = require("mongoose");
const Riego = require("../src/models/riego");

const riegoValido = () => ({
  planta: new mongoose.Types.ObjectId(),
  cantidadMl: 500,
});

// Devuelve el mensaje de error de un campo, o undefined si el campo es válido.
const errorDe = (datos, campo) =>
  new Riego(datos).validateSync()?.errors[campo]?.message;

describe("Modelo Riego", () => {
  test("un riego válido no tiene errores", () => {
    assert.equal(new Riego(riegoValido()).validateSync(), undefined);
  });

  test("el cuidador es opcional y se guarda si se indica", () => {
    const riego = new Riego({ ...riegoValido(), cuidador: "  Ana  " });
    assert.equal(riego.validateSync(), undefined);
    assert.equal(riego.cuidador, "Ana");
  });

  test("sin planta el riego no es válido", () => {
    const datos = riegoValido();
    delete datos.planta;
    assert.equal(errorDe(datos, "planta"), "La planta es obligatoria");
  });

  test("CA-1.2.2 un riego sin fecha tiene la fecha actual por defecto", () => {
    const antes = Date.now();
    const riego = new Riego(riegoValido());
    const despues = Date.now();
    assert.ok(riego.fecha instanceof Date);
    assert.ok(
      riego.fecha.getTime() >= antes && riego.fecha.getTime() <= despues,
    );
  });

  describe("CA-1.2.5 cantidad no positiva", () => {
    for (const cantidadMl of [0, -100]) {
      test(`una cantidad de ${cantidadMl} ml no es válida`, () => {
        assert.equal(
          errorDe({ ...riegoValido(), cantidadMl }, "cantidadMl"),
          "La cantidad de agua debe ser mayor que 0",
        );
      });
    }

    test("una cantidad de 0.5 ml es válida", () => {
      assert.equal(
        errorDe({ ...riegoValido(), cantidadMl: 0.5 }, "cantidadMl"),
        undefined,
      );
    });
  });

  test("CA-1.2.6 sin cantidad el riego no es válido", () => {
    const datos = riegoValido();
    delete datos.cantidadMl;
    assert.equal(
      errorDe(datos, "cantidadMl"),
      "La cantidad de agua es obligatoria",
    );
  });
});

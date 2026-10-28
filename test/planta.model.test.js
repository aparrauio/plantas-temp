// Tests del modelo Planta. Usan validateSync(), así que no necesitan base de datos.
const { describe, test } = require("node:test");
const assert = require("node:assert/strict");
const Planta = require("../src/models/planta");

const plantaValida = () => ({
  nombre: "Mandrágora",
  especie: "Mandragora officinarum",
  ubicacion: "Invernadero norte, mesa 2",
  intervaloRiegoDias: 3,
});

// Devuelve el mensaje de error de un campo, o undefined si el campo es válido.
const errorDe = (datos, campo) =>
  new Planta(datos).validateSync()?.errors[campo]?.message;

describe("Modelo Planta", () => {
  test("una planta válida no tiene errores", () => {
    assert.equal(new Planta(plantaValida()).validateSync(), undefined);
  });

  test("enReposo es false y cuidadosEspeciales está vacío por defecto", () => {
    const planta = new Planta(plantaValida());
    assert.equal(planta.enReposo, false);
    assert.deepEqual(planta.cuidadosEspeciales.toObject(), []);
  });

  describe("CA-1.1.4 datos obligatorios", () => {
    const casos = [
      ["nombre", "El nombre es obligatorio"],
      ["especie", "La especie es obligatoria"],
      ["ubicacion", "La ubicación es obligatoria"],
      ["intervaloRiegoDias", "El intervalo es obligatorio"],
    ];

    for (const [campo, mensaje] of casos) {
      test(`sin ${campo} la planta no es válida`, () => {
        const datos = plantaValida();
        delete datos[campo];
        assert.equal(errorDe(datos, campo), mensaje);
      });
    }

    for (const campo of ["nombre", "especie", "ubicacion"]) {
      test(`un ${campo} con solo espacios cuenta como vacío`, () => {
        assert.ok(errorDe({ ...plantaValida(), [campo]: "   " }, campo));
      });
    }
  });

  test("un cuidado especial sin tipo no es válido", () => {
    const datos = {
      ...plantaValida(),
      cuidadosEspeciales: [{ nota: "Sombra" }],
    };
    assert.equal(
      errorDe(datos, "cuidadosEspeciales.0.tipo"),
      "El tipo de cuidado es obligatorio",
    );
  });

  test("un cuidado especial con tipo es válido", () => {
    const datos = {
      ...plantaValida(),
      cuidadosEspeciales: [{ tipo: "luz", nota: "Sombra parcial" }],
    };
    assert.equal(new Planta(datos).validateSync(), undefined);
  });

  describe("CA-1.1.5 intervalo menor que 1", () => {
    for (const intervalo of [0, -2]) {
      test(`un intervalo de ${intervalo} no es válido`, () => {
        assert.equal(
          errorDe(
            { ...plantaValida(), intervaloRiegoDias: intervalo },
            "intervaloRiegoDias",
          ),
          "El intervalo mínimo es 1 día",
        );
      });
    }

    test("un intervalo de 1 es válido", () => {
      assert.equal(
        errorDe(
          { ...plantaValida(), intervaloRiegoDias: 1 },
          "intervaloRiegoDias",
        ),
        undefined,
      );
    });
  });

  describe("CA-1.1.6 intervalo no entero", () => {
    test("un intervalo de 2.5 no es válido", () => {
      assert.equal(
        errorDe(
          { ...plantaValida(), intervaloRiegoDias: 2.5 },
          "intervaloRiegoDias",
        ),
        "El intervalo debe ser un número entero de días",
      );
    });

    test("un intervalo que no es un número no es válido", () => {
      assert.equal(
        errorDe(
          { ...plantaValida(), intervaloRiegoDias: "tres" },
          "intervaloRiegoDias",
        ),
        "El intervalo debe ser un número entero de días",
      );
    });
  });
});

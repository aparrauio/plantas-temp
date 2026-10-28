# Épicas — Invernadero Encantado (MVP)

Fuente: `docs/prd/invernadero-mvp.md`.

## E1 · Plantas y riegos

**Objetivo:** que el cuidador pueda registrar sus plantas y sus riegos, y consultarlos.

**Alcance del PRD que cubre:**
- 1. Registrar una planta con su nombre, especie, ubicación e intervalo de riego en días.
- 2. Registrar un riego de una planta con la cantidad de agua, incluida una fecha pasada para
  riegos olvidados.
- 3. Consultar el listado de plantas y el historial de riegos de cada una.

**Reglas de negocio que aplican:**
- Nombre, especie, ubicación e intervalo son obligatorios al registrar una planta.
- El intervalo de riego es un número entero de días, como mínimo 1.
- No se puede registrar un riego de una planta que no existe.
- La cantidad de agua de un riego es obligatoria y debe ser mayor que 0.
- Un riego no puede tener fecha futura; sí puede tener fecha pasada.
- [SUPUESTO] El sistema asigna la fecha de registro de la planta en el momento de crearla.
- [SUPUESTO] No se aceptan riegos con fecha anterior a la fecha de registro de la planta.
- [SUPUESTO] La cantidad de agua se expresa en litros y admite decimales.

## E2 · Cuidado

**Objetivo:** que el cuidador sepa qué plantas necesitan agua hoy y que las plantas en reposo
se manejen aparte.

**Alcance del PRD que cubre:**
- 4. Consultar qué plantas necesitan agua a la fecha de hoy.
- Manejo del reposo: **no está en el alcance del PRD**. Hoy solo es un punto abierto
  ("¿Hay plantas que no deben aparecer, como muertas, retiradas o en reposo?").

**Reglas de negocio que aplican:**
- Si una planta tiene varios riegos, cuenta el más reciente.
- Una planta que nunca se ha regado cuenta desde su fecha de registro.
- Una planta necesita agua cuando, desde su último riego (o su registro), han pasado
  al menos tantos días como su intervalo.
- [SUPUESTO] Los días se cuentan como días de calendario en la zona horaria del invernadero.
- [SUPUESTO] Una planta que "toca hoy" aparece en la consulta igual que una vencida.
- Reposo: no hay reglas definidas.

## Cobertura

- **Puntos del alcance fuera de ambas épicas:** ninguno. Los puntos 1–3 están en E1 y el 4 en E2.
- **Desajuste en sentido contrario:** E2 incluye "manejar el reposo", pero el PRD no lo tiene en
  el alcance ni define reglas para él. Antes de escribir specs de reposo hay que resolver el
  punto abierto y añadirlo al PRD, o sacar el reposo de E2.

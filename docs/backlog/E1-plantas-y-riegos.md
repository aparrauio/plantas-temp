# E1 · Plantas y riegos — Historias de usuario

Fuentes: `docs/prd/invernadero-mvp.md` y `docs/backlog/epicas.md`.
Rol único del MVP: **cuidador**. Los criterios de aceptación quedan pendientes.

## Dentro del MVP

### HU-1.1 · Registrar una planta
Como cuidador, quiero registrar una planta con su nombre y su intervalo de riego en días,
para que el invernadero sepa cada cuánto hay que regarla.
- **PRD:** alcance 1.

### HU-1.2 · Registrar un riego de hoy
Como cuidador, quiero registrar que regué una planta hoy,
para que su próximo riego se cuente desde este momento.
- **PRD:** alcance 2.

### HU-1.3 · Registrar un riego olvidado
Como cuidador, quiero registrar un riego con una fecha pasada,
para que el historial refleje un riego que olvidé anotar el día que lo hice.
- **PRD:** alcance 2.

### HU-1.4 · Consultar el listado de plantas
Como cuidador, quiero ver el listado de plantas con su nombre e intervalo de riego,
para saber qué plantas tiene registradas el invernadero.
- **PRD:** alcance 3.

### HU-1.5 · Consultar el historial de riegos de una planta
Como cuidador, quiero ver los riegos de una planta,
para comprobar cuándo y cuántas veces se ha regado.
- **PRD:** alcance 3.

## Fuera de alcance

Estas historias salen de forma natural al descomponer E1, pero el PRD no las incluye en el MVP.
Se conservan para no perderlas.

### HU-1.6 · Corregir o anular un riego — fuera de alcance
Como cuidador, quiero anular un riego que registré por error,
para que la planta que sigue seca vuelva a aparecer como pendiente.
- **PRD:** punto abierto ("¿Se puede anular o corregir un riego registrado por error?").

### HU-1.7 · Cambiar el intervalo de riego de una planta — fuera de alcance
Como cuidador, quiero cambiar el intervalo de riego de una planta,
para ajustarlo cuando descubro que necesita más o menos agua.
- **PRD:** punto abierto ("Si se cambia el intervalo de una planta, ¿se aplica de inmediato…?").

### HU-1.8 · Retirar una planta — fuera de alcance
Como cuidador, quiero retirar una planta muerta o que ya no está en el invernadero,
para que deje de aparecer en el listado.
- **PRD:** punto abierto ("¿Hay plantas que no deben aparecer…?").

## Notas INVEST

- **Independientes:** HU-1.2, HU-1.3 y HU-1.5 necesitan que exista una planta. Esa planta puede
  prepararse como dato de prueba, así que no dependen de que HU-1.1 esté terminada.
- **Pequeñas:** el riego se dividió en "hoy" (HU-1.2) y "olvidado" (HU-1.3). La fecha pasada
  añade validaciones propias: no puede ser futura, ni anterior al registro según el [SUPUESTO].
- **Comprobables:** cada historia tiene un resultado observable (una planta o un riego que
  aparece registrado, o un listado que se puede consultar). Los criterios de aceptación se
  escribirán en el siguiente paso.

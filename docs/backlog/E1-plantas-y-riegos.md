# E1 · Plantas y riegos — Historias de usuario

Fuentes: `docs/prd/invernadero-mvp.md` y `docs/backlog/epicas.md`.
Spec técnica del sprint: `docs/specs/01-plantas-y-riegos.md`.
Rol único del MVP: **cuidador**.

| Id | Historia | Estado |
|---|---|---|
| HU-1.1 | Registrar una planta | Lista para el sprint |
| HU-1.2 | Registrar un riego de hoy | Lista para el sprint |
| HU-1.3 | Registrar un riego olvidado | Por refinar |
| HU-1.4 | Consultar el listado de plantas | Por refinar (versión mínima adelantada en la Spec 01) |
| HU-1.5 | Consultar el historial de riegos de una planta | Por refinar (versión mínima adelantada en la Spec 01) |
| HU-1.6 | Corregir o anular un riego | Fuera de alcance |
| HU-1.7 | Cambiar el intervalo de riego de una planta | Fuera de alcance |
| HU-1.8 | Retirar una planta | Fuera de alcance |

## Dentro del MVP

### HU-1.1 · Registrar una planta — Lista para el sprint
Como cuidador, quiero registrar una planta con su nombre, especie, ubicación e intervalo de riego
en días, para que el invernadero sepa qué planta es, dónde está y cada cuánto hay que regarla.
- **PRD:** alcance 1.

**Reglas que aplican**
- El intervalo de riego es un número entero de días, como mínimo 1. (PRD)
- Nombre, especie, ubicación e intervalo son obligatorios. (Decisión del cliente)
- Los cuidados especiales y la marca de reposo son opcionales. (PRD)
- [SUPUESTO] El sistema asigna la fecha de registro en el momento de crear la planta. (PRD)
- [SUPUESTO] Un dato que solo contiene espacios cuenta como vacío. (PRD)

**Criterios de aceptación**
1. **Registro válido.**
   DADO que el invernadero no tiene una planta llamada "Mandrágora",
   CUANDO el cuidador la registra con nombre "Mandrágora", especie "Mandragora officinarum",
   ubicación "Invernadero norte, mesa 2" e intervalo de 3 días,
   ENTONCES "Mandrágora" aparece en el listado con esa especie, esa ubicación y un intervalo de 3 días.
2. **Fecha de registro automática.**
   DADO que hoy es 28/10/2026,
   CUANDO el cuidador registra una planta válida,
   ENTONCES su fecha de registro es 28/10/2026, sin que el cuidador la haya indicado.
3. **Planta nueva sin riegos.**
   DADO una planta recién registrada,
   CUANDO el cuidador consulta su historial,
   ENTONCES el historial está vacío.
4. **Datos obligatorios.**
   DADO un cuidador registrando una planta,
   CUANDO falta el nombre, la especie, la ubicación o el intervalo,
   ENTONCES la planta no se registra y se le indica qué dato falta.
5. **Intervalo menor que 1.**
   DADO un cuidador registrando una planta,
   CUANDO indica un intervalo de 0 días o un número negativo,
   ENTONCES la planta no se registra y se le indica que el intervalo mínimo es 1 día.
6. **Intervalo no entero.**
   DADO un cuidador registrando una planta,
   CUANDO indica un intervalo de 2,5 días,
   ENTONCES la planta no se registra y se le indica que el intervalo debe ser un número entero de días.
7. **Rechazo sin efectos.**
   DADO un registro rechazado por cualquiera de los motivos anteriores,
   CUANDO el cuidador consulta el listado,
   ENTONCES el listado no ha cambiado.

### HU-1.2 · Registrar un riego de hoy — Lista para el sprint
Como cuidador, quiero registrar que regué una planta hoy, con cuánta agua y, si quiero, quién lo hizo,
para que su próximo riego se cuente desde este momento.
- **PRD:** alcance 2.

**Reglas que aplican**
- Un riego no puede tener fecha futura. Aquí se cumple porque la fecha la pone el sistema y es la de hoy. (PRD)
- Si una planta tiene varios riegos, cuenta el más reciente. (PRD; en esta historia solo se observa en el historial)
- No se puede registrar un riego de una planta que no existe. (Decisión del cliente)
- La cantidad de agua de un riego debe ser mayor que 0. (Decisión del cliente)
- [SUPUESTO] La cantidad de agua se expresa en mililitros. (PRD)

**Criterios de aceptación**
1. **Riego válido.**
   DADO que "Mandrágora" está registrada y hoy es 28/10/2026,
   CUANDO el cuidador registra que la regó hoy con 500 ml,
   ENTONCES el historial de "Mandrágora" muestra un riego del 28/10/2026 con 500 ml.
2. **Fecha automática.**
   DADO un cuidador que registra un riego de hoy,
   CUANDO lo guarda,
   ENTONCES la fecha del riego es la de hoy, sin que el cuidador la haya indicado.
3. **Se conserva el historial.**
   DADO que "Mandrágora" tiene un riego del 25/10/2026,
   CUANDO el cuidador registra un riego hoy (28/10/2026),
   ENTONCES el historial muestra los dos riegos y el del 28/10/2026 figura como el más reciente.
4. **Planta inexistente.**
   DADO que no existe ninguna planta llamada "Helecho Lunar",
   CUANDO el cuidador intenta registrarle un riego,
   ENTONCES el riego no se registra y se le indica que la planta no existe.
5. **Cantidad de agua no positiva.**
   DADO que "Mandrágora" está registrada,
   CUANDO el cuidador registra un riego con 0 ml o una cantidad negativa,
   ENTONCES el riego no se registra, se le indica que la cantidad debe ser mayor que 0
   y el historial no cambia.
6. **Cantidad de agua obligatoria.**
   DADO que "Mandrágora" está registrada,
   CUANDO el cuidador registra un riego sin indicar la cantidad de agua,
   ENTONCES el riego no se registra y se le indica que la cantidad es obligatoria.
7. **El riego afecta solo a su planta.**
   DADO que están registradas "Mandrágora" y "Rosa Ígnea",
   CUANDO el cuidador riega "Mandrágora",
   ENTONCES el historial de "Rosa Ígnea" no cambia.

### Casos borde pendientes (HU-1.1 y HU-1.2)
- ¿Se permiten dos plantas con el mismo nombre?
- ¿Hay un límite de longitud para los textos? (Los textos con solo espacios ya cuentan como vacíos.)
- ¿Hay un intervalo máximo razonable?
- ¿La cantidad de agua debe ser un número entero de mililitros?
- ¿Hay una cantidad máxima de agua por riego?
- ¿Es obligatorio indicar quién hizo el riego? En la Spec 01 es opcional.
- Dos riegos de la misma planta el mismo día: ¿se aceptan ambos?
- Riego cerca de la medianoche: ¿qué "hoy" cuenta? (zona horaria)

### HU-1.3 · Registrar un riego olvidado — Por refinar
Como cuidador, quiero registrar un riego con una fecha pasada,
para que el historial refleje un riego que olvidé anotar el día que lo hice.
- **PRD:** alcance 2.

### HU-1.4 · Consultar el listado de plantas — Por refinar
Como cuidador, quiero ver el listado de plantas con su nombre e intervalo de riego,
para saber qué plantas tiene registradas el invernadero.
- **PRD:** alcance 3.

### HU-1.5 · Consultar el historial de riegos de una planta — Por refinar
Como cuidador, quiero ver los riegos de una planta,
para comprobar cuándo y cuántas veces se ha regado.
- **PRD:** alcance 3.

## Fuera de alcance

Estas historias salen de forma natural al descomponer E1, pero el PRD no las incluye en el MVP.
Se conservan para no perderlas.

### HU-1.6 · Corregir o anular un riego — Fuera de alcance
Como cuidador, quiero anular un riego que registré por error,
para que la planta que sigue seca vuelva a aparecer como pendiente.
- **PRD:** punto abierto ("¿Se puede anular o corregir un riego registrado por error?").

### HU-1.7 · Cambiar el intervalo de riego de una planta — Fuera de alcance
Como cuidador, quiero cambiar el intervalo de riego de una planta,
para ajustarlo cuando descubro que necesita más o menos agua.
- **PRD:** punto abierto ("Si se cambia el intervalo de una planta, ¿se aplica de inmediato…?").

### HU-1.8 · Retirar una planta — Fuera de alcance
Como cuidador, quiero retirar una planta muerta o que ya no está en el invernadero,
para que deje de aparecer en el listado.
- **PRD:** punto abierto ("¿Hay plantas que no deben aparecer…?").

## Notas INVEST

- **Independientes:** HU-1.2, HU-1.3 y HU-1.5 necesitan que exista una planta. Esa planta puede
  prepararse como dato de prueba, así que no dependen de que HU-1.1 esté terminada.
- **Pequeñas:** el riego se dividió en "hoy" (HU-1.2) y "olvidado" (HU-1.3). La fecha pasada
  añade validaciones propias: no puede ser futura, ni anterior al registro según el [SUPUESTO].
- **Comprobables:** HU-1.1 y HU-1.2 ya tienen criterios DADO / CUANDO / ENTONCES. Las historias
  marcadas "por refinar" los recibirán cuando entren a un sprint.

## Tickets del sprint (HU-1.1 y HU-1.2)

> **Prerrequisito (AGENTS.md):** ninguna funcionalidad se implementa sin spec. Las dos historias
> están cubiertas por `docs/specs/01-plantas-y-riegos.md`. La sección 5 de esa spec indica qué
> archivos crea o modifica cada ticket.
>
> **Estrategia de pruebas:** las reglas de validación viven en los modelos y se prueban con tests
> automáticos sin base de datos (`validateSync()`). Lo que necesita persistencia se verifica a mano
> con curl contra una base de datos de desarrollo. Ver la sección 4 de la spec.

### T-01 · Preparar el proyecto
- **Historia:** HU-1.1 (habilita también HU-1.2) · **Tipo:** Configuración
- **Descripción:** configurar el proyecto Node con el stack de AGENTS.md y separar la app
  (`src/app.js`) del arranque (`src/index.js`), para poder probar la app sin levantar el servidor.
- **Definition of Done:**
  - [ ] Existe `package.json` con los scripts `dev` y `test` y las dependencias de AGENTS.md.
  - [ ] Prettier está configurado y el código lo cumple.
  - [ ] `src/app.js` exporta la app sin llamar a `listen`; `src/index.js` conecta y arranca.
  - [ ] La conexión a la base de datos se toma de una variable de entorno; no hay credenciales en el código.
  - [ ] `npm run dev` arranca y `npm test` se ejecuta sin errores (aunque aún no haya pruebas).
- **Dependencias:** ninguna.

### T-02 · Reglas y modelo de planta
- **Historia:** HU-1.1 · **Tipo:** Modelo/Dominio
- **Descripción:** crear el modelo de planta con sus reglas de validación (datos obligatorios,
  intervalo entero de al menos 1) y su fecha de registro automática, según la sección 1.1 de la spec.
- **Definition of Done:**
  - [ ] El modelo tiene los campos, reglas y mensajes de la sección 1.1 de la spec.
  - [ ] Las validaciones se pueden comprobar sin base de datos (`validateSync()`).
  - [ ] Hay un test de modelo para una planta válida y otro para cada dato obligatorio.
  - [ ] `npm test` pasa.
- **Dependencias:** T-01.

### T-03 · Registrar una planta desde la API
- **Historia:** HU-1.1 · **Tipo:** Endpoint/API
- **Descripción:** exponer `POST /api/plantas` y `GET /api/plantas` según las secciones 2.1 y 2.2
  de la spec, con el manejador común de errores 400/404.
- **Definition of Done:**
  - [ ] Una planta válida queda guardada con la fecha de hoy como fecha de registro.
  - [ ] Una planta inválida no se guarda, y la respuesta 400 indica qué dato falla.
  - [ ] La ruta solo copia del cuerpo los campos permitidos; `createdAt` se ignora.
  - [ ] `npm test` pasa.
- **Dependencias:** T-02.

### T-04 · Pruebas de aceptación de HU-1.1
- **Historia:** HU-1.1 · **Tipo:** Test
- **Descripción:** verificar CA-1.1.1 a CA-1.1.7 como indica la sección 4 de la spec: tests de
  modelo para las reglas de validación y curl manual para lo que necesita persistencia.
- **Definition of Done:**
  - [ ] CA-1.1.4, 1.1.5 y 1.1.6 tienen un test de modelo cuyo nombre incluye el id del criterio.
  - [ ] CA-1.1.1, 1.1.2, 1.1.3 y 1.1.7 se verificaron con curl, y el resultado quedó anotado en la spec.
  - [ ] Ningún test usa la base de datos ni el `.env`.
  - [ ] `npm test` pasa.
- **Dependencias:** T-03.

### T-05 · Reglas y modelo de riego
- **Historia:** HU-1.2 · **Tipo:** Modelo/Dominio
- **Descripción:** crear el modelo de riego con sus reglas de validación (cantidad en ml obligatoria
  y mayor que 0, fecha actual por defecto) y su referencia a la planta, según la sección 1.2 de la spec.
- **Definition of Done:**
  - [ ] El modelo tiene los campos, reglas y mensajes de la sección 1.2 de la spec.
  - [ ] Las validaciones se pueden comprobar sin base de datos (`validateSync()`).
  - [ ] Hay un test de modelo para un riego válido y otro para la cantidad ausente.
  - [ ] `npm test` pasa.
- **Dependencias:** T-02 (el riego referencia a la planta).

### T-06 · Registrar un riego desde la API
- **Historia:** HU-1.2 · **Tipo:** Endpoint/API
- **Descripción:** exponer `POST /api/riegos` y `GET /api/plantas/:id/riegos` según las
  secciones 2.3 y 2.4 de la spec.
- **Definition of Done:**
  - [ ] Un riego válido queda guardado con la fecha actual, asociado a su planta; `fecha` del cuerpo se ignora.
  - [ ] Un riego a una planta inexistente responde 404; un id mal formado responde 400.
  - [ ] Un riego con una cantidad inválida responde 400 y no se guarda.
  - [ ] El historial devuelve los riegos de la planta, del más reciente al más antiguo.
  - [ ] `npm test` pasa.
- **Dependencias:** T-03 y T-05.

### T-07 · Pruebas de aceptación de HU-1.2
- **Historia:** HU-1.2 · **Tipo:** Test
- **Descripción:** verificar CA-1.2.1 a CA-1.2.7 como indica la sección 4 de la spec: tests de
  modelo para las reglas de validación y curl manual para lo que necesita persistencia.
- **Definition of Done:**
  - [ ] CA-1.2.2, 1.2.5 y 1.2.6 tienen un test de modelo cuyo nombre incluye el id del criterio.
  - [ ] CA-1.2.1, 1.2.2, 1.2.3, 1.2.4 y 1.2.7 se verificaron con curl, y el resultado quedó anotado en la spec.
  - [ ] Ningún test usa la base de datos ni el `.env`.
  - [ ] `npm test` pasa.
- **Dependencias:** T-06.

### Orden de ejecución sugerido
1. Spec 01 de HU-1.1 y HU-1.2 (`docs/specs/01-plantas-y-riegos.md`), ya escrita y pendiente de revisión.
2. **T-01** Preparar el proyecto.
3. **T-02** Reglas y modelo de planta.
4. **T-03** Registrar una planta desde la API, y **T-05** Reglas y modelo de riego (en paralelo).
5. **T-04** Pruebas de aceptación de HU-1.1.
6. **T-06** Registrar un riego desde la API.
7. **T-07** Pruebas de aceptación de HU-1.2.

Con este orden, HU-1.1 queda terminada y probada antes de cerrar HU-1.2.

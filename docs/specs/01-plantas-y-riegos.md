# Spec 01 — Plantas y riegos (Sprint 1)

- **Historias:** HU-1.1 Registrar una planta · HU-1.2 Registrar un riego de hoy
- **Tickets:** T-01 a T-07 (`docs/backlog/E1-plantas-y-riegos.md`)
- **Fuentes:** `docs/prd/invernadero-mvp.md`, `docs/backlog/E1-plantas-y-riegos.md`
- **Estado:** implementada y verificada (commit `83488ad`, sección 4.1). Pendiente: decidir cómo
  tratar una fecha futura en un riego (nota 1 de la sección 4.1).

## 1. Modelos

### 1.1 Planta (`src/models/planta.js`)

| Campo | Tipo | Reglas | Mensaje de error |
|---|---|---|---|
| `nombre` | String | obligatorio, `trim` | "El nombre es obligatorio" |
| `especie` | String | obligatorio, `trim` | "La especie es obligatoria" |
| `ubicacion` | String | obligatorio, `trim` | "La ubicación es obligatoria" |
| `intervaloRiegoDias` | Number | obligatorio, entero, mínimo 1 | "El intervalo es obligatorio" / "El intervalo debe ser un número entero de días" / "El intervalo mínimo es 1 día" |
| `enReposo` | Boolean | por defecto `false` | — |
| `cuidadosEspeciales` | [Subdocumento] | por defecto `[]` | — |
| `createdAt` | Date | lo asigna Mongoose (`timestamps: { createdAt: true, updatedAt: false }`) | — |

Subdocumento `cuidadosEspeciales` (embebido, sin `_id` propio):

| Campo | Tipo | Reglas | Mensaje de error |
|---|---|---|---|
| `tipo` | String | obligatorio, `trim` | "El tipo de cuidado es obligatorio" |
| `nota` | String | opcional, `trim` | — |

- Con `trim`, un texto que solo tiene espacios queda vacío y lo rechaza la regla de obligatorio.
  [DECISIÓN] Esto resuelve el caso borde "texto con solo espacios".
- `createdAt` es la **fecha de registro** de la planta (criterio CA-1.1.2).

### 1.2 Riego (`src/models/riego.js`)

| Campo | Tipo | Reglas | Mensaje de error |
|---|---|---|---|
| `planta` | ObjectId → `Planta` | obligatorio | "La planta es obligatoria" |
| `fecha` | Date | por defecto `Date.now` | — |
| `cantidadMl` | Number | obligatorio, mayor que 0 | "La cantidad de agua es obligatoria" / "La cantidad de agua debe ser mayor que 0" |
| `cuidador` | String | opcional, `trim` | — |

- Las validaciones de ambos modelos se comprueban **sin base de datos** con `documento.validateSync()`.
- La existencia de la planta referenciada **no** se valida en el modelo. La comprueba la ruta
  (sección 2.3), porque necesita consultar la base de datos.

## 2. Endpoints

Todas las rutas van bajo `/api`, y los cuerpos y respuestas son JSON.

**Formato común de error**

```json
// 400
{ "error": "Datos inválidos", "detalles": { "<campo>": "<mensaje>" } }
// 404
{ "error": "La planta no existe" }
```

- `detalles` incluye **todos** los campos que fallan (uno por clave), con los mensajes de la sección 1.
- Un `:id` o un `planta` con formato de ObjectId inválido responde 400 con
  `{ "error": "Identificador de planta inválido" }`.

### 2.1 `POST /api/plantas` — registrar una planta (HU-1.1)

**Cuerpo**
```json
{
  "nombre": "Mandrágora",
  "especie": "Mandragora officinarum",
  "ubicacion": "Invernadero norte, mesa 2",
  "intervaloRiegoDias": 3,
  "enReposo": false,
  "cuidadosEspeciales": [{ "tipo": "luz", "nota": "Sombra parcial" }]
}
```
`enReposo` y `cuidadosEspeciales` son opcionales. La ruta solo copia estos campos del cuerpo
(lista blanca). Cualquier otro campo, `createdAt` incluido, se ignora.

**Respuesta 201**: la planta creada.
```json
{
  "_id": "6720f1a2c3d4e5f6a7b8c9d0",
  "nombre": "Mandrágora",
  "especie": "Mandragora officinarum",
  "ubicacion": "Invernadero norte, mesa 2",
  "intervaloRiegoDias": 3,
  "enReposo": false,
  "cuidadosEspeciales": [{ "tipo": "luz", "nota": "Sombra parcial" }],
  "createdAt": "2026-10-28T14:05:00.000Z"
}
```

**Errores**
- **400:** falta `nombre`, `especie`, `ubicacion` o `intervaloRiegoDias`; el intervalo no es entero
  o es menor que 1; algún cuidado especial no tiene `tipo`.
- **404:** no aplica.

### 2.2 `GET /api/plantas` — listar las plantas

**Cuerpo:** ninguno.

**Respuesta 200:** un arreglo de plantas con el mismo formato que en 2.1, ordenadas por `createdAt`
ascendente. Si no hay plantas, devuelve `[]`.

**Errores**
- **400:** no aplica.
- **404:** no aplica.

### 2.3 `POST /api/riegos` — registrar un riego de hoy (HU-1.2)

**Cuerpo**
```json
{ "planta": "6720f1a2c3d4e5f6a7b8c9d0", "cantidadMl": 500, "cuidador": "Ana" }
```
La ruta solo copia `planta`, `cantidadMl` y `cuidador`. Si llega `fecha`, se ignora y se usa la
fecha actual. [DECISIÓN] Los riegos con fecha pasada son HU-1.3, que no entra en este sprint.

**Respuesta 201**: el riego creado.
```json
{
  "_id": "6720f3b4c5d6e7f8a9b0c1d2",
  "planta": "6720f1a2c3d4e5f6a7b8c9d0",
  "fecha": "2026-10-28T14:10:00.000Z",
  "cantidadMl": 500,
  "cuidador": "Ana"
}
```

**Errores**
- **400:** falta `planta` o `cantidadMl`; `cantidadMl` es menor o igual a 0; `planta` no es un
  ObjectId válido.
- **404:** `planta` tiene formato válido pero no existe ninguna planta con ese id.

Orden de comprobación: 1) validación del modelo (400) → 2) formato del id (400) → 3) existencia de la
planta (404) → 4) guardado.

### 2.4 `GET /api/plantas/:id/riegos` — historial de riegos de una planta

**Cuerpo:** ninguno.

**Respuesta 200:** un arreglo de riegos de esa planta, ordenados por `fecha` **descendente** (el más
reciente primero). Si la planta no tiene riegos, devuelve `[]`.

**Errores**
- **400:** `:id` no es un ObjectId válido.
- **404:** no existe ninguna planta con ese id.

## 3. Criterios de aceptación

### HU-1.1 · Registrar una planta

- **CA-1.1.1 Registro válido.** Al registrar una planta con nombre, especie, ubicación e intervalo
  válidos, el sistema DEBE guardarla y DEBE devolverla en el listado con esos mismos datos.
- **CA-1.1.2 Fecha de registro automática.** El sistema DEBE asignar como fecha de registro el
  momento de la creación. NO DEBE tomarla del cuerpo de la petición.
- **CA-1.1.3 Planta nueva sin riegos.** El historial de riegos de una planta recién registrada DEBE
  estar vacío.
- **CA-1.1.4 Datos obligatorios.** Si falta el nombre, la especie, la ubicación o el intervalo, el
  sistema NO DEBE registrar la planta y DEBE indicar qué dato falta.
- **CA-1.1.5 Intervalo menor que 1.** Con un intervalo de 0 o negativo, el sistema NO DEBE registrar
  la planta y DEBE indicar que el intervalo mínimo es 1 día.
- **CA-1.1.6 Intervalo no entero.** Con un intervalo no entero (p. ej. 2,5), el sistema NO DEBE
  registrar la planta y DEBE indicar que el intervalo debe ser un número entero de días.
- **CA-1.1.7 Rechazo sin efectos.** Un registro rechazado NO DEBE modificar el listado de plantas.

### HU-1.2 · Registrar un riego de hoy

- **CA-1.2.1 Riego válido.** Al registrar un riego con una planta existente y una cantidad válida,
  el sistema DEBE guardarlo y DEBE mostrarlo en el historial de esa planta con su cantidad.
- **CA-1.2.2 Fecha automática.** El sistema DEBE asignar al riego la fecha actual. NO DEBE tomarla
  del cuerpo de la petición.
- **CA-1.2.3 Se conserva el historial.** Registrar un riego NO DEBE borrar ni modificar los riegos
  anteriores de la planta. El historial DEBE mostrar el riego más reciente en primer lugar.
- **CA-1.2.4 Planta inexistente.** Si la planta no existe, el sistema NO DEBE registrar el riego y
  DEBE indicar que la planta no existe.
- **CA-1.2.5 Cantidad no positiva.** Con una cantidad de 0 o negativa, el sistema NO DEBE registrar
  el riego y DEBE indicar que la cantidad debe ser mayor que 0.
- **CA-1.2.6 Cantidad obligatoria.** Sin cantidad, el sistema NO DEBE registrar el riego y DEBE
  indicar que la cantidad es obligatoria.
- **CA-1.2.7 El riego afecta solo a su planta.** Registrar un riego NO DEBE modificar el historial de
  ninguna otra planta.

## 4. Criterio → verificación

- **Test de modelo:** prueba automática con `node --test` en `test/`. Construye el documento y llama a
  `validateSync()`, **sin base de datos**.
- **curl:** prueba manual contra el servidor local (`npm run dev`), usando una base de datos de
  desarrollo, nunca la de producción.

| Criterio | Verificación | Cómo |
|---|---|---|
| CA-1.1.1 | Test de modelo + curl | Test: una planta válida no produce errores. curl: `POST /api/plantas` → 201; `GET /api/plantas` la incluye. |
| CA-1.1.2 | curl | `POST /api/plantas` con un `createdAt` del pasado en el cuerpo → la respuesta trae la fecha actual. |
| CA-1.1.3 | curl | `GET /api/plantas/:id/riegos` de la planta recién creada → `[]`. |
| CA-1.1.4 | Test de modelo | Un caso por campo omitido o con solo espacios → error en ese campo con su mensaje. |
| CA-1.1.5 | Test de modelo | `intervaloRiegoDias` = 0 y = -2 → "El intervalo mínimo es 1 día". |
| CA-1.1.6 | Test de modelo | `intervaloRiegoDias` = 2.5 → "El intervalo debe ser un número entero de días". |
| CA-1.1.7 | curl | `POST /api/plantas` inválido → 400; `GET /api/plantas` devuelve lo mismo que antes. |
| CA-1.2.1 | Test de modelo + curl | Test: un riego válido no produce errores. curl: `POST /api/riegos` → 201; aparece en `GET /api/plantas/:id/riegos`. |
| CA-1.2.2 | Test de modelo + curl | Test: un riego nuevo sin `fecha` la tiene por defecto (± 1 s de ahora). curl: enviar `fecha` en el cuerpo → la respuesta trae la fecha actual. |
| CA-1.2.3 | curl | Registrar dos riegos seguidos de la misma planta → el historial tiene 2 elementos y el segundo registrado aparece primero. |
| CA-1.2.4 | curl | `POST /api/riegos` con un ObjectId válido que no existe → 404; con un id mal formado → 400. |
| CA-1.2.5 | Test de modelo | `cantidadMl` = 0 y = -100 → "La cantidad de agua debe ser mayor que 0". |
| CA-1.2.6 | Test de modelo | Riego sin `cantidadMl` → "La cantidad de agua es obligatoria". |
| CA-1.2.7 | curl | Con dos plantas, regar una → el historial de la otra no cambia. |

Nota sobre CA-1.2.3: el criterio del backlog usa un riego "del 25/10". En este sprint no se pueden
registrar fechas pasadas (HU-1.3), así que se verifica con dos riegos de hoy registrados en orden.

### 4.1 Resultados de la verificación manual (28/10/2026)

Hecha con curl contra `http://localhost:3000` y una base de datos de desarrollo, sobre el commit
`83488ad`. Ids usados: planta A `6ae205c62752ea234546d1d2`, planta B `6ae205d92752ea234546d1dd`.

| Criterio | Petición | Esperado | Obtenido | Resultado |
|---|---|---|---|---|
| CA-1.1.1 | `POST /api/plantas` (planta A, intervalo 3) y luego `GET /api/plantas` | 201; la planta aparece en el listado | 201; aparece en el listado | ✅ |
| CA-1.1.2 | `POST /api/plantas` con `"createdAt":"2020-01-01T00:00:00Z"` en el cuerpo | `createdAt` = momento de creación | `createdAt: 2026-10-28T14:25:10.472Z` | ✅ |
| CA-1.1.3 | `GET /api/plantas/A/riegos` antes de regar | 200 `[]` | 200 `[]` | ✅ |
| CA-1.1.5 | `POST /api/plantas` con `intervaloRiegoDias: 0` | 400, "El intervalo mínimo es 1 día" | 400, `detalles.intervaloRiegoDias` con ese mensaje | ✅ |
| CA-1.1.7 | `GET /api/plantas` antes y después del `POST` inválido | El listado no cambia | 1 planta antes, 1 después | ✅ |
| CA-1.2.1 | `POST /api/riegos` con planta A, `cantidadMl: 500`, `cuidador: "Ana"` | 201; aparece en el historial | 201; aparece en el historial | ✅ |
| CA-1.2.2 | `POST /api/riegos` con planta A, `cantidadMl: 300`, `"fecha":"2030-01-01T00:00:00Z"` | 201 con la fecha actual (se ignora la del cuerpo) | 201, `fecha: 2026-10-28T14:25:30.429Z` | ✅ (ver nota 1) |
| CA-1.2.3 | `GET /api/plantas/A/riegos` tras los dos riegos | Dos riegos, el más reciente primero | 300 ml (14:25:30.429) y luego 500 ml (14:25:30.075) | ✅ |
| CA-1.2.4 | `POST /api/riegos` con `planta: "64b7f0000000000000000000"` | 404, "La planta no existe" | 404, "La planta no existe" | ✅ |
| CA-1.2.5 | `POST /api/riegos` con planta A, `cantidadMl: 0` | 400, "La cantidad de agua debe ser mayor que 0" | 400 con ese mensaje | ✅ |
| CA-1.2.7 | `GET /api/plantas/B/riegos` después de regar A | 200 `[]` | 200 `[]` | ✅ |

CA-1.1.4, CA-1.1.6 y CA-1.2.6 se verifican con tests de modelo (`npm test`: 24/24). El id mal formado
(400 "Identificador de planta inválido") se comprobó con peticiones locales sin base de datos.

**Notas**
1. **Fecha futura.** El comportamiento cumple esta spec, pero contradice la regla del PRD "un riego
   no puede tener fecha futura": una fecha futura no se rechaza, se registra en silencio como un riego
   de hoy. Hay que decidir si la API debe responder 400 y, si es así, actualizar esta spec y el código.
2. **Codificación.** Una planta enviada desde Git Bash en Windows con "á" sin escapar se guardó como
   `"Mandr�gora"`, porque el cliente no envió UTF-8. La misma planta con `á` se guardó bien.
   El servidor acepta UTF-8 inválido sin avisar; queda como posible mejora.

## 5. Ticket → archivos

| Ticket | Crea | Modifica |
|---|---|---|
| T-01 Preparar el proyecto | `package.json`, `.prettierrc`, `.env.example` (solo nombres de variables, sin valores reales), `src/app.js`, `src/index.js` | — |
| T-02 Reglas y modelo de planta | `src/models/planta.js`, `test/planta.model.test.js` | — |
| T-03 Registrar una planta desde la API | `src/routes/plantas.js` (`POST` y `GET /api/plantas`) | `src/app.js` (montar el router y el manejador de errores 400/404) |
| T-04 Pruebas de aceptación de HU-1.1 | — | `test/planta.model.test.js` (cubrir CA-1.1.4 a 1.1.6); esta spec (registrar el resultado de los curl de CA-1.1.1 a 1.1.3 y 1.1.7) |
| T-05 Reglas y modelo de riego | `src/models/riego.js`, `test/riego.model.test.js` | — |
| T-06 Registrar un riego desde la API | `src/routes/riegos.js` (`POST /api/riegos`) | `src/routes/plantas.js` (`GET /api/plantas/:id/riegos`), `src/app.js` (montar el router) |
| T-07 Pruebas de aceptación de HU-1.2 | — | `test/riego.model.test.js` (cubrir CA-1.2.2, 1.2.5 y 1.2.6); esta spec (registrar el resultado de los curl de CA-1.2.1 a 1.2.4 y 1.2.7) |

`src/dominio/` no se usa en este sprint: las reglas de HU-1.1 y HU-1.2 son validaciones de los
modelos. Queda reservada para el cálculo "necesita agua" de E2.

## 6. Puntos abiertos

El PRD y el backlog ya están alineados con esta spec (mililitros, campos opcionales, estrategia de
pruebas y tickets). Quedan abiertas dos preguntas para el cliente:

- ¿`cantidadMl` debe ser un número entero? Hoy se acepta cualquier número mayor que 0.
- ¿`cuidador` debe ser obligatorio? Hoy es opcional, porque el MVP no tiene inicio de sesión.

Además, los dos `GET` adelantan una versión mínima de HU-1.4 y HU-1.5 para poder verificar los
criterios. Esas historias siguen "por refinar".

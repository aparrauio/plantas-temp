# AGENTS.md — Invernadero Encantado

## Proyecto
API REST para registrar las plantas mágicas de un invernadero y sus riegos.

## Stack
- Node.js 20+ con Express 5 y Mongoose 8
- CommonJS (`require` / `module.exports`)
- Tests con `node --test`
- Formato con Prettier

## Estructura prevista
- `src/app.js`: configuración de la app Express (sin `listen`)
- `src/index.js`: punto de entrada; conecta a MongoDB y levanta el servidor
- `src/models/`: modelos de Mongoose
- `src/routes/`: routers de Express
- `src/dominio/`: funciones puras con la lógica del dominio
- `test/`: pruebas
- `docs/prd/`: documentos de requisitos de producto
- `docs/specs/`: especificaciones de cada funcionalidad

## Comandos
- `npm run dev`: inicia el servidor en modo desarrollo
- `npm test`: ejecuta las pruebas

## Convenciones
- Nombres del dominio en español (`planta`, `riego`, `invernadero`)
- camelCase para variables y funciones
- Rutas REST bajo `/api` (p. ej. `/api/plantas`, `/api/riegos`)

## Reglas
- Nunca leer ni modificar `.env`.
- Nunca escribir credenciales en el código.
- Ninguna funcionalidad se implementa sin una spec en `docs/specs/`.
- Ejecutar `npm test` antes de dar una tarea por terminada.

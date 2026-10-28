# Mini-PRD — Invernadero Encantado (MVP)

## 1. Problema
Los cuidadores del invernadero no saben con certeza qué plantas mágicas necesitan agua hoy.
Dependen de la memoria o de notas sueltas, así que algunas plantas se secan y otras se riegan de más.

## 2. Usuarios
- **Cuidador:** registra plantas y riegos, y consulta qué plantas necesitan agua.

## 3. Objetivo y métrica de éxito
- **Objetivo:** que un cuidador sepa en una sola consulta qué plantas necesitan agua.
- **Métrica:** 0 plantas con riego vencido sin aparecer en la consulta. En pruebas, el
  resultado coincide al 100 % con el cálculo manual de las reglas de negocio.

## 4. Alcance del MVP
1. Registrar una planta con su nombre, especie, ubicación e intervalo de riego en días.
2. Registrar un riego de una planta con la cantidad de agua, incluida una fecha pasada para
   riegos olvidados.
3. Consultar el listado de plantas y el historial de riegos de cada una.
4. Consultar qué plantas necesitan agua a la fecha de hoy.

## 5. No-alcance
- Usuarios, inicio de sesión y permisos.
- Notificaciones o recordatorios automáticos.
- Varios invernaderos.
- Otros cuidados (abono, poda, luz) y sensores de humedad.
- Interfaz gráfica: el MVP es solo la API.

## 6. Reglas de negocio
- Nombre, especie, ubicación e intervalo son obligatorios al registrar una planta.
- El intervalo de riego es un número entero de días, como mínimo 1.
- No se puede registrar un riego de una planta que no existe.
- La cantidad de agua de un riego es obligatoria y debe ser mayor que 0.
- Un riego no puede tener fecha futura; sí puede tener fecha pasada.
- Si una planta tiene varios riegos, cuenta el más reciente.
- Una planta que nunca se ha regado cuenta desde su fecha de registro.
- Una planta necesita agua cuando, desde su último riego (o su registro), han pasado
  al menos tantos días como su intervalo.

## 7. Supuestos
- [SUPUESTO] Los días se cuentan como días de calendario en la zona horaria del invernadero,
  no como horas transcurridas.
- [SUPUESTO] Una planta "toca hoy" cuando han pasado exactamente tantos días como su intervalo,
  y aparece en la consulta igual que una vencida.
- [SUPUESTO] El sistema asigna la fecha de registro de la planta en el momento de crearla.
- [SUPUESTO] No se aceptan riegos con fecha anterior a la fecha de registro de la planta.
- [SUPUESTO] La cantidad de agua se expresa en litros y admite decimales.

## 8. Puntos abiertos
- ¿Se puede anular o corregir un riego registrado por error?
- Si se cambia el intervalo de una planta, ¿se aplica de inmediato sobre el último riego?
- ¿La consulta se ordena por días de retraso?
- ¿Hay plantas que no deben aparecer, como muertas, retiradas o en reposo?
- ¿Se permiten dos plantas con el mismo nombre?
- ¿Hay un máximo para el intervalo de riego o para la cantidad de agua de un riego?
- ¿Se aceptan dos riegos de la misma planta el mismo día?

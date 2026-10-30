Store propio (context + reducer) persistido en localStorage, clave `obp-prototipo-v2`.

- `index.js`: punto de entrada (`StoreProvider`, `useStore`, funciones puras, `formatoMXN`, `formatoFecha`).
- `reglas.js`: fases y transiciones puras (`responder`, `responderTodos`, `confirmarSeleccion`, `aceptarCotizacion`, `avanzar`, `reiniciar`, `reducer`).
- `selectores.js`: `fasesDeCampana`, `progresoPropuesta`, `cotizacion`, `instalacion`, `reportes`, `resumenCampana`, `indicadores`.
- `instalacion.js`: plan de instalación simulada (30 s).
- `persistencia.js`: carga y guardado con validación de versión.

En componentes: `const s = useStore()`; acciones sin estado (`s.responder(codigo, medioId, 'si')`) y selectores ligados (`s.cotizacion(codigo)`, `s.instalacion(codigo)` usa el reloj interno `s.ahora`).

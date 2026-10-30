# Plan del prototipo único

Spec: `docs/PROTOTIPO_SPEC.md`. Cada tarea se acepta tras revisión del orquestador. Estado: `[ ]` pendiente, `[x]` aceptada.

| # | Tarea | Tier | Depende de | Verificación |
|---|---|---|---|---|
| 0 | [x] Especificación de componentes de Órbita desde Figma → `docs/ORBITA_COMPONENTES.md` | Heavy | — | Cada componente con medidas, variantes, estados y tokens exactos |
| 1 | [x] Scaffold `prototipo/` (Vite + React + HashRouter + singlefile + Vitest), tokens CSS de Órbita | Medium | — | `npm run build` y `npm test` pasan; `dist/index.html` abre con file:// |
| 2 | [x] Librería de componentes Órbita en `src/orbita/` | Careful | 0, 1 | Galería `#/componentes` revisada contra Figma |
| 3 | [x] Semilla y store (5 campañas, flujo de Alpina, persistencia, reinicio, avance de instalación) | Careful | 1 | Pruebas Vitest del flujo completo |
| 4 | [x] Login y Mis campañas | Medium | 2, 3 | Revisión de diseño y de flujo |
| 5 | [x] Detalle de campaña con Stepper | Medium | 2, 3 | Revisión de diseño y de flujo |
| 6 | [x] Propuesta de medios | Careful | 2, 3 | Revisión de diseño y de flujo |
| 7 | [x] Cotización con Modal de aceptación | Medium | 2, 3 | Revisión de diseño y de flujo |
| 8 | [x] Instalación (Figma 543:31890) | Careful | 2, 3 | Revisión de diseño y de flujo |
| 9 | [x] Reportes y visor de reporte (Figma 868:50236 y 1479:94329) | Careful | 2, 3 | Revisión de diseño y de flujo |
| 10 | [x] Verificación final del recorrido | Medium | 4–9 | Alpina en 6 etapas, reinicio, fases pasadas de las otras 4 |

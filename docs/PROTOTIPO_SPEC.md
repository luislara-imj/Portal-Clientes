# Prototipo único del portal de clientes (spec)

Fuente de verdad para construir `prototipo/`. La carpeta `maqueta/` queda como referencia visual y de datos; no se modifica.

Referencias: `docs/PLAN_UX.md` (flujo, tokens, componentes), `docs/ARQUITECTURA_INFORMACION.md` (estados), `docs/TEMPLATES_REFERENCIA.md` (columnas y reglas de precios), `docs/estructura-medios-cliente.md` (claves y tipos de medio), `docs/FIGMA_REFERENCIAS.md` (enlaces de Figma), `docs/CATALOGO_FIGMA.md`.

## 1. Objetivo

Una sola app que se abre directo, sin configurar nada, con datos que persisten entre pantallas y recargas. Solo Alpina recorre el flujo completo; las otras cuatro campañas quedan en su fase y permiten consultar sus fases pasadas.

No incluye: derrotero, recuperación de contraseña, subida de artes, descarga real de archivos (el botón solo avisa).

## 2. Stack

- React 18 + Vite, en `prototipo/`. Rutas con `HashRouter` (react-router-dom 6).
- Build con `vite-plugin-singlefile`: `prototipo/dist/index.html` se abre con doble clic (file://) y funciona igual que en `npm run dev`.
- Estado en un store propio (context + reducer) persistido en `localStorage`, clave `obp-prototipo-v2`.
- Pruebas de lógica con Vitest (store, reglas de fase, avance de instalación).
- Sin librerías de UI externas: los componentes se construyen a partir de Órbita (Figma) en `prototipo/src/orbita/`.

## 3. Persistencia y reinicio

- Todo cambio se guarda al momento. Un refresh normal conserva el estado.
- Botón visible "Reiniciar datos" en la barra superior, en todas las pantallas excepto login. Pide confirmación con Modal de Órbita y deja todo como la semilla.
- La semilla vive en un solo módulo: `prototipo/src/data/semilla.js`.

## 4. Campañas

Cliente: Ana López · Cliente de ejemplo S.A. Código de campaña: `INICIALES-NÚMERO-MARCA-CUENTA-MES-AÑO`. La propuesta usa el código de campaña como identificador (no hay folio aparte).

| Código | Nombre | Fase inicial | Flujo |
|---|---|---|---|
| JRA-0021-ALPINA-ALPINA_LECHE-NOV-2026 | Alpina Leche | Propuesta lista | Completo |
| MLR-0009-BAJIO-BAJIO_OTOÑO-NOV-2026 | Bajío Otoño | En selección | Consulta |
| NAV-0014-NORTEÑA-NORTEÑA_NAVIDAD-DIC-2026 | Norteña Navidad | Cotización lista | Consulta |
| JRA-0016-COCACOLA-COCACOLA_ZERO-OCT-2026 | Cocacola Zero | En instalación | Consulta |
| JRA-0005-SOLARIA-SOLARIA_VERANO-JUN-2026 | Solaria Verano | En reporte | Consulta |

Cada campaña tiene datos simulados completos para todas sus fases hasta la actual: propuesta con respuestas, cotización, instalación y reportes, según corresponda. Las fases pasadas se abren en modo consulta (solo lectura, con un aviso "Fase cerrada · solo consulta"). Las fases futuras se ven bloqueadas con el motivo.

## 5. Flujo de Alpina

Cada paso desbloquea el siguiente. Cada cambio se refleja en listado, detalle, indicadores y Stepper.

1. **Propuesta lista.** Tres plazas: CDMX, ZMG (Guadalajara) y MTY (Monterrey). En cada plaza, de 5 a 10 medios de Sitios fijos, de Camiones y de Indoor. Vallas móviles: una solicitud por plaza con unidades numeradas. Brand riders: los 6 formatos (Mass Awareness, Blitz y Blitz Premium, en 180 y 360) con unidades numeradas; unidades y meses provisionales (4 unidades, 1 mes).
2. **Revisión.** El cliente responde Sí / No en cada medio y unidad. Estado "En selección" desde la primera respuesta. No hay "No" implícito: "Confirmar selección" se activa cuando todos tienen respuesta; si faltan, el texto dice cuántos.
3. **Confirmar selección.** Estado "Selección confirmada" y se desbloquea Cotización ("Cotización lista"). La selección sigue editable hasta aceptar la cotización; si cambia, la cotización se recalcula.
4. **Cotización.** Solo los medios marcados Sí. Por tipo de medio: tabla con precio unitario, precio con descuento, total. Cierre: Subtotal, Descuento, Subtotal con descuento, IVA 16%, Total con IVA. Botón "Aceptar y arrancar campaña" abre el Modal de confirmación.
5. **Aceptar.** Estado "Aceptada" → "En instalación". Instalación avanza sola: cada medio llena su porcentaje poco a poco y toda la campaña termina en unos 30 segundos. El avance se calcula con la hora de inicio guardada, así que continúa tras recargar. Estatus por medio: Por instalar → En instalación → Instalado.
6. **Instalación completa.** Estado "Instalada" → se desbloquea Reportes con el **reporte fotográfico inicial** completo. Los reportes mensuales dependen del periodo de la campaña (noviembre y diciembre para Alpina): se muestran bloqueados con su fecha de publicación (último día del mes). Estado final "En reporte".

## 6. Diseño

- Fidelidad a Figma (`docs/FIGMA_REFERENCIAS.md`): Instalación = nodo 543:31890, Reportes = nodo 868:50236, archivo de reporte = nodo 1479:94329. Las demás pantallas siguen las maquetas aprobadas en `maqueta/` y los componentes de Órbita.
- Solo componentes y tokens de Órbita (`prototipo/src/orbita/`), modo OBP Light y OBP Dark. Sin estilos sueltos: todo color, radio, espaciado y sombra sale de tokens.
- Tipografía: SF Pro con respaldo Inter.
- Navegación: barra superior con logo, cliente, Tema y Cerrar sesión (sin barra lateral, decisión vigente). Migas en cada pantalla. Stepper de fases en el detalle y en cada fase.
- Estados obligatorios por pantalla: vacío, bloqueado (con motivo y qué falta), completado (consulta), cargando cuando aplique.
- Estados de color: nunca solo color; siempre ícono o texto. Texto de estado sobre blanco solo con `text/primary` o `text/danger`.
- Montos: `$1,240,000 MXN`. Ceros de audiencia: "Sin dato". Todos los medios tienen precio.

## 6.1 Decisiones de componentes (sobre `docs/ORBITA_COMPONENTES.md`)

`docs/ORBITA_COMPONENTES.md` es la fuente de medidas, variantes, estados y tokens. Donde Figma deja una opción abierta, vale esto:

- **Radio de botones y campos:** `pill?` = sm (8 px), como en las pantallas de producto. Figma trae 0 por defecto.
- **Sí / No de la propuesta:** el componente "Switch" de Órbita (control segmentado). El interruptor on/off es "Toogle" y no se usa para esto.
- **Texto de estado:** se usan los colores de Badge, Tag y Alerts tal como vienen en Órbita, siempre con ícono o punto y etiqueta. El contraste bajo de los textos de éxito, advertencia e información queda anotado como observación para el equipo de Órbita.
- **Fase bloqueada en el Stepper:** Órbita no tiene estado de bloqueo. Se usa el estado pendiente con ícono de candado y el motivo como texto visible debajo del paso (no en tooltip).
- **Contraseña:** Input de Órbita con Icon button de ojo al final para mostrar u ocultar.
- **Íconos:** Órbita usa Font Awesome 7 Pro. Sin licencia web disponible, se usa Font Awesome Free en SVG (`@fortawesome/react-fontawesome`) con el equivalente más cercano. Si hay kit Pro, se cambia en un solo módulo (`src/orbita/Icon.jsx`).
- **Radios y sombras de superficies:** los de Figma (Modal con shadow-3, Popover radio 12, Tooltip radio 8).
- **Barra superior:** Órbita no tiene app bar con logo (Header es encabezado de página). Se compone con Logo, texto, Avatar y Button de Órbita.
- **Tarjetas genéricas:** superficie con radio 12, borde `border/subtle` y shadow-1; tarjeta de medio y tarjeta KPI según Figma.

## 7. Calidad

Por pantalla: un worker construye; el orquestador revisa contra Figma y Órbita con capturas; un worker revisa el flujo (desbloqueo, guardado y reflejo en otras secciones). Al final, un recorrido completo de Alpina, prueba de "Reiniciar datos" y consulta de fases pasadas de las otras cuatro campañas.

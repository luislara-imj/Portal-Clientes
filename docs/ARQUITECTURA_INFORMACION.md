# Arquitectura de información del portal de clientes (fase 1)

Base: `docs/PLAN_UX.md` (decisiones) y `docs/TEMPLATES_REFERENCIA.md` (contenido de propuesta, cotización y derrotero). Versión 1, para validar antes de wireframes.

## 1. Mapa de sitio

```
Login (correo y contraseña)
└─ Mis campañas
   └─ Campaña [nombre, folio, vigencia, estatus, Stepper de fases]
      ├─ 1. Propuesta de medios
      │   ├─ Pestaña Sitios fijos   → ciudad → medios (¿Lo incluyes? Sí / No)
      │   ├─ Pestaña Camiones       → ciudad → medios (¿Lo incluyes? Sí / No)
      │   ├─ Pestaña Indoors        → ciudad → medios (¿Lo incluyes? Sí / No)
      │   ├─ Pestaña Vallas móviles → ciudad → medios (¿Lo incluyes? Sí / No)
      │   └─ Pestaña Brand riders   → opción 1, opción 2 (¿Lo incluyes? Sí / No)
      ├─ 2. Cotización              → por tipo de medio, descuento, IVA, total
      │   └─ Aceptar y arrancar campaña (Modal de confirmación)
      ├─ 3. Derrotero (camiones)    → por ciudad y ruta (consulta)
      ├─ 4. Instalación             → estatus por medio (Gantt / lista)
      └─ 5. Reportes                → periodos publicados y galería de fotos
```

Notas:

- **Derrotero** no es un paso del flujo sino una consulta. Se llega desde la cotización o desde la propuesta cuando hay camiones.
- **Instalación** y **Reportes** solo se desbloquean después de aceptar la cotización. Antes se ven en estado bloqueado con la leyenda de qué falta.
- **Mis campañas** es la única entrada. El cliente no crea campañas.

## 2. Estados de la campaña

Estado de la campaña (lo calcula OBP, el cliente solo lo ve):

| Estado | Cuándo ocurre | Qué ve el cliente |
|---|---|---|
| Propuesta lista | OBP publica la propuesta. | Propuesta para revisar. |
| En selección | El cliente marcó medios pero no confirmó. | Propuesta con cambios guardados. |
| Selección confirmada | El cliente confirmó. | Mensaje de que se prepara la cotización. |
| Cotización lista | OBP publica la cotización. | Cotización para aceptar. |
| Aceptada | El cliente aceptó. | Instalación en seguimiento. |
| En instalación | Hay medios por instalar o en instalación. | Gantt o lista con avance. |
| Instalada | Todos los medios aceptados están instalados. | Acceso a reportes. |
| En reporte | Hay reportes publicados. | Reportes por periodo. |

Estado de cada medio dentro de la propuesta:

| Estado | Significado | Casilla |
|---|---|---|
| Sin responder | El cliente no ha marcado nada. | Vacía |
| Incluido | El cliente lo quiere. | Marcada (Sí) |
| No incluido | El cliente lo descarta. | Desmarcada (No) |

Regla: "Sin responder" cuenta como pendiente en el contador "X de Y respondidos". El cliente debe responder todos los medios antes de confirmar. No hay "No incluido" por omisión.

## 3. Pantallas por paso

### 3.1 Propuesta de medios

- **Encabezado**: cliente, campaña, vigencia, responsable comercial, folio y fecha de emisión. Estado de la campaña.
- **Barra de resumen** (fija al hacer scroll): medios elegidos, impactos de la selección, inversión de la selección, inversión con descuento, inversión de toda la propuesta.
- **Pestañas** por tipo de medio, con contador de elegidos por pestaña.
- **Tabla por ciudad**: encabezado de ciudad con cantidad de medios y subtotales. Una fila por medio con casilla "¿Lo incluyes?", datos del medio, impactos, audiencia y precios.
- **Columna de precio** con dos formas (ver sección 4): precio cliente y precio con descuento.
- **Acciones**: Confirmar selección (se activa solo cuando todos los medios tienen respuesta). Descargar propuesta (opcional).
- **Móvil**: la tabla se convierte en tarjetas por medio. La casilla queda al inicio de cada tarjeta. Los datos de audiencia se agrupan en un acordeón.

### 3.2 Cotización

- **Encabezado** igual que la propuesta, con folio y vigencia en días.
- **Solo medios aprobados**: incluye únicamente los medios marcados como Sí, y los brand riders marcados como Sí.
- **Por tipo de medio**: tabla con ciudad, formato, detalle, clave IMJ, unidades, tiempo de servicio, inicio, fin, precio unitario, precio con descuento por medio, contratación mensual, costo de impresión y total. Subtotal del tipo de medio.
- **Cierre de la cotización** (fila por fila, en este orden):
  1. Subtotal general.
  2. Descuento. **Fila nueva**: el template no la tiene, pero se agrega porque el cliente acepta el total con descuento.
  3. IVA (16%).
  4. Total con IVA.
- **Bloques de texto**: tu campaña incluye, condiciones de pago, aclaraciones.
- **Acción principal**: "Aceptar y arrancar campaña" con Modal de confirmación (un clic). Después de aceptar, la acción se reemplaza por el estado "Aceptada".
- **Descarga opcional**: botón secundario "Descargar PDF" y "Descargar Excel". No es el flujo principal.
- **Tarifa del periodo oculta**: no se muestra. El total sí.
- **Móvil**: cada medio se muestra como tarjeta con precio unitario y total.

### 3.3 Derrotero (camiones)

- Lista por ciudad con rutas: nombre, tipo de exhibición, categoría, unidades, punto de inicio y final, recorrido.
- Recorrido expandible por ruta (acordeón).
- Disclaimer: "puede variar por la operación".

### 3.4 Instalación

- Encabezado con avance: medios instalados de total.
- Vista por defecto: Gantt por medio (inicio y fin planeados, avance). Alternativa: lista con estatus.
- Estatus por medio: por instalar, en instalación, instalado, con incidencia.
- Bloqueada antes de aceptar la cotización.

### 3.5 Reportes

- Lista de reportes publicados: periodo, tipo y fecha de publicación.
- Al abrir un reporte: portada, índice por tipo de medio y galería con Lightbox.
- Filtro por periodo con Date Picker.
- Estado vacío: "Tus reportes aparecerán aquí cuando se publiquen".

## 4. Precios

- Todos los medios de la propuesta tienen precio. OBP no publica una propuesta con medios sin precio, así que el portal no necesita un estado "Sin precio" para el cliente.
- En la propuesta, cada medio muestra precio cliente y precio con descuento.
- En la cotización, cada medio muestra precio unitario y precio con descuento. El resumen muestra el descuento total y el total con IVA.
- Un cero en métricas de audiencia sigue mostrándose como "Sin dato". No es un precio.

## 5. Decisiones de esta ronda

- **Color de campaña**: el portal usa siempre Órbita. El color de campaña solo aparece en los documentos descargables.
- **Medios sin responder**: el cliente debe responder todos antes de confirmar. "Confirmar selección" se activa cuando el contador marca "N de N respondidos". No hay "No incluido" por omisión.
- **Precios**: todos los medios tienen precio. Se elimina el caso "Sin precio" del diseño.
- **Cotización**: incluye solo los medios marcados como Sí. Los brand riders aparecen solo si el cliente los marcó como Sí.
- **Descuento**: se muestra por medio en la cotización y también como total.

Pendientes: ninguna que bloquee. La siguiente fase son wireframes de baja fidelidad, empezando por propuesta y cotización.

# Especificación de tabla para Cotización (Figma "Table", sistema Órbita)

Fuente: Figma `0rfdP9ig7IZmvqN8ygCwbN`, raíz "Table" (1:3). Lectura con `get_design_context`, `get_metadata` y `get_variable_defs`; no se modificó el archivo.
Nodos leídos: Table Template 39:9443, Table Content Template 37:6198, Colum 31:24110, Cell 21:22197 (variantes Default, Hover, Selected, Numerica, Fecha, Tags, Primary, Link y Chevron 1, 2 y 5), Header Cell 1:22628 (Default, Hover, Filter + Sort up), _Options 21:5315.
Todos los valores salen de las variables del archivo (modo OBP Light). Los tokens van con el nombre de Figma y su hex.

## 0. Cómo está armada la tabla en Figma

- **Table Template (39:9443):** contenedor con fondo `#ffffff`, borde de 1 px `color/border/default` `#c6c8cc`, radio 16 (`radius/surface/sheet`), padding 16 y gap 16. Apila `_Table Tool Bar` (64 de alto), la tabla y `Pagination` (50 de alto).
- **Table Content Template (37:6198):** fila horizontal de `Colum` con `overflow: clip`. Mide 1714 px dentro de un contenedor de 1408, así que el template muestra una barra de scroll horizontal.
- **Colum (31:24110):** cada columna es una pila vertical (Header Cell + 11 Cell). Tiene fondo `color/bg/surface/tertiary/default` `#e1e3e5` y gap de 2 px. **El separador entre filas no es un borde:** es ese fondo que se ve por el hueco de 2 px. En React, el equivalente visual es `border-bottom: 2px solid #e1e3e5` en la cabecera y en cada fila menos la última.
  - Variante **Key Column** (31:24053, 240 px, encabezado sin checkbox): es la que usamos en todas nuestras columnas.
  - Variantes **Checkbox Column** (31:24018) e **Icon Column** (31:24017), de 50 px: se omiten.
- No hay separadores verticales entre columnas. La única excepción es la columna de acciones fija del template, con borde izquierdo de 2 px `color/border/subtle` `#d4d6d9`. No la usamos.
- No hay rayado alterno (zebra) en las filas.

## 1. Columnas → variante de Cell

**Base común a todas las celdas.** Alto 56 (`space_56`), padding `0 16` (`space_16`), gap 8 (`space_8`) y radio 0 (`radius/control/na`). Fondo `color/bg/surface/default` `#ffffff`. Texto en una línea con `white-space: nowrap`, `overflow: hidden` y `text-overflow: ellipsis`.
**Texto base (Body SM Regular).** SF Pro, 14 px, interlineado 20.5, peso 400, tracking 0.5 px, color `color/text/primary` `#313336`.
**Encabezado de todas las columnas.** Header Cell Default con el checkbox oculto, como en Key Column (detalle en la sección 2).

| Columna | Variante Figma (nodo) | Tipografía y color | Alineación | Notas |
|---|---|---|---|---|
| Ciudad | Default (21:22196) | Body SM Regular, `#313336` | Izquierda | No usar Primary (21:22314): trae avatar y subtexto. |
| Formato | Default (21:22196). Alternativa: Tags (29:3738) con la Tag `_gray` | Default: Body SM Regular. Tag gray: 12/17.5, peso 600, `#313336` sobre `color/bg/fill/tertiary/default` `#f0f1f2` | Izquierda | Tag: alto 20, padding `2 4 2 6`, radio 8 (`radius/control/sm`). Las otras tags de la variante son semánticas (éxito `#f1fef6`/`#1ca34e`, peligro `#fef1f1`/`#b83434`): no usarlas para un formato. |
| Detalle | Default (21:22196) | Body SM Regular | Izquierda | En Figma es una sola línea con ellipsis. No existe celda multilínea (pregunta 1). |
| Clave IMJ | Default (21:22196) | Body SM Regular | Izquierda | |
| Unidades | Numerica (262:4766) | Body SM Regular | **Derecha** (`justify-content: flex-end`) | El ejemplo de Figma es moneda. Aquí va un entero sin `$`. |
| Tiempo de servicio | Default (21:22196) | Body SM Regular | Izquierda | |
| Inicio, Fin | Fecha (262:44315) | Body SM Regular | Izquierda | Formato del ejemplo: `DD/MM/AAAA` (`14/12/2025`). La celda es igual a Default; solo cambia el contenido. |
| Precio unitario, Contratación mensual, Costo de impresión, Total | Numerica (262:4766) | Body SM Regular | **Derecha** | Formato del ejemplo: `$1,456.00` (coma de miles, 2 decimales). Numerica no tiene versión en negrita. Body SM Bold (14/20.5, peso 700) solo existe en la variante Primary. |

Ancho: el componente mide 240 por defecto, pero las instancias se pueden redimensionar y el ancho no es un token. Con 12 columnas a 240 px la tabla mide 2880 px. El template de Figma resuelve el desbordamiento con scroll horizontal.
Las celdas tienen dos booleanos ocultos por defecto, `showIcon` (icono `shapes` de 16 px, `#616469`) y `showFile` (insignia "pdf"). Se dejan apagados.

## 2. Fila de encabezado

- **Componente:** Header Cell, estado Default (1:22625), con todos los booleanos en False.
- **Medidas:** alto 48 (`size/control/lg`), padding `0 16`, gap 8 y radio 0.
- **Fondo y separador:** fondo `#ffffff`. El encabezado no tiene borde propio; el separador inferior es el mismo hueco de 2 px `#e1e3e5`.
- **Etiqueta (Body XS Regular):** SF Pro, 12 px, interlineado 17.5, peso 400, tracking 0.5 px, color `color/text/secondary` `#585a5e`. Va en MAYÚSCULAS, en una línea con ellipsis. En Figma el texto ya está escrito en mayúsculas ("HEADER TITTLE "); en código, usar `text-transform: uppercase` con las etiquetas normales.
- **Checkbox del encabezado:** 16×16, borde de 1 px `#c6c8cc` y radio 2 (`radius/surface/forms`). **Se oculta**, igual que en Key Column.
- **Iconos que no usamos:** `lock-open`, `filter` y `arrow-down-arrow-up`. Son Font Awesome 7 Pro Regular de 10 px, dentro de un icon button de 20×20 con radio 6 y color `#616469`. Activos pasan a Solid: el filtro aplicado en `color/icon/selected` `#3251b1` y el orden `arrow-up`/`arrow-down` en `#3658c1`.
- **Estados a omitir:** Hover (1:22649; solo sirve para mostrar esos iconos, con fondo `#f7f8fa`), Column Locked, Filter Applied, Sort up, Sort Down y todas sus combinaciones, Only Check (1:23394) y Only Icon (1:23507).
- **Estados a conservar:** Default. Skeleton (1:23567) solo si se implementa un estado de carga.
- **Columnas numéricas:** el Header Cell de Figma solo alinea la etiqueta a la izquierda (pregunta 3).

## 3. Filas

- **Alto:** 56.
- **Separador:** 2 px `color/bg/surface/tertiary/default` `#e1e3e5`. Entre el encabezado y la primera fila va el mismo. Después de la última fila no hay separador.
- **Hover (Cell State=Hover, 21:22229):** fondo `color/bg/surface/hover` `#f7f8fa`; el texto no cambia. Opcional en una tabla de solo lectura.
- **Selected (21:22243):** fondo `color/bg/surface/brand/default` `#f1f4fe` y texto `color/text/brand/selected` `#243a80`. **No se usa.**
- **Disabled y Focused:** existen en todas las variantes; no se usan.
- **Checkbox de selección:** **no se necesita**, porque el cliente solo lee la cotización. Se omiten Checkbox Column (31:24018), el checkbox del encabezado, Cell Checkbox (30:3735) y `showCheckbox` de Primary.
- **Omitir también:** Icon Column, la columna de acciones fija (editar, borrar, compartir, pdf) y `_Options` (21:5315: barra de botones Default / One Option).

### Fila de sección "Sitios fijos · 8 medios" con subtotal

- **No existe en Figma.** El archivo no tiene fila de grupo de ancho completo, fila de subtotal ni fila de totales.
- **Patrón más cercano:** Cell **Chevron 1** (666:50683). Es un icon button transparente de 32×32 con `chevron-down` (Font Awesome Regular de 16 px, `color/icon/default` `#4d5054`) seguido de una etiqueta Body SM Regular. Chevron 2 a 5 son niveles de anidación: padding izquierdo de 32 en el nivel 2 y de 96 en el nivel 5 (3 y 4 no se leyeron). O sea, Figma modela un grupo como **fila padre dentro de la misma rejilla de columnas**, no como banda de ancho completo.
- **Propuesta:**
  - Fila de 56 px dentro de la misma rejilla y con el mismo separador.
  - Primera celda: Chevron 1 con la etiqueta "Sitios fijos · 8 medios", extendida con `colSpan` hasta la última columna antes del bloque de montos.
  - Columna Total: celda Numerica con el subtotal. Las demás celdas de monto quedan vacías.
  - Si el grupo no se pliega, usar `showChevron=false`; el hueco de 32 px se conserva.
- **Lo que Figma no define para esta fila:** el peso del texto y el fondo (pregunta 2). El único 14 px en negrita del archivo es Body SM Bold (700, variante Primary); es el candidato para la etiqueta y el subtotal.

## 4. Tokens usados (modo OBP Light)

| Token Figma | Valor | Uso en la tabla |
|---|---|---|
| `color/bg/surface/default` | `#ffffff` | Celdas, encabezado, contenedor |
| `color/bg/surface/tertiary/default` | `#e1e3e5` | Separador entre filas (2 px) |
| `color/bg/surface/hover` | `#f7f8fa` | Hover de fila y de encabezado |
| `color/bg/surface/brand/default` | `#f1f4fe` | Fila seleccionada (no se usa) |
| `color/bg/fill/tertiary/default` | `#f0f1f2` | Tag gray |
| `color/text/primary` | `#313336` | Texto de celda |
| `color/text/secondary` | `#585a5e` | Etiqueta del encabezado |
| `color/text/tertiary` | `#6c6e73` | Subtexto de Primary (no se usa) |
| `color/text/brand/selected` | `#243a80` | Texto de fila seleccionada (no se usa) |
| `color/text/link/default` | `#3251b1` | Celda Link (no se usa) |
| `color/icon/default` | `#4d5054` | Chevron de la fila de sección |
| `color/icon/secondary/default` | `#616469` | Iconos del encabezado y `showIcon` (no se usan) |
| `color/border/default` | `#c6c8cc` | Borde del contenedor, borde del checkbox |
| `color/border/subtle` | `#d4d6d9` | Borde de la columna fija (no se usa) |
| `space_2` / `space_8` / `space_16` / `space_56` | 2 / 8 / 16 / 56 | Separador / gap / padding horizontal / alto de fila |
| `size/control/lg` | 48 | Alto del encabezado |
| `radius/surface/sheet` / `radius/control/sm` / `radius/control/xs` / `radius/surface/forms` | 16 / 8 / 6 / 2 | Contenedor / Tag / icon button del encabezado / checkbox |
| Body SM Regular / Semibold / Bold | 14 / 20.5, pesos 400 / 600 / 700, tracking 0.5 | Celdas / Link / Primary |
| Body XS Regular / Semibold | 12 / 17.5, pesos 400 / 600, tracking 0.5 | Encabezado / Tag |

En el código generado conviven dos nomenclaturas para el mismo valor: `--ui-color-text-primary` y `color/text/primary`. Ya está registrado en CATALOGO 3.7.

**Conflictos con docs/PLAN_UX.md y docs/CATALOGO_FIGMA.md:**
1. **Contenedor:** Figma usa radio 16 (`radius/surface/sheet`) y borde `#c6c8cc` (`border/default`). PLAN_UX dice tarjeta con radio 12 y borde `border/subtle` `#d4d6d9`, y reserva 16 para modales. Propuesta: para la tabla, seguir a Figma, porque el brief la toma como referencia.
2. **Separador de filas:** `#e1e3e5` (`bg/surface/tertiary`) de 2 px no aparece en ninguno de los dos documentos, que solo listan `#c6c8cc` y `#d4d6d9`. Hay que agregarlo a la lista de tokens.
3. **Hover:** la tabla resuelve la duda 11 del CATALOGO (dos fondos de hover). Las filas usan `color/bg/surface/hover` `#f7f8fa`, no `#f0f1f2`. Ojo: `#f7f8fa` también es el color del canvas.
4. **Tipografía:** PLAN_UX menciona una escala compacta para tablas densas (Body SM a 12). La tabla de Figma usa la escala regular: celdas a 14 y encabezado a 12. El encabezado Body XS a 12 coincide con lo que CATALOGO resolvió en la duda 14.
5. **Tokens nuevos que faltan en los documentos:** `#243a80` (`text/brand/selected`), `#616469` (`icon/secondary`) y `#3251b1` como `icon/selected`. Ninguno es necesario en solo lectura.
6. **Tags:** el texto de éxito `#1ca34e` no pasa AA (regla de PLAN_UX). Si Formato va como tag, usar `_gray` (`#313336` sobre `#f0f1f2`).
7. **Riesgo de fuentes:** los iconos (`chevron-down`) son **Font Awesome 7 Pro**, una fuente de pago. La maqueta React necesita licencia o un icono equivalente. La familia de texto es SF Pro; en web, el fallback es Inter según PLAN_UX.

## 5. Contenido de muestra del archivo que hay que reemplazar

- `HEADER TITTLE ` (con typo y espacio final): las etiquetas de nuestras columnas.
- `Cell Content` (Default, Link, Primary) y `Sub Content` (Primary): datos reales.
- `$1,456.00` (Numerica): montos y unidades.
- `14/12/2025` (Fecha y también la etiqueta de ejemplo de Chevron 1 a 5): fechas de inicio y fin, y "Sitios fijos · 8 medios".
- **No se usan:**
  - Stars: estrella amarilla `#eab308` y "0.0".
  - Avatars: pila de fotos de 32 px con borde `#c6c8cc` y una "A".
  - Avatar azul `#3658c1` con icono `user` de Primary.
  - Tag de estatus "Disponible" con `circle-small`.
  - Tags "Ganado", "Perdido" y "+3".
  - Icono `shapes` de la Icon Column.
  - Iconos de acciones (lápiz, basura, compartir, pdf).
  - Insignia "pdf" de `_file types`.
- **Toolbar y paginación:** si se reutilizan, traen texto de muestra.
  - Toolbar: "Buscar...", cinco "Text Button" y el autocomplete "Placeholder".
  - Paginación: "Mostrando página 1 de 200", páginas 1 a 5 y selector "8".
  - Este documento no define si van en la cotización.

## 6. Preguntas abiertas

1. **Detalle multilínea.** Figma solo tiene celdas de una línea con ellipsis y alto fijo de 56. ¿Qué hacemos?
   - (a) Truncar y mostrar el texto completo en un tooltip.
   - (b) Permitir 2 líneas de 14/20.5 dentro de los 56 px (41 px de texto; se sale del componente).
   - (c) Dejar que la fila crezca (rompe el ritmo de 56 px).
2. **Fila de sección "Sitios fijos · 8 medios".** Hay que definir tres cosas:
   - El fondo: blanco como Chevron 1, o un gris de Órbita. `#f7f8fa` no sirve porque es el color de hover.
   - El peso: Body SM Bold 700 para la etiqueta y el subtotal.
   - Si el chevron pliega el grupo o se oculta (`showChevron=false`).
3. **Encabezado de columnas numéricas.** Figma no tiene Header Cell alineado a la derecha. ¿Alineamos la etiqueta a la derecha, sobre los montos, con un ajuste de CSS (`justify-content: flex-end` en Header Cell/Base), o la dejamos a la izquierda como en el componente?

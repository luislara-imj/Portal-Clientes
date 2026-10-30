# Templates de referencia: qué muestra hoy cada documento

Fuente: 16 archivos que compartió el usuario (templates y ejemplos llenos de la campaña CA-0280). Estos documentos son **referencia de contenido**. El flujo de enviar archivos se reemplaza por el portal: la propuesta, la selección y la aprobación ocurren en el portal.

## 1. Propuesta de medios (pauta con detalle)

Hoy es el Excel que recibe el cliente para marcar qué medios quiere. En el portal es la pantalla de **Propuesta de medios**.

**Encabezado**: cliente, campaña, vigencia (inicio al fin), responsable comercial, folio y fecha de emisión.

**Resumen (hoja 1)**: una fila por tipo de medio con:

- Medios propuestos y medios elegidos.
- Impactos de la selección.
- Inversión de la selección.
- Inversión con descuento.
- Inversión de toda la propuesta.
- Total de la propuesta.

**Pestañas por tipo de medio**: Sitios fijos, Camiones, Indoors, Vallas móviles.

**Estructura de cada pestaña**:

- Filas agrupadas por **ciudad**, con conteo de medios y subtotales de la ciudad.
- Una fila por medio con la columna **"¿Lo incluyes?"** (Sí / No). Cuando dice Sí, la fila se resalta.

**Columnas por tipo de medio**:

| Tipo | Datos del medio | Impactos y audiencia | Perfil de audiencia | Inversión |
|---|---|---|---|---|
| Sitios fijos | Disponible, clave IMJ, formato, dirección, vista, iluminación, medida, inicio, fin, comentarios, referencias comerciales, ubicación ("Ver en mapa"), latitud, longitud | Impactos, impactos totales, alcance, frecuencia promedio, tiempo de exposición (seg/mes) | Hombres, mujeres, NSE AB, C+, C, D+, D, E, edades 0 a 14 hasta 35 a 44, 45 a 64 y 65 o más | Precio cliente, precio con descuento |
| Camiones | Ruta, tipo de exhibición, categoría, tipo de anuncio, inicio, fin | Impactos únicos, alcance mensual, impactos totales, frecuencia mensual, tiempo de exposición, km promedio | Hombres, mujeres | Precio cliente, precio con descuento |
| Indoors | Disponible, clave IMJ, formato, inmueble, nivel, área, a nivel de piso, descripción, comentarios, dirección, inicio, fin | Impactos, alcance, impactos totales, frecuencia | Hombres, mujeres, NSE ABC+, C, C-, D+, DE, edades 13 a 17 hasta 55 o más | Precio de producción, precio cliente, precio con descuento |
| Vallas móviles | Clave IMJ, inicio, fin | — | — | Precio cliente, precio con descuento |

**Reglas de presentación** (de la guía del template):

- Frecuencia y tiempo de exposición se muestran como **promedio**, nunca como suma ni como %.
- Impactos, alcance, frecuencia, tiempo de exposición y perfil en **cero** se muestran como "Sin dato".
- Precios en **cero** se muestran como "Sin precio".
- Hombres y mujeres son porcentajes en Sitios fijos y Camiones, pero cantidad de personas en Indoors.
- Los porcentajes de NSE y edades se guardan como fracción (0.25 = 25%).
- Precios en MXN, antes de IVA.
- La guía indica que el color de la campaña puede cambiar en el documento (por defecto verde `#00D084`).

**Teléfono de contacto** en el pie: 33 3640 0944 o 33 3640 6194.

## 2. Cotización

Se genera cuando el cliente ya marcó medios. En el portal es la pantalla de **Cotización**.

**Estructura** (una tabla por tipo de medio, en este orden: Sitios fijos, Indoors, Camiones, Vallas móviles):

| Columna | Qué es |
|---|---|
| Ciudad | Ciudad del medio. |
| Formato | Tipo de medio (espectaculares, mupi, pantalla digital, etc.). |
| Detalle | Ubicación o especificaciones. |
| Clave IMJ | Identificador del medio. |
| Unidades | Cantidad contratada. Único campo que edita el comercial. |
| Tiempo de servicio | Duración (17 días o 1 mes). |
| Inicio / Fin | Fechas del medio. |
| Precio unitario | Precio mensual por unidad. |
| Contratación mensual | Unidades × precio unitario. |
| Costo de impresión | Si aplica; si no, 0. |
| Total | Unidades × tarifa del periodo + impresión. |
| Tarifa del periodo por unidad | **Oculta en el documento**. Costo real prorrateado que calcula OBP. |

**Cierre de la cotización**:

- Subtotal por tipo de medio y subtotal general.
- IVA al 16%.
- Total con IVA.
- **Tu campaña incluye** (texto).
- **Condiciones de pago** (ejemplo: 50% anticipo y 50% contra instalación).
- **Aclaraciones** (ejemplo: precios sujetos a disponibilidad).
- Vigencia en días (ejemplo: 15).
- Responsable comercial y firma.

**Punto importante de UX**: la columna "Contratación mensual" no coincide con el "Total" cuando el periodo es menor a un mes (ejemplo: 17 días). El portal debe explicar esa diferencia o mostrar solo el total con una nota.

### Brand riders

Formato distinto: **dos opciones que se cotizan por separado**. El cliente elige la que mejor le convenga.

Por opción: nombre, unidades, tiempo de servicio (meses), tipo de vehículo, precio unitario mensual y costo extra. Cada opción tiene su subtotal, IVA y total.

Ejemplo: opción 1 "Wrap 180° · Parcial", 20 unidades, 2 meses, $16,000 MXN mensuales cada una. Opción 2 "Wrap 360° · Completo", 8 unidades, 1 mes, $29,000 MXN.

## 3. Derrotero de camiones

Documento de recorridos. Solo para camiones. En el portal es una sección de la campaña, a la que el cliente entra desde la cotización o desde la propuesta.

**Encabezado**: atención a, campaña, responsable comercial y resumen (total de unidades y rutas).

**Por ciudad**, cada ruta tiene:

- Ruta (nombre o número).
- Tipo de exhibición.
- Categoría (urbana, etc.).
- Unidades.
- Punto de inicio y punto final.
- Derrotero: calles y puntos del recorrido, separados por comas.

Pie: "El derrotero describe el recorrido habitual de cada ruta y puede variar por la operación".

## 4. Campos comunes (entidades para el modelo de datos)

| Entidad | Campos clave |
|---|---|
| Campaña | Folio, nombre, cliente, vigencia inicio y fin, responsable comercial, color de campaña. |
| Propuesta | Campaña, tipos de medio incluidos, medios por ciudad, selección Sí / No por medio. |
| Medio | Clave IMJ, tipo, formato, ciudad, ubicación (dirección, latitud, longitud), inicio, fin, métricas de audiencia, precio cliente, precio con descuento. |
| Cotización | Campaña, líneas por medio (unidades, tiempo de servicio, precio unitario, costo de impresión, tarifa del periodo oculta), subtotales, IVA, total, condiciones de pago, incluye, aclaraciones, vigencia en días. |
| Opción de brand rider | Nombre, unidades, meses, tipo de vehículo, precio mensual, costo extra. |
| Derrotero | Ruta, tipo de exhibición, categoría, unidades, punto de inicio, punto final, recorrido. |

## 5. Datos de ejemplo: observaciones

Los archivos de ejemplo tienen datos que hay que validar antes de producción:

- Vallas móviles: varias filas con precio 0 (se mostrará "Sin precio").
- Un medio con detalle "GDL-12345678" (parece dato de prueba).
- Un medio en Guanajuato con precio 0.
- Textos de origen con "-", "Sin referencias" y "Sin comentarios" (la guía los normaliza a "—").

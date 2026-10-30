# Estructura de medios para el proyecto de clientes

Fuente: `obp-pautado` (modelo en `src/domain/types.ts`, fichas y tarjetas en `src/features/map/`).

## 1. Modelo de datos de un medio

Tipo `Media` en `src/domain/types.ts`.

| Grupo | Campos |
|---|---|
| **Identidad** | `id`, `clave` (código OBP `IMJ-{plaza}-{tipo}-{O/I}-{consecutivo}{A/B/NA}`; las rutas usan su nombre), `nombre` (texto libre), `claveProveedor` |
| **Clasificación** | `group` (`fijo`, `camion`, `indoor`, `valla`, `br`), `subtipo` (p. ej. Espectacular, Cartelera, Muro, Parabús), `plaza` (CDMX, GDL, MTY) |
| **Ubicación** | `direccion`, `lat`, `lng`, `pois[]` (bancos, farmacias, metro, etc.) |
| **Características** | `ancho`, `alto` (m), `iluminacion` (con/sin luz), `vista` (natural/cruzada), `nse` (A/B, C+, C, D+, D/E), `material`, `acabados`, `implementacion` (admite luces u otra intervención), `permisoSeduvi` (CDMX) |
| **Rutas (camiones)** | `tipoRuta` (Urbana, Hotelera, AAA, AA, A), `formatos[]` (Integral, Semi-integral, Medallón, Medio medallón), `inicio`, `destino`, `ruta` (derrotero, número, color) |
| **Indoor** | `padreId` apunta a un **Indoor Padre** (aeropuerto, centro comercial, autoservicio) con clave, nombre, categoría, plaza y dirección |
| **Imagen** | Sin fotos reales. El prototipo genera un marcador por código (componente `Photo` en `src/features/map/MediaCard.tsx`) según subtipo y clave |

## 1.1 Claves por tipo de medio

Fuente: `src/data/seed.ts` (constantes `PLAZA_CODE` y `TIPO_CODE`) y `src/domain/types.ts`.

**Plazas:** CDMX → `CDMX`, Guadalajara → `ZMG`, Monterrey → `MTY`.

| Tipo de medio | Clave | Ejemplo |
|---|---|---|
| Sitio fijo | `IMJ-{plaza}-{tipo}-O-{consecutivo}{A\|B}` | `IMJ-CDMX-CAR-O-8419A` |
| Ruta (camión) | Su número, sin código de tipo | `R-MT01` |
| Indoor Padre | `IMJ-{plaza}-{categoría}-I-{consecutivo}NA` | `IMJ-CDMX-AER-I-…NA` |
| Espacio indoor | `IMJ-{plaza}-{tipo de espacio}-I-{consecutivo}NA` | `IMJ-CDMX-TOT-I-…NA` |

- **Sitio fijo:** `O` indica medio exterior. El sufijo `A` es vista natural y `B` es vista cruzada.
- **Ruta:** no lleva código de tipo. La clave es el número de ruta (`R-{plaza}{nn}`).
- **Indoor (padre y espacio):** `I` indica interior. El sufijo `NA` significa no aplica, porque el espacio no tiene vista natural ni cruzada.
- **Consecutivo:** número creciente que asigna el sistema. No tiene significado de negocio.

**Códigos de tipo:**

| Tipo | Código | Tipo | Código |
|---|---|---|---|
| Espectacular | ESP | Aeropuerto | AER |
| Cartelera | CAR | Centro Comercial | CCO |
| Muro | MUR | Autoservicio | AUT |
| Pantalla digital | PAN | Pantalla de bienvenida | PAN |
| Puente peatonal | PTP | Tótem | TOT |
| Parabús | PAR | Banda de equipaje | BEQ |
| | | Columna | COL |
| | | Piso | PIS |
| | | Backlight | BKL |
| | | Escalera eléctrica | ESC |

**Ojo:** `PAN` se usa tanto para Pantalla digital (sitio fijo) como para Pantalla de bienvenida (indoor). Como el grupo está en el prefijo `O` o `I`, la clave sigue siendo única, pero el código de tipo no alcanza para identificar el tipo por sí solo.

**Identificadores internos** (`id`, como `MX-F001`, `IP-01` o `IP-01-E1`): son del sistema, no se deben mostrar a clientes.

## 2. Cómo se presenta al cliente

**Tarjeta de catálogo** (`MediaCard.tsx`, 250 px): imagen, tipo/subtipo, clave, plaza, vista (o formato en rutas) y marca de "exclusivo" si aplica.

**Ficha técnica** (`FichaPanel.tsx`):
- **Ubicación:** plaza, dirección, coordenadas y un enlace "Ver en Google Maps". En rutas: número, tipo, plaza, kilometraje, inicio, destino y enlace al trayecto.
  - Medio fijo e Indoor Padre: `https://www.google.com/maps/search/?api=1&query={lat},{lng}` (pin en la coordenada del medio).
  - Ruta: `https://www.google.com/maps/dir/?api=1&origin={primer punto}&destination={último punto}` con los extremos de `ruta.coords` (formato `[lng, lat]`, invertir al armar el enlace).
- **Medio:** tamaño (ancho × alto y m²), material, acabados, implementación, iluminación, vista, NSE, POI cercanos, permiso SEDUVI, Indoor Padre al que pertenece.
- **Precio:** precio de venta mensual. En rutas cambia según el formato elegido.

**Indoor Padre** (`PadreFicha.tsx`): nombre, clave, categoría, plaza, dirección y lista de espacios internos con tipo y clave.

## 2.1 Especificación de UI

Capturas tomadas del prototipo corriendo en local (`http://localhost:5173`, plaza CDMX, medio `IMJ-CDMX-CAR-O-8419A`). Son de la vista **interna**: la versión para clientes debe omitir los elementos marcados como internos.

### Tarjeta de medio en lista (fila)
Captura: [capturas-ui/tarjeta-fila-medio.jpg](capturas-ui/tarjeta-fila-medio.jpg)

Fuente: `src/features/shared/MediaRowCard.tsx`.
- Miniatura de 44 × 44 px con radio de 8 px (`Photo`, marcador de posición por clave).
- Clave en negrita (13 px / 18 px de línea); es el enlace que abre la ficha.
- Línea de tipo: subtipo (o formato en rutas) y precio de venta `$X/mes` en negrita.
- Estado con punto de 8 px de color y etiqueta. **Interno:** omitir en clientes.
- Fila de altura mínima 64 px, con padding de 12 px horizontal y 10 px vertical, radio de 12 px y borde de 1 px.
- Acción a la derecha (check de "Agregar a la pauta"). **Interno:** omitir en clientes.

### Tarjeta de catálogo (250 px)
Fuente: `src/features/map/MediaCard.tsx`, componente `CardShell`. No la localicé en la UI corriendo, así que esta especificación viene del código.
- Ancho fijo de 250 px, radio de 12 px, borde de 1 px, sombra `0 4px 4px rgba(0,0,0,0.2)`, padding inferior de 16 px y separación de 16 px entre bloques.
- Imagen de 141 px de alto con esquinas superiores redondeadas. Si el medio está inactivo, se muestra en escala de grises.
- Insignia de "exclusivo" (check verde) en la esquina superior izquierda.
- Tipo en mayúsculas (caption), clave en negrita color marca (clickeable para abrir la ficha) y plaza con ícono de pin.
- Pastilla de vista ("Vista Natural" o "Vista Cruzada"). En rutas, selector de formatos.
- Botón "Agregar" a ancho completo. **Interno:** omitir en clientes.
- Insignias de actualización y de disponibilidad interna en la esquina superior derecha. **Interno:** omitir en clientes.

### Ficha técnica (panel lateral)
Captura: [capturas-ui/ficha-tecnica.jpg](capturas-ui/ficha-tecnica.jpg)

Fuente: `src/features/map/FichaPanel.tsx`.
- Panel flotante de 400 px de ancho, a la izquierda de la pauta, con 12 px de separación arriba y abajo. Borde de 1 px, radio de 12 px y sombra grande.
- Encabezado con clave (color marca, negrita) y subtítulo "Grupo · Subtipo", más botón de cerrar.
- Pestañas **Datos** y **Calendario**. *Calendario* es interno: omitir en clientes.
- Foto de 176 px de alto con radio de 12 px.
- Botón "Agregar" a ancho completo. **Interno:** omitir en clientes.
- Secciones con título pequeño en mayúsculas (10 px) y pares etiqueta/valor en rejilla de 112 px + contenido.
- Para medios fijos: Ubicación, Medio, Proveedor y bloque de precios. Para rutas: Ruta y selector de formato.
- Bloque de precio: "Precio de venta" en azul claro. "Costo" y "Margen" son internos: omitir en clientes.
- Enlace a Google Maps (ver sección 2 para el formato de URL).

## 2.2 Tipos de medio: detalle por grupo

Fuentes: `src/data/seed.ts` (datos mock), `src/domain/types.ts`, `src/domain/budget.ts` (grupos) y `src/domain/requests.ts` (vallas y Brand Rider).

El catálogo tiene cinco grupos (`Group`). Tres son medios con inventario y ficha (`fijo`, `camion`, `indoor`). Los otros dos, **Vallas Móviles** (`valla`) y **Brand Rider** (`br`), no son inventario: son formatos de solicitud con precio fijo.

### Sitios fijos (`fijo`)
Subtipos del catálogo: Espectacular, Cartelera, Muro, Pantalla digital, Puente peatonal y Parabús.

| Campo | Valores |
|---|---|
| Tamaño | Pantalla digital: 3, 4 o 6 m de ancho × 2, 3 o 4 m de alto. Resto: 6, 7.2, 9, 12.9 o 14.6 m de ancho × 3, 3.6, 4 o 7.2 m de alto |
| Material | Pantalla digital: "Pantalla LED". Resto: "Lona frontlit" |
| Acabado | Resto: "Bolsa perimetral de 15 cm por lado". Pantalla digital: sin acabado |
| Iluminación | Con luz o sin luz |
| Vista | Natural o cruzada |
| Implementación | Permitida (admite luces u otra intervención) o no permitida |
| Permiso SEDUVI | Solo CDMX, código con formato `ES/###/AE/RT###` |
| Precio | Mensual de venta. El costo es interno |

Muro y Puente peatonal se muestran con una imagen horizontal (de marcador) en lugar de la de soporte vertical.

**Variantes que pueden aparecer en cualquier subtipo:**
- **Vista:** natural (clave con sufijo `A`) o cruzada (sufijo `B`).
- **Iluminación:** con luz o sin luz.
- **Exclusividad:** exclusivo o por proveedor. Si es exclusivo, la tarjeta muestra una insignia de check verde.
- **Nombre de captura** (opcional, texto libre): por ejemplo "VISTA GENERAL LIBRE", "9 x 7 m lado de extra", "Frente a plaza comercial" o "LADO EXTRA". Es un dato interno de captura; no lo muestres a clientes sin revisarlo.
- **Permiso SEDUVI:** solo en CDMX y en la mayoría de los medios de esa plaza. En GDL y MTY no aplica.

En el modelo de datos, las dimensiones se eligen de un conjunto fijo por subtipo, sin relación directa con el tamaño real del soporte. Trátalas como ejemplos, no como medidas oficiales.

### Camiones / rutas (`camion`)
- **Tipo de ruta:** Urbana, Hotelera, AAA, AA o A.
- **Formatos:** uno a tres por ruta, de Integral, Semi-integral, Medallón o Medio medallón. Cada formato tiene su precio. El precio del formato Integral es el de referencia; los demás son proporcionales.
- **Número de ruta:** `R-{plaza}{nn}`, por ejemplo `R-MT01`.
- **Inicio y destino:** colonia y calle, en texto.
- **Derrotero:** 15 puntos (`coords`) con un color persistente. Se usa para dibujar la ruta en el mapa y calcular el kilometraje.
- **Iluminación:** sin luz. **Vista:** natural. Las rutas no tienen dimensiones ni material en el modelo.

### Indoor (`indoor`)
Los espacios pertenecen a un **Indoor Padre**. En el mock hay ocho padres:

| Categoría | Padres de ejemplo |
|---|---|
| Aeropuerto | AICM Terminal 1, Aeropuerto Guadalajara, Aeropuerto Monterrey |
| Centro Comercial | Antara Fashion Hall, Plaza Andares, Galerías Valle Oriente |
| Autoservicio | Walmart Tlalpan, Soriana Cumbres |

Cada padre tiene entre tres y seis espacios internos. Subtipos de espacio: Pantalla de bienvenida, Tótem, Banda de equipaje, Columna, Piso, Backlight y Escalera eléctrica.

- **Tamaño:** 1.2, 2 o 3 m de ancho × 1.8, 2 o 2.4 m de alto.
- **Iluminación:** siempre con luz. **Vista:** natural.
- **Clave:** `IMJ-{plaza}-{tipo}-I-{consecutivo}NA`.
- **Ubicación:** la del padre, con una variación de pocos metros.

### Vallas Móviles (`valla`) y Brand Rider (`br`)
No tienen ficha ni tarjeta de medio. Se venden como formatos con precio unitario mensual, y se pide una cantidad por plaza y periodo. Se presentan en la pantalla de solicitudes (`RequestsView`).

| Grupo | Formato | Detalle | Precio mensual (MXN) |
|---|---|---|---|
| Vallas | Valla en camioneta | 3 × 1.5 m, 2 caras | 38,000 |
| Vallas | Valla en camión 3.5 t | 5 × 2.4 m, 3 caras | 62,000 |
| Vallas | Valla en tráiler | 12 × 2.8 m, 2 caras | 95,000 |
| Vallas | Valla LED móvil | 4 × 2 m, pantalla digital | 120,000 |
| Brand Rider | Mass Awareness 360 | Cobertura total de la unidad | 54,000 |
| Brand Rider | Mass Awareness 180 | Media cobertura de la unidad | 34,000 |
| Brand Rider | Blitz 360 | Activación corta, cobertura total | 42,000 |
| Brand Rider | Blitz 180 | Activación corta, media cobertura | 27,000 |
| Brand Rider | Blitz Premium 180 | Unidades premium, media cobertura | 48,000 |
| Brand Rider | Blitz Premium 360 | Unidades premium, cobertura total | 74,000 |

Brand Rider se organiza en tres familias (Mass Awareness, Blitz y Blitz Premium), cada una en versión 180 (media cobertura) y 360 (cobertura total). Son seis formatos en total, sin más variantes en el catálogo.

Vallas tiene cuatro formatos, uno por tipo de unidad.

Proveedores (internos): Rodamedia MX, Móvil Visual y Publiruta para vallas; Brand Riders MX, Moto Impacto y RiderAds para Brand Rider. **Omitir en clientes.**

Para clientes basta con mostrar el formato, el detalle, la plaza y el precio. Cantidad, periodo y proveedor son internos.

## 3. Qué omitir para clientes

**Omitir (disponibilidad y operativo):**
- Estado: `disponible`, `parcial`, `reservado`, `no_disponible` y `fueraInventario` (la etiqueta "Inactivo").
- Disponibilidad interna: `InternalBadge` e `INTERNAL_LABEL` (p. ej. "Revisar renovación").
- Actualización con el proveedor: `actualizadoHace`, `actualizadoEn` y los relojes de frescura (`src/design/AvailabilityBadges.tsx`).
- Calendario de ocupación y rangos `busy` / `free`.
- Botón "Agregar" a la pauta y selector de formato para pauta.
- **Costo y margen:** nunca deben salir. `src/domain/roles.ts` ya los separa por rol, y un cliente no debe tener ninguno de esos roles.

**Pendiente de decidir:**
- `permisionario` y `claveProveedor`: identifican al proveedor. Son operativos; se recomienda omitirlos.
- `exclusividad` (exclusivo o por proveedor): dato comercial. Se puede mostrar sin detallar el convenio.
- `permisoSeduvi`: dato de permiso público. Conviene confirmar con el área legal.

**Incluir para clientes:** clave, tipo/subtipo, plaza, dirección, coordenadas, dimensiones, iluminación, vista, NSE, POI, material, acabados, implementación, precio de venta mensual (`precio`). Para rutas: número, tipo, kilometraje, inicio, destino y formatos con su precio de venta.

## 4. Puntos a tener en cuenta
- Las imágenes son marcadores de posición; el proyecto de clientes necesitará las fotos reales desde otra fuente.
- El catálogo del prototipo son datos mock deterministas (`src/data/seed.ts`).
- Propuesta: un tipo `MediaPublico` con solo los campos de "Incluir" y un mapeo que excluya el resto, sin tocar el modelo interno.

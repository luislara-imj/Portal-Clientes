# Catálogo de patrones y componentes (archivos Figma)

Referencia para diseñar pantallas nuevas del portal. Resume siete archivos de Figma revisados en modo solo lectura: Gestión de artes, Reportes, Catálogos, Listado de campaña, Campañas Urbanos, Monitoreo y Data camiones. Nada se modificó en Figma.

Las cifras de instancias son conteos de la página revisada, no del archivo completo.

---

## 1. Patrones de diseño

### 1.1 Shell de aplicación (todas las pantallas)
Todos los archivos repiten el mismo esqueleto:
- **Searchbar** superior (~64–76 px).
- **Sidebar** izquierdo de 240 px con navegación en secciones y variante colapsada.
- **Header** de página (64 px) con título, subtítulo y CTA primario a la derecha.
- Contenedor principal de ~1200 px dentro de un frame de escritorio de 1440 px.

Usar este shell como base para cualquier pantalla de escritorio nueva.

### 1.2 Listado con tabla y barra de herramientas (patrón dominante)
Presente en Gestión de artes, Reportes, Catálogos, Listado de campaña y Data camiones.
- `_Table Tool Bar` arriba: búsqueda, filtros, multiselección, configuración de columnas.
- Tabla con `Header Cell` + `Cell` (en Data camiones cada columna es una instancia `Colum`).
- Checkbox de selección, columna de acciones (ver, editar, menú `…`).
- `Pagination` en el pie, con selector de filas por página.
- Filas agrupadas con separadores de conteo (ej. "VIGENTES (n)" / "VENCIDOS (n)").

**Cuándo usarlo:** cualquier catálogo o listado de registros.

### 1.3 Vista dual Lista / Kanban / Cards
Listado de campaña usa un segmented control Lista · Cards · Kanban. Rutas y Camiones (Catálogos) tienen vista cards/tabla. Mismo contenido, distinta presentación.

### 1.4 KPI tiles como filtro
Fila de tarjetas con icono, etiqueta y número grande, clicables para filtrar la lista (Listado de campaña: Todas, Propuestas, En negociación, Ganadas, Perdidas).

### 1.5 CRUD por entidad (alta, edición, desactivación)
Cada entidad de catálogo sigue el mismo set de pantallas:
`Catálogo` → `Nuevo` → `Editar` → `Desactivar` / `Activar` → `Hovers` / `Tooltips` → `Empty` → `Error` → `Filas completas` → `Sidebar colapsado`.
Data camiones y Catálogos lo aplican de forma consistente a 2–8 entidades.

**Recomendación:** al diseñar un catálogo nuevo, partir de este set y no inventar flujos.

### 1.6 Alta en modal por pasos
"Paso 1 / 2 / 3" con `Stepper` en Sitios fijos, Indoors, Proveedores y Rutas (Catálogos). Onboarding en Reportes usa el mismo patrón con 22 pasos.

**Cuándo usarlo:** formularios con más de 5–6 campos o dependencias entre pasos.

### 1.7 Confirmación y acciones destructivas
- `Modal Template` con título "¿Quieres continuar?" / "¿Estás seguro?", descripción de consecuencias y botón primario.
- Botón rojo (`#ef4444`) para desactivar o eliminar.
- Ejemplo de consecuencia explícita: "puede detonar tareas para el equipo de operaciones y no se puede deshacer".

### 1.8 Estados vacíos, carga y error
- **Empty:** "Aún no hay nada aquí…" + texto de apoyo con la acción siguiente.
- **Skeleton** y **Loader** para carga.
- **Error del servidor:** toast con ícono de peligro, barra roja y botón de cerrar. Campañas Urbanos usa el mismo texto genérico ("¡Ocurrió un error!, inténtalo de nuevo") en 15 flujos. Data camiones lo tiene con título por entidad ("No pudimos crear la unidad").
- **Error de validación:** en línea dentro del modal, con el campo en rojo y el mensaje debajo ("Este número ya está asignado a otro permisionario", Data camiones, "Nuevo permisionario"). Es el único modal de error de los siete archivos.
- Estado de solo lectura con tag "Solo lectura" (según rol).

### 1.9 Feedback
- `Toast` para confirmaciones (25–30 usos por archivo).
- `Tooltip` para ayudas (15–28 usos).
- `Alerts` para avisos de pantalla.
- Aviso de límite (ej. "Ya tienes 5 procesos abiertos…").

### 1.10 Línea de tiempo y estados de proceso
- Línea de tiempo vertical con estados completado / en curso / bloqueado (Reportes, descarga).
- `Timeline Item` y `Gantt Bar` para planeación de campañas (Campañas Urbanos).
- **Gantt en dos paneles:** tabla a la izquierda (checkbox, ruta, ECO, permisionario con avatar, estatus, propuesta con chip "+n", notas) y timeline a la derecha con cabecera de año y meses, línea vertical de "hoy" y scroll horizontal. Cada barra va en el color de su estado: verde (activa), ámbar (incidencia, con ícono de advertencia), gris (desactivada) y neutra (sin estado). La carga usa skeleton. El hover rellena la barra con su color de estado.
- Calendario de día/semana/mes (Gestión de artes, Campañas Urbanos).

### 1.11 Mapa como lienzo principal
Campañas Urbanos usa `Map Container` (1168×916) con controles de zoom a la derecha y panel de atajos.

### 1.12 Revisión de evidencia (validación)
Monitoreo: `Modal revisar evidencia` para validar evidencia de campo, con roles Supervisor, Creative y Administrador.

### 1.13 Móvil para operación en campo
Monitoreo incluye pantallas móviles (393×852) para el monitorista: tarjetas de tarea, notificaciones y teclado alfabético.

---

## 2. Componentes

Conteo aproximado de uso por archivo. "Núcleo" indica que aparece en la mayoría de archivos.

### 2.1 Núcleo (usar siempre)
| Componente | Uso típico | Notas |
|---|---|---|
| `Searchbar` / `SearchBar Deks` | Búsqueda superior | Dos variantes para lo mismo; unificar |
| `Sidebar` / `Sidebar navegacion` / `Sidebar filtros` | Navegación y filtros | Incluye variante colapsada |
| `Header` / `_Header` / `Navbar` | Encabezado de página | |
| `_Table Tool Bar` / `Toolbar` | Barra sobre tablas | Campañas Urbanos tiene `Toolbar - campañas urbanos` |
| `Table` / `Table Content Template` / `Table Cell` / `Header Cell` / `Cell` / `Colum` | Tablas | `Cell` es el de mayor uso (hasta 4,880 en Campañas Urbanos) |
| `Pagination` / `Paginator` | Paginación | |
| `Button` / `Icon button` | Acciones | Variantes de Figma: primary, secondary, tertiary, destructive, ghost. Estados: default, hover, pressed, selected, disabled, loading. Focus es booleano |
| `Input` / `Input number steper` / `Text Area` | Formularios | |
| `Autocomplete` | Búsqueda con sugerencias | 24–121 usos por archivo |
| `Modal Template` | Modales de acción | |
| `Toast` | Confirmación | |
| `Tooltip` | Ayuda contextual | |
| `Tag` / `Badge` / `Badge status` | Estados y categorías | "Solo lectura", "Vencido", estatus de campaña |
| `Icon Font` | Iconografía | |
| `Scroll bar` / `Divider` | Layout | |

### 2.2 Formularios y selección
`RadioButton`, `Checkbox` / `CheckBox`, `Switch` / `Toogle`, `Dropdown`, `Date Picker`, `Range Selector`, `Stepper`, `Drag and drop File`.

### 2.3 Datos y listas
`Card` (Dashboard, Catálogo, Inventario), `KanbanCard`, `User` / `Avatar`, `List`, `Item`, `Item two lines`, `Notification`, `Notification_Panel`.

### 2.4 Navegación y contexto
`breadcrumbs` / `Breadcrumb`, `Accordion`, `Popover`, `_Popover-base`, `Lightbox`, `_Dots navigation`, `Tap` / tabs.

### 2.5 Específicos por producto
- **Campañas Urbanos:** `Gantt Bar`, `Timeline Item`, `Map Container`, `Data Panel`, `List campañas`, `List incidencias`.
- **Reportes:** `Descarga de reportes` (línea de tiempo con estados), `_card` de plantilla con badge "Aplicado".
- **Monitoreo:** `_card tarea monitorista` / `_card tarea validador`, `Modal revisar evidencia`, `chrome Search Mobile` / `chrome Action Mobile`, `AlphabeticKeyboard`.
- **Listado de campaña:** `Badge status`, `Card- Dashboard` (variantes por estatus), `User`.
- **Data camiones:** `Filtros` (variantes 1.0 / 1.1 / 1.2).

### 2.6 Duplicados y nombres a limpiar antes de reutilizar
- `Searchbar` vs `SearchBar Deks`.
- `Checkbox` vs `CheckBox` (Reportes).
- `Toogle` vs `Switch` (Monitoreo y Campañas Urbanos). Typo heredado.
- `Colum` (debería ser `Column`).
- `Badge` vs `Badge status`.
- Frames sin nombre útil: "Frame 480969715", "List", "Frame 1".
- Typos: "errpr", "Tootlips", "camapaña", "Dissabled".

---

## 3. Tokens

### 3.1 Color (valores consistentes en los siete archivos)
| Rol | Nombre frecuente | Valor |
|---|---|---|
| Marca (botón primario, fondo) | `color/bg/fill/brand/default` | `#3658c1` |
| Marca (texto) | `color/text/brand/default` | `#2d49a1` |
| Marca (icono / foco) | `color/icon/brand`, `color/border/focus` | `#627dd0` |
| Marca deshabilitada | — | `#b8c5ee` |
| Superficie de marca | `color/bg/surface/brand/default` | `#f1f4fe` |
| Texto primario | `color/text/primary` | `#313336` |
| Texto secundario | `color/text/secondary` | `#585a5e` |
| Texto terciario | `color/text/tertiary` | `#6c6e73` |
| Texto sobre color | `color/text/text-on-color` | `#ffffff` |
| Icono por defecto | `color/icon/default` | `#4d5054` |
| Icono terciario | `color/icon/tertiary/default` | `#919499` |
| Borde | `color/border/default` | `#c6c8cc` |
| Borde sutil | `color/border/subtle` | `#d4d6d9` |
| Fondo canvas | `color/bg/canvas/d` / `bg/fill/secondary/default` | `#f7f8fa` |
| Hover | `color/bg/fill/hover` | `#f0f1f2` |
| Superficie | `color/bg/surface/default` | `#ffffff` |
| Peligro (fill, Órbita) | `color/bg/fill/danger/default` = `red-600` | `#d43c3c` |
| Peligro (paleta, variables) | `color/red/500` / `700` / `50` | `#ef4444` / `#b83434` / `#fef1f1` |
| Borde de éxito | `color/border/success` = `green-400` | `#53d382` |
| Fill de advertencia | `color/bg/fill/warning/default` = `yellow-600` | `#d09f07` |
| Éxito (fill, Órbita) | `color/bg/fill/success/default` = `green-500` en OBP Light; `green-600` en OBP Dark | `#22c55e` (Light) · `#1fb456` (Dark) |
| Éxito (paleta, variables) | `color/green/500` / `700` / `50` | `#22c55e` / `#1ca34e` / `#f1fef6` |
| Ámbar (incidencia) | Gantt | texto e ícono `#b58b06`, fondo `#fefbf1`, borde `#eab308` |
| Info (fill, Órbita) | `color/bg/fill/info/default` = `cyan-500` en OBP Light; `cyan-600` en OBP Dark | `#06b6d4` (Light) · `#06a4bf` (Dark) |
| Info (paleta, variables) | `color/cyan/500` / `700` / `50` | `#06b6d4` / `#0592aa` / `#f1fcfe` |

### 3.2 Tipografía
Familia **SF Pro** en todos los archivos.

| Estilo | Tamaño / interlineado | Pesos |
|---|---|---|
| H1 | 36 / 45 | 600 |
| H2 | 30 / 37.5 | — |
| H3 | 20 / 25 | 600 |
| Body LG | 18 / 26 | — |
| Body MD | 16 / 23 | — |
| Body SM | 14 / 20.5 | 400, 500, 700 |
| Body XS | 12 / 17.5 | 400, 600, 700 |
| Caption XS | 10 / `font.lh.10.snug` | — |

**Tipografía de Órbita (Fundations v.2, verificada):**
- Familia: SF Pro en las variables (`type/body/*/family`). El fallback Inter → Raleway → Open Sans → Lato viene de la documentación, no de las variables. Mono: IBM Plex Mono (`type/code/md/family`).
- Body MD: 16 / interlineado 23. Body SM: 14 / interlineado 20.5. Ambos con tracking 0.5 en variables.
- Pesos: 400, 500, 600 y 700.
- Densidad compacta: Body MD baja a 14 y Body SM baja a 12.
- Tracking en % entero: `tight` en headings grandes, `wide` en captions.
- Labels: Label MD 14, pesos 400 a 700.

### 3.3 Espaciado
Escala de Figma: `0, 2, 4, 6, 8, 10, 12, 16, 20, 24, 28, 32, 40, 48, 56, 64, 80, 96` (y sus negativos). Pasos de uso del portal: 4, 8, 12, 16, 24, 32, 48, 64.

### 3.4 Radios
| Uso | Valor |
|---|---|
| Control pequeño / botón | 8 |
| Control grande | 10 en Campañas Urbanos; 8 en `radius/control/md` del Gantt |
| Control xs | 6 |
| Tarjeta | 12 |
| Modal | 16 |
| Pill / avatar | 9999 |
| Cuadrado | 0 |

### 3.5 Tamaños de control e iconos
- Controles: xs 32, sm 36, md 40, lg 48.
- Iconos: 10, 16, 20, 24, 32.
- Avatar: 32 y 40.

### 3.6 Sombras
- `shadow-1`: `0 1px 2px #0000001a`.
- `shadow-3`: `0 4px 8px -2px #00000033` (modales, dropdowns).
- `shadow-5`: `0 16px 24px -8px #0000004d` (overlays grandes).
- `shadow-2`: `0 2px 4px -1px #00000033`. `shadow-4`: `0 8px 16px -4px #0000004d`.

### 3.7 Inconsistencias de tokens a resolver
- Cuatro nombres para la misma escala de espaciado: `Positive/space_N`, `Spacing/NNN`, `space_N`, `sizing/N`.
- Dos sistemas de color: `color/bg/surface/...` (más reciente) y `Blue-500`, `Neutral-100` (legado).
- `color/bg/canvas/d` no aclara si es "default" o "dark".
- `type/heading/h1` apunta a `type/heading/h2/family`.
- Duplicados de casing: `Type/Body/SM/Medium` y `type/body/...`.
- Dos azules de marca en Gestión de artes: `#3658c1` (fondo) y `#2d49a1` (texto). Son intencionales, pero hay que documentarlos.

---

## 4. Dudas abiertas
1. **Datos de mock inconsistentes:** Listado de campaña muestra 633 en "Perdidas" en el KPI, pero 324 en la columna del Kanban.
2. **Etiquetas de estatus:** componente en singular ("Propuesta") y columnas en plural ("Propuestas"). Falta un mapa oficial de etiquetas.
3. **Precio cliente / IMJ:** en tarjetas el cliente va en azul; en la fila ambos van en negro. Confirmar si es intencional.
4. **Catálogo de niveles** (Catálogos) está vacío: confirmar si es pendiente.
5. **UX Research** (Monitoreo) no pudo leerse; hay que volver a consultarla con un nodo específico.
6. **Tag** existe en v1 de Campañas Urbanos (27 usos) y no en v2; confirmar si se eliminó a propósito.
7. **Versiones:** Reportes v.3 (✅) vs v.2.2, y Campañas Urbanos v2 vs v1. Confirmar cuál es vigente.
8. **Variantes de botón, input, badge y tag:** no se enumeraron propiedades desde metadata. Falta `get_design_context` sobre un componente concreto.
9. **"Modal de asignación" no existe con ese nombre.** El modal de la página v2 (444:261681) se llama "Editar fecha": Modal Template de 500 px con el nombre de la campaña, rango de Periodo (Autocomplete) y acciones Cancelar / Guardar cambios. Hay variantes con tipo de asignación (441:255647) y un estado de incidencia (488:280376) sin mensaje de error en rojo. Confirmar si la asignación vive en otra página.
10. **Gantt sin estado seleccionado:** solo tiene hover. Confirmar si falta en el diseño.
11. **Dos hovers de fondo:** `color/bg/surface/hover` (#f7f8fa) y `color/bg/fill/hover` (#f0f1f2) coexisten.
12. **Éxito e info:** resuelto. En OBP Light el fill de éxito es `green-500` (`#22c55e`) y el de info `cyan-500` (`#06b6d4`). En OBP Dark son `green-600` (`#1fb456`) y `cyan-600` (`#06a4bf`). Los textos `#1ca34e` y `#0592aa` no pasan contraste sobre blanco; ver PLAN_UX sección 2.
13. **Azul 600:** resuelto. La variable `color/blue/600` = `#3251b1`. El bloque de código de Colors con `#3575DD` no es el valor oficial.
14. **Body XS:** la tabla de roles de Órbita lista 14/400, pero los tokens dan `type.body.xs` = `font.size.xs` (12) con `font.lh.12.normal`. Vale el token: 12. La tabla de roles es el error. No hay variable de Body XS en Figma, así que no está aplicado en el archivo que consultamos.
15. **Tracking:** las variables dan 0.5 en Body MD y Body SM. La documentación dice tracking en % entero. Las variables mandan; revisar la documentación.

---

## 5. Cómo usar este catálogo
1. Para una pantalla de listado: shell (1.1) + tabla con toolbar (1.2) + set CRUD (1.5).
2. Para un formulario largo: modal por pasos (1.6).
3. Para una acción destructiva: modal de confirmación (1.7) y botón de peligro.
4. Para cualquier pantalla: estados vacío, carga y error (1.8) antes de darla por terminada.
5. Tokens: usar solo los de la sección 3; no crear valores nuevos sin documentarlos.

## 6. Cruce con PLAN_UX.md (sistema Órbita)

**Coinciden:** marca `#3658c1`, texto de marca `#2d49a1`, superficie de marca `#f1f4fe`, canvas `#f7f8fa`, superficie `#ffffff`, textos primario, secundario y terciario, bordes `#c6c8cc` y `#d4d6d9`, peligro `#ef4444`, familia SF Pro.

**Componentes equivalentes:** Sidebar, Header, Table (con Cell y Header Cell), Pagination, Filtros, Checkbox, Switch (Toogle), Badge y Tag, Stepper, Toast, Notification, Alerts, Tooltip, Popover, Accordion, Breadcrumbs, Tabs (Tap), Date Picker, Lightbox, Card, Modal (Modal Template), Gantt (Gantt Bar), Loader.

**Diferencias:**

| Tema | PLAN_UX | Catálogo |
|---|---|---|
| Éxito | `#22c55e` | `#22c55e` (fill Light); texto `#1ca34e` no pasa contraste |
| Info | `#06b6d4` | `#06b6d4` (fill Light); texto `#0592aa` no pasa contraste |
| Tipografía | SF Pro con fallback a Inter; escala regular y compacta | Solo SF Pro, sin escala compacta |
| Variantes de Button | primary, secondary, tertiary, destructive, ghost (resuelto en Figma) | Igual |
| Roles | Sin roles; todos hacen todo | Tag "Solo lectura" según rol |
| Móvil | Todas las pantallas responsivas | Solo Monitoreo (393×852) |

**Huecos solo en PLAN_UX:** hover y pressed de marca (`#3251b1`, `#2d49a1`), warning `#eab308`, modo OBP Dark, Semáforo, Logo, Pictures y Progress bar.

**Huecos solo en el catálogo:** Searchbar, `_Table Tool Bar`, Input, Autocomplete, Dropdown, Icon button, Skeleton, KanbanCard, Timeline Item, Map Container, y las medidas (espaciado, radios, tamaños de control, sombras).

**Verificación contra variables de Fundations v.2 (lectura del 28 oct 2026):** PLAN_UX y el catálogo ya coinciden en los fills de Light (`#22c55e`, `#06b6d4`). Los valores `#1fb456` y `#06a4bf` son los de OBP Dark. La tipografía de PLAN_UX (SF Pro con fallback a Inter, escala compacta) coincide en lo general; la familia real en variables es solo SF Pro.

Relacionado: [PLAN_UX.md](PLAN_UX.md) (sistema Orbita y tokens OBP).

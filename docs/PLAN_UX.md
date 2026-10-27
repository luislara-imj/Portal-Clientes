# Portal de Clientes OBP: plan de acción UI/UX

Estado: **borrador v3**. Decisiones de producto tomadas con el usuario (sección 8). Sin implementación todavía.

## 1. Objetivo y alcance

Maqueta funcional (prototipo en React) para que el cliente siga su campaña sin depender de un ejecutivo. Web y móvil, responsiva.

1. Ver sus campañas y su estatus.
2. Revisar los medios propuestos y **autorizar o rechazar** cada uno, dentro del portal. Hoy esto se hace por Excel; el portal lo reemplaza.
3. Ver la cotización cuando hay medios autorizados, y **aceptarla con un clic** para arrancar la campaña.
4. Seguir el **estatus de instalación** por medio.
5. Consultar **reportes fotográficos** cuando ya esté todo instalado.

Fuera de alcance del portal:

- Crear campañas. El cliente solo responde a lo que propone OBP.
- Enviar archivos o propuestas por correo. Todo ocurre en el portal.
- Configurar reportes (fechas, periodos, datos). Eso vive en otro módulo de OBP; el portal solo muestra el resultado.
- Subir artes. Cambio futuro: el cliente subirá sus artes dentro de su campaña. No sale en esta maqueta.

## 2. Sistema de diseño: Órbita

Los archivos de componentes son del sistema **Órbita** (archivo "Fundations v.2" y un archivo por componente). Accesibles por herramienta: probé 10 de ellos (Fundations, Button, Valorem, Table, Semáforo, Gantt, Stepper, Sidebar/Menu, Lightbox y Table). Los demás los reviso cuando los necesite.

### Tokens verificados (modo **OBP Light**)

| Uso | Token | Valor |
|---|---|---|
| Marca / acción primaria | `color/bg/fill/brand/default` | `#3658c1` |
| Acción primaria hover / pressed | `brand/hover`, `brand/pressed` | `#3251b1`, `#2d49a1` |
| Texto de marca / link | `color/text/brand/default`, `text/link/default` | `#2d49a1`, `#3251b1` |
| Superficie de marca (selección suave) | `bg/surface/brand/default` | `#f1f4fe` |
| Fondo de página | `color/bg/canvas/default` | `#f7f8fa` |
| Superficie (tarjetas, tablas) | `bg/surface/default` | `#ffffff` |
| Texto principal / secundario / terciario | `text/primary`, `text/secondary`, `text/tertiary` | `#313336`, `#585a5e`, `#6c6e73` |
| Borde por defecto / sutil | `border/default`, `border/subtle` | `#c6c8cc`, `#d4d6d9` |
| Éxito | `bg/fill/success/default` | `#22c55e` |
| Advertencia | `bg/fill/warning/default` | `#eab308` |
| Peligro (rechazar) | `bg/fill/danger/default`, `text/danger/default` | `#ef4444`, `#b83434` |
| Información | `bg/fill/info/default` | `#06b6d4` |

Notas:

- La colección **Semantic Color** tiene modos OBP y WIB. El portal usa solo **OBP Light** y **OBP Dark**. WIB queda fuera.
- Tipografía: SF Pro con fallback a Inter en web. Pesos 400, 500, 600 y 700. Hay escala regular y compacta (la compacta es para tablas densas).
- Radios, espaciados, sombras y z-index están en colecciones separadas; pendiente de extraer los valores exactos.

### Componentes de Órbita a usar

| Necesidad del portal | Componente de Órbita | Notas |
|---|---|---|
| Navegación lateral | **Sidebar/Menu** | El archivo de Figma es de la versión admin. Adaptar a menú de cliente: Mis campañas, y lo que aplique. |
| Encabezado | **Header** | Con avatar y nombre de usuario. |
| Logo | **Logo** | Versión OBP. |
| Lista de medios (autorizar / rechazar) | **Table** + **Switch** o **Checkbox** | Lista compacta con casilla por fila, como el Excel de hoy. |
| Paginación de tablas | **Pagination** | Si la lista de medios o campañas es larga. |
| Filtros | **Filtros** | Por estatus, periodo, tipo de medio. |
| Campañas en listado | **Cards** o **Table** | Según densidad; probar ambos en wireframe. |
| Estatus de campaña y medio | **Semáforo** y **Badge** / **Tag** | Semáforo para salud de la campaña; Badge o Tag para estatus por medio. |
| Selector de fases | **Stepper** | Horizontal en escritorio, vertical en móvil. Estados: seleccionado, completado, pendiente y error. |
| Línea de tiempo de instalación | **Gantt** | Muestra el avance de instalación por medio en el tiempo. |
| Confirmaciones (aceptar cotización) | **Modal** | Un clic con confirmación. |
| Mensajes de resultado | **Toast** y **Notification** | Tras autorizar o aceptar. |
| Alertas en línea | **Alerts** | Por ejemplo, medios pendientes de revisión. |
| Botones | **Button** | Variantes primary, secondary, tertiary, danger. Estados: default, hover, pressed, focus, disabled, loading. |
| Acordeones (detalle de cotización o medio) | **Accordion** | Opcional. |
| Breadcrumbs | **Breadcrumbs** | Campaña > Fase. |
| Pestañas dentro de una fase | **Tabs** | Por ejemplo, Medios / Cotización. |
| Fechas (periodo de reportes) | **Date Picker** | Filtro de periodo en reportes. |
| Carga o espera | **Spinner / Loader** y **Progress bar** | Estados de carga y avance. |
| Fotos de reportes | **Pictures** y **Lightbox** | Galería con visor y navegación entre fotos. |
| Información contextual | **Tooltip** y **Popover** | Por ejemplo, explicar un estatus. |

Componentes que hoy no se necesitan para el cliente: File Uploader (artes, fuera de alcance), Wysiwyg, Emoji picker, Color picker.

## 3. Referencias de producto (Figma de OBP)

| Referencia | Qué aporta | Qué no tomar |
|---|---|---|
| **Login SSO** (`x153D1vcXgvoRR804q5Yog`) | Pantalla de acceso sobre fondo de espectaculares, tarjeta con correo, contraseña, "Recordarme" y botón. Estados de carga, error de sesión y error de servidor. | Exploraciones antiguas (v1 y v2). |
| **Listado de campaña** (`I2GCfpGmEh2AHzMDVmXlWK`) | Tablero con KPIs, tabla con estatus, filtros y modales. | Acciones de administrador. |
| **Reportes** (`csTSq9wAK4FjAznrFTQXrz`) | Reporte de campaña con portada e índice por tipo de medio (sitios fijos, camiones, indoor, cierre). Base: v.3. | v.2 y v.2.1. |
| **Gestión de artes** (`7gjDLULAMgeqxTMkzfC1QE`) | Mockups de espectaculares, camiones y mapas. Referencia visual del medio. | Flujo interno de carga de arte. |
| **Prototipo** (`eIb7V9BluzRXMJx2EGBYBb`, nodo 543:31890) | Selector de fase con tres fases y pantallas de pauta. | Menú de admin (Carrito, Catálogos, Inventario, Herramientas). |

## 4. Modelo de usuarios y acceso

- **Varios usuarios por empresa cliente, sin roles.** Todos pueden hacer todas las acciones.
- **Alta de cuentas**: OBP entrega a cada cliente un usuario y contraseña.
- **Acceso**: formulario de correo y contraseña, con la pantalla de login de Órbita. No hay botón de SSO adicional.

## 5. Mapa de flujo del cliente

```
Login (correo y contraseña)
 └─ Mis campañas (listado con estatus)
     └─ Detalle de campaña  [Stepper de fases]
         ├─ 1. Propuesta de medios
         │     └─ Tabla con casilla por medio; desmarcar = rechazar
         │     └─ Confirmar selección
         ├─ 2. Cotización (visible cuando hay medios autorizados)
         │     └─ Aceptar y arrancar campaña (un clic con confirmación)
         ├─ 3. Instalación: estatus por medio (Gantt / lista)
         └─ 4. Reportes: lista de reportes publicados y galería de fotos
```

Estados de la campaña (propuesta, a validar):

- **Propuesta**: hay medios por revisar.
- **En revisión**: el cliente ya confirmó su selección parcial.
- **Cotizada**: hay medios autorizados y cotización disponible.
- **Aprobada / En instalación**: el cliente aceptó la cotización.
- **Instalada**: todos los medios aceptados están instalados.
- **En reporte**: se publican reportes.

## 6. Decisiones de UX clave

**Autorización simple, como el Excel de hoy.** Tabla con una fila por medio y casilla marcada. Desmarcar es rechazar. No hay motivo obligatorio. Lo que queda marcado es lo que se cotiza. Un botón "Confirmar selección" cierra la revisión.

**Cotización.** Visible solo cuando hay medios autorizados. Formato según el template de OBP (pendiente de revisar). Aceptación: un clic con confirmación, sin firma ni pago.

**Reportes.** Lista de reportes publicados con periodo y tipo. La frecuencia (mensual, quincenal, semanal, completo o parcial) la define OBP en otro módulo. El diseño debe soportar cualquier periodo, no uno fijo.

## 7. Pantallas (primera versión)

1. **Login**: formulario de Órbita, con estados de carga y error.
2. **Mis campañas**: lista con estatus, fechas, próxima acción pendiente y KPIs arriba.
3. **Detalle de campaña**: encabezado, breadcrumbs y Stepper de fases.
4. **Propuesta de medios**: tabla con casilla por medio, contador "X de Y autorizados", filtros y Confirmar selección.
5. **Cotización**: resumen de medios autorizados, total (y precio por medio si el template lo pide), descarga PDF y "Aceptar y arrancar campaña" con Modal.
6. **Instalación**: Gantt o lista por medio con estatus (por instalar, en instalación, instalado, con incidencia).
7. **Reportes**: lista de reportes publicados, galería con Lightbox y filtro por periodo con Date Picker.

Versión móvil de cada pantalla.

## 8. Decisiones tomadas

| Tema | Decisión |
|---|---|
| Usuarios | Varios por cliente, sin roles. Todos hacen todo. |
| Alta de cuentas | OBP entrega usuario y contraseña al cliente. |
| Acceso | Correo y contraseña, sin SSO adicional. |
| Autorización | Medio por medio con casilla; desmarcar = rechazar. Sin motivo obligatorio. Todo en el portal, sin Excel ni correo. |
| Aceptación | Un clic con confirmación. Sin firma ni pago. |
| Artes | Fuera del portal por ahora. Futuro: el cliente sube su arte dentro de su campaña. |
| Reportes | Solo consulta. La configuración vive en otro módulo de OBP. |
| Plataforma | Web y móvil, responsiva. |
| Stack | React, para maqueta funcional. |
| Sistema de diseño | Órbita, modos OBP Light y OBP Dark. WIB fuera. |
| Tema | Claro y oscuro. |
| Creación de campañas | No. |
| Propuesta | Reemplaza el Excel de selección. Pestañas por tipo de medio, agrupadas por ciudad, con "¿Lo incluyes?" (Sí / No) por medio. Detalle en `docs/TEMPLATES_REFERENCIA.md`. |
| Cotización | Se muestra al cliente cuando hay medios seleccionados. Sin la tarifa prorrateada oculta: el cliente ve el total. |
| Brand riders | Dos opciones cotizadas por separado; el cliente elige una. |
| Derrotero | Solo camiones. Consulta de recorridos por ruta. |

## 9. Pendientes

1. **Descuento**: la propuesta muestra "inversión con descuento", pero la cotización no tiene esa columna. ¿El cliente ve el descuento en la cotización y el total con descuento es el que acepta?
2. **Precio por medio**: ¿la cotización muestra precio unitario por medio, o solo subtotales por tipo de medio?
3. **Brand riders**: ¿pasan por la misma selección de medios, o el cliente solo elige una opción?
4. **Descarga**: ¿el cliente puede descargar la propuesta y la cotización en PDF o Excel desde el portal, o solo verlas en pantalla?
5. **Color de campaña**: los templates aplican un color por campaña (por defecto verde `#00D084`). ¿Se refleja en el portal o solo en los documentos descargables?
6. **Motivo de rechazo**: se asume que no se pide. Confirmar.
7. **Vallas sin precio**: en el ejemplo hay vallas con precio 0. ¿Se muestran como "Sin precio" y el cliente aun así las puede seleccionar?
8. **Radios, espaciados y sombras**: extraer valores exactos de sus colecciones antes de la maqueta.

## 10. Plan de trabajo (propuesto)

| Fase | Entregable | Dependencia |
|---|---|---|
| 0. Pendientes | Templates y respuestas de la sección 9 | Usuario |
| 1. Arquitectura de información | Mapa de sitio, estados de campaña y reglas de autorización | Fase 0 (parcial) |
| 2. Wireframes de flujo | Pantallas de la sección 7 en baja fidelidad, validar con el usuario | Fase 1 |
| 3. Diseño visual | Alta fidelidad con Órbita, web y móvil | Fase 2 |
| 4. Maqueta React | Flujo completo clicable: login, autorizar, cotizar, aceptar, instalar, reportar | Fase 3 |
| 5. Revisión | Estados (vacío, cargando, error), tokens y criterios de aceptación | Fase 4 |

Notas:

- No hay delegación a workers todavía. El diseño lo decide el orquestador. La maqueta React se separa en tareas con brief cuando el diseño esté aprobado.
- Los archivos de Órbita son de solo lectura en esta etapa: no se modifican.

## 11. Próximo paso

Responder las dudas de la sección 9, sobre todo descuento y precio por medio. Con eso se hace la fase 1: mapa de sitio, reglas de autorización y modelo de datos (sección 4 de `docs/TEMPLATES_REFERENCIA.md`), para validar antes de diseñar pantallas.

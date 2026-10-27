# Portal de Clientes OBP: plan de acción UI/UX

Estado: **borrador v2**. Decisiones de producto tomadas con el usuario (sección 8). Sin implementación todavía.

## 1. Objetivo y alcance

Maqueta funcional (prototipo en React) para que el cliente siga su campaña sin depender de un ejecutivo. Web y móvil, responsiva.

1. Ver sus campañas y su estatus.
2. Revisar los medios propuestos y **autorizar o rechazar** cada uno (igual que hoy en el Excel).
3. Ver la cotización cuando hay medios autorizados, y **aceptarla con un clic** para arrancar la campaña.
4. Seguir el **estatus de instalación** por medio.
5. Consultar **reportes fotográficos** cuando ya esté todo instalado.

Fuera de alcance del portal:

- Crear campañas. El cliente solo responde a lo que propone OBP.
- Configurar reportes (fechas, periodos, datos). Eso vive en otro módulo de OBP; el portal solo muestra el resultado.
- Subir artes. Es un cambio futuro: el cliente subirá sus artes dentro de su campaña y el módulo de Gestión de artes se adaptará. No sale en esta maqueta.

## 2. Hallazgos de las referencias

| Referencia (Figma) | Qué aporta | Qué no tomar |
|---|---|---|
| **Login SSO** (`x153D1vcXgvoRR804q5Yog`, página "Login OBP") | Pantalla de bienvenida sobre fondo de espectaculares en azul oscuro, tarjeta blanca centrada con logo OBP, campos de correo y contraseña, toggle "Recordarme", botón azul "Iniciar sesión". Estados: "Preparando OBP" (carga), "No pudimos iniciar tu sesión" (error con reintentar), "Error del servidor" (con códigos de error). | Carrusel de pruebas de exploración v1 y v2. |
| **Listado de campaña** (`I2GCfpGmEh2AHzMDVmXlWK`) | Tablero con KPIs arriba, tabla de campañas con pills de estatus, filtros, modales de confirmación. | Acciones de administrador (editar, carrito, borrar). |
| **Reportes** (`csTSq9wAK4FjAznrFTQXrz`) | Página "Reporte de campaña" con portada, índice por tipo de medio (Sitios fijos, Camiones, Indoor, Cierre) y fotos por medio. Base: módulo v.3. | Versiones v.2 y v.2.1. |
| **Gestión de artes** (`7gjDLULAMgeqxTMkzfC1QE`) | Mockups de espectaculares, camiones y mapas de ubicación. Referencia visual del medio. | Flujos internos de producción y carga de arte (por ahora). |
| **Prototipo** (`eIb7V9BluzRXMJx2EGBYBb`, nodo 543:31890) | Sidebar de OBP y pantalla "Vista campaña / Selector de fase" con tres fases. Unas 20 pantallas "screen pauta" con el detalle de la pauta. | Menú de admin (Carrito, Catálogos, Inventario, Herramientas). |

Lo que la plataforma ya fija y hay que respetar:

- **Marca**: logo "obp" en círculo azul, acento azul, fondo gris claro.
- **Navegación**: sidebar vertical colapsable con avatar y nombre al pie.
- **Estatus**: pills de color en tablas, KPIs arriba.
- **Fases**: la campaña se navega por fases (selector de fase).

## 3. Modelo de usuarios y acceso

- **Varios usuarios por empresa cliente, sin roles.** Todos pueden hacer todas las acciones: autorizar, rechazar, aceptar y ver reportes.
- **Acceso por SSO** con la pantalla de login de OBP de Figma.
- **Alta de cuentas**: pendiente (ver sección 9).

## 4. Mapa de flujo del cliente

```
Login (SSO)
 └─ Mis campañas (listado con estatus)
     └─ Detalle de campaña  [selector de fases]
         ├─ 1. Propuesta de medios
         │     └─ Lista de medios con casilla de autorizar; quitar la casilla = rechazar
         ├─ 2. Cotización (visible cuando hay medios autorizados)
         │     └─ Aceptar y arrancar campaña (un clic con confirmación)
         ├─ 3. Instalación: estatus por medio
         └─ 4. Reportes: resultado de los reportes configurados por OBP
```

Reglas de estado de la campaña (propuesta, a validar):

- **Propuesta**: hay medios por revisar.
- **En revisión**: el cliente ya respondió algunos medios.
- **Cotizada**: hay medios autorizados, cotización disponible.
- **Aprobada / En instalación**: el cliente aceptó la cotización.
- **Instalada**: todos los medios aceptados están instalados.
- **En reporte**: se publican reportes.

## 5. Decisiones de UX clave

**Autorización simple, como el Excel de hoy.** El cliente ve una lista de medios, cada uno con casilla marcada. Desmarcar = rechazar. No hay motivo obligatorio. Lo que el cliente deja marcado es lo que se cotiza. Sin tarjetas grandes ni modales por medio: la vista es una tabla compacta con miniatura, tipo, ubicación, periodo y, si aplica, precio. Un botón "Confirmar selección" cierra la revisión.

**Cotización.** Se muestra solo cuando hay medios autorizados. Formato según el template del cliente (pendiente, ver sección 9). Aceptación: un clic con confirmación, sin firma ni pago.

**Reportes.** Lista de reportes ya publicados, con periodo y tipo. La frecuencia (mensual, quincenal, semanal, completo o parcial) la define OBP en otro módulo. El portal solo presenta el resultado: el diseño debe soportar cualquier periodo, no uno fijo.

## 6. Pantallas (primera versión)

1. **Login SSO** con estados de carga, error de sesión y error de servidor.
2. **Mis campañas**: tabla o tarjetas con estatus, fechas, próxima acción pendiente y KPIs arriba.
3. **Detalle de campaña**: encabezado y selector de fases.
4. **Propuesta de medios**: lista con casilla por medio, contador "X de Y autorizados", botón Confirmar selección.
5. **Cotización**: resumen de medios autorizados, total (y precio por medio si el template lo pide), descarga PDF, botón "Aceptar y arrancar campaña" con confirmación.
6. **Instalación**: estatus por medio (por instalar, en instalación, instalado, con incidencia) y fecha.
7. **Reportes**: lista de reportes publicados, galería de fotos por tipo de medio, filtro por periodo.

Versiones móvil de cada pantalla.

## 7. Componentes OBP a reutilizar

Pendiente de confirmar contra el archivo de componentes. Esperado:

- Sidebar, header de página y selector de fases.
- Tabla con pills de estatus y casillas, filtros, paginación.
- Tarjetas de KPI.
- Modal de confirmación.
- Botones primario, secundario y de peligro.
- Galería de imágenes y visor de fotos.
- Gráficas: consultar la skill `dataviz` antes de especificarlas.

## 8. Decisiones tomadas

| Tema | Decisión |
|---|---|
| Usuarios | Varios por cliente, sin roles. Todos hacen todo. |
| Acceso | SSO, con el diseño de login de OBP. |
| Autorización | Medio por medio, con casilla; desmarcar = rechazar. Sin motivo obligatorio. |
| Aceptación | Un clic con confirmación. Sin firma ni pago. |
| Artes | Fuera del portal por ahora. Futuro: el cliente sube su arte dentro de su campaña. |
| Reportes | Solo consulta. La configuración vive en otro módulo de OBP. |
| Plataforma | Web y móvil, responsiva. |
| Stack | React, para maqueta funcional. |
| Creación de campañas | No. El cliente solo responde a propuestas de OBP. |

## 9. Pendientes

1. **Templates de cotización y del Excel de autorización**: el usuario dijo que los compartiría, pero no llegaron. Hacen falta para definir si el cliente ve precio por medio o solo total, y el formato del PDF.
2. **Alta de cuentas**: ¿OBP las crea y el cliente solo entra por SSO, o el cliente da de alta a sus usuarios?
3. **Login**: el diseño de SSO muestra correo y contraseña. ¿El SSO es un botón adicional en la misma pantalla o es solo ese formulario?
4. **Motivo de rechazo**: se asume que no se pide. Confirmar.
5. **Arte del medio**: confirmado fuera del portal por ahora, solo se deja documentado.

## 10. Plan de trabajo (propuesto)

| Fase | Entregable | Dependencia |
|---|---|---|
| 0. Pendientes | Templates y respuestas de la sección 9 | Usuario |
| 1. Arquitectura de información | Mapa de sitio, estados de campaña, reglas de autorización | Fase 0 (parcial) |
| 2. Wireframes de flujo | Pantallas de la sección 6 en baja fidelidad, validar con el usuario | Fase 1 |
| 3. Diseño visual | Alta fidelidad con componentes OBP, web y móvil | Fase 2 y librería OBP |
| 4. Maqueta React | Flujo completo clicable: autorizar, cotizar, aceptar, instalar, reportar | Fase 3 |
| 5. Revisión | Estados (vacío, cargando, error), tokens y criterios de aceptación | Fase 4 |

Notas:

- No hay delegación a workers todavía. El diseño lo decide el orquestador; la maqueta React se separa en tareas con brief cuando el diseño esté aprobado.
- La carpeta de componentes OBP sigue sin acceso: se necesita el file key o link del archivo de la librería.

## 11. Próximo paso

Compartir los templates (sección 9.1) y el archivo de componentes OBP. Con eso se hace la fase 1 y se presenta el mapa de flujo para validar antes de diseñar pantallas.

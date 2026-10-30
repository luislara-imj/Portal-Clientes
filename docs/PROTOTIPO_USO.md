# Cómo usar el prototipo

## Abrirlo
- **Sin instalar nada:** doble clic en `prototipo/dist/index.html` (funciona con file://, sin servidor).
- **En desarrollo:** en `prototipo/`, `npm install` y `npm run dev`; abre la URL que muestra Vite.
- Login simulado: cualquier correo válido y cualquier contraseña no vacía. Cliente: Ana López · Cliente de ejemplo S.A.
- Todo se guarda al momento en el navegador (`localStorage`, clave `obp-prototipo-v2`); recargar conserva el estado. El tema (claro u oscuro) se cambia con "Tema".

## Reiniciar
"Reiniciar datos" en la barra superior → confirmar en el modal. Las 5 campañas vuelven a la semilla (`src/data/semilla.js`): Alpina en "Propuesta lista" con 0 de 99 respondidos.

## Recorrido de Alpina (único flujo completo)
1. **Mis campañas → Alpina Leche → Revisar propuesta.** 99 medios en 5 pestañas (Sitios fijos, Camiones, Indoor, Vallas móviles, Brand riders) y 3 plazas (CDMX, ZMG, MTY).
2. **Responder.** Sí / No por medio, o "Todos Sí" / "Todos No" por plaza. Con la primera respuesta pasa a "En selección". "Confirmar selección" se activa cuando todo tiene respuesta.
3. **Confirmar.** "Selección confirmada" y se desbloquea Cotización. La selección sigue editable hasta aceptar; si cambia, la cotización se recalcula.
4. **Cotización.** Solo los medios en Sí, por tipo de medio, con Subtotal, Descuento 10 %, IVA 16 % y Total con IVA. "Aceptar y arrancar campaña" abre el modal de confirmación.
5. **Instalación.** Al aceptar, el avance va de 0 a 100 % en unos 30 s, medio por medio (Por instalar → En instalación → Instalado). Se calcula con la hora de inicio guardada: si recargas, continúa.
6. **Reportes.** Al terminar la instalación queda "En reporte": el reporte fotográfico inicial está publicado; los mensuales de noviembre y diciembre se ven bloqueados con su fecha de publicación (último día del mes).

Cada paso se refleja en Mis campañas (indicadores y tarjeta), en el detalle y en el Stepper.

## Otras 4 campañas (solo consulta)
- **Bajío Otoño** (En selección): propuesta con 5 de 8 respondidos; cotización, instalación y reportes bloqueados.
- **Norteña Navidad** (Cotización lista): propuesta y cotización visibles; instalación y reportes bloqueados.
- **Cocacola Zero** (En instalación): propuesta y cotización cerradas, instalación al 51 %; reportes bloqueados.
- **Solaria Verano** (En reporte): todas las fases, con el reporte inicial y 3 mensuales publicados.

Las fases pasadas muestran "Fase cerrada · solo consulta"; la fase actual de estas campañas, "Esta campaña es solo de consulta en el prototipo.". Nada se puede editar. Las fases futuras se ven bloqueadas con su motivo.

## Datos de muestra y decisiones provisionales
- Todos los datos son ficticios (`src/data/`). Descargar PDF y Descargar reporte solo avisan; no hay derrotero, recuperación de contraseña ni subida de artes.
- **Brand riders:** 6 formatos con 4 unidades y 1 mes cada uno (provisional), todos en la plaza CDMX (provisional).
- **Ficha de vallas y riders en reportes:** se muestran por unidad (Plaza, Campaña, Tipo de medio; vallas con Medidas, Periodo y Descripción; riders con Familia y Descripción); estructura provisional.
- **Avance de testigos:** se calcula como medios con testigo en el reporte inicial publicado entre medios contratados.
- **Íconos:** Font Awesome Free en lugar de Pro (sin licencia web); se cambia en `src/orbita/Icon.jsx`.

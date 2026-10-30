// Plan de instalación simulada de Alpina: toda la campaña termina en 30 s.
// Cada medio Sí arranca con un desfase escalonado dentro de los primeros 20 s y tarda 10 s;
// su porcentaje avanza de 0 a 100 según el tiempo transcurrido desde instalacionInicio.

export const VENTANA_ARRANQUE_MS = 20000;
export const DURACION_MEDIO_MS = 10000;
export const DURACION_INSTALACION_MS = VENTANA_ARRANQUE_MS + DURACION_MEDIO_MS;

// ids en orden de la propuesta → [{ medioId, inicio, fin }] en milisegundos.
// Desfase = i / (n − 1) × 20 s, así el último medio termina exactamente a los 30 s.
export function planInstalacion(ids, inicio) {
  const n = ids.length;
  return ids.map((medioId, i) => {
    const desfase = n > 1 ? Math.round((i / (n - 1)) * VENTANA_ARRANQUE_MS) : 0;
    return { medioId, inicio: inicio + desfase, fin: inicio + desfase + DURACION_MEDIO_MS };
  });
}

export function finDelPlan(plan, inicio) {
  return plan.reduce((max, p) => Math.max(max, p.fin), inicio);
}

// Porcentaje entero 0–100. Solo llega a 100 cuando el medio terminó.
export function porcentajeEn(paso, ahora) {
  const total = paso.fin - paso.inicio;
  if (ahora <= paso.inicio) return 0;
  if (ahora >= paso.fin) return 100;
  return Math.min(99, Math.max(0, Math.floor(((ahora - paso.inicio) / total) * 100)));
}

export function estatusDe(porcentaje) {
  if (porcentaje >= 100) return 'Instalado';
  if (porcentaje <= 0) return 'Por instalar';
  return 'En instalación';
}

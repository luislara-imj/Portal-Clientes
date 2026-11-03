// Lógica pura de la pantalla Descarga de reportes (sin React ni store).

import { fechaCorta } from './datos.js';

export const DURACION_DESCARGA = 2000; // ms de la descarga simulada

// Texto de fecha de un reporte del listado cronológico.
// Publicado: fecha de publicación. Bloqueado: fecha programada o "al terminar la instalación".
export function fechaReporte(reporte) {
  if (reporte.estado === 'publicado') {
    return `Publicado el ${fechaCorta(reporte.publicacion ?? reporte.publicadoEn)}`;
  }
  if (reporte.tipo !== 'inicial' && reporte.publicacion) {
    return `Se publica el ${fechaCorta(reporte.publicacion)}`;
  }
  return 'Al terminar la instalación';
}

// Avance (0–100, entero) de una descarga simulada que empezó en `inicio` (ms).
export function avanceDescarga(inicio, ahora, duracion = DURACION_DESCARGA) {
  if (!(duracion > 0)) return 100;
  const t = (ahora - inicio) / duracion;
  return Math.max(0, Math.min(100, Math.round(t * 100)));
}

// Índice de la opción siguiente en una lista circular (flechas del radiogroup).
export function indiceVecino(actual, total, paso) {
  if (total <= 0) return -1;
  return (((actual + paso) % total) + total) % total;
}

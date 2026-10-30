// Formato de los datos de un medio en la propuesta (docs/TEMPLATES_REFERENCIA.md §1, reglas de presentación).
// Sin valor (null, '', '—') → '—'. Métricas y perfil en cero → 'Sin dato'.

import { formatoFecha, formatoMXN } from '../../store/index.js';

export const sinValor = (v) => v === undefined || v === null || v === '' || v === '—';

const miles = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ',');

export function texto(v) {
  return sinValor(v) ? '—' : String(v);
}

// Conteos (impactos, alcance, km, personas en Indoor).
export function entero(v) {
  if (sinValor(v)) return '—';
  if (Number(v) === 0) return 'Sin dato';
  return miles(Math.round(Number(v)));
}

// Frecuencia y tiempo de exposición: promedio con un decimal, nunca suma ni %.
export function promedio(v) {
  if (sinValor(v)) return '—';
  if (Number(v) === 0) return 'Sin dato';
  return Number(v).toFixed(1);
}

// Fracción (0.62) → "62%".
export function porcentaje(v) {
  if (sinValor(v)) return '—';
  if (Number(v) === 0) return 'Sin dato';
  return `${Math.round(Number(v) * 100)}%`;
}

export function precio(v) {
  if (sinValor(v)) return '—';
  if (Number(v) === 0) return 'Sin precio';
  return formatoMXN(v);
}

export function fecha(v) {
  return sinValor(v) ? '—' : formatoFecha(v);
}

export function periodo(m) {
  return `${fecha(m.inicio)} – ${fecha(m.fin)}`;
}

export function coordenada(v) {
  return sinValor(v) ? '—' : Number(v).toFixed(4);
}

// Vallas y brand riders no tienen clave: se identifican por su numeración ("Valla 01", "Blitz 360 · 01").
export const esUnidad = (m) => m.tipo === 'vallas' || m.tipo === 'riders';
export const claveDe = (m) => (esUnidad(m) ? m.nombre : m.clave);

// Monto de un medio como en la cotización: precio × unidades × meses.
export const montoDe = (m) => m.precio * (m.unidades || 1) * (m.meses || 1);
export const montoConDescuentoDe = (m) => m.precioDescuento * (m.unidades || 1) * (m.meses || 1);

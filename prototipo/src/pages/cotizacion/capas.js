// Datos de la vista por capas de la cotización: tipos de medio → plazas → medios.
// Puro: recibe cot.tipos (selector cotizacion) y no recalcula precios.

import { NOMBRE_PLAZA, PLAZAS, TIPOS } from '../../data/catalogos.js';
import { redondear } from '../../store/selectores.js';

const ordenPlaza = (p) => {
  const i = PLAZAS.indexOf(p);
  return i === -1 ? PLAZAS.length : i;
};

// Tipos con líneas en el orden de la propuesta (Sitios fijos, Camiones, Indoor, Vallas móviles, Brand riders).
export function tiposOrdenados(tipos) {
  return tipos
    .filter((t) => t.lineas.length > 0)
    .slice()
    .sort((a, b) => TIPOS.indexOf(a.tipo) - TIPOS.indexOf(b.tipo));
}

// Medios de una línea: vallas y riders se agrupan en una línea por solicitud; aquí se vuelven a abrir
// en sus unidades numeradas ("Valla 01", "Blitz 360 · 01"), como en la propuesta.
export const mediosDeLineas = (lineas, porId) =>
  lineas.flatMap((l) => l.medioIds.map((id) => porId.get(id)).filter(Boolean));

export const contarMedios = (lineas) => lineas.reduce((s, l) => s + l.medioIds.length, 0);

// Plazas de un tipo, cada una con sus líneas y el subtotal con descuento (suma de l.total, igual que
// subtotalConDescuento del tipo; la suma de todas las plazas cuadra con el subtotal del tipo).
export function plazasDe(tipo) {
  const grupos = new Map();
  for (const l of tipo.lineas) {
    const clave = l.plaza || '';
    if (!grupos.has(clave)) grupos.set(clave, []);
    grupos.get(clave).push(l);
  }
  return [...grupos.entries()]
    .sort(([a], [b]) => ordenPlaza(a) - ordenPlaza(b))
    .map(([plaza, lineas]) => ({
      plaza,
      nombre: NOMBRE_PLAZA[plaza] || 'Sin plaza',
      lineas,
      medios: contarMedios(lineas),
      subtotalConDescuento: redondear(lineas.reduce((s, l) => s + l.total, 0))
    }));
}

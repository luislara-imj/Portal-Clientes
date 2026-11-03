// Ayudas de las carpetas por marca de "Mis campañas" (nivel 1 y nivel 2).
import { formatoFecha } from '../store/index.js';
import { MARCAS_EJEMPLO, MARCAS_REALES } from './marcas.js';

// Orden de las carpetas: primero las reales, después las de ejemplo.
// Las hojas de fondo de cada carpeta de ejemplo son los artes de sus primeras 3 campañas.
export const CARPETAS = [
  ...MARCAS_REALES.map((m) => ({ ...m, artes: m.codigos.map((c) => m.artesPorCodigo?.[c]).filter(Boolean) })),
  ...MARCAS_EJEMPLO.map((m) => ({ ...m, artes: m.campanas.map((c) => c.arte).filter(Boolean).slice(0, 3) }))
];

export function carpetaPorSlug(slug) {
  return CARPETAS.find((m) => m.slug === slug) ?? null;
}

// '#/campanas/carpeta/:slug' (para href).
export function hrefCarpeta(slug) {
  return `#/campanas/carpeta/${encodeURIComponent(slug)}`;
}

// Campañas de una marca: [{ clave, codigo?, nombre, fase, inicio, fin }].
// Reales: resumen del store, filtrado por los códigos de la marca. Ejemplo: datos de marcas.js tal cual.
export function campanasDeMarca(marca, s) {
  if (marca.ejemplo) {
    return marca.campanas.map((c, i) => ({ ...c, clave: `${marca.slug}-${i}` }));
  }
  return s.campanas
    .filter((c) => marca.codigos.includes(c.codigo))
    .map((c) => s.resumenCampana(c.codigo))
    .filter(Boolean)
    .map((r) => ({ clave: r.codigo, codigo: r.codigo, nombre: r.nombre, fase: r.fase, inicio: r.inicio, fin: r.fin, arte: marca.artesPorCodigo?.[r.codigo] }));
}

export function textoConteo(n) {
  return n === 1 ? '1 campaña' : `${n} campañas`;
}

// Vigencia corta en una línea: "1 nov – 31 dic 2026" (mismo año) o "1 dic 2026 – 31 ene 2027".
export function vigenciaCorta(inicio, fin) {
  const a = formatoFecha(inicio);
  const b = formatoFecha(fin);
  const anioA = a.match(/ (\d{4})$/)?.[1];
  const anioB = b.match(/ (\d{4})$/)?.[1];
  const desde = anioA && anioA === anioB ? a.replace(/ \d{4}$/, '') : a;
  return `${desde} – ${b}`;
}

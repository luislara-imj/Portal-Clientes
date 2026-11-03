// Persistencia del estado mutable en localStorage. Solo se guarda el estado (nunca la semilla).
// Cualquier error (sin almacenamiento, JSON dañado, versión distinta, forma inválida) → semilla.

import { SEMILLA, VERSION, estadoInicial } from '../data/semilla.js';
import { FASES } from './reglas.js';

export const CLAVE_ALMACEN = 'obp-prototipo-v2';

export function almacenPorDefecto() {
  try {
    return typeof window !== 'undefined' && window.localStorage ? window.localStorage : null;
  } catch {
    return null;
  }
}

export function esEstadoValido(datos) {
  if (!datos || typeof datos !== 'object' || datos.version !== VERSION) return false;
  if (!datos.campanas || typeof datos.campanas !== 'object') return false;
  return SEMILLA.campanas.every(({ codigo }) => {
    const c = datos.campanas[codigo];
    return !!c
      && FASES.includes(c.fase)
      && !!c.respuestas && typeof c.respuestas === 'object'
      && Object.values(c.respuestas).every((v) => v === 'si' || v === 'no')
      && Array.isArray(c.reportes)
      && typeof c.plantilla === 'string';
  });
}

export function cargarEstado(almacen = almacenPorDefecto()) {
  try {
    const texto = almacen ? almacen.getItem(CLAVE_ALMACEN) : null;
    if (!texto) return estadoInicial();
    const datos = JSON.parse(texto);
    return esEstadoValido(datos) ? datos : estadoInicial();
  } catch {
    return estadoInicial();
  }
}

export function guardarEstado(estado, almacen = almacenPorDefecto()) {
  try {
    if (!almacen) return false;
    almacen.setItem(CLAVE_ALMACEN, JSON.stringify(estado));
    return true;
  } catch {
    return false;
  }
}

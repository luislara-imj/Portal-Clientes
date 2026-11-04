// Sumatoria de un conjunto de medios con las reglas de la pauta con detalle (Excel, filas de ciudad y hoja Resumen):
// - Impactos e impactos totales se suman.
// - Alcance, frecuencia, tiempo de exposición, km y perfil (NSE, edades, % de hombres y mujeres) son el
//   promedio de los medios que tienen dato (AVERAGEIF > 0); un medio "Sin dato" no baja el promedio.
// - Indoor: hombres y mujeres son personas y se suman.
// - Inversión: precio × unidades × meses, como en la cotización.

import { redondear } from '../../store/index.js';
import { montoConDescuentoDe, montoDe } from './formatos.js';

const suma = (lista, f) => lista.reduce((s, m) => s + (Number(f(m)) || 0), 0);

// Promedio de los valores mayores que cero; 0 si ninguno tiene dato (se lee "Sin dato").
function promedioConDato(lista, f) {
  const valores = lista.map(f).map(Number).filter((v) => v > 0);
  return valores.length ? valores.reduce((s, v) => s + v, 0) / valores.length : 0;
}

// Promedio por clave de un objeto de fracciones (nse, edades); null si ningún medio lo tiene.
function perfil(lista, campo) {
  const conCampo = lista.filter((m) => m[campo]);
  if (!conCampo.length) return null;
  const claves = Object.keys(conCampo[0][campo]);
  return Object.fromEntries(claves.map((k) => [k, promedioConDato(conCampo, (m) => m[campo][k])]));
}

export function sumatoria(medios) {
  const personas = medios.length > 0 && medios.every((m) => m.tipo === 'indoor');
  const genero = (campo) => (personas ? suma(medios, (m) => m[campo]) : promedioConDato(medios, (m) => m[campo]));
  return {
    medios: medios.length,
    impactos: suma(medios, (m) => m.impactos),
    impactosTotales: suma(medios, (m) => m.impactosTotales),
    alcance: promedioConDato(medios, (m) => m.alcance),
    frecuencia: promedioConDato(medios, (m) => m.frecuencia),
    tiempoExposicion: promedioConDato(medios, (m) => m.tiempoExposicion),
    km: promedioConDato(medios, (m) => m.km),
    hombres: genero('hombres'),
    mujeres: genero('mujeres'),
    nse: perfil(medios, 'nse'),
    edades: perfil(medios, 'edades'),
    inversion: redondear(suma(medios, montoDe)),
    inversionConDescuento: redondear(suma(medios, montoConDescuentoDe))
  };
}

/**
 * Resumen por tipo de medio (hoja Resumen del Excel): propuestos, elegidos, sumatoria de la selección
 * e inversión de toda la propuesta. Solo tipos con medios propuestos.
 * tipos: orden de los tipos · medios: todos los de la campaña · incluido(m): ¿el cliente lo eligió?
 */
export function resumenPorTipo(tipos, medios, incluido) {
  return tipos
    .map((tipo) => {
      const propuestos = medios.filter((m) => m.tipo === tipo);
      const elegidos = propuestos.filter(incluido);
      return {
        tipo,
        propuestos: propuestos.length,
        seleccion: sumatoria(elegidos),
        inversionPropuesta: redondear(suma(propuestos, montoConDescuentoDe))
      };
    })
    .filter((r) => r.propuestos > 0);
}

// Totales de la selección sobre el resumen por tipo (fila TOTAL de la hoja Resumen).
export function totales(resumen) {
  const t = (f) => redondear(resumen.reduce((s, r) => s + f(r), 0));
  return {
    propuestos: t((r) => r.propuestos),
    medios: t((r) => r.seleccion.medios),
    impactos: t((r) => r.seleccion.impactos),
    impactosTotales: t((r) => r.seleccion.impactosTotales),
    inversion: t((r) => r.seleccion.inversion),
    inversionConDescuento: t((r) => r.seleccion.inversionConDescuento),
    inversionPropuesta: t((r) => r.inversionPropuesta)
  };
}

export default sumatoria;

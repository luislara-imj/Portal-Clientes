import { describe, expect, it } from 'vitest';
import { resumenPorTipo, sumatoria, totales } from './sumatoria.js';

const sitio = (o) => ({ tipo: 'sitios', unidades: 1, meses: 1, precio: 100, precioDescuento: 90, ...o });

describe('sumatoria de la selección (reglas del Excel)', () => {
  it('suma impactos e inversión y promedia solo los medios con dato', () => {
    const s = sumatoria([
      sitio({ impactos: 1000, impactosTotales: 2000, alcance: 300, frecuencia: 4, hombres: 0.6, mujeres: 0.4, nse: { ab: 0.2 } }),
      sitio({ impactos: 500, impactosTotales: 1000, alcance: 0, frecuencia: 0, hombres: 0, mujeres: 0, nse: { ab: 0 }, meses: 2 })
    ]);
    expect(s).toMatchObject({ medios: 2, impactos: 1500, impactosTotales: 3000, alcance: 300, frecuencia: 4, hombres: 0.6 });
    expect(s.nse).toEqual({ ab: 0.2 });
    expect(s.inversion).toBe(300);
    expect(s.inversionConDescuento).toBe(270);
  });

  it('indoor suma personas en hombres y mujeres', () => {
    const s = sumatoria([
      { tipo: 'indoor', hombres: 100, mujeres: 50, precio: 0, precioDescuento: 0 },
      { tipo: 'indoor', hombres: 20, mujeres: 30, precio: 0, precioDescuento: 0 }
    ]);
    expect(s.hombres).toBe(120);
    expect(s.mujeres).toBe(80);
  });

  it('sin medios todo queda en cero (se lee "Sin dato")', () => {
    expect(sumatoria([])).toMatchObject({ medios: 0, impactos: 0, alcance: 0, nse: null, inversion: 0 });
  });

  it('resumen por tipo: propuestos, elegidos e inversión de toda la propuesta', () => {
    const medios = [sitio({ id: 'a' }), sitio({ id: 'b' }), { id: 'c', tipo: 'camiones', unidades: 2, meses: 1, precio: 10, precioDescuento: 9 }];
    const r = resumenPorTipo(['sitios', 'camiones', 'indoor'], medios, (m) => m.id === 'a');
    expect(r.map((x) => [x.tipo, x.propuestos, x.seleccion.medios, x.inversionPropuesta])).toEqual([
      ['sitios', 2, 1, 180],
      ['camiones', 1, 0, 18]
    ]);
    expect(totales(r)).toMatchObject({ propuestos: 3, medios: 1, inversionConDescuento: 90, inversionPropuesta: 198 });
  });
});

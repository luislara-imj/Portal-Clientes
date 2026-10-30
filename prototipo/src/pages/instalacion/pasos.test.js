import { describe, expect, it } from 'vitest';
import { PASOS, agrupar, estadoPasos, pasoActual, resumir } from './pasos.js';

describe('línea de tiempo de instalación', () => {
  it('tiene 7 pasos', () => {
    expect(PASOS).toHaveLength(7);
  });

  it('0 % está en el paso 1 y 100 % tiene todo completo', () => {
    expect(pasoActual(0)).toBe(1);
    expect(pasoActual(100)).toBeNull();
    expect(estadoPasos(100).every((p) => p.estado === 'completo')).toBe(true);
    const inicio = estadoPasos(0);
    expect(inicio[0].estado).toBe('actual');
    expect(inicio.slice(1).every((p) => p.estado === 'pendiente')).toBe(true);
  });

  it('de 1 a 99 % avanza del paso 2 al 6 sin retroceder', () => {
    expect(pasoActual(1)).toBe(2);
    expect(pasoActual(99)).toBe(6);
    let previo = 0;
    for (let p = 1; p <= 99; p++) {
      const paso = pasoActual(p);
      expect(paso).toBeGreaterThanOrEqual(2);
      expect(paso).toBeLessThanOrEqual(6);
      expect(paso).toBeGreaterThanOrEqual(previo);
      previo = paso;
    }
  });

  it('los pasos anteriores al actual quedan completos', () => {
    const pasos = estadoPasos(50);
    const i = pasos.findIndex((p) => p.estado === 'actual');
    expect(pasos.slice(0, i).every((p) => p.estado === 'completo')).toBe(true);
    expect(pasos.slice(i + 1).every((p) => p.estado === 'pendiente')).toBe(true);
  });
});

describe('resumen y grupos', () => {
  it('resume instalados y porcentaje promedio', () => {
    const r = resumir([
      { estatus: 'Instalado', porcentaje: 100 },
      { estatus: 'En instalación', porcentaje: 50 },
      { estatus: 'Por instalar', porcentaje: 0 }
    ]);
    expect(r).toEqual({ total: 3, instalados: 1, porcentaje: 50 });
    expect(resumir([])).toEqual({ total: 0, instalados: 0, porcentaje: 0 });
  });

  it('agrupa en orden de aparición', () => {
    const g = agrupar([{ f: 'b' }, { f: 'a' }, { f: 'b' }], (x) => x.f);
    expect(g.map((x) => x.clave)).toEqual(['b', 'a']);
    expect(g[0].items).toHaveLength(2);
  });
});

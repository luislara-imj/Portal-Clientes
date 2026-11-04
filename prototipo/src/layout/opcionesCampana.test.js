import { describe, expect, it } from 'vitest';
import { opcionesDeCampana } from './opcionesCampana.js';

const fase = (clave, estado, motivo = null) => ({ clave, estado, motivo });

describe('opciones del modal de campaña', () => {
  it('propuesta en curso: artes bloqueada con motivo y propuesta como paso actual', () => {
    const o = opcionesDeCampana([
      fase('propuesta', 'activa'),
      fase('cotizacion', 'bloqueada', 'Confirma tu selección'),
      fase('instalacion', 'bloqueada', 'Acepta la cotización'),
      fase('reportes', 'bloqueada', 'Termina la instalación')
    ]);
    expect(o.map((x) => [x.clave, x.estado, x.actual])).toEqual([
      ['propuesta', 'activa', true],
      ['cotizacion', 'bloqueada', false],
      ['artes', 'bloqueada', false],
      ['instalacion', 'bloqueada', false],
      ['reportes', 'bloqueada', false]
    ]);
    expect(o[2].motivo).toMatch(/Confirma tu selección/);
  });

  it('artes disponible sin archivos', () => {
    const o = opcionesDeCampana([fase('propuesta', 'consulta'), fase('cotizacion', 'activa'), fase('instalacion', 'bloqueada', 'x'), fase('reportes', 'bloqueada', 'y')], 0);
    expect(o.find((x) => x.clave === 'artes').estado).toBe('activa');
  });

  it('en instalación: artes con archivos queda completada e instalación es el paso actual', () => {
    const o = opcionesDeCampana([
      fase('propuesta', 'consulta'),
      fase('cotizacion', 'consulta'),
      fase('instalacion', 'activa'),
      fase('reportes', 'bloqueada', 'x')
    ], 3);
    expect(o.find((x) => x.clave === 'artes')).toMatchObject({ estado: 'consulta', artes: 3, motivo: null });
    expect(o.filter((x) => x.actual).map((x) => x.clave)).toEqual(['instalacion']);
  });

  it('en cotización: la propuesta (aún ajustable) se muestra completada', () => {
    const o = opcionesDeCampana([
      fase('propuesta', 'activa'),
      fase('cotizacion', 'activa'),
      fase('instalacion', 'bloqueada', 'x'),
      fase('reportes', 'bloqueada', 'y')
    ], 0);
    expect(o.map((x) => [x.clave, x.estado, x.actual])).toEqual([
      ['propuesta', 'consulta', false],
      ['cotizacion', 'activa', true],
      ['artes', 'activa', false],
      ['instalacion', 'bloqueada', false],
      ['reportes', 'bloqueada', false]
    ]);
  });

  it('campaña de ejemplo: todo bloqueado con el mismo motivo', () => {
    const o = opcionesDeCampana([]);
    expect(o.every((x) => x.estado === 'bloqueada' && /ejemplo/.test(x.motivo))).toBe(true);
    expect(o.some((x) => x.actual)).toBe(false);
  });
});

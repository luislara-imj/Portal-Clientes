import { describe, expect, it } from 'vitest';
import { CODIGOS, estadoInicial } from '../data/semilla.js';
import { PLANTILLAS_REPORTE } from '../data/catalogos.js';
import { planReportes } from '../data/fechas.js';
import { elegirPlantilla, reducer } from './reglas.js';

describe('planReportes', () => {
  it('termina con el reporte final, publicado al día siguiente del fin', () => {
    const plan = planReportes('2026-11-01', '2026-12-31');
    expect(plan.map((r) => r.id)).toEqual(['inicial', '2026-11', '2026-12', 'final']);
    expect(plan.at(-1)).toEqual({
      id: 'final',
      tipo: 'final',
      nombre: 'Reporte final',
      periodoInicio: '2026-11-01',
      periodoFin: '2026-12-31',
      publicacion: '2027-01-01',
      publicadoEn: null,
      estado: 'bloqueado'
    });
    expect(planReportes('2026-06-01', '2026-08-31').at(-1).publicacion).toBe('2026-09-01');
    expect(planReportes('2028-02-01', '2028-02-28').at(-1).publicacion).toBe('2028-02-29');
  });
});

describe('plantillas de reporte', () => {
  it('todas las campañas empiezan con la plantilla default', () => {
    for (const c of Object.values(estadoInicial().campanas)) expect(c.plantilla).toBe('default');
    expect(PLANTILLAS_REPORTE.map((p) => p.id)).toEqual(['default', 'corporativa', 'brand']);
  });

  it('elegirPlantilla cambia la plantilla en cualquier campaña', () => {
    let e = estadoInicial();
    e = reducer(e, { type: 'elegirPlantilla', codigo: CODIGOS.SOLARIA, plantillaId: 'brand' });
    e = reducer(e, { type: 'elegirPlantilla', codigo: CODIGOS.ALPINA, plantillaId: 'corporativa' });
    expect(e.campanas[CODIGOS.SOLARIA].plantilla).toBe('brand');
    expect(e.campanas[CODIGOS.ALPINA].plantilla).toBe('corporativa');
    expect(e.campanas[CODIGOS.BAJIO].plantilla).toBe('default');
  });

  it('ignora ids o campañas que no existen', () => {
    const e = estadoInicial();
    expect(elegirPlantilla(e, CODIGOS.ALPINA, 'otra')).toBe(e);
    expect(elegirPlantilla(e, 'NO-EXISTE', 'brand')).toBe(e);
    expect(elegirPlantilla(e, CODIGOS.ALPINA, 'default')).toBe(e);
  });
});

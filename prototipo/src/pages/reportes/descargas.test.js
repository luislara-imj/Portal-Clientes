import { describe, expect, it } from 'vitest';
import { avanceDescarga, fechaReporte, indiceVecino } from './descargas.js';

describe('fechaReporte', () => {
  it('publicado muestra la fecha de publicación', () => {
    expect(fechaReporte({ estado: 'publicado', tipo: 'inicial', publicacion: '2026-06-15' })).toBe('Publicado el 15/06/2026');
  });
  it('bloqueado mensual muestra la fecha programada', () => {
    expect(fechaReporte({ estado: 'bloqueado', tipo: 'mensual', publicacion: '2026-07-01' })).toBe('Se publica el 01/07/2026');
  });
  it('bloqueado inicial o sin fecha se publica al terminar la instalación', () => {
    expect(fechaReporte({ estado: 'bloqueado', tipo: 'inicial', publicacion: '2026-07-01' })).toBe('Al terminar la instalación');
    expect(fechaReporte({ estado: 'bloqueado', tipo: 'final' })).toBe('Al terminar la instalación');
  });
});

describe('avanceDescarga', () => {
  it('va de 0 a 100 y se acota', () => {
    expect(avanceDescarga(1000, 1000, 2000)).toBe(0);
    expect(avanceDescarga(1000, 2000, 2000)).toBe(50);
    expect(avanceDescarga(1000, 9000, 2000)).toBe(100);
    expect(avanceDescarga(1000, 500, 2000)).toBe(0);
  });
});

describe('indiceVecino', () => {
  it('es circular', () => {
    expect(indiceVecino(0, 3, -1)).toBe(2);
    expect(indiceVecino(2, 3, 1)).toBe(0);
    expect(indiceVecino(1, 3, 1)).toBe(2);
  });
});

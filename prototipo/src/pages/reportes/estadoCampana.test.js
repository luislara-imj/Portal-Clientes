import { describe, expect, it } from 'vitest';
import { estadoCampana, impactosEnReporte, SIN_DATO } from './datos.js';

describe('estadoCampana', () => {
  it('activa: Día N de M con ambos extremos incluidos', () => {
    expect(estadoCampana('2026-11-01', '2026-11-30', '2026-11-05')).toMatchObject({
      estado: 'activa', titulo: 'Campaña activa', valor: 'Día 5 de 30', dia: 5, total: 30
    });
    expect(estadoCampana('2026-11-01', '2026-11-30', '2026-11-01').valor).toBe('Día 1 de 30');
    expect(estadoCampana('2026-11-01', '2026-11-30', '2026-11-30').valor).toBe('Día 30 de 30');
    // Cambio de horario y de año no alteran la cuenta.
    expect(estadoCampana('2026-10-01', '2026-12-31', '2026-11-02').valor).toBe('Día 33 de 92');
    expect(estadoCampana('2026-12-01', '2027-01-06', '2027-01-01').valor).toBe('Día 32 de 37');
  });

  it('por iniciar: días que faltan', () => {
    expect(estadoCampana('2026-11-15', '2026-12-15', '2026-11-02')).toMatchObject({
      estado: 'por-iniciar', titulo: 'Campaña por iniciar', valor: 'Inicia en 13 días', total: 31
    });
    expect(estadoCampana('2026-11-03', '2026-12-15', '2026-11-02').valor).toBe('Inicia en 1 día');
  });

  it('finalizada: duración total', () => {
    expect(estadoCampana('2026-06-01', '2026-08-31', '2026-11-02')).toMatchObject({
      estado: 'finalizada', titulo: 'Campaña finalizada', valor: '92 días', total: 92
    });
  });
});

describe('impactosEnReporte', () => {
  const m = { impactos: 1234000, impactosTotales: 3702000 };
  it('inicial y mensual usan impactos; final usa impactos totales', () => {
    expect(impactosEnReporte(m, { tipo: 'inicial' })).toBe('1,234,000');
    expect(impactosEnReporte(m, { tipo: 'mensual' })).toBe('1,234,000');
    expect(impactosEnReporte(m, { tipo: 'final' })).toBe('3,702,000');
    expect(impactosEnReporte({ impactos: 0 }, { tipo: 'inicial' })).toBe(SIN_DATO);
  });
});

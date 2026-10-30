import { describe, expect, it } from 'vitest';
import { CODIGOS, campanaFija, estadoInicial, medioFijo } from '../../data/semilla.js';
import { aceptarCotizacion, avanzar, confirmarSeleccion, responderTodos } from '../../store/reglas.js';
import { fasesDeCampana, instalacion, reportes } from '../../store/selectores.js';
import { DURACION_INSTALACION_MS } from '../../store/instalacion.js';
import {
  SIN_DATO, agruparPorPlazaYTipo, fechaCorta, fichaDe, kpisReportes, mediosInstalados
} from './datos.js';

// Store mínimo con la misma forma que useStore() para estas funciones.
const storeDe = (estado, ahora) => ({
  instalacion: (c) => instalacion(estado, c, ahora),
  reportes: (c) => reportes(estado, c),
  medio: (c, id) => medioFijo(c, id),
  fasesDeCampana: (c) => fasesDeCampana(estado, c)
});

const AL = CODIGOS.ALPINA;
const T0 = new Date(2026, 10, 2, 10, 0, 0).getTime();

describe('datos de reportes', () => {
  it('fechaCorta da DD/MM/AAAA', () => {
    expect(fechaCorta('2026-11-30')).toBe('30/11/2026');
    expect(fechaCorta(new Date(2026, 4, 27).getTime())).toBe('27/05/2026');
    expect(fechaCorta(null)).toBe(SIN_DATO);
  });

  it('Solaria: todos los reportes publicados, KPIs con dato y 31 medios', () => {
    const s = storeDe(estadoInicial(), T0);
    const k = kpisReportes(s, CODIGOS.SOLARIA);
    expect(k.enEjecucion).toBe('31');
    expect(k.testigos).toBe('100%');
    expect(k.impactos).not.toBe(SIN_DATO);
    expect(s.reportes(CODIGOS.SOLARIA).lista.every((r) => r.estado === 'publicado')).toBe(true);
  });

  it('Cocacola: reportes bloqueados', () => {
    const s = storeDe(estadoInicial(), T0);
    const fase = s.fasesDeCampana(CODIGOS.COCACOLA).find((f) => f.clave === 'reportes');
    expect(fase.estado).toBe('bloqueada');
    expect(fase.motivo).toBeTruthy();
  });

  it('Alpina con instalación completa: inicial publicado con todos los medios, mensuales bloqueados', () => {
    let e = estadoInicial();
    e = responderTodos(e, AL, {}, 'si');
    e = confirmarSeleccion(e, AL, T0);
    e = aceptarCotizacion(e, AL, T0);
    const fin = T0 + DURACION_INSTALACION_MS + 1000;
    e = avanzar(e, fin);
    const s = storeDe(e, fin);
    const lista = s.reportes(AL).lista;
    expect(lista.map((r) => [r.id, r.estado])).toEqual([
      ['inicial', 'publicado'], ['2026-11', 'bloqueado'], ['2026-12', 'bloqueado']
    ]);
    expect(lista[1].motivo).toContain('30 nov 2026');

    const medios = mediosInstalados(s, AL);
    const todos = campanaFija(AL).medios;
    expect(medios).toHaveLength(todos.length);
    const grupos = agruparPorPlazaYTipo(medios);
    expect(grupos.map((g) => g.plaza)).toEqual(['CDMX', 'ZMG', 'MTY']);
    expect(grupos.reduce((n, g) => n + g.total, 0)).toBe(todos.length);

    for (const m of medios) {
      const f = fichaDe(m, campanaFija(AL));
      expect(f.pies).toHaveLength(3);
      expect(f.arriba.length).toBeGreaterThan(0);
      expect(f.clave).not.toBe(SIN_DATO);
    }
    const camion = fichaDe(medios.find((m) => m.tipo === 'camiones'), campanaFija(AL));
    expect(camion.pies).toEqual(['Posterior', 'Lateral derecho', 'Lateral izquierdo']);
    expect(kpisReportes(s, AL).testigos).toBe('100%');
  });
});

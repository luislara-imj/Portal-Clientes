import { describe, expect, it } from 'vitest';
import { CODIGOS, campanaFija, estadoInicial } from '../data/semilla.js';
import { aceptarCotizacion, avanzar, confirmarSeleccion, reducer, responder, responderTodos } from './reglas.js';
import { cotizacion, fasesDeCampana, indicadores, instalacion, progresoPropuesta, reportes } from './selectores.js';

const T = new Date(2026, 9, 30, 12).getTime(); // 30 oct 2026
const CONSULTA = [CODIGOS.BAJIO, CODIGOS.NORTENA, CODIGOS.COCACOLA, CODIGOS.SOLARIA];
const resumen = (e, codigo) => fasesDeCampana(e, codigo).map((f) => `${f.clave}:${f.estado}`);

describe('bloqueos de fases', () => {
  const e = estadoInicial();

  it('Bajío (En selección): propuesta activa, lo demás bloqueado con motivo', () => {
    expect(resumen(e, CODIGOS.BAJIO)).toEqual(['propuesta:activa', 'cotizacion:bloqueada', 'instalacion:bloqueada', 'reportes:bloqueada']);
    const [, cot, inst, rep] = fasesDeCampana(e, CODIGOS.BAJIO);
    expect(cot.motivo).toBe('Faltan 3 medios por responder. Responde todos y confirma tu selección para ver la cotización.');
    expect(inst.motivo).toBe('Acepta la cotización para iniciar la instalación.');
    expect(rep.motivo).toMatch(/aceptes la cotización/);
  });

  it('Norteña (Cotización lista): cotización activa, instalación y reportes bloqueados', () => {
    expect(resumen(e, CODIGOS.NORTENA)).toEqual(['propuesta:activa', 'cotizacion:activa', 'instalacion:bloqueada', 'reportes:bloqueada']);
  });

  it('Cocacola (En instalación): propuesta y cotización en consulta, reportes bloqueados', () => {
    expect(resumen(e, CODIGOS.COCACOLA)).toEqual(['propuesta:consulta', 'cotizacion:consulta', 'instalacion:activa', 'reportes:bloqueada']);
    expect(fasesDeCampana(e, CODIGOS.COCACOLA)[3].motivo).toBe('El reporte fotográfico inicial se publica al terminar la instalación.');
  });

  it('Solaria (En reporte): fases pasadas en consulta, reportes activos', () => {
    expect(resumen(e, CODIGOS.SOLARIA)).toEqual(['propuesta:consulta', 'cotizacion:consulta', 'instalacion:consulta', 'reportes:activa']);
  });

  it('solo Alpina es editable; las fases bloqueadas llevan motivo y las demás no', () => {
    for (const codigo of CONSULTA) {
      for (const f of fasesDeCampana(e, codigo)) {
        expect(f.editable).toBe(false);
        expect(f.motivo === null).toBe(f.estado !== 'bloqueada');
      }
    }
    expect(fasesDeCampana(e, CODIGOS.ALPINA)[0].editable).toBe(true);
  });

  it('cotización solo disponible desde la confirmación', () => {
    expect(cotizacion(e, CODIGOS.BAJIO).disponible).toBe(false);
    expect(cotizacion(e, CODIGOS.NORTENA).disponible).toBe(true);
    expect(cotizacion(e, CODIGOS.NORTENA).puedeAceptar).toBe(false);
    expect(instalacion(e, CODIGOS.NORTENA, T)).toMatchObject({ disponible: false, total: 0 });
    expect(reportes(e, CODIGOS.COCACOLA).disponible).toBe(false);
  });
});

describe('acciones ignoradas en las otras cuatro campañas', () => {
  it('ninguna acción cambia el estado', () => {
    const e = estadoInicial();
    for (const codigo of CONSULTA) {
      const medio = campanaFija(codigo).medios[campanaFija(codigo).medios.length - 1];
      expect(responder(e, codigo, medio.id, 'si')).toBe(e);
      expect(responder(e, codigo, medio.id, 'no')).toBe(e);
      expect(responderTodos(e, codigo, {}, 'si')).toBe(e);
      expect(confirmarSeleccion(e, codigo, T)).toBe(e);
      expect(aceptarCotizacion(e, codigo, T)).toBe(e);
      for (const type of ['responder', 'responderTodos', 'confirmarSeleccion', 'aceptarCotizacion']) {
        expect(reducer(e, { type, codigo, medioId: medio.id, filtro: {}, valor: 'si', ahora: T })).toBe(e);
      }
      expect(progresoPropuesta(e, codigo).editable).toBe(false);
    }
    // avanzar solo toca Alpina: con Alpina sin aceptar, nada cambia aunque pase un año.
    expect(avanzar(e, T + 365 * 864e5)).toBe(e);
  });

  it('Alpina avanzando no altera a las demás', () => {
    let e = responderTodos(estadoInicial(), CODIGOS.ALPINA, {}, 'si');
    e = confirmarSeleccion(e, CODIGOS.ALPINA, T);
    e = aceptarCotizacion(e, CODIGOS.ALPINA, T);
    e = avanzar(e, T + 31000);
    const inicial = estadoInicial();
    for (const codigo of CONSULTA) expect(e.campanas[codigo]).toEqual(inicial.campanas[codigo]);
  });
});

describe('indicadores globales', () => {
  it('con la semilla: 4 activas (Solaria terminó), 3 con acción pendiente, 39 medios instalados', () => {
    expect(indicadores(estadoInicial(), T)).toEqual({
      totalCampanas: 5, activas: 4, conAccionPendiente: 3, mediosInstalados: 39
    });
  });
});

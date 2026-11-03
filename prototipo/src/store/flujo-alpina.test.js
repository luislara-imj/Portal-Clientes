import { describe, expect, it } from 'vitest';
import { CODIGOS, campanaFija, estadoInicial } from '../data/semilla.js';
import { fechaLocal } from '../data/fechas.js';
import {
  aceptarCotizacion, avanzar, confirmarSeleccion, reducer, responder, responderTodos
} from './reglas.js';
import { cotizacion, fasesDeCampana, indicadores, instalacion, progresoPropuesta, reportes } from './selectores.js';
import { DURACION_INSTALACION_MS } from './instalacion.js';

const AL = CODIGOS.ALPINA;
const T0 = new Date(2026, 10, 2, 10, 0, 0).getTime(); // 2 nov 2026, 10:00 local
const medios = campanaFija(AL).medios;
const estados = (e) => Object.fromEntries(fasesDeCampana(e, AL).map((f) => [f.clave, f.estado]));

describe('flujo completo de Alpina con tiempo simulado', () => {
  it('recorre propuesta → cotización → instalación → reportes', () => {
    let e = estadoInicial();
    expect(e.campanas[AL].fase).toBe('Propuesta lista');
    expect(estados(e)).toEqual({ propuesta: 'activa', cotizacion: 'bloqueada', instalacion: 'bloqueada', reportes: 'bloqueada' });

    // Al inicio nada está seleccionado: confirmar no hace nada.
    expect(progresoPropuesta(e, AL)).toMatchObject({ total: medios.length, si: 0, no: medios.length, puedeConfirmar: false });
    expect(confirmarSeleccion(e, AL, T0)).toBe(e);
    expect(fasesDeCampana(e, AL)[1].motivo).toBe('Selecciona los medios que quieres y confirma tu selección para ver la cotización.');

    // Primer medio seleccionado → En selección; ya se puede confirmar.
    e = responder(e, AL, medios[0].id, 'si');
    expect(e.campanas[AL].fase).toBe('En selección');
    expect(progresoPropuesta(e, AL)).toMatchObject({ total: medios.length, si: 1, no: medios.length - 1, puedeConfirmar: true });
    expect(fasesDeCampana(e, AL)[1].motivo).toBe('Confirma tu selección de medios para ver la cotización.');

    // Sí a todo y No a los camiones de MTY.
    e = responderTodos(e, AL, {}, 'si');
    e = responderTodos(e, AL, { tipo: 'camiones', plaza: 'MTY' }, 'no');
    const noMty = medios.filter((m) => m.tipo === 'camiones' && m.plaza === 'MTY').length;
    expect(progresoPropuesta(e, AL)).toMatchObject({ si: medios.length - noMty, no: noMty, puedeConfirmar: true });

    // Confirmar → Cotización lista (Selección confirmada es un paso de paso).
    e = confirmarSeleccion(e, AL, T0);
    expect(e.campanas[AL].fase).toBe('Cotización lista');
    expect(e.campanas[AL].confirmadaEn).toBe(T0);
    expect(estados(e)).toEqual({ propuesta: 'activa', cotizacion: 'activa', instalacion: 'bloqueada', reportes: 'bloqueada' });
    const cot1 = cotizacion(e, AL);
    expect(cot1).toMatchObject({ disponible: true, actualizada: false, puedeAceptar: true, medios: medios.length - noMty });

    // Cambiar la selección tras confirmar: recalcula y avisa, sigue en Cotización lista.
    const riderId = medios.find((m) => m.tipo === 'riders').id;
    e = responder(e, AL, riderId, 'no');
    expect(e.campanas[AL].fase).toBe('Cotización lista');
    const cot2 = cotizacion(e, AL);
    expect(cot2.actualizada).toBe(true);
    expect(cot2.medios).toBe(cot1.medios - 1);
    expect(cot2.subtotal).toBe(cot1.subtotal - 54000);

    // Aceptar en T0: Aceptada, todo Por instalar.
    e = aceptarCotizacion(e, AL, T0);
    const c = e.campanas[AL];
    expect(c.fase).toBe('Aceptada');
    expect([c.aceptadaEn, c.instalacionInicio, c.instalacionFin]).toEqual([T0, T0, T0 + DURACION_INSTALACION_MS]);
    expect(c.cotizacionActualizada).toBe(false);
    expect(estados(e)).toEqual({ propuesta: 'consulta', cotizacion: 'consulta', instalacion: 'activa', reportes: 'bloqueada' });
    const inst0 = instalacion(e, AL, T0);
    expect(inst0.total).toBe(cot2.medios);
    expect(inst0.porInstalar).toBe(inst0.total);

    // Tras aceptar, la selección queda fija.
    expect(responder(e, AL, riderId, 'si')).toBe(e);
    expect(aceptarCotizacion(e, AL, T0)).toBe(e);

    // 15 s: En instalación, con porcentajes intermedios.
    e = avanzar(e, T0 + 15000);
    expect(e.campanas[AL].fase).toBe('En instalación');
    const inst15 = instalacion(e, AL, T0 + 15000);
    expect(inst15.instalados).toBeGreaterThan(0);
    expect(inst15.enInstalacion).toBeGreaterThan(0);
    expect(inst15.porInstalar).toBeGreaterThan(0);
    expect(inst15.porcentaje).toBeGreaterThan(0);
    expect(inst15.porcentaje).toBeLessThan(100);
    for (const m of inst15.medios) {
      const esperado = m.porcentaje === 0 ? 'Por instalar' : m.porcentaje === 100 ? 'Instalado' : 'En instalación';
      expect(m.estatus).toBe(esperado);
    }
    expect(inst15.medios.some((m) => m.porcentaje > 0 && m.porcentaje < 100)).toBe(true);
    expect(inst15.porPlaza.map((p) => p.plaza)).toEqual(['CDMX', 'ZMG', 'MTY']);
    expect(inst15.porTipo.map((t) => t.tipo)).toEqual(['sitios', 'camiones', 'indoor', 'vallas', 'riders']);
    expect(reportes(e, AL).publicados).toBe(0);

    // Al recargar, el avance sigue desde el tiempo guardado (el estado es JSON).
    const recargado = JSON.parse(JSON.stringify(e));
    expect(instalacion(recargado, AL, T0 + 15000)).toEqual(inst15);

    // 31 s: todo instalado, reporte inicial publicado con la fecha de fin, fase En reporte.
    e = avanzar(e, T0 + 31000);
    expect(e.campanas[AL].fase).toBe('En reporte');
    const inst31 = instalacion(e, AL, T0 + 31000);
    expect(inst31.completa).toBe(true);
    expect(inst31.instalados).toBe(inst31.total);
    expect(inst31.porcentaje).toBe(100);
    const rep = reportes(e, AL);
    const inicial = rep.lista.find((r) => r.tipo === 'inicial');
    expect(inicial).toMatchObject({ estado: 'publicado', publicadoEn: T0 + DURACION_INSTALACION_MS, publicacion: fechaLocal(T0 + DURACION_INSTALACION_MS) });
    expect(rep.lista.filter((r) => r.tipo === 'mensual').map((r) => [r.nombre, r.publicacion, r.estado])).toEqual([
      ['Reporte de noviembre', '2026-11-30', 'bloqueado'],
      ['Reporte de diciembre', '2026-12-31', 'bloqueado']
    ]);
    expect(rep.lista[1].motivo).toBe('Se publica el 30 nov 2026.');
    expect(estados(e)).toEqual({ propuesta: 'consulta', cotizacion: 'consulta', instalacion: 'consulta', reportes: 'activa' });

    // Avanzar sin cambios devuelve el mismo estado.
    expect(avanzar(e, T0 + 60000)).toBe(e);

    // Los mensuales se publican al llegar su fecha.
    e = avanzar(e, new Date(2026, 10, 30, 9).getTime());
    expect(reportes(e, AL).lista.map((r) => r.estado)).toEqual(['publicado', 'publicado', 'bloqueado', 'bloqueado']);
    e = avanzar(e, new Date(2026, 11, 31, 9).getTime());
    expect(reportes(e, AL).publicados).toBe(3);
    const final = reportes(e, AL).lista.at(-1);
    expect(final).toMatchObject({ tipo: 'final', publicacion: '2027-01-01', estado: 'bloqueado', motivo: 'Se publica el 1 ene 2027.' });

    // El final se publica al día siguiente del fin de la campaña.
    const t = new Date(2027, 0, 1, 9).getTime();
    e = avanzar(e, t);
    expect(reportes(e, AL).publicados).toBe(4);
    expect(reportes(e, AL).lista.at(-1)).toMatchObject({ tipo: 'final', estado: 'publicado', publicadoEn: t, motivo: null });

    // Indicadores reflejan los medios instalados de Alpina (fijos: Cocacola 8, Solaria 31, WeCare Otoño 8, WeCare Invierno 31).
    expect(indicadores(e, T0 + 31000).mediosInstalados).toBe(8 + 31 + 8 + 31 + inst31.total);
  });

  it('al recargar mucho después de aceptar, avanzar pone todo al día de un paso', () => {
    let e = responderTodos(estadoInicial(), AL, {}, 'si');
    e = confirmarSeleccion(e, AL, T0);
    e = aceptarCotizacion(e, AL, T0);
    e = avanzar(JSON.parse(JSON.stringify(e)), T0 + 3600000);
    expect(e.campanas[AL].fase).toBe('En reporte');
    expect(reportes(e, AL).lista[0].estado).toBe('publicado');
  });

  it('el último medio termina a los 30 s: a los 29.9 s todavía hay uno en instalación', () => {
    let e = responderTodos(estadoInicial(), AL, {}, 'si');
    e = confirmarSeleccion(e, AL, T0);
    e = aceptarCotizacion(e, AL, T0);
    e = avanzar(e, T0 + 29900);
    expect(e.campanas[AL].fase).toBe('En instalación');
    expect(instalacion(e, AL, T0 + 29900).enInstalacion).toBe(1);
    expect(avanzar(e, T0 + 30000).campanas[AL].fase).toBe('En reporte');
  });

  it('no se acepta una cotización sin medios Sí (deseleccionar todo tras confirmar)', () => {
    let e = responderTodos(estadoInicial(), AL, {}, 'si');
    e = confirmarSeleccion(e, AL, T0);
    e = responderTodos(e, AL, {}, 'no');
    expect(e.campanas[AL].fase).toBe('Cotización lista');
    expect(cotizacion(e, AL)).toMatchObject({ medios: 0, total: 0, puedeAceptar: false, actualizada: true });
    expect(aceptarCotizacion(e, AL, T0)).toBe(e);
  });

  it('valores inválidos, medios ajenos y acciones desconocidas no cambian nada', () => {
    const e = estadoInicial();
    expect(responder(e, AL, medios[0].id, 'tal vez')).toBe(e);
    expect(responder(e, AL, 'no-existe', 'si')).toBe(e);
    expect(responder(e, AL, campanaFija(CODIGOS.BAJIO).medios[0].id, 'si')).toBe(e);
    expect(reducer(e, { type: 'otra' })).toBe(e);
    expect(avanzar(e, T0)).toBe(e);
  });

  it('el reducer despacha las mismas transiciones', () => {
    let e = estadoInicial();
    e = reducer(e, { type: 'responderTodos', codigo: AL, filtro: {}, valor: 'si' });
    e = reducer(e, { type: 'confirmarSeleccion', codigo: AL, ahora: T0 });
    e = reducer(e, { type: 'aceptarCotizacion', codigo: AL, ahora: T0 });
    e = reducer(e, { type: 'avanzar', ahora: T0 + 31000 });
    expect(e.campanas[AL].fase).toBe('En reporte');
    expect(reducer(e, { type: 'reiniciar' })).toEqual(estadoInicial());
  });
});

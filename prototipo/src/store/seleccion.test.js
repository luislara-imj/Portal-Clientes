import { describe, expect, it } from 'vitest';
import { CODIGOS, campanaFija, estadoInicial } from '../data/semilla.js';
import { confirmarSeleccion, responder, responderTodos } from './reglas.js';
import { progresoPropuesta } from './selectores.js';
import { TarjetaMedio } from '../pages/propuesta/TarjetaMedio.jsx';

// Modelo de selección: cada medio está seleccionado ('si') o no ('no'); sin valor cuenta como 'no'.
const AL = CODIGOS.ALPINA;
const T0 = new Date(2026, 10, 2, 10, 0, 0).getTime();
const medios = campanaFija(AL).medios;
const fase = (e) => e.campanas[AL].fase;

describe('selección de medios (seleccionado / no seleccionado)', () => {
  it('estado inicial de Alpina: todo no seleccionado y sin respuestas guardadas', () => {
    const e = estadoInicial();
    expect(fase(e)).toBe('Propuesta lista');
    expect(e.campanas[AL].respuestas).toEqual({});
    expect(progresoPropuesta(e, AL)).toEqual({
      total: medios.length, si: 0, no: medios.length, confirmada: false, editable: true, puedeConfirmar: false
    });
  });

  it('marcar No un medio que ya cuenta como no seleccionado no cambia nada (ni la fase)', () => {
    const e = estadoInicial();
    expect(responder(e, AL, medios[0].id, 'no')).toBe(e);
    expect(responderTodos(e, AL, {}, 'no')).toBe(e);
  });

  it('el clic en la tarjeta alterna: no seleccionado → Sí, Sí → No, No → Sí', () => {
    const clics = [];
    const clic = (valor) => TarjetaMedio({ medio: medios[0], valor, onResponder: (id, v) => clics.push([id, v]) }).props.onClick();
    clic(undefined);
    clic('si');
    clic('no');
    expect(clics).toEqual([[medios[0].id, 'si'], [medios[0].id, 'no'], [medios[0].id, 'si']]);

    // En el store: alternar el mismo medio deja el valor guardado igual al último clic.
    let e = responder(estadoInicial(), AL, medios[0].id, 'si');
    expect(e.campanas[AL].respuestas[medios[0].id]).toBe('si');
    e = responder(e, AL, medios[0].id, 'no');
    expect(e.campanas[AL].respuestas[medios[0].id]).toBe('no');
    expect(progresoPropuesta(e, AL).si).toBe(0);
  });

  it('el primer medio seleccionado pasa la campaña a En selección', () => {
    const e = responder(estadoInicial(), AL, medios[3].id, 'si');
    expect(fase(e)).toBe('En selección');
  });

  it('deseleccionar todo no regresa la fase a Propuesta lista', () => {
    let e = responder(estadoInicial(), AL, medios[0].id, 'si');
    e = responder(e, AL, medios[0].id, 'no');
    expect(fase(e)).toBe('En selección');
    e = responderTodos(e, AL, {}, 'si');
    e = responderTodos(e, AL, {}, 'no');
    expect(fase(e)).toBe('En selección');
    expect(progresoPropuesta(e, AL)).toMatchObject({ si: 0, puedeConfirmar: false });
  });

  it('confirmar exige al menos un medio seleccionado', () => {
    // Ninguno seleccionado (ni en Propuesta lista ni en En selección): no se confirma.
    const inicial = estadoInicial();
    expect(confirmarSeleccion(inicial, AL, T0)).toBe(inicial);
    let e = responder(inicial, AL, medios[0].id, 'si');
    e = responder(e, AL, medios[0].id, 'no');
    expect(confirmarSeleccion(e, AL, T0)).toBe(e);

    // Con uno solo basta; el resto sin responder cuenta como No.
    e = responder(e, AL, medios[5].id, 'si');
    expect(progresoPropuesta(e, AL).puedeConfirmar).toBe(true);
    e = confirmarSeleccion(e, AL, T0);
    expect(fase(e)).toBe('Cotización lista');
    expect(e.campanas[AL].confirmadaEn).toBe(T0);
    expect(progresoPropuesta(e, AL)).toMatchObject({ si: 1, confirmada: true, puedeConfirmar: false });
  });

  it('Todos Sí / Todos No de una plaza escriben a todos los medios de esa plaza', () => {
    const filtro = { tipo: 'sitios', plaza: 'CDMX' };
    const ids = medios.filter((m) => m.tipo === filtro.tipo && m.plaza === filtro.plaza).map((m) => m.id);
    let e = responderTodos(estadoInicial(), AL, filtro, 'si');
    expect(fase(e)).toBe('En selección');
    expect(ids.every((id) => e.campanas[AL].respuestas[id] === 'si')).toBe(true);
    expect(progresoPropuesta(e, AL).si).toBe(ids.length);
    e = responderTodos(e, AL, filtro, 'no');
    expect(ids.every((id) => e.campanas[AL].respuestas[id] === 'no')).toBe(true);
    expect(progresoPropuesta(e, AL).si).toBe(0);
  });
});

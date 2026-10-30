import { describe, expect, it } from 'vitest';
import { CODIGOS, estadoInicial } from '../data/semilla.js';
import { CLAVE_ALMACEN, cargarEstado, guardarEstado } from './persistencia.js';
import { confirmarSeleccion, reiniciar, responder, responderTodos } from './reglas.js';

function almacenEnMemoria() {
  const datos = new Map();
  return {
    getItem: (k) => (datos.has(k) ? datos.get(k) : null),
    setItem: (k, v) => { datos.set(k, String(v)); },
    removeItem: (k) => { datos.delete(k); },
    datos
  };
}

const AL = CODIGOS.ALPINA;

describe('persistencia', () => {
  it('usa la clave obp-prototipo-v2', () => {
    expect(CLAVE_ALMACEN).toBe('obp-prototipo-v2');
  });

  it('sin nada guardado carga la semilla', () => {
    expect(cargarEstado(almacenEnMemoria())).toEqual(estadoInicial());
    expect(cargarEstado(null)).toEqual(estadoInicial());
  });

  it('guarda y recupera el estado tal cual', () => {
    const almacen = almacenEnMemoria();
    let e = responderTodos(estadoInicial(), AL, {}, 'si');
    e = confirmarSeleccion(e, AL, 123);
    expect(guardarEstado(e, almacen)).toBe(true);
    expect(almacen.datos.has('obp-prototipo-v2')).toBe(true);
    expect(cargarEstado(almacen)).toEqual(e);
  });

  it('JSON dañado, versión distinta o forma inválida → semilla', () => {
    const almacen = almacenEnMemoria();
    almacen.setItem(CLAVE_ALMACEN, '{no es json');
    expect(cargarEstado(almacen)).toEqual(estadoInicial());

    const e = responder(estadoInicial(), AL, 'al-sit-001', 'si');
    almacen.setItem(CLAVE_ALMACEN, JSON.stringify({ ...e, version: 999 }));
    expect(cargarEstado(almacen)).toEqual(estadoInicial());

    const sinCampana = JSON.parse(JSON.stringify(e));
    delete sinCampana.campanas[CODIGOS.SOLARIA];
    almacen.setItem(CLAVE_ALMACEN, JSON.stringify(sinCampana));
    expect(cargarEstado(almacen)).toEqual(estadoInicial());

    const faseRara = JSON.parse(JSON.stringify(e));
    faseRara.campanas[AL].fase = 'Inventada';
    almacen.setItem(CLAVE_ALMACEN, JSON.stringify(faseRara));
    expect(cargarEstado(almacen)).toEqual(estadoInicial());

    almacen.setItem(CLAVE_ALMACEN, 'null');
    expect(cargarEstado(almacen)).toEqual(estadoInicial());
  });

  it('si el almacenamiento falla no lanza errores', () => {
    const roto = {
      getItem: () => { throw new Error('bloqueado'); },
      setItem: () => { throw new Error('lleno'); }
    };
    expect(cargarEstado(roto)).toEqual(estadoInicial());
    expect(guardarEstado(estadoInicial(), roto)).toBe(false);
  });

  it('reiniciar() vuelve a la semilla y no comparte referencias', () => {
    const almacen = almacenEnMemoria();
    const e = responderTodos(estadoInicial(), AL, {}, 'no');
    guardarEstado(e, almacen);
    const limpio = reiniciar();
    expect(limpio).toEqual(estadoInicial());
    guardarEstado(limpio, almacen);
    expect(cargarEstado(almacen)).toEqual(estadoInicial());
    limpio.campanas[AL].respuestas.x = 'si';
    expect(reiniciar().campanas[AL].respuestas).toEqual({});
  });
});

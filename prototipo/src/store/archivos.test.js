import { describe, expect, it } from 'vitest';
import { CODIGOS, estadoInicial } from '../data/semilla.js';
import { reducer } from './reglas.js';

const archivo = { id: 'a1', nombre: 'arte.ai', tipo: 'AI', tamano: 1024, subidoEn: 0 };

describe('archivos de la campaña', () => {
  it('la semilla empieza sin archivos', () => {
    const e = estadoInicial();
    for (const c of Object.values(e.campanas)) expect(c.archivos).toEqual([]);
  });

  it('agrega y quita archivos en cualquier campaña', () => {
    let e = estadoInicial();
    e = reducer(e, { type: 'agregarArchivo', codigo: CODIGOS.ALPINA, archivo });
    e = reducer(e, { type: 'agregarArchivo', codigo: CODIGOS.SOLARIA, archivo });
    expect(e.campanas[CODIGOS.ALPINA].archivos).toHaveLength(1);
    expect(e.campanas[CODIGOS.SOLARIA].archivos).toHaveLength(1);
    e = reducer(e, { type: 'quitarArchivo', codigo: CODIGOS.ALPINA, archivoId: 'a1' });
    expect(e.campanas[CODIGOS.ALPINA].archivos).toEqual([]);
  });

  it('no duplica un archivo con el mismo id y reiniciar los borra', () => {
    let e = estadoInicial();
    e = reducer(e, { type: 'agregarArchivo', codigo: CODIGOS.ALPINA, archivo });
    e = reducer(e, { type: 'agregarArchivo', codigo: CODIGOS.ALPINA, archivo });
    expect(e.campanas[CODIGOS.ALPINA].archivos).toHaveLength(1);
    e = reducer(e, { type: 'reiniciar' });
    expect(e.campanas[CODIGOS.ALPINA].archivos).toEqual([]);
  });
});

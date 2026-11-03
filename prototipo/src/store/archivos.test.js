import { describe, expect, it } from 'vitest';
import { CODIGOS, estadoInicial } from '../data/semilla.js';
import { URL_DRIVE_ARTES } from '../data/catalogos.js';
import { faseAlMenos, reducer } from './reglas.js';
import { esEstadoValido } from './persistencia.js';

const archivo = { id: 'a1', nombre: 'arte.ai', tipo: 'AI', tamano: 1024, subidoEn: 0 };

describe('archivos de la campaña', () => {
  it('Alpina empieza sin archivos ni carpeta; las campañas con arte lo traen ya en Drive', () => {
    const e = estadoInicial();
    expect(e.campanas[CODIGOS.ALPINA].archivos).toEqual([]);
    expect(e.campanas[CODIGOS.ALPINA].carpetaDrive).toBeNull();
    for (const [codigo, c] of Object.entries(e.campanas)) {
      if (codigo === CODIGOS.ALPINA) continue;
      // Todas las demás tienen arte en su tarjeta: carpeta creada y el arte principal subido.
      expect(c.carpetaDrive?.url).toBe(URL_DRIVE_ARTES);
      expect(c.archivos.filter((a) => a.arte)).toHaveLength(1);
      if (faseAlMenos(c.fase, 'Aceptada')) expect(c.archivos.length).toBeGreaterThanOrEqual(3);
    }
  });

  it('agrega y quita archivos en cualquier campaña', () => {
    let e = estadoInicial();
    e = reducer(e, { type: 'agregarArchivo', codigo: CODIGOS.ALPINA, archivo });
    e = reducer(e, { type: 'agregarArchivo', codigo: CODIGOS.BAJIO, archivo });
    expect(e.campanas[CODIGOS.ALPINA].archivos).toHaveLength(1);
    expect(e.campanas[CODIGOS.BAJIO].archivos).toHaveLength(2);
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

describe('carpeta de artes en Google Drive', () => {
  it('crea la carpeta una sola vez con la marca y el código', () => {
    let e = estadoInicial();
    e = reducer(e, { type: 'crearCarpetaDrive', codigo: CODIGOS.ALPINA, ahora: 1000 });
    expect(e.campanas[CODIGOS.ALPINA].carpetaDrive).toEqual({
      nombre: `OBP / Alpina / ${CODIGOS.ALPINA} / Artes`,
      url: URL_DRIVE_ARTES,
      creadaEn: 1000
    });
    expect(esEstadoValido(e)).toBe(true);
  });

  it('es idempotente: si ya existe devuelve el mismo estado', () => {
    let e = reducer(estadoInicial(), { type: 'crearCarpetaDrive', codigo: CODIGOS.ALPINA, ahora: 1000 });
    const otra = reducer(e, { type: 'crearCarpetaDrive', codigo: CODIGOS.ALPINA, ahora: 2000 });
    expect(otra).toBe(e);
    expect(otra.campanas[CODIGOS.ALPINA].carpetaDrive.creadaEn).toBe(1000);
  });

  it('ignora campañas inexistentes y reiniciar la borra', () => {
    const e0 = estadoInicial();
    expect(reducer(e0, { type: 'crearCarpetaDrive', codigo: 'NO-EXISTE', ahora: 1 })).toBe(e0);
    let e = reducer(e0, { type: 'crearCarpetaDrive', codigo: CODIGOS.ALPINA, ahora: 1 });
    e = reducer(e, { type: 'reiniciar' });
    expect(e.campanas[CODIGOS.ALPINA].carpetaDrive).toBeNull();
  });
});

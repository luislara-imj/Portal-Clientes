import { describe, expect, it } from 'vitest';
import { CODIGOS } from '../../data/semilla.js';
import { ETIQUETAS_EDAD, ETIQUETAS_GENERO, ETIQUETAS_NSE, demografiaDe, repartirEn100 } from './demografia.js';

const suma = (serie) => serie.reduce((t, d) => t + d.valor, 0);
const SEMILLAS = [...Object.values(CODIGOS), 'medio-1', 'medio-2', 'SOL-CDMX-IND-03', '', 'x'];

describe('demografía de muestra', () => {
  it('cada gráfico suma 100 con enteros', () => {
    for (const semilla of SEMILLAS) {
      const d = demografiaDe(semilla);
      for (const serie of [d.genero, d.edad, d.nse]) {
        expect(suma(serie)).toBe(100);
        expect(serie.every((x) => Number.isInteger(x.valor) && x.valor > 0)).toBe(true);
      }
    }
  });

  it('es determinista y depende de la semilla', () => {
    expect(demografiaDe(CODIGOS.SOLARIA)).toEqual(demografiaDe(CODIGOS.SOLARIA));
    const distintas = new Set(SEMILLAS.map((s) => JSON.stringify(demografiaDe(s))));
    expect(distintas.size).toBeGreaterThan(1);
  });

  it('etiquetas y valores realistas', () => {
    for (const semilla of SEMILLAS) {
      const { genero, edad, nse } = demografiaDe(semilla);
      expect(genero.map((x) => x.etiqueta)).toEqual(ETIQUETAS_GENERO);
      expect(edad.map((x) => x.etiqueta)).toEqual(ETIQUETAS_EDAD);
      expect(nse.map((x) => x.etiqueta)).toEqual(ETIQUETAS_NSE);
      expect(genero[0].valor).toBeGreaterThanOrEqual(45);
      expect(genero[0].valor).toBeLessThanOrEqual(55);
      expect(Math.max(...edad.map((x) => x.valor))).toBe(edad[1].valor); // pico en 26-40
      const mayores = [...nse].sort((a, b) => b.valor - a.valor).slice(0, 2).map((x) => x.etiqueta).sort();
      expect(mayores).toEqual(['C', 'C+']);
    }
  });

  it('repartirEn100 conserva el total', () => {
    expect(repartirEn100([1, 1, 1])).toEqual([34, 33, 33]);
    expect(repartirEn100([2, 1, 1]).reduce((t, n) => t + n, 0)).toBe(100);
  });
});

import { describe, expect, it } from 'vitest';
import { diasDelPeriodo, enPalabras, fechaLarga, importeConLetra, sumarDias, tiempoServicio } from './documento.js';

describe('documento formal de la cotización', () => {
  it('escribe enteros en palabras con apócope', () => {
    expect(enPalabras(0)).toBe('cero');
    expect(enPalabras(1)).toBe('un');
    expect(enPalabras(21)).toBe('veintiún');
    expect(enPalabras(100)).toBe('cien');
    expect(enPalabras(101)).toBe('ciento un');
    expect(enPalabras(1000)).toBe('mil');
    expect(enPalabras(21000)).toBe('veintiún mil');
    expect(enPalabras(1908432)).toBe('un millón novecientos ocho mil cuatrocientos treinta y dos');
    expect(enPalabras(25000000)).toBe('veinticinco millones');
  });

  it('importe con letra como en una cotización mexicana', () => {
    expect(importeConLetra(1908432)).toBe('UN MILLÓN NOVECIENTOS OCHO MIL CUATROCIENTOS TREINTA Y DOS PESOS 00/100 M.N.');
    expect(importeConLetra(2000000.5)).toBe('DOS MILLONES DE PESOS 50/100 M.N.');
    expect(importeConLetra(1)).toBe('UN PESO 00/100 M.N.');
  });

  it('fechas largas, vigencia y tiempo de servicio', () => {
    expect(fechaLarga('2026-10-28')).toBe('28 de octubre de 2026');
    expect(sumarDias('2026-10-28', 15)).toBe('2026-11-12');
    expect(diasDelPeriodo('2026-11-12', '2026-11-28')).toBe(17);
    expect(tiempoServicio({ tipo: 'vallas', inicio: '2026-11-12', fin: '2026-11-28' })).toBe('17 días');
    expect(tiempoServicio({ tipo: 'sitios', meses: 2 })).toBe('2 meses');
    expect(tiempoServicio({ tipo: 'camiones', meses: 1 })).toBe('1 mes');
  });
});

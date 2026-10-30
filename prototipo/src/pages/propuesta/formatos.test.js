import { describe, expect, it } from 'vitest';
import { claveDe, entero, porcentaje, precio, promedio, texto } from './formatos.js';

describe('formatos de la propuesta', () => {
  it('métricas en cero se leen "Sin dato" y sin valor "—"', () => {
    expect(entero(0)).toBe('Sin dato');
    expect(promedio(0)).toBe('Sin dato');
    expect(porcentaje(0)).toBe('Sin dato');
    expect(entero(null)).toBe('—');
    expect(texto('—')).toBe('—');
  });

  it('formatea conteos, promedios y porcentajes', () => {
    expect(entero(1234000)).toBe('1,234,000');
    expect(promedio(5)).toBe('5.0');
    expect(porcentaje(0.62)).toBe('62%');
    expect(precio(38000)).toBe('$38,000 MXN');
  });

  it('vallas y riders usan su numeración como clave', () => {
    expect(claveDe({ tipo: 'vallas', nombre: 'Valla 01', clave: null })).toBe('Valla 01');
    expect(claveDe({ tipo: 'sitios', nombre: 'x', clave: 'IMJ-CDMX-ESP-O-0001A' })).toBe('IMJ-CDMX-ESP-O-0001A');
  });
});

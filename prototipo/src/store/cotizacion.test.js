import { describe, expect, it } from 'vitest';
import { CODIGOS, campanaFija, estadoInicial } from '../data/semilla.js';
import { confirmarSeleccion, responder, responderTodos } from './reglas.js';
import { cotizacion, redondear } from './selectores.js';
import { formatoFecha, formatoMXN } from './formato.js';

const centavos = (n) => Math.round(n * 100) === n * 100 || Math.abs(Math.round(n * 100) - n * 100) < 1e-6;

// Alpina con una selección mixta y confirmada.
function alpinaConfirmada() {
  let e = responderTodos(estadoInicial(), CODIGOS.ALPINA, {}, 'si');
  e = responderTodos(e, CODIGOS.ALPINA, { plaza: 'ZMG', tipo: 'indoor' }, 'no');
  e = responderTodos(e, CODIGOS.ALPINA, { grupo: 'Blitz 180' }, 'no');
  return confirmarSeleccion(e, CODIGOS.ALPINA, 1);
}

function verificarCuadre(q, estado, codigo) {
  const resp = estado.campanas[codigo].respuestas;
  const si = campanaFija(codigo).medios.filter((m) => resp[m.id] === 'si');
  expect(q.medios).toBe(si.length);
  // Solo medios Sí, cada uno en exactamente una línea.
  const enLineas = q.tipos.flatMap((t) => t.lineas.flatMap((l) => l.medioIds));
  expect(enLineas.sort()).toEqual(si.map((m) => m.id).sort());
  for (const t of q.tipos) {
    for (const l of t.lineas) {
      expect(l.subtotal).toBe(redondear(l.precio * l.unidades * l.meses));
      expect(l.total).toBe(redondear(l.precioDescuento * l.unidades * l.meses));
      expect(l.descuento).toBe(redondear(l.subtotal - l.total));
    }
    expect(t.subtotal).toBe(redondear(t.lineas.reduce((s, l) => s + l.subtotal, 0)));
    expect(t.subtotalConDescuento).toBe(redondear(t.lineas.reduce((s, l) => s + l.total, 0)));
    expect(redondear(t.subtotal - t.descuento)).toBe(t.subtotalConDescuento);
  }
  expect(q.subtotal).toBe(redondear(q.tipos.reduce((s, t) => s + t.subtotal, 0)));
  expect(redondear(q.subtotal - q.descuento)).toBe(q.subtotalConDescuento);
  expect(q.descuento).toBe(redondear(q.tipos.reduce((s, t) => s + t.descuento, 0)));
  expect(q.iva).toBe(redondear(q.subtotalConDescuento * 0.16));
  expect(q.total).toBe(redondear(q.subtotalConDescuento + q.iva));
  expect(redondear(q.descuento)).toBe(redondear(q.subtotal * 0.1));
  for (const v of [q.subtotal, q.descuento, q.subtotalConDescuento, q.iva, q.total]) expect(centavos(v)).toBe(true);
}

describe('cuadre de la cotización', () => {
  it.each([
    ['WeCare Primavera', CODIGOS.WECARE_PRIMAVERA, 12],
    ['WeCare Otoño', CODIGOS.WECARE_OTONO, 20],
    ['WeCare Invierno', CODIGOS.WECARE_INVIERNO, 31],
    ['Cocacola', CODIGOS.COCACOLA, 20],
    ['Solaria', CODIGOS.SOLARIA, 31]
  ])('%s', (_, codigo, mediosSi) => {
    const e = estadoInicial();
    const q = cotizacion(e, codigo);
    expect(q.disponible).toBe(true);
    expect(q.medios).toBe(mediosSi);
    verificarCuadre(q, e, codigo);
  });

  it('Alpina tras confirmar (y tras cambiar la selección)', () => {
    let e = alpinaConfirmada();
    const q = cotizacion(e, CODIGOS.ALPINA);
    expect(q.disponible).toBe(true);
    verificarCuadre(q, e, CODIGOS.ALPINA);
    expect(q.tipos.map((t) => t.tipo)).toEqual(['sitios', 'indoor', 'camiones', 'vallas', 'riders']);
    // Riders: una línea por formato con las unidades Sí (Blitz 180 quedó fuera).
    const riders = q.tipos.find((t) => t.tipo === 'riders');
    expect(riders.lineas.map((l) => [l.nombre, l.unidades])).toEqual([
      ['Mass Awareness 360', 4], ['Mass Awareness 180', 4], ['Blitz 360', 4], ['Blitz Premium 180', 4], ['Blitz Premium 360', 4]
    ]);
    e = responder(e, CODIGOS.ALPINA, campanaFija(CODIGOS.ALPINA).medios.find((m) => m.formato === 'Blitz 180').id, 'si');
    const q2 = cotizacion(e, CODIGOS.ALPINA);
    expect(q2.actualizada).toBe(true);
    expect(q2.subtotal).toBe(q.subtotal + 27000);
    verificarCuadre(q2, e, CODIGOS.ALPINA);
  });

  it('WeCare Primavera cuadra con los montos esperados', () => {
    // Sitios 674,000 + camiones 268,500 + indoor 70,000 + vallas 76,000 + riders 34,000 = 1,122,500.
    const q = cotizacion(estadoInicial(), CODIGOS.WECARE_PRIMAVERA);
    expect([q.subtotal, q.descuento, q.subtotalConDescuento, q.iva, q.total]).toEqual([1122500, 112250, 1010250, 161640, 1171890]);
  });
});

describe('formatos', () => {
  it('formatoMXN', () => {
    expect(formatoMXN(1240000)).toBe('$1,240,000 MXN');
    expect(formatoMXN(0)).toBe('$0 MXN');
    expect(formatoMXN(999)).toBe('$999 MXN');
    expect(formatoMXN(1234.5)).toBe('$1,234.50 MXN');
    expect(formatoMXN(173664.48)).toBe('$173,664.48 MXN');
    expect(formatoMXN(-2500)).toBe('-$2,500 MXN');
    expect(formatoMXN(0.1 + 0.2)).toBe('$0.30 MXN');
  });

  it('formatoFecha', () => {
    expect(formatoFecha('2026-11-01')).toBe('1 nov 2026');
    expect(formatoFecha('2027-01-06')).toBe('6 ene 2027');
    expect(formatoFecha(new Date(2026, 11, 31, 10).getTime())).toBe('31 dic 2026');
    expect(formatoFecha(null)).toBe('—');
  });
});

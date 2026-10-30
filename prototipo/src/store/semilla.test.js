import { describe, expect, it } from 'vitest';
import { CODIGOS, SEMILLA, campanaFija, estadoInicial } from '../data/semilla.js';
import { esSinMetricas } from '../data/medios.js';
import { PLAZAS } from '../data/catalogos.js';
import { instalacion } from './selectores.js';

const CLAVE_SITIO = /^IMJ-(CDMX|ZMG|MTY)-(ESP|CAR|MUR|PAN|PTP|PAR)-O-\d{4}[AB]$/;
const CLAVE_INDOOR = /^IMJ-(CDMX|ZMG|MTY)-(AER|CCO|AUT)-I-\d{4}NA$/;
const CLAVE_RUTA = /^R-(CDMX|ZMG|MTY)\d{2}$/;
const NOMBRE_RUTA = /^(Integral|Semi-integral|Medallón|Medio medallón) · (Urbana|Hotelera|AAA|AA|A)$/;

describe('semilla', () => {
  it('tiene el cliente y las cinco campañas de la spec con su fase inicial', () => {
    expect(SEMILLA.cliente).toEqual({ nombre: 'Ana López', empresa: 'Cliente de ejemplo S.A.' });
    expect(SEMILLA.responsableComercial).toBe('Por asignar');
    expect(SEMILLA.campanas.map((c) => [c.codigo, c.nombre, c.faseInicial])).toEqual([
      [CODIGOS.ALPINA, 'Alpina Leche', 'Propuesta lista'],
      [CODIGOS.BAJIO, 'Bajío Otoño', 'En selección'],
      [CODIGOS.NORTENA, 'Norteña Navidad', 'Cotización lista'],
      [CODIGOS.COCACOLA, 'Cocacola Zero', 'En instalación'],
      [CODIGOS.SOLARIA, 'Solaria Verano', 'En reporte']
    ]);
    const e = estadoInicial();
    for (const c of SEMILLA.campanas) expect(e.campanas[c.codigo].fase).toBe(c.faseInicial);
  });

  it('es determinista y está congelada', () => {
    expect(estadoInicial()).toEqual(estadoInicial());
    expect(Object.isFrozen(SEMILLA.campanas[0].medios[0])).toBe(true);
  });

  it('todos los medios tienen la misma forma, id único, precio y descuento del 10 %', () => {
    const claves = Object.keys(SEMILLA.campanas[0].medios[0]).sort();
    const ids = new Set();
    for (const c of SEMILLA.campanas) {
      for (const m of c.medios) {
        expect(Object.keys(m).sort()).toEqual(claves);
        expect(ids.has(m.id)).toBe(false);
        ids.add(m.id);
        expect(m.precio).toBeGreaterThan(0);
        expect(m.precioDescuento).toBe(Math.round(m.precio * 90) / 100);
        expect(m.precioProduccion !== null).toBe(m.tipo === 'indoor');
      }
    }
  });

  it('las claves siguen el formato por tipo y no se repiten dentro de la campaña', () => {
    for (const c of SEMILLA.campanas) {
      const vistas = new Set();
      for (const m of c.medios) {
        if (m.tipo === 'sitios') {
          expect(m.clave).toMatch(CLAVE_SITIO);
          expect(m.clave.endsWith(m.vista === 'Natural' ? 'A' : 'B')).toBe(true);
        } else if (m.tipo === 'indoor') expect(m.clave).toMatch(CLAVE_INDOOR);
        else if (m.tipo === 'camiones') {
          expect(m.clave).toMatch(CLAVE_RUTA);
          expect(m.nombre).toMatch(NOMBRE_RUTA);
        } else {
          expect(m.clave).toBeNull();
          expect(m.nombre).toMatch(m.tipo === 'vallas' ? /^Valla \d{2}$/ : / · \d{2}$/);
        }
        if (m.clave) {
          expect(vistas.has(m.clave)).toBe(false);
          vistas.add(m.clave);
        }
      }
    }
  });

  it('Alpina: 3 plazas con 5 a 10 sitios, camiones e indoor; vallas por plaza y 6 formatos de riders', () => {
    const al = campanaFija(CODIGOS.ALPINA);
    for (const plaza of PLAZAS) {
      for (const tipo of ['sitios', 'camiones', 'indoor']) {
        const n = al.medios.filter((m) => m.plaza === plaza && m.tipo === tipo).length;
        expect(n).toBeGreaterThanOrEqual(5);
        expect(n).toBeLessThanOrEqual(10);
      }
      const vallas = al.medios.filter((m) => m.plaza === plaza && m.tipo === 'vallas');
      expect(new Set(vallas.map((m) => m.solicitud)).size).toBe(1);
      expect(vallas.length).toBeGreaterThanOrEqual(3);
      expect(vallas.length).toBeLessThanOrEqual(6);
    }
    const riders = al.medios.filter((m) => m.tipo === 'riders');
    const porFormato = {};
    riders.forEach((m) => { porFormato[m.formato] = (porFormato[m.formato] || 0) + 1; });
    expect(porFormato).toEqual({
      'Mass Awareness 360': 4, 'Mass Awareness 180': 4, 'Blitz 360': 4,
      'Blitz 180': 4, 'Blitz Premium 180': 4, 'Blitz Premium 360': 4
    });
    expect(riders.every((m) => m.meses === 1)).toBe(true);
    expect(riders.find((m) => m.formato === 'Blitz Premium 360').precio).toBe(74000);
    expect(Object.keys(estadoInicial().campanas[CODIGOS.ALPINA].respuestas)).toHaveLength(0);
  });

  it('métricas en cero solo a propósito: 3 medios de Alpina', () => {
    const ceros = SEMILLA.campanas.flatMap((c) => c.medios.filter((m) => m.impactos !== null && esSinMetricas(m)));
    expect(ceros.map((m) => m.id.slice(0, 2))).toEqual(['al', 'al', 'al']);
    expect(new Set(ceros.map((m) => m.tipo))).toEqual(new Set(['sitios', 'camiones', 'indoor']));
  });

  it('coordenadas cerca de su ciudad', () => {
    const centro = { CDMX: [19.43, -99.13], ZMG: [20.66, -103.35], MTY: [25.69, -100.32] };
    for (const c of SEMILLA.campanas) {
      for (const m of c.medios.filter((x) => x.lat !== null)) {
        const [lat, lng] = centro[m.plaza];
        expect(Math.abs(m.lat - lat)).toBeLessThan(0.3);
        expect(Math.abs(m.lng - lng)).toBeLessThan(0.3);
      }
    }
  });

  it('Bajío: 6 a 10 medios, algunos respondidos y otros no', () => {
    const fija = campanaFija(CODIGOS.BAJIO);
    const resp = estadoInicial().campanas[CODIGOS.BAJIO].respuestas;
    expect(fija.medios.length).toBeGreaterThanOrEqual(6);
    expect(fija.medios.length).toBeLessThanOrEqual(10);
    const respondidos = fija.medios.filter((m) => resp[m.id]).length;
    expect(respondidos).toBeGreaterThan(0);
    expect(respondidos).toBeLessThan(fija.medios.length);
  });

  it('Norteña: todo respondido con 12 Sí', () => {
    const fija = campanaFija(CODIGOS.NORTENA);
    const resp = estadoInicial().campanas[CODIGOS.NORTENA].respuestas;
    expect(fija.medios.every((m) => resp[m.id])).toBe(true);
    expect(fija.medios.filter((m) => resp[m.id] === 'si')).toHaveLength(12);
  });

  it('Cocacola: 20 Sí con 8 Instalado, 4 En instalación, 8 Por instalar', () => {
    const e = estadoInicial();
    const resp = e.campanas[CODIGOS.COCACOLA].respuestas;
    expect(Object.values(resp).filter((v) => v === 'si')).toHaveLength(20);
    const inst = instalacion(e, CODIGOS.COCACOLA, Date.now());
    expect([inst.total, inst.instalados, inst.enInstalacion, inst.porInstalar]).toEqual([20, 8, 4, 8]);
    // No avanza sola: el mismo resultado un año después.
    expect(instalacion(e, CODIGOS.COCACOLA, Date.now() + 365 * 864e5).instalados).toBe(8);
  });

  it('Solaria: 31 medios instalados y reportes inicial, junio, julio y agosto publicados', () => {
    const e = estadoInicial();
    const inst = instalacion(e, CODIGOS.SOLARIA, Date.now());
    expect([inst.total, inst.instalados]).toEqual([31, 31]);
    const reportes = e.campanas[CODIGOS.SOLARIA].reportes;
    expect(reportes.map((r) => [r.id, r.estado])).toEqual([
      ['inicial', 'publicado'], ['2026-06', 'publicado'], ['2026-07', 'publicado'], ['2026-08', 'publicado']
    ]);
  });
});

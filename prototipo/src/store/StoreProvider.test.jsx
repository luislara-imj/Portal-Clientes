import { describe, expect, it } from 'vitest';
import { renderToString } from 'react-dom/server';
import { CODIGOS } from '../data/semilla.js';
import { CLAVE_ALMACEN } from './persistencia.js';
import { StoreProvider, useStore } from './StoreProvider.jsx';
import { responder } from './reglas.js';
import { estadoInicial } from '../data/semilla.js';

function Sonda({ alLeer }) {
  alLeer(useStore());
  return null;
}

describe('StoreProvider', () => {
  it('expone estado, acciones y selectores, y carga lo guardado', () => {
    const guardado = responder(estadoInicial(), CODIGOS.ALPINA, 'al-sit-001', 'si');
    const almacen = { getItem: (k) => (k === CLAVE_ALMACEN ? JSON.stringify(guardado) : null), setItem: () => {} };
    let api;
    renderToString(
      <StoreProvider almacen={almacen} reloj={() => 0}>
        <Sonda alLeer={(v) => { api = v; }} />
      </StoreProvider>
    );
    expect(api.estado.campanas[CODIGOS.ALPINA].fase).toBe('En selección');
    expect(api.cliente.nombre).toBe('Ana López');
    expect(api.campanas).toHaveLength(7);
    expect(api.fasesDeCampana(CODIGOS.ALPINA)).toHaveLength(4);
    expect(api.progresoPropuesta(CODIGOS.ALPINA).respondidos).toBe(1);
    expect(api.indicadores().totalCampanas).toBe(7);
    expect(api.plantilla(CODIGOS.ALPINA)).toMatchObject({ id: 'default', nombre: 'Plantilla Default' });
    expect(api.plantilla('NO-EXISTE').id).toBe('default');
    for (const accion of ['responder', 'responderTodos', 'confirmarSeleccion', 'aceptarCotizacion', 'avanzar', 'elegirPlantilla', 'reiniciar']) {
      expect(typeof api[accion]).toBe('function');
    }
  });

  it('useStore fuera del Provider avisa con un error', () => {
    expect(() => renderToString(<Sonda alLeer={() => {}} />)).toThrow(/StoreProvider/);
  });
});

import { describe, expect, it } from 'vitest';
import { estadoInicial, perfilInicial } from '../data/semilla.js';
import { reducer } from './reglas.js';
import { CLAVE_ALMACEN, cargarEstado } from './persistencia.js';

const almacenCon = (datos) => ({ getItem: (k) => (k === CLAVE_ALMACEN ? JSON.stringify(datos) : null), setItem: () => {} });

describe('perfil del usuario y de la empresa', () => {
  it('guardarPerfil reemplaza los datos; uno inválido no cambia nada', () => {
    const e = estadoInicial();
    const perfil = { ...perfilInicial(), empresa: { ...perfilInicial().empresa, nombreComercial: 'Lácteos del Norte' } };
    const e2 = reducer(e, { type: 'guardarPerfil', perfil });
    expect(e2.perfil.empresa.nombreComercial).toBe('Lácteos del Norte');
    expect(reducer(e2, { type: 'guardarPerfil', perfil: { usuario: null } })).toBe(e2);
  });

  it('reiniciar datos conserva el perfil', () => {
    const perfil = { ...perfilInicial(), usuario: { ...perfilInicial().usuario, nombre: 'Luis Pérez' } };
    const e = reducer(estadoInicial(), { type: 'guardarPerfil', perfil });
    expect(reducer(e, { type: 'reiniciar' }).perfil.usuario.nombre).toBe('Luis Pérez');
  });

  it('un estado guardado sin perfil se completa con el perfil por defecto', () => {
    const { perfil, ...sinPerfil } = estadoInicial();
    expect(perfil).toBeTruthy();
    expect(cargarEstado(almacenCon(sinPerfil)).perfil).toEqual(perfilInicial());
  });
});

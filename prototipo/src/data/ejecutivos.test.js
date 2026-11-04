import { describe, expect, it } from 'vitest';
import { CODIGOS } from './semilla.js';
import { ejecutivoDe, enlaceTelefono } from './ejecutivos.js';

describe('ejecutivos de IMJ', () => {
  it('cada campaña de la semilla tiene un ejecutivo responsable', () => {
    for (const codigo of Object.values(CODIGOS)) expect(ejecutivoDe(codigo)?.nombre).toBeTruthy();
    expect(ejecutivoDe('XYZ-0001')).toBeNull();
  });

  it('arma el enlace tel: con lada de México y extensión', () => {
    expect(enlaceTelefono('33 3640 0944 ext. 112')).toBe('tel:+523336400944,112');
    expect(enlaceTelefono('33 3640 6194')).toBe('tel:+523336406194');
  });
});

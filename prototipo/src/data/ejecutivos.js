// Ejecutivos comerciales de IMJ responsables de las campañas. Las fotos son del equipo; los nombres, correos
// y teléfonos son de ejemplo hasta tener los datos reales de cada persona.

import { CODIGOS } from './semilla.js';
import foto1 from '../assets/ejecutivos/ejecutivo-1.jpg';
import foto2 from '../assets/ejecutivos/ejecutivo-2.jpg';
import foto3 from '../assets/ejecutivos/ejecutivo-3.jpg';
import foto4 from '../assets/ejecutivos/ejecutivo-4.jpg';
import foto5 from '../assets/ejecutivos/ejecutivo-5.jpg';

export const EJECUTIVOS = {
  carlos: { nombre: 'Carlos Mendoza Ruiz', puesto: 'Ejecutivo comercial', correo: 'carlos.mendoza@imjmedia.com.mx', telefono: '33 3640 0944 ext. 104', foto: foto1 },
  patricia: { nombre: 'Patricia Hernández Gil', puesto: 'Gerente comercial', correo: 'patricia.hernandez@imjmedia.com.mx', telefono: '33 3640 0944 ext. 101', foto: foto2 },
  julia: { nombre: 'Julia Ramírez Arias', puesto: 'Ejecutiva comercial', correo: 'julia.ramirez@imjmedia.com.mx', telefono: '33 3640 0944 ext. 112', foto: foto3 },
  mauricio: { nombre: 'Mauricio León Rivas', puesto: 'Ejecutivo comercial', correo: 'mauricio.leon@imjmedia.com.mx', telefono: '33 3640 6194 ext. 205', foto: foto4 },
  wendy: { nombre: 'Wendy Cruz Robles', puesto: 'Ejecutiva de cuenta', correo: 'wendy.cruz@imjmedia.com.mx', telefono: '33 3640 0944 ext. 118', foto: foto5 }
};

// Ejecutivo asignado a cada campaña de la semilla.
const POR_CAMPANA = {
  [CODIGOS.ALPINA]: 'julia',
  [CODIGOS.BAJIO]: 'mauricio',
  [CODIGOS.WECARE_PRIMAVERA]: 'wendy',
  [CODIGOS.WECARE_OTONO]: 'wendy',
  [CODIGOS.WECARE_INVIERNO]: 'wendy',
  [CODIGOS.COCACOLA]: 'carlos',
  [CODIGOS.SOLARIA]: 'patricia'
};

// Ejecutivo responsable de una campaña; null si no tiene.
export function ejecutivoDe(codigo) {
  return EJECUTIVOS[POR_CAMPANA[codigo]] ?? null;
}

// "33 3640 0944 ext. 112" → "tel:+523336400944,112" (la extensión se marca después de una pausa).
export function enlaceTelefono(telefono) {
  const [numero, ext] = String(telefono).split(/\s*ext\.?\s*/i);
  const digitos = numero.replace(/\D/g, '');
  return `tel:+52${digitos}${ext ? `,${ext.replace(/\D/g, '')}` : ''}`;
}

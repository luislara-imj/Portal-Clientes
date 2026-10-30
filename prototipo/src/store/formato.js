import { MESES_CORTOS } from '../data/fechas.js';

// "$1,240,000 MXN" si es entero; "$1,240,000.50 MXN" si tiene centavos.
export function formatoMXN(n) {
  const valor = Number(n);
  if (!Number.isFinite(valor)) return '—';
  const centavos = Math.round(Math.abs(valor) * 100);
  const entero = Math.floor(centavos / 100);
  const resto = centavos % 100;
  const miles = String(entero).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const signo = valor < 0 && centavos > 0 ? '-' : '';
  return `${signo}$${miles}${resto ? '.' + String(resto).padStart(2, '0') : ''} MXN`;
}

// 'AAAA-MM-DD' (o milisegundos) → "1 nov 2026".
export function formatoFecha(valor) {
  if (valor === null || valor === undefined || valor === '') return '—';
  let anio;
  let mes0;
  let dia;
  if (typeof valor === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(valor)) {
    [anio, mes0, dia] = valor.split('-').map(Number);
    mes0 -= 1;
  } else {
    const d = new Date(valor);
    if (Number.isNaN(d.getTime())) return '—';
    anio = d.getFullYear();
    mes0 = d.getMonth();
    dia = d.getDate();
  }
  return `${dia} ${MESES_CORTOS[mes0]} ${anio}`;
}

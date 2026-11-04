// Utilidades del documento formal de la cotización (PDF): importe con letra, fechas largas,
// vigencia de la cotización y tiempo de servicio por línea. Puras, sin React.

import { MESES } from '../../data/fechas.js';

// Días de vigencia de la cotización (TEXTOS_COTIZACION.aclaraciones).
export const DIAS_VIGENCIA_COTIZACION = 15;

const BASICOS = [
  'cero', 'un', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve',
  'diez', 'once', 'doce', 'trece', 'catorce', 'quince', 'dieciséis', 'diecisiete', 'dieciocho', 'diecinueve',
  'veinte', 'veintiún', 'veintidós', 'veintitrés', 'veinticuatro', 'veinticinco', 'veintiséis', 'veintisiete', 'veintiocho', 'veintinueve'
];
const DECENAS = ['', '', '', 'treinta', 'cuarenta', 'cincuenta', 'sesenta', 'setenta', 'ochenta', 'noventa'];
const CENTENAS = ['', 'ciento', 'doscientos', 'trescientos', 'cuatrocientos', 'quinientos', 'seiscientos', 'setecientos', 'ochocientos', 'novecientos'];

// 1…999 en palabras, con apócope para moneda ("un", "veintiún", "treinta y un").
function hastaMil(n) {
  if (n === 100) return 'cien';
  const c = Math.floor(n / 100);
  const r = n % 100;
  const partes = [];
  if (c) partes.push(CENTENAS[c]);
  if (r) {
    if (r < 30) partes.push(BASICOS[r]);
    else partes.push(DECENAS[Math.floor(r / 10)] + (r % 10 ? ` y ${BASICOS[r % 10]}` : ''));
  }
  return partes.join(' ');
}

// Entero en palabras: 1,908,432 → "un millón novecientos ocho mil cuatrocientos treinta y dos".
export function enPalabras(n) {
  const entero = Math.floor(Math.abs(n));
  if (entero === 0) return 'cero';
  const millones = Math.floor(entero / 1e6);
  const miles = Math.floor(entero / 1000) % 1000;
  const resto = entero % 1000;
  const partes = [];
  if (millones) partes.push(millones === 1 ? 'un millón' : `${enPalabras(millones)} millones`);
  if (miles) partes.push(miles === 1 ? 'mil' : `${hastaMil(miles)} mil`);
  if (resto) partes.push(hastaMil(resto));
  return partes.join(' ');
}

// Importe con letra, como en una cotización o factura mexicana:
// 1908432.5 → "UN MILLÓN NOVECIENTOS OCHO MIL CUATROCIENTOS TREINTA Y DOS PESOS 50/100 M.N."
export function importeConLetra(monto) {
  const centavos = Math.round(Math.abs(Number(monto) || 0) * 100);
  const pesos = Math.floor(centavos / 100);
  const cent = String(centavos % 100).padStart(2, '0');
  const exactoEnMillones = pesos >= 1e6 && pesos % 1e6 === 0;
  let moneda = 'pesos';
  if (pesos === 1) moneda = 'peso';
  else if (exactoEnMillones) moneda = 'de pesos';
  return `${enPalabras(pesos)} ${moneda} ${cent}/100 M.N.`.toUpperCase();
}

// 'AAAA-MM-DD' → "28 de octubre de 2026".
export function fechaLarga(iso) {
  if (!iso) return '—';
  const [a, m, d] = iso.split('-').map(Number);
  return `${d} de ${MESES[m - 1]} de ${a}`;
}

// 'AAAA-MM-DD' + n días → 'AAAA-MM-DD' (calendario, sin husos horarios).
export function sumarDias(iso, n) {
  const [a, m, d] = iso.split('-').map(Number);
  const f = new Date(Date.UTC(a, m - 1, d + n));
  return f.toISOString().slice(0, 10);
}

// Días naturales del periodo, contando inicio y fin.
export function diasDelPeriodo(inicio, fin) {
  const ms = (iso) => {
    const [a, m, d] = iso.split('-').map(Number);
    return Date.UTC(a, m - 1, d);
  };
  return Math.round((ms(fin) - ms(inicio)) / 86400000) + 1;
}

// Tiempo de servicio de una línea: vallas se cobran por periodo ("17 días"); el resto por meses.
export function tiempoServicio(linea) {
  if (linea.tipo === 'vallas' && linea.inicio && linea.fin) {
    const d = diasDelPeriodo(linea.inicio, linea.fin);
    return d === 1 ? '1 día' : `${d} días`;
  }
  const m = linea.meses || 1;
  return m === 1 ? '1 mes' : `${m} meses`;
}

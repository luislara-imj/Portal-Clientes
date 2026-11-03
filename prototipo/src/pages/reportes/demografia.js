// Demografía de muestra para las gráficas de Reportes. La semilla no trae estos datos: se generan
// de forma determinista a partir de un texto (código de campaña o id de medio). Cada gráfico
// suma 100 con porcentajes enteros.

export const ETIQUETAS_GENERO = ['Masculino', 'Femenino'];
export const ETIQUETAS_EDAD = ['18-25', '26-40', '41-55', '55 o más'];
export const ETIQUETAS_NSE = ['A/B', 'C+', 'C', 'D+', 'D', 'E'];

// Pesos base (perfil típico de audiencia exterior): edad con pico en 26-40, NSE con C y C+ mayores.
const BASE_EDAD = [22, 40, 25, 13];
const BASE_NSE = [7, 24, 30, 17, 13, 9];
const VARIACION = 0.12; // ±12 % sobre cada peso base

// FNV-1a de 32 bits.
function hash(texto) {
  let h = 0x811c9dc5;
  for (let i = 0; i < texto.length; i += 1) {
    h ^= texto.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

// mulberry32: números en [0, 1).
function generador(semilla) {
  let a = semilla;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Pesos → enteros que suman 100 (mayor residuo).
export function repartirEn100(pesos) {
  const total = pesos.reduce((t, p) => t + p, 0);
  const exactos = pesos.map((p) => (p / total) * 100);
  const enteros = exactos.map(Math.floor);
  let faltan = 100 - enteros.reduce((t, n) => t + n, 0);
  const orden = exactos.map((x, i) => [x - Math.floor(x), i]).sort((a, b) => b[0] - a[0] || a[1] - b[1]);
  for (let k = 0; faltan > 0; k += 1, faltan -= 1) enteros[orden[k % orden.length][1]] += 1;
  return enteros;
}

const serie = (etiquetas, valores) => etiquetas.map((etiqueta, i) => ({ etiqueta, valor: valores[i] }));

/**
 * { genero, edad, nse }: cada uno [{ etiqueta, valor }] con valores enteros que suman 100.
 * Género entre 45 y 55 por lado; edad con pico en 26-40; NSE con C y C+ como los mayores.
 */
export function demografiaDe(semilla) {
  const azar = generador(hash(String(semilla ?? '')));
  const variar = (base) => base.map((p) => p * (1 - VARIACION + azar() * 2 * VARIACION));
  const masculino = 45 + Math.floor(azar() * 11);
  return {
    genero: serie(ETIQUETAS_GENERO, [masculino, 100 - masculino]),
    edad: serie(ETIQUETAS_EDAD, repartirEn100(variar(BASE_EDAD))),
    nse: serie(ETIQUETAS_NSE, repartirEn100(variar(BASE_NSE)))
  };
}

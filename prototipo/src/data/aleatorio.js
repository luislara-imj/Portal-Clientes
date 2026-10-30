// Generador pseudoaleatorio determinista (mulberry32). La semilla se arma una sola vez con
// semillas fijas, así que los datos son idénticos en cada carga. No usa Math.random.

export function crearAleatorio(semilla) {
  let a = semilla >>> 0;

  function siguiente() {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  // Entero entre min y max (ambos incluidos).
  function entero(min, max) {
    return min + Math.floor(siguiente() * (max - min + 1));
  }

  // Decimal entre min y max con `decimales` cifras.
  function decimal(min, max, decimales = 2) {
    const f = 10 ** decimales;
    return Math.round((min + siguiente() * (max - min)) * f) / f;
  }

  function elegir(lista) {
    return lista[Math.floor(siguiente() * lista.length)];
  }

  function barajar(lista) {
    const copia = lista.slice();
    for (let i = copia.length - 1; i > 0; i--) {
      const j = Math.floor(siguiente() * (i + 1));
      [copia[i], copia[j]] = [copia[j], copia[i]];
    }
    return copia;
  }

  // Reparte 1 entre las claves dadas, en fracciones de dos decimales que suman exactamente 1.
  function reparto(claves) {
    const pesos = claves.map(() => 0.3 + siguiente());
    const suma = pesos.reduce((s, p) => s + p, 0);
    const centesimos = pesos.map((p) => Math.round((p / suma) * 100));
    const resto = 100 - centesimos.slice(0, -1).reduce((s, c) => s + c, 0);
    centesimos[centesimos.length - 1] = Math.max(0, resto);
    const objeto = {};
    claves.forEach((k, i) => { objeto[k] = centesimos[i] / 100; });
    return objeto;
  }

  return { siguiente, entero, decimal, elegir, barajar, reparto };
}

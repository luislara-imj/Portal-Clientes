// Línea de tiempo de instalación de un medio: 7 pasos de 1 día hábil (Figma, nodo 543:31890).

export const PASOS = [
  'Recepción de arte de cliente',
  'Envío y autorización de prueba de color',
  'Envío y autorización de dummies',
  'Proceso de impresión',
  'Envío por paquetería',
  'Instalación',
  'Reporte inicial'
];

export const DURACION_PASO = '1 día hábil';

// Paso actual (1–7) según el porcentaje del medio; null cuando todos están completos.
// 0 % → paso 1 · 1–99 % → avanza proporcional del paso 2 al 6 · 100 % → todos completos.
export function pasoActual(porcentaje) {
  const p = Math.max(0, Math.min(100, Math.round(Number(porcentaje) || 0)));
  if (p >= 100) return null;
  if (p <= 0) return 1;
  return Math.min(6, 2 + Math.floor(((p - 1) / 99) * 5));
}

// [{ numero, nombre, estado: 'completo' | 'actual' | 'pendiente' }]
export function estadoPasos(porcentaje) {
  const actual = pasoActual(porcentaje);
  return PASOS.map((nombre, i) => {
    const numero = i + 1;
    let estado = 'pendiente';
    if (actual === null || numero < actual) estado = 'completo';
    else if (numero === actual) estado = 'actual';
    return { numero, nombre, estado };
  });
}

// Resumen de avance de una lista de filas de instalación (mismo cálculo que el store).
export function resumir(lista) {
  const total = lista.length;
  const instalados = lista.filter((m) => m.estatus === 'Instalado').length;
  const porcentaje = total ? Math.round(lista.reduce((s, m) => s + m.porcentaje, 0) / total) : 0;
  return { total, instalados, porcentaje };
}

// Agrupa conservando el orden de aparición: [{ clave, items }].
export function agrupar(lista, claveDe) {
  const grupos = new Map();
  for (const item of lista) {
    const clave = claveDe(item);
    if (!grupos.has(clave)) grupos.set(clave, []);
    grupos.get(clave).push(item);
  }
  return [...grupos.entries()].map(([clave, items]) => ({ clave, items }));
}

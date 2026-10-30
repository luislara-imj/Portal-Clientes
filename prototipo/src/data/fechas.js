// Fechas del prototipo. Las fechas de calendario se guardan como texto 'AAAA-MM-DD';
// los instantes (aceptación, inicio de instalación, publicación) como milisegundos.

export const MESES = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
];
export const MESES_CORTOS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

const dos = (n) => String(n).padStart(2, '0');

export function fechaIso(anio, mes0, dia) {
  return `${anio}-${dos(mes0 + 1)}-${dos(dia)}`;
}

// Fecha de calendario local ('AAAA-MM-DD') de un instante en milisegundos.
export function fechaLocal(ms) {
  const d = new Date(ms);
  return fechaIso(d.getFullYear(), d.getMonth(), d.getDate());
}

export function ultimoDiaDelMes(anio, mes0) {
  return fechaIso(anio, mes0, new Date(anio, mes0 + 1, 0).getDate());
}

// Instante fijo (12:00 en México, 18:00 UTC) para fechas de la semilla: no depende de la zona horaria.
export function instante(iso) {
  const [a, m, d] = iso.split('-').map(Number);
  return Date.UTC(a, m - 1, d, 18, 0, 0);
}

// Meses de calendario que toca el periodo [inicio, fin].
export function mesesDelPeriodo(inicio, fin) {
  const [ai, mi] = inicio.split('-').map(Number);
  const [af, mf] = fin.split('-').map(Number);
  const lista = [];
  let anio = ai;
  let mes0 = mi - 1;
  while (anio < af || (anio === af && mes0 <= mf - 1)) {
    lista.push({ anio, mes0 });
    mes0 += 1;
    if (mes0 === 12) { mes0 = 0; anio += 1; }
  }
  return lista;
}

// Plan de reportes de una campaña: inicial (al terminar la instalación) y uno por mes del periodo,
// con publicación el último día de cada mes. Todos empiezan bloqueados.
export function planReportes(inicio, fin) {
  const mensuales = mesesDelPeriodo(inicio, fin).map(({ anio, mes0 }) => {
    const primero = fechaIso(anio, mes0, 1);
    const ultimo = ultimoDiaDelMes(anio, mes0);
    return {
      id: `${anio}-${dos(mes0 + 1)}`,
      tipo: 'mensual',
      nombre: `Reporte de ${MESES[mes0]}`,
      periodoInicio: primero < inicio ? inicio : primero,
      periodoFin: ultimo > fin ? fin : ultimo,
      publicacion: ultimo,
      publicadoEn: null,
      estado: 'bloqueado'
    };
  });
  return [
    {
      id: 'inicial',
      tipo: 'inicial',
      nombre: 'Reporte fotográfico inicial',
      periodoInicio: null,
      periodoFin: null,
      publicacion: null,
      publicadoEn: null,
      estado: 'bloqueado'
    },
    ...mensuales
  ];
}

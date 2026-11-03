// Datos derivados para Reportes y el visor. Solo leen el store (selectores ligados de useStore)
// y la semilla; no modifican nada.

import { NOMBRE_PLAZA, NOMBRE_TIPO, PLAZAS, TIPOS } from '../../data/catalogos.js';

export const SIN_DATO = 'Sin dato';
export const AVISO_DESCARGA = 'La descarga estará disponible en la versión final';

const numero = new Intl.NumberFormat('es-MX', { maximumFractionDigits: 0 });
const dos = (n) => String(n).padStart(2, '0');

// 'AAAA-MM-DD' o milisegundos → 'DD/MM/AAAA'.
export function fechaCorta(valor) {
  if (valor === null || valor === undefined || valor === '') return SIN_DATO;
  if (typeof valor === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(valor)) {
    const [a, m, d] = valor.split('-');
    return `${d}/${m}/${a}`;
  }
  const f = new Date(valor);
  if (Number.isNaN(f.getTime())) return SIN_DATO;
  return `${dos(f.getDate())}/${dos(f.getMonth() + 1)}/${f.getFullYear()}`;
}

// Medios instalados de la campaña (objetos completos de la semilla), en el orden de la instalación.
export function mediosInstalados(s, codigo) {
  const inst = s.instalacion(codigo);
  if (!inst) return [];
  return inst.medios
    .filter((f) => f.estatus === 'Instalado')
    .map((f) => s.medio(codigo, f.medioId))
    .filter(Boolean);
}

// Indicadores de la pantalla de Reportes. Cada valor es texto listo o SIN_DATO.
// - Impactos y alcance: suma de los medios instalados (los que traen 0 o null no suman).
// - Frecuencia promedio: promedio de las frecuencias mayores que 0.
// - Medios en ejecución: medios instalados.
// - Avance de testigos: medios con testigo fotográfico (incluidos en el reporte inicial publicado)
//   entre los medios contratados.
export function kpisReportes(s, codigo) {
  const inst = s.instalacion(codigo);
  const rep = s.reportes(codigo);
  const medios = mediosInstalados(s, codigo);
  const impactos = medios.reduce((t, m) => t + (m.impactosTotales > 0 ? m.impactosTotales : 0), 0);
  const alcance = medios.reduce((t, m) => t + (m.alcance > 0 ? m.alcance : 0), 0);
  const frecuencias = medios.filter((m) => m.frecuencia > 0).map((m) => m.frecuencia);
  const frecuencia = frecuencias.length ? frecuencias.reduce((t, f) => t + f, 0) / frecuencias.length : 0;
  const inicial = rep?.lista.find((r) => r.tipo === 'inicial');
  const conTestigo = inicial?.estado === 'publicado' ? medios.length : 0;
  const total = inst?.total ?? 0;
  return {
    impactos: impactos > 0 ? numero.format(impactos) : SIN_DATO,
    alcance: alcance > 0 ? numero.format(alcance) : SIN_DATO,
    frecuencia: frecuencia > 0 ? frecuencia.toFixed(2) : SIN_DATO,
    enEjecucion: medios.length > 0 ? numero.format(medios.length) : SIN_DATO,
    testigos: total > 0 && conTestigo > 0 ? `${Math.round((conTestigo / total) * 100)}%` : SIN_DATO
  };
}

// Pies de foto por tipo de medio.
const VISTAS = ['Vista corta', 'Vista media', 'Vista larga'];
const LADOS = ['Posterior', 'Lateral derecho', 'Lateral izquierdo'];
const PIES = { sitios: VISTAS, camiones: LADOS, indoor: VISTAS, vallas: LADOS, riders: VISTAS };

const TIPO_SINGULAR = { sitios: 'Sitio fijo', camiones: 'Camión', indoor: 'Indoor', vallas: 'Valla móvil', riders: 'Brand rider' };

const texto = (v) => (v === null || v === undefined || v === '' || v === 0 ? SIN_DATO : String(v));

function coordenadas(m) {
  if (typeof m.lat !== 'number' || typeof m.lng !== 'number') return SIN_DATO;
  const lat = `${Math.abs(m.lat)}°${m.lat >= 0 ? 'N' : 'S'}`;
  const lng = `${Math.abs(m.lng)}°${m.lng >= 0 ? 'E' : 'W'}`;
  return `${lat}, ${lng}`;
}

// Número de ruta a partir de la clave de camión (R-CDMX12 → "Ruta 12 · Urbana").
function ruta(m) {
  const n = /(\d+)$/.exec(m.clave || '');
  if (!n) return texto(m.tipoRuta);
  return m.tipoRuta ? `Ruta ${Number(n[1])} · ${m.tipoRuta}` : `Ruta ${Number(n[1])}`;
}

/**
 * Ficha de un medio en el reporte, como el archivo de reporte de Figma:
 * { clave, etiquetaClave, arriba: [[etiqueta, valor]], abajo: [[etiqueta, valor]], pies: [3 textos] }.
 * Versión, placas y eco de camiones no existen en la semilla: se muestran como "Sin dato".
 */
export function fichaDe(m, campana) {
  const plaza = NOMBRE_PLAZA[m.plaza] || texto(m.plaza);
  const nombreCampana = campana?.nombre || SIN_DATO;
  const base = { pies: PIES[m.tipo] || VISTAS, clave: texto(m.clave), etiquetaClave: 'Clave IMJ' };
  switch (m.tipo) {
    case 'sitios':
      return {
        ...base,
        arriba: [['Plaza', plaza], ['Campaña', nombreCampana], ['Tipo de anuncio', texto(m.formato)]],
        abajo: [
          ['Tipo de medio', TIPO_SINGULAR.sitios],
          ['Medidas', texto(m.medida)],
          ['Iluminación', texto(m.iluminacion)],
          ['Ubicación', texto(m.direccion)],
          ['Coordenadas', coordenadas(m)]
        ]
      };
    case 'camiones':
      return {
        ...base,
        arriba: [
          ['Plaza', plaza],
          ['Campaña', nombreCampana],
          ['Tipo de exhibición', texto(m.tipoExhibicion)],
          ['Versión', SIN_DATO],
          ['Ruta', ruta(m)],
          ['Placas', SIN_DATO],
          ['Eco', SIN_DATO]
        ],
        abajo: [['Recorrido', texto(m.direccion)]]
      };
    case 'indoor':
      return {
        ...base,
        arriba: [
          ['Tipo de medio', texto(m.formato)],
          ['Indoor padre', texto(m.inmueble)],
          ['Ubicación', texto(m.direccion)]
        ],
        abajo: [
          ['Coordenadas', coordenadas(m)],
          ['Medidas', texto(m.medida)],
          ['Nivel y zona', m.nivel || m.area ? [m.nivel, m.area].filter(Boolean).join(' · ') : SIN_DATO]
        ]
      };
    case 'vallas':
      return {
        ...base,
        clave: texto(m.nombre),
        etiquetaClave: 'Unidad',
        arriba: [['Plaza', plaza], ['Campaña', nombreCampana], ['Tipo de medio', texto(m.formato)]],
        abajo: [
          ['Medidas', texto(m.medida)],
          ['Periodo', m.inicio && m.fin ? `${fechaCorta(m.inicio)} – ${fechaCorta(m.fin)}` : SIN_DATO],
          ['Descripción', texto(m.descripcion)]
        ]
      };
    case 'riders':
      return {
        ...base,
        clave: texto(m.nombre),
        etiquetaClave: 'Unidad',
        arriba: [['Plaza', plaza], ['Campaña', nombreCampana], ['Tipo de medio', texto(m.formato)]],
        abajo: [['Familia', texto(m.familia)], ['Descripción', texto(m.descripcion)]]
      };
    default:
      return { ...base, arriba: [['Plaza', plaza], ['Campaña', nombreCampana]], abajo: [] };
  }
}

// Ancla de una sección del visor (sin "#": el router usa el hash).
export const anclaPlaza = (plaza) => `rp-${plaza.toLowerCase()}`;
export const anclaTipo = (plaza, tipo) => `rp-${plaza.toLowerCase()}-${tipo}`;

// Medios del reporte agrupados por plaza y tipo (orden de catálogo), sin grupos vacíos.
// [{ plaza, nombre, total, tipos: [{ tipo, nombre, medios: [m] }] }]
export function agruparPorPlazaYTipo(medios) {
  return PLAZAS.map((plaza) => {
    const tipos = TIPOS.map((tipo) => ({
      tipo,
      nombre: NOMBRE_TIPO[tipo],
      medios: medios.filter((m) => m.plaza === plaza && m.tipo === tipo)
    })).filter((t) => t.medios.length > 0);
    return { plaza, nombre: NOMBRE_PLAZA[plaza], total: tipos.reduce((n, t) => n + t.medios.length, 0), tipos };
  }).filter((p) => p.total > 0);
}

export const cuantos = (n) => `${n} ${n === 1 ? 'medio' : 'medios'}`;

// Días de calendario entre dos fechas 'AAAA-MM-DD' (b − a), sin depender de la zona horaria.
function diasEntre(a, b) {
  const utc = (iso) => {
    const [y, m, d] = iso.split('-').map(Number);
    return Date.UTC(y, m - 1, d);
  };
  return Math.round((utc(b) - utc(a)) / 86400000);
}

/**
 * Estado de la campaña para la 6ª tarjeta del dashboard. inicio, fin y hoy en 'AAAA-MM-DD'.
 * { estado: 'por-iniciar' | 'activa' | 'finalizada', titulo, valor, dia, total }
 * - total (M): días del periodo, inicio y fin incluidos.
 * - activa: dia (N) = días desde el inicio hasta hoy, ambos incluidos → "Día N de M".
 * - por iniciar: "Inicia en N días" (N = días que faltan para el inicio).
 * - finalizada: "M días".
 */
export function estadoCampana(inicio, fin, hoy) {
  const total = diasEntre(inicio, fin) + 1;
  if (hoy < inicio) {
    const faltan = diasEntre(hoy, inicio);
    return {
      estado: 'por-iniciar',
      titulo: 'Campaña por iniciar',
      valor: `Inicia en ${faltan} ${faltan === 1 ? 'día' : 'días'}`,
      dia: 0,
      total
    };
  }
  if (hoy > fin) {
    return { estado: 'finalizada', titulo: 'Campaña finalizada', valor: `${total} ${total === 1 ? 'día' : 'días'}`, dia: total, total };
  }
  const dia = diasEntre(inicio, hoy) + 1;
  return { estado: 'activa', titulo: 'Campaña activa', valor: `Día ${dia} de ${total}`, dia, total };
}

// Impactos de un medio en un reporte: inicial y mensual = impactos del mes; final = impactos totales.
export function impactosEnReporte(m, reporte) {
  const v = reporte?.tipo === 'final' ? m.impactosTotales : m.impactos;
  return v > 0 ? numero.format(v) : SIN_DATO;
}

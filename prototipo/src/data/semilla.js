// Semilla del prototipo: datos fijos (cliente, campañas, medios, instalación y reportes de las campañas
// de consulta) y el estado mutable inicial de cada campaña. Todo es determinista: se genera con semillas
// fijas, sin Math.random. "Reiniciar datos" vuelve a `estadoInicial()`.
//
// Datos de muestra: claves, números de calle, coordenadas, precios y métricas son inventados.

import { crearGenerador } from './medios.js';
import { instante, planReportes } from './fechas.js';
import { PLAZAS, FORMATOS_RIDER, TEXTOS_COTIZACION } from './catalogos.js';

// Versión del esquema del estado guardado. Si cambia, lo guardado se descarta y se usa la semilla.
export const VERSION = 1;

export const CLIENTE = { nombre: 'Ana López', empresa: 'Cliente de ejemplo S.A.' };
export const RESPONSABLE_COMERCIAL = 'Por asignar';

export const CODIGOS = {
  ALPINA: 'JRA-0021-ALPINA-ALPINA_LECHE-NOV-2026',
  BAJIO: 'MLR-0009-BAJIO-BAJIO_OTOÑO-NOV-2026',
  NORTENA: 'NAV-0014-NORTEÑA-NORTEÑA_NAVIDAD-DIC-2026',
  COCACOLA: 'JRA-0016-COCACOLA-COCACOLA_ZERO-OCT-2026',
  SOLARIA: 'JRA-0005-SOLARIA-SOLARIA_VERANO-JUN-2026'
};

// Única campaña que recorre el flujo completo; las demás son de consulta.
export const CAMPANA_FLUJO = CODIGOS.ALPINA;

function estadoBase(cambios) {
  return {
    fase: 'Propuesta lista',
    respuestas: {},
    confirmadaEn: null,
    aceptadaEn: null,
    instalacionInicio: null,
    instalacionFin: null,
    cotizacionActualizada: false,
    reportes: [],
    ...cambios
  };
}

// ---------------------------------------------------------------------------
// Alpina Leche · Propuesta lista · flujo completo
// ---------------------------------------------------------------------------
function alpina() {
  const inicio = '2026-11-01';
  const fin = '2026-12-31';
  const g = crearGenerador({ prefijo: 'al', semilla: 20261101, consecutivo: 1001, inicio, fin, meses: 2 });
  // Medios por plaza y tipo (entre 5 y 10, distinto en cada plaza).
  const conteo = {
    CDMX: { sitios: 8, camiones: 6, indoor: 7 },
    ZMG: { sitios: 6, camiones: 5, indoor: 9 },
    MTY: { sitios: 10, camiones: 7, indoor: 5 }
  };
  // Métricas en cero a propósito (para probar "Sin dato"): 3 medios.
  const sinMetricas = { 'CDMX:sitios:2': true, 'ZMG:camiones:1': true, 'MTY:indoor:0': true };
  const medios = [];
  for (const tipo of ['sitios', 'camiones', 'indoor']) {
    for (const plaza of PLAZAS) {
      for (let i = 0; i < conteo[plaza][tipo]; i++) {
        const op = { sinMetricas: !!sinMetricas[`${plaza}:${tipo}:${i}`] };
        const crear = tipo === 'sitios' ? g.sitio : tipo === 'camiones' ? g.camion : g.indoor;
        medios.push(crear(plaza, op));
      }
    }
  }
  const periodoVallas = { inicio: '2026-11-12', fin: '2026-11-28' };
  medios.push(
    ...g.vallas('CDMX', { formato: 'Valla en camión 3.5 t', unidades: 5, ...periodoVallas }),
    ...g.vallas('ZMG', { formato: 'Valla en camioneta', unidades: 4, ...periodoVallas }),
    ...g.vallas('MTY', { formato: 'Valla LED móvil', unidades: 3, ...periodoVallas })
  );
  // Brand riders: 6 formatos, 4 unidades y 1 mes cada uno (provisional). Plaza provisional: CDMX.
  for (const formato of Object.keys(FORMATOS_RIDER)) {
    medios.push(...g.riders(formato, { plaza: 'CDMX', unidades: 4, meses: 1, inicio: '2026-11-01', fin: '2026-11-30' }));
  }
  return {
    codigo: CODIGOS.ALPINA,
    nombre: 'Alpina Leche',
    inicio,
    fin,
    emision: '2026-10-28',
    faseInicial: 'Propuesta lista',
    flujo: 'completo',
    medios,
    instalacionFija: null,
    estadoInicial: estadoBase({ reportes: planReportes(inicio, fin) })
  };
}

// ---------------------------------------------------------------------------
// Bajío Otoño · En selección · consulta
// ---------------------------------------------------------------------------
function bajio() {
  const inicio = '2026-11-15';
  const fin = '2026-12-15';
  const g = crearGenerador({ prefijo: 'bj', semilla: 20261115, consecutivo: 2001, inicio, fin, meses: 1 });
  const medios = [
    g.sitio('ZMG', { codigo: 'ESP' }),
    g.sitio('ZMG', { codigo: 'CAR' }),
    g.sitio('ZMG', { codigo: 'PAN' }),
    g.sitio('CDMX', { codigo: 'MUR' }),
    g.camion('ZMG', { formato: 'Semi-integral' }),
    g.camion('ZMG', { formato: 'Medallón' }),
    g.indoor('ZMG', { inmueble: 'galeriasGdl' }),
    g.indoor('CDMX', { inmueble: 'antara' })
  ];
  // 5 respondidas (3 Sí, 2 No) y 3 sin responder.
  const valores = ['si', 'no', 'si', 'si', 'no'];
  const respuestas = {};
  valores.forEach((v, i) => { respuestas[medios[i].id] = v; });
  return {
    codigo: CODIGOS.BAJIO,
    nombre: 'Bajío Otoño',
    inicio,
    fin,
    emision: '2026-10-20',
    faseInicial: 'En selección',
    flujo: 'consulta',
    medios,
    instalacionFija: null,
    estadoInicial: estadoBase({ fase: 'En selección', respuestas, reportes: planReportes(inicio, fin) })
  };
}

// ---------------------------------------------------------------------------
// Norteña Navidad · Cotización lista · 18 medios respondidos, 12 Sí
// ---------------------------------------------------------------------------
function nortena() {
  const inicio = '2026-12-01';
  const fin = '2027-01-06';
  const g = crearGenerador({ prefijo: 'nt', semilla: 20261201, consecutivo: 701, inicio, fin, meses: 1 });
  const vallas = { inicio: '2026-12-01', fin: '2026-12-15' };
  const lista = [
    ['si', g.sitio('ZMG', { codigo: 'ESP', calle: 'vallarta', numero: 3233, precio: 185000 })],
    ['si', g.sitio('ZMG', { codigo: 'PAN', calle: 'lopezMateos', numero: 2375, precio: 142000 })],
    ['si', g.sitio('MTY', { codigo: 'ESP', calle: 'constitucion', numero: 2050, precio: 168000 })],
    ['si', g.sitio('CDMX', { codigo: 'ESP', calle: 'perifericoSur', numero: 4020, precio: 210000 })],
    ['no', g.sitio('MTY', { codigo: 'CAR' })],
    ['no', g.sitio('CDMX', { codigo: 'PAR' })],
    ['si', g.camion('ZMG', { formato: 'Semi-integral', unidades: 4, precio: 18500, recorrido: ['Av. Vallarta', 'Centro'] })],
    ['si', g.camion('MTY', { formato: 'Integral', unidades: 3, precio: 32000, recorrido: ['Ciudad Universitaria', 'Contry'] })],
    ['si', g.camion('CDMX', { formato: 'Semi-integral', unidades: 5, precio: 19000, recorrido: ['Tasqueña', 'Centro Histórico'] })],
    ['no', g.camion('MTY', { formato: 'Medallón' })],
    ['si', g.indoor('CDMX', { inmueble: 'santaFe', formato: 'Backlight', precio: 48000 })],
    ['si', g.indoor('MTY', { inmueble: 'valleOriente', formato: 'Tótem', precio: 22000 })],
    ['no', g.indoor('ZMG', { inmueble: 'andares' })],
    ['no', g.indoor('CDMX', { inmueble: 'aicm' })],
    ...g.vallas('MTY', { formato: 'Valla en camión 3.5 t', unidades: 1, ...vallas }).map((m) => ['si', m]),
    ...g.vallas('CDMX', { formato: 'Valla en camión 3.5 t', unidades: 1, ...vallas }).map((m) => ['si', m]),
    ...g.riders('Blitz 360', { plaza: 'ZMG', unidades: 2, meses: 1, inicio: '2026-12-12', fin: '2026-12-21' })
      .map((m, i) => [i === 0 ? 'si' : 'no', m])
  ];
  return {
    codigo: CODIGOS.NORTENA,
    nombre: 'Norteña Navidad',
    inicio,
    fin,
    emision: '2026-10-15',
    faseInicial: 'Cotización lista',
    flujo: 'consulta',
    medios: ordenarPorTipo(lista.map(([, m]) => m)),
    instalacionFija: null,
    estadoInicial: estadoBase({
      fase: 'Cotización lista',
      respuestas: Object.fromEntries(lista.map(([r, m]) => [m.id, r])),
      confirmadaEn: instante('2026-10-24'),
      reportes: planReportes(inicio, fin)
    })
  };
}

// ---------------------------------------------------------------------------
// Cocacola Zero · En instalación · 20 Sí (8 Instalado, 4 En instalación, 8 Por instalar) + 3 No
// ---------------------------------------------------------------------------
function cocacola() {
  const inicio = '2026-10-01';
  const fin = '2026-12-31';
  const g = crearGenerador({ prefijo: 'cc', semilla: 20261001, consecutivo: 101, inicio, fin, meses: 3 });
  const I = ['Instalado', 100, '2026-10-05', '2026-10-13'];
  const E = (pct) => ['En instalación', pct, '2026-10-26', '2026-11-03'];
  const P = ['Por instalar', 0, '2026-11-02', '2026-11-10'];
  const IC = ['Instalado', 100, '2026-10-05', '2026-10-15'];
  const PC = ['Por instalar', 0, '2026-11-02', '2026-11-12'];
  const lista = [
    [I, g.sitio('CDMX', { codigo: 'ESP', calle: 'insurgentesSur', numero: 1235 })],
    [I, g.sitio('CDMX', { codigo: 'ESP', calle: 'perifericoSur', numero: 4020 })],
    [E(50), g.sitio('CDMX', { codigo: 'PAN', calle: 'reforma', numero: 222 })],
    [P, g.sitio('CDMX', { codigo: 'PAN', calle: 'tlalpan', numero: 1880 })],
    [I, g.sitio('ZMG', { codigo: 'ESP', calle: 'vallarta', numero: 3233 })],
    [I, g.sitio('ZMG', { codigo: 'ESP', calle: 'lopezMateos', numero: 2375 })],
    [E(60), g.sitio('ZMG', { codigo: 'ESP', calle: 'lazaroCardenas', numero: 2305 })],
    [P, g.sitio('ZMG', { codigo: 'PAN', calle: 'patria', numero: 1150 })],
    [P, g.sitio('ZMG', { codigo: 'PAN', calle: 'americas', numero: 1500 })],
    [I, g.sitio('MTY', { codigo: 'ESP', calle: 'constitucion', numero: 2050 })],
    [E(40), g.sitio('MTY', { codigo: 'ESP', calle: 'gonzalitos', numero: 520 })],
    [P, g.sitio('MTY', { codigo: 'PAN', calle: 'vasconcelos', numero: 150 })],
    [null, g.sitio('CDMX', { codigo: 'CAR' })],
    [IC, g.camion('ZMG', { formato: 'Semi-integral', ruta: 29, recorrido: ['Av. Vallarta', 'Centro'] })],
    [['En instalación', 70, '2026-10-26', '2026-11-05'], g.camion('ZMG', { formato: 'Semi-integral', ruta: 38, recorrido: ['Centro', 'Tlaquepaque'] })],
    [PC, g.camion('ZMG', { formato: 'Integral', ruta: 24, recorrido: ['Tonalá', 'La Minerva'] })],
    [IC, g.camion('MTY', { formato: 'Integral', ruta: 1, recorrido: ['Ciudad Universitaria', 'Contry'] })],
    [PC, g.camion('MTY', { formato: 'Semi-integral', ruta: 14, recorrido: ['San Nicolás', 'Centro'] })],
    [null, g.camion('ZMG', { formato: 'Medallón' })],
    [I, g.indoor('CDMX', { inmueble: 'santaFe' })],
    [P, g.indoor('CDMX', { inmueble: 'antara' })],
    [P, g.indoor('ZMG', { inmueble: 'andares' })],
    [null, g.indoor('MTY', { inmueble: 'galeriasMty' })]
  ];
  return {
    codigo: CODIGOS.COCACOLA,
    nombre: 'Cocacola Zero',
    inicio,
    fin,
    emision: '2026-09-10',
    faseInicial: 'En instalación',
    flujo: 'consulta',
    medios: lista.map(([, m]) => m),
    instalacionFija: instalacionDe(lista),
    estadoInicial: estadoBase({
      fase: 'En instalación',
      respuestas: Object.fromEntries(lista.map(([inst, m]) => [m.id, inst ? 'si' : 'no'])),
      confirmadaEn: instante('2026-09-18'),
      aceptadaEn: instante('2026-09-25'),
      instalacionInicio: instante('2026-10-05'),
      reportes: planReportes(inicio, fin)
    })
  };
}

// ---------------------------------------------------------------------------
// Solaria Verano · En reporte · 31 Sí, todos instalados + 4 No · reportes inicial, junio, julio, agosto
// ---------------------------------------------------------------------------
function solaria() {
  const inicio = '2026-06-01';
  const fin = '2026-08-31';
  const g = crearGenerador({ prefijo: 'so', semilla: 20260601, consecutivo: 601, inicio, fin, meses: 3 });
  const I = ['Instalado', 100, '2026-05-18', '2026-05-26'];
  const repetir = (n, crear) => Array.from({ length: n }, () => [I, crear()]);
  const lista = [
    ...repetir(5, () => g.sitio('CDMX', { codigo: 'ESP' })),
    ...repetir(3, () => g.sitio('CDMX', { codigo: 'PAN' })),
    ...repetir(4, () => g.sitio('ZMG', { codigo: 'ESP' })),
    ...repetir(2, () => g.sitio('ZMG', { codigo: 'PAN' })),
    ...repetir(4, () => g.sitio('MTY', { codigo: 'ESP' })),
    [null, g.sitio('CDMX', { codigo: 'MUR' })],
    [null, g.sitio('ZMG', { codigo: 'CAR' })],
    [null, g.sitio('MTY', { codigo: 'PTP' })],
    ...repetir(3, () => g.camion('CDMX', { formato: 'Semi-integral' })),
    ...repetir(3, () => g.camion('MTY', { formato: 'Integral' })),
    [null, g.camion('ZMG', { formato: 'Medio medallón' })],
    ...repetir(3, () => g.indoor('CDMX')),
    ...repetir(2, () => g.indoor('ZMG')),
    ...repetir(2, () => g.indoor('MTY'))
  ];
  const reportes = planReportes(inicio, fin).map((r) => {
    const publicacion = r.tipo === 'inicial' ? '2026-05-27' : r.publicacion;
    return { ...r, publicacion, publicadoEn: instante(publicacion), estado: 'publicado' };
  });
  return {
    codigo: CODIGOS.SOLARIA,
    nombre: 'Solaria Verano',
    inicio,
    fin,
    emision: '2026-04-27',
    faseInicial: 'En reporte',
    flujo: 'consulta',
    medios: lista.map(([, m]) => m),
    instalacionFija: instalacionDe(lista),
    estadoInicial: estadoBase({
      fase: 'En reporte',
      respuestas: Object.fromEntries(lista.map(([inst, m]) => [m.id, inst ? 'si' : 'no'])),
      confirmadaEn: instante('2026-05-04'),
      aceptadaEn: instante('2026-05-11'),
      instalacionInicio: instante('2026-05-18'),
      instalacionFin: instante('2026-05-26'),
      reportes
    })
  };
}

function instalacionDe(lista) {
  const fija = {};
  for (const [inst, m] of lista) {
    if (!inst) continue;
    const [estatus, porcentaje, inicio, fin] = inst;
    fija[m.id] = { estatus, porcentaje, inicio, fin };
  }
  return fija;
}

const ORDEN_TIPO = { sitios: 0, camiones: 1, indoor: 2, vallas: 3, riders: 4 };
function ordenarPorTipo(medios) {
  return medios
    .map((m, i) => [m, i])
    .sort((a, b) => ORDEN_TIPO[a[0].tipo] - ORDEN_TIPO[b[0].tipo] || a[1] - b[1])
    .map(([m]) => m);
}

function congelar(obj) {
  if (obj && typeof obj === 'object' && !Object.isFrozen(obj)) {
    Object.freeze(obj);
    Object.values(obj).forEach(congelar);
  }
  return obj;
}

// Datos fijos. Congelados: nada en tiempo de ejecución los modifica.
export const SEMILLA = congelar({
  version: VERSION,
  cliente: CLIENTE,
  responsableComercial: RESPONSABLE_COMERCIAL,
  textosCotizacion: TEXTOS_COTIZACION,
  // Orden de la spec (sección 4).
  campanas: [alpina(), bajio(), nortena(), cocacola(), solaria()]
});

const POR_CODIGO = new Map(SEMILLA.campanas.map((c) => [c.codigo, c]));
const MEDIOS_POR_CODIGO = new Map(
  SEMILLA.campanas.map((c) => [c.codigo, new Map(c.medios.map((m) => [m.id, m]))])
);

export function campanaFija(codigo) {
  return POR_CODIGO.get(codigo) || null;
}

export function medioFijo(codigo, medioId) {
  return MEDIOS_POR_CODIGO.get(codigo)?.get(medioId) || null;
}

// Estado mutable inicial: copia nueva cada vez (la semilla nunca se comparte con el estado).
export function estadoInicial() {
  const campanas = {};
  for (const c of SEMILLA.campanas) campanas[c.codigo] = JSON.parse(JSON.stringify(c.estadoInicial));
  return { version: VERSION, campanas };
}

// Semilla del prototipo: datos fijos (cliente, campañas, medios, instalación y reportes de las campañas
// de consulta) y el estado mutable inicial de cada campaña. Todo es determinista: se genera con semillas
// fijas, sin Math.random. "Reiniciar datos" vuelve a `estadoInicial()`.
//
// Datos de muestra: claves, números de calle, coordenadas, precios y métricas son inventados.

import { crearGenerador } from './medios.js';
import { instante, planReportes } from './fechas.js';
import { PLAZAS, FORMATOS_RIDER, TEXTOS_COTIZACION, URL_DRIVE_ARTES, nombreCarpetaDrive } from './catalogos.js';

// Versión del esquema del estado guardado. Si cambia, lo guardado se descarta y se usa la semilla.
export const VERSION = 6;

export const CLIENTE = { nombre: 'Ana López', empresa: 'Cliente de ejemplo S.A.' };

// Perfil editable desde Configuración de la cuenta: datos del contacto (usuario) y de su empresa.
// foto y logo son data URL (imagen reducida) o null.
export function perfilInicial() {
  return {
    usuario: { nombre: CLIENTE.nombre, puesto: 'Gerente de marketing', correo: 'ana.lopez@clientedeejemplo.mx', telefono: '', foto: null },
    empresa: {
      nombreComercial: CLIENTE.empresa,
      razonSocial: 'Cliente de ejemplo S.A. de C.V.',
      telefono: '',
      direccion: '',
      logo: null
    }
  };
}
export const RESPONSABLE_COMERCIAL = 'Por asignar';

export const CODIGOS = {
  ALPINA: 'JRA-0021-ALPINA-ALPINA_LECHE-NOV-2026',
  BAJIO: 'MLR-0009-BAJIO-BAJIO_OTOÑO-NOV-2026',
  WECARE_PRIMAVERA: 'WCR-0031-WECARE-WECARE_PRIMAVERA-DIC-2026',
  WECARE_OTONO: 'WCR-0032-WECARE-WECARE_OTONO-NOV-2026',
  WECARE_INVIERNO: 'WCR-0033-WECARE-WECARE_INVIERNO-OCT-2026',
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
    archivos: [],
    // Carpeta de artes en Google Drive (simulada): null hasta que se crea; luego { nombre, url, creadaEn }.
    carpetaDrive: null,
    plantilla: 'default',
    ...cambios
  };
}

// Artes ya subidos a Drive en las campañas de consulta (solo metadatos). Cada archivo es
// [nombre, tamaño en bytes, extra?]; extra { arte: true } marca el arte principal de la campaña
// (la imagen que se ve en su tarjeta), que el modal muestra como miniatura.
function artesEnDrive(marca, codigo, aceptadaIso, archivos) {
  const creadaEn = instante(aceptadaIso);
  return {
    carpetaDrive: { nombre: nombreCarpetaDrive(marca, codigo), url: URL_DRIVE_ARTES, creadaEn },
    archivos: archivos.map(([nombre, tamano, extra], i) => ({
      id: `${codigo}-arte-${i + 1}`,
      nombre,
      tipo: nombre.split('.').pop().toUpperCase(),
      tamano: Math.round(tamano),
      subidoEn: creadaEn + (i + 1) * 3600000,
      ...extra
    }))
  };
}

const MB = 1024 * 1024;

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
    marca: 'Alpina',
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
  // 3 seleccionados (Sí) y 5 no seleccionados (No).
  const valores = ['si', 'no', 'si', 'si', 'no', 'no', 'no', 'no'];
  const respuestas = {};
  valores.forEach((v, i) => { respuestas[medios[i].id] = v; });
  return {
    codigo: CODIGOS.BAJIO,
    marca: 'Bajío',
    nombre: 'Bajío Otoño',
    inicio,
    fin,
    emision: '2026-10-20',
    faseInicial: 'En selección',
    flujo: 'consulta',
    medios,
    instalacionFija: null,
    estadoInicial: estadoBase({
      fase: 'En selección',
      respuestas,
      reportes: planReportes(inicio, fin),
      ...artesEnDrive('Bajío', CODIGOS.BAJIO, '2026-10-22', [['Bajio_Otono_Arte_Principal.webp', 772492, { arte: true }]])
    })
  };
}

// ---------------------------------------------------------------------------
// WeCare Primavera · Cotización lista · 18 medios, 12 Sí
// ---------------------------------------------------------------------------
function wecarePrimavera() {
  const inicio = '2026-12-01';
  const fin = '2026-12-31';
  const g = crearGenerador({ prefijo: 'wp', semilla: 20261202, consecutivo: 3101, inicio, fin, meses: 1 });
  const vallas = { inicio: '2026-12-01', fin: '2026-12-15' };
  const lista = [
    ['si', g.sitio('ZMG', { codigo: 'ESP', calle: 'chapultepec', numero: 1120, precio: 176000 })],
    ['si', g.sitio('ZMG', { codigo: 'PAN', calle: 'acueducto', numero: 4850, precio: 138000 })],
    ['si', g.sitio('MTY', { codigo: 'ESP', calle: 'garzaSada', numero: 1890, precio: 162000 })],
    ['si', g.sitio('CDMX', { codigo: 'ESP', calle: 'ejercito', numero: 980, precio: 198000 })],
    ['no', g.sitio('MTY', { codigo: 'CAR', calle: 'ruizCortines' })],
    ['no', g.sitio('CDMX', { codigo: 'PAR', calle: 'insurgentesNorte' })],
    ['si', g.camion('ZMG', { formato: 'Semi-integral', unidades: 4, precio: 18000, recorrido: ['Zapopan Centro', 'Plaza del Sol'] })],
    ['si', g.camion('MTY', { formato: 'Integral', unidades: 3, precio: 33000, recorrido: ['Guadalupe', 'San Pedro'] })],
    ['si', g.camion('CDMX', { formato: 'Semi-integral', unidades: 5, precio: 19500, recorrido: ['Observatorio', 'Pantitlán'] })],
    ['no', g.camion('MTY', { formato: 'Medallón', recorrido: ['Apodaca', 'Centro'] })],
    ['si', g.indoor('CDMX', { inmueble: 'perisur', formato: 'Backlight', precio: 46000 })],
    ['si', g.indoor('MTY', { inmueble: 'sorianaCumbres', formato: 'Tótem', precio: 24000 })],
    ['no', g.indoor('ZMG', { inmueble: 'plazaDelSol' })],
    ['no', g.indoor('CDMX', { inmueble: 'walmartTlalpan' })],
    ...g.vallas('MTY', { formato: 'Valla en camioneta', unidades: 1, ...vallas }).map((m) => ['si', m]),
    ...g.vallas('CDMX', { formato: 'Valla en camioneta', unidades: 1, ...vallas }).map((m) => ['si', m]),
    ...g.riders('Mass Awareness 180', { plaza: 'ZMG', unidades: 2, meses: 1, inicio: '2026-12-12', fin: '2026-12-21' })
      .map((m, i) => [i === 0 ? 'si' : 'no', m])
  ];
  return {
    codigo: CODIGOS.WECARE_PRIMAVERA,
    marca: 'WeCare',
    nombre: 'WeCare Primavera',
    inicio,
    fin,
    emision: '2026-10-16',
    faseInicial: 'Cotización lista',
    flujo: 'consulta',
    medios: ordenarPorTipo(lista.map(([, m]) => m)),
    instalacionFija: null,
    estadoInicial: estadoBase({
      fase: 'Cotización lista',
      respuestas: Object.fromEntries(lista.map(([r, m]) => [m.id, r])),
      confirmadaEn: instante('2026-10-26'),
      reportes: planReportes(inicio, fin),
      ...artesEnDrive('WeCare', CODIGOS.WECARE_PRIMAVERA, '2026-10-27', [['WeCare_Primavera_Arte_Principal.jpg', 30894, { arte: true }]])
    })
  };
}

// ---------------------------------------------------------------------------
// WeCare Otoño · En instalación · 20 Sí (8 Instalado, 4 En instalación, 8 Por instalar) + 3 No
// ---------------------------------------------------------------------------
function wecareOtono() {
  const inicio = '2026-11-01';
  const fin = '2026-11-30';
  const g = crearGenerador({ prefijo: 'wo', semilla: 20261103, consecutivo: 3201, inicio, fin, meses: 1 });
  const I = ['Instalado', 100, '2026-10-19', '2026-10-27'];
  const E = (pct) => ['En instalación', pct, '2026-10-26', '2026-11-04'];
  const P = ['Por instalar', 0, '2026-11-03', '2026-11-11'];
  const IC = ['Instalado', 100, '2026-10-19', '2026-10-29'];
  const PC = ['Por instalar', 0, '2026-11-03', '2026-11-13'];
  const lista = [
    [I, g.sitio('CDMX', { codigo: 'ESP', calle: 'masaryk', numero: 410 })],
    [I, g.sitio('CDMX', { codigo: 'ESP', calle: 'viaducto', numero: 1650 })],
    [E(50), g.sitio('CDMX', { codigo: 'PAN', calle: 'universidad', numero: 1200 })],
    [P, g.sitio('CDMX', { codigo: 'PAN', calle: 'churubusco', numero: 860 })],
    [I, g.sitio('ZMG', { codigo: 'ESP', calle: 'marianoOtero', numero: 3500 })],
    [I, g.sitio('ZMG', { codigo: 'ESP', calle: 'guadalupe', numero: 1420 })],
    [E(60), g.sitio('ZMG', { codigo: 'ESP', calle: 'revolucion', numero: 2100 })],
    [P, g.sitio('ZMG', { codigo: 'PAN', calle: 'independencia', numero: 640 })],
    [P, g.sitio('ZMG', { codigo: 'PAN', calle: 'perifericoNorte', numero: 1800 })],
    [I, g.sitio('MTY', { codigo: 'ESP', calle: 'fundidora', numero: 501 })],
    [E(40), g.sitio('MTY', { codigo: 'ESP', calle: 'moronesPrieto', numero: 3800 })],
    [P, g.sitio('MTY', { codigo: 'PAN', calle: 'gomezMorin', numero: 950 })],
    [null, g.sitio('CDMX', { codigo: 'CAR', calle: 'zaragoza' })],
    [IC, g.camion('ZMG', { formato: 'Semi-integral', ruta: 41, recorrido: ['Tlajomulco', 'Centro'] })],
    [['En instalación', 70, '2026-10-26', '2026-11-06'], g.camion('ZMG', { formato: 'Semi-integral', ruta: 17, recorrido: ['Huentitán', 'Plaza del Sol'] })],
    [PC, g.camion('ZMG', { formato: 'Integral', ruta: 52, recorrido: ['El Salto', 'Centro'] })],
    [IC, g.camion('MTY', { formato: 'Integral', ruta: 9, recorrido: ['Escobedo', 'Parque Fundidora'] })],
    [PC, g.camion('MTY', { formato: 'Semi-integral', ruta: 33, recorrido: ['Cumbres', 'Centro'] })],
    [null, g.camion('ZMG', { formato: 'Medallón', recorrido: ['Centro', 'Tlaquepaque'] })],
    [I, g.indoor('CDMX', { inmueble: 'perisur' })],
    [P, g.indoor('CDMX', { inmueble: 'aicm' })],
    [P, g.indoor('ZMG', { inmueble: 'aeroGdl' })],
    [null, g.indoor('MTY', { inmueble: 'valleOriente' })]
  ];
  return {
    codigo: CODIGOS.WECARE_OTONO,
    marca: 'WeCare',
    nombre: 'WeCare Otoño',
    inicio,
    fin,
    emision: '2026-09-24',
    faseInicial: 'En instalación',
    flujo: 'consulta',
    medios: lista.map(([, m]) => m),
    instalacionFija: instalacionDe(lista),
    estadoInicial: estadoBase({
      ...artesEnDrive('WeCare', CODIGOS.WECARE_OTONO, '2026-10-08', [['WeCare_Otono_Arte_Principal.jpg', 48170, { arte: true }], ['WeCare_Otono_Espectacular_12x7.ai', 48.6 * MB], ['WeCare_Otono_Camion_Semi.psd', 312.4 * MB], ['WeCare_Otono_Indoor_Pack.zip', 1.2 * 1024 * MB]]),
      fase: 'En instalación',
      respuestas: Object.fromEntries(lista.map(([inst, m]) => [m.id, inst ? 'si' : 'no'])),
      confirmadaEn: instante('2026-10-01'),
      aceptadaEn: instante('2026-10-08'),
      instalacionInicio: instante('2026-10-19'),
      reportes: planReportes(inicio, fin)
    })
  };
}

// ---------------------------------------------------------------------------
// WeCare Invierno · En reporte · 31 Sí, todos instalados + 4 No · reportes inicial, octubre y final
// ---------------------------------------------------------------------------
function wecareInvierno() {
  const inicio = '2026-10-01';
  const fin = '2026-10-31';
  const g = crearGenerador({ prefijo: 'wi', semilla: 20261004, consecutivo: 3301, inicio, fin, meses: 1 });
  const I = ['Instalado', 100, '2026-09-17', '2026-09-25'];
  const repetir = (n, crear) => Array.from({ length: n }, () => [I, crear()]);
  const lista = [
    ...repetir(4, () => g.sitio('CDMX', { codigo: 'ESP' })),
    ...repetir(3, () => g.sitio('CDMX', { codigo: 'PAN' })),
    ...repetir(5, () => g.sitio('ZMG', { codigo: 'ESP' })),
    ...repetir(2, () => g.sitio('ZMG', { codigo: 'PAN' })),
    ...repetir(4, () => g.sitio('MTY', { codigo: 'ESP' })),
    [null, g.sitio('ZMG', { codigo: 'MUR' })],
    [null, g.sitio('MTY', { codigo: 'CAR' })],
    [null, g.sitio('CDMX', { codigo: 'PTP' })],
    ...repetir(3, () => g.camion('ZMG', { formato: 'Semi-integral' })),
    ...repetir(3, () => g.camion('CDMX', { formato: 'Integral' })),
    [null, g.camion('MTY', { formato: 'Medio medallón' })],
    ...repetir(2, () => g.indoor('CDMX')),
    ...repetir(3, () => g.indoor('ZMG')),
    ...repetir(2, () => g.indoor('MTY'))
  ];
  const reportes = planReportes(inicio, fin).map((r) => {
    const publicacion = r.tipo === 'inicial' ? '2026-09-26' : r.publicacion;
    return { ...r, publicacion, publicadoEn: instante(publicacion), estado: 'publicado' };
  });
  return {
    codigo: CODIGOS.WECARE_INVIERNO,
    marca: 'WeCare',
    nombre: 'WeCare Invierno',
    inicio,
    fin,
    emision: '2026-08-27',
    faseInicial: 'En reporte',
    flujo: 'consulta',
    medios: lista.map(([, m]) => m),
    instalacionFija: instalacionDe(lista),
    estadoInicial: estadoBase({
      ...artesEnDrive('WeCare', CODIGOS.WECARE_INVIERNO, '2026-09-10', [['WeCare_Invierno_Arte_Principal.jpg', 39266, { arte: true }], ['WeCare_Invierno_Espectacular.ai', 52.3 * MB], ['WeCare_Invierno_Camiones.psd', 287.9 * MB]]),
      fase: 'En reporte',
      respuestas: Object.fromEntries(lista.map(([inst, m]) => [m.id, inst ? 'si' : 'no'])),
      confirmadaEn: instante('2026-09-03'),
      aceptadaEn: instante('2026-09-10'),
      instalacionInicio: instante('2026-09-17'),
      instalacionFin: instante('2026-09-25'),
      reportes
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
    marca: 'Coca-Cola',
    nombre: 'Cocacola Zero',
    inicio,
    fin,
    emision: '2026-09-10',
    faseInicial: 'En instalación',
    flujo: 'consulta',
    medios: lista.map(([, m]) => m),
    instalacionFija: instalacionDe(lista),
    estadoInicial: estadoBase({
      ...artesEnDrive('Coca-Cola', CODIGOS.COCACOLA, '2026-09-25', [['CocaColaZero_Arte_Principal.jpg', 65517, { arte: true }], ['CocaColaZero_Panoramico_12x4.ai', 61.7 * MB], ['CocaColaZero_Integral_Camion.psd', 405.2 * MB], ['CocaColaZero_Indoor_Backlight.zip', 860.5 * MB]]),
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
// Solaria Verano · En reporte · 31 Sí, todos instalados + 4 No · reportes inicial, junio, julio, agosto y final
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
    marca: 'Solaria',
    nombre: 'Solaria Verano',
    inicio,
    fin,
    emision: '2026-04-27',
    faseInicial: 'En reporte',
    flujo: 'consulta',
    medios: lista.map(([, m]) => m),
    instalacionFija: instalacionDe(lista),
    estadoInicial: estadoBase({
      ...artesEnDrive('Solaria', CODIGOS.SOLARIA, '2026-05-11', [['Solaria_Verano_Arte_Principal.jpg', 54941, { arte: true }], ['Solaria_Verano_Espectacular.ai', 39.8 * MB], ['Solaria_Verano_Camion_Integral.psd', 356.1 * MB], ['Solaria_Verano_Indoor.zip', 640.3 * MB]]),
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
  campanas: [alpina(), bajio(), wecarePrimavera(), wecareOtono(), wecareInvierno(), cocacola(), solaria()]
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
  return { version: VERSION, campanas, perfil: perfilInicial() };
}

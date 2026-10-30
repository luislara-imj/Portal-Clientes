// Selectores puros: (estado, …) → datos listos para la UI. No modifican el estado.

import { CAMPANA_FLUJO, SEMILLA, campanaFija } from '../data/semilla.js';
import { DESCUENTO_PCT, IVA_PCT, NOMBRE_PLAZA, NOMBRE_TIPO, PLAZAS, TIPOS } from '../data/catalogos.js';
import { fechaLocal } from '../data/fechas.js';
import { FASES, faseAlMenos, mediosSi, nivelFase, pendientesDe, seleccionEditable } from './reglas.js';
import { estatusDe, planInstalacion, porcentajeEn } from './instalacion.js';
import { formatoFecha } from './formato.js';

export const redondear = (n) => Math.round((n + Number.EPSILON) * 100) / 100;

const FASES_ACCION_CLIENTE = ['Propuesta lista', 'En selección', 'Cotización lista'];

// --- Propuesta --------------------------------------------------------------

export function progresoPropuesta(estado, codigo) {
  const fija = campanaFija(codigo);
  const resp = estado.campanas[codigo]?.respuestas || {};
  const total = fija ? fija.medios.length : 0;
  let si = 0;
  let no = 0;
  for (const m of fija ? fija.medios : []) {
    if (resp[m.id] === 'si') si++;
    else if (resp[m.id] === 'no') no++;
  }
  const c = estado.campanas[codigo];
  const confirmada = !!c && faseAlMenos(c.fase, 'Selección confirmada');
  return {
    total,
    respondidos: si + no,
    pendientes: total - si - no,
    si,
    no,
    confirmada,
    editable: seleccionEditable(estado, codigo),
    puedeConfirmar: seleccionEditable(estado, codigo) && !confirmada && total > 0 && si + no === total
  };
}

// --- Cotización -------------------------------------------------------------

function detalleDe(m) {
  if (m.tipo === 'indoor') return `${m.inmueble} · ${m.nivel}, ${m.area}`;
  if (m.tipo === 'vallas' || m.tipo === 'riders') return m.descripcion;
  return m.direccion;
}

function lineaDe(medios) {
  const m = medios[0];
  const unidades = medios.reduce((s, x) => s + (x.unidades || 1), 0);
  const meses = m.meses || 1;
  const subtotal = redondear(m.precio * unidades * meses);
  const total = redondear(m.precioDescuento * unidades * meses);
  return {
    id: m.solicitud || m.id,
    medioIds: medios.map((x) => x.id),
    tipo: m.tipo,
    plaza: m.plaza,
    ciudad: NOMBRE_PLAZA[m.plaza] || null,
    formato: m.formato,
    clave: m.clave,
    nombre: m.solicitud ? m.grupo : m.nombre,
    detalle: detalleDe(m),
    unidades,
    meses,
    inicio: m.inicio,
    fin: m.fin,
    precio: m.precio,
    precioDescuento: m.precioDescuento,
    subtotal,
    descuento: redondear(subtotal - total),
    total
  };
}

// Solo medios Sí. Vallas y riders se agrupan en una línea por solicitud (unidades = unidades Sí).
// Línea: subtotal = precio × unidades × meses; total = precioDescuento × unidades × meses.
// Cierre: subtotal, descuento, subtotalConDescuento, iva (16 %), total; todo redondeado a centavos.
export function cotizacion(estado, codigo) {
  const c = estado.campanas[codigo];
  const fija = campanaFija(codigo);
  if (!c || !fija) return null;
  const si = mediosSi(estado, codigo);
  const tipos = [];
  // Orden de la cotización (docs/TEMPLATES_REFERENCIA.md §2): sitios, indoor, camiones, vallas, riders.
  for (const tipo of ['sitios', 'indoor', 'camiones', 'vallas', 'riders']) {
    const delTipo = si.filter((m) => m.tipo === tipo);
    if (delTipo.length === 0) continue;
    const grupos = new Map();
    for (const m of delTipo) {
      const clave = m.solicitud || m.id;
      if (!grupos.has(clave)) grupos.set(clave, []);
      grupos.get(clave).push(m);
    }
    const lineas = [...grupos.values()].map(lineaDe);
    const subtotal = redondear(lineas.reduce((s, l) => s + l.subtotal, 0));
    const subtotalConDescuento = redondear(lineas.reduce((s, l) => s + l.total, 0));
    tipos.push({
      tipo,
      nombre: NOMBRE_TIPO[tipo],
      lineas,
      medios: delTipo.length,
      subtotal,
      descuento: redondear(subtotal - subtotalConDescuento),
      subtotalConDescuento
    });
  }
  const subtotal = redondear(tipos.reduce((s, t) => s + t.subtotal, 0));
  const subtotalConDescuento = redondear(tipos.reduce((s, t) => s + t.subtotalConDescuento, 0));
  const iva = redondear((subtotalConDescuento * IVA_PCT) / 100);
  return {
    codigo,
    disponible: faseAlMenos(c.fase, 'Selección confirmada'),
    aceptada: faseAlMenos(c.fase, 'Aceptada'),
    actualizada: !!c.cotizacionActualizada,
    puedeAceptar: codigo === CAMPANA_FLUJO && ['Selección confirmada', 'Cotización lista'].includes(c.fase) && si.length > 0,
    descuentoPct: DESCUENTO_PCT,
    ivaPct: IVA_PCT,
    medios: si.length,
    tipos,
    subtotal,
    descuento: redondear(subtotal - subtotalConDescuento),
    subtotalConDescuento,
    iva,
    total: redondear(subtotalConDescuento + iva),
    textos: SEMILLA.textosCotizacion
  };
}

// --- Instalación ------------------------------------------------------------

function resumir(lista) {
  const total = lista.length;
  const instalados = lista.filter((m) => m.estatus === 'Instalado').length;
  const enInstalacion = lista.filter((m) => m.estatus === 'En instalación').length;
  const porcentaje = total ? Math.round(lista.reduce((s, m) => s + m.porcentaje, 0) / total) : 0;
  return { total, instalados, enInstalacion, porInstalar: total - instalados - enInstalacion, porcentaje };
}

// Por medio, plaza y tipo. Alpina se calcula con instalacionInicio y `ahora`; las demás usan datos fijos.
export function instalacion(estado, codigo, ahora = Date.now()) {
  const c = estado.campanas[codigo];
  const fija = campanaFija(codigo);
  if (!c || !fija) return null;
  const disponible = faseAlMenos(c.fase, 'Aceptada');
  let medios = [];
  if (fija.instalacionFija) {
    medios = fija.medios
      .filter((m) => fija.instalacionFija[m.id])
      .map((m) => ({ medio: m, ...fija.instalacionFija[m.id] }));
  } else if (disponible && c.instalacionInicio != null) {
    const si = mediosSi(estado, codigo);
    const plan = planInstalacion(si.map((m) => m.id), c.instalacionInicio);
    medios = si.map((m, i) => {
      const porcentaje = porcentajeEn(plan[i], ahora);
      return {
        medio: m,
        estatus: estatusDe(porcentaje),
        porcentaje,
        inicio: new Date(plan[i].inicio).toISOString(),
        fin: new Date(plan[i].fin).toISOString()
      };
    });
  }
  const filas = medios.map(({ medio: m, estatus, porcentaje, inicio, fin }) => ({
    medioId: m.id,
    tipo: m.tipo,
    plaza: m.plaza,
    clave: m.clave,
    nombre: m.nombre,
    formato: m.formato,
    direccion: m.direccion,
    inicio,
    fin,
    porcentaje,
    estatus
  }));
  const porPlaza = PLAZAS
    .map((plaza) => ({ plaza, nombre: NOMBRE_PLAZA[plaza], ...resumir(filas.filter((f) => f.plaza === plaza)) }))
    .filter((p) => p.total > 0);
  const porTipo = TIPOS
    .map((tipo) => ({ tipo, nombre: NOMBRE_TIPO[tipo], ...resumir(filas.filter((f) => f.tipo === tipo)) }))
    .filter((t) => t.total > 0);
  return {
    codigo,
    disponible,
    completa: filas.length > 0 && filas.every((f) => f.estatus === 'Instalado'),
    inicio: c.instalacionInicio,
    fin: c.instalacionFin,
    ...resumir(filas),
    medios: filas,
    porPlaza,
    porTipo
  };
}

// --- Reportes ---------------------------------------------------------------

export function reportes(estado, codigo) {
  const c = estado.campanas[codigo];
  if (!c) return null;
  const lista = c.reportes.map((r) => ({
    ...r,
    motivo: r.estado === 'publicado'
      ? null
      : r.tipo === 'inicial'
        ? 'Se publica al terminar la instalación.'
        : `Se publica el ${formatoFecha(r.publicacion)}.`
  }));
  return {
    disponible: faseAlMenos(c.fase, 'Instalada'),
    publicados: lista.filter((r) => r.estado === 'publicado').length,
    lista
  };
}

// --- Fases (Stepper) --------------------------------------------------------

// [{ clave, nombre, estado: 'activa' | 'consulta' | 'bloqueada', motivo, editable }]
// Propuesta: activa hasta aceptar (la selección se puede cambiar), luego consulta.
// Cotización: bloqueada hasta confirmar; activa hasta aceptar; luego consulta.
// Instalación: bloqueada hasta aceptar; activa mientras se instala; luego consulta.
// Reportes: bloqueada hasta terminar la instalación; luego activa.
// `editable` solo es true en Alpina (las demás campañas son de consulta).
export function fasesDeCampana(estado, codigo) {
  const c = estado.campanas[codigo];
  if (!c) return [];
  const n = nivelFase(c.fase);
  const flujo = codigo === CAMPANA_FLUJO;
  const pendientes = pendientesDe(estado, codigo);
  const fase = (clave, nombre, desde, hasta, motivo, conAcciones) => {
    const estadoFase = n < nivelFase(desde) ? 'bloqueada' : hasta && n >= nivelFase(hasta) ? 'consulta' : 'activa';
    return {
      clave,
      nombre,
      estado: estadoFase,
      motivo: estadoFase === 'bloqueada' ? motivo : null,
      editable: flujo && conAcciones && estadoFase === 'activa'
    };
  };
  let motivoCotizacion = 'Confirma tu selección de medios para ver la cotización.';
  if (pendientes === 1) motivoCotizacion = 'Falta responder 1 medio. Responde todos y confirma tu selección para ver la cotización.';
  else if (pendientes > 1) motivoCotizacion = `Faltan ${pendientes} medios por responder. Responde todos y confirma tu selección para ver la cotización.`;
  const motivoReportes = n < nivelFase('Aceptada')
    ? 'Los reportes se publican cuando aceptes la cotización y termine la instalación.'
    : 'El reporte fotográfico inicial se publica al terminar la instalación.';
  return [
    fase('propuesta', 'Propuesta', 'Propuesta lista', 'Aceptada', null, true),
    fase('cotizacion', 'Cotización', 'Selección confirmada', 'Aceptada', motivoCotizacion, true),
    fase('instalacion', 'Instalación', 'Aceptada', 'Instalada', 'Acepta la cotización para iniciar la instalación.', false),
    fase('reportes', 'Reportes', 'Instalada', null, motivoReportes, false)
  ];
}

// --- Mis campañas -----------------------------------------------------------

export function resumenCampana(estado, codigo, ahora = Date.now()) {
  const fija = campanaFija(codigo);
  const c = estado.campanas[codigo];
  if (!fija || !c) return null;
  const prop = progresoPropuesta(estado, codigo);
  const inst = instalacion(estado, codigo, ahora);
  const rep = reportes(estado, codigo);
  return {
    codigo,
    nombre: fija.nombre,
    inicio: fija.inicio,
    fin: fija.fin,
    fase: c.fase,
    flujo: fija.flujo,
    medios: prop.total,
    respondidos: prop.respondidos,
    incluidos: prop.si,
    instalados: inst.instalados,
    mediosInstalacion: inst.total,
    porcentajeInstalacion: inst.porcentaje,
    reportesPublicados: rep.publicados,
    accionPendiente: FASES_ACCION_CLIENTE.includes(c.fase)
  };
}

// activas: campañas cuya vigencia no ha terminado (fin ≥ hoy).
// conAccionPendiente: campañas en Propuesta lista, En selección o Cotización lista.
// mediosInstalados: suma de medios instalados de todas las campañas.
export function indicadores(estado, ahora = Date.now()) {
  const hoy = fechaLocal(ahora);
  const resumenes = SEMILLA.campanas.map((c) => resumenCampana(estado, c.codigo, ahora)).filter(Boolean);
  return {
    totalCampanas: resumenes.length,
    activas: resumenes.filter((r) => r.fin >= hoy).length,
    conAccionPendiente: resumenes.filter((r) => r.accionPendiente).length,
    mediosInstalados: resumenes.reduce((s, r) => s + r.instalados, 0)
  };
}

export { FASES };

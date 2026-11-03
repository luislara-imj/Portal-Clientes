// Reglas del flujo: transiciones puras (estado → estado nuevo) y el reducer que las usa.
// Ninguna función muta el estado recibido. Si una acción no aplica, devuelve el MISMO objeto
// (así el Provider no re-renderiza ni guarda de más).
//
// Solo la campaña del flujo (Alpina) acepta acciones; en las demás todo se ignora.
// Fases: Propuesta lista → En selección (primer medio seleccionado) → Selección confirmada → Cotización lista
//        → Aceptada → En instalación → Instalada → En reporte.
// Cada medio está seleccionado ('si') o no seleccionado ('no'); sin valor guardado cuenta como 'no'.
// Si después se deseleccionan todos, la fase se queda en "En selección" (no regresa a "Propuesta lista").
// "Selección confirmada" e "Instalada" son pasos de paso: confirmar deja la campaña en "Cotización lista"
// y terminar la instalación la deja en "En reporte" (con el reporte inicial ya publicado).
//
// Cambios tras confirmar: la selección sigue editable hasta aceptar. Si cambia una respuesta, la cotización
// se recalcula sola (se deriva de las respuestas), la fase queda en "Cotización lista" y se marca
// `cotizacionActualizada: true` para que la UI muestre el aviso. No hace falta volver a confirmar.
// El aviso se limpia al aceptar la cotización.

import { CAMPANA_FLUJO, CLIENTE, campanaFija, estadoInicial } from '../data/semilla.js';
import { fechaLocal } from '../data/fechas.js';
import { PLANTILLAS_REPORTE, URL_DRIVE_ARTES, nombreCarpetaDrive } from '../data/catalogos.js';
import { finDelPlan, planInstalacion } from './instalacion.js';

export const FASES = [
  'Propuesta lista',
  'En selección',
  'Selección confirmada',
  'Cotización lista',
  'Aceptada',
  'En instalación',
  'Instalada',
  'En reporte'
];

export const nivelFase = (fase) => FASES.indexOf(fase);
export const faseAlMenos = (fase, minima) => nivelFase(fase) >= nivelFase(minima);

const VALORES = ['si', 'no'];

// Valor efectivo de un medio: solo 'si' cuenta como seleccionado; vacío u otro valor es 'no'.
export const valorDe = (respuestas, id) => (respuestas?.[id] === 'si' ? 'si' : 'no');

function conCampana(estado, codigo, cambios) {
  return {
    ...estado,
    campanas: { ...estado.campanas, [codigo]: { ...estado.campanas[codigo], ...cambios } }
  };
}

// La selección se puede editar en Alpina mientras no se acepte la cotización.
export function seleccionEditable(estado, codigo) {
  const c = estado.campanas[codigo];
  return codigo === CAMPANA_FLUJO && !!c && nivelFase(c.fase) < nivelFase('Aceptada');
}

// Medios Sí en el orden de la propuesta.
export function mediosSi(estado, codigo) {
  const fija = campanaFija(codigo);
  const resp = estado.campanas[codigo]?.respuestas || {};
  return fija ? fija.medios.filter((m) => resp[m.id] === 'si') : [];
}

function aplicarRespuestas(estado, codigo, ids, valor) {
  if (!seleccionEditable(estado, codigo) || !VALORES.includes(valor)) return estado;
  const fija = campanaFija(codigo);
  const validos = new Set(fija.medios.map((m) => m.id));
  const c = estado.campanas[codigo];
  const respuestas = { ...c.respuestas };
  let cambio = false;
  for (const id of ids) {
    if (validos.has(id) && valorDe(respuestas, id) !== valor) {
      respuestas[id] = valor;
      cambio = true;
    }
  }
  if (!cambio) return estado;
  if (faseAlMenos(c.fase, 'Selección confirmada')) {
    return conCampana(estado, codigo, { respuestas, fase: 'Cotización lista', cotizacionActualizada: true });
  }
  const primerSi = c.fase === 'Propuesta lista' && Object.values(respuestas).includes('si');
  return conCampana(estado, codigo, primerSi ? { respuestas, fase: 'En selección' } : { respuestas });
}

export function responder(estado, codigo, medioId, valor) {
  return aplicarRespuestas(estado, codigo, [medioId], valor);
}

// filtro: { tipo?, plaza?, grupo?, solicitud? }; las claves ausentes no filtran.
export function responderTodos(estado, codigo, filtro = {}, valor) {
  const fija = campanaFija(codigo);
  if (!fija || !estado.campanas[codigo]) return estado;
  const f = filtro || {};
  const ids = fija.medios
    .filter((m) => (f.tipo == null || m.tipo === f.tipo)
      && (f.plaza == null || m.plaza === f.plaza)
      && (f.grupo == null || m.grupo === f.grupo)
      && (f.solicitud == null || m.solicitud === f.solicitud))
    .map((m) => m.id);
  return aplicarRespuestas(estado, codigo, ids, valor);
}

// Solo con al menos un medio seleccionado. Deja la campaña en "Cotización lista".
export function confirmarSeleccion(estado, codigo, ahora = Date.now()) {
  if (!seleccionEditable(estado, codigo)) return estado;
  const c = estado.campanas[codigo];
  if (faseAlMenos(c.fase, 'Selección confirmada')) return estado;
  if (mediosSi(estado, codigo).length === 0) return estado;
  return conCampana(estado, codigo, { fase: 'Cotización lista', confirmadaEn: ahora, cotizacionActualizada: false });
}

// Requiere la cotización lista y al menos un medio Sí. Arranca la instalación simulada.
export function aceptarCotizacion(estado, codigo, ahora = Date.now()) {
  if (codigo !== CAMPANA_FLUJO) return estado;
  const c = estado.campanas[codigo];
  if (!c || !['Selección confirmada', 'Cotización lista'].includes(c.fase)) return estado;
  const ids = mediosSi(estado, codigo).map((m) => m.id);
  if (ids.length === 0) return estado;
  return conCampana(estado, codigo, {
    fase: 'Aceptada',
    aceptadaEn: ahora,
    instalacionInicio: ahora,
    instalacionFin: finDelPlan(planInstalacion(ids, ahora), ahora),
    cotizacionActualizada: false
  });
}

// Recalcula la fase y los reportes de Alpina según el tiempo:
// - pasa a "En instalación" en cuanto corre el tiempo tras aceptar;
// - al terminar la instalación: "Instalada", publica el reporte inicial (fecha = fin) y pasa a "En reporte";
// - con la instalación terminada, publica cada reporte mensual y el final cuando la fecha local llega a su publicación.
export function avanzar(estado, ahora = Date.now()) {
  const codigo = CAMPANA_FLUJO;
  const c = estado.campanas[codigo];
  if (!c || c.instalacionInicio == null || !faseAlMenos(c.fase, 'Aceptada')) return estado;
  let fase = c.fase;
  let reportes = c.reportes;
  let cambio = false;

  if (fase === 'Aceptada' && ahora > c.instalacionInicio) {
    fase = 'En instalación';
    cambio = true;
  }
  if (nivelFase(fase) < nivelFase('Instalada') && ahora >= c.instalacionFin) {
    fase = 'Instalada';
    reportes = reportes.map((r) => (r.tipo === 'inicial' && r.estado !== 'publicado'
      ? { ...r, estado: 'publicado', publicadoEn: c.instalacionFin, publicacion: fechaLocal(c.instalacionFin) }
      : r));
    fase = 'En reporte';
    cambio = true;
  }
  if (faseAlMenos(fase, 'Instalada')) {
    const hoy = fechaLocal(ahora);
    const toca = (r) => (r.tipo === 'mensual' || r.tipo === 'final') && r.estado !== 'publicado' && hoy >= r.publicacion;
    if (reportes.some(toca)) {
      reportes = reportes.map((r) => (toca(r)
        ? { ...r, estado: 'publicado', publicadoEn: ahora }
        : r));
      cambio = true;
    }
  }
  if (!cambio) return estado;
  return conCampana(estado, codigo, { fase, reportes });
}

export function reiniciar() {
  return estadoInicial();
}

// Archivos de la campaña (imagen, Illustrator, Photoshop). Se pueden subir en cualquier fase
// y en cualquier campaña; el prototipo solo guarda los datos del archivo, no su contenido.
export function agregarArchivo(estado, codigo, archivo) {
  const c = estado.campanas[codigo];
  if (!c || !archivo?.id) return estado;
  const archivos = c.archivos ?? [];
  if (archivos.some((a) => a.id === archivo.id)) return estado;
  return conCampana(estado, codigo, { archivos: [...archivos, archivo] });
}

export function quitarArchivo(estado, codigo, archivoId) {
  const c = estado.campanas[codigo];
  if (!c) return estado;
  const archivos = (c.archivos ?? []).filter((a) => a.id !== archivoId);
  if (archivos.length === (c.archivos ?? []).length) return estado;
  return conCampana(estado, codigo, { archivos });
}

// Carpeta de artes en Google Drive (simulada). Se crea una sola vez por campaña; si ya existe no cambia nada.
// Nombre con la marca de la campaña (o el cliente si no tiene marca); la URL es la misma carpeta real para todas.
export function crearCarpetaDrive(estado, codigo, ahora = Date.now()) {
  const c = estado.campanas[codigo];
  if (!c || c.carpetaDrive) return estado;
  const marca = campanaFija(codigo)?.marca || CLIENTE.empresa;
  return conCampana(estado, codigo, {
    carpetaDrive: { nombre: nombreCarpetaDrive(marca, codigo), url: URL_DRIVE_ARTES, creadaEn: ahora }
  });
}

// Plantilla de reporte de la campaña (catálogo fijo). Vale en cualquier campaña; ids desconocidos se ignoran.
export function elegirPlantilla(estado, codigo, plantillaId) {
  const c = estado.campanas[codigo];
  if (!c || !PLANTILLAS_REPORTE.some((p) => p.id === plantillaId)) return estado;
  if (c.plantilla === plantillaId) return estado;
  return conCampana(estado, codigo, { plantilla: plantillaId });
}

export function reducer(estado, accion) {
  switch (accion?.type) {
    case 'responder':
      return responder(estado, accion.codigo, accion.medioId, accion.valor);
    case 'responderTodos':
      return responderTodos(estado, accion.codigo, accion.filtro, accion.valor);
    case 'confirmarSeleccion':
      return confirmarSeleccion(estado, accion.codigo, accion.ahora);
    case 'aceptarCotizacion':
      return aceptarCotizacion(estado, accion.codigo, accion.ahora);
    case 'avanzar':
      return avanzar(estado, accion.ahora);
    case 'agregarArchivo':
      return agregarArchivo(estado, accion.codigo, accion.archivo);
    case 'quitarArchivo':
      return quitarArchivo(estado, accion.codigo, accion.archivoId);
    case 'crearCarpetaDrive':
      return crearCarpetaDrive(estado, accion.codigo, accion.ahora);
    case 'elegirPlantilla':
      return elegirPlantilla(estado, accion.codigo, accion.plantillaId);
    case 'reiniciar':
      return reiniciar();
    default:
      return estado;
  }
}

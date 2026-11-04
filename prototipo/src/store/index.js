export { StoreProvider, useStore } from './StoreProvider.jsx';
export {
  FASES, nivelFase, faseAlMenos, reducer, responder, responderTodos, confirmarSeleccion,
  aceptarCotizacion, avanzar, reiniciar, seleccionEditable, mediosSi
} from './reglas.js';
export {
  FASES_ACCION_CLIENTE, cotizacion, fasesDeCampana, indicadores, instalacion, progresoPropuesta, reportes, resumenCampana, redondear
} from './selectores.js';
export { CLAVE_ALMACEN, cargarEstado, guardarEstado, esEstadoValido } from './persistencia.js';
export {
  DURACION_INSTALACION_MS, DURACION_MEDIO_MS, VENTANA_ARRANQUE_MS, planInstalacion, porcentajeEn, estatusDe
} from './instalacion.js';
export { formatoMXN, formatoFecha } from './formato.js';

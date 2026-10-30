// Ayudas compartidas por las pantallas de campaña: rutas, color del Badge de fase,
// vigencia y próxima acción. Solo leen datos del store (resumenCampana).

import { formatoFecha } from '../store/index.js';

// Fases del Stepper (claves de fasesDeCampana) → segmento de ruta.
export const FASES_CAMPANA = ['propuesta', 'cotizacion', 'instalacion', 'reportes'];

// '#/campanas/:codigo' o '#/campanas/:codigo/:fase' (para href).
export function hrefCampana(codigo, fase) {
  return `#${rutaCampana(codigo, fase)}`;
}

// '/campanas/:codigo' o '/campanas/:codigo/:fase' (para navigate()).
export function rutaCampana(codigo, fase) {
  const base = `/campanas/${encodeURIComponent(codigo)}`;
  return fase ? `${base}/${fase}` : base;
}

// Badge de la fase (estado) de la campaña. Siempre con ícono y texto, nunca solo color.
const BADGE_FASE = {
  'Propuesta lista': { color: 'warning', icon: 'warning' },
  'En selección': { color: 'warning', icon: 'warning' },
  'Selección confirmada': { color: 'accent', icon: 'check' },
  'Cotización lista': { color: 'warning', icon: 'warning' },
  Aceptada: { color: 'accent', icon: 'check' },
  'En instalación': { color: 'info', icon: 'info' },
  Instalada: { color: 'success', icon: 'success' },
  'En reporte': { color: 'success', icon: 'success' }
};

export function badgeDeFase(fase) {
  return BADGE_FASE[fase] || { color: 'gray', icon: 'info' };
}

export function vigencia(inicio, fin) {
  return `${formatoFecha(inicio)} – ${formatoFecha(fin)}`;
}

// Próxima acción según la fase: { texto, boton, fase (ruta), pendiente }.
// `resumen` = resumenCampana(codigo) del store.
export function proximaAccion(resumen) {
  const { fase, medios, respondidos, instalados, mediosInstalacion, reportesPublicados, accionPendiente } = resumen;
  const pendiente = accionPendiente;
  if (fase === 'Propuesta lista') {
    return { pendiente, fase: 'propuesta', boton: 'Revisar propuesta', texto: `Revisa la propuesta y responde Sí o No en cada uno de los ${medios} medios.` };
  }
  if (fase === 'En selección') {
    const faltan = medios - respondidos;
    const texto = faltan === 0
      ? 'Ya respondiste todos los medios. Confirma tu selección para ver la cotización.'
      : faltan === 1
        ? 'Falta responder 1 medio de la propuesta. Después confirma tu selección.'
        : `Faltan ${faltan} medios por responder en la propuesta. Después confirma tu selección.`;
    return { pendiente, fase: 'propuesta', boton: 'Revisar propuesta', texto };
  }
  if (fase === 'Selección confirmada' || fase === 'Cotización lista') {
    return { pendiente, fase: 'cotizacion', boton: 'Revisar cotización', texto: 'Revisa la cotización y acéptala para arrancar la campaña.' };
  }
  if (fase === 'Aceptada' || fase === 'En instalación') {
    return {
      pendiente,
      fase: 'instalacion',
      boton: 'Ver instalación',
      texto: `OBP está instalando tus medios: ${instalados} de ${mediosInstalacion} instalados. No tienes nada pendiente.`
    };
  }
  return {
    pendiente,
    fase: 'reportes',
    boton: 'Ver reportes',
    texto: reportesPublicados === 1
      ? 'Tu campaña está al aire. Consulta el reporte publicado.'
      : `Tu campaña está al aire. Consulta los ${reportesPublicados} reportes publicados.`
  };
}

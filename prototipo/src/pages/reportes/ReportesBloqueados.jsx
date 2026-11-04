import { EstadoVacio } from '../../layout/EstadoVacio.jsx';

/**
 * Estado de Reportes o de un reporte que no se puede ver: bloqueado (aún no hay reportes), en espera
 * (reporte por publicarse) o no encontrado. Usa el estado vacío común del portal.
 * tono: bloqueado | espera | busqueda · accion: { label, onClick } opcional (p. ej. volver a reportes).
 */
export function ReportesBloqueados({ titulo = 'Tus reportes aún no están disponibles', motivo, accion, tono = 'bloqueado' }) {
  const icono = { bloqueado: 'chart-line', espera: 'hourglass', busqueda: 'compass' }[tono] ?? 'chart-line';
  return (
    <EstadoVacio
      tarjeta
      tamano="pagina"
      tono={tono}
      icono={icono}
      titulo={titulo}
      descripcion={motivo}
      acciones={accion ? [{ label: accion.label, icono: 'arrow-left', variant: 'secondary', onClick: accion.onClick }] : []}
      nota={tono === 'busqueda' ? undefined : 'Te avisaremos cuando haya un reporte nuevo para consultar.'}
    />
  );
}

export default ReportesBloqueados;

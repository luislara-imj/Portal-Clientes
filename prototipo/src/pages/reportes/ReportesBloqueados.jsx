import { Button, Card, Icon } from '../../orbita';

/**
 * Estado bloqueado de Reportes o de un reporte: Card con candado, título y motivo.
 * accion: { label, onClick } opcional (p. ej. volver a la lista de reportes).
 */
export function ReportesBloqueados({ titulo = 'Reportes bloqueados', motivo, accion }) {
  return (
    <Card as="section" padding="lg" className="rp-bloqueo" aria-labelledby="rp-bloqueo-t">
      <span className="rp-bloqueo__icono" aria-hidden="true">
        <Icon name="lock" size={24} />
      </span>
      <div className="pg-pila">
        <h2 id="rp-bloqueo-t" className="pg-subtitulo">{titulo}</h2>
        <p className="pg-texto">{motivo}</p>
        {accion && (
          <div className="pg-fila">
            <Button variant="secondary" size="sm" iconLeft="arrow-left" onClick={accion.onClick}>
              {accion.label}
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}

export default ReportesBloqueados;

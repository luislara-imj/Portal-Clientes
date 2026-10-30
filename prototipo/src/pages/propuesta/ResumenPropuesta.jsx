import { Button, ProgressBar } from '../../orbita';
import { formatoMXN } from '../../store/index.js';

function Dato({ etiqueta, children }) {
  return (
    <div className="pp-dato">
      <span className="pp-etiqueta">{etiqueta}</span>
      <span className="pp-monto">{children}</span>
    </div>
  );
}

const faltanTxt = (n) => (n === 1 ? 'Falta 1 medio por responder' : `Faltan ${n} medios por responder`);

/**
 * Resumen fijo de la propuesta (sticky bajo la barra superior): respondidos con ProgressBar,
 * medios incluidos, inversión de la selección y con descuento, y "Confirmar selección".
 * progreso = progresoPropuesta(codigo) · cot = cotizacion(codigo) · onConfirmar()
 */
export function ResumenPropuesta({ progreso, cot, onConfirmar }) {
  const { total, respondidos, pendientes, si, confirmada, editable, puedeConfirmar } = progreso;
  const pct = total ? (respondidos / total) * 100 : 0;

  let accion = null;
  if (confirmada) {
    accion = (
      <Button variant="primary" size="sm" iconLeft="check" disabled>
        Selección confirmada
      </Button>
    );
  } else if (editable) {
    accion = (
      <>
        <Button variant="primary" size="sm" disabled={!puedeConfirmar} onClick={onConfirmar}>
          Confirmar selección
        </Button>
        {pendientes > 0 && <span className="pp-etiqueta">{faltanTxt(pendientes)}</span>}
      </>
    );
  }

  return (
    <section className="pp-resumen" aria-label="Resumen de tu selección">
      <div className="pp-resumen__datos">
        <div className="pp-dato pp-dato--avance">
          <span className="pp-etiqueta">Respondidos</span>
          <span className="pp-monto" role="status">{respondidos} de {total}</span>
          <ProgressBar value={pct} size="xs" showPercentage={false} aria-label="Medios respondidos" />
        </div>
        <Dato etiqueta="Medios incluidos">{si}</Dato>
        <Dato etiqueta="Inversión de la selección">{formatoMXN(cot?.subtotal ?? 0)}</Dato>
        <Dato etiqueta="Con descuento">{formatoMXN(cot?.subtotalConDescuento ?? 0)}</Dato>
      </div>
      {accion && <div className="pp-resumen__accion">{accion}</div>}
    </section>
  );
}

export default ResumenPropuesta;

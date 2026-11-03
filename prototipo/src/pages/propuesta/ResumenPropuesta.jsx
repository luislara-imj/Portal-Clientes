import { Button, Icon, ProgressBar } from '../../orbita';
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
 * Tarjeta lateral "Propuesta de medios" (mismo estilo que Acciones pendientes de Mis campañas):
 * respondidos con ProgressBar, medios incluidos, inversión de la selección y con descuento,
 * y "Confirmar selección". Fija al desplazar en escritorio.
 * progreso = progresoPropuesta(codigo) · cot = cotizacion(codigo) · onConfirmar()
 */
export function ResumenPropuesta({ progreso, cot, onConfirmar }) {
  const { total, respondidos, pendientes, si, confirmada, editable, puedeConfirmar } = progreso;
  const pct = total ? (respondidos / total) * 100 : 0;

  let accion = null;
  if (confirmada) {
    accion = (
      <Button variant="primary" size="sm" iconLeft="check" fullWidth disabled>
        Selección confirmada
      </Button>
    );
  } else if (editable) {
    accion = (
      <>
        <Button variant="primary" size="sm" fullWidth disabled={!puedeConfirmar} onClick={onConfirmar}>
          Confirmar selección
        </Button>
        {pendientes > 0 && <span className="pp-etiqueta">{faltanTxt(pendientes)}</span>}
      </>
    );
  }

  return (
    <section className="mc-acciones pp-lateral" aria-labelledby="pp-titulo">
      <div className="mc-acciones-cabecera">
        <h2 id="pp-titulo" className="mc-acciones-titulo">
          <Icon name="megaphone" size={20} />
          Propuesta de medios
        </h2>
      </div>
      <div className="pp-lateral__datos">
        <div className="pp-dato pp-dato--avance">
          <span className="pp-etiqueta">Respondidos</span>
          <span className="pp-monto" role="status">{respondidos} de {total}</span>
          <ProgressBar value={pct} size="xs" showPercentage={false} aria-label="Medios respondidos" />
        </div>
        <Dato etiqueta="Medios incluidos">{si}</Dato>
        <Dato etiqueta="Inversión de la selección">{formatoMXN(cot?.subtotal ?? 0)}</Dato>
        <Dato etiqueta="Con descuento">{formatoMXN(cot?.subtotalConDescuento ?? 0)}</Dato>
      </div>
      {accion && <div className="pp-lateral__accion">{accion}</div>}
    </section>
  );
}

export default ResumenPropuesta;

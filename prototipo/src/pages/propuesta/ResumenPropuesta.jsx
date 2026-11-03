import { Button, Icon } from '../../orbita';
import { formatoMXN } from '../../store/index.js';

function Dato({ etiqueta, children }) {
  return (
    <div className="pp-dato">
      <span className="pp-etiqueta">{etiqueta}</span>
      <span className="pp-monto">{children}</span>
    </div>
  );
}

// Texto bajo "Confirmar selección" según cuántos medios hay seleccionados.
const textoSeleccion =(n) => {
  if (n === 0) return 'Selecciona los medios que quieres';
  return n === 1 ? '1 medio seleccionado. Confirma tu selección.' : `${n} medios seleccionados. Confirma tu selección.`;
};

/**
 * Tarjeta lateral "Propuesta de medios" (mismo estilo que Acciones pendientes de Mis campañas):
 * medios incluidos, inversión de la selección y con descuento, y "Confirmar selección"
 * (requiere al menos un medio seleccionado). Fija al desplazar en escritorio.
 * progreso = progresoPropuesta(codigo) · cot = cotizacion(codigo) · onConfirmar()
 */
export function ResumenPropuesta({ progreso, cot, onConfirmar, onIrCotizacion }) {
  const { si, confirmada, editable, puedeConfirmar } = progreso;

  let accion = null;
  if (confirmada) {
    accion = (
      <>
        <Button variant="primary" size="sm" iconLeft="check" fullWidth disabled>
          Selección confirmada
        </Button>
        <Button variant="secondary" size="sm" iconRight="chevron-right" fullWidth onClick={onIrCotizacion}>
          Ir a cotización
        </Button>
      </>
    );
  } else if (editable) {
    accion = (
      <>
        <Button variant="primary" size="sm" fullWidth disabled={!puedeConfirmar} onClick={onConfirmar}>
          Confirmar selección
        </Button>
        <span className="pp-etiqueta" role="status">{textoSeleccion(si)}</span>
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
        <Dato etiqueta="Medios incluidos">{si}</Dato>
        <Dato etiqueta="Inversión de la selección">{formatoMXN(cot?.subtotal ?? 0)}</Dato>
        <Dato etiqueta="Con descuento">{formatoMXN(cot?.subtotalConDescuento ?? 0)}</Dato>
      </div>
      {accion && <div className="pp-lateral__accion">{accion}</div>}
    </section>
  );
}

export default ResumenPropuesta;

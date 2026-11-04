import { Button, Icon, ProgressBar, cx } from '../../orbita';
import { NOMBRE_TIPO } from '../../data/catalogos.js';
import { formatoMXN } from '../../store/index.js';
import { ICONO_TIPO, compacto } from './DatosMedio.jsx';
import { totales } from './sumatoria.js';

// Texto bajo "Confirmar selección" según cuántos medios hay seleccionados.
const textoSeleccion = (n) => {
  if (n === 0) return 'Usa «Incluir» en los medios que quieres para tu campaña.';
  return n === 1 ? '1 medio incluido. Confirma tu selección.' : `${n} medios incluidos. Confirma tu selección.`;
};

/**
 * Tarjeta lateral "Tu selección" (mismo estilo que Acciones pendientes de Mis campañas): la sumatoria
 * de la hoja Resumen del Excel que se actualiza al incluir medios: avance, inversión con descuento,
 * impactos y una fila por tipo de medio (lleva a su pestaña). "Ver resumen completo" abre el drawer
 * con el detalle y el perfil de audiencia. "Confirmar selección" requiere al menos un medio.
 * progreso = progresoPropuesta(codigo) · resumen = resumenPorTipo(…) · tipoActivo · onIrTipo(tipo)
 * onVerResumen · onConfirmar · onIrCotizacion
 */
export function ResumenPropuesta({ progreso, resumen, tipoActivo, onIrTipo, onVerResumen, onConfirmar, onIrCotizacion }) {
  const { si, total, confirmada, editable, puedeConfirmar } = progreso;
  const t = totales(resumen);
  const ahorro = t.inversion - t.inversionConDescuento;

  let accion = null;
  if (confirmada) {
    accion = (
      <>
        <Button variant="primary" size="sm" iconLeft="check" fullWidth disabled className="pp-lateral__confirmada">
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
        <span className="pp-etiqueta pp-lateral__ayuda" role="status">{textoSeleccion(si)}</span>
      </>
    );
  }

  return (
    <section className="mc-acciones pp-lateral" aria-labelledby="pp-titulo">
      <div className="mc-acciones-cabecera">
        <h2 id="pp-titulo" className="mc-acciones-titulo">
          <Icon name="megaphone" size={20} />
          Tu selección
        </h2>
      </div>

      {/* Solo en celular: barra inferior compacta (cuenta, inversión y resumen completo). */}
      <div className="pp-lateral__movil">
        <div className="pp-lateral__movil-textos">
          <span className="pp-etiqueta">Tu selección · <strong>{si}</strong> de {total} medios</span>
          <span className="pp-lateral__movil-monto">{formatoMXN(t.inversionConDescuento)}</span>
        </div>
        <Button variant="secondary" size="sm" iconLeft="chart" onClick={onVerResumen}>
          Resumen
        </Button>
      </div>

      <div className="pp-lateral__cuerpo">
        <div className="pp-lateral__bloque">
          <div className="pp-lateral__fila">
            <span className="pp-etiqueta">Medios incluidos</span>
            <span className="pp-lateral__cuenta"><strong>{si}</strong> de {total}</span>
          </div>
          <ProgressBar value={total ? (si / total) * 100 : 0} size="xs" showPercentage={false} aria-label={`${si} de ${total} medios incluidos`} />
        </div>

        <div className="pp-lateral__bloque">
          <span className="pp-etiqueta">Inversión con descuento</span>
          <span className="pp-lateral__grande" aria-live="polite">{formatoMXN(t.inversionConDescuento)}</span>
          {ahorro > 0 && (
            <span className="pp-lateral__ahorro">
              <s>{formatoMXN(t.inversion)}</s> · Ahorras {formatoMXN(ahorro)}
            </span>
          )}
          <span className="pp-etiqueta">Toda la propuesta: {formatoMXN(t.inversionPropuesta)} · antes de IVA</span>
        </div>

        <div className="pp-lateral__kpis">
          <div className="pp-lateral__kpi">
            <span className="pp-etiqueta"><Icon name="users" size={10} /> Impactos</span>
            <strong title={t.impactos ? t.impactos.toLocaleString('es-MX') : undefined}>{t.impactos ? compacto(t.impactos) : '0'}</strong>
          </div>
          <div className="pp-lateral__kpi">
            <span className="pp-etiqueta"><Icon name="chart" size={10} /> Impactos totales</span>
            <strong title={t.impactosTotales ? t.impactosTotales.toLocaleString('es-MX') : undefined}>{t.impactosTotales ? compacto(t.impactosTotales) : '0'}</strong>
          </div>
        </div>

        <div className="pp-lateral__bloque">
          <span className="pp-etiqueta">Por tipo de medio</span>
          <ul className="pp-lateral__tipos">
            {resumen.map((r) => (
              <li key={r.tipo}>
                <button
                  type="button"
                  className={cx('pp-lateral__tipo', r.tipo === tipoActivo && 'is-activo', r.seleccion.medios > 0 && 'con-seleccion')}
                  onClick={() => onIrTipo(r.tipo)}
                  aria-current={r.tipo === tipoActivo ? 'true' : undefined}
                >
                  <span className="pp-lateral__tipo-icono" aria-hidden="true"><Icon name={ICONO_TIPO[r.tipo]} size={16} /></span>
                  <span className="pp-lateral__tipo-nombre">
                    {NOMBRE_TIPO[r.tipo]}
                    <small>{r.seleccion.medios} de {r.propuestos}</small>
                  </span>
                  <span className="pp-lateral__tipo-monto">{formatoMXN(r.seleccion.inversionConDescuento)}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <Button variant="tertiary" size="sm" iconLeft="chart" fullWidth onClick={onVerResumen}>
          Ver resumen completo
        </Button>
      </div>

      {accion && <div className="pp-lateral__accion">{accion}</div>}
    </section>
  );
}

export default ResumenPropuesta;

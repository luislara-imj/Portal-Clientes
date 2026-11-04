import { Button, Drawer, Icon } from '../../orbita';
import { NOMBRE_TIPO } from '../../data/catalogos.js';
import { EstadoVacio } from '../../layout/EstadoVacio.jsx';
import { formatoMXN } from '../../store/index.js';
import { ICONO_TIPO, Metrica, Metricas, PerfilAudiencia, Seccion, compacto, tieneMetricas } from './DatosMedio.jsx';
import { entero } from './formatos.js';
import { totales } from './sumatoria.js';

// Impactos de la fila: — si el tipo no tiene métricas; 0 si no hay medios elegidos.
function impactosDe(r) {
  if (!tieneMetricas(r.tipo)) return '—';
  return r.seleccion.medios ? entero(r.seleccion.impactos) : '0';
}

// En la tabla el MXN va en la descripción de la sección para que las cifras quepan.
const pesos = (v) => formatoMXN(v).replace(' MXN', '');

const mediosTxt = (n) => `${n} ${n === 1 ? 'medio' : 'medios'}`;

/**
 * Drawer "Resumen de tu selección": la hoja Resumen del Excel (una fila por tipo de medio con propuestos,
 * elegidos, impactos e inversión, y el total) más la sumatoria de cada tipo elegido con sus métricas y su
 * perfil de audiencia promedio. Se actualiza en vivo mientras el cliente incluye o quita medios.
 * open · onClose · resumen = resumenPorTipo(…) · puedeConfirmar · onConfirmar
 */
export function ResumenDetalle({ open, onClose, resumen, puedeConfirmar, onConfirmar }) {
  if (!open) return null;
  const t = totales(resumen);
  const elegidos = resumen.filter((r) => r.seleccion.medios > 0);

  const pie = puedeConfirmar ? (
    <div className="dm-pie">
      <div className="dm-pie__resumen">
        <span className="dm-etiqueta">{mediosTxt(t.medios)} · con descuento</span>
        <strong className="dm-pie__monto">{formatoMXN(t.inversionConDescuento)}</strong>
      </div>
      <Button variant="primary" size="md" iconLeft="check" onClick={onConfirmar}>
        Confirmar selección
      </Button>
    </div>
  ) : null;

  return (
    <Drawer
      open
      onClose={onClose}
      size="lg"
      icon="chart"
      title="Resumen de tu selección"
      subtitle="Se actualiza cada vez que incluyes o quitas un medio."
      closeLabel="Cerrar resumen"
      footer={pie}
      className="dm"
    >
      <div className="dm-contenido">
        <div className="dm-metricas">
          <Metrica icono="layers" etiqueta="Medios incluidos" valor={`${t.medios} de ${t.propuestos}`} />
          <Metrica icono="tag" etiqueta="Inversión con descuento" valor={formatoMXN(t.inversionConDescuento)} ayuda={`Antes de descuento: ${formatoMXN(t.inversion)}`} />
          <Metrica icono="users" etiqueta="Impactos" valor={t.impactos ? compacto(t.impactos) : '0'} completo={entero(t.impactos)} ayuda={`Impactos totales: ${t.impactosTotales ? compacto(t.impactosTotales) : '0'}`} />
        </div>

        <Seccion icono="layers" titulo="Por tipo de medio" descripcion="Precios en MXN, antes de IVA.">
          <div className="rd-tabla-contenedor">
            <table className="rd-tabla">
              <thead>
                <tr>
                  <th scope="col">Tipo de medio</th>
                  <th scope="col">Elegidos</th>
                  <th scope="col">Impactos</th>
                  <th scope="col">Inversión</th>
                  <th scope="col">Con descuento</th>
                  <th scope="col">Toda la propuesta</th>
                </tr>
              </thead>
              <tbody>
                {resumen.map((r) => (
                  <tr key={r.tipo} className={r.seleccion.medios > 0 ? 'con-seleccion' : undefined}>
                    <th scope="row">
                      <span className="rd-tipo"><Icon name={ICONO_TIPO[r.tipo]} size={16} /> {NOMBRE_TIPO[r.tipo]}</span>
                    </th>
                    <td>{r.seleccion.medios} de {r.propuestos}</td>
                    <td>{impactosDe(r)}</td>
                    <td>{pesos(r.seleccion.inversion)}</td>
                    <td><strong>{pesos(r.seleccion.inversionConDescuento)}</strong></td>
                    <td>{pesos(r.inversionPropuesta)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <th scope="row">Total</th>
                  <td>{t.medios} de {t.propuestos}</td>
                  <td>{t.impactos ? entero(t.impactos) : '0'}</td>
                  <td>{pesos(t.inversion)}</td>
                  <td><strong>{pesos(t.inversionConDescuento)}</strong></td>
                  <td>{pesos(t.inversionPropuesta)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </Seccion>

        {elegidos.length === 0 ? (
          <EstadoVacio
            tamano="compacto"
            icono="layers"
            titulo="Aún no incluyes medios"
            descripcion="Usa «Incluir» en cada medio que quieras y aquí verás la sumatoria de impactos, audiencia e inversión."
          />
        ) : (
          elegidos
            .filter((r) => tieneMetricas(r.tipo))
            .map((r) => (
              <Seccion
                key={r.tipo}
                icono={ICONO_TIPO[r.tipo]}
                titulo={`${NOMBRE_TIPO[r.tipo]} · ${mediosTxt(r.seleccion.medios)}`}
                descripcion="Impactos sumados; alcance, frecuencia, tiempo de exposición y perfil en promedio de los medios con dato."
              >
                <Metricas tipo={r.tipo} datos={r.seleccion} agregado />
                <PerfilAudiencia tipo={r.tipo} datos={r.seleccion} />
              </Seccion>
            ))
        )}

        <p className="rd-nota">
          «Sin dato» indica que la información aún no está cargada para ese medio. ¿Tienes dudas? Llama al 33 3640 0944 o 33 3640 6194, o escribe a tu asesor.
        </p>
      </div>
    </Drawer>
  );
}

export default ResumenDetalle;

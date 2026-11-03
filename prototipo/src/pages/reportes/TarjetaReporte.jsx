import { Badge, Button, Icon, ProgressBar } from '../../orbita';
import { fechaReporte } from './descargas.js';
import './descargas.css';

const ETIQUETA_TIPO = { inicial: 'Inicial', mensual: 'Mensual', final: 'Final' };

/**
 * Tarjeta de un reporte en el listado cronológico (componente "Report" de Figma, nodo 766:62376):
 * marca de línea de tiempo (check publicado / candado bloqueado), ícono de archivo, nombre,
 * Badge de tipo, fecha, avance y botón Descargar. Bloqueado: tarjeta atenuada y botón deshabilitado.
 * progreso: avance de una descarga en curso (0–100) o null · onDescargar: inicia la descarga.
 */
export function TarjetaReporte({ reporte, progreso = null, onDescargar }) {
  const publicado = reporte.estado === 'publicado';
  const descargando = progreso !== null;
  const idTitulo = `rd-rep-${reporte.id}`;
  const valor = descargando ? progreso : publicado ? 100 : 0;

  return (
    <li className={`rd-item${publicado ? '' : ' rd-item--bloqueado'}`}>
      <span className="rd-marca" aria-hidden="true">
        <Icon name={publicado ? 'check' : 'lock'} size={20} />
      </span>
      <article className="rd-reporte" aria-labelledby={idTitulo}>
        <span className="rd-reporte__icono" aria-hidden="true">
          <Icon name="file" size={16} />
        </span>
        <div className="rd-reporte__info">
          <div className="rd-reporte__cabeza">
            <h3 id={idTitulo} className="rd-reporte__titulo">{reporte.nombre}</h3>
            <Badge color="gray" theme="soft" size="sm" disabled={!publicado}>
              {ETIQUETA_TIPO[reporte.tipo] ?? reporte.tipo}
            </Badge>
          </div>
          <p className="rd-reporte__fecha">
            <Icon name="calendar" size={16} />
            <span>{fechaReporte(reporte)}</span>
          </p>
        </div>
        <div className="rd-reporte__pie">
          <ProgressBar
            className="rd-reporte__avance"
            value={valor}
            disabled={!publicado}
            compact
            aria-label={
              descargando ? `Descargando ${reporte.nombre}` : publicado ? 'Reporte publicado' : 'Reporte sin publicar'
            }
          />
          <Button
            variant="primary"
            size="sm"
            iconLeft="download"
            disabled={!publicado}
            loading={descargando}
            onClick={onDescargar}
            aria-describedby={idTitulo}
          >
            Descargar
          </Button>
        </div>
      </article>
    </li>
  );
}

export default TarjetaReporte;

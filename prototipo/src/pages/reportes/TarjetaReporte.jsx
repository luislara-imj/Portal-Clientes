import { Badge, Button, Icon, ProgressBar } from '../../orbita';
import { fechaCorta } from './datos.js';

const ETIQUETA_TIPO = { inicial: 'Inicial', mensual: 'Mensual' };

/**
 * Tarjeta de un reporte en el listado cronológico (componente "Report" de Figma, nodo 766:62376):
 * marca de línea de tiempo (check publicado / candado bloqueado), ícono, nombre, Badge de tipo,
 * fecha, avance y acciones. Bloqueado: candado, "Se publica el DD/MM/AAAA" y botones deshabilitados.
 */
export function TarjetaReporte({ reporte, onVer, onDescargar }) {
  const publicado = reporte.estado === 'publicado';
  const idTitulo = `rp-rep-${reporte.id}`;
  const fecha = publicado
    ? `Publicado el ${fechaCorta(reporte.publicacion ?? reporte.publicadoEn)}`
    : reporte.publicacion
      ? `Se publica el ${fechaCorta(reporte.publicacion)}`
      : 'Se publica al terminar la instalación';

  return (
    <li className={`rp-item${publicado ? '' : ' rp-item--bloqueado'}`}>
      <span className="rp-marca" aria-hidden="true">
        <Icon name={publicado ? 'check' : 'lock'} size={20} />
      </span>
      <article className="rp-reporte" aria-labelledby={idTitulo}>
        <span className="rp-reporte__icono" aria-hidden="true">
          <Icon name={publicado ? 'image' : 'lock'} size={20} />
        </span>
        <div className="rp-reporte__info">
          <div className="rp-reporte__cabeza">
            <h3 id={idTitulo} className="rp-reporte__titulo">{reporte.nombre}</h3>
            <Badge color="gray" theme="soft" size="sm" disabled={!publicado}>
              {ETIQUETA_TIPO[reporte.tipo] ?? reporte.tipo}
            </Badge>
          </div>
          <p className="rp-reporte__fecha">
            <Icon name={publicado ? 'calendar' : 'lock'} size={16} />
            <span>{fecha}</span>
          </p>
        </div>
        <ProgressBar
          className="rp-reporte__avance"
          value={publicado ? 100 : 0}
          disabled={!publicado}
          compact
          aria-label={publicado ? 'Reporte publicado' : 'Reporte sin publicar'}
        />
        <div className="rp-reporte__acciones">
          <Button variant="primary" size="sm" iconLeft="eye" disabled={!publicado} onClick={onVer}>
            Ver reporte
          </Button>
          <Button variant="secondary" size="sm" iconLeft="download" disabled={!publicado} onClick={onDescargar}>
            Descargar
          </Button>
        </div>
      </article>
    </li>
  );
}

export default TarjetaReporte;

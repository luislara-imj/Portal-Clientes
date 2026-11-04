import { Icon } from '../orbita';
import './arte-vacio.css';

/**
 * Lugar del arte de una campaña cuando aún no hay imagen (o no cargó): fondo de marca suave con el
 * pincel y el aviso. compacto: tarjetas chicas (solo ícono y título).
 */
export function ArteVacio({ compacto = false }) {
  return (
    <span className={compacto ? 'av av--compacto' : 'av'}>
      <span className="av-icono" aria-hidden="true"><Icon name="paintbrush" size={compacto ? 20 : 24} /></span>
      <span className="av-titulo">Arte por definir</span>
      {!compacto && <span className="av-texto">Aquí verás la imagen de tu campaña</span>}
    </span>
  );
}

export default ArteVacio;

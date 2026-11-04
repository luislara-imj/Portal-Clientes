import { Badge, Icon, Picture } from '../orbita';
import { ArteVacio } from './ArteVacio.jsx';
import { badgeDeFase } from './campanas.js';
import { vigenciaCorta } from './carpetas.js';
import { SeccionesCampana } from './SeccionesCampana.jsx';
import { EjecutivoCampana } from './EjecutivoCampana.jsx';
import './portada-campana.css';

/**
 * Portada de campaña única (flujo alterno): cuando la marca tiene una sola campaña se muestra esto en lugar
 * de la rejilla con una tarjeta. Es el modal de secciones en grande: arriba el arte 16:9 junto al estatus,
 * nombre, vigencia y el ejecutivo de IMJ responsable; abajo los 5 botones de secciones a todo el ancho. Cabe en la pantalla sin scroll.
 * c: { codigo?, nombre, fase, inicio, fin, arte } (campanasDeMarca) · onAbrirArtes(codigo)
 */
export function PortadaCampana({ c, onAbrirArtes }) {
  const badge = badgeDeFase(c.fase);
  return (
    <section className="pc" aria-labelledby="pc-nombre">
      {/* La zona mide el espacio libre; el arte se ajusta a 16:9 dentro de ella (container queries). */}
      <div className="pc-arte-zona">
        <div className="pc-arte">
          <Picture src={c.arte} radius="none" fill vacio={<ArteVacio />} />
        </div>
      </div>
      <div className="pc-cabecera">
        <Badge color={badge.color} theme="soft" icon={badge.icon}>{c.fase}</Badge>
        <h2 id="pc-nombre" className="pc-nombre">{c.nombre}</h2>
        <span className="pc-vigencia"><Icon name="calendar" size={16} /> {vigenciaCorta(c.inicio, c.fin)}</span>
        <div className="pc-ejecutivo"><EjecutivoCampana codigo={c.codigo} /></div>
        <p className="pc-pregunta">¿Qué quieres ver de tu campaña?</p>
      </div>
      <div className="pc-secciones">
        <SeccionesCampana c={c} grande onAbrirArtes={onAbrirArtes} />
      </div>
    </section>
  );
}

export default PortadaCampana;

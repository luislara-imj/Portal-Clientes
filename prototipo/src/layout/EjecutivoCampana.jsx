import { Icon, cx } from '../orbita';
import { ejecutivoDe, enlaceTelefono } from '../data/ejecutivos.js';
import './ejecutivo.css';

/**
 * Ejecutivo de IMJ responsable de la campaña: foto, nombre, puesto, correo y teléfono (enlaces para
 * escribir o llamar). compacto: versión de la tarjeta de campaña; si no, la de la portada.
 * codigo: código de la campaña (el responsable se toma de sus iniciales). Sin ejecutivo no pinta nada.
 */
export function EjecutivoCampana({ codigo, compacto = false }) {
  const e = ejecutivoDe(codigo);
  if (!e) return null;
  return (
    <div className={cx('ej', compacto && 'ej--compacto')}>
      <img className="ej-foto" src={e.foto} alt={`Foto de ${e.nombre}`} />
      <div className="ej-textos">
        <span className="ej-etiqueta">Tu ejecutivo IMJ</span>
        <strong className="ej-nombre">{e.nombre}</strong>
        {!compacto && <span className="ej-puesto">{e.puesto}</span>}
        <span className="ej-contacto">
          <a className="ej-enlace" href={`mailto:${e.correo}`} title={e.correo}>
            <Icon name="mail" size={10} />
            <span>{e.correo}</span>
          </a>
          <a className="ej-enlace" href={enlaceTelefono(e.telefono)} title={`Llamar a ${e.nombre}`}>
            <Icon name="phone" size={10} />
            <span>{e.telefono}</span>
          </a>
        </span>
      </div>
    </div>
  );
}

export default EjecutivoCampana;

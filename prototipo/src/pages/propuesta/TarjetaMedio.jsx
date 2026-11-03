import { Icon, Tag, cx } from '../../orbita';
import { NOMBRE_PLAZA } from '../../data/catalogos.js';
import { IlustracionMedio } from './IlustracionMedio.jsx';
import { claveDe, esUnidad, precio } from './formatos.js';
import '../../layout/carpetas.css';

/**
 * Tarjeta de un medio en la propuesta, con la misma forma que la tarjeta de campaña (cp-tarjeta):
 * ilustración 16:9, check de selección arriba a la derecha, clave completa y plaza (o nombre) a la
 * izquierda y el precio con descuento en un Tag de marca a la derecha (solo visual).
 * La tarjeta entera es la respuesta (role="checkbox"): sin responder o No → clic → Sí; Sí → clic → No.
 * Enter y Espacio alternan igual que el clic. Vallas y brand riders no tienen clave: la numeración
 * hace de clave y se muestra la plaza. readOnly: fase en consulta (muestra la respuesta sin cambiarla).
 */
export function TarjetaMedio({ medio, valor, onResponder, readOnly }) {
  const unidad = esUnidad(medio);
  const clave = claveDe(medio);
  const plaza = unidad ? NOMBRE_PLAZA[medio.plaza] : medio.nombre;
  const esSi = valor === 'si';
  const monto = precio(medio.precioDescuento);

  const alternar = () => {
    if (readOnly) return;
    onResponder?.(medio.id, esSi ? 'no' : 'si');
  };

  const alTeclear = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      alternar();
    }
  };

  return (
    <div
      className={cx(
        'cp-tarjeta',
        'pp-tarjeta',
        esSi && 'pp-tarjeta--si',
        readOnly ? 'pp-tarjeta--lectura' : 'pp-tarjeta--interactiva'
      )}
      role="checkbox"
      aria-checked={esSi ? 'true' : 'false'}
      aria-readonly={readOnly || undefined}
      aria-label={`${clave} · ${plaza ?? ''}`}
      tabIndex={readOnly ? -1 : 0}
      onClick={alternar}
      onKeyDown={alTeclear}
    >
      <div className="cp-tarjeta-imagen pp-tarjeta-imagen">
        <IlustracionMedio medio={medio} />
        <Tag color="accent" className="pp-tarjeta-precio" title={`Precio con descuento: ${monto}`}>
          {monto}
        </Tag>
        {esSi && (
          <span className="pp-tarjeta-check" aria-hidden="true">
            <Icon name="check" size={12} />
          </span>
        )}
      </div>
      <div className="cp-tarjeta-cuerpo">
        <p className="cp-tarjeta-nombre pp-tarjeta-clave" title={clave}>{clave}</p>
        <p className="cp-tarjeta-fecha pp-tarjeta-plaza" title={plaza}>
          <span className="pp-tarjeta-plaza-texto">{plaza}</span>
        </p>
      </div>
    </div>
  );
}

export default TarjetaMedio;

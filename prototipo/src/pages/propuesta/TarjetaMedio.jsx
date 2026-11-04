import { Button, Icon, Tag, cx } from '../../orbita';
import { NOMBRE_PLAZA } from '../../data/catalogos.js';
import { IlustracionMedio } from './IlustracionMedio.jsx';
import { compacto } from './DatosMedio.jsx';
import { claveDe, esUnidad, precio, sinValor } from './formatos.js';
import '../../layout/carpetas.css';

// Respuesta siguiente al pulsar "Incluir": sin responder o No → Sí; Sí → No.
export const siguienteValor = (valor) => (valor === 'si' ? 'no' : 'si');

// Hasta tres datos clave por tipo de medio, para decidir sin abrir el detalle: [ícono, texto].
function datosClave(m) {
  const impactos = Number(m.impactos) > 0 ? ['users', `${compacto(m.impactos)} impactos`] : null;
  const lista = {
    sitios: [impactos, ['ruler', m.medida], ['lightbulb', m.iluminacion]],
    camiones: [impactos, ['bus', m.unidades > 1 ? `${m.unidades} camiones` : '1 camión'], ['route', m.direccion]],
    indoor: [impactos, ['building', m.inmueble]],
    vallas: [['ruler', m.medida], ['info', m.descripcion]],
    riders: [['info', m.descripcion]]
  }[m.tipo] || [];
  return lista.filter((d) => d && !sinValor(d[1]));
}

/**
 * Tarjeta de un medio en la propuesta: ilustración 16:9 con el precio con descuento, clave, nombre,
 * datos clave y dos acciones: "Incluir" (alterna la selección; aria-pressed) y "Ver detalles"
 * (abre el drawer con toda la información). La ilustración también abre el detalle.
 * Vallas y brand riders no tienen clave: la numeración hace de clave y se muestra la plaza.
 * readOnly: fase en consulta (muestra si está incluido, sin permitir cambiarlo).
 */
export function TarjetaMedio({ medio, valor, onResponder, onVerDetalles, readOnly }) {
  const unidad = esUnidad(medio);
  const clave = claveDe(medio);
  const nombre = unidad ? NOMBRE_PLAZA[medio.plaza] : medio.nombre;
  const esSi = valor === 'si';
  const monto = precio(medio.precioDescuento);
  const datos = datosClave(medio);
  const verDetalles = () => onVerDetalles?.(medio.id);

  return (
    <article
      className={cx('cp-tarjeta', 'pp-tarjeta', esSi && 'pp-tarjeta--si', readOnly && 'pp-tarjeta--lectura')}
      aria-label={`${clave}${esSi ? ', incluido' : ''}`}
    >
      <button type="button" className="cp-tarjeta-imagen pp-tarjeta-imagen" onClick={verDetalles} aria-label={`Ver detalles de ${clave}`}>
        <IlustracionMedio medio={medio} />
        <Tag color="accent" className="pp-tarjeta-precio" title={`Precio con descuento: ${monto}`}>
          {monto}
        </Tag>
        {esSi && (
          <span className="pp-tarjeta-check" aria-hidden="true">
            <Icon name="check" size={12} />
          </span>
        )}
        <span className="pp-tarjeta-ver" aria-hidden="true">
          <Icon name="eye" size={16} /> Ver detalles
        </span>
      </button>
      <div className="pp-tarjeta-cuerpo">
        <p className="pp-tarjeta-clave" title={clave}>{clave}</p>
        <p className="pp-tarjeta-nombre" title={nombre}>{nombre}</p>
        {datos.length > 0 && (
          <ul className="pp-tarjeta-datos">
            {datos.map(([icono, texto]) => (
              <li key={icono} title={String(texto)}>
                <Icon name={icono} size={10} />
                <span>{texto}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="pp-tarjeta-acciones">
        {readOnly ? (
          <span className={cx('pp-tarjeta-estado', esSi && 'pp-tarjeta-estado--si')}>
            <Icon name={esSi ? 'success' : 'minus'} size={16} />
            {esSi ? 'Incluido' : 'No incluido'}
          </span>
        ) : (
          <Button
            variant={esSi ? 'primary' : 'secondary'}
            size="sm"
            iconLeft={esSi ? 'check' : 'plus'}
            aria-pressed={esSi}
            aria-label={`Incluir ${clave} en mi campaña`}
            title={esSi ? 'Quitar de mi campaña' : 'Incluir en mi campaña'}
            onClick={() => onResponder?.(medio.id, siguienteValor(valor))}
          >
            {esSi ? 'Incluido' : 'Incluir'}
          </Button>
        )}
        <Button variant="tertiary" size="sm" iconLeft="eye" onClick={verDetalles} aria-label={`Ver detalles de ${clave}`}>
          Detalles
        </Button>
      </div>
    </article>
  );
}

export default TarjetaMedio;

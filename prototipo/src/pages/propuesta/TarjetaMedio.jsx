import { MediaCard } from '../../orbita';
import { NOMBRE_PLAZA } from '../../data/catalogos.js';
import { SiNo } from './SiNo.jsx';
import { IlustracionMedio } from './IlustracionMedio.jsx';
import { claveDe, entero, esUnidad, periodo, precio } from './formatos.js';

/**
 * Tarjeta de un medio en la propuesta (MediaCard de Órbita): ilustración del tipo de medio, clave, nombre,
 * periodo inicio – fin, impactos, precio con descuento y Sí / No.
 * Vallas y brand riders no tienen clave: la numeración hace de clave y se muestra la plaza.
 */
export function TarjetaMedio({ medio, valor, onResponder, readOnly }) {
  const unidad = esUnidad(medio);
  const formats = [{ label: periodo(medio), icon: 'calendar' }];
  if (medio.impactos != null) {
    const v = entero(medio.impactos);
    formats.push({ label: v === 'Sin dato' ? 'Impactos: Sin dato' : `${v} impactos`, icon: 'eye' });
  }
  return (
    <MediaCard
      fluid
      className="pp-tarjeta"
      imageNode={<IlustracionMedio medio={medio} />}
      mediaKey={claveDe(medio)}
      plaza={unidad ? NOMBRE_PLAZA[medio.plaza] : medio.nombre}
      formats={formats}
      actions={(
        <div className="pp-tarjeta__pie">
          <div className="pp-tarjeta__precio">
            <span className="pp-etiqueta">Precio con descuento</span>
            <span className="pp-monto">{precio(medio.precioDescuento)}</span>
          </div>
          <SiNo medio={medio} valor={valor} onResponder={onResponder} readOnly={readOnly} />
        </div>
      )}
    />
  );
}

export default TarjetaMedio;

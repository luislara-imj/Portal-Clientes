import { Card, Picture } from '../../orbita';

function Campos({ filas }) {
  if (!filas.length) return null;
  return (
    <dl className="rp-campos">
      {filas.map(([etiqueta, valor]) => (
        <div key={etiqueta} className="rp-campo">
          <dt>{etiqueta}:</dt>
          <dd>{valor}</dd>
        </div>
      ))}
    </dl>
  );
}

/**
 * Ficha de un medio en el visor (página de medio del archivo de reporte de Figma, nodo 1479:94329):
 * campos de arriba, 3 fotos con pie, campos de abajo y franja con la clave.
 * ficha: resultado de fichaDe(); titulo: texto para lectores de pantalla.
 * onFoto(indice): abre el Lightbox en esa foto.
 */
export function FichaMedio({ ficha, titulo, onFoto }) {
  return (
    <Card as="li" padding="none" className="rp-ficha">
      <h4 className="ui-sr-only">{titulo}</h4>
      <div className="rp-ficha__cuerpo">
        <Campos filas={ficha.arriba} />
        <ul className="rp-fotos" aria-label={`Fotos de ${ficha.clave}`}>
          {ficha.pies.map((pie, i) => (
            <li key={pie}>
              <figure className="rp-foto">
                <Picture
                  ratio="16:9"
                  radius="sm"
                  alt={`${pie} de ${ficha.clave}`}
                  label={`Ampliar foto ${pie} de ${ficha.clave}`}
                  onClick={() => onFoto(i)}
                />
                <figcaption className="rp-foto__pie">{pie}</figcaption>
              </figure>
            </li>
          ))}
        </ul>
        <Campos filas={ficha.abajo} />
      </div>
      <p className="rp-ficha__franja">
        <strong>{ficha.etiquetaClave}</strong> <span>{ficha.clave}</span>
      </p>
    </Card>
  );
}

export default FichaMedio;

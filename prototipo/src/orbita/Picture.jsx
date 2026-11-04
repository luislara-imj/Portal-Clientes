import { useState } from 'react';
import { Icon } from './Icon.jsx';
import { cx } from './cx.js';
import './Picture.css';

/**
 * Picture de Órbita (§14.1).
 * src · alt · ratio: 1:1 | 16:9 · radius: none | sm | md | pill · shadow · stroke
 * Sin src: fondo bg/fill/tertiary con ícono `image` 32 (icon/disabled).
 * onClick: la imagen se vuelve botón (p. ej. abrir Lightbox; pasa `label`).
 * fill: ocupa el alto del contenedor en lugar de usar la proporción.
 * vacio: nodo que reemplaza el ícono cuando no hay imagen. Si la imagen no carga se muestra lo mismo.
 */
export function Picture({ src, alt = '', ratio = '16:9', radius = 'sm', shadow = false, stroke = false, onClick, label, fill = false, vacio, className }) {
  // Imagen rota: se recuerda qué src falló para mostrar el vacío en su lugar.
  const [fallida, setFallida] = useState(null);
  const mostrar = src && fallida !== src;
  const classes = cx(
    'ui-picture',
    `ui-picture--${ratio === '1:1' ? 'square' : 'wide'}`,
    `ui-picture--radius-${radius}`,
    shadow && 'ui-picture--shadow',
    stroke && 'ui-picture--stroke',
    fill && 'ui-picture--fill',
    onClick && 'ui-picture--button ui-focus-ring',
    className
  );
  const content = mostrar ? (
    <img className="ui-picture__img" src={src} alt={onClick ? '' : alt} onError={() => setFallida(src)} />
  ) : (
    <span className="ui-picture__empty" role={onClick || !alt ? undefined : 'img'} aria-label={onClick ? undefined : alt || undefined}>
      {vacio ?? <Icon name="image" size={32} />}
    </span>
  );
  if (onClick) {
    return (
      <button type="button" className={classes} onClick={onClick} aria-label={label ?? alt}>
        {content}
      </button>
    );
  }
  return <span className={classes}>{content}</span>;
}

export default Picture;

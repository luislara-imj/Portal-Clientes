import { cx } from './cx.js';
import './Card.css';

/**
 * Tarjeta genérica (PROTOTIPO_SPEC 6.1): superficie con radio 12, borde border/subtle y shadow-1.
 * as: etiqueta HTML (div, section, article, li…) · padding: none | sm (12) | md (16) | lg (24)
 * Para una tarjeta clicable usa onClick (se vuelve <button>) o href (<a>): suma foco de Órbita.
 */
export function Card({ as: Tag = 'div', padding = 'md', onClick, href, className, children, ...rest }) {
  const classes = cx('ui-card', `ui-card--pad-${padding}`, (onClick || href) && 'ui-card--interactive ui-focus-ring', className);
  if (href) {
    return (
      <a href={href} onClick={onClick} className={classes} {...rest}>
        {children}
      </a>
    );
  }
  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={classes} {...rest}>
        {children}
      </button>
    );
  }
  return (
    <Tag className={classes} {...rest}>
      {children}
    </Tag>
  );
}

export default Card;

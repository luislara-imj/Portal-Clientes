import { cx } from './cx.js';
import './Logo.css';

/**
 * Logo OBP (§17.1). No hay SVG exportado del set `OBP_logo` en el repositorio, así que se
 * muestra el texto "OBP" con la tipografía de Órbita y el color de texto del estilo `full`
 * (`text/primary`). Cuando exista el SVG, se reemplaza aquí sin tocar las pantallas.
 * size: sm (20), md (24, base de Figma), lg (32).
 */
export function Logo({ size = 'md', decorative = false, className }) {
  const a11y = decorative ? { 'aria-hidden': true } : { role: 'img', 'aria-label': 'OBP' };
  return (
    <span className={cx('ui-logo', `ui-logo--${size}`, className)} {...a11y}>
      OBP
    </span>
  );
}

export default Logo;

import { cx } from './cx.js';
import logoClaro from './logo/obp-full-light.svg';
import logoOscuro from './logo/obp-full-dark.svg';
import logoIcono from './logo/obp-icon.svg';
import './Logo.css';

/**
 * Logo OBP (§17.1), SVG exportado de Figma (archivo Logo, set `_obp`).
 * variant: full (marca + texto; versión clara u oscura según el tema) | icon (solo la marca).
 * size: sm | md | lg. Full: 24 / 32 / 48 px de alto. Icon: 20 / 24 / 32 px.
 */
export function Logo({ variant = 'full', size = 'md', decorative = false, className }) {
  const a11y = decorative ? { 'aria-hidden': true } : { role: 'img', 'aria-label': 'OBP' };
  return (
    <span className={cx('ui-logo', `ui-logo--${variant}`, `ui-logo--${size}`, className)} {...a11y}>
      {variant === 'icon' ? (
        <img className="ui-logo__img" src={logoIcono} alt="" />
      ) : (
        <>
          <img className="ui-logo__img ui-logo__claro" src={logoClaro} alt="" />
          <img className="ui-logo__img ui-logo__oscuro" src={logoOscuro} alt="" />
        </>
      )}
    </span>
  );
}

export default Logo;

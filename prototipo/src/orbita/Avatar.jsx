import { Icon } from './Icon.jsx';
import { cx } from './cx.js';
import './Avatar.css';

const GLYPH = { xxs: 10, xs: 16, sm: 20, md: 24, lg: 32, xl: 32 };
const STATUS_TEXT = { brand: 'Activo', success: 'Disponible', warning: 'Ausente', danger: 'Ocupado', disabled: 'Desconectado' };

export function initials(name = '') {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');
}

/**
 * Avatar de Órbita (§11.2).
 * name (nombre accesible e iniciales) · type: letter | icon | photo (src)
 * size: xxs | xs | sm | md | lg | xl (16 / 24 / 32 / 40 / 48 / 64)
 * color: blue | red | orange | yellow | lime | green | cyan | azure | violet | magenta | rose | disabled
 * theme: solid | soft · stroke · pill (false = radio 8)
 * status: brand | success | warning | danger | disabled; statusLabel lo describe (no depende del color).
 */
export function Avatar({
  name,
  type,
  src,
  size = 'sm',
  color = 'blue',
  theme = 'solid',
  stroke = false,
  pill = true,
  status,
  statusLabel,
  decorative = false,
  className,
}) {
  const kind = type ?? (src ? 'photo' : name ? 'letter' : 'icon');
  const statusText = status ? statusLabel ?? STATUS_TEXT[status] : null;
  const a11y = decorative
    ? { 'aria-hidden': true }
    : { role: 'img', 'aria-label': [name, statusText].filter(Boolean).join(', ') || 'Usuario' };
  return (
    <span
      className={cx(
        'ui-avatar',
        `ui-avatar--${size}`,
        `ui-avatar--${theme}-${color}`,
        stroke && 'ui-avatar--stroke',
        !pill && 'ui-avatar--square',
        className
      )}
      {...a11y}
    >
      {kind === 'photo' && <img className="ui-avatar__img" src={src} alt="" />}
      {kind === 'letter' && <span className="ui-avatar__letter">{initials(name)}</span>}
      {kind === 'icon' && <Icon name="user" size={GLYPH[size] ?? 20} />}
      {status && <span className={cx('ui-avatar__status', `ui-avatar__status--${status}`)} />}
    </span>
  );
}

export default Avatar;

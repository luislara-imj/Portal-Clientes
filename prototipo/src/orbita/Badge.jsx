import { Icon } from './Icon.jsx';
import { cx } from './cx.js';
import './Badge.css';

/**
 * Badge de Órbita (§2.1).
 * color: accent | gray | success | warning | danger | info · theme: soft | solid
 * type: default | num (contador) | dot · size: sm | md | lg (default) · stroke: borde 1 px
 * icon: nombre de Icon (10 px). Un `dot` necesita `label` para no depender solo del color.
 */
export function Badge({
  children,
  color = 'accent',
  theme = 'solid',
  type = 'default',
  size = 'md',
  stroke = false,
  icon,
  disabled = false,
  label,
  className,
  ...rest
}) {
  const classes = cx(
    'ui-badge',
    `ui-badge--${color}-${theme}`,
    `ui-badge--${type === 'default' ? size : type}`,
    stroke && 'ui-badge--stroke',
    disabled && `ui-badge--disabled-${theme}`,
    className
  );
  if (type === 'dot') {
    return (
      <span className={classes} {...rest}>
        {label && <span className="ui-sr-only">{label}</span>}
      </span>
    );
  }
  return (
    <span className={classes} {...rest}>
      {icon && <Icon name={icon} size={10} className="ui-badge__icon" />}
      <span className="ui-badge__label">{children}</span>
      {label && <span className="ui-sr-only">{label}</span>}
    </span>
  );
}

export default Badge;

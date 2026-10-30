import { Icon } from './Icon.jsx';
import { cx } from './cx.js';
import './Tag.css';

/**
 * Tag de Órbita (§2.2).
 * color: accent | gray | success | warning | danger | info
 * icon: ícono izquierdo (10) · avatar: url de imagen 16 × 16 (type=avatar)
 * onRemove: muestra el botón xmark ("Quitar …") · border: borde 1 px INSIDE · disabled
 * removeState: solo galería (hover | pressed | selected) para el botón xmark.
 */
export function Tag({
  children,
  color = 'accent',
  icon,
  avatar,
  onRemove,
  removeLabel,
  border = false,
  disabled = false,
  removeState,
  className,
  ...rest
}) {
  return (
    <span
      className={cx(
        'ui-tag',
        `ui-tag--${color}`,
        border && 'ui-tag--border',
        disabled && 'is-disabled',
        onRemove && 'ui-tag--removable',
        className
      )}
      {...rest}
    >
      <span className="ui-tag__content">
        {avatar ? (
          <img className="ui-tag__avatar" src={avatar} alt="" />
        ) : (
          icon && <Icon name={icon} size={10} className="ui-tag__icon" />
        )}
        <span className="ui-tag__label">{children}</span>
        {onRemove && (
          <button
            type="button"
            className="ui-tag__remove ui-touch"
            aria-label={removeLabel ?? `Quitar ${typeof children === 'string' ? children : ''}`.trim()}
            onClick={onRemove}
            disabled={disabled}
            data-state={removeState}
          >
            <Icon name="x" size={10} />
          </button>
        )}
      </span>
    </span>
  );
}

export default Tag;

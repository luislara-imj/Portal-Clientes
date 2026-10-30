import { useId } from 'react';
import { Icon } from './Icon.jsx';
import { cx } from './cx.js';
import './Toogle.css';

/**
 * Toogle de Órbita (§12.5): interruptor encendido/apagado (role="switch").
 * checked · onChange(checked) · label · labelPosition: left | right | none
 * icon: ícono a la izquierda del texto · stroke: borde 1 px en la pista · disabled
 * state="focus": solo galería.
 */
export function Toogle({
  checked = false,
  onChange,
  label,
  labelPosition = 'right',
  icon,
  stroke = false,
  disabled = false,
  state,
  className,
  'aria-label': ariaLabel,
}) {
  const id = useId();
  const showLabel = label && labelPosition !== 'none';
  const text = showLabel && (
    <label htmlFor={id} className="ui-toogle__label">
      {icon && <Icon name={icon} size={16} className="ui-toogle__icon" />}
      {label}
    </label>
  );
  return (
    <span className={cx('ui-toogle', disabled && 'is-disabled', className)}>
      {labelPosition === 'left' && text}
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={showLabel ? undefined : ariaLabel ?? label}
        disabled={disabled}
        data-state={state}
        className={cx('ui-toogle__track', 'ui-touch', checked && 'is-on', stroke && 'ui-toogle__track--stroke')}
        onClick={() => onChange?.(!checked)}
      >
        <span className="ui-toogle__knob" aria-hidden="true" />
      </button>
      {labelPosition === 'right' && text}
    </span>
  );
}

export default Toogle;

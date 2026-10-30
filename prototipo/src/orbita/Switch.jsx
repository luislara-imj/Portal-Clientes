import { useRef } from 'react';
import { Icon } from './Icon.jsx';
import { Spinner } from './Spinner.jsx';
import { cx } from './cx.js';
import './Switch.css';

/**
 * Switch de Órbita = control segmentado (§12.4). Grupo de opciones excluyentes (radiogroup).
 * options: [{ value, label, icon? }] · value: valor elegido o null (estado vacío: nada seleccionado)
 * onChange(value) · size: sm | md · disabled · loading · label (nombre accesible del grupo)
 * readOnly: muestra la elección con los estados normales pero no permite cambiarla (fases en consulta).
 * Teclado: Tab entra al grupo; flechas mueven y eligen; Espacio/Enter elige.
 */
export function Switch({
  options,
  value = null,
  onChange,
  size = 'sm',
  disabled = false,
  loading = false,
  readOnly = false,
  label,
  labelledBy,
  className,
}) {
  const refs = useRef([]);
  const selectedIndex = options.findIndex((o) => o.value === value);
  const focusIndex = selectedIndex >= 0 ? selectedIndex : 0;
  const inactive = disabled || loading || readOnly;

  const choose = (i) => {
    if (inactive) return;
    const opt = options[i];
    if (opt && opt.value !== value) onChange?.(opt.value);
  };

  const onKeyDown = (e, i) => {
    let next = null;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = (i + 1) % options.length;
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = (i - 1 + options.length) % options.length;
    if (e.key === 'Home') next = 0;
    if (e.key === 'End') next = options.length - 1;
    if (next !== null) {
      e.preventDefault();
      refs.current[next]?.focus();
      choose(next);
    }
  };

  const iconSize = size === 'md' ? 16 : 10;

  return (
    <div
      role="radiogroup"
      aria-label={label}
      aria-labelledby={labelledBy}
      aria-disabled={disabled || undefined}
      aria-busy={loading || undefined}
      aria-readonly={readOnly || undefined}
      className={cx(
        'ui-switch',
        `ui-switch--${size}`,
        disabled && 'is-disabled',
        loading && 'is-loading',
        readOnly && 'is-readonly',
        className
      )}
    >
      {options.map((opt, i) => {
        const checked = opt.value === value;
        return (
          <button
            key={String(opt.value)}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="button"
            role="radio"
            aria-checked={checked}
            tabIndex={i === focusIndex ? 0 : -1}
            disabled={disabled}
            className={cx('ui-switch__item', 'ui-touch-y', checked && 'is-selected')}
            onClick={() => choose(i)}
            onKeyDown={(e) => onKeyDown(e, i)}
          >
            {loading ? (
              <>
                <Spinner iconSize={iconSize} />
                <span className="ui-sr-only">{opt.label}</span>
              </>
            ) : (
              <>
                {opt.icon && <Icon name={opt.icon} size={iconSize} className="ui-switch__icon" />}
                <span>{opt.label}</span>
              </>
            )}
          </button>
        );
      })}
    </div>
  );
}

export default Switch;

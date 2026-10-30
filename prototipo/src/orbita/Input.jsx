import { forwardRef, useId, useState } from 'react';
import { Icon } from './Icon.jsx';
import { IconButton } from './IconButton.jsx';
import { Tooltip } from './Tooltip.jsx';
import { cx } from './cx.js';
import './Input.css';

/**
 * Input de texto de Órbita (§12.1).
 * label, helper (ayuda), error (texto: activa el estado Error y sustituye la ayuda)
 * info: texto del ícono `info-circle` junto al label (tooltip)
 * size: xs | sm | md | lg (32 / 36 / 40 / 48) · pill: none | xs | sm | lg | pill (por defecto sm, 6.1)
 * iconLeft / iconRight: nombres de Icon (16)
 * type="password": Icon button de ojo al final para mostrar u ocultar (6.1).
 * state="typing": solo galería, fuerza el aspecto con foco.
 */
export const Input = forwardRef(function Input(
  {
    label,
    hideLabel = false,
    helper,
    error,
    info,
    size = 'xs',
    pill = 'sm',
    iconLeft,
    iconRight,
    type = 'text',
    disabled = false,
    id: idProp,
    state,
    className,
    ...rest
  },
  ref
) {
  const autoId = useId();
  const id = idProp ?? `in-${autoId}`;
  const helperId = `${id}-help`;
  const [reveal, setReveal] = useState(false);
  const isPassword = type === 'password';
  const hasError = Boolean(error);
  const helperText = hasError ? error : helper;

  return (
    <div className={cx('ui-input', `ui-input--${size}`, hasError && 'is-error', disabled && 'is-disabled', className)}>
      {label && (
        <div className={cx('ui-input__label-row', hideLabel && 'ui-sr-only')}>
          <label className="ui-input__label" htmlFor={id}>
            {label}
          </label>
          {info && (
            <Tooltip label={info} placement="top">
              <span className="ui-input__info" tabIndex={0} role="img" aria-label={`Información: ${info}`}>
                <Icon name="info" size={10} />
              </span>
            </Tooltip>
          )}
        </div>
      )}
      <div className={cx('ui-input__field', `ui-radius--${pill}`)} data-state={state}>
        {iconLeft && (
          <span className="ui-input__icon-box">
            <Icon name={iconLeft} size={16} className="ui-input__icon" />
          </span>
        )}
        <input
          ref={ref}
          id={id}
          className="ui-input__control"
          type={isPassword && reveal ? 'text' : type}
          disabled={disabled}
          aria-invalid={hasError || undefined}
          aria-describedby={helperText ? helperId : undefined}
          {...rest}
        />
        {isPassword ? (
          <IconButton
            icon={reveal ? 'eye-slash' : 'eye'}
            label={reveal ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            variant="tertiary"
            size="xxs"
            iconSize={16}
            pill="xs"
            disabled={disabled}
            onClick={() => setReveal((v) => !v)}
            className="ui-input__reveal"
          />
        ) : (
          iconRight && (
            <span className="ui-input__icon-box">
              <Icon name={iconRight} size={16} className="ui-input__icon" />
            </span>
          )
        )}
      </div>
      {helperText && (
        <p id={helperId} className="ui-input__helper">
          {helperText}
        </p>
      )}
    </div>
  );
});

export default Input;

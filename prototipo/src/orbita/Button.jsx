import { forwardRef } from 'react';
import { Icon } from './Icon.jsx';
import { Spinner } from './Spinner.jsx';
import { cx } from './cx.js';
import './Button.css';

const ICON_SIZE = { xxs: 10, xs: 16, sm: 16, md: 16, lg: 16 };

/**
 * Button de Órbita (§1).
 * variant: primary | secondary | tertiary | destructive | ghost
 * size: xxs | xs | sm | md | lg (alto 20 / 32 / 36 / 40 / 48)
 * pill: none | xs | sm | md | lg | pill (por defecto sm = 8 px, PROTOTIPO_SPEC 6.1)
 * selected: estado "selected" (aria-pressed) · loading: oculta el label y muestra `loader`
 * badge: punto rojo de 12 px; badgeLabel lo anuncia a lectores de pantalla.
 * state: solo para la galería (hover | pressed | focus) fuerza el aspecto del estado.
 */
export const Button = forwardRef(function Button(
  {
    variant = 'primary',
    size = 'xs',
    pill = 'sm',
    iconLeft,
    iconRight,
    loading = false,
    disabled = false,
    selected,
    badge = false,
    badgeLabel,
    fullWidth = false,
    state,
    type = 'button',
    className,
    children,
    onClick,
    ...rest
  },
  ref
) {
  const iconSize = ICON_SIZE[size] ?? 16;
  const handleClick = (e) => {
    if (loading) {
      e.preventDefault();
      return;
    }
    onClick?.(e);
  };
  return (
    <button
      ref={ref}
      type={type}
      className={cx(
        'ui-button',
        `ui-button--${variant}`,
        `ui-button--${size}`,
        `ui-radius--${pill}`,
        selected && 'is-selected',
        loading && 'is-loading',
        fullWidth && 'ui-button--full',
        size !== 'md' && size !== 'lg' && 'ui-touch-y',
        'ui-focus-ring',
        className
      )}
      disabled={disabled}
      aria-disabled={loading || undefined}
      aria-busy={loading || undefined}
      aria-pressed={selected === undefined ? undefined : selected}
      data-state={state}
      onClick={handleClick}
      {...rest}
    >
      {loading ? (
        <>
          <Spinner iconSize={iconSize} />
          <span className="ui-sr-only">{children}</span>
        </>
      ) : (
        <span className="ui-button__content">
          {iconLeft && <Icon name={iconLeft} size={iconSize} className="ui-button__icon" />}
          {children != null && <span className="ui-button__label">{children}</span>}
          {badge && (
            <span className="ui-button__badge">
              {badgeLabel && <span className="ui-sr-only">{badgeLabel}</span>}
            </span>
          )}
          {iconRight && <Icon name={iconRight} size={iconSize} className="ui-button__icon" />}
        </span>
      )}
    </button>
  );
});

export default Button;

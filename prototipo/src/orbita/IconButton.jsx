import { forwardRef } from 'react';
import { Icon } from './Icon.jsx';
import { Spinner } from './Spinner.jsx';
import { Tooltip } from './Tooltip.jsx';
import { cx } from './cx.js';
import './IconButton.css';

const ICON_SIZE = { xxs: 10, xs: 16, sm: 16, md: 20, lg: 24 };

/**
 * Icon button de Órbita (§1.5).
 * variant: primary | secondary | tertiary | destructive | ghost ("gost brand" en Figma)
 * size: xxs | xs | sm | md | lg (20 / 32 / 36 / 40 / 48) · pill: none | xs | sm | md | lg | pill
 * label es obligatorio: nombre accesible y texto del tooltip (regla de la guía de íconos).
 * tooltip={false} lo omite (p. ej. cuando el contexto ya muestra el texto).
 */
export const IconButton = forwardRef(function IconButton(
  {
    icon,
    label,
    variant = 'secondary',
    size = 'xs',
    pill = 'sm',
    iconSize,
    selected,
    loading = false,
    disabled = false,
    badge = false,
    tooltip = true,
    tooltipPlacement = 'top',
    state,
    type = 'button',
    className,
    onClick,
    ...rest
  },
  ref
) {
  const glyph = iconSize ?? ICON_SIZE[size] ?? 16;
  const button = (
    <button
      ref={ref}
      type={type}
      aria-label={typeof badge === 'string' ? `${label} (${badge})` : label}
      className={cx(
        'ui-icon-button',
        `ui-icon-button--${variant}`,
        `ui-icon-button--${size}`,
        `ui-radius--${pill}`,
        selected && 'is-selected',
        loading && 'is-loading',
        size !== 'md' && size !== 'lg' && 'ui-touch',
        'ui-focus-ring',
        className
      )}
      disabled={disabled}
      aria-disabled={loading || undefined}
      aria-busy={loading || undefined}
      aria-pressed={selected === undefined ? undefined : selected}
      data-state={state}
      onClick={(e) => {
        if (loading) return;
        onClick?.(e);
      }}
      {...rest}
    >
      {loading ? <Spinner iconSize={glyph} /> : <Icon name={icon} size={glyph} />}
      {badge && (
        <span className="ui-icon-button__badge" aria-hidden="true" />
      )}
    </button>
  );
  if (!tooltip) return button;
  return (
    <Tooltip label={label} placement={tooltipPlacement} describe={false}>
      {button}
    </Tooltip>
  );
});

export default IconButton;

import { useId } from 'react';
import { IconButton } from './IconButton.jsx';
import { cx } from './cx.js';
import './ProgressBar.css';

/**
 * Progress bar de Órbita (§10).
 * value 0–100 · color: brand | success | danger | neutro · size: xxs | xs | sm | md | lg
 * label · showPercentage · eta ("1m restante") · helper · onClose · compact · disabled
 * Sin label visible pasa `aria-label`.
 */
export function ProgressBar({
  value = 0,
  color = 'brand',
  size = 'xxs',
  label,
  showPercentage = true,
  eta,
  helper,
  onClose,
  compact = false,
  disabled = false,
  className,
  'aria-label': ariaLabel,
}) {
  const id = useId();
  const pct = Math.max(0, Math.min(100, Math.round(Number(value) || 0)));
  const hasHeader = label || showPercentage || eta || onClose;
  const bar = (
    <div
      className={cx('ui-progress__bar', `ui-progress__bar--${size}`, `ui-progress__bar--${color}`)}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={pct}
      aria-labelledby={label ? `${id}-label` : undefined}
      aria-label={label ? undefined : ariaLabel}
      aria-describedby={helper ? `${id}-help` : undefined}
    >
      <span className="ui-progress__fill" style={{ width: `${disabled ? 0 : pct}%` }} />
    </div>
  );
  const info = (showPercentage || eta) && (
    <span className="ui-progress__info">
      {showPercentage && <span>{pct}%</span>}
      {eta && <span>({eta})</span>}
    </span>
  );
  const close = onClose && (
    <IconButton icon="x" label="Cerrar" variant="tertiary" size="xxs" disabled={disabled} onClick={onClose} />
  );

  return (
    <div className={cx('ui-progress', compact && 'ui-progress--compact', disabled && 'is-disabled', className)}>
      {compact ? (
        <div className="ui-progress__row">
          {label && (
            <span id={`${id}-label`} className="ui-progress__label">
              {label}
            </span>
          )}
          {bar}
          {info}
          {close}
        </div>
      ) : (
        <>
          {hasHeader && (
            <div className="ui-progress__header">
              {label && (
                <span id={`${id}-label`} className="ui-progress__label">
                  {label}
                </span>
              )}
              {info}
              {close}
            </div>
          )}
          {bar}
        </>
      )}
      {helper && (
        <span id={`${id}-help`} className="ui-progress__helper">
          {helper}
        </span>
      )}
    </div>
  );
}

export default ProgressBar;

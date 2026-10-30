import { cloneElement, isValidElement, useEffect, useId, useState } from 'react';
import { cx } from './cx.js';
import './Tooltip.css';

/**
 * Tooltip de Órbita (§16.2). Aparece con hover y con foco; Escape lo cierra.
 * placement: top | bottom | side (derecha) · align: left | center | right
 * describe: añade aria-describedby al disparador (desactívalo si el label ya es su nombre).
 * open: fuerza el estado (galería).
 */
export function Tooltip({ label, placement = 'top', align = 'center', describe = true, open, children, className }) {
  const [visible, setVisible] = useState(false);
  const id = useId();
  const shown = open ?? visible;

  useEffect(() => {
    if (!visible) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') setVisible(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [visible]);

  const trigger =
    isValidElement(children) && describe
      ? cloneElement(children, { 'aria-describedby': cx(children.props['aria-describedby'], id) })
      : children;

  return (
    <span
      className={cx('ui-tooltip-anchor', className)}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
    >
      {trigger}
      <span
        role="tooltip"
        id={id}
        className={cx('ui-tooltip', `ui-tooltip--${placement}`, `ui-tooltip--align-${align}`, shown && 'is-open')}
      >
        {label}
      </span>
    </span>
  );
}

export default Tooltip;

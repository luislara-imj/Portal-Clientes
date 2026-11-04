import { cloneElement, isValidElement, useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { cx } from './cx.js';
import './Tooltip.css';

// Separación entre el disparador y la caja (flecha de 7 + 2) y margen mínimo con el borde de la ventana.
const SEPARACION = 9;
const MARGEN = 8;

// Posición fija de la caja según el disparador. Si no cabe del lado pedido, se voltea; nunca sale de la ventana.
function calcular(ancla, caja, placement, align) {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  let lado = placement;
  if (lado === 'side' && ancla.right + SEPARACION + caja.width > vw - MARGEN) lado = 'top';
  if (lado === 'top' && ancla.top - SEPARACION - caja.height < MARGEN) lado = 'bottom';
  else if (lado === 'bottom' && ancla.bottom + SEPARACION + caja.height > vh - MARGEN) lado = 'top';

  if (lado === 'side') {
    return {
      lado,
      top: ancla.top + ancla.height / 2 - caja.height / 2,
      left: ancla.right + SEPARACION,
      flecha: null
    };
  }
  let left = ancla.left + ancla.width / 2 - caja.width / 2;
  if (align === 'left') left = ancla.left;
  if (align === 'right') left = ancla.right - caja.width;
  left = Math.max(MARGEN, Math.min(left, vw - MARGEN - caja.width));
  const top = lado === 'top' ? ancla.top - SEPARACION - caja.height : ancla.bottom + SEPARACION;
  // La flecha apunta al centro del disparador aunque la caja se haya recorrido para caber.
  const flecha = Math.max(MARGEN, Math.min(ancla.left + ancla.width / 2 - left, caja.width - MARGEN));
  return { lado, top, left, flecha };
}

/**
 * Tooltip de Órbita (§16.2). Aparece con hover y con foco; Escape lo cierra.
 * Siempre flota: se pinta en un portal sobre todo lo demás (posición fija), así que ningún contenedor
 * con overflow (toast, modal, tabla) lo recorta. Se voltea si no cabe y se mantiene dentro de la ventana.
 * placement: top | bottom | side (derecha) · align: left | center | right
 * describe: añade aria-describedby al disparador (desactívalo si el label ya es su nombre).
 * open: fuerza el estado (galería).
 */
export function Tooltip({ label, placement = 'top', align = 'center', describe = true, open, children, className }) {
  const [visible, setVisible] = useState(false);
  const [pos, setPos] = useState(null);
  const anclaRef = useRef(null);
  const cajaRef = useRef(null);
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

  // Mide y coloca la caja al mostrarse; se recoloca al desplazar (cualquier contenedor) o redimensionar.
  useLayoutEffect(() => {
    if (!shown) {
      setPos(null);
      return undefined;
    }
    const actualizar = () => {
      const ancla = anclaRef.current?.getBoundingClientRect();
      const caja = cajaRef.current?.getBoundingClientRect();
      if (ancla && caja) setPos(calcular(ancla, caja, placement, align));
    };
    actualizar();
    window.addEventListener('scroll', actualizar, true);
    window.addEventListener('resize', actualizar);
    return () => {
      window.removeEventListener('scroll', actualizar, true);
      window.removeEventListener('resize', actualizar);
    };
  }, [shown, placement, align, label]);

  const trigger =
    isValidElement(children) && describe
      ? cloneElement(children, { 'aria-describedby': cx(children.props['aria-describedby'], id) })
      : children;

  const caja = (
    <span
      ref={cajaRef}
      role="tooltip"
      id={id}
      className={cx('ui-tooltip', `ui-tooltip--${pos?.lado ?? placement}`, shown && 'is-open', shown && !pos && 'is-midiendo')}
      style={pos ? { top: pos.top, left: pos.left, '--ui-tooltip-flecha': pos.flecha == null ? undefined : `${pos.flecha}px` } : undefined}
    >
      {label}
    </span>
  );

  return (
    <span
      ref={anclaRef}
      className={cx('ui-tooltip-anchor', className)}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
    >
      {trigger}
      {typeof document === 'undefined' ? caja : createPortal(caja, document.body)}
    </span>
  );
}

export default Tooltip;

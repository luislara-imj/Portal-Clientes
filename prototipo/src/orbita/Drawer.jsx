import { useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from './Icon.jsx';
import { IconButton } from './IconButton.jsx';
import { useFocusTrap } from './useFocusTrap.js';
import { cx } from './cx.js';
import './Drawer.css';

/**
 * Drawer de Órbita: panel lateral derecho para consultar el detalle de un registro sin salir de la
 * página (misma anatomía que el panel de filtros: cabecera, cuerpo con scroll y pie fijo).
 * Entra deslizándose; foco atrapado; Escape, la X o el fondo lo cierran.
 * open · onClose · title · subtitle · icon · acciones: nodos junto a la X (p. ej. anterior / siguiente)
 * footer: nodo del pie fijo · size: md (480) | lg (640) · closeLabel
 * contentKey: al cambiar, el cuerpo vuelve arriba (p. ej. al pasar al registro siguiente)
 */
export function Drawer({
  open,
  onClose,
  title,
  subtitle,
  icon,
  acciones,
  footer,
  size = 'md',
  closeLabel = 'Cerrar',
  contentKey,
  className,
  children
}) {
  const panelRef = useRef(null);
  const tituloId = useId();
  useFocusTrap(panelRef, open, { onEscape: onClose });
  if (!open) return null;

  return createPortal(
    <div className="ui-drawer__capa">
      <div className="ui-drawer__fondo" onClick={onClose} aria-hidden="true" />
      <aside
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={tituloId}
        className={cx('ui-drawer', `ui-drawer--${size}`, className)}
      >
        <header className="ui-drawer__cabecera">
          {icon && (
            <span className="ui-drawer__icono" aria-hidden="true">
              <Icon name={icon} size={16} />
            </span>
          )}
          <div className="ui-drawer__titulos">
            <h2 id={tituloId} className="ui-drawer__titulo">{title}</h2>
            {subtitle && <p className="ui-drawer__subtitulo">{subtitle}</p>}
          </div>
          {acciones && <div className="ui-drawer__acciones">{acciones}</div>}
          <IconButton icon="x" label={closeLabel} variant="secondary" size="xs" pill="pill" tooltip={false} onClick={onClose} />
        </header>
        <div className="ui-drawer__cuerpo" key={contentKey}>{children}</div>
        {footer && <footer className="ui-drawer__pie">{footer}</footer>}
      </aside>
    </div>,
    document.body
  );
}

export default Drawer;

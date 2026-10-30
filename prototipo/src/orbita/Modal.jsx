import { useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Button } from './Button.jsx';
import { Icon } from './Icon.jsx';
import { IconButton } from './IconButton.jsx';
import { useFocusTrap } from './useFocusTrap.js';
import { cx } from './cx.js';
import './Modal.css';

/**
 * Modal de Órbita (§7, "Modal Template"). Sombra shadow-3 y radio 16 (6.1).
 * open · onClose · size: xs | sm | md | lg | xl | xxl · title · icon (círculo azul del header)
 * headerActions: nodos junto al botón cerrar (p. ej. Badge) · children: body
 * primaryAction / secondaryAction: { label, onClick, loading?, disabled?, variant? }
 * footerStart: nodo a la izquierda del footer (p. ej. Icon button) · footer: reemplaza el footer
 * Accesibilidad: role="dialog", aria-modal, foco atrapado, Escape cierra, devuelve el foco.
 * closeOnBackdrop: clic en el fondo cierra (por defecto true).
 */
export function Modal({
  open,
  onClose,
  size = 'sm',
  title,
  icon,
  headerActions,
  children,
  primaryAction,
  secondaryAction,
  footerStart,
  footer,
  showHeader = true,
  closeOnBackdrop = true,
  initialFocusRef,
  className,
  'aria-describedby': describedBy,
}) {
  const dialogRef = useRef(null);
  const titleId = useId();
  useFocusTrap(dialogRef, open, { onEscape: onClose, initialFocusRef });

  if (!open) return null;

  const hasFooter = footer !== undefined ? Boolean(footer) : Boolean(primaryAction || secondaryAction || footerStart);

  return createPortal(
    <div className="ui-modal-layer">
      <div className="ui-modal-backdrop" aria-hidden="true" onClick={closeOnBackdrop ? onClose : undefined} />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        aria-describedby={describedBy}
        tabIndex={-1}
        className={cx('ui-modal', `ui-modal--${size}`, className)}
      >
        {showHeader && (
          <header className="ui-modal__header">
            <div className="ui-modal__title-group">
              {icon && (
                <span className="ui-modal__title-icon" aria-hidden="true">
                  <Icon name={icon} size={16} />
                </span>
              )}
              <h2 id={titleId} className="ui-modal__title">
                {title}
              </h2>
            </div>
            <div className="ui-modal__actions">
              {headerActions}
              {onClose && <IconButton icon="x" label="Cerrar" variant="secondary" size="xs" onClick={onClose} />}
            </div>
          </header>
        )}
        <div className="ui-modal__body">{children}</div>
        {hasFooter && (
          <footer className="ui-modal__footer">
            {footer ?? (
              <>
                <div className="ui-modal__footer-start">{footerStart}</div>
                <div className="ui-modal__footer-end">
                  {secondaryAction && (
                    <Button
                      variant={secondaryAction.variant ?? 'secondary'}
                      onClick={secondaryAction.onClick}
                      disabled={secondaryAction.disabled}
                      loading={secondaryAction.loading}
                    >
                      {secondaryAction.label}
                    </Button>
                  )}
                  {primaryAction && (
                    <Button
                      variant={primaryAction.variant ?? 'primary'}
                      onClick={primaryAction.onClick}
                      disabled={primaryAction.disabled}
                      loading={primaryAction.loading}
                    >
                      {primaryAction.label}
                    </Button>
                  )}
                </div>
              </>
            )}
          </footer>
        )}
      </div>
    </div>,
    document.body
  );
}

export default Modal;

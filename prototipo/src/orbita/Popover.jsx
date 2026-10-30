import { cloneElement, isValidElement, useEffect, useId, useRef, useState } from 'react';
import { Button } from './Button.jsx';
import { Icon } from './Icon.jsx';
import { IconButton } from './IconButton.jsx';
import { cx } from './cx.js';
import './Popover.css';

/**
 * Popover de Órbita (§16.3). Radio 12 y shadow-3 (6.1). Diálogo no modal.
 * trigger: elemento que lo abre (recibe aria-expanded / aria-controls / onClick)
 * title · description · icon · badge · children · primaryAction / secondaryAction ({ label, onClick })
 * type: default | warning · placement: bottom | top | left | right · align: start | center | end
 * open / onOpenChange (controlado) o defaultOpen. Escape y clic fuera cierran y devuelven el foco.
 */
export function Popover({
  trigger,
  title,
  description,
  icon,
  badge,
  children,
  primaryAction,
  secondaryAction,
  type = 'default',
  placement = 'bottom',
  align = 'start',
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  showClose = true,
  className,
}) {
  const [inner, setInner] = useState(defaultOpen);
  const open = openProp ?? inner;
  const id = useId();
  const rootRef = useRef(null);
  const panelRef = useRef(null);
  const triggerRef = useRef(null);

  const setOpen = (next, { restoreFocus = false } = {}) => {
    if (openProp === undefined) setInner(next);
    onOpenChange?.(next);
    if (!next && restoreFocus) triggerRef.current?.focus();
  };

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false, { restoreFocus: true });
    };
    const onDown = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onDown);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const triggerEl = isValidElement(trigger)
    ? cloneElement(trigger, {
        ref: triggerRef,
        'aria-expanded': open,
        'aria-controls': `${id}-panel`,
        'aria-haspopup': 'dialog',
        onClick: (e) => {
          trigger.props.onClick?.(e);
          setOpen(!open);
        },
      })
    : trigger;

  const hasHeader = title || showClose;
  const hasFooter = primaryAction || secondaryAction;

  return (
    <span ref={rootRef} className={cx('ui-popover-anchor', className)}>
      {triggerEl}
      {open && (
        <div
          ref={panelRef}
          id={`${id}-panel`}
          role="dialog"
          aria-labelledby={title ? `${id}-title` : undefined}
          className={cx(
            'ui-popover',
            `ui-popover--${type}`,
            `ui-popover--${placement}`,
            `ui-popover--align-${align}`
          )}
        >
          {hasHeader && (
            <div className="ui-popover__header">
              {icon && (
                <span className="ui-popover__icon" aria-hidden="true">
                  <Icon name={icon} size={16} />
                </span>
              )}
              <div className="ui-popover__titles">
                {title && (
                  <p id={`${id}-title`} className="ui-popover__title">
                    {title}
                  </p>
                )}
                {description && <p className="ui-popover__description">{description}</p>}
              </div>
              {badge}
              {showClose && (
                <IconButton
                  icon="x"
                  label="Cerrar"
                  variant="secondary"
                  size="xs"
                  tooltip={false}
                  onClick={() => setOpen(false, { restoreFocus: true })}
                />
              )}
            </div>
          )}
          {children && <div className="ui-popover__content">{children}</div>}
          {hasFooter && (
            <div className="ui-popover__footer">
              {secondaryAction && (
                <Button variant="secondary" fullWidth onClick={secondaryAction.onClick}>
                  {secondaryAction.label}
                </Button>
              )}
              {primaryAction && (
                <Button variant="primary" fullWidth onClick={primaryAction.onClick}>
                  {primaryAction.label}
                </Button>
              )}
            </div>
          )}
        </div>
      )}
    </span>
  );
}

export default Popover;

import { Icon } from './Icon.jsx';
import { IconButton } from './IconButton.jsx';
import { cx } from './cx.js';
import './Notification.css';

const INTENT = {
  informativa: { glyph: 'info', text: 'Informativa' },
  confirmacion: { glyph: 'success', text: 'Confirmación' },
  preventiva: { glyph: 'warning', text: 'Preventiva' },
  critica: { glyph: 'error', text: 'Crítica' }, // Pro: light-emergency-on
};

/**
 * Notification de Órbita (§8.3).
 * intent: informativa | confirmacion | preventiva | critica · variant: popup | item
 * title · subtitle · body · date (en lugar de cerrar) · onClose · isNew · counter (n más) · progress (timer)
 */
export function Notification({
  intent = 'informativa',
  variant = 'popup',
  title,
  subtitle,
  body,
  date,
  onClose,
  isNew = false,
  counter,
  progress,
  className,
}) {
  const meta = INTENT[intent] ?? INTENT.informativa;
  return (
    <article className={cx('ui-notification', `ui-notification--${variant}`, `ui-notification--${intent}`, className)}>
      <div className="ui-notification__head">
        <span className="ui-notification__icon">
          <Icon name={meta.glyph} size={16} label={meta.text} />
        </span>
        <div className="ui-notification__titles">
          <p className="ui-notification__title">
            {title}
            {isNew && (
              <span className="ui-notification__new">
                <span className="ui-sr-only">Nueva</span>
              </span>
            )}
          </p>
          {subtitle && <p className="ui-notification__subtitle">{subtitle}</p>}
        </div>
        {onClose ? (
          <IconButton icon="x" label="Cerrar notificación" variant="tertiary" size="xxs" onClick={onClose} />
        ) : (
          date && <span className="ui-notification__date">{date}</span>
        )}
      </div>
      {body && <p className="ui-notification__body">{body}</p>}
      {counter > 0 && <p className="ui-notification__counter">{counter} notificaciones más</p>}
      {progress != null && (
        <div className="ui-notification__timer" aria-hidden="true">
          <span style={{ width: `${Math.max(0, Math.min(100, progress))}%` }} />
        </div>
      )}
    </article>
  );
}

export default Notification;

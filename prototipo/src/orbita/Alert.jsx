import { Button } from './Button.jsx';
import { Icon } from './Icon.jsx';
import { IconButton } from './IconButton.jsx';
import { cx } from './cx.js';
import './Alert.css';

const GLYPH = { info: 'info', success: 'success', warning: 'warning', danger: 'error' };

/**
 * Alert de Órbita (§8.2).
 * stage: info | success | warning | danger · theme: soft | solid
 * title · description · showIcon · actions: [{ label, onClick }] (Button secondary xs) · onClose
 * live: anuncia el contenido al aparecer (role="alert" en danger, "status" en el resto).
 */
export function Alert({
  stage = 'info',
  theme = 'soft',
  title,
  description,
  showIcon = true,
  actions,
  onClose,
  live = false,
  className,
  children,
}) {
  const role = live ? (stage === 'danger' ? 'alert' : 'status') : undefined;
  return (
    <div className={cx('ui-alert', `ui-alert--${theme}-${stage}`, className)} role={role}>
      <div className="ui-alert__main">
        {showIcon && <Icon name={GLYPH[stage]} size={20} className="ui-alert__icon" />}
        <div className="ui-alert__text">
          {title && <p className="ui-alert__title">{title}</p>}
          {description && <p className="ui-alert__description">{description}</p>}
          {children}
        </div>
      </div>
      {(actions?.length > 0 || onClose) && (
        <div className="ui-alert__side">
          {actions?.map((a) => (
            <Button key={a.label} variant="secondary" size="xs" onClick={a.onClick} iconLeft={a.icon}>
              {a.label}
            </Button>
          ))}
          {onClose && <IconButton icon="x" label="Cerrar alerta" variant="secondary" size="xxs" pill="pill" onClick={onClose} />}
        </div>
      )}
    </div>
  );
}

export default Alert;

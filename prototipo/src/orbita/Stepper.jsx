import { Icon } from './Icon.jsx';
import { cx } from './cx.js';
import './Stepper.css';

const STATUS_TEXT = {
  complete: 'Completado',
  current: 'En curso',
  pending: 'Pendiente',
  locked: 'Bloqueado',
};

/**
 * Stepper de Órbita (§6).
 * steps: [{ title, label?, status: 'complete' | 'current' | 'pending', locked?, reason?, onClick?/href? }]
 *  - complete = Check · current = Active · pending = default (número)
 *  - locked (PROTOTIPO_SPEC 6.1): estado pendiente con candado y `reason` visible debajo del paso.
 * orientation: horizontal | vertical · onColor: variante "- white" (conector blanco).
 * Un paso con onClick o href (y no bloqueado) se vuelve navegable.
 */
export function Stepper({ steps, orientation = 'horizontal', onColor = false, label = 'Fases', className }) {
  return (
    <nav aria-label={label} className={cx('ui-stepper-wrap', className)}>
      <ol className={cx('ui-stepper', `ui-stepper--${orientation}`, onColor && 'ui-stepper--on-color')}>
        {steps.map((step, i) => {
          const status = step.status ?? 'pending';
          const locked = Boolean(step.locked) && status === 'pending';
          const stepLabel = step.label ?? `Paso ${i + 1}`;
          const interactive = !locked && (step.onClick || step.href);
          const body = (
            <>
              <span className={cx('ui-stepper__status', `ui-stepper__status--${status}`)} aria-hidden="true">
                {status === 'complete' && <Icon name="check" size={24} />}
                {status === 'current' && <span className="ui-stepper__dot" />}
                {status === 'pending' && (locked ? <Icon name="lock" size={16} /> : <span>{i + 1}</span>)}
              </span>
              <span className="ui-stepper__text">
                <span className="ui-stepper__label">{stepLabel}</span>
                <span className="ui-stepper__title">{step.title}</span>
                <span className="ui-sr-only">, {STATUS_TEXT[locked ? 'locked' : status]}</span>
                {locked && step.reason && <span className="ui-stepper__reason">{step.reason}</span>}
              </span>
            </>
          );
          const common = {
            className: cx('ui-stepper__step', interactive && 'is-interactive'),
            'aria-current': status === 'current' ? 'step' : undefined,
          };
          return (
            <li key={`${step.title}-${i}`} className={cx('ui-stepper__item', `is-${locked ? 'locked' : status}`)}>
              {interactive && step.href ? (
                <a href={step.href} onClick={step.onClick} {...common}>
                  {body}
                </a>
              ) : interactive ? (
                <button type="button" onClick={step.onClick} {...common}>
                  {body}
                </button>
              ) : (
                <div {...common}>{body}</div>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default Stepper;

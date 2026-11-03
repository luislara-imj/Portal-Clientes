import { Icon } from './Icon.jsx';
import { Logo } from './Logo.jsx';
import { cx } from './cx.js';
import './Spinner.css';

/**
 * Spinner de Órbita.
 * size="sm": glifo `loader` (16) que hereda el color; lo usan Button e Icon button.
 * size="lg": anillo de 96 con arco de 90° y logo OBP al centro (§15).
 * `label` anuncia el estado (role="status"); sin label es decorativo.
 */
export function Spinner({ size = 'sm', iconSize = 16, label, className }) {
  const a11y = label ? { role: 'status' } : { 'aria-hidden': true };
  if (size === 'lg') {
    return (
      <span className={cx('ui-spinner', 'ui-spinner--lg', className)} {...a11y}>
        <svg className="ui-spinner__ring" viewBox="0 0 96 96" aria-hidden="true" focusable="false">
          <circle className="ui-spinner__track" cx="48" cy="48" r="44" />
          <circle className="ui-spinner__arc" cx="48" cy="48" r="44" pathLength="100" />
        </svg>
        <span className="ui-spinner__logo" aria-hidden="true">
          <Logo variant="icon" size="md" decorative />
        </span>
        {label && <span className="ui-sr-only">{label}</span>}
      </span>
    );
  }
  return (
    <span className={cx('ui-spinner', 'ui-spinner--sm', className)} {...a11y}>
      <Icon name="loader" size={iconSize} spin />
      {label && <span className="ui-sr-only">{label}</span>}
    </span>
  );
}

export default Spinner;

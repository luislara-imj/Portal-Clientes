import { cx } from './cx.js';
import './Divider.css';

/**
 * Divider de Órbita (§16.1).
 * orientation: horizontal | vertical · dashed · children: texto centrado (size lg | md | sm | xs)
 */
export function Divider({ orientation = 'horizontal', dashed = false, size = 'sm', children, className }) {
  const classes = cx(
    'ui-divider',
    `ui-divider--${orientation}`,
    dashed && 'ui-divider--dashed',
    children && `ui-divider--text ui-divider--${size}`,
    className
  );
  if (children) {
    return (
      <div className={classes} role="separator" aria-orientation={orientation}>
        <span className="ui-divider__line" />
        <span className="ui-divider__text">{children}</span>
        <span className="ui-divider__line" />
      </div>
    );
  }
  return (
    <div className={classes} role="separator" aria-orientation={orientation}>
      <span className="ui-divider__line" />
    </div>
  );
}

export default Divider;

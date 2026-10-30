import { useId, useState } from 'react';
import { Icon } from './Icon.jsx';
import { cx } from './cx.js';
import './Accordion.css';

/**
 * Accordion de Órbita (§13).
 * title · description · children (contenido) · defaultOpen / open + onToggle(open)
 * empty: estado "empty" (sin contenido, deshabilitado).
 * El encabezado completo es un botón con aria-expanded; el chevron replica el Icon button tertiary 32.
 */
export function Accordion({ title, description, children, defaultOpen = false, open: openProp, onToggle, empty = false, className }) {
  const [inner, setInner] = useState(defaultOpen);
  const open = !empty && (openProp ?? inner);
  const id = useId();

  const toggle = () => {
    if (empty) return;
    const next = !open;
    if (openProp === undefined) setInner(next);
    onToggle?.(next);
  };

  return (
    <section className={cx('ui-accordion', open && 'is-open', empty && 'is-empty', className)}>
      <h3 className="ui-accordion__heading">
        <button
          type="button"
          id={`${id}-btn`}
          className="ui-accordion__header"
          aria-expanded={open}
          aria-controls={`${id}-panel`}
          disabled={empty}
          onClick={toggle}
        >
          <span className="ui-accordion__titles">
            <span className="ui-accordion__title">{title}</span>
            {description && <span className="ui-accordion__description">{description}</span>}
          </span>
          <span className="ui-accordion__chevron" aria-hidden="true">
            <Icon name={open ? 'chevron-up' : 'chevron-down'} size={16} />
          </span>
        </button>
      </h3>
      <div id={`${id}-panel`} role="region" aria-labelledby={`${id}-btn`} className="ui-accordion__panel" hidden={!open}>
        {children}
      </div>
    </section>
  );
}

export default Accordion;

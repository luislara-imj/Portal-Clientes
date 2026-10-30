import { useState } from 'react';
import { Icon } from './Icon.jsx';
import { cx } from './cx.js';
import './Breadcrumbs.css';

/**
 * Breadcrumbs de Órbita (§9).
 * items: [{ label, href?, onClick? }]; el último es la página actual (Selected).
 * Con más de `max` niveles (5) se colapsan los intermedios en "…" (estado More), que los despliega.
 */
export function Breadcrumbs({ items, max = 5, label = 'Ruta de navegación', className }) {
  const [expanded, setExpanded] = useState(false);
  const collapse = !expanded && items.length > max;
  const visible = collapse ? [items[0], { more: true }, items[items.length - 1]] : items;

  return (
    <nav aria-label={label} className={cx('ui-breadcrumbs', className)}>
      <ol className="ui-breadcrumbs__list">
        {visible.map((item, i) => {
          const last = i === visible.length - 1;
          if (item.more) {
            return (
              <li key="more" className="ui-breadcrumbs__item">
                <button
                  type="button"
                  className="ui-breadcrumbs__link ui-touch-y"
                  aria-label={`Mostrar ${items.length - 2} niveles ocultos`}
                  onClick={() => setExpanded(true)}
                >
                  …
                </button>
                <Icon name="chevron-right" size={10} className="ui-breadcrumbs__chevron" />
              </li>
            );
          }
          return (
            <li key={`${item.label}-${i}`} className="ui-breadcrumbs__item">
              {last ? (
                <span className="ui-breadcrumbs__current" aria-current="page">
                  {item.label}
                </span>
              ) : item.href ? (
                <a className="ui-breadcrumbs__link ui-touch-y" href={item.href} onClick={item.onClick}>
                  {item.label}
                </a>
              ) : (
                <button type="button" className="ui-breadcrumbs__link ui-touch-y" onClick={item.onClick}>
                  {item.label}
                </button>
              )}
              {!last && <Icon name="chevron-right" size={10} className="ui-breadcrumbs__chevron" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default Breadcrumbs;

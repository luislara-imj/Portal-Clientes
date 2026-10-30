import { useRef } from 'react';
import { Badge } from './Badge.jsx';
import { Icon } from './Icon.jsx';
import { IconButton } from './IconButton.jsx';
import { cx } from './cx.js';
import './Tabs.css';

/**
 * Tabs de Órbita (§5, set "Tap "; pestañas = Button color "Tap").
 * items: [{ id, label, count?, icon?, disabled? }] · value: id activo · onChange(id)
 * size: xxl | xs | sm | md | lg · pill: true (6/6/0/0) | false (0) · onAdd: muestra "+"
 * idPrefix: relaciona cada pestaña con su <TabPanel> (id `${idPrefix}-panel-${id}`).
 * Teclado: flechas, Inicio y Fin mueven y activan.
 */
export function Tabs({ items, value, onChange, size = 'xs', pill = true, onAdd, addLabel = 'Agregar', idPrefix = 'tabs', label, className }) {
  const refs = useRef({});
  const enabled = items.filter((t) => !t.disabled);

  const onKeyDown = (e, id) => {
    const i = enabled.findIndex((t) => t.id === id);
    let next = null;
    if (e.key === 'ArrowRight') next = enabled[(i + 1) % enabled.length];
    if (e.key === 'ArrowLeft') next = enabled[(i - 1 + enabled.length) % enabled.length];
    if (e.key === 'Home') next = enabled[0];
    if (e.key === 'End') next = enabled[enabled.length - 1];
    if (next) {
      e.preventDefault();
      refs.current[next.id]?.focus();
      onChange?.(next.id);
    }
  };

  return (
    <div className={cx('ui-tabs', `ui-tabs--${size}`, pill ? 'ui-tabs--rounded' : 'ui-tabs--square', className)}>
      <div role="tablist" aria-label={label} className="ui-tabs__list">
        {items.map((tab) => {
          const selected = tab.id === value;
          return (
            <button
              key={tab.id}
              ref={(el) => {
                refs.current[tab.id] = el;
              }}
              type="button"
              role="tab"
              id={`${idPrefix}-tab-${tab.id}`}
              aria-selected={selected}
              aria-controls={`${idPrefix}-panel-${tab.id}`}
              tabIndex={selected ? 0 : -1}
              disabled={tab.disabled}
              className={cx('ui-tabs__tab', size === 'xxl' && 'ui-touch-y', selected && 'is-selected')}
              onClick={() => onChange?.(tab.id)}
              onKeyDown={(e) => onKeyDown(e, tab.id)}
            >
              {tab.icon && <Icon name={tab.icon} size={size === 'xxl' && !selected ? 10 : 16} className="ui-tabs__icon" />}
              <span>{tab.label}</span>
              {tab.count != null && (
                <Badge type="num" color="gray" theme="soft" className="ui-tabs__count">
                  {tab.count}
                </Badge>
              )}
            </button>
          );
        })}
      </div>
      {onAdd && (
        <IconButton icon="plus" label={addLabel} variant="ghost" size={size === 'xxl' ? 'xxs' : size} onClick={onAdd} />
      )}
    </div>
  );
}

/** Panel de una pestaña. Debe usar el mismo idPrefix y el id de la pestaña. */
export function TabPanel({ idPrefix = 'tabs', id, active, children, className }) {
  return (
    <div
      role="tabpanel"
      id={`${idPrefix}-panel-${id}`}
      aria-labelledby={`${idPrefix}-tab-${id}`}
      hidden={!active}
      tabIndex={0}
      className={cx('ui-tab-panel', className)}
    >
      {active && children}
    </div>
  );
}

export default Tabs;

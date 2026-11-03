import { useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Button } from './Button.jsx';
import { Icon } from './Icon.jsx';
import { IconButton } from './IconButton.jsx';
import { useFocusTrap } from './useFocusTrap.js';
import { cx } from './cx.js';
import './FilterPanel.css';

/**
 * Panel lateral de filtros de Órbita (archivo Filtros, página Sidebar). Se abre a la derecha,
 * encima del contenido, con fondo oscurecido. Foco atrapado; Escape, la X o el fondo lo cierran.
 * open · onClose · title (por defecto "Filtros") · resumen: nodo de la franja "Mostrando N …"
 * onLimpiar · onAplicar · children: grupos de filtros
 */
export function FilterPanel({ open, onClose, title = 'Filtros', resumen, onLimpiar, onAplicar, children, className }) {
  const panelRef = useRef(null);
  const tituloId = useId();
  useFocusTrap(panelRef, open, { onEscape: onClose });
  if (!open) return null;

  return createPortal(
    <div className="ui-filter-panel__capa">
      <div className="ui-filter-panel__fondo" onClick={onClose} aria-hidden="true" />
      <aside
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={tituloId}
        className={cx('ui-filter-panel', className)}
      >
        <header className="ui-filter-panel__cabecera">
          <span className="ui-filter-panel__icono" aria-hidden="true">
            <Icon name="sliders" size={16} />
          </span>
          <h2 id={tituloId} className="ui-filter-panel__titulo">{title}</h2>
          <IconButton icon="x" label="Cerrar filtros" variant="secondary" size="xs" pill="pill" tooltip={false} onClick={onClose} />
        </header>
        {resumen && <p className="ui-filter-panel__resumen" aria-live="polite">{resumen}</p>}
        <div className="ui-filter-panel__cuerpo">{children}</div>
        <footer className="ui-filter-panel__pie">
          <Button variant="secondary" size="sm" iconLeft="broom" fullWidth onClick={onLimpiar}>
            Limpiar
          </Button>
          <Button variant="primary" size="sm" iconLeft="success" fullWidth onClick={onAplicar}>
            Aplicar
          </Button>
        </footer>
      </aside>
    </div>,
    document.body
  );
}

/** Grupo de filtros dentro del panel: título y sus controles. */
export function FilterGroup({ title, children }) {
  return (
    <fieldset className="ui-filter-group">
      <legend className="ui-filter-group__titulo">{title}</legend>
      <div className="ui-filter-group__controles">{children}</div>
    </fieldset>
  );
}

export default FilterPanel;

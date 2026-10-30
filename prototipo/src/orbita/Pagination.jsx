import { useId } from 'react';
import { IconButton } from './IconButton.jsx';
import { cx } from './cx.js';
import './Pagination.css';

function pageWindow(page, count, size = 5) {
  const half = Math.floor(size / 2);
  let start = Math.max(1, page - half);
  const end = Math.min(count, start + size - 1);
  start = Math.max(1, end - size + 1);
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

/**
 * Pagination de Órbita (§16.4).
 * page (1…pageCount) · pageCount · onPageChange(page)
 * pageSize · pageSizeOptions · onPageSizeChange(size): selector "Filas por página"
 * Botones = Icon button secondary 32 pill; la página actual usa el estado selected.
 */
export function Pagination({ page, pageCount, onPageChange, pageSize, pageSizeOptions, onPageSizeChange, className }) {
  const id = useId();
  const go = (p) => {
    const next = Math.max(1, Math.min(pageCount, p));
    if (next !== page) onPageChange?.(next);
  };
  const first = page <= 1;
  const last = page >= pageCount;

  return (
    <nav className={cx('ui-pagination', className)} aria-label="Paginación">
      <p className="ui-pagination__text" aria-live="polite">
        Mostrando página {page} de {pageCount}
      </p>
      <div className="ui-pagination__buttons">
        <IconButton icon="chevrons-left" label="Primera página" size="xs" pill="pill" disabled={first} onClick={() => go(1)} />
        <IconButton icon="chevron-left" label="Página anterior" size="xs" pill="pill" disabled={first} onClick={() => go(page - 1)} />
        {pageWindow(page, pageCount).map((p) => (
          <button
            key={p}
            type="button"
            className={cx('ui-pagination__page', 'ui-icon-button', 'ui-icon-button--secondary', 'ui-icon-button--xs', 'ui-radius--pill', 'ui-touch', 'ui-focus-ring', p === page && 'is-selected')}
            aria-label={`Página ${p}`}
            aria-current={p === page ? 'page' : undefined}
            onClick={() => go(p)}
          >
            {p}
          </button>
        ))}
        <IconButton icon="chevron-right" label="Página siguiente" size="xs" pill="pill" disabled={last} onClick={() => go(page + 1)} />
        <IconButton icon="chevrons-right" label="Última página" size="xs" pill="pill" disabled={last} onClick={() => go(pageCount)} />
      </div>
      {pageSizeOptions?.length > 0 && (
        <div className="ui-pagination__size">
          <label htmlFor={`${id}-size`} className="ui-pagination__text">
            Filas por página
          </label>
          <select
            id={`${id}-size`}
            className="ui-pagination__select"
            value={pageSize}
            onChange={(e) => onPageSizeChange?.(Number(e.target.value))}
          >
            {pageSizeOptions.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
      )}
    </nav>
  );
}

export default Pagination;

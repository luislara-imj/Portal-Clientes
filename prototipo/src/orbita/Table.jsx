import { Avatar } from './Avatar.jsx';
import { Checkbox } from './Checkbox.jsx';
import { Icon } from './Icon.jsx';
import { Tag } from './Tag.jsx';
import { cx } from './cx.js';
import './Table.css';

/**
 * Table de Órbita (§4). Header Cell 48, Cell 56, separador de filas 2 px.
 *
 * columns: [{
 *   key, header, type?: 'text' | 'number' | 'date' | 'link' | 'status' | 'tags' | 'primary',
 *   align?: 'left' | 'right' | 'center', width?, sticky?: true (columna clave fija),
 *   sortable?, render?(row), href?(row), onClick?(row), maxTags?
 * }]
 *  - status: valor { label, color, icon }  (Tag; siempre con texto)
 *  - tags: valor [{ label, color }] o [string]; el sobrante se muestra como "+N"
 *  - primary: valor { title, subtitle?, avatar? } (avatar = nombre para iniciales)
 * rows · rowKey · selectable + selectedKeys + onSelectionChange(keys) (columna checkbox)
 * sort: { key, direction: 'asc' | 'desc' } · onSortChange(key)
 * isRowDisabled?(row) · toolbar · footer · caption (nombre accesible) · emptyMessage
 */
export function Table({
  columns,
  rows,
  rowKey = 'id',
  selectable = false,
  selectedKeys = [],
  onSelectionChange,
  sort,
  onSortChange,
  isRowDisabled,
  toolbar,
  footer,
  caption,
  emptyMessage = 'Sin registros',
  className,
}) {
  const keyOf = (row, i) => (typeof rowKey === 'function' ? rowKey(row, i) : row[rowKey] ?? i);
  const selected = new Set(selectedKeys);
  const selectableRows = rows.filter((r) => !isRowDisabled?.(r));
  const allKeys = selectableRows.map((r) => keyOf(r, rows.indexOf(r)));
  const allSelected = allKeys.length > 0 && allKeys.every((k) => selected.has(k));
  const someSelected = !allSelected && allKeys.some((k) => selected.has(k));

  const toggleRow = (k) => {
    const next = new Set(selected);
    if (next.has(k)) next.delete(k);
    else next.add(k);
    onSelectionChange?.([...next]);
  };
  const toggleAll = () => onSelectionChange?.(allSelected ? [] : allKeys);

  return (
    <div className={cx('ui-table', className)}>
      {toolbar && <div className="ui-table__toolbar">{toolbar}</div>}
      <div className="ui-table__scroll" role="region" aria-label={caption} tabIndex={0}>
        <table className={cx('ui-table__table', selectable && 'has-select')}>
          {caption && <caption className="ui-sr-only">{caption}</caption>}
          <thead>
            <tr>
              {selectable && (
                <th scope="col" className="ui-table__th ui-table__check is-sticky">
                  <Checkbox
                    aria-label="Seleccionar todas las filas"
                    checked={allSelected}
                    indeterminate={someSelected}
                    onChange={toggleAll}
                  />
                </th>
              )}
              {columns.map((col) => {
                const sorted = sort?.key === col.key ? sort.direction : null;
                return (
                  <th
                    key={col.key}
                    scope="col"
                    style={col.width ? { width: col.width, minWidth: col.width } : undefined}
                    className={cx(
                      'ui-table__th',
                      `is-${col.align ?? (col.type === 'number' ? 'right' : 'left')}`,
                      col.sticky && 'is-sticky is-key'
                    )}
                    aria-sort={sorted ? (sorted === 'asc' ? 'ascending' : 'descending') : undefined}
                  >
                    <span className="ui-table__th-inner">
                      <span className="ui-table__th-title">{col.header}</span>
                      {col.sortable && (
                        <button
                          type="button"
                          className={cx('ui-table__sort', 'ui-touch', sorted && 'is-active')}
                          aria-label={`Ordenar por ${col.header}`}
                          onClick={() => onSortChange?.(col.key)}
                        >
                          <Icon name={sorted === 'asc' ? 'arrow-up' : sorted === 'desc' ? 'arrow-down' : 'sort'} size={10} />
                        </button>
                      )}
                    </span>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr className="ui-table__row">
                <td className="ui-table__td ui-table__empty" colSpan={columns.length + (selectable ? 1 : 0)}>
                  <span className="ui-table__empty-contenido">
                    <span className="ui-table__empty-icono" aria-hidden="true"><Icon name="inbox" size={20} /></span>
                    {emptyMessage}
                  </span>
                </td>
              </tr>
            )}
            {rows.map((row, i) => {
              const k = keyOf(row, i);
              const disabled = Boolean(isRowDisabled?.(row));
              const isSel = selected.has(k);
              return (
                <tr
                  key={k}
                  className={cx('ui-table__row', isSel && 'is-selected', disabled && 'is-disabled')}
                  aria-disabled={disabled || undefined}
                >
                  {selectable && (
                    <td className="ui-table__td ui-table__check is-sticky">
                      <Checkbox
                        aria-label={`Seleccionar fila ${i + 1}`}
                        checked={isSel}
                        disabled={disabled}
                        onChange={() => toggleRow(k)}
                      />
                    </td>
                  )}
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={cx(
                        'ui-table__td',
                        `ui-table__td--${col.type ?? 'text'}`,
                        `is-${col.align ?? (col.type === 'number' ? 'right' : 'left')}`,
                        col.sticky && 'is-sticky is-key'
                      )}
                    >
                      {renderCell(col, row)}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {footer && <div className="ui-table__footer">{footer}</div>}
    </div>
  );
}

function renderCell(col, row) {
  if (col.render) return col.render(row);
  const value = row[col.key];
  switch (col.type) {
    case 'link': {
      const href = col.href?.(row);
      if (href) {
        return (
          <a className="ui-table__link" href={href} onClick={col.onClick ? () => col.onClick(row) : undefined}>
            {value}
          </a>
        );
      }
      return (
        <button type="button" className="ui-table__link" onClick={() => col.onClick?.(row)}>
          {value}
        </button>
      );
    }
    case 'status':
      if (!value) return null;
      return (
        <Tag color={value.color ?? 'gray'} icon={value.icon}>
          {value.label}
        </Tag>
      );
    case 'tags': {
      const list = (value ?? []).map((t) => (typeof t === 'string' ? { label: t } : t));
      const max = col.maxTags ?? 2;
      const rest = list.length - max;
      return (
        <span className="ui-table__tags">
          {list.slice(0, max).map((t) => (
            <Tag key={t.label} color={t.color ?? 'gray'} icon={t.icon}>
              {t.label}
            </Tag>
          ))}
          {rest > 0 && (
            <Tag color="gray" title={list.slice(max).map((t) => t.label).join(', ')}>
              +{rest}
            </Tag>
          )}
        </span>
      );
    }
    case 'primary':
      if (!value) return null;
      return (
        <span className="ui-table__primary">
          {value.avatar && <Avatar name={value.avatar} size="sm" />}
          <span className="ui-table__primary-text">
            <span className="ui-table__primary-title">{value.title}</span>
            {value.subtitle && <span className="ui-table__primary-sub">{value.subtitle}</span>}
          </span>
        </span>
      );
    default:
      return value;
  }
}

export default Table;

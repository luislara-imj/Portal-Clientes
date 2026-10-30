import { COLUMNS, MONEY_COLUMNS } from './columns.js'
import { formatDate, formatInteger, formatMoney } from '../format.js'

export function formatCell(column, value) {
  if (column.kind === 'money') return formatMoney(value)
  if (column.kind === 'integer') return formatInteger(value)
  if (column.kind === 'date') return formatDate(value)
  return value === '' || value == null ? '—' : String(value)
}

// One media row in the desktop table.
export default function MediaRow({ fila }) {
  return (
    <tr className="q-row">
      {COLUMNS.map((col, i) => {
        const text = formatCell(col, fila[col.key])
        const classes = [
          'q-cell',
          `q-cell--${col.variant}`,
          i === 0 ? 'q-sticky' : '',
          col.multiline ? 'q-cell--multiline' : '',
        ].join(' ')
        return (
          <td key={col.key} className={classes}>
            <span className="q-cell-text" title={col.variant === 'default' ? text : undefined}>
              {text}
            </span>
          </td>
        )
      })}
    </tr>
  )
}

// The same media as a card, for phones (below 600 px).
export function MediaCard({ fila }) {
  return (
    <li className="m-card">
      <div className="m-card-head">
        <p className="m-card-title">{fila.formato}</p>
        <p className="m-card-sub">{fila.ciudad}</p>
      </div>
      <p className="m-card-detail">{fila.detalle}</p>
      <dl className="m-card-grid">
        <div><dt>Clave IMJ</dt><dd>{fila.clave}</dd></div>
        <div><dt>Unidades</dt><dd>{formatInteger(fila.unidades)}</dd></div>
        <div><dt>Tiempo de servicio</dt><dd>{fila.tiempo_servicio}</dd></div>
        <div><dt>Periodo</dt><dd>{formatDate(fila.inicio)} al {formatDate(fila.fin)}</dd></div>
      </dl>
      <dl className="m-card-money">
        {MONEY_COLUMNS.map((col) => (
          <div key={col.key} className={col.key === 'total' ? 'm-money-row m-money-row--total' : 'm-money-row'}>
            <dt>{col.label}</dt>
            <dd>{formatMoney(fila[col.key])}</dd>
          </div>
        ))}
      </dl>
    </li>
  )
}

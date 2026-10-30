import { COLUMNS } from './columns.js'
import MediaRow, { MediaCard } from './MediaRow.jsx'
import { formatMoney } from '../format.js'

export function sectionLabel(seccion) {
  const n = seccion.cantidad_medios
  return `${seccion.nombre} · ${n} ${n === 1 ? 'medio' : 'medios'}`
}

// Columns before the money block: the section label spans them (Chevron 1 pattern).
const LABEL_SPAN = COLUMNS.findIndex((c) => c.kind === 'money')
const EMPTY_MONEY = COLUMNS.length - LABEL_SPAN - 1

// Desktop: a 56 px section row in the same grid, then one MediaRow per fila.
export default function SectionRows({ seccion }) {
  return (
    <>
      <tr className="q-row q-row--section">
        <th scope="rowgroup" colSpan={LABEL_SPAN} className="q-cell q-cell--section">
          <span className="q-section-label">
            <span className="q-chevron-slot" aria-hidden="true" />
            {sectionLabel(seccion)}
          </span>
        </th>
        {Array.from({ length: EMPTY_MONEY }, (_, i) => (
          <td key={i} className="q-cell q-cell--numerica" />
        ))}
        <td className="q-cell q-cell--numerica q-cell--section-total">
          <span className="q-cell-text">
            <span className="visually-hidden">Subtotal {seccion.nombre}: </span>
            {formatMoney(seccion.subtotal)}
          </span>
        </td>
      </tr>
      {seccion.filas.map((fila, i) => (
        <MediaRow key={`${fila.clave}-${i}`} fila={fila} />
      ))}
    </>
  )
}

// Phones: the same grouping, as a section heading plus a list of cards.
export function SectionCards({ seccion }) {
  return (
    <section className="m-section" aria-label={sectionLabel(seccion)}>
      <div className="m-section-head">
        <h3 className="m-section-title">{sectionLabel(seccion)}</h3>
        <p className="m-section-total">
          <span className="m-section-total-label">Subtotal</span>
          {formatMoney(seccion.subtotal)}
        </p>
      </div>
      <ul className="m-card-list">
        {seccion.filas.map((fila, i) => (
          <MediaCard key={`${fila.clave}-${i}`} fila={fila} />
        ))}
      </ul>
    </section>
  )
}

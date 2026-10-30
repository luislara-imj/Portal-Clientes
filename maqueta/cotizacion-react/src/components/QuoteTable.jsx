import { COLUMNS } from './columns.js'
import SectionRows, { SectionCards } from './SectionRows.jsx'

// Desktop: one table, horizontal scroll inside the card, Ciudad sticky.
// Phones (< 600 px): cards per media, grouped per section. CSS picks which one shows.
export default function QuoteTable({ secciones }) {
  return (
    <section className="card quote-card" aria-labelledby="quote-table-title">
      <h2 id="quote-table-title" className="visually-hidden">Medios cotizados</h2>

      <div className="q-scroll" role="region" aria-labelledby="quote-table-title" tabIndex={0}>
        <table className="q-table">
          <colgroup>
            {COLUMNS.map((c) => (
              <col key={c.key} style={{ width: c.width }} />
            ))}
          </colgroup>
          <thead>
            <tr className="q-row q-row--head">
              {COLUMNS.map((c, i) => (
                <th
                  key={c.key}
                  scope="col"
                  className={`q-head q-head--${c.variant}${i === 0 ? ' q-sticky' : ''}`}
                >
                  <span className="q-head-text">{c.label}</span>
                </th>
              ))}
            </tr>
          </thead>
          {secciones.map((s) => (
            <tbody key={s.nombre}>
              <SectionRows seccion={s} />
            </tbody>
          ))}
        </table>
      </div>

      <div className="m-list">
        {secciones.map((s) => (
          <SectionCards key={s.nombre} seccion={s} />
        ))}
      </div>
    </section>
  )
}

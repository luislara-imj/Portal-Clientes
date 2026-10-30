import { formatMoney } from '../format.js'

// Cierre de la cotización, en el orden del Excel: Subtotal, (Descuento omitido), IVA, Total con IVA.
export default function SummaryCard({ subtotal, ivaTasa, iva, total }) {
  const ivaPct = Math.round(Number(ivaTasa) * 100)
  return (
    <section className="card summary-card" aria-labelledby="summary-title">
      <h2 id="summary-title" className="visually-hidden">Resumen de la cotización</h2>
      <dl className="summary-list">
        <div className="summary-row">
          <dt>Subtotal</dt>
          <dd>{formatMoney(subtotal)}</dd>
        </div>
        <div className="summary-row">
          <dt>IVA ({ivaPct}%)</dt>
          <dd>{formatMoney(iva)}</dd>
        </div>
        <div className="summary-row summary-row--total">
          <dt>Total con IVA</dt>
          <dd>{formatMoney(total)}</dd>
        </div>
      </dl>
    </section>
  )
}

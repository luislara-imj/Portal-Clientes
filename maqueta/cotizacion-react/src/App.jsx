import data from './data/cotizacion.json'
import SummaryCard from './components/SummaryCard.jsx'
import QuoteTable from './components/QuoteTable.jsx'
import ApprovalBar from './components/ApprovalBar.jsx'
import { formatDate } from './format.js'

function QuoteHeader({ q }) {
  const meta = [
    ['Cliente', q.cliente],
    ['Campaña', q.campana],
    ['Folio', q.folio],
    ['Vigencia', q.vigencia_texto],
    ['Responsable', q.responsable],
    ['Fecha de emisión', formatDate(q.fecha_emision)],
  ]
  return (
    <header className="page-header">
      <nav aria-label="Ruta de navegación" className="breadcrumb">
        <ol>
          <li><a href="#">Mis campañas</a></li>
          <li aria-hidden="true" className="breadcrumb-sep">&gt;</li>
          <li aria-current="page">{q.campana}</li>
        </ol>
      </nav>
      <h1 className="page-title">Cotización</h1>
      <dl className="card meta-grid">
        {meta.map(([label, value]) => (
          <div key={label} className="meta-item">
            <dt>{label}</dt>
            <dd>{value || '—'}</dd>
          </div>
        ))}
      </dl>
    </header>
  )
}

function TextBlock({ title, text }) {
  const empty = !text || !String(text).trim()
  return (
    <section className="text-block">
      <h2 className="text-block-title">{title}</h2>
      {empty ? (
        <p className="text-block-empty">Sin información en la cotización</p>
      ) : (
        <p className="text-block-body">{text}</p>
      )}
    </section>
  )
}

export default function App() {
  const q = data
  return (
    <main className="page">
      <QuoteHeader q={q} />

      <SummaryCard subtotal={q.subtotal} ivaTasa={q.iva_tasa} iva={q.iva} total={q.total} />

      <QuoteTable secciones={q.secciones} />

      <div className="card text-blocks">
        <TextBlock title="Tu campaña incluye" text={q.incluye} />
        <TextBlock title="Condiciones de pago" text={q.condiciones_pago} />
        <TextBlock title="Aclaraciones" text={q.aclaraciones} />
      </div>

      <ApprovalBar q={q} />

      <footer className="page-footer">
        <p className="validity-note">{q.nota_validez}</p>
        <div className="signature">
          <p className="signature-name">{q.firma?.nombre}</p>
          <p className="signature-role">{q.firma?.cargo}</p>
        </div>
      </footer>
    </main>
  )
}

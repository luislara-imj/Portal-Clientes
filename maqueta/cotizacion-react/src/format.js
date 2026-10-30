const money = new Intl.NumberFormat('es-MX', {
  style: 'currency',
  currency: 'MXN',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

const integer = new Intl.NumberFormat('es-MX', { maximumFractionDigits: 0 })

// $1,456.00. Rounds to cents first so -0 and float noise never show.
export function formatMoney(value) {
  const n = Number(value)
  if (!Number.isFinite(n)) return '—'
  const cents = Math.round(n * 100) / 100 + 0
  return money.format(cents === 0 ? 0 : cents)
}

export function formatInteger(value) {
  const n = Number(value)
  return Number.isFinite(n) ? integer.format(n) : '—'
}

const MESES = {
  enero: 1, febrero: 2, marzo: 3, abril: 4, mayo: 5, junio: 6, julio: 7,
  agosto: 8, septiembre: 9, setiembre: 9, octubre: 10, noviembre: 11, diciembre: 12,
}

const pad = (n) => String(n).padStart(2, '0')

// Accepts ISO "2026-11-12" or Spanish "23 de octubre de 2026"; returns DD/MM/AAAA.
// Anything else is returned unchanged.
export function formatDate(value) {
  if (!value) return '—'
  const s = String(value).trim()
  const iso = /^(\d{4})-(\d{2})-(\d{2})/.exec(s)
  if (iso) return `${iso[3]}/${iso[2]}/${iso[1]}`
  const es = /^(\d{1,2})\s+de\s+([a-záéíóú]+)\s+de\s+(\d{4})$/i.exec(s)
  if (es) {
    const m = MESES[es[2].toLowerCase()]
    if (m) return `${pad(es[1])}/${pad(m)}/${es[3]}`
  }
  return s
}

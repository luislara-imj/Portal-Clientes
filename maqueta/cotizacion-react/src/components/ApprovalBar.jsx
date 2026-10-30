// Acción "Aceptar y arrancar campaña" con modal de confirmación (Órbita Modal Template, SM).
// Al aceptar, actualiza localStorage['obp-prototipo-v1'] (ver src/estadoCompartido.js).
// LIMITACIÓN: ese estado solo se comparte con las páginas HTML de maqueta/ si ambas se
// sirven desde el mismo origen (mismo protocolo, host y puerto).
import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { formatMoney } from '../format.js'
import { codigoDeCampana, marcarCampana } from '../estadoCompartido.js'

const TOAST_MS = 4000
const FOCUSABLE = 'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true" focusable="false">
      <path d="M5 5l10 10M15 5L5 15" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function valor(v) {
  return v === undefined || v === null || String(v).trim() === '' ? '—' : v
}

function contarMedios(secciones) {
  if (!Array.isArray(secciones) || secciones.length === 0) return undefined
  return secciones.reduce((n, s) => {
    if (Array.isArray(s?.filas)) return n + s.filas.length
    const c = Number(s?.cantidad_medios)
    return n + (Number.isFinite(c) ? c : 0)
  }, 0)
}

function ConfirmModal({ q, onCancel, onConfirm }) {
  const dialogRef = useRef(null)
  const titleId = useId()

  useEffect(() => {
    const dialog = dialogRef.current
    dialog?.querySelector(FOCUSABLE)?.focus()
    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onCancel()
        return
      }
      if (e.key !== 'Tab' || !dialog) return
      const items = Array.from(dialog.querySelectorAll(FOCUSABLE))
      if (items.length === 0) return
      const first = items[0]
      const last = items[items.length - 1]
      if (!dialog.contains(document.activeElement)) {
        e.preventDefault()
        first.focus()
      } else if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onCancel])

  const total = Number.isFinite(Number(q?.total)) && q?.total !== null && q?.total !== '' ? formatMoney(q.total) : undefined
  const datos = [
    ['Folio', q?.folio],
    ['Medios incluidos', contarMedios(q?.secciones)],
    ['Vigencia', q?.vigencia_texto],
    ['Total con IVA', total],
  ]

  return (
    <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onCancel()}>
      <div ref={dialogRef} className="modal" role="dialog" aria-modal="true" aria-labelledby={titleId}>
        <div className="modal-header">
          <h2 id={titleId} className="modal-title">Aceptar cotización</h2>
          <button type="button" className="modal-close" aria-label="Cerrar" onClick={onCancel}>
            <CloseIcon />
          </button>
        </div>
        <div className="modal-body">
          <p>Al aceptar, la campaña arranca y ya no podrás cambiar la selección de medios.</p>
          <dl className="modal-data">
            {datos.map(([label, v]) => (
              <div key={label} className="modal-data-row">
                <dt>{label}</dt>
                <dd>{valor(v)}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn--secondary" onClick={onCancel}>
            Cancelar
          </button>
          <button type="button" className="btn btn--primary" onClick={onConfirm}>
            Aceptar y arrancar campaña
          </button>
        </div>
      </div>
    </div>
  )
}

export default function ApprovalBar({ q }) {
  const [accepted, setAccepted] = useState(false)
  const [confirming, setConfirming] = useState(false)
  const [toast, setToast] = useState('')
  const openerRef = useRef(null)
  const toastTimer = useRef(null)

  const close = useCallback(() => {
    setConfirming(false)
    openerRef.current?.focus()
  }, [])

  const confirm = useCallback(() => {
    marcarCampana(codigoDeCampana(q), 'En instalación')
    setConfirming(false)
    setAccepted(true)
    openerRef.current?.focus()
    setToast('Campaña aceptada. Ya está en instalación.')
    clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(''), TOAST_MS)
  }, [q])

  useEffect(() => () => clearTimeout(toastTimer.current), [])

  return (
    <div className="approval-bar">
      {/* aria-disabled (no disabled) para que el foco pueda volver al botón tras aceptar. */}
      <button
        ref={openerRef}
        type="button"
        className="btn btn--primary"
        aria-disabled={accepted || undefined}
        onClick={() => !accepted && setConfirming(true)}
      >
        {accepted ? 'Campaña aceptada' : 'Aceptar y arrancar campaña'}
      </button>
      {confirming && <ConfirmModal q={q} onCancel={close} onConfirm={confirm} />}
      <div className="toast-region" role="status" aria-live="polite">
        {toast && <p className="toast">{toast}</p>}
      </div>
    </div>
  )
}

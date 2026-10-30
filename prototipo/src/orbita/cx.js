// Utilidades compartidas (sr-only, área táctil, radios, foco): todo componente importa cx,
// así que base.css se carga aunque el componente se importe suelto.
import './base.css';

// Une nombres de clase ignorando valores falsos.
export function cx(...args) {
  return args.filter(Boolean).join(' ');
}

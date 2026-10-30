import { Switch } from '../../orbita';
import { claveDe } from './formatos.js';

const OPCIONES = [
  { value: 'si', label: 'Sí' },
  { value: 'no', label: 'No' }
];

/**
 * Respuesta Sí / No de un medio: Switch segmentado de Órbita, tamaño md.
 * valor: 'si' | 'no' | undefined (vacío = sin responder; nunca hay No implícito).
 * readOnly: fase en consulta (muestra la respuesta sin permitir cambiarla).
 */
export function SiNo({ medio, valor, onResponder, readOnly }) {
  return (
    <Switch
      size="md"
      label={`¿Incluyes ${claveDe(medio)}?`}
      options={OPCIONES}
      value={valor ?? null}
      readOnly={readOnly}
      onChange={(v) => onResponder?.(medio.id, v)}
    />
  );
}

export default SiNo;

// Opciones del modal de una campaña (Mis campañas → marca → tarjeta): las 4 fases del store más
// "Carga de artes", en el orden en que el cliente las recorre. Puro: recibe fasesDeCampana y el conteo de artes.

const DEF = {
  propuesta: { nombre: 'Propuesta', icono: 'billboard' },
  cotizacion: { nombre: 'Cotización', icono: 'invoice' },
  artes: { nombre: 'Carga de artes', icono: 'paintbrush' },
  instalacion: { nombre: 'Instalación', icono: 'tools' },
  reportes: { nombre: 'Reportes', icono: 'chart-line' }
};

export const ORDEN_OPCIONES = ['propuesta', 'cotizacion', 'artes', 'instalacion', 'reportes'];

const MOTIVO_EJEMPLO = 'Campaña de ejemplo: no tiene información para consultar.';

/**
 * fases: fasesDeCampana(codigo) ([] en campañas de ejemplo) · artes: archivos subidos.
 * Devuelve [{ clave, nombre, icono, estado: 'activa' | 'consulta' | 'bloqueada', motivo, actual, artes? }].
 * Artes se habilita junto con la cotización (ya hay medios elegidos) y se queda abierta después;
 * con al menos un arte cargado queda completada (se puede seguir abriendo para subir más).
 * `actual` marca la fase más avanzada que no está bloqueada (dónde va la campaña). Las fases anteriores a
 * la actual ya se cumplieron: se muestran completadas aunque sigan abiertas (p. ej. la propuesta se puede
 * ajustar hasta aceptar la cotización).
 */
export function opcionesDeCampana(fases, artes = 0) {
  const porClave = Object.fromEntries(fases.map((f) => [f.clave, f]));
  const cot = porClave.cotizacion;
  const opciones = ORDEN_OPCIONES.map((clave) => {
    const def = DEF[clave];
    if (clave === 'artes') {
      const bloqueada = !cot || cot.estado === 'bloqueada';
      return {
        clave,
        ...def,
        estado: bloqueada ? 'bloqueada' : artes > 0 ? 'consulta' : 'activa',
        motivo: bloqueada ? (cot ? 'Confirma tu selección de medios para subir tus artes.' : MOTIVO_EJEMPLO) : null,
        actual: false,
        artes
      };
    }
    const f = porClave[clave];
    if (!f) return { clave, ...def, estado: 'bloqueada', motivo: MOTIVO_EJEMPLO, actual: false };
    return { clave, ...def, estado: f.estado, motivo: f.motivo, actual: false };
  });
  const actual = [...opciones].reverse().find((o) => o.clave !== 'artes' && o.estado !== 'bloqueada');
  if (actual) {
    actual.actual = true;
    const hasta = opciones.indexOf(actual);
    opciones.forEach((o, i) => {
      if (i < hasta && o.clave !== 'artes' && o.estado === 'activa') o.estado = 'consulta';
    });
  }
  return opciones;
}

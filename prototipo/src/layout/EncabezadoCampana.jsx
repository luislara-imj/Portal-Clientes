import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Alert, Badge, Stepper } from '../orbita';
import { CAMPANA_FLUJO } from '../data/semilla.js';
import { useStore } from '../store/index.js';
import { badgeDeFase, hrefCampana, vigencia } from './campanas.js';
import './layout.css';

const ESTADO_PASO = { activa: 'current', consulta: 'complete', bloqueada: 'pending' };

// Hasta 600 px el Stepper va vertical para que ningún paso quede cortado.
const CONSULTA_MOVIL = '(max-width: 600px)';

function useEsMovil() {
  const [movil, setMovil] = useState(() =>
    typeof window !== 'undefined' && !!window.matchMedia && window.matchMedia(CONSULTA_MOVIL).matches
  );
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return undefined;
    const mq = window.matchMedia(CONSULTA_MOVIL);
    const alCambiar = (e) => setMovil(e.matches);
    setMovil(mq.matches);
    if (mq.addEventListener) {
      mq.addEventListener('change', alCambiar);
      return () => mq.removeEventListener('change', alCambiar);
    }
    mq.addListener(alCambiar);
    return () => mq.removeListener(alCambiar);
  }, []);
  return movil;
}

/**
 * Lee :codigo de la ruta y devuelve la campaña de la semilla (campanaFija: codigo, nombre,
 * inicio, fin, medios…) con su `fase` actual del store, o null si no existe.
 */
export function useCampanaDeRuta() {
  const { codigo } = useParams();
  const s = useStore();
  const fija = codigo ? s.campana(codigo) : null;
  const fase = fija ? s.estado.campanas[codigo]?.fase : undefined;
  return useMemo(() => (fija && fase ? { ...fija, fase } : null), [fija, fase]);
}

/**
 * Encabezado del detalle y de cada fase: nombre, código, Badge de la fase, vigencia y Stepper
 * de las 4 fases (fasesDeCampana). `fase`: clave de la página actual ('propuesta' | 'cotizacion'
 * | 'instalacion' | 'reportes'); si está en consulta se muestra el aviso "Fase cerrada · solo consulta".
 * Si está activa en una campaña que no recorre el flujo (todas menos Alpina), avisa que es solo de consulta.
 */
export function EncabezadoCampana({ codigo, fase }) {
  const s = useStore();
  const movil = useEsMovil();
  const campana = s.campana(codigo);
  const estado = s.estado.campanas[codigo];
  if (!campana || !estado) return null;

  const fases = s.fasesDeCampana(codigo);
  const badge = badgeDeFase(estado.fase);
  const actual = fase ? fases.find((f) => f.clave === fase) : null;

  const steps = fases.map((f) => ({
    title: f.nombre,
    status: ESTADO_PASO[f.estado],
    locked: f.estado === 'bloqueada',
    reason: f.motivo,
    href: f.estado === 'bloqueada' ? undefined : hrefCampana(codigo, f.clave)
  }));

  return (
    <header className="enc">
      <div className="pg-pila">
        <div className="pg-fila">
          <Badge color={badge.color} theme="soft" icon={badge.icon}>
            {estado.fase}
          </Badge>
        </div>
        <h1 className="pg-titulo">{campana.nombre}</h1>
        <p className="pg-meta">{codigo}</p>
        <p className="pg-texto">Vigencia: {vigencia(campana.inicio, campana.fin)}</p>
      </div>
      <Stepper steps={steps} orientation={movil ? 'vertical' : 'horizontal'} label="Fases de la campaña" />
      {actual?.estado === 'consulta' && <Alert stage="info" title="Fase cerrada · solo consulta" />}
      {actual?.estado === 'activa' && !actual.editable && codigo !== CAMPANA_FLUJO && (
        <Alert stage="info" title="Esta campaña es solo de consulta en el prototipo." />
      )}
    </header>
  );
}

export default EncabezadoCampana;

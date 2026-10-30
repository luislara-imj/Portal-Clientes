import { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Badge, Card, Icon, IconButton, cx, useFocusTrap } from '../../orbita';
import { formatoFecha } from '../../store/index.js';
import { DURACION_PASO, PASOS, estadoPasos } from './pasos.js';

// Ícono por tipo de medio y para plaza. Font Awesome Free no tiene house-user, city, truck ni bicycle
// (los de Figma): se usa el equivalente más cercano disponible en Icon de Órbita.
export const ICONO_TIPO = {
  sitios: 'billboard',
  camiones: 'bus',
  indoor: 'building',
  vallas: 'megaphone',
  riders: 'user'
};
export const ICONO_PLAZA = 'location';

// Estatus del medio → Badge (siempre ícono y texto).
const BADGE_ESTATUS = {
  'Por instalar': { color: 'gray', icon: 'calendar' },
  'En instalación': { color: 'accent', icon: 'refresh' },
  Instalado: { color: 'success', icon: 'check' }
};

export function BadgeEstatus({ estatus }) {
  const b = BADGE_ESTATUS[estatus] || BADGE_ESTATUS['Por instalar'];
  return (
    <Badge color={b.color} theme="soft" size="sm" icon={b.icon}>
      {estatus}
    </Badge>
  );
}

const CONSULTA_MOVIL = '(max-width: 767px)';

export function useEsMovil() {
  const [movil, setMovil] = useState(
    () => typeof window !== 'undefined' && !!window.matchMedia && window.matchMedia(CONSULTA_MOVIL).matches
  );
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return undefined;
    const mq = window.matchMedia(CONSULTA_MOVIL);
    const alCambiar = (e) => setMovil(e.matches);
    setMovil(mq.matches);
    mq.addEventListener('change', alCambiar);
    return () => mq.removeEventListener('change', alCambiar);
  }, []);
  return movil;
}

// Anillo de porcentaje (Figma "Component 1"): aro de 48 con el valor en un círculo de 40.
export function Anillo({ valor }) {
  const p = Math.max(0, Math.min(100, Math.round(Number(valor) || 0)));
  return (
    <span className="ins-anillo" style={{ '--ins-p': p }}>
      <span className="ins-anillo__valor">{p}%</span>
    </span>
  );
}

const etiquetaInstalados = (r) => `${r.instalados} de ${r.total} instalados`;

/**
 * Tarjeta de tipo de medio o de plaza.
 * estado: 'elegido' (fondo brand pressed) | 'activo' (borde brand) | 'resto' (superficie)
 */
export function TarjetaAvance({ icono, nombre, resumen, estado, horizontal, onClick }) {
  return (
    <Card
      padding="none"
      onClick={onClick}
      aria-pressed={estado !== 'resto'}
      className={cx('ins-tarjeta', `ins-tarjeta--${estado}`, horizontal && 'ins-tarjeta--horizontal')}
    >
      <span className="ins-tarjeta__cabeza">
        <Icon name={icono} size={32} className="ins-tarjeta__icono" />
        <span className="ins-tarjeta__nombre">{nombre}</span>
      </span>
      <span className="ins-tarjeta__avance">
        <Anillo valor={resumen.porcentaje} />
        <span className="ins-tarjeta__sub">{etiquetaInstalados(resumen)}</span>
      </span>
    </Card>
  );
}

// Clave del medio y segunda línea según el tipo.
export function textosMedio(fila, medio) {
  const titulo = fila.clave || fila.nombre;
  let detalle = fila.direccion || '';
  if (medio) {
    if (fila.tipo === 'indoor') detalle = `${medio.inmueble} · ${medio.nivel}, ${medio.area}`;
    else if (fila.tipo === 'camiones') {
      const n = medio.unidades || 1;
      detalle = `${medio.direccion} · ${n} ${n === 1 ? 'unidad' : 'unidades'}`;
    } else if (fila.tipo === 'vallas' || fila.tipo === 'riders') detalle = medio.descripcion || fila.formato;
  }
  return { titulo, detalle };
}

export function TarjetaSitio({ titulo, detalle, fila, elegido, onClick }) {
  return (
    <Card
      padding="none"
      onClick={onClick}
      aria-haspopup="dialog"
      className={cx('ins-sitio', elegido ? 'ins-tarjeta--elegido' : 'ins-tarjeta--resto')}
    >
      <span className="ins-sitio__texto">
        <span className="ins-sitio__clave">{titulo}</span>
        <span className="ins-sitio__detalle">{detalle}</span>
        <span className="ins-sitio__estatus">
          <BadgeEstatus estatus={fila.estatus} />
        </span>
      </span>
      <Anillo valor={fila.porcentaje} />
    </Card>
  );
}

// Marcador vacío de una columna antes de elegir en la anterior.
export function Marcador({ titulo, ayuda }) {
  return (
    <div className="ins-marcador">
      <span className="ins-marcador__titulo">
        <Icon name="plus" size={16} />
        {titulo}
      </span>
      <span className="ins-marcador__ayuda">{ayuda}</span>
    </div>
  );
}

const MARCA_PASO = { completo: 'Completado', actual: 'Paso actual', pendiente: 'Pendiente' };

/**
 * Panel lateral "Línea de tiempo" de un medio (Figma: panel brand a la derecha con 7 pasos).
 * Diálogo modal: foco atrapado, Escape y X cierran, el fondo cierra al hacer clic.
 */
export function PanelLineaDeTiempo({ abierto, titulo, fila, onCerrar }) {
  const panelRef = useRef(null);
  const cerrarRef = useRef(null);
  const tituloId = useId();
  useFocusTrap(panelRef, abierto, { onEscape: onCerrar, initialFocusRef: cerrarRef });
  if (!abierto || !fila) return null;
  const pasos = estadoPasos(fila.porcentaje);

  return createPortal(
    <div className="ins-panel-capa">
      <div className="ins-panel-fondo" aria-hidden="true" onClick={onCerrar} />
      <div ref={panelRef} role="dialog" aria-modal="true" aria-labelledby={tituloId} tabIndex={-1} className="ins-panel">
        <div className="ins-panel__cabeza">
          <div className="ins-panel__titulos">
            <p className="ins-panel__kicker">Línea de tiempo</p>
            <h2 id={tituloId} className="ins-panel__titulo">{titulo}</h2>
          </div>
          <IconButton ref={cerrarRef} icon="x" label="Cerrar línea de tiempo" variant="primary" size="xs" pill="pill" onClick={onCerrar} />
        </div>
        <div className="ins-panel__meta">
          <p className="ins-panel__fechas">
            <span><strong>Inicio:</strong> {formatoFecha(fila.inicio)}</span>
            <span><strong>Fin:</strong> {formatoFecha(fila.fin)}</span>
          </p>
          <p className="ins-panel__estimado">Tiempo estimado: {PASOS.length} días hábiles</p>
        </div>
        <ol className="ins-pasos">
          {pasos.map((p) => (
            <li key={p.numero} className={cx('ins-paso', `ins-paso--${p.estado}`)} aria-current={p.estado === 'actual' ? 'step' : undefined}>
              <span className="ins-paso__marca" aria-hidden="true">
                {p.estado === 'completo' && <Icon name="check" size={16} />}
                {p.estado === 'actual' && <span className="ins-paso__punto" />}
                {p.estado === 'pendiente' && p.numero}
              </span>
              <span className="ins-paso__texto">
                <span className="ins-paso__duracion">{DURACION_PASO}</span>
                <span className="ins-paso__nombre">
                  <span className="ui-sr-only">Paso {p.numero}: </span>
                  {p.nombre}
                  <span className="ui-sr-only"> ({MARCA_PASO[p.estado]})</span>
                </span>
              </span>
            </li>
          ))}
        </ol>
      </div>
    </div>,
    document.body
  );
}

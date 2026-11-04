import { useState } from 'react';
import { Icon, cx } from '../orbita';
import { useStore } from '../store/index.js';
import { hrefCampana } from './campanas.js';
import { opcionesDeCampana } from './opcionesCampana.js';
import './modal-campana.css';

// Estado que se lee bajo el nombre en la versión grande (portada).
const ESTADO = { activa: 'Disponible', consulta: 'Completada', bloqueada: 'Bloqueada' };

// Botón cuadrado de una sección: ícono grande y nombre. Completada lleva check; bloqueada, candado.
function Opcion({ o, grande, href, onClick, onBloqueada }) {
  const bloqueada = o.estado === 'bloqueada';
  const clase = cx('cm-opcion', `is-${o.estado}`, o.actual && 'is-actual');
  const contenido = (
    <>
      <span className="cm-icono" aria-hidden="true"><Icon name={o.icono} size={grande ? 32 : 24} /></span>
      <span className="cm-nombre">{o.nombre}</span>
      {grande && <span className="cm-estado-texto">{o.actual ? 'Aquí vas' : ESTADO[o.estado]}</span>}
      {bloqueada && <span className="cm-marca cm-marca--candado" aria-hidden="true"><Icon name="lock" size={10} /></span>}
      {o.estado === 'consulta' && <span className="cm-marca cm-marca--check" aria-hidden="true"><Icon name="check" size={10} /></span>}
    </>
  );
  if (bloqueada) {
    // Sigue siendo un botón (enfocable) para poder explicar por qué está bloqueada.
    return (
      <button type="button" className={clase} aria-disabled="true" aria-label={`${o.nombre}: bloqueada`} onClick={onBloqueada} onMouseEnter={onBloqueada} onFocus={onBloqueada}>
        {contenido}
      </button>
    );
  }
  const etiqueta = o.actual ? `${o.nombre}: aquí va tu campaña` : o.nombre;
  if (href) return <a className={clase} href={href} aria-label={etiqueta}>{contenido}</a>;
  return <button type="button" className={clase} aria-label={etiqueta} onClick={onClick}>{contenido}</button>;
}

/**
 * Las 5 secciones de una campaña como botones cuadrados con ícono (Propuesta, Cotización, Carga de artes,
 * Instalación y Reportes) y, debajo, el motivo de la sección bloqueada que se pasó o tocó.
 * La usan el modal de secciones y la portada de campaña única (grande).
 * c: { codigo?, nombre } · grande: tamaño de la portada · onAbrirArtes(codigo)
 */
export function SeccionesCampana({ c, grande = false, onAbrirArtes }) {
  const s = useStore();
  const [aviso, setAviso] = useState(null);
  const fases = c.codigo ? s.fasesDeCampana(c.codigo) : [];
  const artes = c.codigo ? s.archivos(c.codigo).length : 0;
  const opciones = opcionesDeCampana(fases, artes);

  return (
    <div className={cx('cm-secciones', grande && 'cm-secciones--grande')}>
      <ul className="cm-opciones" aria-label={`Secciones de ${c.nombre}`}>
        {opciones.map((o) => (
          <li key={o.clave}>
            <Opcion
              o={o}
              grande={grande}
              href={o.clave === 'artes' ? null : hrefCampana(c.codigo, o.clave)}
              onClick={() => onAbrirArtes(c.codigo)}
              onBloqueada={() => setAviso(o)}
            />
          </li>
        ))}
      </ul>
      <p className={cx('cm-aviso', aviso && 'is-visible')} role="status">
        {aviso && (
          <>
            <Icon name="lock" size={10} />
            <span><strong>{aviso.nombre}:</strong> {aviso.motivo}</span>
          </>
        )}
      </p>
    </div>
  );
}

export default SeccionesCampana;

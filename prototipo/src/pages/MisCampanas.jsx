import { Navigate } from 'react-router-dom';
import { Icon } from '../orbita';
import { FASES_ACCION_CLIENTE, useStore } from '../store/index.js';
import { AppShell } from '../layout/AppShell.jsx';
import { EstadoVacio } from '../layout/EstadoVacio.jsx';
import { fechaLocal } from '../data/fechas.js';
import { CARPETAS, campanasDeMarca, hrefCarpeta, textoConteo } from '../layout/carpetas.js';
import '../layout/layout.css';
import '../layout/carpetas.css';

const HOJAS = [0, 1, 2];

// Parte trasera de la carpeta con la pestaña arriba a la izquierda. viewBox 110×100 (proporción de la carpeta).
const FORMA_TRASERA =
  'M0 20 Q0 4 14 4 H38 Q44 4 47.5 9 L50.5 13.5 Q53 17 58 17 H96 Q110 17 110 31 V90 Q110 100 100 100 H10 Q0 100 0 90 Z';

// Hoja de fondo: arte de la campaña (si existe) o hoja blanca con líneas simuladas.
function Hoja({ indice, src }) {
  return (
    <span className={`cp-hoja cp-hoja--${indice + 1}`}>
      {src ? (
        <img className="cp-hoja-img" src={src} alt="" loading="lazy" decoding="async" />
      ) : (
        <>
          <span className="cp-hoja-linea" />
          <span className="cp-hoja-linea" />
          <span className="cp-hoja-linea" />
        </>
      )}
    </span>
  );
}

// Pastilla de la esquina: ejemplo, acción pendiente o al día.
function estadoDe(marca, campanas) {
  if (marca.ejemplo) return { icono: 'info', texto: 'Ejemplo', tono: 'neutro' };
  if (campanas.some((c) => FASES_ACCION_CLIENTE.includes(c.fase))) return { icono: 'warning', texto: 'Acción pendiente', tono: 'pendiente' };
  return { icono: 'check', texto: 'Al día', tono: 'listo' };
}

/**
 * Carpeta de una marca: parte trasera con pestaña en el azul de OBP, las hojas con los
 * artes asomando y el frente de vidrio esmerilado con estado, nombre, campañas activas, conteo y asa.
 * Siempre oscura: data-theme="dark" hace que los tokens de la carpeta tomen su valor oscuro.
 * Reales: enlace a la carpeta. Ejemplo: no navega (solo ilustrativa).
 */
function Carpeta({ marca, campanas, artes = [] }) {
  const lista = Array.isArray(artes) ? artes : [];
  const hoy = fechaLocal(Date.now());
  const activas = campanas.filter((c) => c.fin >= hoy).length;
  const estado = estadoDe(marca, campanas);
  const contenido = (
    <>
      <svg className="cp-trasera" viewBox="0 0 110 100" preserveAspectRatio="none" aria-hidden="true" focusable="false">
        <path d={FORMA_TRASERA} />
      </svg>
      <span className="cp-hojas" aria-hidden="true">
        {HOJAS.map((i) => (
          <Hoja key={i} indice={i} src={lista[i]} />
        ))}
      </span>
      <span className="cp-frente">
        <span className={`cp-estado cp-estado--${estado.tono}`}>
          <Icon name={estado.icono} size={10} />
          {estado.texto}
        </span>
        <span className="cp-cuerpo">
          <span className="cp-textos">
            <span className="cp-nombre">{marca.nombre}</span>
            <span className="cp-conteo">{activas === 1 ? '1 activa' : `${activas} activas`}</span>
          </span>
          <span className="cp-total">{textoConteo(campanas.length)}</span>
        </span>
        <span className="cp-asa" aria-hidden="true" />
      </span>
    </>
  );
  const clase = 'cp-carpeta';
  if (marca.ejemplo) {
    return (
      <div className={`${clase} is-ejemplo`} data-theme="dark" role="link" aria-disabled="true" title="Solo ilustrativo">
        {contenido}
      </div>
    );
  }
  return (
    <a className={`${clase} ui-focus-ring`} data-theme="dark" href={hrefCarpeta(marca.slug)}>
      {contenido}
    </a>
  );
}

export default function MisCampanas() {
  const s = useStore();
  // Navegación adaptativa: con una sola marca no se muestra la carpeta, se entra directo a ella.
  if (CARPETAS.length === 1) return <Navigate to={`/campanas/carpeta/${encodeURIComponent(CARPETAS[0].slug)}`} replace />;
  return (
    <AppShell titulo="Portal de clientes" subtitulo="Mis campañas">
      {CARPETAS.length === 0 ? (
        <EstadoVacio
          tarjeta
          tamano="pagina"
          icono="megaphone"
          titulo="Aún no tienes campañas"
          descripcion="Cuando tu ejecutivo de IMJ prepare tu primera propuesta, aparecerá aquí organizada por marca."
          nota="¿Quieres empezar una campaña? Contacta a tu ejecutivo de IMJ."
        />
      ) : (
        <ul className="cp-rejilla" aria-label="Marcas">
          {CARPETAS.map((marca) => (
            <li key={marca.slug}>
              <Carpeta
                marca={marca}
                campanas={campanasDeMarca(marca, s)}
                artes={marca.artes ?? []}
              />
            </li>
          ))}
        </ul>
      )}
    </AppShell>
  );
}

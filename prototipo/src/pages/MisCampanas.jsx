import { Badge, Icon } from '../orbita';
import { useStore } from '../store/index.js';
import { AppShell } from '../layout/AppShell.jsx';
import { colorDeMarca } from '../layout/marcas.js';
import { CARPETAS, campanasDeMarca, hrefCarpeta, textoConteo } from '../layout/carpetas.js';
import '../layout/layout.css';
import '../layout/carpetas.css';

const HOJAS = [0, 1, 2];

// Cuerpo oscuro de la carpeta: cubre la mitad inferior y su borde superior sube en curva
// hacia la derecha (pestaña). viewBox 100×100 sobre una carpeta cuadrada.
const FORMA_CUERPO =
  'M0 100 V60 Q0 55 5 55 H40 C48 55 50 45 58 45 H100 V100 Z';

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

// Carpeta de una marca: zona de color con hojas/artes arriba y cuerpo oscuro con nombre + conteo.
// Reales: enlace a la carpeta. Ejemplo: no navega (solo ilustrativa).
function Carpeta({ marca, color, total, artes = [] }) {
  const lista = Array.isArray(artes) ? artes : [];
  const conteo = textoConteo(total);
  const contenido = (
    <>
      <span className="cp-zona" aria-hidden="true">
        <span className="cp-hojas">
          {HOJAS.map((i) => (
            <Hoja key={i} indice={i} src={lista[i]} />
          ))}
        </span>
      </span>
      {marca.ejemplo && (
        <Badge color="gray" theme="soft" className="cp-ejemplo">
          Ejemplo
        </Badge>
      )}
      <svg className="cp-forma" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" focusable="false">
        <path d={FORMA_CUERPO} />
      </svg>
      <span className="cp-cuerpo">
        <span className="cp-nombre">{marca.nombre}</span>
        <span className="cp-conteo">{conteo}</span>
        <span className="cp-pie" aria-hidden="true">
          <Icon name="megaphone" size={10} />
          {conteo}
        </span>
      </span>
    </>
  );
  const clase = `cp-carpeta cp-carpeta--${color}`;
  if (marca.ejemplo) {
    return (
      <div className={`${clase} is-ejemplo`} role="link" aria-disabled="true" title="Solo ilustrativo">
        {contenido}
      </div>
    );
  }
  return (
    <a className={`${clase} ui-focus-ring`} href={hrefCarpeta(marca.slug)}>
      {contenido}
    </a>
  );
}

export default function MisCampanas() {
  const s = useStore();
  return (
    <AppShell titulo="Mis campañas" migas={[{ label: 'Mis campañas' }]}>
      <ul className="cp-rejilla" aria-label="Marcas">
        {CARPETAS.map((marca, i) => (
          <li key={marca.slug}>
            <Carpeta
              marca={marca}
              color={colorDeMarca(i)}
              total={campanasDeMarca(marca, s).length}
              artes={marca.artes ?? []}
            />
          </li>
        ))}
      </ul>
    </AppShell>
  );
}

import { Navigate, useParams } from 'react-router-dom';
import { Badge, Button, Icon, Picture, Popover } from '../orbita';
import { useStore } from '../store/index.js';
import { AppShell } from '../layout/AppShell.jsx';
import { badgeDeFase, FASES_CAMPANA, hrefCampana } from '../layout/campanas.js';
import { campanasDeMarca, carpetaPorSlug, vigenciaCorta } from '../layout/carpetas.js';
import '../layout/layout.css';
import '../layout/carpetas.css';

// Estado de la fase (fasesDeCampana) → texto de la fila. 'consulta' = fase cerrada.
const TEXTO_ESTADO = { activa: 'En curso', consulta: 'Cerrada', bloqueada: 'Bloqueada' };

// Lista de las 4 fases (orden de FASES_CAMPANA). Bloqueada: fila deshabilitada, sin enlace.
// Activa o cerrada: enlace a la página de la fase; la cerrada lleva ícono de check.
function ListaFases({ codigo, nombre }) {
  const s = useStore();
  const fases = s.fasesDeCampana(codigo);
  return (
    <ul role="list" className="cp-fases" aria-label={`Fases de ${nombre}`}>
      {FASES_CAMPANA.map((clave) => {
        const f = fases.find((x) => x.clave === clave);
        if (!f) return null;
        const estado = (
          <span className="cp-fase-estado">
            {f.estado === 'consulta' && <Icon name="check" size={16} className="cp-fase-check" />}
            {TEXTO_ESTADO[f.estado]}
          </span>
        );
        if (f.estado === 'bloqueada') {
          return (
            <li key={clave}>
              <span className="cp-fase is-bloqueada" aria-disabled="true">
                <span className="cp-fase-nombre">{f.nombre}</span>
                {estado}
              </span>
            </li>
          );
        }
        return (
          <li key={clave}>
            <a className="cp-fase ui-focus-ring" href={hrefCampana(codigo, clave)}>
              <span className="cp-fase-nombre">{f.nombre}</span>
              {estado}
            </a>
          </li>
        );
      })}
    </ul>
  );
}

// Tarjeta de campaña: arte 4:5 (vacío si no hay `arte`) con el estatus arriba a la derecha,
// nombre y vigencia, y el botón "Fases" que abre la lista de fases. Ejemplo: botón deshabilitado.
function TarjetaCampana({ c }) {
  const badge = badgeDeFase(c.fase);
  const boton = (
    <Button variant="primary" size="xs" pill="pill" iconRight="chevron-down" className="cp-tarjeta-boton">
      Fases
    </Button>
  );
  return (
    <article className="cp-tarjeta">
      <div className="cp-tarjeta-imagen">
        <Picture src={c.arte} radius="none" fill />
        <Badge color={badge.color} theme="soft" icon={badge.icon} className="cp-tarjeta-badge">
          {c.fase}
        </Badge>
      </div>
      <div className="cp-tarjeta-cuerpo">
        <h3 className="cp-tarjeta-nombre" title={c.nombre}>{c.nombre}</h3>
        <p className="cp-tarjeta-fecha">{vigenciaCorta(c.inicio, c.fin)}</p>
        <div className="cp-tarjeta-pie">
          {c.codigo ? (
            <Popover trigger={boton} placement="bottom" align="end" showClose={false}>
              <ListaFases codigo={c.codigo} nombre={c.nombre} />
            </Popover>
          ) : (
            <Button
              variant="primary"
              size="xs"
              pill="pill"
              iconRight="chevron-down"
              className="cp-tarjeta-boton"
              disabled
              aria-disabled="true"
            >
              Fases
            </Button>
          )}
        </div>
      </div>
    </article>
  );
}

export default function CarpetaMarca() {
  const s = useStore();
  const { marca: slug } = useParams();
  const marca = carpetaPorSlug(slug);
  if (!marca) return <Navigate to="/campanas" replace />;
  const campanas = campanasDeMarca(marca, s);

  return (
    <AppShell
      titulo={marca.nombre}
      migas={[{ label: 'Mis campañas', href: '#/campanas' }, { label: marca.nombre }]}
      volver={{ label: 'Volver a Mis campañas', ruta: '/campanas' }}
    >
      <ul className="cp-rejilla cp-rejilla--tarjetas" aria-label={`Campañas de ${marca.nombre}`}>
        {campanas.map((c) => (
          <li key={c.clave}>
            <TarjetaCampana c={c} />
          </li>
        ))}
      </ul>
    </AppShell>
  );
}

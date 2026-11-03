import { Navigate, useParams } from 'react-router-dom';
import { Badge, Card, Picture } from '../orbita';
import { useStore } from '../store/index.js';
import { AppShell } from '../layout/AppShell.jsx';
import { badgeDeFase, hrefCampana } from '../layout/campanas.js';
import { campanasDeMarca, carpetaPorSlug, vigenciaCorta } from '../layout/carpetas.js';
import '../layout/layout.css';
import '../layout/carpetas.css';

// Tarjeta de campaña con foto: foto 16:9 (vacía si no hay `arte`), nombre, vigencia corta y fase.
// Real: la tarjeta entera es enlace al detalle. Ejemplo: no es enlace.
function TarjetaCampanaFoto({ c, arte }) {
  const badge = badgeDeFase(c.fase);
  const contenido = (
    <>
      <Picture src={arte} ratio="16:9" radius="sm" className="cp-foto" />
      <span className="cp-tarjeta-cuerpo">
        <span className="cp-tarjeta-nombre">{c.nombre}</span>
        <span className="cp-tarjeta-fecha">{vigenciaCorta(c.inicio, c.fin)}</span>
        <Badge color={badge.color} theme="soft" icon={badge.icon} className="cp-tarjeta-badge">
          {c.fase}
        </Badge>
      </span>
    </>
  );
  if (c.codigo) {
    return (
      <Card href={hrefCampana(c.codigo)} padding="sm" className="cp-tarjeta">
        {contenido}
      </Card>
    );
  }
  return (
    <Card as="article" padding="sm" className="cp-tarjeta">
      {contenido}
    </Card>
  );
}

export default function CarpetaMarca() {
  const s = useStore();
  const { marca: slug } = useParams();
  const marca = carpetaPorSlug(slug);
  if (!marca) return <Navigate to="/campanas" replace />;
  const campanas = campanasDeMarca(marca, s);

  return (
    <AppShell titulo={marca.nombre} migas={[{ label: 'Mis campañas', href: '#/campanas' }, { label: marca.nombre }]}>
      <ul className="cp-rejilla cp-rejilla--tarjetas" aria-label={`Campañas de ${marca.nombre}`}>
        {campanas.map((c) => (
          <li key={c.clave}>
            <TarjetaCampanaFoto c={c} arte={c.arte} />
          </li>
        ))}
      </ul>
    </AppShell>
  );
}

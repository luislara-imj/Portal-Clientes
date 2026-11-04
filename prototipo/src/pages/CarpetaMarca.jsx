import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Badge, Icon, Picture } from '../orbita';
import { useStore } from '../store/index.js';
import { AppShell } from '../layout/AppShell.jsx';
import { ModalArtes } from '../layout/ArtesCampana.jsx';
import { ModalCampana } from '../layout/ModalCampana.jsx';
import { EjecutivoCampana } from '../layout/EjecutivoCampana.jsx';
import { PortadaCampana } from '../layout/PortadaCampana.jsx';
import { EstadoVacio } from '../layout/EstadoVacio.jsx';
import { ArteVacio } from '../layout/ArteVacio.jsx';
import { NoEncontrada } from '../layout/NoEncontrada.jsx';
import { badgeDeFase } from '../layout/campanas.js';
import { CARPETAS, campanasDeMarca, carpetaPorSlug, vigenciaCorta } from '../layout/carpetas.js';
import '../layout/layout.css';
import '../layout/carpetas.css';

// Tarjeta de campaña: arte 16:9 (vacío si no hay `arte`) con el estatus arriba a la derecha, nombre,
// vigencia, el ejecutivo de IMJ responsable (con enlaces para escribir o llamar) y "Ver campaña".
// La parte de arriba y "Ver campaña" abren el modal con las secciones; los enlaces del ejecutivo no.
function TarjetaCampana({ c, onAbrir }) {
  const badge = badgeDeFase(c.fase);
  return (
    <article className="cp-tarjeta cp-tarjeta--boton" aria-label={c.nombre}>
      <button type="button" className="cp-tarjeta-principal" aria-haspopup="dialog" onClick={onAbrir}>
        <span className="cp-tarjeta-imagen">
          <Picture src={c.arte} radius="none" fill vacio={<ArteVacio compacto />} />
          <Badge color={badge.color} theme="soft" icon={badge.icon} className="cp-tarjeta-badge">
            {c.fase}
          </Badge>
        </span>
        <span className="cp-tarjeta-cuerpo">
          <span className="cp-tarjeta-nombre" title={c.nombre}>{c.nombre}</span>
          <span className="cp-tarjeta-fecha">{vigenciaCorta(c.inicio, c.fin)}</span>
        </span>
      </button>
      <EjecutivoCampana codigo={c.codigo} compacto />
      <button type="button" className="cp-tarjeta-abrir" aria-haspopup="dialog" onClick={onAbrir}>
        Ver campaña <Icon name="arrow-right" size={16} className="cp-tarjeta-abrir__flecha" />
      </button>
    </article>
  );
}

export default function CarpetaMarca() {
  const s = useStore();
  const navigate = useNavigate();
  const { marca: slug } = useParams();
  const [abierta, setAbierta] = useState(null);
  const [artes, setArtes] = useState(null);
  const marca = carpetaPorSlug(slug);
  if (!marca) {
    return (
      <AppShell titulo="Marca no encontrada" migas={[{ label: 'Mis campañas', href: '#/campanas' }, { label: 'Marca no encontrada' }]}>
        <NoEncontrada titulo="No encontramos esta marca" descripcion="El enlace puede estar incompleto o la marca ya no está disponible en tu cuenta." />
      </AppShell>
    );
  }
  const campanas = campanasDeMarca(marca, s);
  // Navegación adaptativa: con una sola marca no hay a dónde volver (Mis campañas redirige aquí).
  const unicaMarca = CARPETAS.length === 1;
  const abrirArtes = (codigo) => {
    setAbierta(null);
    setArtes(codigo);
  };

  return (
    <AppShell
      titulo={marca.nombre}
      migas={[{ label: 'Mis campañas', href: unicaMarca ? undefined : '#/campanas' }, { label: marca.nombre }]}
      volver={unicaMarca ? undefined : { label: 'Volver a Mis campañas', ruta: '/campanas' }}
    >
      {campanas.length === 0 ? (
        <EstadoVacio
          tarjeta
          tamano="pagina"
          icono="megaphone"
          titulo={`${marca.nombre} aún no tiene campañas`}
          descripcion="Cuando tu ejecutivo de IMJ prepare una propuesta para esta marca, la verás aquí."
          acciones={unicaMarca ? [] : [{ label: 'Ir a Mis campañas', icono: 'arrow-left', variant: 'secondary', onClick: () => navigate('/campanas') }]}
        />
      ) : campanas.length === 1 ? (
        // Flujo alterno: una sola campaña → su portada con las secciones, sin tarjeta ni modal intermedio.
        <PortadaCampana c={campanas[0]} onAbrirArtes={abrirArtes} />
      ) : (
        <ul className="cp-rejilla cp-rejilla--tarjetas cp-rejilla--campanas" aria-label={`Campañas de ${marca.nombre}`}>
          {campanas.map((c) => (
            <li key={c.clave}>
              <TarjetaCampana c={c} onAbrir={() => setAbierta(c)} />
            </li>
          ))}
        </ul>
      )}
      <ModalCampana
        key={abierta?.clave}
        c={abierta}
        onClose={() => setAbierta(null)}
        onAbrirArtes={abrirArtes}
      />
      {artes && <ModalArtes codigo={artes} open onClose={() => setArtes(null)} />}
    </AppShell>
  );
}

import { useNavigate } from 'react-router-dom';
import { Badge, Button, Card, Divider, Icon } from '../orbita';
import { useStore } from '../store/index.js';
import { AppShell } from '../layout/AppShell.jsx';
import { badgeDeFase, hrefCampana, proximaAccion, rutaCampana, vigencia } from '../layout/campanas.js';
import '../layout/layout.css';

const ANTES_DE_ACEPTAR = ['Propuesta lista', 'En selección', 'Selección confirmada', 'Cotización lista'];

// Tres datos de la tarjeta: vigencia, medios y el avance de la fase actual.
function datosTarjeta(r, totalReportes) {
  const medios = ANTES_DE_ACEPTAR.includes(r.fase)
    ? `${r.medios} propuestos`
    : `${r.mediosInstalacion} contratados`;
  let avance;
  if (r.fase === 'Propuesta lista' || r.fase === 'En selección') {
    avance = { etiqueta: 'Respondidos', valor: `${r.respondidos} de ${r.medios}` };
  } else if (r.fase === 'Selección confirmada' || r.fase === 'Cotización lista') {
    avance = { etiqueta: 'Incluidos', valor: `${r.incluidos} de ${r.medios}` };
  } else if (r.fase === 'Aceptada' || r.fase === 'En instalación') {
    avance = { etiqueta: 'Instalados', valor: `${r.instalados} de ${r.mediosInstalacion}` };
  } else {
    avance = { etiqueta: 'Reportes', valor: `${r.reportesPublicados} de ${totalReportes}` };
  }
  return [
    { etiqueta: 'Vigencia', valor: vigencia(r.inicio, r.fin) },
    { etiqueta: 'Medios', valor: medios },
    avance
  ];
}

// Texto corto del pie, junto a los puntos de fase.
function textoPie(r) {
  if (r.fase === 'Propuesta lista') return 'Responde la propuesta';
  if (r.fase === 'En selección') {
    const faltan = r.medios - r.respondidos;
    return faltan > 0 ? `Faltan ${faltan} por responder` : 'Confirma tu selección';
  }
  if (r.fase === 'Selección confirmada' || r.fase === 'Cotización lista') return 'Acepta la cotización';
  if (r.fase === 'Aceptada' || r.fase === 'En instalación') return `Instalación al ${Math.round(r.porcentajeInstalacion)}%`;
  return r.reportesPublicados === 1 ? '1 reporte publicado' : `${r.reportesPublicados} reportes publicados`;
}

// Cuatro puntos, uno por fase: la última fase desbloqueada es la actual, las anteriores
// cuentan como cerradas y las bloqueadas como pendientes.
function PuntosFase({ fases }) {
  const actual = fases.filter((f) => f.estado !== 'bloqueada').length;
  const clase = (i) => (i < actual - 1 ? 'is-cerrada' : i === actual - 1 ? 'is-actual' : 'is-pendiente');
  return (
    <span className="mc-puntos" role="img" aria-label={`Fase ${actual} de ${fases.length}: ${fases[actual - 1]?.nombre ?? ''}`}>
      {fases.map((f, i) => (
        <span key={f.clave} className={`mc-punto ${clase(i)}`} />
      ))}
    </span>
  );
}

function TarjetaCampana({ r }) {
  const s = useStore();
  const navigate = useNavigate();
  const accion = proximaAccion(r);
  const badge = badgeDeFase(r.fase);
  const totalReportes = s.reportes(r.codigo)?.lista.length ?? 0;
  const fases = s.fasesDeCampana(r.codigo) ?? [];
  const idNombre = `mc-${r.codigo}`;

  return (
    <Card as="article" padding="md" className="mc-tarjeta" aria-labelledby={idNombre}>
      <div className="mc-cabeza">
        <span className="mc-icono" aria-hidden="true">
          <Icon name="megaphone" size={20} />
        </span>
        <div className="mc-titulos">
          <h2 id={idNombre} className="mc-nombre">
            <a className="mc-enlace" href={hrefCampana(r.codigo)}>
              {r.nombre}
            </a>
          </h2>
          <p className="mc-codigo" title={r.codigo}>{r.codigo}</p>
        </div>
        <Badge color={badge.color} theme="soft" icon={badge.icon}>
          {r.fase}
        </Badge>
      </div>
      <Divider />
      <dl className="mc-datos">
        {datosTarjeta(r, totalReportes).map((d) => (
          <div key={d.etiqueta} className="mc-dato">
            <dt>{d.etiqueta}:</dt>
            <dd>{d.valor}</dd>
          </div>
        ))}
      </dl>
      <Divider />
      <div className="mc-pie">
        <div className="mc-estado">
          <PuntosFase fases={fases} />
          <span className="mc-estado-texto">{textoPie(r)}</span>
        </div>
        <Button
          className="mc-cta"
          variant={accion.pendiente ? 'primary' : 'secondary'}
          size="sm"
          pill="pill"
          onClick={(e) => {
            e.stopPropagation();
            navigate(rutaCampana(r.codigo, accion.fase));
          }}
        >
          {accion.boton}
        </Button>
      </div>
    </Card>
  );
}

// KPI del panel: título con ícono a la derecha, cifra y una línea de detalle. La primera va destacada.
function Kpi({ titulo, valor, icono, detalle, destacada = false }) {
  return (
    <section className={destacada ? 'mc-kpi is-destacada' : 'mc-kpi'}>
      <div className="mc-kpi-cabecera">
        <h3 className="mc-kpi-titulo">{titulo}</h3>
        <Icon name={icono} size={20} />
      </div>
      <p className="mc-kpi-valor">{valor}</p>
      <p className="mc-kpi-detalle">{detalle}</p>
    </section>
  );
}

export default function MisCampanas() {
  const s = useStore();
  const ind = s.indicadores();
  const resumenes = s.campanas.map((c) => s.resumenCampana(c.codigo)).filter(Boolean);
  const mediosEnInstalacion = resumenes.reduce((n, r) => n + r.mediosInstalacion, 0);
  const pctInstalado = mediosEnInstalacion ? Math.round((ind.mediosInstalados / mediosEnInstalacion) * 100) : 0;
  // Primero las que tienen acción pendiente del cliente; dentro de cada grupo, el orden de la semilla.
  const orden = [...resumenes.filter((r) => r.accionPendiente), ...resumenes.filter((r) => !r.accionPendiente)];

  return (
    <AppShell>
      <header className="pg-cabecera">
        <h1 className="pg-cabecera-titulo">Mis campañas</h1>
        <p className="pg-cabecera-subtitulo">Elige una campaña para ver su avance</p>
      </header>
      <div className="mc-kpis">
        <Kpi titulo="Campañas activas" valor={String(ind.activas)} icono="megaphone" detalle={`de ${resumenes.length} en tu cuenta`} destacada />
        <Kpi titulo="Con acción pendiente" valor={String(ind.conAccionPendiente)} icono="warning" detalle="Esperan tu respuesta" />
        <Kpi titulo="Medios instalados" valor={`${ind.mediosInstalados} de ${mediosEnInstalacion}`} icono="success" detalle={`${pctInstalado}% instalado`} />
      </div>
      <ul className="mc-rejilla" aria-label="Campañas">
        {orden.map((r) => (
          <li key={r.codigo}>
            <TarjetaCampana r={r} />
          </li>
        ))}
      </ul>
    </AppShell>
  );
}

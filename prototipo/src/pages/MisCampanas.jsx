import { useNavigate } from 'react-router-dom';
import { Badge, Button, Card, KpiCard, ProgressBar } from '../orbita';
import { useStore } from '../store/index.js';
import { AppShell } from '../layout/AppShell.jsx';
import { badgeDeFase, hrefCampana, proximaAccion, rutaCampana, vigencia } from '../layout/campanas.js';
import '../layout/layout.css';

// Línea de avance según la fase: respondidos (propuesta), incluidos (cotización),
// % de instalación o reportes publicados.
function Avance({ r, totalReportes }) {
  const { fase } = r;
  if (fase === 'Propuesta lista' || fase === 'En selección') {
    const pct = r.medios ? (r.respondidos / r.medios) * 100 : 0;
    return <ProgressBar value={pct} label={`${r.respondidos} de ${r.medios} medios respondidos`} />;
  }
  if (fase === 'Selección confirmada' || fase === 'Cotización lista') {
    return <p className="pg-texto">{`${r.incluidos} de ${r.medios} medios incluidos en la cotización`}</p>;
  }
  if (fase === 'Aceptada' || fase === 'En instalación') {
    return <ProgressBar value={r.porcentajeInstalacion} label={`${r.instalados} de ${r.mediosInstalacion} medios instalados`} />;
  }
  return <p className="pg-texto">{`${r.reportesPublicados} de ${totalReportes} reportes publicados`}</p>;
}

function TarjetaCampana({ r }) {
  const s = useStore();
  const navigate = useNavigate();
  const accion = proximaAccion(r);
  const badge = badgeDeFase(r.fase);
  const totalReportes = s.reportes(r.codigo)?.lista.length ?? 0;
  const idNombre = `mc-${r.codigo}`;

  return (
    <Card as="article" padding="md" className="mc-tarjeta" aria-labelledby={idNombre}>
      <div className="pg-fila">
        <Badge color={badge.color} theme="soft" icon={badge.icon}>
          {r.fase}
        </Badge>
      </div>
      <div className="pg-pila">
        <h2 id={idNombre} className="mc-nombre">
          <a className="mc-enlace" href={hrefCampana(r.codigo)}>
            {r.nombre}
          </a>
        </h2>
        <p className="pg-meta">{r.codigo}</p>
        <p className="pg-meta">Vigencia: {vigencia(r.inicio, r.fin)}</p>
      </div>
      <Avance r={r} totalReportes={totalReportes} />
      <p className="pg-texto">{accion.texto}</p>
      <div className="mc-pie">
        <Button
          className="mc-cta"
          variant={accion.pendiente ? 'primary' : 'secondary'}
          size="sm"
          fullWidth
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

export default function MisCampanas() {
  const s = useStore();
  const ind = s.indicadores();
  const resumenes = s.campanas.map((c) => s.resumenCampana(c.codigo)).filter(Boolean);
  const mediosEnInstalacion = resumenes.reduce((n, r) => n + r.mediosInstalacion, 0);
  // Primero las que tienen acción pendiente del cliente; dentro de cada grupo, el orden de la semilla.
  const orden = [...resumenes.filter((r) => r.accionPendiente), ...resumenes.filter((r) => !r.accionPendiente)];

  return (
    <AppShell migas={[{ label: 'Mis campañas' }]}>
      <div className="pg-pila">
        <h1 className="pg-titulo">Mis campañas</h1>
        <p className="pg-texto">Elige una campaña para ver su avance</p>
      </div>
      <div className="mc-kpis">
        <KpiCard title="Campañas activas" amount={String(ind.activas)} />
        <KpiCard title="Con acción pendiente" amount={String(ind.conAccionPendiente)} />
        <KpiCard title="Medios instalados" amount={`${ind.mediosInstalados} de ${mediosEnInstalacion}`} />
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

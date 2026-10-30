import { useNavigate } from 'react-router-dom';
import { Card, KpiCard, useToast } from '../orbita';
import { useStore } from '../store/index.js';
import { PaginaCampana } from '../layout/PaginaCampana.jsx';
import { rutaCampana } from '../layout/campanas.js';
import { TarjetaReporte } from './reportes/TarjetaReporte.jsx';
import { ReportesBloqueados } from './reportes/ReportesBloqueados.jsx';
import { AVISO_DESCARGA, kpisReportes } from './reportes/datos.js';
import '../layout/layout.css';
import './reportes/reportes.css';

// Reportes de la campaña (Figma 868:50236: dashboard + descarga de reportes, sin plantillas ni onboarding).
export default function Reportes() {
  return (
    <PaginaCampana fase="reportes">
      {(campana) => <ContenidoReportes codigo={campana.codigo} />}
    </PaginaCampana>
  );
}

function ContenidoReportes({ codigo }) {
  const s = useStore();
  const navigate = useNavigate();
  const { toast } = useToast();
  const fase = s.fasesDeCampana(codigo).find((f) => f.clave === 'reportes');
  const rep = s.reportes(codigo);

  if (!rep || fase?.estado === 'bloqueada' || !rep.disponible) {
    return <ReportesBloqueados motivo={fase?.motivo || 'Los reportes se publican al terminar la instalación.'} />;
  }

  const k = kpisReportes(s, codigo);
  const descargar = () => toast({ title: AVISO_DESCARGA, color: 'info' });

  return (
    <>
      <section className="pg-pila pg-pila--md" aria-labelledby="rp-kpis-t">
        <h2 id="rp-kpis-t" className="ui-sr-only">Indicadores de la campaña</h2>
        <div className="rp-kpis">
          <KpiCard title="Impactos totales" amount={k.impactos} />
          <KpiCard title="Alcance total" amount={k.alcance} />
          <KpiCard title="Frecuencia promedio" amount={k.frecuencia} />
          <KpiCard title="Medios en ejecución" amount={k.enEjecucion} />
          <KpiCard title="Avance de testigos" amount={k.testigos} />
        </div>
      </section>

      <Card as="section" padding="md" className="rp-listado" aria-labelledby="rp-lista-t">
        <h2 id="rp-lista-t" className="rp-listado__titulo">Listado cronológico de reportes</h2>
        {rep.publicados === 0 && (
          <p className="pg-texto">Tus reportes aparecerán aquí cuando se publiquen.</p>
        )}
        <ol className="rp-linea">
          {rep.lista.map((r) => (
            <TarjetaReporte
              key={r.id}
              reporte={r}
              onVer={() => navigate(`${rutaCampana(codigo, 'reportes')}/${encodeURIComponent(r.id)}`)}
              onDescargar={descargar}
            />
          ))}
        </ol>
      </Card>
    </>
  );
}

import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge, Card, Icon, useToast } from '../orbita';
import { useStore } from '../store/index.js';
import { PLANTILLAS_REPORTE } from '../data/catalogos.js';
import { PaginaCampana } from '../layout/PaginaCampana.jsx';
import { rutaCampana } from '../layout/campanas.js';
import { TarjetaReporte } from './reportes/TarjetaReporte.jsx';
import { ReportesBloqueados } from './reportes/ReportesBloqueados.jsx';
import { fechaCorta } from './reportes/datos.js';
import { DURACION_DESCARGA, avanceDescarga, indiceVecino } from './reportes/descargas.js';
import '../layout/layout.css';
import './reportes/reportes.css';
import './reportes/descargas.css';

const TICK = 100;

// Descarga de reportes (#/campanas/:codigo/reportes/descargas), Figma 766:62360 y 1210:49734:
// listado cronológico con descarga simulada y plantillas cargadas (opción única).
export default function DescargaReportes() {
  return (
    <PaginaCampana fase="reportes" migasExtra={[{ label: 'Descarga de reportes' }]}>
      {(campana) => <ContenidoDescargas codigo={campana.codigo} />}
    </PaginaCampana>
  );
}

function ContenidoDescargas({ codigo }) {
  const s = useStore();
  const fase = s.fasesDeCampana(codigo).find((f) => f.clave === 'reportes');
  const rep = s.reportes(codigo);

  if (!rep || fase?.estado === 'bloqueada' || !rep.disponible) {
    return <ReportesBloqueados motivo={fase?.motivo || 'Los reportes se publican al terminar la instalación.'} />;
  }

  return (
    <div className="rd">
      <ListadoReportes codigo={codigo} lista={rep.lista} plantilla={s.plantilla(codigo)} />
      <Plantillas
        seleccionada={s.plantilla(codigo).id}
        onElegir={(id) => s.elegirPlantilla(codigo, id)}
      />
    </div>
  );
}

function ListadoReportes({ codigo, lista, plantilla }) {
  const navigate = useNavigate();
  const { toast, dismiss } = useToast();
  const [progresos, setProgresos] = useState({}); // id → 0–100 mientras descarga
  const timers = useRef(new Map());
  const ultimaPlantilla = useRef(plantilla);
  ultimaPlantilla.current = plantilla;

  useEffect(() => {
    const mapa = timers.current;
    return () => {
      mapa.forEach((t) => clearInterval(t));
      mapa.clear();
    };
  }, []);

  const descargar = (reporte) => {
    if (timers.current.has(reporte.id)) return; // una descarga a la vez por reporte
    const inicio = Date.now();
    setProgresos((p) => ({ ...p, [reporte.id]: 0 }));
    const t = setInterval(() => {
      const pct = avanceDescarga(inicio, Date.now(), DURACION_DESCARGA);
      if (pct < 100) {
        setProgresos((p) => ({ ...p, [reporte.id]: pct }));
        return;
      }
      clearInterval(t);
      timers.current.delete(reporte.id);
      setProgresos((p) => {
        const { [reporte.id]: _fin, ...resto } = p;
        return resto;
      });
      let id = null;
      id = toast({
        color: 'success',
        title: '¡Reporte descargado!',
        body: `${reporte.nombre} · ${ultimaPlantilla.current.nombre}`,
        actions: [
          {
            label: 'Ver archivo',
            onClick: () => {
              if (id) dismiss(id);
              navigate(`${rutaCampana(codigo, 'reportes')}/${encodeURIComponent(reporte.id)}`);
            }
          }
        ]
      });
    }, TICK);
    timers.current.set(reporte.id, t);
  };

  return (
    <Card as="section" padding="md" className="rd-panel rd-panel--reportes" aria-labelledby="rd-lista-t">
      <h2 id="rd-lista-t" className="rd-panel__titulo">Listado cronológico de reportes</h2>
      <div className="rd-panel__scroll">
        <ol className="rd-linea">
          {lista.map((r) => (
            <TarjetaReporte
              key={r.id}
              reporte={r}
              progreso={progresos[r.id] ?? null}
              onDescargar={() => descargar(r)}
            />
          ))}
        </ol>
      </div>
    </Card>
  );
}

function Plantillas({ seleccionada, onElegir }) {
  const refs = useRef([]);
  const actual = Math.max(0, PLANTILLAS_REPORTE.findIndex((p) => p.id === seleccionada));

  const alTeclear = (e, i) => {
    const paso = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
    if (paso) {
      e.preventDefault();
      const j = indiceVecino(i, PLANTILLAS_REPORTE.length, paso);
      onElegir(PLANTILLAS_REPORTE[j].id);
      refs.current[j]?.focus();
    } else if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      onElegir(PLANTILLAS_REPORTE[i].id);
    }
  };

  return (
    <Card as="section" padding="md" className="rd-panel rd-panel--plantillas" aria-labelledby="rd-plantillas-t">
      <h2 id="rd-plantillas-t" className="rd-panel__titulo">Plantillas cargadas</h2>
      <div className="rd-panel__scroll">
        <div role="radiogroup" aria-labelledby="rd-plantillas-t" className="rd-plantillas">
          {PLANTILLAS_REPORTE.map((p, i) => {
            const activa = i === actual;
            return (
              <div
                key={p.id}
                ref={(el) => { refs.current[i] = el; }}
                role="radio"
                aria-checked={activa}
                tabIndex={activa ? 0 : -1}
                className={`rd-plantilla${activa ? ' is-selected' : ''}`}
                onClick={() => onElegir(p.id)}
                onKeyDown={(e) => alTeclear(e, i)}
              >
                <span className="rd-plantilla__archivo" aria-hidden="true">
                  <Icon name="file-powerpoint" size={24} />
                  <span className="rd-plantilla__ext">PPTX</span>
                </span>
                <span className="rd-plantilla__texto">
                  <span className="rd-plantilla__nombre">{p.nombre}</span>
                  <span className="rd-plantilla__fecha">Cargada: {fechaCorta(p.cargada)}</span>
                </span>
                {activa && (
                  <Badge color="success" theme="soft" size="sm" icon="dot" className="rd-plantilla__badge">
                    Aplicado
                  </Badge>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}

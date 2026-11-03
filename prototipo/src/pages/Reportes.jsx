import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Icon, IconButton, KpiCard, TabPanel, Table, Tabs, cx } from '../orbita';
import { useStore } from '../store/index.js';
import { PaginaCampana } from '../layout/PaginaCampana.jsx';
import { useCampanaDeRuta } from '../layout/EncabezadoCampana.jsx';
import { rutaCampana } from '../layout/campanas.js';
import { NOMBRE_PLAZA, NOMBRE_TIPO } from '../data/catalogos.js';
import { fechaLocal } from '../data/fechas.js';
import { ReportesBloqueados } from './reportes/ReportesBloqueados.jsx';
import { GraficaBarras, GraficaDona } from './reportes/Graficas.jsx';
import { MapaMedios } from './reportes/MapaMedios.jsx';
import { demografiaDe } from './reportes/demografia.js';
import { SIN_DATO, estadoCampana, impactosEnReporte, kpisReportes, mediosInstalados } from './reportes/datos.js';
import { ICONO_TIPO } from './instalacion/partes.jsx';
import '../layout/layout.css';
import './reportes/reportes.css';
import './reportes/dashboard.css';

// Reportes de la campaña: dashboard "Resumen de la campaña" (Figma 766:61908). La descarga y el
// listado de reportes viven en /reportes/descargas.
export default function Reportes() {
  const campana = useCampanaDeRuta();
  const s = useStore();
  const disponible = campana ? reportesDisponibles(s, campana.codigo) : false;
  return (
    <PaginaCampana fase="reportes" acciones={disponible ? <BotonDescargar codigo={campana.codigo} /> : null}>
      {(c) => <ContenidoReportes campana={c} />}
    </PaginaCampana>
  );
}

function reportesDisponibles(s, codigo) {
  const fase = s.fasesDeCampana(codigo).find((f) => f.clave === 'reportes');
  const rep = s.reportes(codigo);
  return Boolean(rep && fase?.estado !== 'bloqueada' && rep.disponible);
}

// Botón del header: completo en escritorio, solo ícono en móvil (≤600px, ver dashboard.css).
function BotonDescargar({ codigo }) {
  const navigate = useNavigate();
  const ir = () => navigate(`${rutaCampana(codigo, 'reportes')}/descargas`);
  return (
    <>
      <span className="rp-descargar rp-descargar--texto">
        <Button variant="primary" size="md" iconLeft="download" onClick={ir}>Descargar reporte</Button>
      </span>
      <span className="rp-descargar rp-descargar--icono">
        <IconButton icon="download" label="Descargar reporte" variant="primary" size="md" tooltipPlacement="bottom" onClick={ir} />
      </span>
    </>
  );
}

// Nombre corto de la pestaña de cada reporte.
const etiquetaReporte = (r) => (r.tipo === 'inicial' ? 'Reporte inicial' : r.nombre);

function ContenidoReportes({ campana }) {
  const { codigo } = campana;
  const s = useStore();
  const navigate = useNavigate();
  const fase = s.fasesDeCampana(codigo).find((f) => f.clave === 'reportes');
  const rep = s.reportes(codigo);
  const [activo, setActivo] = useState(null);
  const [elegido, setElegido] = useState(null);
  const demografia = useMemo(() => demografiaDe(codigo), [codigo]);
  const publicados = (rep?.lista ?? []).filter((r) => r.estado === 'publicado');
  const reporte = publicados.find((r) => r.id === elegido) ?? publicados.at(-1) ?? null;

  // La pestaña activa (por defecto la última publicada) queda visible si las pestañas hacen scroll.
  useEffect(() => {
    const tab = reporte && document.getElementById(`rp-rep-tab-${reporte.id}`);
    const lista = tab?.closest('.ui-tabs');
    if (!lista) return;
    const t = tab.getBoundingClientRect();
    const l = lista.getBoundingClientRect();
    if (t.right > l.right) lista.scrollLeft += t.right - l.right + 16;
    else if (t.left < l.left) lista.scrollLeft -= l.left - t.left + 16;
  }, [reporte?.id]);

  if (!reportesDisponibles(s, codigo)) {
    return <ReportesBloqueados motivo={fase?.motivo || 'Los reportes se publican al terminar la instalación.'} />;
  }

  const k = kpisReportes(s, codigo);
  const estado = estadoCampana(campana.inicio, campana.fin, fechaLocal(Date.now()));
  const medios = mediosInstalados(s, codigo);

  const verMedio = (m) => {
    if (!reporte) return;
    navigate(`${rutaCampana(codigo, 'reportes')}/medio/${encodeURIComponent(m.id)}?reporte=${encodeURIComponent(reporte.id)}`);
  };

  return (
    <>
      <section aria-labelledby="rp-kpis-t">
        <h2 id="rp-kpis-t" className="ui-sr-only">Indicadores de la campaña</h2>
        <div className="rp-dash-kpis">
          <KpiCard title="Impactos totales" amount={k.impactos} />
          <KpiCard title="Alcance total" amount={k.alcance} />
          <KpiCard title="Frecuencia promedio" amount={k.frecuencia} />
          <KpiCard title="Medios en ejecución" amount={k.enEjecucion} />
          <KpiCard title="Avance de testigos" amount={k.testigos} />
          <KpiCard
            title={estado.titulo}
            showIcon={false}
            className={cx('rp-estado', `rp-estado--${estado.estado}`)}
            amount={
              <>
                <span className="rp-estado__punto" aria-hidden="true" />
                {estado.valor}
              </>
            }
          />
        </div>
      </section>

      <section aria-labelledby="rp-demo-t">
        <h2 id="rp-demo-t" className="ui-sr-only">Audiencia de la campaña</h2>
        <div className="rp-demo">
          <Card as="article" padding="md" className="rp-demo__tarjeta" aria-labelledby="rp-genero-t">
            <h3 id="rp-genero-t" className="rp-demo__titulo">Género</h3>
            <GraficaDona
              titulo="Género"
              datos={demografia.genero.map((d, i) => ({ ...d, serie: i === 0 ? 2 : 5 }))}
              className="rp-demo__grafica"
            />
          </Card>
          <Card as="article" padding="md" className="rp-demo__tarjeta" aria-labelledby="rp-edad-t">
            <h3 id="rp-edad-t" className="rp-demo__titulo">Edad</h3>
            <GraficaBarras titulo="Edad" datos={demografia.edad} className="rp-demo__grafica" />
          </Card>
          <Card as="article" padding="md" className="rp-demo__tarjeta" aria-labelledby="rp-nse-t">
            <h3 id="rp-nse-t" className="rp-demo__titulo">Nivel socioeconómico (NSE)</h3>
            <GraficaDona titulo="Nivel socioeconómico" datos={demografia.nse} className="rp-demo__grafica" />
          </Card>
        </div>
      </section>

      <section className="pg-pila pg-pila--md" aria-labelledby="rp-vista-t">
        <h2 id="rp-vista-t" className="pg-subtitulo">Vista general de la campaña</h2>
        <div className="rp-vista">
          <Card padding="sm" className="rp-vista__mapa">
            <MapaMedios medios={medios} activo={activo} onActivo={setActivo} onVer={verMedio} />
          </Card>
          <div className="rp-vista__tabla">
            <Tabs
              idPrefix="rp-rep"
              label="Reportes publicados"
              items={rep.lista.map((r) => ({ id: r.id, label: etiquetaReporte(r), icon: 'file', disabled: r.estado !== 'publicado' }))}
              value={reporte?.id ?? null}
              onChange={setElegido}
              className="rp-tabs"
            />
            <TabPanel idPrefix="rp-rep" id={reporte?.id ?? 'ninguno'} active className="rp-tabla__panel">
              <Card padding="md" className="rp-tabla__tarjeta">
                <TablaMedios medios={medios} reporte={reporte} onVer={verMedio} onActivo={setActivo} />
              </Card>
            </TabPanel>
          </div>
        </div>
      </section>
    </>
  );
}

function TablaMedios({ medios, reporte, onVer, onActivo }) {
  const ubicacion = (m) => m.direccion || `${SIN_DATO} - ${NOMBRE_PLAZA[m.plaza] || m.plaza}`;
  const resaltar = (m) => ({
    onMouseEnter: () => onActivo(m.id),
    onMouseLeave: () => onActivo(null),
    onFocus: () => onActivo(m.id),
    onBlur: () => onActivo(null)
  });

  const columnas = [
    {
      key: 'tipo',
      header: <span className="ui-sr-only">Tipo de medio</span>,
      width: '48px',
      render: ({ medio }) => (
        <Icon name={ICONO_TIPO[medio.tipo] || 'shapes'} size={16} label={NOMBRE_TIPO[medio.tipo] || 'Medio'} className="rp-tabla__icono" />
      )
    },
    {
      key: 'ubicacion',
      header: 'Ubicación',
      render: ({ medio, ubicacion: texto }) => (
        <span className="rp-tabla__ubicacion" title={texto} {...resaltar(medio)}>{texto}</span>
      )
    },
    { key: 'impactos', header: 'Impactos', type: 'number', width: '112px' },
    { key: 'estatus', header: 'Estatus', type: 'status', width: '112px' },
    {
      key: 'ver',
      header: <span className="ui-sr-only">Acciones</span>,
      width: '72px',
      render: ({ medio, ubicacion: texto }) => (
        <Button variant="tertiary" size="sm" iconLeft="eye" aria-label={`Ver ${texto}`} onClick={() => onVer(medio)} {...resaltar(medio)}>
          Ver
        </Button>
      )
    }
  ];

  const filas = medios.map((m) => ({
    id: m.id,
    medio: m,
    ubicacion: ubicacion(m),
    impactos: impactosEnReporte(m, reporte),
    estatus: { label: 'Verificado', color: 'success' }
  }));

  return (
    <Table
      className="rp-tabla"
      caption={reporte ? `Medios del ${etiquetaReporte(reporte).toLowerCase()}` : 'Medios de la campaña'}
      columns={columnas}
      rows={reporte ? filas : []}
      emptyMessage="Tus reportes aparecerán aquí cuando se publiquen."
    />
  );
}

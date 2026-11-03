import { useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Badge, Button, Card, IconButton, Lightbox, Popover, TabPanel, Tabs, cx, useToast } from '../orbita';
import { useStore } from '../store/index.js';
import { PaginaCampana } from '../layout/PaginaCampana.jsx';
import { rutaCampana } from '../layout/campanas.js';
import { IlustracionMedio } from './propuesta/IlustracionMedio.jsx';
import { ReportesBloqueados } from './reportes/ReportesBloqueados.jsx';
import { GraficaDona } from './reportes/Graficas.jsx';
import { demografiaDe } from './reportes/demografia.js';
import { AVISO_DESCARGA, SIN_DATO, fechaCorta, fichaDe, impactosEnReporte, mediosInstalados } from './reportes/datos.js';
import { ICONO_TIPO } from './instalacion/partes.jsx';
import '../layout/layout.css';
import './reportes/reportes.css';
import './reportes/testigo.css';

// Detalle del testigo de un medio (#/campanas/:codigo/reportes/medio/:medioId?reporte=<id>),
// Figma 766:60563 (panel de datos abierto) y 766:60768 (panel colapsado con miniaturas).

const numero = new Intl.NumberFormat('es-MX', { maximumFractionDigits: 0 });

// Reportes de la campaña consultables (misma regla que el dashboard).
function reportesDisponibles(s, codigo) {
  const fase = s.fasesDeCampana(codigo).find((f) => f.clave === 'reportes');
  const rep = s.reportes(codigo);
  return Boolean(rep && fase?.estado !== 'bloqueada' && rep.disponible);
}

// Reporte pedido en ?reporte (o el último publicado si falta) y medio de la ruta.
function resolver(s, codigo, medioId, reporteId) {
  const rep = s.reportes(codigo);
  const lista = rep?.lista ?? [];
  const reporte = reporteId
    ? lista.find((r) => r.id === reporteId) ?? null
    : lista.filter((r) => r.estado === 'publicado').at(-1) ?? null;
  const medio = mediosInstalados(s, codigo).find((m) => String(m.id) === String(medioId)) ?? null;
  return { reporte, medio };
}

export default function DetalleTestigo() {
  const { codigo, medioId } = useParams();
  const [query] = useSearchParams();
  const s = useStore();
  const reporteId = query.get('reporte');
  const { reporte, medio } = codigo ? resolver(s, codigo, medioId, reporteId) : {};
  const href = `#${rutaCampana(codigo, 'reportes')}`;
  const migas = [
    { label: reporte?.nombre ?? 'Reporte', href },
    { label: medio ? medio.direccion || medio.clave || 'Medio' : 'Medio no encontrado' }
  ];
  return (
    <PaginaCampana fase="reportes" migasExtra={migas}>
      {(campana) => <ContenidoTestigo key={`${medioId}-${reporte?.id}`} campana={campana} reporte={reporte} medio={medio} />}
    </PaginaCampana>
  );
}

function ContenidoTestigo({ campana, reporte, medio }) {
  const s = useStore();
  const navigate = useNavigate();
  const { codigo } = campana;
  const volver = { label: 'Volver a reportes', onClick: () => navigate(rutaCampana(codigo, 'reportes')) };
  const fase = s.fasesDeCampana(codigo).find((f) => f.clave === 'reportes');

  if (!reportesDisponibles(s, codigo)) {
    return <ReportesBloqueados motivo={fase?.motivo || 'Los reportes se publican al terminar la instalación.'} accion={volver} />;
  }
  if (!reporte) {
    return <ReportesBloqueados titulo="Reporte no encontrado" motivo="No existe un reporte publicado para consultar este medio." accion={volver} />;
  }
  if (reporte.estado !== 'publicado') {
    const motivo = reporte.publicacion ? `Se publica el ${fechaCorta(reporte.publicacion)}.` : reporte.motivo || 'Este reporte aún no se publica.';
    return <ReportesBloqueados titulo={`${reporte.nombre} no disponible`} motivo={motivo} accion={volver} />;
  }
  if (!medio) {
    return <ReportesBloqueados titulo="Medio no encontrado" motivo="Este medio no forma parte de los medios instalados de la campaña." accion={volver} />;
  }
  return <Testigo campana={campana} reporte={reporte} medio={medio} />;
}

function Testigo({ campana, reporte, medio: m }) {
  const { toast } = useToast();
  const ficha = fichaDe(m, campana);
  const direccion = m.direccion || ficha.clave;
  const [vista, setVista] = useState(0);
  const [tab, setTab] = useState('data');
  const [abierto, setAbierto] = useState(true);
  const [menu, setMenu] = useState(false);
  const [lightbox, setLightbox] = useState(null); // índice o null

  const total = ficha.pies.length;
  const mover = (d) => setVista((v) => (v + d + total) % total);
  const onTecla = (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); mover(1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); mover(-1); }
  };

  const descargar = () => {
    setMenu(false);
    toast({ title: AVISO_DESCARGA, color: 'info' });
  };
  const pantallaCompleta = () => {
    setMenu(false);
    setLightbox(vista);
  };

  return (
    <div className={cx('tt', !abierto && 'tt--colapsado')}>
      <div className="tt-escena">
        <div
          className="tt-lienzo ui-focus-ring"
          role="img"
          tabIndex={0}
          aria-label={`Testigo de ${direccion}, ${ficha.pies[vista]}`}
          aria-roledescription="testigo"
          onKeyDown={onTecla}
        >
          <Encuadre medio={m} vista={vista} />
        </div>

        <div className="tt-etiquetas">
          <Badge color="gray" theme="soft" stroke>{ficha.pies[vista]}</Badge>
          <Badge color="success" theme="soft" stroke icon="dot">Verificado</Badge>
        </div>

        <div className="tt-menu">
          <Popover
            open={menu}
            onOpenChange={setMenu}
            placement="bottom"
            align="end"
            showClose={false}
            className="tt-menu__ancla"
            trigger={<IconButton icon="ellipsis" label="Más opciones" variant="secondary" size="sm" pill="pill" tooltipPlacement="left" />}
          >
            <div className="tt-menu__lista">
              <Button variant="tertiary" size="sm" iconLeft="zoom-in" fullWidth onClick={pantallaCompleta}>
                Ver en pantalla completa
              </Button>
              <Button variant="tertiary" size="sm" iconLeft="download" fullWidth onClick={descargar}>
                Descargar foto
              </Button>
            </div>
          </Popover>
        </div>

        {!abierto && (
          <>
            <Card padding="sm" className="tt-miniaturas" role="group" aria-label="Vistas del testigo">
              {ficha.pies.map((pie, i) => (
                <button
                  key={pie}
                  type="button"
                  className={cx('tt-mini ui-focus-ring', i === vista && 'is-activa')}
                  aria-label={pie}
                  aria-pressed={i === vista}
                  onClick={() => setVista(i)}
                >
                  <span className="tt-mini__img" aria-hidden="true">
                    <Encuadre medio={m} vista={i} />
                  </span>
                  <span className={cx('tt-mini__punto', i === vista ? 'tt-mini__punto--activa' : 'tt-mini__punto--otra')} aria-hidden="true" />
                </button>
              ))}
            </Card>
            <div className="tt-mostrar">
              <IconButton
                icon="chevron-up"
                label="Mostrar datos"
                variant="secondary"
                size="sm"
                tooltipPlacement="left"
                onClick={() => setAbierto(true)}
              />
            </div>
          </>
        )}
      </div>

      {abierto && (
        <section className="tt-panel" aria-label="Datos del medio">
          <div className="tt-panel__cabeza">
            <Tabs
              idPrefix="tt"
              label="Información del medio"
              items={[
                { id: 'data', label: 'Data', icon: 'trend-up' },
                { id: 'medio', label: 'Medio', icon: ICONO_TIPO[m.tipo] || 'shapes' }
              ]}
              value={tab}
              onChange={setTab}
              className="tt-tabs"
            />
            <IconButton
              icon="chevron-down"
              label="Ocultar datos"
              variant="secondary"
              size="sm"
              tooltipPlacement="left"
              onClick={() => setAbierto(false)}
            />
          </div>
          <TabPanel idPrefix="tt" id="data" active={tab === 'data'} className="tt-panel__cuerpo">
            <PanelData medio={m} reporte={reporte} />
          </TabPanel>
          <TabPanel idPrefix="tt" id="medio" active={tab === 'medio'} className="tt-panel__cuerpo">
            <PanelMedio ficha={ficha} />
          </TabPanel>
        </section>
      )}

      <Lightbox
        open={lightbox !== null}
        images={ficha.pies.map((pie) => ({ alt: `${pie} de ${direccion}`, caption: `${pie} · ${ficha.clave}` }))}
        index={lightbox ?? 0}
        onIndexChange={setLightbox}
        onClose={() => setLightbox(null)}
        label="Fotos del testigo"
      />
    </div>
  );
}

// Misma ilustración con un encuadre distinto por vista (corta / media / larga).
function Encuadre({ medio, vista }) {
  return (
    <div className={cx('tt-encuadre', `tt-encuadre--${vista}`)}>
      <IlustracionMedio medio={medio} />
    </div>
  );
}

function Cifra({ titulo, valor }) {
  return (
    <article className="tt-tarjeta">
      <h3 className="tt-tarjeta__titulo">{titulo}</h3>
      <p className="tt-cifra">{valor}</p>
    </article>
  );
}

function Dona({ titulo, datos }) {
  return (
    <article className="tt-tarjeta">
      <h3 className="tt-tarjeta__titulo">{titulo}</h3>
      <GraficaDona titulo={titulo} datos={datos} leyenda="ninguna" tamano={96} className="tt-dona" />
    </article>
  );
}

function PanelData({ medio: m, reporte }) {
  const demo = demografiaDe(m.id);
  const alcance = m.alcance > 0 ? numero.format(m.alcance) : SIN_DATO;
  const frecuencia = m.frecuencia > 0 ? m.frecuencia.toFixed(2) : SIN_DATO;
  return (
    <div className="tt-data">
      <Cifra titulo="Impactos del medio" valor={impactosEnReporte(m, reporte)} />
      <Cifra titulo="Alcance total del medio" valor={alcance} />
      <Cifra titulo="Frecuencia promedio" valor={frecuencia} />
      <Dona titulo="Género" datos={demo.genero.map((d, i) => ({ ...d, serie: i === 0 ? 2 : 5 }))} />
      <Dona titulo="Edad" datos={demo.edad} />
      <Dona titulo="NSE" datos={demo.nse} />
    </div>
  );
}

function PanelMedio({ ficha }) {
  const filas = [...ficha.arriba, ...ficha.abajo];
  return (
    <div className="tt-medio">
      <p className="tt-medio__clave">
        <span>{ficha.etiquetaClave}</span>
        <strong>{ficha.clave}</strong>
      </p>
      <dl className="tt-medio__campos">
        {filas.map(([etiqueta, valor]) => (
          <div key={etiqueta} className="tt-medio__campo">
            <dt>{etiqueta}</dt>
            <dd>{valor}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

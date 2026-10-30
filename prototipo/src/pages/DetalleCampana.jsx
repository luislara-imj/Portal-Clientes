import { useNavigate } from 'react-router-dom';
import { Badge, Button, Card, Icon, ProgressBar } from '../orbita';
import { formatoFecha, formatoMXN, useStore } from '../store/index.js';
import { PaginaCampana } from '../layout/PaginaCampana.jsx';
import { proximaAccion, rutaCampana, vigencia } from '../layout/campanas.js';
import '../layout/layout.css';
import './DetalleCampana.css';

function QueSigue({ codigo }) {
  const s = useStore();
  const navigate = useNavigate();
  const accion = proximaAccion(s.resumenCampana(codigo));
  return (
    <Card as="section" padding="lg" aria-labelledby="que-sigue-t">
      <div className="pg-pila pg-pila--md">
        <h2 id="que-sigue-t" className="pg-subtitulo">Qué sigue</h2>
        <p className="pg-texto">{accion.texto}</p>
        <div className="pg-fila">
          <Button variant={accion.pendiente ? 'primary' : 'secondary'} size="md" onClick={() => navigate(rutaCampana(codigo, accion.fase))}>
            {accion.boton}
          </Button>
        </div>
      </div>
    </Card>
  );
}

// Estado de la fase (fasesDeCampana) → Badge. Siempre ícono y texto.
const BADGE_ESTADO = {
  activa: { color: 'info', icon: 'info', texto: 'En curso' },
  consulta: { color: 'gray', icon: 'check', texto: 'Cerrada · consulta' },
  bloqueada: { color: 'gray', icon: 'lock', texto: 'Bloqueada' }
};

const BOTON_FASE = {
  propuesta: 'Abrir propuesta',
  cotizacion: 'Abrir cotización',
  instalacion: 'Abrir instalación',
  reportes: 'Abrir reportes'
};

function TarjetaFase({ codigo, fase, children }) {
  const navigate = useNavigate();
  const badge = BADGE_ESTADO[fase.estado];
  const tituloId = `fase-${fase.clave}-t`;
  const bloqueada = fase.estado === 'bloqueada';
  return (
    <Card as="li" padding="lg" className="dc-fase" aria-labelledby={tituloId}>
      <div className="pg-fila dc-fase__cabeza">
        <h3 id={tituloId} className="dc-fase__titulo">{fase.nombre}</h3>
        <Badge color={badge.color} theme="soft" icon={badge.icon}>{badge.texto}</Badge>
      </div>
      {bloqueada ? (
        <div className="dc-bloqueo">
          <Icon name="lock" size={16} className="dc-bloqueo__icono" />
          <p className="pg-texto">{fase.motivo}</p>
        </div>
      ) : (
        <>
          <div className="pg-pila dc-fase__cuerpo">{children}</div>
          <div className="pg-fila dc-fase__pie">
            <Button variant="secondary" size="sm" onClick={() => navigate(rutaCampana(codigo, fase.clave))}>
              {BOTON_FASE[fase.clave]}
            </Button>
          </div>
        </>
      )}
    </Card>
  );
}

function DatoClave({ valor, etiqueta }) {
  return (
    <p className="dc-dato">
      <span className="dc-dato__valor">{valor}</span> <span className="pg-texto">{etiqueta}</span>
    </p>
  );
}

function ResumenPropuesta({ codigo }) {
  const p = useStore().progresoPropuesta(codigo);
  const pct = p.total ? (p.respondidos / p.total) * 100 : 0;
  return (
    <>
      <DatoClave valor={`${p.respondidos} de ${p.total}`} etiqueta="respondidos" />
      <ProgressBar value={pct} size="xs" aria-label="Medios respondidos" />
      <p className="pg-texto">Medios incluidos (Sí): {p.si}</p>
    </>
  );
}

function ResumenCotizacion({ codigo }) {
  const s = useStore();
  const cot = s.cotizacion(codigo);
  const aceptadaEn = s.estado.campanas[codigo]?.aceptadaEn;
  return (
    <>
      <DatoClave valor={formatoMXN(cot.total)} etiqueta="total con IVA" />
      <p className="pg-texto">
        {cot.aceptada && aceptadaEn ? `Aceptada el ${formatoFecha(aceptadaEn)}` : 'Pendiente de aceptar'}
      </p>
    </>
  );
}

function ResumenInstalacion({ codigo }) {
  const s = useStore();
  const inst = s.instalacion(codigo);
  const fase = s.estado.campanas[codigo]?.fase;
  const enVivo = s.campana(codigo)?.flujo === 'completo' && (fase === 'Aceptada' || fase === 'En instalación');
  return (
    <>
      <DatoClave valor={`${inst.porcentaje} %`} etiqueta="de avance" />
      <ProgressBar
        value={inst.porcentaje}
        color={inst.completa ? 'success' : 'brand'}
        size="xs"
        showPercentage={false}
        aria-label="Avance de la instalación"
      />
      <p className="pg-texto" aria-live={enVivo ? 'polite' : undefined}>
        {inst.instalados} de {inst.total} instalados{enVivo ? ' · se actualiza en vivo' : ''}
      </p>
    </>
  );
}

function ResumenReportes({ codigo }) {
  const rep = useStore().reportes(codigo);
  const proximo = rep.lista.find((r) => r.estado !== 'publicado');
  return (
    <>
      <DatoClave valor={rep.publicados} etiqueta={rep.publicados === 1 ? 'reporte publicado' : 'reportes publicados'} />
      <p className="pg-texto">
        {proximo ? `Próximo: ${proximo.nombre}. ${proximo.motivo}` : 'Todos los reportes están publicados.'}
      </p>
    </>
  );
}

const RESUMEN = {
  propuesta: ResumenPropuesta,
  cotizacion: ResumenCotizacion,
  instalacion: ResumenInstalacion,
  reportes: ResumenReportes
};

function ResumenFases({ codigo }) {
  const fases = useStore().fasesDeCampana(codigo);
  return (
    <section className="pg-pila pg-pila--md" aria-labelledby="fases-t">
      <h2 id="fases-t" className="pg-subtitulo">Resumen por fase</h2>
      <ul className="dc-rejilla">
        {fases.map((f) => {
          const Resumen = RESUMEN[f.clave];
          return (
            <TarjetaFase key={f.clave} codigo={codigo} fase={f}>
              <Resumen codigo={codigo} />
            </TarjetaFase>
          );
        })}
      </ul>
    </section>
  );
}

function DatosCampana({ campana }) {
  const s = useStore();
  const filas = [
    ['Cliente', s.cliente.empresa],
    ['Responsable comercial', s.semilla.responsableComercial],
    ['Vigencia', vigencia(campana.inicio, campana.fin)],
    ['Código', campana.codigo]
  ];
  return (
    <Card as="section" padding="lg" aria-labelledby="datos-t">
      <div className="pg-pila pg-pila--md">
        <h2 id="datos-t" className="pg-subtitulo">Datos de la campaña</h2>
        <dl className="dc-datos">
          {filas.map(([termino, valor]) => (
            <div key={termino} className="dc-datos__fila">
              <dt className="pg-texto">{termino}</dt>
              <dd className="dc-datos__valor">{valor}</dd>
            </div>
          ))}
        </dl>
      </div>
    </Card>
  );
}

export default function DetalleCampana() {
  return (
    <PaginaCampana>
      {(campana) => (
        <>
          <QueSigue codigo={campana.codigo} />
          <ResumenFases codigo={campana.codigo} />
          <DatosCampana campana={campana} />
        </>
      )}
    </PaginaCampana>
  );
}

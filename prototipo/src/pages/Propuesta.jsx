import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert, Button, Switch, TabPanel, Tabs } from '../orbita';
import { useStore } from '../store/index.js';
import { NOMBRE_TIPO, PLAZAS, TIPOS } from '../data/catalogos.js';
import { PaginaCampana } from '../layout/PaginaCampana.jsx';
import { rutaCampana } from '../layout/campanas.js';
import { ResumenPropuesta } from './propuesta/ResumenPropuesta.jsx';
import { GrupoPlaza } from './propuesta/GrupoPlaza.jsx';
import '../layout/layout.css';
import './propuesta/propuesta.css';

const CONSULTA_MOVIL = '(max-width: 600px)';

const OPCIONES_PLAZA = [{ value: 'todas', label: 'Todas' }, ...PLAZAS.map((p) => ({ value: p, label: p }))];
const OPCIONES_ESTADO = [
  { value: 'todos', label: 'Todos' },
  { value: 'pendiente', label: 'Sin responder' },
  { value: 'si', label: 'Sí' },
  { value: 'no', label: 'No' }
];
const OPCIONES_VISTA = [
  { value: 'tarjetas', label: 'Tarjetas' },
  { value: 'tabla', label: 'Tabla' }
];

function useEsMovil() {
  const leer = () => typeof window !== 'undefined' && !!window.matchMedia && window.matchMedia(CONSULTA_MOVIL).matches;
  const [movil, setMovil] = useState(leer);
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return undefined;
    const mq = window.matchMedia(CONSULTA_MOVIL);
    const cambio = () => setMovil(mq.matches);
    mq.addEventListener('change', cambio);
    return () => mq.removeEventListener('change', cambio);
  }, []);
  return movil;
}

const respondido = (v) => v === 'si' || v === 'no';

function pasaEstado(valor, filtro) {
  if (filtro === 'todos') return true;
  if (filtro === 'pendiente') return !respondido(valor);
  return valor === filtro;
}

function Filtro({ id, etiqueta, children }) {
  return (
    <div className="pp-filtro">
      <span id={id} className="pp-etiqueta">{etiqueta}</span>
      {children}
    </div>
  );
}

function ContenidoPropuesta({ campana }) {
  const s = useStore();
  const navigate = useNavigate();
  const esMovil = useEsMovil();
  const { codigo, medios } = campana;
  const respuestas = s.estado.campanas[codigo]?.respuestas || {};
  const progreso = s.progresoPropuesta(codigo);
  const cot = s.cotizacion(codigo);
  const editable = progreso.editable;

  const [tipo, setTipo] = useState(() => TIPOS.find((t) => medios.some((m) => m.tipo === t)) || TIPOS[0]);
  const [plaza, setPlaza] = useState('todas');
  const [estado, setEstado] = useState('todos');
  const [vistaElegida, setVistaElegida] = useState(null);
  const vista = vistaElegida ?? (esMovil ? 'tarjetas' : 'tabla');

  const porTipo = useMemo(() => {
    const mapa = Object.fromEntries(TIPOS.map((t) => [t, []]));
    for (const m of medios) mapa[m.tipo]?.push(m);
    return mapa;
  }, [medios]);

  const tabs = TIPOS.map((t) => {
    const lista = porTipo[t];
    return { id: t, label: NOMBRE_TIPO[t], count: `${lista.filter((m) => respondido(respuestas[m.id])).length}/${lista.length}` };
  });

  const delTipo = porTipo[tipo];
  const grupos = PLAZAS
    .filter((p) => plaza === 'todas' || p === plaza)
    .map((p) => {
      const todos = delTipo.filter((m) => m.plaza === p);
      return { plaza: p, todos, visibles: todos.filter((m) => pasaEstado(respuestas[m.id], estado)) };
    })
    .filter((g) => g.visibles.length > 0);

  const limpiarFiltros = () => {
    setPlaza('todas');
    setEstado('todos');
  };
  const irACotizacion = () => navigate(rutaCampana(codigo, 'cotizacion'));
  const onResponder = (medioId, valor) => s.responder(codigo, medioId, valor);
  const onResponderTodos = (p, valor) => s.responderTodos(codigo, { tipo, plaza: p }, valor);

  let aviso = null;
  if (editable && progreso.confirmada) {
    aviso = cot?.actualizada ? (
      <Alert stage="info" live title="La cotización se actualizó con tus cambios" actions={[{ label: 'Ir a cotización', onClick: irACotizacion }]} />
    ) : (
      <Alert stage="success" live title="Selección confirmada" description="Tu cotización está lista." actions={[{ label: 'Ir a cotización', onClick: irACotizacion }]} />
    );
  }
  // Los avisos de solo consulta (fase cerrada o campaña de consulta) los pinta EncabezadoCampana.

  let contenido;
  if (delTipo.length === 0) {
    contenido = <p className="pp-vacio pg-texto">Esta propuesta no incluye medios de este tipo.</p>;
  } else if (grupos.length === 0) {
    contenido = (
      <div className="pp-vacio">
        <p className="pg-texto">Ningún medio coincide con los filtros.</p>
        <Button variant="secondary" size="xs" onClick={limpiarFiltros}>Limpiar filtros</Button>
      </div>
    );
  } else {
    contenido = grupos.map((g) => (
      <GrupoPlaza
        key={`${tipo}-${g.plaza}`}
        tipo={tipo}
        plaza={g.plaza}
        todos={g.todos}
        visibles={g.visibles}
        respuestas={respuestas}
        vista={vista}
        editable={editable}
        onResponder={onResponder}
        onResponderTodos={onResponderTodos}
      />
    ));
  }

  return (
    <section className="pp" aria-labelledby="pp-titulo">
      <h2 id="pp-titulo" className="pg-subtitulo">Propuesta de medios</h2>
      <ResumenPropuesta progreso={progreso} cot={cot} onConfirmar={() => s.confirmarSeleccion(codigo)} />
      {aviso}
      <div className="pp-medios">
        <Tabs
          idPrefix="pp-tipo"
          label="Tipo de medio"
          items={tabs}
          value={tipo}
          onChange={setTipo}
        />
        {TIPOS.map((t) => (
          <TabPanel key={t} idPrefix="pp-tipo" id={t} active={t === tipo} className="pp-panel">
            <div className="pp-filtros" role="group" aria-label="Filtros y vista">
              <Filtro id="pp-f-plaza" etiqueta="Plaza">
                <Switch labelledBy="pp-f-plaza" options={OPCIONES_PLAZA} value={plaza} onChange={setPlaza} />
              </Filtro>
              <Filtro id="pp-f-estado" etiqueta="Estado">
                <Switch labelledBy="pp-f-estado" options={OPCIONES_ESTADO} value={estado} onChange={setEstado} />
              </Filtro>
              <Filtro id="pp-f-vista" etiqueta="Vista">
                <Switch labelledBy="pp-f-vista" options={OPCIONES_VISTA} value={vista} onChange={setVistaElegida} />
              </Filtro>
            </div>
            <div className="pp-grupos">{contenido}</div>
          </TabPanel>
        ))}
      </div>
    </section>
  );
}

// Propuesta de medios: el cliente responde Sí / No por medio y confirma su selección.
export default function Propuesta() {
  return (
    <PaginaCampana fase="propuesta">
      {(campana) => <ContenidoPropuesta campana={campana} />}
    </PaginaCampana>
  );
}

import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Checkbox, FilterGroup, FilterPanel, Switch, TabPanel, Tabs } from '../orbita';
import { useToastUnaVez } from '../layout/useToastUnaVez.js';
import { BarraBusqueda, FiltrosActivos } from '../layout/BarraFiltros.jsx';
import { useStore } from '../store/index.js';
import { NOMBRE_TIPO, PLAZAS, TIPOS } from '../data/catalogos.js';
import { PaginaCampana } from '../layout/PaginaCampana.jsx';
import { rutaCampana } from '../layout/campanas.js';
import { ResumenPropuesta } from './propuesta/ResumenPropuesta.jsx';
import { GrupoPlaza } from './propuesta/GrupoPlaza.jsx';
import '../layout/layout.css';
import './propuesta/propuesta.css';

const ESTADOS = [
  { value: 'pendiente', label: 'Sin responder' },
  { value: 'si', label: 'Sí' },
  { value: 'no', label: 'No' }
];
const SIN_FILTROS = { plazas: [], estados: [] };
const OPCIONES_VISTA = [
  { value: 'tarjetas', label: 'Tarjetas' },
  { value: 'tabla', label: 'Tabla' }
];

const respondido = (v) => v === 'si' || v === 'no';

// Sin estados elegidos pasan todos; si hay, el medio debe estar en alguno.
function pasaEstado(valor, estados) {
  if (!estados.length) return true;
  return estados.some((e) => (e === 'pendiente' ? !respondido(valor) : valor === e));
}

// Búsqueda sin acentos ni mayúsculas en la clave, el nombre y la dirección del medio.
const sinAcentos = (t) => t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

function coincideTexto(medio, texto) {
  const q = sinAcentos(texto.trim());
  if (!q) return true;
  return [medio.clave, medio.nombre, medio.direccion].some((v) => v && sinAcentos(v).includes(q));
}

const alternar = (lista, valor) => (lista.includes(valor) ? lista.filter((x) => x !== valor) : [...lista, valor]);

// Panel de filtros de Órbita: plaza y estado; se edita un borrador y se aplica con "Aplicar".
function PanelFiltros({ open, onClose, filtros, onAplicar, contar }) {
  const [borrador, setBorrador] = useState(filtros);
  useEffect(() => {
    if (open) setBorrador(filtros);
  }, [open, filtros]);
  const n = contar(borrador);
  return (
    <FilterPanel
      open={open}
      onClose={onClose}
      resumen={<>Mostrando <strong>{n}</strong> {n === 1 ? 'medio' : 'medios'}</>}
      onLimpiar={() => setBorrador(SIN_FILTROS)}
      onAplicar={() => onAplicar(borrador)}
    >
      <FilterGroup title="Plaza">
        {PLAZAS.map((p) => (
          <Checkbox key={p} label={p} checked={borrador.plazas.includes(p)} onChange={() => setBorrador((b) => ({ ...b, plazas: alternar(b.plazas, p) }))} />
        ))}
      </FilterGroup>
      <FilterGroup title="Estado">
        {ESTADOS.map((e) => (
          <Checkbox key={e.value} label={e.label} checked={borrador.estados.includes(e.value)} onChange={() => setBorrador((b) => ({ ...b, estados: alternar(b.estados, e.value) }))} />
        ))}
      </FilterGroup>
    </FilterPanel>
  );
}

function ContenidoPropuesta({ campana, vista }) {
  const s = useStore();
  const navigate = useNavigate();
  const { codigo, medios } = campana;
  const respuestas = s.estado.campanas[codigo]?.respuestas || {};
  const progreso = s.progresoPropuesta(codigo);
  const cot = s.cotizacion(codigo);
  const editable = progreso.editable;

  const [tipo, setTipo] = useState(() => TIPOS.find((t) => medios.some((m) => m.tipo === t)) || TIPOS[0]);
  const [filtros, setFiltros] = useState(SIN_FILTROS);
  const [panelAbierto, setPanelAbierto] = useState(false);
  const [texto, setTexto] = useState('');

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
  const gruposCon = (f) =>
    PLAZAS
      .filter((p) => !f.plazas.length || f.plazas.includes(p))
      .map((p) => {
        const todos = delTipo.filter((m) => m.plaza === p);
        return { plaza: p, todos, visibles: todos.filter((m) => coincideTexto(m, texto) && pasaEstado(respuestas[m.id], f.estados)) };
      })
      .filter((g) => g.visibles.length > 0);
  const grupos = gruposCon(filtros);
  const contar = (f) => gruposCon(f).reduce((n, g) => n + g.visibles.length, 0);
  const visibles = contar(filtros);

  const limpiarFiltros = () => {
    setFiltros(SIN_FILTROS);
    setTexto('');
  };
  const activos = filtros.plazas.length + filtros.estados.length;
  const etiquetas = [];
  if (texto.trim()) etiquetas.push({ clave: 'q', texto: `"${texto.trim()}"`, color: 'success', icono: 'search', quitar: () => setTexto('') });
  filtros.plazas.forEach((p) => etiquetas.push({ clave: `p-${p}`, texto: p, quitar: () => setFiltros((f) => ({ ...f, plazas: f.plazas.filter((x) => x !== p) })) }));
  filtros.estados.forEach((e) =>
    etiquetas.push({
      clave: `e-${e}`,
      texto: ESTADOS.find((x) => x.value === e).label,
      quitar: () => setFiltros((f) => ({ ...f, estados: f.estados.filter((x) => x !== e) }))
    })
  );
  const irACotizacion = () => navigate(rutaCampana(codigo, 'cotizacion'));
  const onResponder = (medioId, valor) => s.responder(codigo, medioId, valor);
  const onResponderTodos = (p, valor) => s.responderTodos(codigo, { tipo, plaza: p }, valor);

  // Avisos como Toast, una sola vez: al entrar o cuando ocurren (confirmar, cambiar después de confirmar).
  let aviso = null;
  if (editable && progreso.confirmada) {
    aviso = cot?.actualizada ? 'actualizada' : 'confirmada';
  }
  useToastUnaVez(aviso, aviso === 'actualizada'
    ? { color: 'info', title: 'La cotización se actualizó con tus cambios', actions: [{ label: 'Ir a cotización', onClick: irACotizacion }] }
    : { color: 'success', title: 'Selección confirmada', body: 'Tu cotización está lista.', actions: [{ label: 'Ir a cotización', onClick: irACotizacion }] });
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
    <div className="mc-cuerpo">
    <section className="pp mc-principal" aria-label="Medios propuestos">
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
            <div className="pp-herramientas">
              <BarraBusqueda
                busqueda={texto}
                onBuscar={setTexto}
                activos={activos}
                onAbrirFiltros={() => setPanelAbierto(true)}
                total={visibles === 1 ? '1 medio' : `${visibles} medios`}
                placeholder="Buscar por clave, nombre o dirección"
                etiqueta="Buscar medios"
              />
              <FiltrosActivos etiquetas={etiquetas} onLimpiar={limpiarFiltros} />
            </div>
            <div className="pp-grupos">{contenido}</div>
          </TabPanel>
        ))}
      </div>
    </section>
    <PanelFiltros
      open={panelAbierto}
      onClose={() => setPanelAbierto(false)}
      filtros={filtros}
      contar={contar}
      onAplicar={(f) => {
        setFiltros(f);
        setPanelAbierto(false);
      }}
    />
    <aside className="mc-lateral">
      <ResumenPropuesta progreso={progreso} cot={cot} onConfirmar={() => s.confirmarSeleccion(codigo)} />
    </aside>
    </div>
  );
}

// Propuesta de medios: el cliente responde Sí / No por medio y confirma su selección.
// La vista (tarjetas o tabla) vive aquí porque su Switch está en el encabezado y el contenido la usa.
export default function Propuesta() {
  const [vistaElegida, setVistaElegida] = useState(null);
  const vista = vistaElegida ?? 'tarjetas';
  const controles = <Switch size="md" label="Vista" options={OPCIONES_VISTA} value={vista} onChange={setVistaElegida} />;
  return (
    <PaginaCampana fase="propuesta" controles={controles}>
      {(campana) => <ContenidoPropuesta campana={campana} vista={vista} />}
    </PaginaCampana>
  );
}

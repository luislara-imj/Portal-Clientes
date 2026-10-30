import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Accordion, Alert, Card, Divider, Icon, ProgressBar } from '../orbita';
import { useStore } from '../store/index.js';
import { PaginaCampana } from '../layout/PaginaCampana.jsx';
import { rutaCampana } from '../layout/campanas.js';
import { agrupar, resumir } from './instalacion/pasos.js';
import {
  ICONO_PLAZA, ICONO_TIPO, Marcador, PanelLineaDeTiempo, TarjetaAvance, TarjetaSitio, textosMedio, useEsMovil
} from './instalacion/partes.jsx';
import '../layout/layout.css';
import './instalacion/Instalacion.css';

// Fase bloqueada (antes de aceptar la cotización): candado y motivo, sin columnas.
function Bloqueada({ motivo }) {
  return (
    <Card as="section" padding="lg" className="ins-bloqueada" aria-labelledby="ins-bloq-t">
      <span className="ins-bloqueada__icono">
        <Icon name="lock" size={24} />
      </span>
      <h2 id="ins-bloq-t" className="pg-subtitulo">Instalación bloqueada</h2>
      <p className="pg-texto">{motivo}</p>
    </Card>
  );
}

function AvanceGeneral({ inst }) {
  return (
    <Card as="section" padding="lg" aria-labelledby="ins-avance-t">
      <div className="pg-pila pg-pila--md">
        <h2 id="ins-avance-t" className="pg-subtitulo">Avance general</h2>
        <ProgressBar value={inst.porcentaje} size="sm" label={`${inst.instalados} de ${inst.total} medios instalados`} />
      </div>
    </Card>
  );
}

// Drill-down Tipo de medio → Plaza → Sitio. En móvil cada columna es un Accordion.
function Recorrido({ codigo, inst }) {
  const s = useStore();
  const movil = useEsMovil();
  const [sel, setSel] = useState({ tipo: null, plaza: null, sitio: null });
  const [abiertas, setAbiertas] = useState({ tipo: true, plaza: false, sitio: false });
  const plazaRef = useRef(null);
  const sitioRef = useRef(null);

  const tipos = inst.porTipo.map((t) => ({ ...t, ...resumir(inst.medios.filter((m) => m.tipo === t.tipo)) }));
  const tipo = tipos.find((t) => t.tipo === sel.tipo) || null;
  const delTipo = tipo ? inst.medios.filter((m) => m.tipo === tipo.tipo) : [];
  const plazas = inst.porPlaza
    .map((p) => ({ plaza: p.plaza, nombre: p.nombre, ...resumir(delTipo.filter((m) => m.plaza === p.plaza)) }))
    .filter((p) => p.total > 0);
  const plaza = plazas.find((p) => p.plaza === sel.plaza) || null;
  const sitios = plaza ? delTipo.filter((m) => m.plaza === plaza.plaza) : [];
  const grupos = agrupar(sitios, (m) => m.formato || 'Otros');
  const filaSel = sel.sitio ? inst.medios.find((m) => m.medioId === sel.sitio) || null : null;
  const textosSel = filaSel ? textosMedio(filaSel, s.medio(codigo, filaSel.medioId)) : null;

  const enfocarPrimera = (ref) => {
    requestAnimationFrame(() => ref.current?.querySelector('.ins-tarjeta, .ins-sitio')?.focus());
  };

  const elegirTipo = (clave) => {
    setSel((x) => (x.tipo === clave ? x : { tipo: clave, plaza: null, sitio: null }));
    if (movil) {
      setAbiertas({ tipo: false, plaza: true, sitio: false });
      enfocarPrimera(plazaRef);
    }
  };
  const elegirPlaza = (clave) => {
    setSel((x) => (x.plaza === clave ? x : { ...x, plaza: clave, sitio: null }));
    if (movil) {
      setAbiertas({ tipo: false, plaza: false, sitio: true });
      enfocarPrimera(sitioRef);
    }
  };
  const elegirSitio = (medioId) => setSel((x) => ({ ...x, sitio: medioId }));
  const cerrarPanel = () => setSel((x) => ({ ...x, sitio: null }));

  // Estados de Figma: el tipo queda con borde brand cuando ya hay plaza; lo elegido va en brand pressed.
  const estadoTipo = (clave) => (clave !== tipo?.tipo ? 'resto' : plaza ? 'activo' : 'elegido');
  const estadoPlaza = (clave) => (clave === plaza?.plaza ? 'elegido' : 'resto');

  const listaTipos = (
    <div className="ins-col__lista">
      {tipos.map((t) => (
        <TarjetaAvance
          key={t.tipo}
          icono={ICONO_TIPO[t.tipo] || 'shapes'}
          nombre={t.nombre}
          resumen={t}
          estado={estadoTipo(t.tipo)}
          horizontal={movil}
          onClick={() => elegirTipo(t.tipo)}
        />
      ))}
    </div>
  );

  const listaPlazas = tipo ? (
    <div className="ins-col__lista" ref={plazaRef}>
      {plazas.map((p) => (
        <TarjetaAvance
          key={p.plaza}
          icono={ICONO_PLAZA}
          nombre={p.nombre}
          resumen={p}
          estado={estadoPlaza(p.plaza)}
          horizontal={movil}
          onClick={() => elegirPlaza(p.plaza)}
        />
      ))}
    </div>
  ) : (
    <Marcador titulo="Plaza" ayuda="Elige un tipo de medio para ver sus plazas." />
  );

  const listaSitios = plaza ? (
    <div className="ins-col__lista ins-col__lista--sitios" ref={sitioRef}>
      {grupos.map((g) => {
        const r = resumir(g.items);
        return (
          <Accordion
            key={`${tipo.tipo}-${plaza.plaza}-${g.clave}`}
            className="ins-grupo"
            defaultOpen
            title={
              <span className="ins-grupo__titulo">
                <Icon name={ICONO_TIPO[tipo.tipo] || 'shapes'} size={16} className="ins-grupo__icono" />
                {g.clave}
              </span>
            }
            description={`${r.instalados} de ${r.total} instalados`}
          >
            {g.items.map((fila) => {
              const { titulo, detalle } = textosMedio(fila, s.medio(codigo, fila.medioId));
              return (
                <TarjetaSitio
                  key={fila.medioId}
                  titulo={titulo}
                  detalle={detalle}
                  fila={fila}
                  elegido={fila.medioId === sel.sitio}
                  onClick={() => elegirSitio(fila.medioId)}
                />
              );
            })}
          </Accordion>
        );
      })}
    </div>
  ) : (
    <Marcador titulo="Sitio" ayuda={tipo ? 'Elige una plaza para ver sus sitios.' : 'Elige un tipo de medio y una plaza.'} />
  );

  const panel = (
    <PanelLineaDeTiempo abierto={!!filaSel} titulo={textosSel?.titulo} fila={filaSel} onCerrar={cerrarPanel} />
  );

  if (movil) {
    const alternar = (clave) => (abierta) => setAbiertas((x) => ({ ...x, [clave]: abierta }));
    return (
      <section className="ins-movil" aria-label="Avance por tipo de medio, plaza y sitio">
        <Accordion
          title="Tipo de medio"
          description={tipo ? `${tipo.nombre} · ${tipo.porcentaje}%` : 'Elige un tipo de medio'}
          open={abiertas.tipo}
          onToggle={alternar('tipo')}
        >
          {listaTipos}
        </Accordion>
        <Accordion
          title="Plaza"
          description={plaza ? `${plaza.nombre} · ${plaza.porcentaje}%` : tipo ? 'Elige una plaza' : 'Elige un tipo de medio primero'}
          empty={!tipo}
          open={abiertas.plaza}
          onToggle={alternar('plaza')}
        >
          {listaPlazas}
        </Accordion>
        <Accordion
          title="Sitio"
          description={plaza ? `${sitios.length} ${sitios.length === 1 ? 'sitio' : 'sitios'}` : 'Elige una plaza primero'}
          empty={!plaza}
          open={abiertas.sitio}
          onToggle={alternar('sitio')}
        >
          {listaSitios}
        </Accordion>
        {panel}
      </section>
    );
  }

  return (
    <Card as="section" padding="md" className="ins-drill" aria-label="Avance por tipo de medio, plaza y sitio">
      <div className="ins-cols">
        <section className="ins-col ins-col--angosta" aria-labelledby="ins-col-tipo">
          <h3 id="ins-col-tipo" className="ins-col__titulo">Tipo de medio</h3>
          {listaTipos}
        </section>
        <Divider orientation="vertical" className="ins-divisor" />
        <section className="ins-col ins-col--angosta" aria-labelledby="ins-col-plaza">
          <h3 id="ins-col-plaza" className="ins-col__titulo">Plaza</h3>
          {listaPlazas}
        </section>
        <Divider orientation="vertical" className="ins-divisor" />
        <section className="ins-col ins-col--ancha" aria-labelledby="ins-col-sitio">
          <h3 id="ins-col-sitio" className="ins-col__titulo">Sitio</h3>
          {listaSitios}
        </section>
      </div>
      {panel}
    </Card>
  );
}

function ContenidoInstalacion({ codigo }) {
  const s = useStore();
  const navigate = useNavigate();
  const fase = s.fasesDeCampana(codigo).find((f) => f.clave === 'instalacion');
  if (!fase || fase.estado === 'bloqueada') return <Bloqueada motivo={fase?.motivo || 'Acepta la cotización para iniciar la instalación.'} />;

  const inst = s.instalacion(codigo);
  if (!inst || inst.total === 0) {
    return (
      <Card as="section" padding="lg" aria-labelledby="ins-vacio-t">
        <h2 id="ins-vacio-t" className="pg-subtitulo">Sin medios en instalación</h2>
        <p className="pg-texto">Los medios aparecerán aquí cuando OBP programe su instalación.</p>
      </Card>
    );
  }
  const reportes = s.fasesDeCampana(codigo).find((f) => f.clave === 'reportes');

  return (
    <>
      <AvanceGeneral inst={inst} />
      {inst.completa && (
        <Alert
          stage="success"
          live
          title="Instalación completa. Ya puedes ver tu reporte fotográfico inicial."
          actions={reportes && reportes.estado !== 'bloqueada'
            ? [{ label: 'Ver reportes', onClick: () => navigate(rutaCampana(codigo, 'reportes')) }]
            : undefined}
        />
      )}
      <Recorrido codigo={codigo} inst={inst} />
    </>
  );
}

export default function Instalacion() {
  return (
    <PaginaCampana fase="instalacion">
      {/* key: al cambiar de campaña se reinicia la selección del recorrido. */}
      {(campana) => <ContenidoInstalacion key={campana.codigo} codigo={campana.codigo} />}
    </PaginaCampana>
  );
}

import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge, Button, FileDropzone, FileItem, Icon } from '../orbita';
import { useToastUnaVez } from '../layout/useToastUnaVez.js';
import { formatoFecha, formatoMXN, useStore } from '../store/index.js';
import { PaginaCampana } from '../layout/PaginaCampana.jsx';
import { proximaAccion, rutaCampana, vigencia } from '../layout/campanas.js';
import '../layout/layout.css';
import './DetalleCampana.css';

// "Qué sigue": Toast una sola vez al entrar al detalle de cada campaña.
function QueSigue({ codigo }) {
  const s = useStore();
  const navigate = useNavigate();
  const accion = proximaAccion(s.resumenCampana(codigo));
  useToastUnaVez(`que-sigue-${codigo}`, {
    color: accion.pendiente ? 'warning' : 'info',
    title: 'Qué sigue',
    body: accion.texto,
    actions: [{ label: accion.boton, onClick: () => navigate(rutaCampana(codigo, accion.fase)) }]
  });
  return null;
}

// Estado de la fase (fasesDeCampana) → Badge. Siempre ícono y texto.
const BADGE_ESTADO = {
  activa: { color: 'info', icon: 'info', texto: 'En curso' },
  consulta: { color: 'gray', icon: 'check', texto: 'Cerrada' },
  bloqueada: { color: 'gray', icon: 'lock', texto: 'Bloqueada' }
};

const ICONO_FASE = { propuesta: 'megaphone', cotizacion: 'file', instalacion: 'billboard', reportes: 'image' };
const NUMERO_FASE = { propuesta: 1, cotizacion: 2, instalacion: 3, reportes: 4 };
const COLOR_TIPO = { sitios: 'blue', indoor: 'cyan', camiones: 'violet', vallas: 'orange', riders: 'magenta' };

// Anillo de avance (estilo de la referencia): aro con el porcentaje al centro.
function AnilloFase({ valor, color }) {
  const r = 36;
  const circ = 2 * Math.PI * r;
  const v = Math.max(0, Math.min(100, Math.round(valor)));
  return (
    <svg className="dc-anillo" viewBox="0 0 88 88" role="img" aria-label={`${v}% de avance`}>
      <circle className="dc-anillo__pista" cx="44" cy="44" r={r} />
      <circle
        className={`dc-anillo__valor is-${color}`}
        cx="44"
        cy="44"
        r={r}
        strokeDasharray={circ}
        strokeDashoffset={circ * (1 - v / 100)}
        transform="rotate(-90 44 44)"
      />
      <text className="dc-anillo__texto" x="44" y="49" textAnchor="middle">{v}%</text>
    </svg>
  );
}

// Barra segmentada con leyenda (como "Portfolio allocation"): un tramo por categoría.
function BarraSegmentada({ titulo, derecha, segmentos }) {
  const total = segmentos.reduce((n, sg) => n + sg.valor, 0);
  return (
    <div className="dc-reparto">
      <div className="dc-reparto__cabeza">
        <span className="dc-reparto__titulo">{titulo}</span>
        {derecha && <span className="dc-reparto__derecha">{derecha}</span>}
      </div>
      <div className="dc-reparto__barra" aria-hidden="true">
        {total > 0
          ? segmentos.filter((sg) => sg.valor > 0).map((sg) => (
              <span key={sg.label} className={`dc-reparto__tramo is-${sg.color}`} style={{ flexGrow: sg.valor }} />
            ))
          : <span className="dc-reparto__tramo is-neutro" style={{ flexGrow: 1 }} />}
      </div>
      <ul className="dc-reparto__leyenda">
        {segmentos.map((sg) => (
          <li key={sg.label}>
            <span className={`dc-reparto__punto is-${sg.color}`} aria-hidden="true" />
            {sg.label}
            {sg.detalle && <span className="dc-reparto__detalle"> · {sg.detalle}</span>}
          </li>
        ))}
      </ul>
    </div>
  );
}

// Datos de cada fase para la tarjeta: cifra principal, anillo, reparto, botones y pie.
function datosFase(s, codigo, campana, fase) {
  if (fase.clave === 'propuesta') {
    const p = s.progresoPropuesta(codigo);
    const no = p.respondidos - p.si;
    return {
      etiqueta: 'Medios respondidos',
      cifra: String(p.respondidos),
      de: `de ${p.total}`,
      nota: `Incluidos: ${p.si} ${p.si === 1 ? 'medio' : 'medios'}`,
      anillo: { valor: p.total ? (p.respondidos / p.total) * 100 : 0, color: 'brand' },
      reparto: {
        titulo: 'Respuestas',
        derecha: p.pendientes ? `${p.pendientes} sin responder` : 'Todo respondido',
        segmentos: [
          { label: 'Sí', valor: p.si, color: 'brand' },
          { label: 'No', valor: no, color: 'warning' },
          { label: 'Sin responder', valor: p.pendientes, color: 'neutro' }
        ]
      },
      secundaria: p.editable && p.puedeConfirmar && !p.confirmada ? { label: 'Confirmar', onClick: () => s.confirmarSeleccion(codigo) } : null,
      pie: `Vigencia ${vigencia(campana.inicio, campana.fin)} · ${p.total} medios propuestos`
    };
  }
  if (fase.clave === 'cotizacion') {
    const cot = s.cotizacion(codigo);
    const aceptadaEn = s.estado.campanas[codigo]?.aceptadaEn;
    return {
      etiqueta: 'Total con IVA',
      cifra: formatoMXN(cot.total),
      nota: cot.aceptada && aceptadaEn ? `Aceptada el ${formatoFecha(aceptadaEn)}` : 'Pendiente de aceptar',
      reparto: {
        titulo: 'Inversión por tipo de medio',
        derecha: `${cot.tipos.length} ${cot.tipos.length === 1 ? 'tipo' : 'tipos'}`,
        segmentos: cot.tipos.map((t) => ({ label: t.nombre, valor: t.subtotalConDescuento, color: COLOR_TIPO[t.tipo] ?? 'neutro' }))
      },
      pie: `Subtotal con descuento ${formatoMXN(cot.subtotalConDescuento)} · IVA 16%`
    };
  }
  if (fase.clave === 'instalacion') {
    const inst = s.instalacion(codigo);
    const cuenta = (e) => inst.medios.filter((m) => m.estatus === e).length;
    const campanaFase = s.estado.campanas[codigo]?.fase;
    const enVivo = s.campana(codigo)?.flujo === 'completo' && (campanaFase === 'Aceptada' || campanaFase === 'En instalación');
    return {
      etiqueta: 'Medios instalados',
      cifra: String(inst.instalados),
      de: `de ${inst.total}`,
      nota: inst.completa ? 'Instalación completa' : `${inst.total - inst.instalados} por terminar`,
      anillo: { valor: inst.porcentaje, color: 'success' },
      reparto: {
        titulo: 'Estatus de medios',
        derecha: `${inst.total} medios`,
        segmentos: [
          { label: 'Instalado', valor: cuenta('Instalado'), color: 'success' },
          { label: 'En instalación', valor: cuenta('En instalación'), color: 'brand' },
          { label: 'Por instalar', valor: cuenta('Por instalar'), color: 'neutro' }
        ]
      },
      vivo: enVivo,
      pie: enVivo ? 'Se actualiza en vivo' : `Vigencia ${vigencia(campana.inicio, campana.fin)}`
    };
  }
  const rep = s.reportes(codigo);
  const total = rep.lista.length;
  const proximo = rep.lista.find((r) => r.estado !== 'publicado');
  return {
    etiqueta: 'Reportes publicados',
    cifra: String(rep.publicados),
    de: `de ${total}`,
    nota: proximo ? `Próximo: ${proximo.nombre}` : 'Todos publicados',
    anillo: { valor: total ? (rep.publicados / total) * 100 : 0, color: 'success' },
    reparto: {
      titulo: 'Reportes',
      derecha: proximo?.motivo ?? null,
      segmentos: [
        { label: 'Publicados', valor: rep.publicados, color: 'success' },
        { label: 'Pendientes', valor: total - rep.publicados, color: 'neutro' }
      ]
    },
    pie: 'Reportes fotográficos mensuales'
  };
}

const BOTON_FASE = {
  propuesta: { activa: 'Abrir propuesta', consulta: 'Ver propuesta' },
  cotizacion: { activa: 'Abrir cotización', consulta: 'Ver cotización' },
  instalacion: { activa: 'Ver instalación', consulta: 'Ver instalación' },
  reportes: { activa: 'Ver reportes', consulta: 'Ver reportes' }
};

function TarjetaFase({ codigo, campana, fase }) {
  const s = useStore();
  const navigate = useNavigate();
  const badge = BADGE_ESTADO[fase.estado];
  const tituloId = `fase-${fase.clave}-t`;
  const bloqueada = fase.estado === 'bloqueada';
  const d = bloqueada ? null : datosFase(s, codigo, campana, fase);

  return (
    <li className={bloqueada ? 'dc-fase is-bloqueada' : 'dc-fase'} aria-labelledby={tituloId}>
      <div className="dc-fase__cabeza">
        <span className="dc-fase__icono" aria-hidden="true">
          <Icon name={bloqueada ? 'lock' : ICONO_FASE[fase.clave]} size={20} />
        </span>
        <div className="dc-fase__titulos">
          <span className="dc-fase__numero">Fase {NUMERO_FASE[fase.clave]}</span>
          <h3 id={tituloId} className="dc-fase__titulo">{fase.nombre}</h3>
        </div>
        <Badge color={badge.color} theme="soft" icon={badge.icon}>{badge.texto}</Badge>
      </div>

      {bloqueada ? (
        <p className="dc-fase__motivo">{fase.motivo}</p>
      ) : (
        <>
          <div className="dc-fase__principal">
            <div className="dc-fase__cifras">
              <span className="dc-fase__etiqueta">{d.etiqueta}</span>
              <p className="dc-fase__cifra" aria-live={d.vivo ? 'polite' : undefined}>
                {d.cifra}
                {d.de && <span className="dc-fase__de"> {d.de}</span>}
              </p>
              <span className="dc-fase__nota">{d.nota}</span>
            </div>
            {d.anillo && <AnilloFase valor={d.anillo.valor} color={d.anillo.color} />}
          </div>
          <BarraSegmentada {...d.reparto} />
          <div className="dc-fase__acciones">
            <Button variant="primary" size="sm" pill="pill" fullWidth onClick={() => navigate(rutaCampana(codigo, fase.clave))}>
              {BOTON_FASE[fase.clave][fase.estado] ?? 'Abrir'}
            </Button>
            {d.secundaria && (
              <Button variant="secondary" size="sm" pill="pill" onClick={d.secundaria.onClick}>
                {d.secundaria.label}
              </Button>
            )}
          </div>
        </>
      )}
      <p className="dc-fase__pie">{bloqueada ? 'Se desbloquea al completar la fase anterior' : d.pie}</p>
    </li>
  );
}

function ResumenFases({ codigo, campana }) {
  const fases = useStore().fasesDeCampana(codigo);
  return (
    <section className="dc-contenedor" aria-labelledby="fases-t">
      <h2 id="fases-t" className="dc-contenedor__titulo">Resumen por fase</h2>
      <ul className="dc-rejilla">
        {fases.map((f) => (
          <TarjetaFase key={f.clave} codigo={codigo} campana={campana} fase={f} />
        ))}
      </ul>
    </section>
  );
}

const FORMATOS = ['jpg', 'jpeg', 'png', 'ai', 'psd'];
const MAX_BYTES = 10 * 1024 ** 3; // 10 GB

function formatoTamano(bytes) {
  if (bytes >= 1024 ** 3) return `${(bytes / 1024 ** 3).toFixed(1)} GB`;
  if (bytes >= 1024 ** 2) return `${(bytes / 1024 ** 2).toFixed(1)} MB`;
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

function formatoDe(nombre) {
  const ext = nombre.split('.').pop()?.toUpperCase() ?? '';
  return ext === 'JPEG' ? 'JPG' : ext;
}

// Archivos de la campaña: se suben en cualquier fase. La subida se simula (en producción irán
// a Google Drive): avanza de 0 a 100 % en 2 a 8 s según el peso y luego se guarda en el store.
function ArchivosCampana({ codigo }) {
  const s = useStore();
  const [subiendo, setSubiendo] = useState([]);
  const timers = useRef({});

  useEffect(() => () => Object.values(timers.current).forEach(clearInterval), []);

  const subir = (files) => {
    files.forEach((f) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      const duracion = Math.min(8000, Math.max(2000, (f.size / (50 * 1024 ** 2)) * 1000));
      const inicio = Date.now();
      setSubiendo((l) => [...l, { id, nombre: f.name, formato: formatoDe(f.name), tamano: f.size, progreso: 0 }]);
      timers.current[id] = setInterval(() => {
        const progreso = Math.min(100, Math.round(((Date.now() - inicio) / duracion) * 100));
        if (progreso >= 100) {
          clearInterval(timers.current[id]);
          delete timers.current[id];
          setSubiendo((l) => l.filter((u) => u.id !== id));
          s.agregarArchivo(codigo, { id, nombre: f.name, tipo: formatoDe(f.name), tamano: f.size, subidoEn: Date.now() });
          return;
        }
        setSubiendo((l) => l.map((u) => (u.id === id ? { ...u, progreso, restante: Math.ceil(((100 - progreso) / 100) * (duracion / 1000)) } : u)));
      }, 200);
    });
  };

  const cancelar = (id) => {
    clearInterval(timers.current[id]);
    delete timers.current[id];
    setSubiendo((l) => l.filter((u) => u.id !== id));
  };

  const archivos = s.archivos(codigo);
  return (
    <div className="dc-archivos">
      <h3 className="dc-archivos__titulo">Archivos de la campaña</h3>
      <FileDropzone
        accept={FORMATOS}
        maxBytes={MAX_BYTES}
        ayuda="JPG, PNG, AI o PSD. Peso máximo 10 GB."
        errorTexto="No se puede cargar. Usa un archivo JPG, PNG, AI o PSD de hasta 10 GB."
        onFiles={subir}
      />
      {(subiendo.length > 0 || archivos.length > 0) && (
        <ul className="dc-archivos__lista" aria-label="Archivos subidos">
          {subiendo.map((u) => (
            <li key={u.id}>
              <FileItem
                nombre={u.nombre}
                formato={u.formato}
                estado="cargando"
                progreso={u.progreso}
                detalle={`${formatoTamano(u.tamano)} | ${u.progreso}% • ${u.restante ?? '…'} seg. restantes`}
                onQuitar={() => cancelar(u.id)}
              />
            </li>
          ))}
          {archivos.map((a) => (
            <li key={a.id}>
              <FileItem
                nombre={a.nombre}
                formato={a.tipo}
                estado="completo"
                detalle={`${formatoTamano(a.tamano)} • Subido el ${formatoFecha(a.subidoEn)}`}
                onQuitar={() => s.quitarArchivo(codigo, a.id)}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// Tarjeta lateral (mismo estilo que Acciones pendientes de Mis campañas): datos y archivos.
function DatosCampana({ campana }) {
  const s = useStore();
  const filas = [
    ['Cliente', s.cliente.empresa],
    ['Responsable comercial', s.semilla.responsableComercial],
    ['Vigencia', vigencia(campana.inicio, campana.fin)],
    ['Código', campana.codigo]
  ];
  return (
    <section className="mc-acciones dc-lateral" aria-labelledby="datos-t">
      <div className="mc-acciones-cabecera">
        <h2 id="datos-t" className="mc-acciones-titulo">
          <Icon name="info" size={20} />
          Datos de la campaña
        </h2>
      </div>
      <dl className="dc-datos-lateral">
        {filas.map(([termino, valor]) => (
          <div key={termino} className="dc-datos__fila">
            <dt className="pg-texto">{termino}</dt>
            <dd className="dc-datos__valor">{valor}</dd>
          </div>
        ))}
      </dl>
      <ArchivosCampana codigo={campana.codigo} />
    </section>
  );
}

export default function DetalleCampana() {
  return (
    <PaginaCampana>
      {(campana) => (
        <>
          <div className="mc-cuerpo">
            <div className="mc-principal">
              <QueSigue codigo={campana.codigo} />
              <ResumenFases codigo={campana.codigo} campana={campana} />
            </div>
            <aside className="mc-lateral dc-aside">
              <DatosCampana campana={campana} />
            </aside>
          </div>
        </>
      )}
    </PaginaCampana>
  );
}

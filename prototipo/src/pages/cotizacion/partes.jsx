import { useState } from 'react';
import { Button, Card, Icon, Modal, cx } from '../../orbita';
import { formatoFecha, formatoMXN } from '../../store/index.js';
import { EstadoVacio } from '../../layout/EstadoVacio.jsx';
import { NOMBRE_PLAZA } from '../../data/catalogos.js';
import { claveDe, esUnidad, montoConDescuentoDe, montoDe } from '../propuesta/formatos.js';
import { IlustracionMedio } from '../propuesta/IlustracionMedio.jsx';
import { ICONO_TIPO } from '../propuesta/DatosMedio.jsx';
import { mediosDeLineas, plazasDe, tiposOrdenados } from './capas.js';
import { tiempoServicio } from './documento.js';
import './cotizacion.css';

const textoMedios = (n) => (n === 1 ? '1 medio' : `${n} medios`);
const porIdDe = (medios) => new Map(medios.map((m) => [m.id, m]));
const porcentaje = (parte, total) => (total ? Math.round((parte / total) * 100) : 0);

/**
 * Encabezado visual de la cotización: folio, campaña, datos clave en etiquetas y la distribución de la
 * inversión por tipo de medio (barra apilada con el color de cada tipo, el mismo de sus tarjetas).
 */
function Encabezado({ campana, tipos, total, ciudades, validaHasta }) {
  const medios = tipos.reduce((n, t) => n + t.medios, 0);
  return (
    <header className="cot-hero">
      <div className="cot-hero__texto">
        <span className="cot-hero__folio">Cotización · {campana.codigo}</span>
        <h2 id="cot-medios-t" className="cot-hero__titulo">{campana.marca ? `${campana.marca} · ${campana.nombre}` : campana.nombre}</h2>
        <ul className="cot-hero__chips">
          <li><Icon name="calendar" size={10} /> {formatoFecha(campana.inicio)} – {formatoFecha(campana.fin)}</li>
          <li><Icon name="layers" size={10} /> {textoMedios(medios)}</li>
          <li><Icon name="location" size={10} /> {ciudades === 1 ? '1 ciudad' : `${ciudades} ciudades`}</li>
          <li><Icon name="clock" size={10} /> Válida hasta {formatoFecha(validaHasta)}</li>
        </ul>
      </div>
      <div className="cot-distribucion">
        <span className="cot-etiqueta">Distribución de tu inversión</span>
        <div className="cot-distribucion__barra" role="img" aria-label={tipos.map((t) => `${t.nombre} ${porcentaje(t.subtotalConDescuento, total)}%`).join(', ')}>
          {tipos.map((t) => (
            <span key={t.tipo} className={`cot-color--${t.tipo}`} style={{ flexGrow: t.subtotalConDescuento || 0.0001 }} title={`${t.nombre}: ${porcentaje(t.subtotalConDescuento, total)}%`} />
          ))}
        </div>
      </div>
    </header>
  );
}

// Medios cotizados: encabezado visual, fila de tarjetas por tipo (seleccionable) y, debajo, los medios
// del tipo elegido agrupados por plaza. El tipo elegido vive aquí; si la cotización cambia y ya no existe,
// se usa el primero.
export function MediosCotizados({ tipos, medios, campana, totalConDescuento, validaHasta }) {
  const [elegido, setElegido] = useState(null);
  const visibles = tiposOrdenados(tipos);
  const tipo = visibles.find((t) => t.tipo === elegido) || visibles[0] || null;
  const porId = porIdDe(medios);
  const ciudades = new Set(medios.map((m) => m.plaza).filter(Boolean)).size;

  if (!tipo) return null;
  return (
    <>
      <Encabezado campana={campana} tipos={visibles} total={totalConDescuento} ciudades={ciudades} validaHasta={validaHasta} />
      <ul className="cot-rejilla" aria-label="Tipos de medio cotizados">
        {visibles.map((t) => {
          const pct = porcentaje(t.subtotalConDescuento, totalConDescuento);
          return (
            <li key={t.tipo}>
              <Card
                padding="md"
                className={cx('cot-tarjeta', `cot-color--${t.tipo}`)}
                aria-pressed={t.tipo === tipo.tipo}
                onClick={() => setElegido(t.tipo)}
              >
                <span className="cot-tarjeta__cabeza">
                  <span className="cot-tarjeta__icono" aria-hidden="true"><Icon name={ICONO_TIPO[t.tipo]} size={16} /></span>
                  <span className="cot-tarjeta__nombre">{t.nombre}</span>
                  <span className="cot-tarjeta__pct">{pct}%</span>
                </span>
                <span className="cot-tarjeta__monto">{formatoMXN(t.subtotalConDescuento)}</span>
                <span className="cot-tarjeta__medios">
                  {textoMedios(t.medios)} · {plazasDe(t).map((p) => p.plaza || 'Sin plaza').join(' · ')}
                </span>
                <span className="cot-tarjeta__barra" aria-hidden="true"><span style={{ width: `${pct}%` }} /></span>
              </Card>
            </li>
          );
        })}
      </ul>
      <div className="cot-cabecera">
        <h3 className="cot-cabecera__titulo">
          <Icon name={ICONO_TIPO[tipo.tipo]} size={16} /> {tipo.nombre}
        </h3>
        <p className="pg-texto cot-cabecera__resumen">
          {textoMedios(tipo.medios)} · {formatoMXN(tipo.subtotalConDescuento)} con descuento
        </p>
      </div>
      <div className="cot-plazas" role="region" aria-label={`Medios de ${tipo.nombre}`} tabIndex={0}>
        {plazasDe(tipo).map((p) => (
          <section key={p.plaza} className="cot-plaza" aria-label={p.nombre}>
            <h4 className="cot-plaza__titulo">
              <span><Icon name="location" size={10} /> {p.nombre} · {textoMedios(p.medios)}</span>
              <span>{formatoMXN(p.subtotalConDescuento)}</span>
            </h4>
            <ListaMedios medios={mediosDeLineas(p.lineas, porId)} />
          </section>
        ))}
      </div>
    </>
  );
}

// Medios de una plaza: miniatura, identificador (claveDe, como la propuesta), nombre, tiempo de servicio
// y unidades, y el importe con descuento con el de lista tachado.
function ListaMedios({ medios }) {
  return (
    <ul className="cot-medios">
      {medios.map((m) => {
        const secundaria = esUnidad(m) ? NOMBRE_PLAZA[m.plaza] : m.nombre;
        const lista = montoDe(m);
        const conDescuento = montoConDescuentoDe(m);
        const unidades = m.unidades || 1;
        return (
          <li key={m.id} className="cot-medio">
            <span className="cot-medio__miniatura" aria-hidden="true"><IlustracionMedio medio={m} /></span>
            <div className="cot-medio__texto">
              <span className="cot-medio__clave">{claveDe(m)}</span>
              {secundaria && <span className="cot-medio__detalle">{secundaria}</span>}
              <span className="cot-medio__chips">
                <span><Icon name="clock" size={10} /> {tiempoServicio(m)}</span>
                {unidades > 1 && <span><Icon name="layers" size={10} /> {unidades} unidades</span>}
                <span><Icon name="calendar" size={10} /> {formatoFecha(m.inicio)} – {formatoFecha(m.fin)}</span>
              </span>
            </div>
            <span className="cot-medio__precios">
              <span className="cot-medio__precio">{formatoMXN(conDescuento)}</span>
              {lista > conDescuento && <s className="cot-medio__lista">{formatoMXN(lista)}</s>}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

// filas: [etiqueta, valor, tono] · tono: true (total destacado) | 'ahorro' (descuento en verde).
export function Montos({ filas }) {
  return (
    <dl className="cot-montos">
      {filas.map(([etiqueta, valor, tono]) => (
        <div key={etiqueta} className={cx('cot-monto', tono === true && 'cot-monto--total', tono === 'ahorro' && 'cot-monto--ahorro')}>
          <dt>{etiqueta}</dt>
          <dd>{valor}</dd>
        </div>
      ))}
    </dl>
  );
}

export function Bloqueada({ motivo, onIrPropuesta }) {
  return (
    <EstadoVacio
      tarjeta
      tamano="pagina"
      tono="bloqueado"
      icono="invoice"
      titulo="Tu cotización aún no está lista"
      descripcion={motivo}
      acciones={onIrPropuesta ? [{ label: 'Ir a la propuesta', icono: 'billboard', onClick: onIrPropuesta }] : []}
      nota="La cotización se genera en cuanto confirmas tu selección de medios."
    />
  );
}

// Modal SM de confirmación (referencia: maqueta/cotizacion-react ApprovalBar).
export function ModalAceptar({ open, onCancelar, onAceptar, datos }) {
  return (
    <Modal
      open={open}
      onClose={onCancelar}
      size="sm"
      title="Aceptar cotización"
      footer={(
        <div className="cot-modal-pie">
          <Button variant="secondary" size="md" onClick={onCancelar}>Cancelar</Button>
          <Button variant="primary" size="md" onClick={onAceptar}>Aceptar y arrancar campaña</Button>
        </div>
      )}
    >
      <div className="cot-modal-cuerpo">
        <p className="pg-parrafo">Al aceptar, la campaña arranca y ya no podrás cambiar la selección de medios.</p>
        <Montos filas={datos} />
      </div>
    </Modal>
  );
}

// Ícono de cada concepto incluido según su texto (los textos vienen de TEXTOS_COTIZACION).
function iconoIncluye(texto) {
  const t = texto.toLowerCase();
  if (t.includes('reporte')) return 'chart-line';
  if (t.includes('testigo')) return 'image';
  if (t.includes('ruta') || t.includes('supervis')) return 'route';
  if (t.includes('impresi') || t.includes('instalaci')) return 'paintbrush';
  return 'check';
}

// "50% anticipo y 50% contra instalación." → [{ pct: 50, texto: 'Anticipo' }, …]; [] si no se puede leer.
function partesDePago(texto) {
  const partes = [...String(texto).matchAll(/(\d+)\s*%\s*([^.]+?)(?=\s+y\s+\d|\.|$)/g)].map((m) => ({
    pct: Number(m[1]),
    texto: m[2].trim().replace(/^./, (c) => c.toUpperCase())
  }));
  return partes.reduce((t, p) => t + p.pct, 0) === 100 ? partes : [];
}

// Modal informativo: qué incluye la campaña (una fila con ícono por concepto), condiciones de pago
// (barra de porcentajes cuando se pueden leer) y aclaraciones. textos = cot.textos.
export function ModalIncluye({ open, onClose, textos }) {
  const pagos = partesDePago(textos.condicionesPago);
  const aclaraciones = String(textos.aclaraciones).split(/(?<=\.)\s+/).filter(Boolean);
  return (
    <Modal open={open} onClose={onClose} size="md" icon="success" title="Qué incluye tu campaña">
      <div className="ci">
        <p className="ci-intro">Todo esto ya está considerado en el precio de tu cotización.</p>

        <ul className="ci-lista">
          {textos.incluye.map((t) => (
            <li key={t} className="ci-item">
              <span className="ci-item__icono" aria-hidden="true"><Icon name={iconoIncluye(t)} size={16} /></span>
              <span className="ci-item__texto">{t}</span>
              <Icon name="check" size={16} className="ci-item__check" />
            </li>
          ))}
        </ul>

        <section className="ci-bloque" aria-labelledby="ci-pago-t">
          <h3 id="ci-pago-t" className="ci-bloque__titulo"><Icon name="invoice" size={16} /> Condiciones de pago</h3>
          {pagos.length ? (
            <>
              <div className="ci-pago" role="img" aria-label={textos.condicionesPago}>
                {pagos.map((p, i) => (
                  <span key={p.texto} className={`ci-pago__parte ci-pago__parte--${i}`} style={{ flexGrow: p.pct }}>
                    {p.pct}%
                  </span>
                ))}
              </div>
              <ol className="ci-pago__pasos">
                {pagos.map((p, i) => (
                  <li key={p.texto}>
                    <span className={`ci-pago__punto ci-pago__parte--${i}`} aria-hidden="true" />
                    <strong>{p.pct}%</strong> {p.texto}
                  </li>
                ))}
              </ol>
            </>
          ) : (
            <p className="ci-texto">{textos.condicionesPago}</p>
          )}
        </section>

        <section className="ci-aclaraciones" aria-label="Aclaraciones">
          <Icon name="info" size={16} />
          <ul>
            {aclaraciones.map((t) => <li key={t}>{t}</li>)}
          </ul>
        </section>
      </div>
    </Modal>
  );
}

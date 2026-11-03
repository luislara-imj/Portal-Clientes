import { useState } from 'react';
import { Button, Card, Icon, Modal } from '../../orbita';
import { formatoMXN } from '../../store/index.js';
import { NOMBRE_PLAZA } from '../../data/catalogos.js';
import { claveDe, esUnidad, montoConDescuentoDe } from '../propuesta/formatos.js';
import { mediosDeLineas, plazasDe, tiposOrdenados } from './capas.js';
import './cotizacion.css';

// Medios cotizados: fila de tarjetas por tipo (seleccionable) y, debajo, los medios del tipo elegido
// agrupados por plaza. El tipo elegido vive aquí; si la cotización cambia y ya no existe, se usa el primero.
export function MediosCotizados({ tipos, medios }) {
  const [elegido, setElegido] = useState(null);
  const visibles = tiposOrdenados(tipos);
  const tipo = visibles.find((t) => t.tipo === elegido) || visibles[0] || null;
  const porId = porIdDe(medios);

  if (!tipo) return null;
  return (
    <>
      <div className="cot-cabecera">
        <h2 id="cot-medios-t" className="pg-subtitulo">{tipo.nombre}</h2>
        <p className="pg-texto cot-cabecera__resumen">
          {textoMedios(tipo.medios)} · {formatoMXN(tipo.subtotalConDescuento)} con descuento
        </p>
      </div>
      <ul className="cot-rejilla" aria-label="Tipos de medio cotizados">
        {visibles.map((t) => (
          <li key={t.tipo}>
            <Card
              padding="md"
              className="cot-tarjeta"
              aria-pressed={t.tipo === tipo.tipo}
              onClick={() => setElegido(t.tipo)}
            >
              <span className="cot-tarjeta__nombre">{t.nombre}</span>
              <span className="cot-tarjeta__medios">{textoMedios(t.medios)}</span>
              <span className="cot-tarjeta__monto">{formatoMXN(t.subtotalConDescuento)}</span>
              <span className="cot-tarjeta__plazas">{plazasDe(t).map((p) => p.plaza || 'Sin plaza').join(' · ')}</span>
            </Card>
          </li>
        ))}
      </ul>
      <div className="cot-plazas" role="region" aria-labelledby="cot-medios-t" tabIndex={0}>
        {plazasDe(tipo).map((p) => (
          <section key={p.plaza} className="cot-plaza" aria-label={p.nombre}>
            <h3 className="cot-plaza__titulo">
              {p.nombre} · {textoMedios(p.medios)} · {formatoMXN(p.subtotalConDescuento)}
            </h3>
            <ListaMedios medios={mediosDeLineas(p.lineas, porId)} />
          </section>
        ))}
      </div>
    </>
  );
}

const textoMedios = (n) => (n === 1 ? '1 medio' : `${n} medios`);
const porIdDe = (medios) => new Map(medios.map((m) => [m.id, m]));

// Medios de una plaza: identificador (claveDe, como la propuesta), línea secundaria de la propuesta y precio con descuento.
function ListaMedios({ medios }) {
  return (
    <ul className="cot-medios">
      {medios.map((m) => {
        const secundaria = esUnidad(m) ? NOMBRE_PLAZA[m.plaza] : m.nombre;
        return (
          <li key={m.id} className="cot-medio">
            <div className="cot-medio__texto">
              <span className="cot-medio__clave">{claveDe(m)}</span>
              {secundaria && <span className="cot-medio__detalle">{secundaria}</span>}
            </div>
            <span className="cot-medio__precio">{formatoMXN(montoConDescuentoDe(m))}</span>
          </li>
        );
      })}
    </ul>
  );
}

export function Montos({ filas }) {
  return (
    <dl className="cot-montos">
      {filas.map(([etiqueta, valor, destacado]) => (
        <div key={etiqueta} className={destacado ? 'cot-monto cot-monto--total' : 'cot-monto'}>
          <dt>{etiqueta}</dt>
          <dd>{valor}</dd>
        </div>
      ))}
    </dl>
  );
}

export function Bloqueada({ motivo }) {
  return (
    <Card as="section" padding="lg" aria-labelledby="cot-bloq-t">
      <div className="cot-bloqueo">
        <span className="cot-bloqueo__icono" aria-hidden="true"><Icon name="lock" size={16} /></span>
        <div className="pg-pila">
          <h2 id="cot-bloq-t" className="pg-subtitulo">Cotización bloqueada</h2>
          <p className="pg-texto">{motivo}</p>
        </div>
      </div>
    </Card>
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

// Modal informativo: qué incluye la campaña y condiciones de la cotización.
export function ModalIncluye({ open, onClose, incluye }) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      size="sm"
      title="Qué incluye tu campaña"
    >
      <div className="cot-modal-cuerpo">
        <ul className="cot-lista">
          {incluye.map((t) => <li key={t}>{t}</li>)}
        </ul>
        <p className="pg-texto">Condiciones de pago: 50% anticipo y 50% contra instalación.</p>
        <p className="pg-texto">Precios sujetos a disponibilidad.</p>
      </div>
    </Modal>
  );
}

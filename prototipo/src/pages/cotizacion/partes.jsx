import { Button, Card, Icon, Modal, Table } from '../../orbita';
import { formatoFecha, formatoMXN } from '../../store/index.js';
import './cotizacion.css';

const DIA_MS = 24 * 60 * 60 * 1000;

function diasEntre(inicio, fin) {
  const [a1, m1, d1] = inicio.split('-').map(Number);
  const [a2, m2, d2] = fin.split('-').map(Number);
  return Math.round((Date.UTC(a2, m2 - 1, d2) - Date.UTC(a1, m1 - 1, d1)) / DIA_MS) + 1;
}

// Vallas: el periodo completo se cobra como una unidad de tiempo (días). Resto: meses.
export function tiempoDeServicio(linea) {
  if (linea.tipo === 'vallas' && linea.inicio && linea.fin) {
    const dias = diasEntre(linea.inicio, linea.fin);
    return dias === 1 ? '1 día' : `${dias} días`;
  }
  return linea.meses === 1 ? '1 mes' : `${linea.meses} meses`;
}

const COLUMNAS = [
  { key: 'ciudad', header: 'Ciudad', render: (l) => l.ciudad || '—' },
  { key: 'formato', header: 'Formato' },
  { key: 'detalle', header: 'Detalle', render: (l) => l.detalle || '—' },
  { key: 'clave', header: 'Clave IMJ', sticky: true },
  { key: 'unidades', header: 'Unidades', type: 'number' },
  { key: 'tiempo', header: 'Tiempo de servicio', render: tiempoDeServicio },
  { key: 'inicio', header: 'Inicio', render: (l) => formatoFecha(l.inicio) },
  { key: 'fin', header: 'Fin', render: (l) => formatoFecha(l.fin) },
  { key: 'precio', header: 'Precio unitario', type: 'number', render: (l) => formatoMXN(l.precio) },
  { key: 'precioDescuento', header: 'Precio con descuento', type: 'number', render: (l) => formatoMXN(l.precioDescuento) },
  { key: 'total', header: 'Total', type: 'number', render: (l) => formatoMXN(l.total) }
];

// Una tabla por tipo de medio con su subtotal (suma de la columna Total) al pie.
export function TablaTipo({ tipo }) {
  const tituloId = `cot-tipo-${tipo.tipo}`;
  return (
    <section className="pg-pila pg-pila--md" aria-labelledby={tituloId}>
      <h3 id={tituloId} className="pg-subtitulo">{tipo.nombre}</h3>
      <Table
        caption={`Cotización de ${tipo.nombre}`}
        columns={COLUMNAS}
        rows={tipo.lineas}
        rowKey="id"
        footer={(
          <p className="cot-pie-tabla pg-parrafo">
            <span>Subtotal {tipo.nombre}</span>
            <strong>{formatoMXN(tipo.subtotalConDescuento)}</strong>
          </p>
        )}
      />
    </section>
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

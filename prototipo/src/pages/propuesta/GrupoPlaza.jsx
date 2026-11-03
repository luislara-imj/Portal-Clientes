import { Accordion, Button, Table } from '../../orbita';
import { formatoMXN, redondear } from '../../store/index.js';
import { NOMBRE_TIPO } from '../../data/catalogos.js';
import { columnasDe } from './columnas.jsx';
import { SiNo } from './SiNo.jsx';
import { TarjetaMedio } from './TarjetaMedio.jsx';
import { montoConDescuentoDe } from './formatos.js';

const medioTxt = (n) => `${n} ${n === 1 ? 'medio' : 'medios'}`;

/**
 * Medios de un tipo en una plaza: Accordion "CDMX · N medios · subtotal" con "Todos Sí" / "Todos No"
 * (solo si la selección es editable) y la vista elegida (tarjetas o tabla).
 * todos: medios del grupo (sin filtrar) · visibles: los que pasan los filtros.
 * El subtotal es el de los medios incluidos (Sí), con descuento, como en la cotización.
 */
export function GrupoPlaza({ tipo, plaza, todos, visibles, respuestas, vista, editable, onResponder, onResponderTodos }) {
  const respondidos = todos.filter((m) => respuestas[m.id] === 'si' || respuestas[m.id] === 'no').length;
  const subtotal = redondear(todos.filter((m) => respuestas[m.id] === 'si').reduce((s, m) => s + montoConDescuentoDe(m), 0));
  let descripcion = `${respondidos} de ${todos.length} respondidos · subtotal con descuento de los medios incluidos`;
  if (visibles.length !== todos.length) descripcion += ` · ${visibles.length} con los filtros`;
  const readOnly = !editable;
  const siNo = (m) => <SiNo medio={m} valor={respuestas[m.id]} onResponder={onResponder} readOnly={readOnly} />;

  return (
    <Accordion
      defaultOpen
      className="pp-grupo"
      title={`${plaza} · ${medioTxt(todos.length)} · ${formatoMXN(subtotal)}`}
      description={descripcion}
      actions={
        editable && (
          <div className="pp-grupo__acciones" role="group" aria-label={`Responder todos los medios de ${plaza}`}>
            <Button variant="secondary" size="xs" aria-label={`Todos Sí en ${plaza}`} onClick={() => onResponderTodos(plaza, 'si')}>
              Todos Sí
            </Button>
            <Button variant="secondary" size="xs" aria-label={`Todos No en ${plaza}`} onClick={() => onResponderTodos(plaza, 'no')}>
              Todos No
            </Button>
          </div>
        )
      }
    >
      {vista === 'tabla' ? (
        <Table
          className="pp-tabla"
          caption={`${NOMBRE_TIPO[tipo]} en ${plaza}`}
          columns={columnasDe(tipo, siNo)}
          rows={visibles}
          rowKey="id"
          selectedKeys={visibles.filter((m) => respuestas[m.id] === 'si').map((m) => m.id)}
        />
      ) : (
        <ul className="pp-rejilla">
          {visibles.map((m) => (
            <li key={m.id} className="pp-rejilla__item">
              <TarjetaMedio medio={m} valor={respuestas[m.id]} onResponder={onResponder} readOnly={readOnly} />
            </li>
          ))}
        </ul>
      )}
    </Accordion>
  );
}

export default GrupoPlaza;

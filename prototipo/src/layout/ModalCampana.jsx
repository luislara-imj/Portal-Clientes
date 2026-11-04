import { Badge, Icon, Modal } from '../orbita';
import { badgeDeFase } from './campanas.js';
import { vigenciaCorta } from './carpetas.js';
import { SeccionesCampana } from './SeccionesCampana.jsx';
import './modal-campana.css';

/**
 * Modal al centro con las 5 secciones de una campaña como botones cuadrados con ícono (SeccionesCampana):
 * la sección donde va la campaña se rellena de azul; las bloqueadas se ven en gris con candado y, al pasar
 * o tocarlas, la línea de abajo dice qué falta.
 * c: { codigo?, nombre, fase, inicio, fin } (campanasDeMarca) · onClose · onAbrirArtes(codigo)
 */
export function ModalCampana({ c, onClose, onAbrirArtes }) {
  if (!c) return null;
  const badge = badgeDeFase(c.fase);

  return (
    <Modal open onClose={onClose} size="md" title={c.nombre} className="cm">
      <div className="cm-cuerpo">
        <div className="cm-contexto">
          <Badge color={badge.color} theme="soft" icon={badge.icon}>{c.fase}</Badge>
          <span className="cm-vigencia"><Icon name="calendar" size={10} /> {vigenciaCorta(c.inicio, c.fin)}</span>
        </div>
        <SeccionesCampana c={c} onAbrirArtes={onAbrirArtes} />
      </div>
    </Modal>
  );
}

export default ModalCampana;

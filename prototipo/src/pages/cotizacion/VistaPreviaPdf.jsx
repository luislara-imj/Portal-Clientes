import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Button, IconButton, useFocusTrap } from '../../orbita';
import { DocumentoCotizacion } from './DocumentoCotizacion.jsx';

/**
 * Vista previa a pantalla completa de la cotización formal. "Descargar PDF" abre el diálogo de
 * impresión del navegador (Guardar como PDF); al imprimir solo sale la hoja (documento.css, @media print).
 * El título del documento se cambia mientras se imprime para que el PDF se llame como el folio.
 * open · onClose · props del documento (cot, campana, cliente, responsable, ejecutivo, aceptadaEn)
 */
export function VistaPreviaPdf({ open, onClose, ...doc }) {
  const capaRef = useRef(null);
  useFocusTrap(capaRef, open, { onEscape: onClose });

  useEffect(() => {
    if (!open) return undefined;
    const tituloOriginal = document.title;
    const restaurar = () => { document.title = tituloOriginal; };
    window.addEventListener('afterprint', restaurar);
    return () => {
      window.removeEventListener('afterprint', restaurar);
      restaurar();
    };
  }, [open]);

  if (!open) return null;

  const descargar = () => {
    document.title = `Cotizacion ${doc.campana.codigo}`;
    window.print();
  };

  return createPortal(
    <div ref={capaRef} className="pdf-capa" role="dialog" aria-modal="true" aria-label="Vista previa de la cotización">
      <div className="pdf-barra">
        <div className="pdf-barra__texto">
          <strong>Vista previa de la cotización</strong>
          <span>Al descargar, elige «Guardar como PDF» en el diálogo de impresión.</span>
        </div>
        <Button variant="primary" size="md" iconLeft="download" onClick={descargar}>
          Descargar PDF
        </Button>
        <IconButton icon="x" label="Cerrar vista previa" variant="secondary" size="md" pill="pill" tooltip={false} onClick={onClose} />
      </div>
      <div className="pdf-lienzo">
        <DocumentoCotizacion {...doc} />
      </div>
    </div>,
    document.body
  );
}

export default VistaPreviaPdf;

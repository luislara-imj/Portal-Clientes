import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { IconButton } from './IconButton.jsx';
import { Picture } from './Picture.jsx';
import { useFocusTrap } from './useFocusTrap.js';
import { cx } from './cx.js';
import './Lightbox.css';

/**
 * Lightbox de Órbita (§14.2).
 * open · onClose · images: [{ src, alt, caption? }] · index · onIndexChange(i)
 * size: sm | md | lg · dots (navegación por puntos) · controls (flechas)
 * Teclado: ← / → navegan, Escape cierra; foco atrapado y devuelto al cerrar.
 * En pantallas angostas las flechas pasan sobre la imagen (variante Compact).
 */
export function Lightbox({ open, onClose, images = [], index = 0, onIndexChange, size = 'md', dots = true, controls = true, label = 'Galería de imágenes' }) {
  const ref = useRef(null);
  const closeRef = useRef(null);
  useFocusTrap(ref, open, { onEscape: onClose, initialFocusRef: closeRef });

  const count = images.length;
  const go = (i) => onIndexChange?.((i + count) % count);

  useEffect(() => {
    if (!open || count < 2) return undefined;
    const onKey = (e) => {
      if (e.key === 'ArrowLeft') go(index - 1);
      if (e.key === 'ArrowRight') go(index + 1);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, index, count]);

  if (!open || count === 0) return null;
  const current = images[Math.min(index, count - 1)];

  return createPortal(
    <div className="ui-lightbox-layer">
      <div className="ui-lightbox-backdrop" aria-hidden="true" onClick={onClose} />
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        aria-roledescription="carrusel"
        tabIndex={-1}
        className={cx('ui-lightbox', `ui-lightbox--${size}`)}
      >
        <div className="ui-lightbox__row">
          {controls && count > 1 && (
            <IconButton
              icon="chevron-left"
              label="Imagen anterior"
              variant="secondary"
              size="lg"
              className="ui-lightbox__arrow ui-lightbox__arrow--prev"
              onClick={() => go(index - 1)}
            />
          )}
          <figure className="ui-lightbox__figure">
            <Picture src={current.src} alt={current.alt} ratio="16:9" radius="none" />
            <IconButton
              ref={closeRef}
              icon="x"
              label="Cerrar"
              variant="secondary"
              size="xs"
              className="ui-lightbox__close"
              onClick={onClose}
            />
            <figcaption className="ui-lightbox__caption" aria-live="polite">
              <span className="ui-sr-only">
                Imagen {index + 1} de {count}.{' '}
              </span>
              {current.caption}
            </figcaption>
          </figure>
          {controls && count > 1 && (
            <IconButton
              icon="chevron-right"
              label="Imagen siguiente"
              variant="secondary"
              size="lg"
              className="ui-lightbox__arrow ui-lightbox__arrow--next"
              onClick={() => go(index + 1)}
            />
          )}
        </div>
        {dots && count > 1 && (
          <div className="ui-lightbox__dots">
            {images.map((img, i) => (
              <button
                key={img.src ?? i}
                type="button"
                className={cx('ui-lightbox__dot', 'ui-touch-y', i === index && 'is-active')}
                aria-label={`Imagen ${i + 1} de ${count}`}
                aria-current={i === index ? 'true' : undefined}
                onClick={() => go(i)}
              />
            ))}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}

export default Lightbox;

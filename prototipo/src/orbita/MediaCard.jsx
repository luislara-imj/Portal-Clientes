import { Badge } from './Badge.jsx';
import { Icon } from './Icon.jsx';
import { Picture } from './Picture.jsx';
import { Tag } from './Tag.jsx';
import { Tooltip } from './Tooltip.jsx';
import { cx } from './cx.js';
import './MediaCard.css';

/**
 * Tarjeta de medio (§3.1, "Card Catalogo / Inventario"). 250 × 311 en Figma.
 * image ({ src, alt }) · mediaType ("ESPECTACULAR") · mediaKey (clave) · plaza (texto del link)
 * plazaHref / onPlazaClick · formats: [{ label, color?, icon? }] (fila format_type)
 * status: { label, color: 'success' | 'gray' | …, icon? } (_Estatus medio, p. ej. Disponible / Inactivo)
 * exclusive: ícono de exclusividad · actions: nodos de la fila CTA (32 de alto)
 * disabled · fluid (ancho 100% en lugar de 250) · state="hover" | "focus": solo galería
 */
export function MediaCard({
  image,
  mediaType,
  mediaKey,
  plaza,
  plazaHref,
  onPlazaClick,
  formats = [],
  status,
  exclusive = false,
  actions,
  disabled = false,
  fluid = false,
  state,
  className,
}) {
  return (
    <article
      className={cx('ui-media-card', fluid && 'ui-media-card--fluid', disabled && 'is-disabled', className)}
      data-state={state}
      aria-disabled={disabled || undefined}
    >
      <div className="ui-media-card__image">
        <Picture src={image?.src} alt={image?.alt ?? ''} ratio="16:9" radius="none" fill />
        {exclusive && (
          <span className="ui-media-card__exclusive">
            <Tooltip label="Exclusivo" placement="bottom">
              <span className="ui-media-card__exclusive-icon" role="img" aria-label="Exclusivo" tabIndex={0}>
                <Icon name="exclusive" size={10} />
              </span>
            </Tooltip>
          </span>
        )}
        {status && (
          <span className="ui-media-card__status">
            <Badge color={status.color ?? 'success'} theme="soft" size="sm" icon={status.icon}>
              {status.label}
            </Badge>
          </span>
        )}
      </div>
      <div className="ui-media-card__details">
        {mediaType && <span className="ui-media-card__type">{mediaType}</span>}
        <h3 className="ui-media-card__key">{mediaKey}</h3>
        {plaza && (
          <span className="ui-media-card__plaza">
            <Icon name="location" size={10} />
            {plazaHref || onPlazaClick ? (
              <a
                className="ui-media-card__plaza-link"
                href={plazaHref ?? '#'}
                onClick={(e) => {
                  if (!plazaHref) e.preventDefault();
                  onPlazaClick?.(e);
                }}
              >
                {plaza}
              </a>
            ) : (
              <span>{plaza}</span>
            )}
          </span>
        )}
        {formats.length > 0 && (
          <div className="ui-media-card__formats">
            {formats.map((f) => (
              <Tag key={f.label} color={f.color ?? 'gray'} icon={f.icon} disabled={disabled}>
                {f.label}
              </Tag>
            ))}
          </div>
        )}
      </div>
      {actions && <div className="ui-media-card__cta">{actions}</div>}
    </article>
  );
}

export default MediaCard;

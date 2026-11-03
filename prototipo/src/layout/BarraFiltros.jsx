import { IconButton, Input, Tag } from '../orbita';
import './layout.css';

/**
 * Barra de herramientas (Table Tool Bar de Órbita): búsqueda angosta, botón de filtros pegado a ella
 * con contador de filtros aplicados y, a la derecha, el total de resultados.
 * busqueda · onBuscar(texto) · activos: filtros aplicados · onAbrirFiltros · total: texto de la derecha
 * placeholder · etiqueta: nombre accesible del campo de búsqueda
 */
export function BarraBusqueda({ busqueda, onBuscar, activos, onAbrirFiltros, total, placeholder = 'Buscar...', etiqueta = 'Buscar' }) {
  return (
    <div className="mc-barra" role="search">
      <Input
        className="mc-barra-busqueda"
        size="sm"
        iconLeft="search"
        placeholder={placeholder}
        aria-label={etiqueta}
        value={busqueda}
        onChange={(e) => onBuscar(e.target.value)}
      />
      <span className="mc-barra-filtros">
        <IconButton
          icon="filter"
          label={activos ? `Filtros (${activos} ${activos === 1 ? 'activo' : 'activos'})` : 'Filtros'}
          variant="secondary"
          size="sm"
          selected={activos > 0 ? true : undefined}
          tooltip={false}
          onClick={onAbrirFiltros}
        />
        {activos > 0 && (
          <span className="mc-barra-contador" aria-hidden="true">
            {activos}
          </span>
        )}
      </span>
      {total && (
        <p className="mc-barra-total" aria-live="polite">
          {total}
        </p>
      )}
    </div>
  );
}

/**
 * Filtros activos (variante "Filter Applied = on" del Table Tool Bar): una etiqueta por filtro con su ✕
 * y "Limpiar todos". etiquetas: [{ clave, texto, color?, icono?, quitar }]. Sin etiquetas no pinta nada.
 */
export function FiltrosActivos({ etiquetas, onLimpiar }) {
  if (!etiquetas.length) return null;
  return (
    <div className="mc-activos">
      <span className="mc-activos-titulo">Filtros activos:</span>
      <button type="button" className="mc-activos-limpiar" onClick={onLimpiar}>
        Limpiar todos
      </button>
      <ul className="mc-activos-lista">
        {etiquetas.map((e) => (
          <li key={e.clave}>
            <Tag color={e.color ?? 'accent'} icon={e.icono} border onRemove={e.quitar} removeLabel={`Quitar ${e.texto}`}>
              {e.texto}
            </Tag>
          </li>
        ))}
      </ul>
    </div>
  );
}

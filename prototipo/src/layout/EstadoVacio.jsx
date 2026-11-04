import { Button, Card, Icon, cx } from '../orbita';
import './estado-vacio.css';

// Marca de la esquina de la ilustración según el tono.
const MARCA = { bloqueado: 'lock', busqueda: 'search', error: 'refresh', espera: 'clock' };

/**
 * Estado vacío o de error del portal: ilustración (ícono en círculos concéntricos con una marca en la
 * esquina según el tono), título, descripción y acciones. Mismo aspecto en todas las pantallas.
 * icono: ícono principal · tono: vacio | bloqueado | busqueda | espera | error
 * titulo · descripcion (nodo) · nota: texto chico bajo las acciones (p. ej. a quién contactar)
 * acciones: [{ label, onClick, variant?, icono? }] (la primera es la principal)
 * tamano: pagina (llena el área de la pantalla) | seccion | compacto (dentro de listas, drawers y modales)
 * tarjeta: envuelve en Card (pantallas); sin tarjeta para usarlo dentro de otro contenedor.
 * codigo: texto grande opcional sobre el título (p. ej. 404).
 */
export function EstadoVacio({
  icono = 'inbox',
  tono = 'vacio',
  titulo,
  descripcion,
  nota,
  acciones = [],
  tamano = 'seccion',
  tarjeta = false,
  codigo,
  className
}) {
  const marca = MARCA[tono];
  const grande = tamano !== 'compacto';
  const contenido = (
    <div className={cx('ev', `ev--${tono}`, `ev--${tamano}`, !tarjeta && className)} role={tono === 'error' ? 'alert' : undefined}>
      <span className="ev-ilustracion" aria-hidden="true">
        <span className="ev-circulo">
          <Icon name={icono} size={grande ? 32 : 24} />
        </span>
        {marca && (
          <span className="ev-marca">
            <Icon name={marca} size={grande ? 16 : 10} />
          </span>
        )}
      </span>
      <div className="ev-textos">
        {codigo && <span className="ev-codigo">{codigo}</span>}
        <h2 className="ev-titulo">{titulo}</h2>
        {descripcion && <p className="ev-descripcion">{descripcion}</p>}
      </div>
      {acciones.length > 0 && (
        <div className="ev-acciones">
          {acciones.map((a, i) => (
            <Button
              key={a.label}
              variant={a.variant ?? (i === 0 ? 'primary' : 'secondary')}
              size={grande ? 'md' : 'sm'}
              iconLeft={a.icono}
              onClick={a.onClick}
            >
              {a.label}
            </Button>
          ))}
        </div>
      )}
      {nota && <p className="ev-nota">{nota}</p>}
    </div>
  );
  if (!tarjeta) return contenido;
  return (
    <Card as="section" padding="lg" className={cx('ev-tarjeta', className)}>
      {contenido}
    </Card>
  );
}

export default EstadoVacio;

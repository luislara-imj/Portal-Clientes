import { Button, Drawer, Icon, IconButton, Tag } from '../../orbita';
import { DESCUENTO_PCT, NOMBRE_PLAZA, NOMBRE_TIPO } from '../../data/catalogos.js';
import { formatoMXN } from '../../store/index.js';
import { IlustracionMedio } from './IlustracionMedio.jsx';
import { Metricas, PerfilAudiencia, Seccion, tieneMetricas } from './DatosMedio.jsx';
import { claveDe, coordenada, montoConDescuentoDe, montoDe, periodo, precio, sinValor, texto } from './formatos.js';

const plural = (n, uno, varios) => `${n} ${n === 1 ? uno : varios}`;

// Ficha técnica por tipo de medio: [ícono, etiqueta, valor]. Los vacíos se omiten.
function ficha(m) {
  const comunes = {
    formato: ['billboard', 'Formato', m.formato],
    medida: ['ruler', 'Medida', m.medida],
    periodo: ['calendar', 'Periodo', periodo(m)],
    clave: ['tag', 'Clave IMJ', m.clave]
  };
  const filas = {
    sitios: [
      comunes.formato,
      ['layers', 'Estructura', m.subtipo],
      comunes.medida,
      ['eye', 'Vista', m.vista],
      ['lightbulb', 'Iluminación', m.iluminacion],
      comunes.periodo,
      comunes.clave
    ],
    camiones: [
      ['route', 'Ruta', m.clave],
      ['location', 'Recorrido', m.direccion],
      comunes.formato,
      ['bus', 'Tipo de exhibición', m.tipoExhibicion],
      ['layers', 'Categoría', m.categoria],
      ['image', 'Tipo de anuncio', m.tipoAnuncio],
      ['bus', 'Camiones', m.unidades],
      comunes.periodo
    ],
    indoor: [
      comunes.formato,
      ['building', 'Inmueble', m.inmueble],
      ['layers', 'Nivel', m.nivel],
      ['location', 'Área', m.area],
      ['ruler', 'A nivel de piso', m.aNivelPiso],
      comunes.medida,
      ['info', 'Descripción', m.descripcion],
      comunes.periodo,
      comunes.clave
    ],
    vallas: [comunes.formato, comunes.medida, ['info', 'Descripción', m.descripcion], comunes.periodo],
    riders: [comunes.formato, ['layers', 'Familia', m.familia], ['info', 'Descripción', m.descripcion], comunes.periodo]
  };
  return (filas[m.tipo] || []).filter(([, , v]) => !sinValor(v));
}

// Precio: con descuento grande, precio de lista tachado, ahorro y total del periodo cuando hay meses o unidades.
function Precio({ m }) {
  const unidades = m.unidades || 1;
  const meses = m.meses || 1;
  const porPeriodo = m.tipo === 'vallas';
  const multiplica = unidades * meses > 1;
  const sinPrecio = !Number(m.precioDescuento);
  return (
    <div className="dm-precio">
      <div className="dm-precio__principal">
        <span className="dm-etiqueta">Precio con descuento</span>
        <span className="dm-precio__monto">
          {precio(m.precioDescuento)}
          {!sinPrecio && <small>{porPeriodo ? ' por el periodo' : ' al mes'}</small>}
        </span>
        {!sinPrecio && Number(m.precio) > Number(m.precioDescuento) && (
          <span className="dm-precio__antes">
            <s>{precio(m.precio)}</s>
            <Tag color="success">Ahorras {DESCUENTO_PCT}%</Tag>
          </span>
        )}
      </div>
      {multiplica && !sinPrecio && (
        <div className="dm-precio__total">
          <span className="dm-etiqueta">
            Total del periodo · {[unidades > 1 && plural(unidades, 'unidad', 'unidades'), meses > 1 && plural(meses, 'mes', 'meses')].filter(Boolean).join(' × ')}
          </span>
          <span className="dm-precio__total-monto">{formatoMXN(montoConDescuentoDe(m))}</span>
          <s className="dm-etiqueta">{formatoMXN(montoDe(m))}</s>
        </div>
      )}
      {Number(m.precioProduccion) > 0 && (
        <p className="dm-precio__nota">Producción: {precio(m.precioProduccion)} (pago único)</p>
      )}
      <p className="dm-precio__nota">Precios en pesos mexicanos (MXN), antes de IVA.</p>
    </div>
  );
}

function Ubicacion({ m }) {
  const conPunto = m.lat != null && m.lng != null && m.tipo !== 'camiones';
  const d = 0.006;
  const mapa = conPunto
    ? `https://www.openstreetmap.org/export/embed.html?bbox=${m.lng - d},${m.lat - d},${m.lng + d},${m.lat + d}&layer=mapnik&marker=${m.lat},${m.lng}`
    : null;
  const google = conPunto ? `https://www.google.com/maps?q=${m.lat},${m.lng}` : null;
  return (
    <div className="dm-ubicacion">
      <p className="dm-ubicacion__direccion">
        <Icon name="location" size={16} />
        <span>{m.tipo === 'camiones' ? `Recorrido: ${texto(m.direccion)}` : texto(m.direccion)}</span>
      </p>
      {mapa && (
        <iframe
          className="dm-ubicacion__mapa"
          title={`Mapa de ${claveDe(m)}`}
          src={mapa}
          loading="lazy"
          referrerPolicy="no-referrer"
        />
      )}
      {google && (
        <div className="dm-ubicacion__pie">
          <span className="dm-etiqueta">{coordenada(m.lat)}, {coordenada(m.lng)}</span>
          <a className="dm-enlace" href={google} target="_blank" rel="noopener noreferrer">
            Abrir en Google Maps <Icon name="external-link" size={10} />
            <span className="ui-sr-only"> (se abre en otra pestaña)</span>
          </a>
        </div>
      )}
    </div>
  );
}

function Nota({ etiqueta, valor }) {
  const vacio = sinValor(valor);
  return (
    <div className="dm-nota">
      <span className="dm-etiqueta">{etiqueta}</span>
      <p className={vacio ? 'dm-sin-dato' : 'dm-nota__texto'}>{vacio ? 'Sin información' : valor}</p>
    </div>
  );
}

/**
 * Drawer "Detalle del medio": todo lo que trae la pauta con detalle de un medio, organizado para el
 * cliente (qué es y cuánto cuesta, cuántas personas lo ven, ficha técnica, ubicación, perfil y notas).
 * Pie fijo con la acción de incluir / quitar; anterior y siguiente recorren los medios visibles.
 * medio · valor ('si' | otro) · readOnly · onResponder(id, valor) · onClose
 * posicion (1…total) · total · onAnterior · onSiguiente
 */
export function DetalleMedio({ medio: m, valor, readOnly, onResponder, onClose, posicion, total, onAnterior, onSiguiente }) {
  if (!m) return null;
  const esSi = valor === 'si';
  const clave = claveDe(m);
  const filas = ficha(m);
  const conUbicacion = !sinValor(m.direccion) || m.lat != null;
  const conNotas = ['sitios', 'indoor', 'camiones'].includes(m.tipo);

  const acciones = total > 1 && (
    <>
      <span className="dm-posicion" aria-live="polite">{posicion} de {total}</span>
      <IconButton icon="chevron-left" label="Medio anterior" variant="secondary" size="xs" pill="pill" onClick={onAnterior} disabled={posicion <= 1} />
      <IconButton icon="chevron-right" label="Medio siguiente" variant="secondary" size="xs" pill="pill" onClick={onSiguiente} disabled={posicion >= total} />
    </>
  );

  let pie;
  if (readOnly) {
    pie = (
      <p className="dm-pie__estado">
        <Icon name={esSi ? 'success' : 'info'} size={16} />
        {esSi ? 'Este medio está incluido en tu campaña.' : 'Este medio no está incluido en tu campaña.'}
      </p>
    );
  } else {
    pie = (
      <div className="dm-pie">
        <div className="dm-pie__resumen">
          {esSi ? (
            <span className="dm-pie__incluido"><Icon name="success" size={16} /> Incluido en tu campaña</span>
          ) : (
            <span className="dm-etiqueta">¿Lo incluyes en tu campaña?</span>
          )}
          <strong className="dm-pie__monto">{precio(m.precioDescuento)}</strong>
        </div>
        {esSi ? (
          <Button variant="secondary" size="md" iconLeft="minus" onClick={() => onResponder(m.id, 'no')}>
            Quitar
          </Button>
        ) : (
          <Button variant="primary" size="md" iconLeft="plus" onClick={() => onResponder(m.id, 'si')}>
            Incluir en mi campaña
          </Button>
        )}
      </div>
    );
  }

  return (
    <Drawer
      open
      onClose={onClose}
      size="lg"
      icon={m.tipo === 'camiones' ? 'bus' : m.tipo === 'indoor' ? 'building' : 'billboard'}
      title={clave}
      subtitle={`${NOMBRE_TIPO[m.tipo]} · ${NOMBRE_PLAZA[m.plaza] ?? m.plaza}`}
      acciones={acciones}
      closeLabel="Cerrar detalle"
      footer={pie}
      contentKey={m.id}
      className="dm"
    >
      <div className="dm-contenido">
        <div className="dm-hero">
          <div className="dm-hero__imagen">
            <IlustracionMedio medio={m} />
            {esSi && (
              <span className="dm-hero__estado"><Icon name="check" size={10} /> Incluido</span>
            )}
          </div>
          <div className="dm-hero__texto">
            <p className="dm-hero__nombre">{m.nombre}</p>
            <div className="dm-hero__tags">
              <Tag color="gray" icon="location">{NOMBRE_PLAZA[m.plaza] ?? m.plaza}</Tag>
              {m.formato && <Tag color="gray" icon="billboard">{m.formato}</Tag>}
              <Tag color="gray" icon="calendar">{periodo(m)}</Tag>
            </div>
          </div>
          <Precio m={m} />
        </div>

        {tieneMetricas(m.tipo) && (
          <Seccion icono="users" titulo="¿Cuántas personas lo ven?" descripcion="Impactos y audiencia estimados de este medio.">
            <Metricas tipo={m.tipo} datos={m} />
          </Seccion>
        )}

        {filas.length > 0 && (
          <Seccion icono="info" titulo="Ficha técnica">
            <dl className="dm-ficha">
              {filas.map(([icono, etiqueta, v]) => (
                <div key={etiqueta} className="dm-ficha__fila">
                  <dt><Icon name={icono} size={16} /> {etiqueta}</dt>
                  <dd>{String(v)}</dd>
                </div>
              ))}
            </dl>
          </Seccion>
        )}

        {conUbicacion && (
          <Seccion icono="map" titulo="Ubicación">
            <Ubicacion m={m} />
          </Seccion>
        )}

        {tieneMetricas(m.tipo) && (
          <Seccion icono="gender" titulo="Perfil de audiencia" descripcion="Quiénes ven este medio.">
            <PerfilAudiencia tipo={m.tipo} datos={m} />
          </Seccion>
        )}

        {conNotas && (
          <Seccion icono="comment" titulo="Comentarios y referencias">
            <div className="dm-notas">
              <Nota etiqueta="Comentarios" valor={m.comentarios} />
              {m.tipo === 'sitios' && <Nota etiqueta="Referencias comerciales" valor={m.referencias} />}
            </div>
          </Seccion>
        )}
      </div>
    </Drawer>
  );
}

export default DetalleMedio;

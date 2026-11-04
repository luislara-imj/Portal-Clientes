// Piezas visuales de los datos de un medio (o de la sumatoria de varios): métricas de audiencia como
// tarjetas con ícono y ayuda, género en una barra dividida y NSE / edades como barras horizontales.
// Las usan el drawer de detalle y el resumen completo de la selección.

import { Icon, cx } from '../../orbita';
import { entero, promedio } from './formatos.js';
import './detalle.css';

// Conteo legible: 1,250,000 → "1.3 M"; 850,000 → "850 mil". 0 → "Sin dato".
export function compacto(v) {
  const n = Number(v);
  if (!Number.isFinite(n)) return '—';
  if (n === 0) return 'Sin dato';
  if (n >= 1e6) return `${(n / 1e6).toFixed(n >= 1e7 ? 0 : 1)} M`;
  if (n >= 1e4) return `${Math.round(n / 1e3)} mil`;
  return entero(n);
}

// Ícono de cada tipo de medio (pestañas del resumen y del drawer).
export const ICONO_TIPO = { sitios: 'billboard', camiones: 'bus', indoor: 'building', vallas: 'route', riders: 'megaphone' };

const pct = (v) => `${Math.round(Number(v) * 100)}%`;

// Métricas por tipo de medio con los nombres del Excel; `ayuda` explica cada una en lenguaje del cliente.
const METRICAS = {
  sitios: [
    { campo: 'impactos', etiqueta: 'Impactos', icono: 'users', ayuda: 'Veces que se ve el anuncio al mes' },
    { campo: 'impactosTotales', etiqueta: 'Impactos totales', icono: 'chart', ayuda: 'Vistas en todo el periodo' },
    { campo: 'alcance', etiqueta: 'Alcance', icono: 'target', ayuda: 'Personas distintas que lo ven' },
    { campo: 'frecuencia', etiqueta: 'Frecuencia', icono: 'repeat', ayuda: 'Veces que cada persona lo ve', promedio: true },
    { campo: 'tiempoExposicion', etiqueta: 'Tiempo de exposición', icono: 'clock', ayuda: 'Segundos al mes frente al anuncio', promedio: true }
  ],
  camiones: [
    { campo: 'impactos', etiqueta: 'Impactos únicos', icono: 'users', ayuda: 'Personas que ven el camión al mes' },
    { campo: 'impactosTotales', etiqueta: 'Impactos totales', icono: 'chart', ayuda: 'Vistas en todo el periodo' },
    { campo: 'alcance', etiqueta: 'Alcance mensual', icono: 'target', ayuda: 'Personas distintas al mes' },
    { campo: 'frecuencia', etiqueta: 'Frecuencia mensual', icono: 'repeat', ayuda: 'Veces que cada persona lo ve', promedio: true },
    { campo: 'tiempoExposicion', etiqueta: 'Tiempo de exposición', icono: 'clock', ayuda: 'Segundos frente al anuncio', promedio: true },
    { campo: 'km', etiqueta: 'Km promedio', icono: 'route', ayuda: 'Recorrido diario de la ruta', promedio: true }
  ],
  indoor: [
    { campo: 'impactos', etiqueta: 'Impactos', icono: 'users', ayuda: 'Veces que se ve el anuncio al mes' },
    { campo: 'impactosTotales', etiqueta: 'Impactos totales', icono: 'chart', ayuda: 'Vistas en todo el periodo' },
    { campo: 'alcance', etiqueta: 'Alcance', icono: 'target', ayuda: 'Personas distintas que lo ven' },
    { campo: 'frecuencia', etiqueta: 'Frecuencia', icono: 'repeat', ayuda: 'Veces que cada persona lo ve', promedio: true }
  ]
};

export const tieneMetricas = (tipo) => !!METRICAS[tipo];

// Etiquetas de NSE y edades: exterior (sitios) e indoor tienen escalas distintas (Excel).
const NSE = {
  sitios: [['ab', 'AB'], ['cmas', 'C+'], ['c', 'C'], ['dmas', 'D+'], ['d', 'D'], ['e', 'E']],
  indoor: [['abcmas', 'ABC+'], ['c', 'C'], ['cmenos', 'C-'], ['dmas', 'D+'], ['de', 'DE']]
};
const EDADES = {
  sitios: [['e0_14', '0 a 14'], ['e15_19', '15 a 19'], ['e20_24', '20 a 24'], ['e25_34', '25 a 34'], ['e35_44', '35 a 44'], ['e45_64', '45 a 64'], ['e65', '65 o más']],
  indoor: [['e13_17', '13 a 17'], ['e18_25', '18 a 25'], ['e26_40', '26 a 40'], ['e41_55', '41 a 55'], ['e55', '55 o más']]
};

/** Tarjeta de una métrica: ícono, nombre, valor grande y una línea de ayuda. */
export function Metrica({ icono, etiqueta, valor, completo, ayuda }) {
  const sinDato = valor === 'Sin dato';
  return (
    <div className={cx('dm-metrica', sinDato && 'dm-metrica--sin-dato')}>
      <span className="dm-metrica__icono" aria-hidden="true"><Icon name={icono} size={16} /></span>
      <span className="dm-metrica__etiqueta">{etiqueta}</span>
      <span className="dm-metrica__valor" title={completo}>{valor}</span>
      {ayuda && <span className="dm-metrica__ayuda">{ayuda}</span>}
    </div>
  );
}

/**
 * Rejilla de métricas de un tipo de medio. datos: el medio o su sumatoria.
 * agregado: muestra "promedio" en las métricas que se promedian (resumen de varios medios).
 */
export function Metricas({ tipo, datos, agregado = false }) {
  const lista = METRICAS[tipo];
  if (!lista) return null;
  return (
    <div className="dm-metricas">
      {lista.map((d) => {
        const v = datos[d.campo];
        const valor = d.promedio ? promedio(v) : compacto(v);
        const etiqueta = agregado && (d.promedio || d.campo === 'alcance') ? `${d.etiqueta} promedio` : d.etiqueta;
        return (
          <Metrica
            key={d.campo}
            icono={d.icono}
            etiqueta={etiqueta}
            valor={valor}
            completo={d.promedio ? undefined : entero(v)}
            ayuda={d.ayuda}
          />
        );
      })}
    </div>
  );
}

/** Hombres y mujeres en una barra dividida. personas: indoor (cantidades en lugar de fracciones). */
export function Genero({ hombres, mujeres, personas = false }) {
  const h = Number(hombres) || 0;
  const m = Number(mujeres) || 0;
  if (h + m === 0) return <p className="dm-sin-dato">Sin dato</p>;
  const fh = personas ? h / (h + m) : h;
  const fm = personas ? m / (h + m) : m;
  return (
    <div className="dm-genero">
      <div className="dm-genero__barra" role="img" aria-label={`Hombres ${pct(fh)}, mujeres ${pct(fm)}`}>
        <span className="dm-genero__h" style={{ flexGrow: fh }} />
        <span className="dm-genero__m" style={{ flexGrow: fm }} />
      </div>
      <div className="dm-genero__leyenda">
        <span className="dm-leyenda dm-leyenda--h">
          <strong>{pct(fh)}</strong> Hombres{personas && <small> · {entero(h)} personas</small>}
        </span>
        <span className="dm-leyenda dm-leyenda--m">
          <strong>{pct(fm)}</strong> Mujeres{personas && <small> · {entero(m)} personas</small>}
        </span>
      </div>
    </div>
  );
}

/** Barras horizontales de fracciones (NSE, edades); la mayor se resalta. */
export function Barras({ items, etiqueta }) {
  const max = Math.max(...items.map((i) => Number(i.valor) || 0));
  if (!max) return <p className="dm-sin-dato">Sin dato</p>;
  return (
    <ul className="dm-barras" aria-label={etiqueta}>
      {items.map((i) => {
        const v = Number(i.valor) || 0;
        return (
          <li key={i.clave} className={cx('dm-barra', v === max && 'dm-barra--mayor')}>
            <span className="dm-barra__etiqueta">{i.etiqueta}</span>
            <span className="dm-barra__pista" aria-hidden="true">
              <span className="dm-barra__relleno" style={{ width: `${(v / max) * 100}%` }} />
            </span>
            <span className="dm-barra__valor">{v ? pct(v) : 'Sin dato'}</span>
          </li>
        );
      })}
    </ul>
  );
}

/** Perfil de audiencia: género, NSE y edades según el tipo de medio (camiones solo género). */
export function PerfilAudiencia({ tipo, datos }) {
  const escala = tipo === 'indoor' ? 'indoor' : 'sitios';
  const conNse = tipo !== 'camiones' && datos.nse;
  const conEdades = tipo !== 'camiones' && datos.edades;
  return (
    <div className="dm-perfil">
      <div className="dm-perfil__bloque">
        <h4 className="dm-subtitulo"><Icon name="gender" size={16} /> Género</h4>
        <Genero hombres={datos.hombres} mujeres={datos.mujeres} personas={tipo === 'indoor'} />
      </div>
      {conNse && (
        <div className="dm-perfil__bloque">
          <h4 className="dm-subtitulo"><Icon name="layers" size={16} /> Nivel socioeconómico (NSE)</h4>
          <Barras etiqueta="Nivel socioeconómico" items={NSE[escala].map(([clave, e]) => ({ clave, etiqueta: e, valor: datos.nse[clave] }))} />
        </div>
      )}
      {conEdades && (
        <div className="dm-perfil__bloque">
          <h4 className="dm-subtitulo"><Icon name="users" size={16} /> Edades</h4>
          <Barras etiqueta="Edades" items={EDADES[escala].map(([clave, e]) => ({ clave, etiqueta: e, valor: datos.edades[clave] }))} />
        </div>
      )}
    </div>
  );
}

/** Sección del drawer: título con ícono y contenido. */
export function Seccion({ icono, titulo, descripcion, children }) {
  return (
    <section className="dm-seccion">
      <header className="dm-seccion__cabecera">
        <h3 className="dm-seccion__titulo">
          <span className="dm-seccion__icono" aria-hidden="true"><Icon name={icono} size={16} /></span>
          {titulo}
        </h3>
        {descripcion && <p className="dm-seccion__descripcion">{descripcion}</p>}
      </header>
      {children}
    </section>
  );
}

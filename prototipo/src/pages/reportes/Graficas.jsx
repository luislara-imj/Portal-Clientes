import { useState } from 'react';
import { cx } from '../../orbita';
import './graficas.css';

// Gráficas de Reportes hechas a mano (sin librerías): dona y barras verticales con rampa de un tono
// (--rp-serie-1..6, de oscuro a claro, en graficas.css). Cada segmento o barra se enfoca con el
// teclado y muestra un tooltip con el nombre del gráfico y su valor, igual que con el cursor.
// datos: [{ etiqueta, valor (porcentaje), serie? (1..6; por defecto el orden del dato) }]

const colorDe = (d, i) => `var(--rp-serie-${d.serie ?? i + 1})`;
const resumenDe = (titulo, datos) => `${titulo}: ${datos.map((d) => `${d.etiqueta} ${d.valor}%`).join(', ')}`;

// Tooltip del gráfico: título en negritas y "● Etiqueta 51%". Decorativo para lectores de pantalla:
// el segmento enfocado ya se anuncia con su aria-label.
function TooltipGrafica({ titulo, dato, color, style }) {
  return (
    <div className="gr-tip" aria-hidden="true" style={style}>
      <strong className="gr-tip__titulo">{titulo}</strong>
      <span className="gr-tip__fila">
        <span className="gr-tip__punto" style={{ background: color }} />
        <span>{dato.etiqueta}</span>
        <strong>{dato.valor}%</strong>
      </span>
    </div>
  );
}

// Props comunes de un segmento o barra enfocable.
function propsInteractivos(i, d, setActivo) {
  return {
    tabIndex: 0,
    role: 'img',
    'aria-label': `${d.etiqueta}, ${d.valor}%`,
    onMouseEnter: () => setActivo(i),
    onMouseLeave: () => setActivo((a) => (a === i ? null : a)),
    onFocus: () => setActivo(i),
    onBlur: () => setActivo((a) => (a === i ? null : a)),
    onKeyDown: (e) => {
      if (e.key === 'Escape') setActivo(null);
    }
  };
}

// Punto en la circunferencia (ángulo en radianes desde las 12 en sentido horario), viewBox 0 0 100 100.
const punto = (radio, a) => [50 + radio * Math.sin(a), 50 - radio * Math.cos(a)];

function arco(R, r, a0, a1) {
  // Un segmento del 100 %: dos medias vueltas (un arco SVG no puede cerrar el círculo).
  if (a1 - a0 >= Math.PI * 2 - 1e-6) {
    return `${arco(R, r, a0, a0 + Math.PI)} ${arco(R, r, a0 + Math.PI, a1)}`;
  }
  const grande = a1 - a0 > Math.PI ? 1 : 0;
  const [x0, y0] = punto(R, a0);
  const [x1, y1] = punto(R, a1);
  const [x2, y2] = punto(r, a1);
  const [x3, y3] = punto(r, a0);
  const f = (n) => n.toFixed(3);
  return [
    `M${f(x0)} ${f(y0)}`,
    `A${R} ${R} 0 ${grande} 1 ${f(x1)} ${f(y1)}`,
    `L${f(x2)} ${f(y2)}`,
    r > 0 ? `A${r} ${r} 0 ${grande} 0 ${f(x3)} ${f(y3)}` : '',
    'Z'
  ].join(' ');
}

/**
 * Dona. leyenda: 'izquierda' (leyenda en columna a la izquierda, abajo) | 'ninguna'.
 * tamano: diámetro en px de la dona. hueco: radio interior como fracción del exterior (0 = pastel).
 */
export function GraficaDona({ titulo, datos, leyenda = 'izquierda', tamano = 140, hueco = 0.5, className }) {
  const [activo, setActivo] = useState(null);
  const total = datos.reduce((t, d) => t + (d.valor > 0 ? d.valor : 0), 0) || 1;
  const R = 50;
  const r = R * hueco;

  let acumulado = 0;
  const segmentos = datos.map((d, i) => {
    const a0 = (acumulado / total) * Math.PI * 2;
    acumulado += d.valor > 0 ? d.valor : 0;
    const a1 = (acumulado / total) * Math.PI * 2;
    const [cx, cy] = punto((R + r) / 2, (a0 + a1) / 2);
    return { d, i, ruta: arco(R, r, a0, a1), cx, cy, vacio: a1 <= a0 };
  });
  const sel = activo !== null ? segmentos[activo] : null;

  return (
    <div className={cx('gr', 'gr-dona', `gr-dona--${leyenda}`, className)} style={{ '--gr-tamano': `${tamano}px` }}>
      {leyenda !== 'ninguna' && (
        <ul className="gr-leyenda" aria-hidden="true">
          {datos.map((d, i) => (
            <li key={d.etiqueta} className="gr-leyenda__item">
              <span className="gr-leyenda__muestra" style={{ background: colorDe(d, i) }} />
              {d.etiqueta}
            </li>
          ))}
        </ul>
      )}
      <div className="gr-dona__lienzo" role="group" aria-label={resumenDe(titulo, datos)}>
        <svg viewBox="0 0 100 100" className="gr-dona__svg" focusable="false">
          {segmentos.filter((s) => !s.vacio).map(({ d, i, ruta }) => (
            <path
              key={d.etiqueta}
              d={ruta}
              className={cx('gr-seg', activo === i && 'is-activo')}
              style={{ fill: colorDe(d, i) }}
              {...propsInteractivos(i, d, setActivo)}
            />
          ))}
        </svg>
        {sel && (
          <TooltipGrafica
            titulo={titulo}
            dato={sel.d}
            color={colorDe(sel.d, sel.i)}
            style={{ left: `${sel.cx}%`, top: `${sel.cy}%`, '--gr-tip-x': `${-sel.cx}%` }}
          />
        )}
      </div>
    </div>
  );
}

/**
 * Barras verticales con eje Y de 0 a `maximo` % en pasos de `paso` (líneas guía) y etiquetas X.
 * El alto lo da el contenedor (mínimo en graficas.css).
 */
export function GraficaBarras({ titulo, datos, maximo = 100, paso = 20, className }) {
  const [activo, setActivo] = useState(null);
  const marcas = [];
  for (let v = 0; v <= maximo; v += paso) marcas.push(v);
  const n = datos.length;

  return (
    <div className={cx('gr', 'gr-barras', className)} role="group" aria-label={resumenDe(titulo, datos)}>
      <div className="gr-barras__eje" aria-hidden="true">
        {marcas.map((v) => (
          <span key={v} className="gr-barras__marca" style={{ bottom: `${(v / maximo) * 100}%` }}>
            {v}%
          </span>
        ))}
      </div>
      <div className="gr-barras__area">
        {marcas.map((v) => (
          <span key={v} className="gr-barras__guia" style={{ bottom: `${(v / maximo) * 100}%` }} aria-hidden="true" />
        ))}
        {datos.map((d, i) => {
          const alto = Math.min(100, Math.max(0, (d.valor / maximo) * 100));
          // El tooltip se alinea a la izquierda en la primera barra y a la derecha en la última.
          const x = n > 1 ? (i / (n - 1)) * 100 : 50;
          return (
            <div key={d.etiqueta} className="gr-barras__col">
              <span
                className={cx('gr-barras__barra', activo === i && 'is-activo')}
                style={{ height: `${alto}%`, background: colorDe(d, i) }}
                {...propsInteractivos(i, d, setActivo)}
              />
              {activo === i && (
                <TooltipGrafica
                  titulo={titulo}
                  dato={d}
                  color={colorDe(d, i)}
                  style={{ left: '50%', top: `${100 - alto}%`, '--gr-tip-x': `${-x}%` }}
                />
              )}
            </div>
          );
        })}
      </div>
      <div className="gr-barras__x" aria-hidden="true">
        {datos.map((d) => (
          <span key={d.etiqueta} className="gr-barras__etiqueta">{d.etiqueta}</span>
        ))}
      </div>
    </div>
  );
}

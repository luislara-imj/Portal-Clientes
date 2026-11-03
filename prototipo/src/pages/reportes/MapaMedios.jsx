import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Icon, IconButton, Switch, cx } from '../../orbita';
import { NOMBRE_PLAZA, PLAZAS } from '../../data/catalogos.js';
import { ICONO_TIPO } from '../instalacion/partes.jsx';

// Mapa ilustrado (no es cartografía real): manzanas en cuadrícula algo irregular, un parque, una
// avenida diagonal y una ruta en color de marca, todo con tokens. Encima, un pin por medio instalado
// de la plaza elegida, con lat/lng normalizadas al recuadro de esos medios.

const ZOOM_MIN = 1;
const ZOOM_MAX = 3;
const ZOOM_PASO = 0.5;
const MARGEN_X = 36;
const MARGEN_ARRIBA = 52; // alto del pin
const MARGEN_ABAJO = 20;
const SEPARACION_PINES = 22;

const conCoordenadas = (m) => typeof m.lat === 'number' && typeof m.lng === 'number';

// Aleatorio determinista (mulberry32) para que el dibujo de cada plaza no cambie entre renders.
function aleatorio(semilla) {
  let a = semilla >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const semillaDe = (texto) => [...texto].reduce((h, c) => Math.imul(h ^ c.charCodeAt(0), 16777619), 2166136261);

// Trazos de la ciudad en px para un lienzo w × h.
function trazarCiudad(plaza, w, h) {
  const azar = aleatorio(semillaDe(plaza));
  const entre = (a, b) => a + azar() * (b - a);
  const cortes = (largo, min, max) => {
    const lista = [];
    let pos = -entre(0, min);
    while (pos < largo) {
      const calle = entre(7, 11);
      const tramo = entre(min, max);
      lista.push([pos + calle, pos + calle + tramo]);
      pos += calle + tramo;
    }
    return lista;
  };
  const columnas = cortes(w, 46, 78);
  const filas = cortes(h, 38, 64);

  // Parque: un bloque de 2 × 2 manzanas cerca del tercio izquierdo inferior.
  const pc = Math.min(columnas.length - 2, Math.max(0, Math.round(columnas.length * 0.25)));
  const pf = Math.min(filas.length - 2, Math.max(0, Math.round(filas.length * 0.6)));
  const parque = columnas[pc] && filas[pf] && columnas[pc + 1] && filas[pf + 1]
    ? { x: columnas[pc][0], y: filas[pf][0], w: columnas[pc + 1][1] - columnas[pc][0], h: filas[pf + 1][1] - filas[pf][0] }
    : null;
  const enParque = (c, f) => parque && (c === pc || c === pc + 1) && (f === pf || f === pf + 1);

  const manzanas = [];
  columnas.forEach(([x0, x1], c) => {
    filas.forEach(([y0, y1], f) => {
      if (enParque(c, f)) return;
      const j = () => entre(0, 3);
      manzanas.push({ x: x0 + j(), y: y0 + j(), w: x1 - x0 - j() * 2, h: y1 - y0 - j() * 2 });
    });
  });

  const arboles = parque
    ? Array.from({ length: 7 }, () => ({ cx: parque.x + entre(10, parque.w - 10), cy: parque.y + entre(10, parque.h - 10), r: entre(4, 8) }))
    : [];

  // Ruta: escalera por las calles, de la izquierda arriba hacia la derecha abajo.
  const calleX = (i) => (columnas[i] ? columnas[i][0] - 4.5 : w);
  const calleY = (i) => (filas[i] ? filas[i][0] - 4.5 : h);
  const ruta = [];
  let ci = 1;
  let fi = 1;
  ruta.push([0, calleY(fi)]);
  while (ci < columnas.length && fi < filas.length + 1) {
    ruta.push([calleX(ci), calleY(fi)]);
    if (azar() > 0.45) ci += 1 + Math.floor(azar() * 2);
    else fi += 1;
    ruta.push([calleX(Math.min(ci, columnas.length)), calleY(fi)]);
  }
  ruta.push([w, ruta[ruta.length - 1][1]]);

  return {
    manzanas,
    parque,
    arboles,
    avenida: { x1: -10, y1: h * entre(0.78, 0.92), x2: w + 10, y2: h * entre(0.05, 0.2) },
    ruta: ruta.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ')
  };
}

// Posición de cada pin (px) dentro del lienzo, sin encimarse.
function ubicarPines(medios, w, h) {
  if (!medios.length || !w || !h) return [];
  const lats = medios.map((m) => m.lat);
  const lngs = medios.map((m) => m.lng);
  const [latMin, latMax, lngMin, lngMax] = [Math.min(...lats), Math.max(...lats), Math.min(...lngs), Math.max(...lngs)];
  const ancho = Math.max(0, w - MARGEN_X * 2);
  const alto = Math.max(0, h - MARGEN_ARRIBA - MARGEN_ABAJO);
  const colocados = [];
  for (const m of medios) {
    let x = MARGEN_X + (lngMax > lngMin ? ((m.lng - lngMin) / (lngMax - lngMin)) * ancho : ancho / 2);
    let y = MARGEN_ARRIBA + (latMax > latMin ? ((latMax - m.lat) / (latMax - latMin)) * alto : alto / 2);
    // Espiral corta si cae encima de otro pin (medios en el mismo inmueble o calle).
    const x0 = x;
    const y0 = y;
    for (let k = 1; k < 40 && colocados.some((p) => Math.hypot(p.x - x, p.y - y) < SEPARACION_PINES); k += 1) {
      const ang = k * 2.4;
      const rad = 6 + k * 3;
      x = Math.min(w - MARGEN_X / 2, Math.max(MARGEN_X / 2, x0 + Math.cos(ang) * rad));
      y = Math.min(h - MARGEN_ABAJO / 2, Math.max(MARGEN_ARRIBA, y0 + Math.sin(ang) * rad));
    }
    colocados.push({ m, x, y });
  }
  return colocados;
}

/**
 * medios: medios instalados (objetos de la semilla) · activo: id resaltado (pin más grande)
 * onActivo(id | null): hover/foco de un pin · onVer(medio): clic en un pin (igual que "Ver" de la tabla)
 */
export function MapaMedios({ medios, activo, onActivo, onVer }) {
  const plazas = useMemo(() => PLAZAS.filter((p) => medios.some((m) => m.plaza === p && conCoordenadas(m))), [medios]);
  const [plaza, setPlaza] = useState(plazas[0] ?? null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [caja, setCaja] = useState({ w: 0, h: 0 });
  const lienzo = useRef(null);
  const arrastre = useRef(null);

  const plazaActual = plazas.includes(plaza) ? plaza : plazas[0] ?? null;

  useLayoutEffect(() => {
    const el = lienzo.current;
    if (!el) return undefined;
    const medir = () => setCaja({ w: el.clientWidth, h: el.clientHeight });
    medir();
    if (typeof ResizeObserver === 'undefined') return undefined;
    const ro = new ResizeObserver(medir);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Al cambiar de plaza vuelve a la vista completa.
  useEffect(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, [plazaActual]);

  const { w, h } = caja;
  const ciudad = useMemo(() => (w && h && plazaActual ? trazarCiudad(plazaActual, w, h) : null), [plazaActual, w, h]);
  const deLaPlaza = useMemo(() => medios.filter((m) => m.plaza === plazaActual && conCoordenadas(m)), [medios, plazaActual]);
  const pines = useMemo(() => ubicarPines(deLaPlaza, w, h), [deLaPlaza, w, h]);

  const limitar = (p, z) => {
    const mx = ((z - 1) * w) / 2;
    const my = ((z - 1) * h) / 2;
    return { x: Math.min(mx, Math.max(-mx, p.x)), y: Math.min(my, Math.max(-my, p.y)) };
  };
  const cambiarZoom = (delta) => {
    const z = Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, zoom + delta));
    setZoom(z);
    setPan((p) => limitar({ x: (p.x * z) / zoom, y: (p.y * z) / zoom }, z));
  };

  // Arrastre con el puntero cuando hay zoom (no empieza sobre pines ni botones).
  const alBajar = (e) => {
    if (zoom <= 1 || e.button !== 0 || e.target.closest('button')) return;
    arrastre.current = { x: e.clientX, y: e.clientY, pan, movido: false, id: e.pointerId };
  };
  const alMover = (e) => {
    const a = arrastre.current;
    if (!a) return;
    const dx = e.clientX - a.x;
    const dy = e.clientY - a.y;
    if (!a.movido && Math.hypot(dx, dy) < 3) return;
    if (!a.movido) {
      a.movido = true;
      e.currentTarget.setPointerCapture?.(a.id);
    }
    setPan(limitar({ x: a.pan.x + dx, y: a.pan.y + dy }, zoom));
  };
  const alSoltar = (e) => {
    if (arrastre.current?.movido) e.currentTarget.releasePointerCapture?.(arrastre.current.id);
    arrastre.current = null;
  };

  const transformar = (x, y) => [(x - w / 2) * zoom + w / 2 + pan.x, (y - h / 2) * zoom + h / 2 + pan.y];
  const nombrePlaza = NOMBRE_PLAZA[plazaActual] || plazaActual || '';

  return (
    <div className="rp-mapa">
      {plazas.length > 1 && (
        <Switch
          size="sm"
          label="Plaza del mapa"
          value={plazaActual}
          onChange={setPlaza}
          options={plazas.map((p) => ({ value: p, label: NOMBRE_PLAZA[p] || p }))}
          className="rp-mapa__plazas"
        />
      )}
      <div
        ref={lienzo}
        className={cx('rp-mapa__lienzo', zoom > 1 && 'is-zoom')}
        role="group"
        aria-label={`Mapa de medios en ${nombrePlaza}: ${pines.length} ${pines.length === 1 ? 'medio' : 'medios'}`}
        onPointerDown={alBajar}
        onPointerMove={alMover}
        onPointerUp={alSoltar}
        onPointerCancel={alSoltar}
      >
        {ciudad && (
          <svg className="rp-mapa__svg" width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden="true" focusable="false">
            <g transform={`translate(${w / 2 + pan.x} ${h / 2 + pan.y}) scale(${zoom}) translate(${-w / 2} ${-h / 2})`}>
              <rect className="rp-mapa__calles" x={-w} y={-h} width={w * 3} height={h * 3} />
              {ciudad.manzanas.map((b, i) => (
                <rect key={i} className="rp-mapa__manzana" x={b.x} y={b.y} width={b.w} height={b.h} rx="2" />
              ))}
              {ciudad.parque && (
                <>
                  <rect className="rp-mapa__parque" x={ciudad.parque.x} y={ciudad.parque.y} width={ciudad.parque.w} height={ciudad.parque.h} rx="6" />
                  {ciudad.arboles.map((a, i) => (
                    <circle key={i} className="rp-mapa__arbol" cx={a.cx} cy={a.cy} r={a.r} />
                  ))}
                </>
              )}
              <line className="rp-mapa__avenida-borde" {...ciudad.avenida} />
              <line className="rp-mapa__avenida" {...ciudad.avenida} />
              <polyline className="rp-mapa__ruta" points={ciudad.ruta} />
            </g>
          </svg>
        )}

        {pines.map(({ m, x, y }) => {
          const [px, py] = transformar(x, y);
          const grande = activo === m.id;
          const direccion = m.direccion || m.nombre || 'Medio sin dirección';
          return (
            <button
              key={m.id}
              type="button"
              className={cx('rp-pin', grande && 'is-activo')}
              style={{ left: `${px}px`, top: `${py}px` }}
              aria-label={direccion}
              title={direccion}
              onClick={() => onVer?.(m)}
              onMouseEnter={() => onActivo?.(m.id)}
              onMouseLeave={() => onActivo?.(null)}
              onFocus={() => onActivo?.(m.id)}
              onBlur={() => onActivo?.(null)}
            >
              <span className="rp-pin__gota">
                <Icon name={ICONO_TIPO[m.tipo] || 'shapes'} size={16} className="rp-pin__icono" />
              </span>
            </button>
          );
        })}

        <div className="rp-mapa__zoom">
          <IconButton icon="zoom-in" label="Acercar" variant="secondary" size="xs" tooltipPlacement="top" disabled={zoom >= ZOOM_MAX} onClick={() => cambiarZoom(ZOOM_PASO)} />
          <IconButton icon="zoom-out" label="Alejar" variant="secondary" size="xs" tooltipPlacement="bottom" disabled={zoom <= ZOOM_MIN} onClick={() => cambiarZoom(-ZOOM_PASO)} />
        </div>
      </div>
    </div>
  );
}

export default MapaMedios;

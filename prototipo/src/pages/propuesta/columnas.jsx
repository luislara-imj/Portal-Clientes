// Columnas de la vista tabla por tipo de medio: las de docs/TEMPLATES_REFERENCIA.md §1 (sin "Disponible").
// "¿Lo incluyes?" y la clave son Key Columns fijas (sticky); el resto se desplaza dentro del contenedor.

import {
  claveDe, coordenada, entero, fecha, porcentaje, precio, promedio, texto
} from './formatos.js';

const num = (key, header, valor) => ({ key, header, type: 'number', render: (m) => valor(m) });
const txt = (key, header, valor) => ({ key, header, render: (m) => valor(m) });

// Texto largo (dirección): se recorta y el completo queda en el título.
const largo = (key, header, valor) => ({
  key,
  header,
  render: (m) => {
    const v = valor(m);
    return <span className="pp-recorte" title={v}>{v}</span>;
  }
});

const mapa = {
  key: 'mapa',
  header: 'Ubicación',
  render: (m) => (m.lat == null || m.lng == null ? '—' : (
    <a
      className="ui-table__link"
      href={`https://www.google.com/maps?q=${m.lat},${m.lng}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Ver ${claveDe(m)} en mapa (se abre en otra pestaña)`}
    >
      Ver en mapa
    </a>
  ))
};

const precios = [
  num('precio', 'Precio cliente', (m) => precio(m.precio)),
  num('precioDescuento', 'Precio con descuento', (m) => precio(m.precioDescuento))
];

const COLUMNAS = {
  sitios: {
    clave: 'Clave IMJ',
    resto: [
      txt('formato', 'Formato', (m) => texto(m.formato)),
      largo('direccion', 'Dirección', (m) => texto(m.direccion)),
      txt('vista', 'Vista', (m) => texto(m.vista)),
      txt('iluminacion', 'Iluminación', (m) => texto(m.iluminacion)),
      txt('medida', 'Medida', (m) => texto(m.medida)),
      txt('inicio', 'Inicio', (m) => fecha(m.inicio)),
      txt('fin', 'Fin', (m) => fecha(m.fin)),
      txt('comentarios', 'Comentarios', (m) => texto(m.comentarios)),
      txt('referencias', 'Referencias comerciales', (m) => texto(m.referencias)),
      mapa,
      num('lat', 'Latitud', (m) => coordenada(m.lat)),
      num('lng', 'Longitud', (m) => coordenada(m.lng)),
      num('impactos', 'Impactos', (m) => entero(m.impactos)),
      num('impactosTotales', 'Impactos totales', (m) => entero(m.impactosTotales)),
      num('alcance', 'Alcance', (m) => entero(m.alcance)),
      num('frecuencia', 'Frecuencia promedio', (m) => promedio(m.frecuencia)),
      num('tiempoExposicion', 'Tiempo de exposición promedio (seg/mes)', (m) => promedio(m.tiempoExposicion)),
      num('hombres', 'Hombres', (m) => porcentaje(m.hombres)),
      num('mujeres', 'Mujeres', (m) => porcentaje(m.mujeres)),
      num('nseAb', 'NSE AB', (m) => porcentaje(m.nse?.ab)),
      num('nseCmas', 'NSE C+', (m) => porcentaje(m.nse?.cmas)),
      num('nseC', 'NSE C', (m) => porcentaje(m.nse?.c)),
      num('nseDmas', 'NSE D+', (m) => porcentaje(m.nse?.dmas)),
      num('nseD', 'NSE D', (m) => porcentaje(m.nse?.d)),
      num('nseE', 'NSE E', (m) => porcentaje(m.nse?.e)),
      num('e0_14', 'Edad 0 a 14', (m) => porcentaje(m.edades?.e0_14)),
      num('e15_19', 'Edad 15 a 19', (m) => porcentaje(m.edades?.e15_19)),
      num('e20_24', 'Edad 20 a 24', (m) => porcentaje(m.edades?.e20_24)),
      num('e25_34', 'Edad 25 a 34', (m) => porcentaje(m.edades?.e25_34)),
      num('e35_44', 'Edad 35 a 44', (m) => porcentaje(m.edades?.e35_44)),
      num('e45_64', 'Edad 45 a 64', (m) => porcentaje(m.edades?.e45_64)),
      num('e65', 'Edad 65 o más', (m) => porcentaje(m.edades?.e65)),
      ...precios
    ]
  },
  camiones: {
    clave: 'Ruta',
    resto: [
      txt('tipoExhibicion', 'Tipo de exhibición', (m) => texto(m.tipoExhibicion)),
      txt('categoria', 'Categoría', (m) => texto(m.categoria)),
      txt('tipoAnuncio', 'Tipo de anuncio', (m) => texto(m.tipoAnuncio)),
      txt('inicio', 'Inicio', (m) => fecha(m.inicio)),
      txt('fin', 'Fin', (m) => fecha(m.fin)),
      num('impactos', 'Impactos únicos', (m) => entero(m.impactos)),
      num('alcance', 'Alcance mensual', (m) => entero(m.alcance)),
      num('impactosTotales', 'Impactos totales', (m) => entero(m.impactosTotales)),
      num('frecuencia', 'Frecuencia promedio mensual', (m) => promedio(m.frecuencia)),
      num('tiempoExposicion', 'Tiempo de exposición promedio (seg)', (m) => promedio(m.tiempoExposicion)),
      num('km', 'Km promedio', (m) => entero(m.km)),
      num('hombres', 'Hombres', (m) => porcentaje(m.hombres)),
      num('mujeres', 'Mujeres', (m) => porcentaje(m.mujeres)),
      ...precios
    ]
  },
  indoor: {
    clave: 'Clave IMJ',
    resto: [
      txt('formato', 'Formato', (m) => texto(m.formato)),
      txt('inmueble', 'Inmueble', (m) => texto(m.inmueble)),
      txt('nivel', 'Nivel', (m) => texto(m.nivel)),
      txt('area', 'Área', (m) => texto(m.area)),
      txt('aNivelPiso', 'A nivel de piso', (m) => texto(m.aNivelPiso)),
      txt('descripcion', 'Descripción', (m) => texto(m.descripcion)),
      txt('comentarios', 'Comentarios', (m) => texto(m.comentarios)),
      largo('direccion', 'Dirección', (m) => texto(m.direccion)),
      txt('inicio', 'Inicio', (m) => fecha(m.inicio)),
      txt('fin', 'Fin', (m) => fecha(m.fin)),
      num('impactos', 'Impactos', (m) => entero(m.impactos)),
      num('alcance', 'Alcance', (m) => entero(m.alcance)),
      num('impactosTotales', 'Impactos totales', (m) => entero(m.impactosTotales)),
      num('frecuencia', 'Frecuencia promedio', (m) => promedio(m.frecuencia)),
      // Indoor: hombres y mujeres son personas, no porcentaje.
      num('hombres', 'Hombres', (m) => entero(m.hombres)),
      num('mujeres', 'Mujeres', (m) => entero(m.mujeres)),
      num('nseAbcmas', 'NSE ABC+', (m) => porcentaje(m.nse?.abcmas)),
      num('nseC', 'NSE C', (m) => porcentaje(m.nse?.c)),
      num('nseCmenos', 'NSE C-', (m) => porcentaje(m.nse?.cmenos)),
      num('nseDmas', 'NSE D+', (m) => porcentaje(m.nse?.dmas)),
      num('nseDe', 'NSE DE', (m) => porcentaje(m.nse?.de)),
      num('e13_17', 'Edad 13 a 17', (m) => porcentaje(m.edades?.e13_17)),
      num('e18_25', 'Edad 18 a 25', (m) => porcentaje(m.edades?.e18_25)),
      num('e26_40', 'Edad 26 a 40', (m) => porcentaje(m.edades?.e26_40)),
      num('e41_55', 'Edad 41 a 55', (m) => porcentaje(m.edades?.e41_55)),
      num('e55', 'Edad 55 o más', (m) => porcentaje(m.edades?.e55)),
      num('precioProduccion', 'Precio de producción', (m) => precio(m.precioProduccion)),
      ...precios
    ]
  },
  vallas: {
    clave: 'Clave',
    resto: [
      txt('inicio', 'Inicio', (m) => fecha(m.inicio)),
      txt('fin', 'Fin', (m) => fecha(m.fin)),
      ...precios
    ]
  },
  riders: {
    clave: 'Clave',
    resto: [
      txt('inicio', 'Inicio', (m) => fecha(m.inicio)),
      txt('fin', 'Fin', (m) => fecha(m.fin)),
      ...precios
    ]
  }
};

/**
 * Columnas para <Table> de un tipo de medio.
 * renderSiNo(m): nodo del Switch Sí / No de la fila.
 * onVerDetalles(id): la clave se vuelve un enlace que abre el detalle del medio.
 */
export function columnasDe(tipo, renderSiNo, onVerDetalles) {
  const def = COLUMNAS[tipo];
  const clave = (m) =>
    onVerDetalles ? (
      <button type="button" className="pp-clave pp-clave--enlace" onClick={() => onVerDetalles(m.id)} title="Ver detalles">
        {claveDe(m)}
      </button>
    ) : (
      <span className="pp-clave">{claveDe(m)}</span>
    );
  return [
    { key: 'incluye', header: '¿Lo incluyes?', sticky: true, render: renderSiNo },
    { key: 'clave', header: def.clave, sticky: true, render: clave },
    ...def.resto
  ];
}

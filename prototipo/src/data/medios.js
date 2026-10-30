// Modelo de medio y generador determinista.
//
// Todos los medios (y cada unidad numerada de vallas y brand riders) tienen la misma forma;
// los campos que no aplican al tipo valen null.
//
// Identidad y clasificación
//   id                 único en toda la semilla (prefijo de campaña)
//   tipo               'sitios' | 'camiones' | 'indoor' | 'vallas' | 'riders'
//   plaza              'CDMX' | 'ZMG' | 'MTY'
//   clave              sitios IMJ-{plaza}-{ESP|CAR|MUR|PAN|PTP|PAR}-O-{nnnn}{A|B} (A natural, B cruzada)
//                      indoor IMJ-{plaza}-{AER|CCO|AUT}-I-{nnnn}NA · camiones R-{plaza}{nn}
//                      vallas y riders: null (se muestran por su nombre numerado)
//   nombre             sitios "{formato} {calle}" · camiones "{formato} · {tipo de ruta}" · indoor "{formato} {inmueble}"
//                      vallas "Valla 01" · riders "{formato} · 01"
//   formato            Espectacular, Cartelera… · Integral, Semi-integral, Medallón, Medio medallón · Tótem… · formato de valla o rider
//   subtipo            sitios: estructura (Unipolar, Azotea…) · indoor: categoría del inmueble (Aeropuerto…)
// Ubicación y características
//   direccion, lat, lng, vista ('Natural' | 'Cruzada'), iluminacion ('Con luz' | 'Sin luz'), medida
// Periodo
//   inicio, fin        'AAAA-MM-DD'
//   meses              meses de servicio que se cobran (vallas: 1 = el periodo completo)
//   periodo            solo vallas: { inicio, fin }
// Texto: comentarios, referencias ('—' cuando no hay)
// Métricas (0 = "Sin dato"; null = no aplica al tipo)
//   impactos, impactosTotales, alcance, frecuencia (promedio), tiempoExposicion (seg/mes sitios, seg camiones)
//   hombres, mujeres   fracción (0.62) en sitios y camiones; personas en indoor
//   nse, edades        objetos de fracciones (claves según tipo, ver docs/TEMPLATES_REFERENCIA.md §1)
// Precios (MXN antes de IVA)
//   precio             mensual por unidad · precioDescuento = precio con 10 % menos · precioProduccion solo indoor
//   unidades           unidades que cubre la línea (camiones: camiones de la ruta; vallas y riders: 1 por unidad numerada)
// Camiones: tipoRuta, tipoExhibicion, categoria, tipoAnuncio, km (km promedio)
// Indoor: inmueble, nivel, area, aNivelPiso ('Sí' | 'No'), descripcion
// Vallas y riders: grupo (plaza en vallas, formato en riders), solicitud (id de la solicitud), familia (riders)

import { crearAleatorio } from './aleatorio.js';
import {
  CALLES, CATEGORIAS_INDOOR, CENTRO_PLAZA, DESCUENTO_PCT, FORMATOS_CAMION, FORMATOS_INDOOR,
  FORMATOS_RIDER, FORMATOS_SITIO, FORMATOS_VALLA, INMUEBLES, MEDIDAS_INDOOR, NOMBRE_PLAZA,
  RECORRIDOS, TIPOS_RUTA, ANUNCIOS_CAMION, ZONAS_INDOOR, CODIGOS_SITIO
} from './catalogos.js';

const NSE_EXTERIOR = ['ab', 'cmas', 'c', 'dmas', 'd', 'e'];
const EDADES_EXTERIOR = ['e0_14', 'e15_19', 'e20_24', 'e25_34', 'e35_44', 'e45_64', 'e65'];
const NSE_INDOOR = ['abcmas', 'c', 'cmenos', 'dmas', 'de'];
const EDADES_INDOOR = ['e13_17', 'e18_25', 'e26_40', 'e41_55', 'e55'];

export function medioVacio() {
  return {
    id: null, tipo: null, plaza: null, clave: null, nombre: null, formato: null, subtipo: null,
    direccion: null, vista: null, iluminacion: null, medida: null, lat: null, lng: null,
    inicio: null, fin: null, meses: null, periodo: null, comentarios: null, referencias: null,
    impactos: null, impactosTotales: null, alcance: null, frecuencia: null, tiempoExposicion: null,
    hombres: null, mujeres: null, nse: null, edades: null,
    precio: null, precioDescuento: null, precioProduccion: null, unidades: 1,
    tipoRuta: null, tipoExhibicion: null, categoria: null, tipoAnuncio: null, km: null,
    inmueble: null, nivel: null, area: null, aNivelPiso: null, descripcion: null,
    grupo: null, solicitud: null, familia: null
  };
}

export const conDescuento = (precio) => Math.round(precio * (100 - DESCUENTO_PCT)) / 100;
const dos = (n) => String(n).padStart(2, '0');
const cuatro = (n) => String(n).padStart(4, '0');
const ceros = (claves) => Object.fromEntries(claves.map((k) => [k, 0]));

// Generador de medios para una campaña. `semilla` fija el azar; `consecutivo` es el primer número de clave.
export function crearGenerador({ prefijo, semilla, consecutivo, inicio, fin, meses }) {
  const rng = crearAleatorio(semilla);
  let siguienteClave = consecutivo;
  let contador = 0;
  const indiceCalle = { CDMX: 0, ZMG: 0, MTY: 0 };
  const indiceInmueble = { CDMX: 0, ZMG: 0, MTY: 0 };
  const callesBarajadas = Object.fromEntries(Object.entries(CALLES).map(([p, l]) => [p, rng.barajar(l)]));
  const rutasUsadas = new Set();

  const nuevoId = (tipo) => `${prefijo}-${tipo.slice(0, 3)}-${String(++contador).padStart(3, '0')}`;
  const cerca = (valor, radio) => Math.round((valor + rng.decimal(-radio, radio, 5)) * 10000) / 10000;
  const precioEn = ([min, max]) => rng.entero(min, max) * 1000;

  function calle(plaza, id) {
    if (id) return CALLES[plaza].find((c) => c.id === id);
    const lista = callesBarajadas[plaza];
    return lista[indiceCalle[plaza]++ % lista.length];
  }

  function base(tipo, plaza, op) {
    return Object.assign(medioVacio(), {
      id: nuevoId(tipo), tipo, plaza,
      inicio: op.inicio || inicio, fin: op.fin || fin, meses: op.meses || meses
    });
  }

  function sitio(plaza, op = {}) {
    const codigo = op.codigo || rng.elegir(CODIGOS_SITIO);
    const f = FORMATOS_SITIO[codigo];
    const c = calle(plaza, op.calle);
    const numero = op.numero || rng.entero(100, 4800);
    const vista = op.vista || (rng.siguiente() < 0.7 ? 'Natural' : 'Cruzada');
    const precio = op.precio || precioEn(f.precio);
    const m = base('sitios', plaza, op);
    const impactos = rng.entero(300, 1500) * 1000;
    const frecuencia = rng.decimal(4, 7, 1);
    Object.assign(m, {
      clave: `IMJ-${plaza}-${codigo}-O-${cuatro(siguienteClave++)}${vista === 'Natural' ? 'A' : 'B'}`,
      nombre: `${f.formato} ${c.calle}`,
      formato: f.formato,
      subtipo: rng.elegir(f.subtipos),
      direccion: `${c.calle} ${numero}, ${c.colonia}, ${c.ciudad}`,
      vista,
      iluminacion: codigo === 'PAN' || rng.siguiente() < 0.7 ? 'Con luz' : 'Sin luz',
      medida: rng.elegir(f.medidas),
      lat: cerca(c.lat, 0.004), lng: cerca(c.lng, 0.004),
      comentarios: '—', referencias: '—',
      impactos,
      impactosTotales: impactos * m.meses,
      alcance: Math.round(impactos / frecuencia / 100) * 100,
      frecuencia,
      tiempoExposicion: rng.entero(8, 25),
      precio, precioDescuento: conDescuento(precio)
    });
    const hombres = rng.decimal(0.4, 0.65, 2);
    m.hombres = hombres;
    m.mujeres = Math.round((1 - hombres) * 100) / 100;
    m.nse = rng.reparto(NSE_EXTERIOR);
    m.edades = rng.reparto(EDADES_EXTERIOR);
    if (op.sinMetricas) sinMetricas(m, NSE_EXTERIOR, EDADES_EXTERIOR);
    return m;
  }

  function camion(plaza, op = {}) {
    const formato = op.formato || rng.elegir(Object.keys(FORMATOS_CAMION));
    const f = FORMATOS_CAMION[formato];
    const tipoRuta = op.tipoRuta || rng.elegir(TIPOS_RUTA);
    let numero = op.ruta;
    while (!numero || rutasUsadas.has(`${plaza}${numero}`)) numero = rng.entero(1, 60);
    rutasUsadas.add(`${plaza}${numero}`);
    const [origen, destino] = op.recorrido || rng.elegir(RECORRIDOS[plaza]);
    const precio = op.precio || precioEn(f.precio);
    const impactos = rng.entero(200, 900) * 1000;
    const frecuencia = rng.decimal(4, 8, 1);
    const m = base('camiones', plaza, op);
    const hombres = rng.decimal(0.45, 0.65, 2);
    Object.assign(m, {
      clave: `R-${plaza}${dos(numero)}`,
      nombre: `${formato} · ${tipoRuta}`,
      formato,
      direccion: `${origen} – ${destino}`,
      lat: cerca(CENTRO_PLAZA[plaza].lat, 0.04), lng: cerca(CENTRO_PLAZA[plaza].lng, 0.04),
      comentarios: '—',
      impactos,
      impactosTotales: impactos * m.meses,
      alcance: Math.round(impactos / frecuencia / 100) * 100,
      frecuencia,
      tiempoExposicion: rng.entero(4, 12),
      km: rng.entero(30, 95),
      hombres,
      mujeres: Math.round((1 - hombres) * 100) / 100,
      precio, precioDescuento: conDescuento(precio),
      unidades: op.unidades || rng.entero(1, 4),
      tipoRuta,
      tipoExhibicion: f.exhibicion,
      categoria: tipoRuta === 'Hotelera' ? 'Turística' : 'Urbana',
      tipoAnuncio: rng.elegir(ANUNCIOS_CAMION)
    });
    if (op.sinMetricas) {
      sinMetricas(m, null, null);
      m.km = 0;
    }
    return m;
  }

  function indoor(plaza, op = {}) {
    const lista = INMUEBLES[plaza];
    const inmueble = op.inmueble
      ? lista.find((i) => i.id === op.inmueble)
      : lista[indiceInmueble[plaza]++ % lista.length];
    const cat = inmueble.categoria;
    const formatos = Object.keys(FORMATOS_INDOOR).filter((k) => FORMATOS_INDOOR[k].categorias.includes(cat));
    const formato = op.formato || rng.elegir(formatos);
    const zona = ZONAS_INDOOR[cat];
    const nivel = rng.elegir(zona.niveles);
    const area = rng.elegir(zona.areas);
    const medida = rng.elegir(MEDIDAS_INDOOR);
    const precio = op.precio || precioEn(FORMATOS_INDOOR[formato].precio);
    const impactos = rng.entero(150, 700) * 1000;
    const frecuencia = rng.decimal(3, 6, 1);
    const m = base('indoor', plaza, op);
    Object.assign(m, {
      clave: `IMJ-${plaza}-${cat}-I-${cuatro(siguienteClave++)}NA`,
      nombre: `${formato} ${inmueble.nombre}`,
      formato,
      subtipo: CATEGORIAS_INDOOR[cat],
      direccion: inmueble.direccion,
      vista: 'Natural',
      iluminacion: 'Con luz',
      medida,
      lat: cerca(inmueble.lat, 0.0008), lng: cerca(inmueble.lng, 0.0008),
      comentarios: '—',
      impactos,
      impactosTotales: impactos * m.meses,
      alcance: Math.round(impactos / frecuencia / 100) * 100,
      frecuencia,
      hombres: rng.entero(800, 3200),
      mujeres: rng.entero(800, 3200),
      nse: rng.reparto(NSE_INDOOR),
      edades: rng.reparto(EDADES_INDOOR),
      precio, precioDescuento: conDescuento(precio),
      precioProduccion: rng.entero(6, 24) * 500,
      inmueble: inmueble.nombre,
      nivel,
      area,
      aNivelPiso: formato === 'Piso' ? 'Sí' : formato === 'Escalera eléctrica' ? 'No' : rng.elegir(['Sí', 'No']),
      descripcion: `${formato} de ${medida} en ${area.toLowerCase()}`
    });
    if (op.sinMetricas) sinMetricas(m, NSE_INDOOR, EDADES_INDOOR);
    return m;
  }

  // Una solicitud de vallas en una plaza, expandida en unidades numeradas "Valla 01".
  function vallas(plaza, { formato, unidades, inicio: ini, fin: fi }) {
    const f = FORMATOS_VALLA[formato];
    const solicitud = `${prefijo}-sol-val-${plaza.toLowerCase()}`;
    return Array.from({ length: unidades }, (_, i) => {
      const m = base('vallas', plaza, { inicio: ini, fin: fi, meses: 1 });
      return Object.assign(m, {
        nombre: `Valla ${dos(i + 1)}`,
        formato,
        medida: f.medida,
        descripcion: f.descripcion,
        periodo: { inicio: m.inicio, fin: m.fin },
        precio: f.precio,
        precioDescuento: conDescuento(f.precio),
        grupo: NOMBRE_PLAZA[plaza],
        solicitud
      });
    });
  }

  // Una solicitud de brand riders de un formato, expandida en unidades "Blitz 360 · 01".
  function riders(formato, { plaza, unidades, meses: ms, inicio: ini, fin: fi }) {
    const f = FORMATOS_RIDER[formato];
    const solicitud = `${prefijo}-sol-br-${formato.toLowerCase().replace(/\s+/g, '-')}`;
    return Array.from({ length: unidades }, (_, i) => {
      const m = base('riders', plaza, { inicio: ini, fin: fi, meses: ms });
      return Object.assign(m, {
        nombre: `${formato} · ${dos(i + 1)}`,
        formato,
        descripcion: f.descripcion,
        precio: f.precio,
        precioDescuento: conDescuento(f.precio),
        grupo: formato,
        familia: f.familia,
        solicitud
      });
    });
  }

  return { sitio, camion, indoor, vallas, riders };
}

// Métricas en cero a propósito (la UI muestra "Sin dato"). El precio se conserva.
function sinMetricas(m, nse, edades) {
  m.impactos = 0;
  m.impactosTotales = 0;
  m.alcance = 0;
  m.frecuencia = 0;
  if (m.tiempoExposicion !== null) m.tiempoExposicion = 0;
  m.hombres = 0;
  m.mujeres = 0;
  if (nse) m.nse = ceros(nse);
  if (edades) m.edades = ceros(edades);
}

// ¿El medio tiene todas sus métricas de audiencia en cero?
export function esSinMetricas(m) {
  return m.impactos === 0 && m.alcance === 0 && m.frecuencia === 0;
}

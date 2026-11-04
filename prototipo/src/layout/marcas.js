// Carpetas por marca de "Mis campañas": marcas reales (con sus campañas del store),
// carpetas de ejemplo ilustrativas y color de cada carpeta. Datos puros, sin store.
import { CODIGOS } from '../data/semilla.js';
import { ARTES_EJEMPLO } from '../data/artesEjemplo.js';
import { ARTES_WECARE } from '../data/artesWecare.js';
import { ARTE_BAJIO, ARTE_COCACOLA, ARTE_SOLARIA } from '../data/artesReales.js';

// Marcas reales del prototipo → códigos de sus campañas en la semilla.
export const MARCAS_REALES = [
  { slug: 'alpina', nombre: 'Alpina', codigos: [CODIGOS.ALPINA] },
  {
    slug: 'bajio', nombre: 'Bajío', codigos: [CODIGOS.BAJIO],
    artesPorCodigo: { [CODIGOS.BAJIO]: ARTE_BAJIO }
  },
  {
    slug: 'wecare', nombre: 'WeCare',
    codigos: [CODIGOS.WECARE_PRIMAVERA, CODIGOS.WECARE_OTONO, CODIGOS.WECARE_INVIERNO],
    artesPorCodigo: {
      [CODIGOS.WECARE_PRIMAVERA]: ARTES_WECARE[0],
      [CODIGOS.WECARE_OTONO]: ARTES_WECARE[1],
      [CODIGOS.WECARE_INVIERNO]: ARTES_WECARE[2]
    }
  },
  {
    slug: 'coca-cola', nombre: 'Coca-Cola', codigos: [CODIGOS.COCACOLA],
    artesPorCodigo: { [CODIGOS.COCACOLA]: ARTE_COCACOLA }
  },
  {
    slug: 'solaria', nombre: 'Solaria', codigos: [CODIGOS.SOLARIA],
    artesPorCodigo: { [CODIGOS.SOLARIA]: ARTE_SOLARIA }
  }
];

// Carpetas ilustrativas con marcas ficticias. Datos de muestra (`ejemplo: true`).
export const MARCAS_EJEMPLO = [
  {
    slug: 'vinos-monte-alto', nombre: 'Vinos Monte Alto', ejemplo: true,
    campanas: [
      { nombre: 'Temporada de otoño', fase: 'En reporte', inicio: '2026-09-01', fin: '2026-10-31', arte: ARTES_EJEMPLO[0] },
      { nombre: 'Brindis navideño', fase: 'Propuesta lista', inicio: '2026-12-01', fin: '2026-12-31', arte: ARTES_EJEMPLO[1] }
    ]
  },
  {
    slug: 'cafe-brisa', nombre: 'Café Brisa', ejemplo: true,
    campanas: [
      { nombre: 'Mañanas de invierno', fase: 'En selección', inicio: '2026-12-01', fin: '2026-12-31', arte: ARTES_EJEMPLO[2] },
      { nombre: 'Nueva mezcla', fase: 'En instalación', inicio: '2026-11-01', fin: '2026-11-30', arte: ARTES_EJEMPLO[3] }
    ]
  },
  {
    slug: 'autos-norte', nombre: 'Autos Norte', ejemplo: true,
    campanas: [
      { nombre: 'Venta de fin de año', fase: 'Cotización lista', inicio: '2026-11-15', fin: '2026-12-31', arte: ARTES_EJEMPLO[4] },
      { nombre: 'Modelos de verano', fase: 'En reporte', inicio: '2026-06-01', fin: '2026-07-31', arte: ARTES_EJEMPLO[5] }
    ]
  },
  {
    slug: 'gimnasio-vertice', nombre: 'Gimnasio Vértice', ejemplo: true,
    campanas: [
      { nombre: 'Propósitos de año nuevo', fase: 'Propuesta lista', inicio: '2026-12-15', fin: '2026-12-31', arte: ARTES_EJEMPLO[6] },
      { nombre: 'Reto de primavera', fase: 'En reporte', inicio: '2026-03-01', fin: '2026-04-30', arte: ARTES_EJEMPLO[7] }
    ]
  },
  {
    slug: 'tienda-aurora', nombre: 'Tienda Aurora', ejemplo: true,
    campanas: [
      { nombre: 'Buen Fin', fase: 'En instalación', inicio: '2026-11-10', fin: '2026-11-20', arte: ARTES_EJEMPLO[8] },
      { nombre: 'Regreso a clases', fase: 'En selección', inicio: '2026-08-01', fin: '2026-08-31', arte: ARTES_EJEMPLO[9] }
    ]
  }
];

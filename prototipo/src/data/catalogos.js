// Catálogos de muestra para armar la semilla: plazas, calles reales con coordenadas aproximadas,
// inmuebles indoor, formatos y rangos de precio (MXN mensual por unidad, antes de IVA).
// Los números de calle, precios y métricas que se generan con estos catálogos son inventados.

export const PLAZAS = ['CDMX', 'ZMG', 'MTY'];
export const NOMBRE_PLAZA = { CDMX: 'Ciudad de México', ZMG: 'Guadalajara', MTY: 'Monterrey' };

// Orden de los tipos de medio en la propuesta.
export const TIPOS = ['sitios', 'camiones', 'indoor', 'vallas', 'riders'];
export const NOMBRE_TIPO = {
  sitios: 'Sitios fijos',
  camiones: 'Camiones',
  indoor: 'Indoor',
  vallas: 'Vallas móviles',
  riders: 'Brand riders'
};

export const DESCUENTO_PCT = 10;
export const IVA_PCT = 16;

// Calles por plaza: [id, calle, colonia, ciudad, lat, lng].
const CALLES_CRUDAS = {
  CDMX: [
    ['reforma', 'Av. Paseo de la Reforma', 'Col. Juárez', 'CDMX', 19.4270, -99.1676],
    ['insurgentesSur', 'Av. Insurgentes Sur', 'Col. Del Valle', 'CDMX', 19.3850, -99.1770],
    ['perifericoSur', 'Periférico Sur', 'Jardines del Pedregal', 'CDMX', 19.3110, -99.2120],
    ['tlalpan', 'Calz. de Tlalpan', 'Col. Country Club', 'CDMX', 19.3560, -99.1420],
    ['ejercito', 'Av. Ejército Nacional', 'Col. Granada', 'CDMX', 19.4400, -99.1950],
    ['viaducto', 'Viaducto Miguel Alemán', 'Col. Narvarte', 'CDMX', 19.4010, -99.1560],
    ['universidad', 'Av. Universidad', 'Col. Xoco', 'CDMX', 19.3600, -99.1650],
    ['churubusco', 'Av. Río Churubusco', 'Col. Del Carmen', 'CDMX', 19.3560, -99.1580],
    ['vascoQuiroga', 'Av. Vasco de Quiroga', 'Santa Fe', 'CDMX', 19.3610, -99.2750],
    ['zaragoza', 'Calz. Ignacio Zaragoza', 'Col. Agrícola Oriental', 'CDMX', 19.3990, -99.0700],
    ['insurgentesNorte', 'Av. Insurgentes Norte', 'Col. Lindavista', 'CDMX', 19.4890, -99.1320],
    ['ejeCentral', 'Eje Central Lázaro Cárdenas', 'Col. Centro', 'CDMX', 19.4330, -99.1410],
    ['masaryk', 'Av. Presidente Masaryk', 'Polanco', 'CDMX', 19.4320, -99.1950]
  ],
  ZMG: [
    ['vallarta', 'Av. Vallarta', 'Vallarta Poniente', 'Guadalajara', 20.6760, -103.3900],
    ['lopezMateos', 'Av. López Mateos Sur', 'Cd. del Sol', 'Zapopan', 20.6450, -103.4000],
    ['lazaroCardenas', 'Av. Lázaro Cárdenas', 'Las Torres', 'Guadalajara', 20.6380, -103.3780],
    ['patria', 'Av. Patria', 'Jacarandas', 'Zapopan', 20.7020, -103.3990],
    ['americas', 'Av. de las Américas', 'Country Club', 'Guadalajara', 20.6990, -103.3780],
    ['marianoOtero', 'Av. Mariano Otero', 'Verde Valle', 'Guadalajara', 20.6490, -103.4020],
    ['chapultepec', 'Av. Chapultepec', 'Col. Americana', 'Guadalajara', 20.6720, -103.3680],
    ['acueducto', 'Av. Acueducto', 'Puerta de Hierro', 'Zapopan', 20.7110, -103.4110],
    ['independencia', 'Calz. Independencia', 'Centro', 'Guadalajara', 20.6800, -103.3460],
    ['perifericoNorte', 'Periférico Norte Manuel Gómez Morín', 'Los Robles', 'Zapopan', 20.7350, -103.3900],
    ['revolucion', 'Av. Revolución', 'Centro', 'Tlaquepaque', 20.6420, -103.3200],
    ['guadalupe', 'Av. Guadalupe', 'Chapalita', 'Zapopan', 20.6650, -103.4000]
  ],
  MTY: [
    ['constitucion', 'Av. Constitución', 'Centro', 'Monterrey', 25.6700, -100.3100],
    ['gonzalitos', 'Av. Gonzalitos', 'Mitras Centro', 'Monterrey', 25.6890, -100.3530],
    ['vasconcelos', 'Av. José Vasconcelos', 'Del Valle', 'San Pedro Garza García', 25.6560, -100.3650],
    ['garzaSada', 'Av. Eugenio Garza Sada', 'Col. Roma', 'Monterrey', 25.6490, -100.2900],
    ['lazaroCardenas', 'Av. Lázaro Cárdenas', 'Valle Oriente', 'San Pedro Garza García', 25.6390, -100.3120],
    ['universidad', 'Av. Universidad', 'Anáhuac', 'San Nicolás de los Garza', 25.7270, -100.3110],
    ['revolucion', 'Av. Revolución', 'Contry', 'Monterrey', 25.6400, -100.2780],
    ['fundidora', 'Av. Fundidora', 'Obrera', 'Monterrey', 25.6780, -100.2840],
    ['moronesPrieto', 'Av. Ignacio Morones Prieto', 'Santa María', 'Monterrey', 25.6640, -100.3400],
    ['gomezMorin', 'Av. Gómez Morín', 'Valle del Campestre', 'San Pedro Garza García', 25.6520, -100.3540],
    ['ruizCortines', 'Av. Ruiz Cortines', 'Moderna', 'Monterrey', 25.6990, -100.2950],
    ['alfonsoReyes', 'Av. Alfonso Reyes', 'Las Puentes', 'San Nicolás de los Garza', 25.7200, -100.3010]
  ]
};

export const CALLES = Object.fromEntries(
  Object.entries(CALLES_CRUDAS).map(([plaza, lista]) => [
    plaza,
    lista.map(([id, calle, colonia, ciudad, lat, lng]) => ({ id, calle, colonia, ciudad, lat, lng }))
  ])
);

// Inmuebles indoor por plaza: [id, nombre, categoría (código), dirección, lat, lng].
const INMUEBLES_CRUDOS = {
  CDMX: [
    ['aicm', 'AICM Terminal 1', 'AER', 'Av. Capitán Carlos León s/n, Peñón de los Baños, CDMX', 19.4361, -99.0719],
    ['antara', 'Antara Fashion Hall', 'CCO', 'Av. Ejército Nacional 843, Col. Granada, CDMX', 19.4393, -99.2023],
    ['santaFe', 'Centro Santa Fe', 'CCO', 'Av. Vasco de Quiroga 3800, Santa Fe, CDMX', 19.3618, -99.2741],
    ['perisur', 'Perisur', 'CCO', 'Periférico Sur 4690, Jardines del Pedregal, CDMX', 19.3043, -99.1900],
    ['walmartTlalpan', 'Walmart Tlalpan', 'AUT', 'Calz. de Tlalpan 1924, Col. Country Club, CDMX', 19.3580, -99.1425]
  ],
  ZMG: [
    ['aeroGdl', 'Aeropuerto de Guadalajara', 'AER', 'Carretera Guadalajara – Chapala km 17.5, Tlajomulco de Zúñiga', 20.5218, -103.3112],
    ['andares', 'Plaza Andares', 'CCO', 'Blvd. Puerta de Hierro 4965, Puerta de Hierro, Zapopan', 20.7101, -103.4127],
    ['galeriasGdl', 'Galerías Guadalajara', 'CCO', 'Av. Rafael Sanzio 150, Arcos Vallarta, Zapopan', 20.6795, -103.4340],
    ['plazaDelSol', 'Plaza del Sol', 'CCO', 'Av. López Mateos Sur 2375, Cd. del Sol, Zapopan', 20.6500, -103.4020],
    ['walmartPatria', 'Walmart Patria', 'AUT', 'Av. Patria 1950, Jardines Universidad, Zapopan', 20.6930, -103.4180]
  ],
  MTY: [
    ['aeroMty', 'Aeropuerto de Monterrey', 'AER', 'Carretera Miguel Alemán km 24, Apodaca', 25.7785, -100.1069],
    ['valleOriente', 'Galerías Valle Oriente', 'CCO', 'Av. Lázaro Cárdenas 1000, Valle del Mirador, Monterrey', 25.6373, -100.3135],
    ['galeriasMty', 'Galerías Monterrey', 'CCO', 'Av. Insurgentes 2500, Vista Hermosa, Monterrey', 25.6820, -100.3530],
    ['sorianaCumbres', 'Soriana Cumbres', 'AUT', 'Av. Paseo de los Leones 3500, Cumbres, Monterrey', 25.7300, -100.3950]
  ]
};

export const INMUEBLES = Object.fromEntries(
  Object.entries(INMUEBLES_CRUDOS).map(([plaza, lista]) => [
    plaza,
    lista.map(([id, nombre, categoria, direccion, lat, lng]) => ({ id, nombre, categoria, direccion, lat, lng }))
  ])
);

export const CATEGORIAS_INDOOR = { AER: 'Aeropuerto', CCO: 'Centro comercial', AUT: 'Autoservicio' };

// Sitios fijos: código de tipo, formato, estructuras posibles (subtipo), medidas y precio en miles.
export const FORMATOS_SITIO = {
  ESP: { formato: 'Espectacular', subtipos: ['Unipolar', 'Azotea', 'Bipolar'], medidas: ['12.90 × 7.20 m', '14.60 × 7.20 m', '9.00 × 4.00 m'], precio: [120, 220] },
  CAR: { formato: 'Cartelera', subtipos: ['Cartelera de piso', 'Cartelera en azotea'], medidas: ['9.00 × 3.00 m', '7.20 × 3.60 m'], precio: [55, 85] },
  MUR: { formato: 'Muro', subtipos: ['Muro lateral'], medidas: ['15.00 × 8.00 m', '10.00 × 6.00 m'], precio: [70, 100] },
  PAN: { formato: 'Pantalla digital', subtipos: ['Unipolar digital', 'Azotea digital'], medidas: ['6.00 × 3.00 m', '4.00 × 3.00 m', '6.00 × 4.00 m'], precio: [100, 160] },
  PTP: { formato: 'Puente peatonal', subtipos: ['Puente peatonal'], medidas: ['20.00 × 2.00 m', '18.00 × 1.50 m'], precio: [40, 60] },
  PAR: { formato: 'Parabús', subtipos: ['Parabús'], medidas: ['1.20 × 1.80 m'], precio: [18, 30] }
};
export const CODIGOS_SITIO = Object.keys(FORMATOS_SITIO);

// Espacios indoor: formato, categorías donde existe y precio en miles.
export const FORMATOS_INDOOR = {
  'Pantalla de bienvenida': { categorias: ['AER'], precio: [80, 110] },
  'Banda de equipaje': { categorias: ['AER'], precio: [45, 65] },
  'Tótem': { categorias: ['CCO', 'AUT'], precio: [22, 35] },
  'Columna': { categorias: ['AER', 'CCO', 'AUT'], precio: [18, 28] },
  'Piso': { categorias: ['AER', 'CCO', 'AUT'], precio: [15, 24] },
  'Backlight': { categorias: ['AER', 'CCO', 'AUT'], precio: [24, 40] },
  'Escalera eléctrica': { categorias: ['CCO'], precio: [30, 45] }
};
export const MEDIDAS_INDOOR = ['1.20 × 1.80 m', '2.00 × 2.00 m', '3.00 × 2.40 m'];
export const ZONAS_INDOOR = {
  AER: { niveles: ['Planta baja', 'Nivel 1'], areas: ['Llegadas nacionales', 'Llegadas internacionales', 'Salas de última espera', 'Reclamo de equipaje', 'Documentación'] },
  CCO: { niveles: ['Planta baja', 'Nivel 1', 'Nivel 2'], areas: ['Acceso principal', 'Zona de comida', 'Pasillo central', 'Estacionamiento', 'Área de cines'] },
  AUT: { niveles: ['Planta baja'], areas: ['Acceso principal', 'Cajas', 'Pasillo de abarrotes', 'Estacionamiento'] }
};

// Camiones: formatos (precio en miles) y tipos de ruta.
export const FORMATOS_CAMION = {
  'Integral': { exhibicion: 'Cuerpo completo', precio: [32, 40] },
  'Semi-integral': { exhibicion: 'Medio cuerpo', precio: [22, 28] },
  'Medallón': { exhibicion: 'Medallón lateral', precio: [14, 18] },
  'Medio medallón': { exhibicion: 'Medio medallón lateral', precio: [9, 12] }
};
export const TIPOS_RUTA = ['Urbana', 'Hotelera', 'AAA', 'AA', 'A'];
export const ANUNCIOS_CAMION = ['Vinil impreso', 'Vinil microperforado'];

// Recorridos por plaza: [origen, destino].
export const RECORRIDOS = {
  CDMX: [
    ['Indios Verdes', 'Centro Histórico'], ['Tasqueña', 'Centro Histórico'], ['Observatorio', 'Pantitlán'],
    ['Santa Fe', 'Chapultepec'], ['Ciudad Universitaria', 'Polanco'], ['El Rosario', 'Tacubaya'],
    ['Iztapalapa', 'Metro Chabacano'], ['Cuatro Caminos', 'Paseo de la Reforma']
  ],
  ZMG: [
    ['Centro', 'Tlaquepaque'], ['Zapopan Centro', 'Plaza del Sol'], ['Tonalá', 'La Minerva'],
    ['Tlajomulco', 'Centro'], ['Av. Vallarta', 'Centro'], ['Huentitán', 'Plaza del Sol'], ['El Salto', 'Centro']
  ],
  MTY: [
    ['San Nicolás', 'Centro'], ['Guadalupe', 'San Pedro'], ['Apodaca', 'Centro'], ['Escobedo', 'Parque Fundidora'],
    ['Santa Catarina', 'Valle Oriente'], ['Cumbres', 'Centro'], ['Juárez', 'Macroplaza'], ['Ciudad Universitaria', 'Contry']
  ]
};
export const CENTRO_PLAZA = {
  CDMX: { lat: 19.4326, lng: -99.1332 },
  ZMG: { lat: 20.6597, lng: -103.3496 },
  MTY: { lat: 25.6866, lng: -100.3161 }
};

// Vallas móviles: formato, medida y precio (MXN por unidad, del periodo).
export const FORMATOS_VALLA = {
  'Valla en camioneta': { medida: '3.00 × 1.50 m', descripcion: '2 caras', precio: 38000 },
  'Valla en camión 3.5 t': { medida: '5.00 × 2.40 m', descripcion: '3 caras', precio: 62000 },
  'Valla en tráiler': { medida: '12.00 × 2.80 m', descripcion: '2 caras', precio: 95000 },
  'Valla LED móvil': { medida: '4.00 × 2.00 m', descripcion: 'Pantalla digital', precio: 120000 }
};

// Brand riders: seis formatos (MXN mensual por unidad).
export const FORMATOS_RIDER = {
  'Mass Awareness 360': { familia: 'Mass Awareness', descripcion: 'Cobertura total de la unidad', precio: 54000 },
  'Mass Awareness 180': { familia: 'Mass Awareness', descripcion: 'Media cobertura de la unidad', precio: 34000 },
  'Blitz 360': { familia: 'Blitz', descripcion: 'Activación corta, cobertura total', precio: 42000 },
  'Blitz 180': { familia: 'Blitz', descripcion: 'Activación corta, media cobertura', precio: 27000 },
  'Blitz Premium 180': { familia: 'Blitz Premium', descripcion: 'Unidades premium, media cobertura', precio: 48000 },
  'Blitz Premium 360': { familia: 'Blitz Premium', descripcion: 'Unidades premium, cobertura total', precio: 74000 }
};

// Plantillas de reporte que el cliente puede elegir (catálogo fijo).
export const PLANTILLAS_REPORTE = [
  { id: 'default', nombre: 'Plantilla Default', cargada: '2025-10-12' },
  { id: 'corporativa', nombre: 'Plantilla Corporativa v.1', cargada: '2025-10-12' },
  { id: 'brand', nombre: 'Plantilla Brand', cargada: '2025-10-12' }
];

// Textos de la cotización (iguales para todas las campañas).
export const TEXTOS_COTIZACION = {
  incluye: [
    'Impresión e instalación de lonas y viniles en todos los medios.',
    'Reporte fotográfico de instalación por medio.',
    'Testigos fotográficos durante la vigencia de la campaña.',
    'Supervisión de rutas de camiones y vallas móviles.'
  ],
  condicionesPago: '50% anticipo y 50% contra instalación.',
  aclaraciones: 'Precios en MXN, sujetos a disponibilidad. Vigencia de la cotización: 15 días.'
};

// Carpeta de Google Drive donde viven los artes de las campañas (simulación: la misma carpeta real para todas).
export const URL_DRIVE_ARTES = 'https://drive.google.com/drive/folders/1eOOv2f95m5bVMeCm6_eZC1xxBCdDWna3?usp=sharing';

// Nombre de la carpeta de artes de una campaña en Drive.
export const nombreCarpetaDrive = (marca, codigo) => `OBP / ${marca} / ${codigo} / Artes`;

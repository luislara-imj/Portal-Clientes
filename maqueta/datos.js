// Datos de ejemplo compartidos por todas las maquetas.
// Script clásico (no módulo): las páginas se abren con file://, así que no hay fetch ni import.
window.OBP_DATA = {
  cliente: {
    nombre: "Ana López",
    empresa: "Cliente de ejemplo S.A."
  },
  contadorCampanas: 5,
  // respondidos/incluidos: medios de la propuesta; instalados: medios instalados;
  // reportes: periodos publicados. Los campos opcionales solo aparecen si aplican al estado.
  // arte: { estado: "cargado" (En instalación, Instalada, En reporte) | "pendiente", formato: medio previsto, tono: paleta 0..3 }.
  campanas: [
    {
      codigo: "JRA-0016-COCACOLA-COCACOLA_ZERO-OCT-2026",
      nombre: "Cocacola Zero",
      estado: "En instalación",
      inicio: "1 oct 2026",
      fin: "31 dic 2026",
      medios: 20,
      instalados: 8,
      nextCta: "Ver instalación",
      arte: { estado: "cargado", formato: "Espectacular 9 × 3 m", tono: 0 }
    },
    {
      codigo: "JRA-0021-ALPINA-ALPINA_LECHE-NOV-2026",
      nombre: "Alpina Leche",
      estado: "Propuesta lista",
      inicio: "1 nov 2026",
      fin: "31 dic 2026",
      medios: 50,
      respondidos: 0,
      nextCta: "Revisar propuesta",
      arte: { estado: "pendiente", formato: "Mupi 1.2 × 1.8 m", tono: 1 }
    },
    {
      codigo: "MLR-0009-BAJIO-BAJIO_OTOÑO-NOV-2026",
      nombre: "Bajío Otoño",
      estado: "En selección",
      inicio: "15 nov 2026",
      fin: "15 dic 2026",
      medios: 6,
      respondidos: 4,
      nextCta: "Continuar propuesta",
      arte: { estado: "pendiente", formato: "Valla móvil", tono: 2 }
    },
    {
      codigo: "NAV-0014-NORTEÑA-NORTEÑA_NAVIDAD-DIC-2026",
      nombre: "Norteña Navidad",
      estado: "Cotización lista",
      inicio: "1 dic 2026",
      fin: "6 ene 2027",
      medios: 18,
      respondidos: 18,
      incluidos: 12,
      nextCta: "Ver cotización",
      arte: { estado: "pendiente", formato: "Camión 1/2 cuerpo", tono: 3 }
    },
    {
      codigo: "JRA-0005-SOLARIA-SOLARIA_VERANO-JUN-2026",
      nombre: "Solaria Verano",
      estado: "En reporte",
      inicio: "1 jun 2026",
      fin: "31 ago 2026",
      medios: 31,
      instalados: 31,
      reportes: ["junio", "julio", "agosto"],
      nextCta: "Ver reportes",
      arte: { estado: "cargado", formato: "Indoor pantalla", tono: 2 }
    }
  ]
};

// Orden de los estados (docs/ARQUITECTURA_INFORMACION.md, sección 2). Sirve para saber qué fases están desbloqueadas.
window.OBP_ESTADOS = [
  "Propuesta lista",
  "En selección",
  "Selección confirmada",
  "Cotización lista",
  "Aceptada",
  "En instalación",
  "Instalada",
  "En reporte"
];

function obpCampana(codigo) {
  return window.OBP_DATA.campanas.find(function (c) { return c.codigo === codigo; }) || null;
}

// Campaña indicada en ?id de la URL, o null.
function obpCampanaDeUrl() {
  var id = new URLSearchParams(location.search).get("id");
  return id ? obpCampana(id) : null;
}

// Fecha corta "1 oct 2026" -> "2026-10-01", para ordenar.
function obpFechaOrden(texto) {
  var meses = { ene: "01", feb: "02", mar: "03", abr: "04", may: "05", jun: "06", jul: "07", ago: "08", sep: "09", oct: "10", nov: "11", dic: "12" };
  var p = texto.split(" ");
  return p[2] + "-" + meses[p[1]] + "-" + ("0" + p[0]).slice(-2);
}

// Pinta lo común a todas las páginas con sesión: usuario del encabezado y contador de la barra lateral.
function obpPintarComun() {
  var d = window.OBP_DATA;
  var iniciales = d.cliente.nombre.split(" ").map(function (s) { return s.charAt(0); }).join("").slice(0, 2).toUpperCase();
  document.querySelectorAll(".user-name").forEach(function (el) { el.textContent = d.cliente.nombre; });
  document.querySelectorAll(".user-company").forEach(function (el) { el.textContent = d.cliente.empresa; });
  document.querySelectorAll(".avatar").forEach(function (el) { el.textContent = iniciales; });
  document.querySelectorAll(".nav .count").forEach(function (el) { el.textContent = d.contadorCampanas; });
}

// ---------------------------------------------------------------------------
// Reportes por campaña (reportes.html y reporte.html).
// window.OBP_REPORTES[codigo] = {
//   kpis: { impactos, alcance, testigos: { entregados, total } },
//   reportes: [{ periodo (igual que en campana.reportes), nombre, tipo: "inicial" | "final" | "mensual",
//                inicio, fin, publicacion: "AAAA-MM-DD", avance: 0..100,
//                sitios: [...], camiones: [...], indoor: [...] }]   // cada medio con fotos: [{ pie }] x3
// }
// Un reporte se considera publicado cuando su periodo está en OBP_ESTADO.obtenerCampana(codigo).reportes
// y la campaña está en "Instalada" o "En reporte". Las fotos son marcadores de posición (sin imágenes).
// Todo este bloque son datos de muestra: claves, direcciones, coordenadas, placas e indicadores inventados.
window.OBP_REPORTES = (function () {
  // --- datos de muestra ---
  var CAMPANA = "Solaria Verano";

  function fotos(pies) {
    return pies.map(function (p) { return { pie: p }; });
  }
  var VISTAS = ["Vista corta", "Vista media", "Vista larga"];
  var LADOS = ["Posterior", "Lateral derecho", "Lateral izquierdo"];

  // Claves con el mismo formato que OBP_INSTALACION (IMJ-PLAZA-TIPO-O-NNNNA).
  var sitios = [
    { clave: "IMJ-CDMX-ESP-O-0601A", plaza: "CDMX", campana: CAMPANA, tipoAnuncio: "Espectacular", tipoMedio: "Unipolar",
      medidas: "12.90 × 7.20 m", iluminacion: "Sí, LED", ubicacion: "Av. Insurgentes Norte 1137, Col. Lindavista, CDMX",
      coordenadas: "19.4891, -99.1323" },
    { clave: "IMJ-ZMG-ESP-O-0609A", plaza: "ZMG", campana: CAMPANA, tipoAnuncio: "Espectacular", tipoMedio: "Azotea",
      medidas: "10.00 × 5.00 m", iluminacion: "Sí, reflectores", ubicacion: "Av. Mariano Otero 3433, Col. Verde Valle, Guadalajara",
      coordenadas: "20.6510, -103.4021" },
    { clave: "IMJ-MTY-ESP-O-0615A", plaza: "MTY", campana: CAMPANA, tipoAnuncio: "Espectacular", tipoMedio: "Unipolar",
      medidas: "12.90 × 7.20 m", iluminacion: "No", ubicacion: "Av. Eugenio Garza Sada 2655, Col. Roma, Monterrey",
      coordenadas: "25.6489, -100.2896" }
  ];
  var camiones = [
    { clave: "IMJ-CDMX-CAM-O-0619A", plaza: "CDMX", campana: CAMPANA, tipoExhibicion: "Camión medio cuerpo",
      version: "Verano A", recorrido: "Lunes a sábado, 6:00 a 22:00", ruta: "Metrobús L1 Indios Verdes – El Caminero",
      placas: "000-AA-01", eco: "1182" },
    { clave: "IMJ-MTY-CAM-O-0622A", plaza: "MTY", campana: CAMPANA, tipoExhibicion: "Camión cuerpo completo",
      version: "Verano B", recorrido: "Lunes a domingo, 5:30 a 23:00", ruta: "Ruta 17 San Nicolás – Centro",
      placas: "000-BB-02", eco: "1207" }
  ];
  var indoor = [
    { clave: "IMJ-CDMX-IND-O-0625A", tipoMedio: "Pantalla digital", indoorPadre: "Plaza comercial Coyoacán",
      ubicacion: "Av. Universidad 1025, Coyoacán, CDMX", nivelZona: "Nivel 1, zona de comida",
      medidas: "1.20 × 2.10 m", coordenadas: "19.3456, -99.1627" },
    { clave: "IMJ-ZMG-IND-O-0628A", tipoMedio: "Mupi", indoorPadre: "Plaza comercial Zapopan",
      ubicacion: "Blvd. Puerta de Hierro 4965, Zapopan", nivelZona: "Planta baja, acceso principal",
      medidas: "1.20 × 1.80 m", coordenadas: "20.7101, -103.4127" }
  ];

  function conFotos(lista, pies) {
    return lista.map(function (m) {
      var copia = {};
      for (var k in m) if (Object.prototype.hasOwnProperty.call(m, k)) copia[k] = m[k];
      copia.fotos = fotos(pies);
      return copia;
    });
  }
  function periodo(clave, nombre, inicio, fin, publicacion) {
    return {
      periodo: clave, nombre: nombre, tipo: "mensual", inicio: inicio, fin: fin, publicacion: publicacion, avance: 100,
      sitios: conFotos(sitios, VISTAS), camiones: conFotos(camiones, LADOS), indoor: conFotos(indoor, VISTAS)
    };
  }

  return {
    "JRA-0005-SOLARIA-SOLARIA_VERANO-JUN-2026": {
      kpis: { impactos: 4860000, alcance: 1180000, testigos: { entregados: 31, total: 31 } },
      reportes: [
        periodo("junio", "Reporte de junio", "1 jun 2026", "30 jun 2026", "2026-07-05"),
        periodo("julio", "Reporte de julio", "1 jul 2026", "31 jul 2026", "2026-08-05"),
        periodo("agosto", "Reporte de agosto", "1 ago 2026", "31 ago 2026", "2026-09-05")
      ]
    }
  };
  // --- fin de datos de muestra ---
})();

// ---------------------------------------------------------------------------
// Instalación (fase 2 · Ejecución). Lo usa instalacion.html.
// window.OBP_INSTALACION[codigo] = lista de sitios:
//   { id, tipo: "Sitios fijos" | "Camiones" | "Indoor", plaza: "CDMX" | "ZMG" | "MTY",
//     subtipo, clave, direccion, inicio: "AAAA-MM-DD", fin: "AAAA-MM-DD",
//     estatus: "Por instalar" | "En instalación" | "Instalado" | "Con incidencia", diasEstimados }
// Si el estado compartido (estado.js) trae campanas[].sitios, la página usa esa lista en lugar de esta.
// Campañas sin clave (MLR-0009, NAV-0014) no tienen fase de instalación todavía.
// ---------------------------------------------------------------------------
window.OBP_INSTALACION = (function () {
  function sitio(id, tipo, plaza, subtipo, clave, direccion, inicio, fin, estatus, dias) {
    return { id: id, tipo: tipo, plaza: plaza, subtipo: subtipo, clave: clave, direccion: direccion,
      inicio: inicio, fin: fin, estatus: estatus, diasEstimados: dias };
  }

  // datos de muestra: 20 sitios (8 Instalado, 4 En instalación, 8 Por instalar).
  var cocacola = [
    sitio("cc-01", "Sitios fijos", "CDMX", "Espectaculares", "IMJ-CDMX-ESP-O-0101A", "Av. Insurgentes Sur 1235, Col. Del Valle, CDMX", "2026-10-05", "2026-10-13", "Instalado", 7),
    sitio("cc-02", "Sitios fijos", "CDMX", "Espectaculares", "IMJ-CDMX-ESP-O-0102A", "Periférico Sur 4020, Jardines del Pedregal, CDMX", "2026-10-05", "2026-10-13", "Instalado", 7),
    sitio("cc-03", "Sitios fijos", "CDMX", "Pantallas", "IMJ-CDMX-PAN-O-0103A", "Av. Paseo de la Reforma 222, Col. Juárez, CDMX", "2026-10-19", "2026-10-27", "En instalación", 7),
    sitio("cc-04", "Sitios fijos", "CDMX", "Pantallas", "IMJ-CDMX-PAN-O-0104A", "Calz. de Tlalpan 1880, Col. Country Club, CDMX", "2026-11-02", "2026-11-10", "Por instalar", 7),
    sitio("cc-05", "Sitios fijos", "ZMG", "Espectaculares", "IMJ-ZMG-ESP-O-0201A", "Av. Vallarta 3233, Vallarta Poniente, Guadalajara", "2026-10-05", "2026-10-13", "Instalado", 7),
    sitio("cc-06", "Sitios fijos", "ZMG", "Espectaculares", "IMJ-ZMG-ESP-O-0202A", "Av. López Mateos Sur 2375, Cd. del Sol, Zapopan", "2026-10-05", "2026-10-13", "Instalado", 7),
    sitio("cc-07", "Sitios fijos", "ZMG", "Espectaculares", "IMJ-ZMG-ESP-O-0203A", "Av. Lázaro Cárdenas 2305, Las Torres, Guadalajara", "2026-10-19", "2026-10-27", "En instalación", 7),
    sitio("cc-08", "Sitios fijos", "ZMG", "Pantallas", "IMJ-ZMG-PAN-O-0204A", "Av. Patria 1150, Jacarandas, Zapopan", "2026-11-02", "2026-11-10", "Por instalar", 7),
    sitio("cc-09", "Sitios fijos", "ZMG", "Pantallas", "IMJ-ZMG-PAN-O-0205A", "Av. de las Américas 1500, Country Club, Guadalajara", "2026-11-02", "2026-11-10", "Por instalar", 7),
    sitio("cc-10", "Sitios fijos", "MTY", "Espectaculares", "IMJ-MTY-ESP-O-0301A", "Av. Constitución 2050, Centro, Monterrey", "2026-10-05", "2026-10-13", "Instalado", 7),
    sitio("cc-11", "Sitios fijos", "MTY", "Espectaculares", "IMJ-MTY-ESP-O-0302A", "Av. Gonzalitos 520, Mitras Centro, Monterrey", "2026-10-19", "2026-10-27", "En instalación", 7),
    sitio("cc-12", "Sitios fijos", "MTY", "Pantallas", "IMJ-MTY-PAN-O-0303A", "Av. José Vasconcelos 150, Del Valle, San Pedro Garza García", "2026-11-02", "2026-11-10", "Por instalar", 7),
    sitio("cc-13", "Camiones", "ZMG", "Camiones medio cuerpo", "IMJ-ZMG-CAM-O-0401A", "Ruta 629: Av. Vallarta – Centro, Guadalajara", "2026-10-05", "2026-10-15", "Instalado", 9),
    sitio("cc-14", "Camiones", "ZMG", "Camiones medio cuerpo", "IMJ-ZMG-CAM-O-0402A", "Ruta 380: Tlaquepaque – Zapopan", "2026-10-19", "2026-10-29", "En instalación", 9),
    sitio("cc-15", "Camiones", "ZMG", "Camiones cuerpo completo", "IMJ-ZMG-CAM-O-0403A", "Ruta 24: Av. Revolución – Tonalá", "2026-11-02", "2026-11-12", "Por instalar", 9),
    sitio("cc-16", "Camiones", "MTY", "Camiones cuerpo completo", "IMJ-MTY-CAM-O-0404A", "Ruta 1: Av. Universidad – Centro, Monterrey", "2026-10-05", "2026-10-15", "Instalado", 9),
    sitio("cc-17", "Camiones", "MTY", "Camiones medio cuerpo", "IMJ-MTY-CAM-O-0405A", "Ruta 214: San Nicolás – Centro, Monterrey", "2026-11-02", "2026-11-12", "Por instalar", 9),
    sitio("cc-18", "Indoor", "CDMX", "Centros comerciales", "IMJ-CDMX-IND-O-0501A", "Av. Vasco de Quiroga 3800, Santa Fe, CDMX", "2026-10-05", "2026-10-13", "Instalado", 7),
    sitio("cc-19", "Indoor", "CDMX", "Centros comerciales", "IMJ-CDMX-IND-O-0502A", "Av. Ejército Nacional 843, Granada, CDMX", "2026-11-02", "2026-11-10", "Por instalar", 7),
    sitio("cc-20", "Indoor", "ZMG", "Centros comerciales", "IMJ-ZMG-IND-O-0503A", "Blvd. Puerta de Hierro 4965, Zapopan", "2026-11-02", "2026-11-10", "Por instalar", 7)
  ];

  // datos de muestra: 31 sitios, todos instalados (campaña en reporte).
  // [tipo, plaza, subtipo, código de subtipo, cuántos, calle base]
  var solariaBase = [
    ["Sitios fijos", "CDMX", "Espectaculares", "ESP", 5, "Av. Insurgentes Norte, CDMX"],
    ["Sitios fijos", "CDMX", "Pantallas", "PAN", 3, "Av. Río Churubusco, CDMX"],
    ["Sitios fijos", "ZMG", "Espectaculares", "ESP", 4, "Av. Mariano Otero, Guadalajara"],
    ["Sitios fijos", "ZMG", "Pantallas", "PAN", 2, "Av. Acueducto, Zapopan"],
    ["Sitios fijos", "MTY", "Espectaculares", "ESP", 4, "Av. Eugenio Garza Sada, Monterrey"],
    ["Camiones", "CDMX", "Camiones medio cuerpo", "CAM", 3, "Ruta Metrobús L1, CDMX"],
    ["Camiones", "MTY", "Camiones cuerpo completo", "CAM", 3, "Ruta 17, Monterrey"],
    ["Indoor", "CDMX", "Centros comerciales", "IND", 3, "Plaza comercial, Coyoacán, CDMX"],
    ["Indoor", "ZMG", "Centros comerciales", "IND", 2, "Plaza comercial, Zapopan"],
    ["Indoor", "MTY", "Centros comerciales", "IND", 2, "Plaza comercial, San Pedro Garza García"]
  ];
  var solaria = [];
  var n = 0;
  solariaBase.forEach(function (b) {
    for (var i = 0; i < b[4]; i++) {
      n++;
      var num = ("000" + (600 + n)).slice(-4);
      solaria.push(sitio("so-" + ("0" + n).slice(-2), b[0], b[1], b[2],
        "IMJ-" + b[1] + "-" + b[3] + "-O-" + num + "A",
        b[5] + " " + (100 + n * 37), "2026-05-18", "2026-05-26", "Instalado", 7));
    }
  });

  return {
    "JRA-0016-COCACOLA-COCACOLA_ZERO-OCT-2026": cocacola,
    "JRA-0005-SOLARIA-SOLARIA_VERANO-JUN-2026": solaria,
    // Bloqueada hasta aceptar la cotización; se llena con los medios incluidos.
    "JRA-0021-ALPINA-ALPINA_LECHE-NOV-2026": []
  };
})();

// ---------------------------------------------------------------------------
// Cotización (fase 1 · Cotización). Lo usan cotizacion.html y mis-campanas.html.
// La cotización de Alpina (JRA-0021) vive en la app React (maqueta/cotizacion-react, `npm run dev`).
// ---------------------------------------------------------------------------
window.COTIZACION_REACT_URL = 'http://localhost:5173/';

// window.OBP_COTIZACIONES[codigo] = {
//   folio, cliente, vigencia, descuentoPct, ivaPct,
//   tipos: [{ tipo, lineas: [{ ciudad, formato, detalle, clave, unidades, tiempo, inicio, fin,
//                               precioUnitario, precioDescuento, total }],
//             subtotalLista, subtotal }],
//   subtotal, descuento, subtotalConDescuento, iva, total, incluye: [...], condicionesPago
// }
// Montos en MXN (enteros). precioDescuento = precioUnitario con 10% menos; total de línea = unidades × precioDescuento.
// subtotal del tipo = suma de sus líneas (con descuento); subtotalLista = lo mismo a precio unitario.
// Cierre: subtotal (a precio unitario) − descuento = subtotalConDescuento; IVA 16% sobre ese monto; total = subtotalConDescuento + IVA.
// Solo campañas en "Cotización lista" o después, excepto Alpina (app React).
window.OBP_COTIZACIONES = (function () {
  // --- datos de muestra: medios, claves, precios y textos inventados ---
  var DESCUENTO = 10; // %
  var IVA = 16; // %

  function linea(ciudad, formato, detalle, clave, unidades, tiempo, inicio, fin, precioUnitario) {
    var precioDescuento = Math.round(precioUnitario * (100 - DESCUENTO) / 100);
    return { ciudad: ciudad, formato: formato, detalle: detalle, clave: clave, unidades: unidades, tiempo: tiempo,
      inicio: inicio, fin: fin, precioUnitario: precioUnitario, precioDescuento: precioDescuento,
      total: unidades * precioDescuento };
  }
  function tipo(nombre, lineas) {
    var lista = 0, subtotal = 0;
    lineas.forEach(function (l) { lista += l.unidades * l.precioUnitario; subtotal += l.total; });
    return { tipo: nombre, lineas: lineas, subtotalLista: lista, subtotal: subtotal };
  }
  function cotizacion(datos, tipos) {
    var subtotal = 0, conDescuento = 0;
    tipos.forEach(function (t) { subtotal += t.subtotalLista; conDescuento += t.subtotal; });
    var iva = Math.round(conDescuento * IVA / 100);
    datos.descuentoPct = DESCUENTO;
    datos.ivaPct = IVA;
    datos.tipos = tipos;
    datos.subtotal = subtotal;
    datos.descuento = subtotal - conDescuento;
    datos.subtotalConDescuento = conDescuento;
    datos.iva = iva;
    datos.total = conDescuento + iva;
    return datos;
  }

  // datos de muestra: Norteña Navidad, 12 medios incluidos (de 18 respondidos).
  var nortena = cotizacion({
    folio: "NAV-0014-NORTEÑA-NORTEÑA_NAVIDAD-DIC-2026",
    cliente: "Ana López · Cliente de ejemplo S.A.",
    vigencia: "1 dic 2026 – 6 ene 2027",
    incluye: [
      "Impresión e instalación de lonas y viniles en todos los medios.",
      "Reporte fotográfico de instalación por medio.",
      "Testigos fotográficos durante la vigencia de la campaña.",
      "Supervisión de rutas de camiones y vallas móviles."
    ],
    condicionesPago: "50% anticipo y 50% contra instalación."
  }, [
    tipo("Sitios fijos", [
      linea("Guadalajara", "Espectacular", "Unipolar 12.90 × 7.20 m · Av. Vallarta 3233", "IMJ-ZMG-ESP-O-0701A", 1, "37 días", "1 dic 2026", "6 ene 2027", 185000),
      linea("Guadalajara", "Pantalla digital", "Spot de 10 s cada 60 s · Av. López Mateos Sur 2375", "IMJ-ZMG-PAN-O-0702A", 1, "37 días", "1 dic 2026", "6 ene 2027", 142000),
      linea("Monterrey", "Espectacular", "Azotea 10.00 × 5.00 m · Av. Constitución 2050", "IMJ-MTY-ESP-O-0703A", 1, "37 días", "1 dic 2026", "6 ene 2027", 168000),
      linea("CDMX", "Espectacular", "Unipolar 12.90 × 7.20 m · Periférico Sur 4020", "IMJ-CDMX-ESP-O-0704A", 1, "37 días", "1 dic 2026", "6 ene 2027", 210000)
    ]),
    tipo("Indoors", [
      linea("CDMX", "Pantalla digital", "Plaza comercial Santa Fe · Nivel 2, zona de comida", "IMJ-CDMX-IND-O-0705A", 2, "37 días", "1 dic 2026", "6 ene 2027", 48000),
      linea("Monterrey", "Mupi 1.20 × 1.80 m", "Plaza comercial San Pedro · Planta baja", "IMJ-MTY-IND-O-0706A", 3, "37 días", "1 dic 2026", "6 ene 2027", 22000)
    ]),
    tipo("Camiones", [
      linea("Guadalajara", "Camión medio cuerpo", "Ruta 629: Av. Vallarta – Centro", "IMJ-ZMG-CAM-O-0707A", 4, "1 mes", "1 dic 2026", "31 dic 2026", 18500),
      linea("Monterrey", "Camión cuerpo completo", "Ruta 1: Av. Universidad – Centro", "IMJ-MTY-CAM-O-0708A", 3, "1 mes", "1 dic 2026", "31 dic 2026", 32000),
      linea("CDMX", "Camión medio cuerpo", "Ruta 2A: Tasqueña – Centro", "IMJ-CDMX-CAM-O-0709A", 5, "1 mes", "1 dic 2026", "31 dic 2026", 19000)
    ]),
    tipo("Vallas móviles", [
      linea("Monterrey", "Valla móvil doble cara", "Recorrido Valle Oriente · 8 h por día", "IMJ-MTY-VAL-O-0710A", 1, "15 días", "1 dic 2026", "15 dic 2026", 54000),
      linea("CDMX", "Valla móvil doble cara", "Recorrido Polanco – Reforma · 8 h por día", "IMJ-CDMX-VAL-O-0711A", 2, "15 días", "1 dic 2026", "15 dic 2026", 58000)
    ]),
    tipo("Brand riders", [
      linea("Guadalajara", "Brand rider", "Recorrido Av. Chapultepec · 4 riders, 6 h por día", "IMJ-ZMG-BRD-O-0712A", 1, "10 días", "12 dic 2026", "21 dic 2026", 38000)
    ])
  ]);

  // datos de muestra: Cocacola Zero (En instalación), 8 líneas.
  var cocacolaCot = cotizacion({
    folio: "JRA-0016-COCACOLA-COCACOLA_ZERO-OCT-2026",
    cliente: "Ana López · Cliente de ejemplo S.A.",
    vigencia: "1 oct 2026 – 31 dic 2026",
    incluye: [
      "Impresión e instalación de lonas y viniles en todos los medios.",
      "Reporte fotográfico de instalación por medio.",
      "Testigos fotográficos durante la vigencia de la campaña.",
      "Supervisión de rutas de camiones y vallas móviles."
    ],
    condicionesPago: "50% anticipo y 50% contra instalación."
  }, [
    tipo("Sitios fijos", [
      linea("CDMX", "Espectacular", "Unipolar 12.90 × 7.20 m · Av. Insurgentes Sur 1235", "IMJ-CDMX-ESP-O-0801A", 2, "3 meses", "1 oct 2026", "31 dic 2026", 115000),
      linea("Guadalajara", "Cartelera", "Cartelera 9.00 × 3.00 m · Av. Lázaro Cárdenas 2305", "IMJ-ZMG-CAR-O-0802A", 1, "3 meses", "1 oct 2026", "31 dic 2026", 64000)
    ]),
    tipo("Indoors", [
      linea("CDMX", "Pantalla de bienvenida", "Aeropuerto CDMX · Terminal 1, llegadas nacionales", "IMJ-CDMX-AER-I-0803NA", 1, "3 meses", "1 oct 2026", "31 dic 2026", 98000),
      linea("Monterrey", "Tótem", "Centro comercial San Pedro · Planta baja", "IMJ-MTY-CCO-I-0804NA", 2, "3 meses", "1 oct 2026", "31 dic 2026", 27500)
    ]),
    tipo("Camiones", [
      linea("Guadalajara", "Camión medio cuerpo", "Ruta 380: Tlaquepaque – Zapopan", "IMJ-ZMG-CAM-O-0805A", 2, "1 mes", "1 oct 2026", "31 oct 2026", 21500),
      linea("Monterrey", "Camión cuerpo completo", "Ruta 214: San Nicolás – Centro", "IMJ-MTY-CAM-O-0806A", 1, "1 mes", "1 oct 2026", "31 oct 2026", 36000)
    ]),
    tipo("Vallas móviles", [
      linea("CDMX", "Valla móvil doble cara", "Recorrido Insurgentes – Reforma · 8 h por día", "IMJ-CDMX-VAL-O-0807A", 2, "15 días", "1 oct 2026", "15 oct 2026", 52000)
    ]),
    tipo("Brand riders", [
      linea("Monterrey", "Brand rider", "Recorrido Barrio Antiguo · 4 riders, 6 h por día", "IMJ-MTY-BRD-O-0808A", 3, "10 días", "3 oct 2026", "12 oct 2026", 34000)
    ])
  ]);

  // datos de muestra: Solaria Verano (En reporte), 8 líneas.
  var solariaCot = cotizacion({
    folio: "JRA-0005-SOLARIA-SOLARIA_VERANO-JUN-2026",
    cliente: "Ana López · Cliente de ejemplo S.A.",
    vigencia: "1 jun 2026 – 31 ago 2026",
    incluye: [
      "Impresión e instalación de lonas y viniles en todos los medios.",
      "Reporte fotográfico de instalación por medio.",
      "Testigos fotográficos durante la vigencia de la campaña.",
      "Supervisión de rutas de camiones y vallas móviles."
    ],
    condicionesPago: "50% anticipo y 50% contra instalación."
  }, [
    tipo("Sitios fijos", [
      linea("Monterrey", "Muro", "Muro 15.00 × 8.00 m · Av. Eugenio Garza Sada 2655", "IMJ-MTY-MUR-O-0901A", 1, "3 meses", "1 jun 2026", "31 ago 2026", 88000),
      linea("CDMX", "Puente peatonal", "Puente 20.00 × 2.00 m · Calz. de Tlalpan 1880", "IMJ-CDMX-PTP-O-0902A", 2, "3 meses", "1 jun 2026", "31 ago 2026", 46000)
    ]),
    tipo("Indoors", [
      linea("Guadalajara", "Backlight", "Autoservicio Zapopan · Acceso principal", "IMJ-ZMG-AUT-I-0903NA", 3, "3 meses", "1 jun 2026", "31 ago 2026", 24000)
    ]),
    tipo("Camiones", [
      linea("CDMX", "Camión medio cuerpo", "Ruta Metrobús L1: Indios Verdes – El Caminero", "IMJ-CDMX-CAM-O-0904A", 2, "1 mes", "1 jun 2026", "30 jun 2026", 22500),
      linea("Monterrey", "Camión cuerpo completo", "Ruta 17: San Nicolás – Centro", "IMJ-MTY-CAM-O-0905A", 1, "1 mes", "1 jun 2026", "30 jun 2026", 39000)
    ]),
    tipo("Vallas móviles", [
      linea("Guadalajara", "Valla LED móvil", "Recorrido Av. Chapultepec – Providencia · 8 h por día", "IMJ-ZMG-VAL-O-0906A", 1, "15 días", "1 jun 2026", "15 jun 2026", 112000),
      linea("CDMX", "Valla móvil doble cara", "Recorrido Coyoacán – Universidad · 8 h por día", "IMJ-CDMX-VAL-O-0907A", 1, "15 días", "1 jun 2026", "15 jun 2026", 56000)
    ]),
    tipo("Brand riders", [
      linea("CDMX", "Brand rider", "Recorrido Condesa – Roma · 4 riders, 6 h por día", "IMJ-CDMX-BRD-O-0908A", 2, "10 días", "6 jun 2026", "15 jun 2026", 36500)
    ])
  ]);

  return {
    "NAV-0014-NORTEÑA-NORTEÑA_NAVIDAD-DIC-2026": nortena,
    "JRA-0016-COCACOLA-COCACOLA_ZERO-OCT-2026": cocacolaCot,
    "JRA-0005-SOLARIA-SOLARIA_VERANO-JUN-2026": solariaCot
  };
  // --- fin de datos de muestra ---
})();

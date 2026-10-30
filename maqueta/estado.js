// Estado compartido del prototipo (script clásico; va después de datos.js).
// - Modos: MAQUETA (por defecto) muestra datos fijos y no guarda nada; DEMO guarda las acciones del flujo.
//   ?modo=demo activa demo y ?modo=maqueta lo quita; el modo se recuerda en localStorage['obp-modo']
//   ('demo' | 'maqueta'), así los enlaces no necesitan el parámetro. OBP_ESTADO.modoDemo / setModo(valor).
// - Clave: localStorage['obp-prototipo-v1'] guarda las acciones del usuario entre páginas (solo en demo).
// - Semilla: en maqueta, o si no hay estado guardado (o está dañado), se parte de window.OBP_DATA.campanas.
//   Cada campaña: codigo, estado, respondidos, medios, instalados, reportes (lista de periodos),
//   respuestas (propuesta: id del medio o unidad -> true = Sí / false = No; ausente = sin responder).
// - Reinicio: ?reset=1 en la URL borra la clave al cargar; en modo demo aparece el enlace
//   "Restablecer datos" (#resetDatos) en el encabezado, que borra la clave y recarga sin ?reset.
//   Un refresh normal conserva el estado en demo.
// - En maqueta, guardar() y actualizarCampana() no hacen nada (ni escriben ni cambian el estado en memoria).
// - Cada guardado (en demo) emite el evento 'obp-estado-cambio' en window.
(function () {
  var CLAVE = 'obp-prototipo-v1';
  var CLAVE_MODO = 'obp-modo';

  function leerModo() {
    var param = new URLSearchParams(location.search).get('modo');
    if (param === 'demo' || param === 'maqueta') {
      try { localStorage.setItem(CLAVE_MODO, param); } catch (e) { /* sin almacenamiento */ }
      return param === 'demo';
    }
    try { return localStorage.getItem(CLAVE_MODO) === 'demo'; } catch (e) { return false; }
  }

  var modoDemo = leerModo();

  function semilla() {
    var campanas = (window.OBP_DATA && window.OBP_DATA.campanas) || [];
    return {
      campanas: campanas.map(function (c) {
        return {
          codigo: c.codigo,
          estado: c.estado,
          respondidos: typeof c.respondidos === 'number' ? c.respondidos : 0,
          medios: typeof c.medios === 'number' ? c.medios : 0,
          instalados: typeof c.instalados === 'number' ? c.instalados : 0,
          reportes: Array.isArray(c.reportes) ? c.reportes.slice() : [],
          respuestas: {}
        };
      })
    };
  }

  function quitarParam(nombre) {
    var params = new URLSearchParams(location.search);
    params.delete(nombre);
    var q = params.toString();
    return location.pathname + (q ? '?' + q : '') + location.hash;
  }

  function borrar() {
    try { localStorage.removeItem(CLAVE); } catch (e) { /* sin almacenamiento: se ignora */ }
  }

  function cargar() {
    if (new URLSearchParams(location.search).get('reset') === '1') {
      borrar();
      return semilla();
    }
    // Maqueta: siempre datos fijos de visualización (no se ven acciones previas).
    if (!modoDemo) return semilla();
    try {
      var crudo = localStorage.getItem(CLAVE);
      if (!crudo) return semilla();
      var estado = JSON.parse(crudo);
      if (!estado || !Array.isArray(estado.campanas)) return semilla();
      return estado;
    } catch (e) {
      return semilla();
    }
  }

  var actual = cargar();

  function guardar(estado) {
    if (!modoDemo) return actual; // maqueta: no se guarda nada
    if (estado) actual = estado;
    try { localStorage.setItem(CLAVE, JSON.stringify(actual)); } catch (e) { /* no rompe la página */ }
    try { window.dispatchEvent(new CustomEvent('obp-estado-cambio', { detail: actual })); } catch (e) { /* navegador antiguo */ }
    return actual;
  }

  function reiniciar() {
    borrar();
    location.replace(quitarParam('reset'));
  }

  function obtenerCampana(codigo) {
    for (var i = 0; i < actual.campanas.length; i++) {
      if (actual.campanas[i].codigo === codigo) return actual.campanas[i];
    }
    return null;
  }

  function actualizarCampana(codigo, cambios) {
    var c = obtenerCampana(codigo);
    if (!c) return null;
    if (!modoDemo) return c; // maqueta: la acción no hace nada
    for (var k in cambios) {
      if (Object.prototype.hasOwnProperty.call(cambios, k) && k !== 'codigo') c[k] = cambios[k];
    }
    guardar();
    return c;
  }

  // Cambia el modo ('demo' | 'maqueta') y lo recuerda. El estado en memoria se vuelve a cargar según el modo;
  // las páginas ya pintadas no se repintan (recargar para ver el cambio).
  function setModo(valor) {
    modoDemo = valor === 'demo';
    try { localStorage.setItem(CLAVE_MODO, modoDemo ? 'demo' : 'maqueta'); } catch (e) { /* sin almacenamiento */ }
    actual = cargar();
    return modoDemo;
  }

  window.OBP_ESTADO = {
    CLAVE: CLAVE,
    CLAVE_MODO: CLAVE_MODO,
    semilla: semilla,
    cargar: cargar,
    guardar: guardar,
    reiniciar: reiniciar,
    obtenerCampana: obtenerCampana,
    actualizarCampana: actualizarCampana,
    setModo: setModo,
    get modoDemo() { return modoDemo; },
    get estado() { return actual; }
  };

  // Enlace de reinicio (#resetDatos): solo visible en modo demo.
  function prepararReset() {
    var enlace = document.getElementById('resetDatos');
    if (!enlace) return;
    if (!modoDemo) {
      enlace.hidden = true;
      return;
    }
    enlace.hidden = false;
    enlace.addEventListener('click', function (ev) {
      ev.preventDefault();
      reiniciar();
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', prepararReset);
  } else {
    prepararReset();
  }
})();

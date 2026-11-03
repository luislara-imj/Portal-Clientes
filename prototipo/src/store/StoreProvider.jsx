import { createContext, useContext, useEffect, useMemo, useReducer, useState } from 'react';
import { CAMPANA_FLUJO, SEMILLA, campanaFija, medioFijo } from '../data/semilla.js';
import { PLANTILLAS_REPORTE } from '../data/catalogos.js';
import { reducer } from './reglas.js';
import { almacenPorDefecto, cargarEstado, guardarEstado } from './persistencia.js';
import {
  cotizacion, fasesDeCampana, indicadores, instalacion, progresoPropuesta, reportes, resumenCampana
} from './selectores.js';

const StoreContext = createContext(null);

// Mientras Alpina se instala, el reloj corre y despacha `avanzar` cada `intervaloMs`.
function relojActivo(estado) {
  const fase = estado.campanas[CAMPANA_FLUJO]?.fase;
  return fase === 'Aceptada' || fase === 'En instalación';
}

// almacen: objeto con getItem/setItem (por defecto window.localStorage; null = sin persistencia).
// reloj: función que da el instante actual en milisegundos (para pruebas).
export function StoreProvider({ children, almacen, reloj = Date.now, intervaloMs = 500 }) {
  const almacenReal = useMemo(() => (almacen === undefined ? almacenPorDefecto() : almacen), [almacen]);
  const [estado, dispatch] = useReducer(reducer, almacenReal, cargarEstado);
  const [ahora, setAhora] = useState(() => reloj());
  const enCurso = relojActivo(estado);

  // Todo cambio se guarda al momento.
  useEffect(() => { guardarEstado(estado, almacenReal); }, [estado, almacenReal]);

  // Al montar (y al recargar) se pone al día con el tiempo guardado; durante la instalación, cada tic.
  useEffect(() => {
    const tic = () => {
      const t = reloj();
      setAhora(t);
      dispatch({ type: 'avanzar', ahora: t });
    };
    tic();
    if (!enCurso) return undefined;
    const id = setInterval(tic, intervaloMs);
    return () => clearInterval(id);
  }, [enCurso, reloj, intervaloMs]);

  const valor = useMemo(() => ({
    estado,
    ahora,
    semilla: SEMILLA,
    cliente: SEMILLA.cliente,
    campanas: SEMILLA.campanas,
    campana: (codigo) => campanaFija(codigo),
    medio: (codigo, medioId) => medioFijo(codigo, medioId),
    // Acciones
    responder: (codigo, medioId, valor) => dispatch({ type: 'responder', codigo, medioId, valor }),
    responderTodos: (codigo, filtro, valor) => dispatch({ type: 'responderTodos', codigo, filtro, valor }),
    confirmarSeleccion: (codigo, t = reloj()) => dispatch({ type: 'confirmarSeleccion', codigo, ahora: t }),
    aceptarCotizacion: (codigo, t = reloj()) => dispatch({ type: 'aceptarCotizacion', codigo, ahora: t }),
    avanzar: (t = reloj()) => dispatch({ type: 'avanzar', ahora: t }),
    agregarArchivo: (codigo, archivo) => dispatch({ type: 'agregarArchivo', codigo, archivo }),
    quitarArchivo: (codigo, archivoId) => dispatch({ type: 'quitarArchivo', codigo, archivoId }),
    archivos: (codigo) => estado.campanas[codigo]?.archivos ?? [],
    elegirPlantilla: (codigo, plantillaId) => dispatch({ type: 'elegirPlantilla', codigo, plantillaId }),
    plantilla: (codigo) => PLANTILLAS_REPORTE.find((p) => p.id === estado.campanas[codigo]?.plantilla) ?? PLANTILLAS_REPORTE[0],
    reiniciar: () => dispatch({ type: 'reiniciar' }),
    // Selectores
    fasesDeCampana: (codigo) => fasesDeCampana(estado, codigo),
    progresoPropuesta: (codigo) => progresoPropuesta(estado, codigo),
    cotizacion: (codigo) => cotizacion(estado, codigo),
    instalacion: (codigo, t = ahora) => instalacion(estado, codigo, t),
    reportes: (codigo) => reportes(estado, codigo),
    resumenCampana: (codigo, t = ahora) => resumenCampana(estado, codigo, t),
    indicadores: (t = ahora) => indicadores(estado, t)
  }), [estado, ahora, reloj]);

  return <StoreContext.Provider value={valor}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const valor = useContext(StoreContext);
  if (!valor) throw new Error('useStore debe usarse dentro de <StoreProvider>.');
  return valor;
}

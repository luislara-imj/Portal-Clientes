import { AppShell } from './AppShell.jsx';
import { useCampanaDeRuta } from './EncabezadoCampana.jsx';
import { NoEncontrada } from './NoEncontrada.jsx';
import { hrefCampana } from './campanas.js';
import { CAMPANA_FLUJO } from '../data/semilla.js';
import { useStore } from '../store/index.js';

const NOMBRE_FASE = { propuesta: 'Propuesta', cotizacion: 'Cotización', instalacion: 'Instalación', reportes: 'Reportes' };

/**
 * Marco de las pantallas de una campaña (detalle y fases): AppShell con el título de la
 * pantalla y las migas Mis campañas › Campaña › Fase › (extra) como subtítulo del header.
 * fase: 'propuesta' | 'cotizacion' | 'instalacion' | 'reportes' (sin fase = detalle).
 * migasExtra: niveles después de la fase (p. ej. el periodo del visor de reportes); el último
 * es el título de la pantalla.
 * controles / acciones: nodos del header (centro / derecha antes del menú del usuario).
 * children: nodo o función (campana) => nodo; solo se llama si la campaña existe.
 */
export function PaginaCampana({ fase, migasExtra = [], controles, acciones, children }) {
  const s = useStore();
  const campana = useCampanaDeRuta();
  if (!campana) {
    return (
      <AppShell titulo="Campaña no encontrada" migas={[{ label: 'Mis campañas', href: '#/campanas' }, { label: 'No encontrada' }]}>
        <NoEncontrada />
      </AppShell>
    );
  }

  const titulo = migasExtra.at(-1)?.label ?? (fase ? NOMBRE_FASE[fase] : campana.nombre);
  const migas = [{ label: 'Mis campañas', href: '#/campanas' }];
  if (fase) {
    migas.push({ label: campana.nombre, href: hrefCampana(campana.codigo) });
    if (migasExtra.length) {
      migas.push({ label: NOMBRE_FASE[fase], href: hrefCampana(campana.codigo, fase) });
      migas.push(...migasExtra.map((m, i) => (i === migasExtra.length - 1 ? { label: m.label } : m)));
    } else {
      migas.push({ label: NOMBRE_FASE[fase] });
    }
  } else {
    migas.push({ label: campana.nombre });
  }

  // Solo consulta: fase cerrada, o campaña que no recorre el flujo del prototipo (todas menos Alpina).
  const actual = fase ? s.fasesDeCampana(campana.codigo).find((f) => f.clave === fase) : null;
  const soloConsulta =
    actual?.estado === 'consulta' || (actual?.estado === 'activa' && !actual.editable && campana.codigo !== CAMPANA_FLUJO);

  return (
    <AppShell titulo={titulo} nota={soloConsulta ? 'solo consulta' : undefined} migas={migas} controles={controles} acciones={acciones}>
      {typeof children === 'function' ? children(campana) : children}
    </AppShell>
  );
}

export default PaginaCampana;

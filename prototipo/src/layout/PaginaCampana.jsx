import { AppShell } from './AppShell.jsx';
import { useCampanaDeRuta } from './EncabezadoCampana.jsx';
import { NoEncontrada } from './NoEncontrada.jsx';
import { hrefCampana, rutaCampana } from './campanas.js';
import { hrefCarpeta } from './carpetas.js';
import { MARCAS_REALES } from './marcas.js';
import { CAMPANA_FLUJO } from '../data/semilla.js';
import { useStore } from '../store/index.js';

const NOMBRE_FASE = { propuesta: 'Propuesta', cotizacion: 'Cotización', instalacion: 'Instalación', reportes: 'Reportes' };

// Marca (carpeta) a la que pertenece una campaña, por su código.
function marcaDeCampana(codigo) {
  return MARCAS_REALES.find((m) => m.codigos?.includes(codigo)) ?? null;
}

/**
 * Marco de las pantallas de fase de una campaña: AppShell con el título de la
 * pantalla y las migas Mis campañas › Marca › Campaña › Fase › (extra) como subtítulo del header.
 * La marca enlaza a su carpeta; la campaña es texto (ya no hay pantalla de detalle).
 * fase: 'propuesta' | 'cotizacion' | 'instalacion' | 'reportes' (sin fase: solo la campaña).
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
      <AppShell titulo="Campaña no encontrada" migas={[{ label: 'Mis campañas', href: '#/campanas' }, { label: 'Campaña no encontrada' }]}>
        <NoEncontrada />
      </AppShell>
    );
  }

  const titulo = migasExtra.at(-1)?.label ?? (fase ? NOMBRE_FASE[fase] : campana.nombre);
  const migas = [{ label: 'Mis campañas', href: '#/campanas' }];
  const marca = marcaDeCampana(campana.codigo);
  if (marca) migas.push({ label: marca.nombre, href: hrefCarpeta(marca.slug) });
  if (fase) {
    migas.push({ label: campana.nombre });
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

  // Volver: desde una subpantalla, a su fase; desde una fase o la campaña, a la carpeta de la marca.
  const marcaRuta = marca ? `/campanas/carpeta/${encodeURIComponent(marca.slug)}` : '/campanas';
  const volver = migasExtra.length && fase
    ? { label: `Volver a ${NOMBRE_FASE[fase]}`, ruta: rutaCampana(campana.codigo, fase) }
    : { label: marca ? `Volver a ${marca.nombre}` : 'Volver a Mis campañas', ruta: marcaRuta };

  return (
    <AppShell titulo={titulo} nota={soloConsulta ? 'solo consulta' : undefined} migas={migas} controles={controles} acciones={acciones} volver={volver}>
      {typeof children === 'function' ? children(campana) : children}
    </AppShell>
  );
}

export default PaginaCampana;

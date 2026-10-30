import { AppShell } from './AppShell.jsx';
import { EncabezadoCampana, useCampanaDeRuta } from './EncabezadoCampana.jsx';
import { NoEncontrada } from './NoEncontrada.jsx';
import { hrefCampana } from './campanas.js';

const NOMBRE_FASE = { propuesta: 'Propuesta', cotizacion: 'Cotización', instalacion: 'Instalación', reportes: 'Reportes' };

/**
 * Marco de las pantallas de una campaña (detalle y fases): AppShell, migas, campaña no encontrada
 * y EncabezadoCampana. Cada fase solo pone su contenido como children.
 * fase: 'propuesta' | 'cotizacion' | 'instalacion' | 'reportes' (sin fase = detalle).
 * migasExtra: niveles después de la fase (p. ej. el periodo del visor de reportes).
 * children: nodo o función (campana) => nodo; solo se llama si la campaña existe.
 */
export function PaginaCampana({ fase, migasExtra = [], children }) {
  const campana = useCampanaDeRuta();
  if (!campana) {
    return (
      <AppShell migas={[{ label: 'Mis campañas', href: '#/campanas' }, { label: 'Campaña no encontrada' }]}>
        <NoEncontrada />
      </AppShell>
    );
  }
  const migas = [{ label: 'Mis campañas', href: '#/campanas' }, { label: campana.nombre, href: hrefCampana(campana.codigo) }];
  if (fase) migas.push({ label: NOMBRE_FASE[fase], href: hrefCampana(campana.codigo, fase) });
  migas.push(...migasExtra);
  // El último nivel es la página actual (sin enlace).
  const { href: _omitido, ...actual } = migas[migas.length - 1];
  migas[migas.length - 1] = actual;

  return (
    <AppShell migas={migas}>
      <EncabezadoCampana codigo={campana.codigo} fase={fase} />
      {typeof children === 'function' ? children(campana) : children}
    </AppShell>
  );
}

export default PaginaCampana;

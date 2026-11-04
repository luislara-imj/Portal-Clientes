import { AppShell } from '../layout/AppShell.jsx';
import { NoEncontrada } from '../layout/NoEncontrada.jsx';

// Ruta inexistente dentro del portal (404).
export default function PaginaNoEncontrada() {
  return (
    <AppShell titulo="Página no encontrada" migas={[{ label: 'Mis campañas', href: '#/campanas' }, { label: 'Página no encontrada' }]}>
      <NoEncontrada
        codigo="404"
        titulo="Esta página no existe"
        descripcion="Puede que el enlace esté mal escrito o que la página se haya movido."
      />
    </AppShell>
  );
}

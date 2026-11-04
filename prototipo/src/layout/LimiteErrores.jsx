import { Component } from 'react';
import { useLocation } from 'react-router-dom';
import { EstadoVacio } from './EstadoVacio.jsx';
import logoObpImj from '../assets/logo-obp-imj.svg';
import logoObpImjOscuro from '../assets/logo-obp-imj-oscuro.svg';
import './layout.css';

// Pantalla de error inesperado: logo, estado de error y salidas (recargar o ir a Mis campañas).
function PantallaError() {
  return (
    <main className="err-pagina">
      <span className="hdr-marca err-pagina__logo" aria-label="OBP by IMJ Media">
        <img className="hdr-marca__claro" src={logoObpImj} alt="" />
        <img className="hdr-marca__oscuro" src={logoObpImjOscuro} alt="" />
      </span>
      <EstadoVacio
        tamano="pagina"
        tono="error"
        icono="warning"
        titulo="Algo salió mal"
        descripcion="Ocurrió un error inesperado al mostrar esta pantalla. Tu información está a salvo; intenta de nuevo."
        acciones={[
          { label: 'Recargar', icono: 'refresh', onClick: () => window.location.reload() },
          { label: 'Ir a Mis campañas', variant: 'secondary', onClick: () => { window.location.hash = '#/campanas'; } }
        ]}
        nota="Si el problema continúa, contacta a tu ejecutivo de IMJ."
      />
    </main>
  );
}

class Limite extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('Error en la pantalla', error, info.componentStack);
  }

  render() {
    return this.state.error ? <PantallaError /> : this.props.children;
  }
}

/**
 * Atrapa errores de render de cualquier pantalla y muestra la pantalla de error en lugar de una página en
 * blanco. Se reinicia al cambiar de ruta (key), para que navegar fuera de la pantalla rota la recupere.
 */
export function LimiteErrores({ children }) {
  const { pathname } = useLocation();
  return <Limite key={pathname}>{children}</Limite>;
}

export default LimiteErrores;

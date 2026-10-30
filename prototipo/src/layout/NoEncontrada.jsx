import { useNavigate } from 'react-router-dom';
import { Button, Card, Icon } from '../orbita';
import './layout.css';

// Estado vacío: el código de la ruta no corresponde a ninguna campaña.
export function NoEncontrada() {
  const navigate = useNavigate();
  return (
    <Card as="section" padding="lg" aria-labelledby="no-encontrada-t">
      <div className="vacio">
        <Icon name="search" size={32} />
        <h1 id="no-encontrada-t" className="pg-subtitulo">Campaña no encontrada</h1>
        <p className="pg-texto">Revisa el enlace o vuelve a tu lista de campañas.</p>
        <Button variant="primary" size="md" iconLeft="arrow-left" onClick={() => navigate('/campanas')}>
          Ir a mis campañas
        </Button>
      </div>
    </Card>
  );
}

export default NoEncontrada;

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBar, Breadcrumbs, Modal, useToast } from '../orbita';
import { useStore } from '../store/index.js';
import { useTema } from './tema.js';
import './layout.css';

/**
 * Marco de todas las pantallas excepto login: AppBar de Órbita (logo, cliente, Tema,
 * Reiniciar datos, Cerrar sesión), contenedor de página (máx. 1280) y Breadcrumbs.
 * migas: items de Breadcrumbs ([{ label, href? }]; el último es la página actual).
 */
export function AppShell({ migas, children }) {
  const s = useStore();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [tema, alternarTema] = useTema();
  const [confirmar, setConfirmar] = useState(false);

  const reiniciar = () => {
    s.reiniciar();
    setConfirmar(false);
    toast({ title: 'Datos reiniciados', color: 'success' });
    navigate('/campanas');
  };

  return (
    <>
      <AppBar
        clientName={s.cliente.nombre}
        companyName={s.cliente.empresa}
        theme={tema}
        onToggleTheme={alternarTema}
        onReset={() => setConfirmar(true)}
        onLogout={() => navigate('/login')}
        homeHref="#/campanas"
      />
      <main className="pg">
        {migas?.length > 0 && <Breadcrumbs items={migas} />}
        {children}
      </main>
      <Modal
        open={confirmar}
        size="sm"
        title="Reiniciar datos"
        onClose={() => setConfirmar(false)}
        secondaryAction={{ label: 'Cancelar', onClick: () => setConfirmar(false) }}
        primaryAction={{ label: 'Reiniciar', variant: 'destructive', onClick: reiniciar }}
      >
        <p className="pg-parrafo">Todas las campañas vuelven a su estado inicial. Se pierde el avance de Alpina.</p>
      </Modal>
    </>
  );
}

export default AppShell;

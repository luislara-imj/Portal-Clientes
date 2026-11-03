import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, Breadcrumbs, Icon, Logo, Modal, Popover, useToast } from '../orbita';
import { useStore } from '../store/index.js';
import { useTema } from './tema.js';
import './layout.css';

/**
 * Menú del usuario (Header de Órbita, bloque Usuario): Avatar + nombre + empresa. Al pulsarlo
 * abre un Popover con Tema, Reiniciar datos y Cerrar sesión.
 */
function MenuUsuario({ onReiniciar }) {
  const s = useStore();
  const navigate = useNavigate();
  const [tema, alternarTema] = useTema();
  const [abierto, setAbierto] = useState(false);
  const oscuro = tema === 'dark';

  const elegir = (accion) => () => {
    setAbierto(false);
    accion();
  };

  return (
    <Popover
      open={abierto}
      onOpenChange={setAbierto}
      align="end"
      showClose={false}
      className="hdr-usuario-anchor"
      trigger={
        <button type="button" className="hdr-usuario" aria-label={`Menú de ${s.cliente.nombre}`}>
          <Avatar name={s.cliente.nombre} type="letter" size="sm" color="blue" theme="solid" />
          <span className="hdr-usuario-textos">
            <span className="hdr-usuario-nombre">{s.cliente.nombre}</span>
            <span className="hdr-usuario-rol">{s.cliente.empresa}</span>
          </span>
          <Icon name="chevron-down" size={16} />
        </button>
      }
    >
      <ul className="hdr-menu" aria-label="Opciones de usuario">
        <li>
          <button type="button" className="hdr-menu-opcion" onClick={elegir(alternarTema)}>
            <Icon name={oscuro ? 'sun' : 'moon'} size={16} />
            {oscuro ? 'Tema claro' : 'Tema oscuro'}
          </button>
        </li>
        <li>
          <button type="button" className="hdr-menu-opcion" onClick={elegir(onReiniciar)}>
            <Icon name="refresh" size={16} />
            Reiniciar datos
          </button>
        </li>
        <li>
          <button type="button" className="hdr-menu-opcion" onClick={elegir(() => navigate('/login'))}>
            <Icon name="logout" size={16} />
            Cerrar sesión
          </button>
        </li>
      </ul>
    </Popover>
  );
}

/**
 * Marco de todas las pantallas excepto login. Arriba va el Header de Órbita (tarjeta):
 * logo y título a la izquierda, con las migas como subtítulo; controles al centro y el
 * menú del usuario a la derecha. No hay barra de navegación ni botón Volver: las migas
 * son la navegación hacia atrás.
 * titulo: texto del título · nota: texto secundario junto al título (p. ej. "solo consulta")
 * migas: items de Breadcrumbs ([{ label, href? }]; el último es la página actual)
 * controles: nodo opcional al centro del header
 * acciones: nodo opcional a la derecha, antes del menú del usuario (p. ej. un botón primario)
 */
export function AppShell({ titulo, nota, migas, controles, acciones, children }) {
  const s = useStore();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [confirmar, setConfirmar] = useState(false);

  const reiniciar = () => {
    s.reiniciar();
    setConfirmar(false);
    toast({ title: 'Datos reiniciados', color: 'success' });
    navigate('/campanas');
  };

  return (
    <>
      <main className="pg">
        <header className="enc-cabecera">
          <div className="enc-izq">
            <a className="hdr-logo" href="#/campanas" aria-label="Ir a Mis campañas">
              <Logo variant="icon" size="lg" decorative />
            </a>
            <div className="enc-titulos">
              <h1 className="enc-titulo">
                {titulo}
                {nota && <span className="enc-nota"> ({nota})</span>}
              </h1>
              {migas?.length > 0 && <Breadcrumbs items={migas} className="enc-migas" />}
            </div>
          </div>
          <div className="enc-centro">{controles}</div>
          <div className="enc-der">
            {acciones}
            <MenuUsuario onReiniciar={() => setConfirmar(true)} />
          </div>
        </header>
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

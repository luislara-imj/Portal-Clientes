import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert, Avatar, Breadcrumbs, IconButton, Icon, Modal, Popover, Tag, Toogle, useToast } from '../orbita';
import { ConfiguracionCuenta } from './ConfiguracionCuenta.jsx';
import { useStore } from '../store/index.js';
import { useTema } from './tema.js';
import { useEnLinea } from './useEnLinea.js';
import logoObpImj from '../assets/logo-obp-imj.svg';
import logoObpImjOscuro from '../assets/logo-obp-imj-oscuro.svg';
import './layout.css';

/**
 * Menú del usuario (Header de Órbita, bloque Usuario): logo de la empresa (si lo cargó), Avatar (foto o
 * iniciales), nombre y empresa. Abre un Popover con la tarjeta del usuario, Configuración de la cuenta,
 * el interruptor de Tema oscuro, Reiniciar datos (solo demo) y Cerrar sesión.
 */
function MenuUsuario({ onReiniciar, onConfigurar }) {
  const s = useStore();
  const navigate = useNavigate();
  const [tema, alternarTema] = useTema();
  const [abierto, setAbierto] = useState(false);
  const oscuro = tema === 'dark';
  const { usuario, empresa } = s.perfil;

  const elegir = (accion) => () => {
    setAbierto(false);
    accion();
  };
  const avatar = (size) => (
    <Avatar name={usuario.nombre} src={usuario.foto || undefined} size={size} color="blue" theme="solid" decorative />
  );

  return (
    <Popover
      open={abierto}
      onOpenChange={setAbierto}
      align="end"
      showClose={false}
      className="hdr-usuario-anchor"
      trigger={
        <button type="button" className="hdr-usuario" aria-label={`Menú de ${s.cliente.nombre}`}>
          {empresa.logo && <img className="hdr-usuario-logo" src={empresa.logo} alt={s.cliente.empresa} />}
          {avatar('sm')}
          <span className="hdr-usuario-textos">
            <span className="hdr-usuario-nombre">{s.cliente.nombre}</span>
            <span className="hdr-usuario-rol">{s.cliente.empresa}</span>
          </span>
          <Icon name="chevron-down" size={16} />
        </button>
      }
    >
      <div className="hdr-perfil">
        {avatar('lg')}
        <div className="hdr-perfil__textos">
          <strong>{usuario.nombre}</strong>
          {usuario.correo && <span>{usuario.correo}</span>}
          <span className="hdr-perfil__empresa">
            {empresa.logo ? <img src={empresa.logo} alt="" /> : <Icon name="building" size={10} />}
            {s.cliente.empresa}
          </span>
        </div>
      </div>
      <ul className="hdr-menu" aria-label="Opciones de usuario">
        <li>
          <button type="button" className="hdr-menu-opcion" onClick={elegir(onConfigurar)}>
            <span className="hdr-menu-icono" aria-hidden="true"><Icon name="gear" size={16} /></span>
            <span className="hdr-menu-textos">
              Configuración de la cuenta
              <small>Tu perfil y los datos de tu empresa</small>
            </span>
            <Icon name="chevron-right" size={10} className="hdr-menu-flecha" />
          </button>
        </li>
        <li>
          <div className="hdr-menu-opcion hdr-menu-opcion--switch">
            <span className="hdr-menu-icono" aria-hidden="true"><Icon name={oscuro ? 'moon' : 'sun'} size={16} /></span>
            <span className="hdr-menu-textos">Tema oscuro</span>
            <Toogle checked={oscuro} onChange={() => alternarTema()} label="Tema oscuro" labelPosition="none" />
          </div>
        </li>
        <li>
          <button type="button" className="hdr-menu-opcion" onClick={elegir(onReiniciar)}>
            <span className="hdr-menu-icono" aria-hidden="true"><Icon name="refresh" size={16} /></span>
            <span className="hdr-menu-textos">Reiniciar datos</span>
            <Tag color="warning">Demo</Tag>
          </button>
        </li>
      </ul>
      <div className="hdr-menu-separador" />
      <button type="button" className="hdr-menu-opcion hdr-menu-opcion--salir" onClick={elegir(() => navigate('/login'))}>
        <span className="hdr-menu-icono" aria-hidden="true"><Icon name="logout" size={16} /></span>
        <span className="hdr-menu-textos">Cerrar sesión</span>
      </button>
    </Popover>
  );
}

// Enlaces del pie. Aún no hay páginas publicadas: avisan que estarán disponibles pronto.
const ENLACES_PIE = ['Aviso de privacidad', 'Términos y condiciones', 'Ayuda y soporte'];

/**
 * Pie de página del portal: derechos de OBP by IMJ Media y enlaces legales y de ayuda.
 */
function PiePagina() {
  const { toast } = useToast();
  return (
    <footer className="pg-pie">
      <p className="pg-pie__legal">© {new Date().getFullYear()} OBP by IMJ Media. Todos los derechos reservados.</p>
      <nav className="pg-pie__enlaces" aria-label="Información legal y ayuda">
        {ENLACES_PIE.map((texto) => (
          <button
            key={texto}
            type="button"
            className="pg-pie__enlace"
            onClick={() => toast({ title: texto, body: 'Disponible próximamente.', color: 'info' })}
          >
            {texto}
          </button>
        ))}
      </nav>
    </footer>
  );
}

/**
 * Marco de todas las pantallas excepto login. Arriba va el Header de Órbita (tarjeta):
 * logo OBP by IMJ Media (siempre visible; lleva a Mis campañas), Volver opcional y título a la izquierda,
 * con las migas como subtítulo; controles al centro y el menú del usuario a la derecha.
 * volver: { label, ruta } opcional.
 * titulo: texto del título · nota: texto secundario junto al título (p. ej. "solo consulta")
 * migas: items de Breadcrumbs ([{ label, href? }]; el último es la página actual)
 * subtitulo: texto bajo el título cuando no hay migas (página de inicio, donde la miga repetiría el título)
 * controles: nodo opcional al centro del header
 * acciones: nodo opcional a la derecha, antes del menú del usuario (p. ej. un botón primario)
 */
export function AppShell({ titulo, nota, migas, subtitulo, controles, acciones, volver, children }) {
  const s = useStore();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [confirmar, setConfirmar] = useState(false);
  const [configurando, setConfigurando] = useState(false);
  const enLinea = useEnLinea();

  const reiniciar = () => {
    s.reiniciar();
    setConfirmar(false);
    toast({ title: 'Datos reiniciados', color: 'success' });
    navigate('/campanas');
  };

  return (
    <div className="pg-marco">
      <main className="pg">
        <header className="enc-cabecera">
          <div className="enc-izq">
            <a className="hdr-logo hdr-marca" href="#/campanas" aria-label="OBP by IMJ Media · Ir a Mis campañas">
              <img className="hdr-marca__claro" src={logoObpImj} alt="" />
              <img className="hdr-marca__oscuro" src={logoObpImjOscuro} alt="" />
            </a>
            {volver && (
              <IconButton
                icon="arrow-left"
                label={volver.label}
                variant="secondary"
                size="xs"
                pill="pill"
                onClick={() => navigate(volver.ruta)}
              />
            )}
            <div className="enc-titulos">
              <h1 className="enc-titulo">
                {titulo}
                {nota && <span className="enc-nota"> ({nota})</span>}
              </h1>
              {migas?.length > 0 ? (
                <Breadcrumbs items={migas} className="enc-migas" />
              ) : (
                subtitulo && <p className="enc-subtitulo">{subtitulo}</p>
              )}
            </div>
          </div>
          <div className="enc-centro">{controles}</div>
          <div className="enc-der">
            {acciones}
            <MenuUsuario onReiniciar={() => setConfirmar(true)} onConfigurar={() => setConfigurando(true)} />
          </div>
        </header>
        {!enLinea && (
          <Alert
            stage="warning"
            className="pg-sin-conexion"
            title="Sin conexión a internet"
            description="Puedes seguir consultando lo que ya cargó. Lo que cambies se guarda en este dispositivo; revisa tu conexión para recibir información nueva."
            live
          />
        )}
        {children}
      </main>
      <PiePagina />
      <ConfiguracionCuenta open={configurando} onClose={() => setConfigurando(false)} />
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
    </div>
  );
}

export default AppShell;

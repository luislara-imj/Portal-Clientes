import { Avatar } from './Avatar.jsx';
import { Button } from './Button.jsx';
import { Logo } from './Logo.jsx';
import { cx } from './cx.js';
import './AppBar.css';

/**
 * Barra superior del portal (PROTOTIPO_SPEC 6.1): Órbita no tiene app bar con logo,
 * así que se compone con Logo, Avatar, texto y Button.
 * clientName · companyName · theme: 'light' | 'dark'
 * onToggleTheme · onReset (botón "Reiniciar datos"; se oculta si no se pasa) · onLogout
 * En pantallas angostas los botones quedan solo con ícono (el texto sigue como nombre accesible).
 */
export function AppBar({ clientName, companyName, theme = 'light', onToggleTheme, onReset, onLogout, homeHref, className }) {
  const dark = theme === 'dark';
  const logo = <Logo size="md" />;
  return (
    <header className={cx('ui-appbar', className)}>
      <div className="ui-appbar__start">
        {homeHref ? (
          <a className="ui-appbar__home" href={homeHref} aria-label="OBP, ir al inicio">
            <Logo size="md" decorative />
          </a>
        ) : (
          logo
        )}
        {clientName && (
          <div className="ui-appbar__client">
            <Avatar name={clientName} size="sm" decorative />
            <div className="ui-appbar__client-text">
              <span className="ui-appbar__client-name">{clientName}</span>
              {companyName && <span className="ui-appbar__client-company">{companyName}</span>}
            </div>
          </div>
        )}
      </div>
      <nav className="ui-appbar__actions" aria-label="Opciones de la cuenta">
        {onToggleTheme && (
          <Button
            variant="tertiary"
            iconLeft={dark ? 'sun' : 'moon'}
            aria-pressed={dark}
            onClick={onToggleTheme}
            title={dark ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
          >
            Tema
          </Button>
        )}
        {onReset && (
          <Button variant="secondary" iconLeft="refresh" onClick={onReset}>
            Reiniciar datos
          </Button>
        )}
        {onLogout && (
          <Button variant="tertiary" iconLeft="logout" onClick={onLogout}>
            Cerrar sesión
          </Button>
        )}
      </nav>
    </header>
  );
}

export default AppBar;

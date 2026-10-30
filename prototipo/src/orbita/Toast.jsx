import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Button } from './Button.jsx';
import { Icon } from './Icon.jsx';
import { IconButton } from './IconButton.jsx';
import { cx } from './cx.js';
import './Toast.css';

const GLYPH = { neutro: 'shapes', success: 'success', warning: 'warning', danger: 'error', info: 'info' };

/**
 * Toast de Órbita (§8.1), presentacional.
 * color: neutro | success | warning | danger | info · title · subtitle · body
 * actions: [{ label, onClick, variant? }] (tamaño lg) · onClose · showTimer · progress 0–100 (timer)
 */
export function Toast({ color = 'success', title, subtitle, body, actions, onClose, showTimer = true, progress = 100, className, ...rest }) {
  return (
    <div className={cx('ui-toast', `ui-toast--${color}`, className)} {...rest}>
      <div className="ui-toast__base">
        <span className="ui-toast__icon" aria-hidden="true">
          <Icon name={GLYPH[color] ?? 'info'} size={16} />
        </span>
        <div className="ui-toast__main">
          <div className="ui-toast__head">
            <div className="ui-toast__titles">
              <p className="ui-toast__title">{title}</p>
              {subtitle && <p className="ui-toast__subtitle">{subtitle}</p>}
            </div>
            {onClose && <IconButton icon="x" label="Cerrar aviso" variant="tertiary" size="xxs" onClick={onClose} />}
          </div>
          {body && <p className="ui-toast__body">{body}</p>}
          {actions?.length > 0 && (
            <div className="ui-toast__actions">
              {actions.map((a, i) => (
                <Button key={a.label} variant={a.variant ?? (i === 0 ? 'tertiary' : 'secondary')} size="xs" onClick={a.onClick}>
                  {a.label}
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>
      {showTimer && (
        <div className="ui-toast__timer" aria-hidden="true">
          <span className="ui-toast__timer-fill" style={{ width: `${Math.max(0, Math.min(100, progress))}%` }} />
        </div>
      )}
    </div>
  );
}

const ToastContext = createContext(null);
const MAX_VISIBLE = 3;
const DEFAULT_DURATION = 5000;
const TICK = 100;

/**
 * Proveedor de toasts: región role="status" (aria-live polite) y cola.
 * Se muestran hasta 3 a la vez; los demás esperan. Hover o foco pausan el tiempo.
 * useToast() → toast({ title, subtitle, body, color, actions, duration, showTimer }) y dismiss(id).
 */
export function ToastProvider({ children, position = 'bottom-right' }) {
  const [items, setItems] = useState([]);
  const seq = useRef(0);

  const dismiss = useCallback((id) => setItems((list) => list.filter((t) => t.id !== id)), []);

  const toast = useCallback((opts) => {
    seq.current += 1;
    const id = `toast-${seq.current}`;
    const duration = opts.duration ?? DEFAULT_DURATION;
    setItems((list) => [...list, { showTimer: true, color: 'success', ...opts, id, duration, remaining: duration }]);
    return id;
  }, []);

  const visible = items.slice(0, MAX_VISIBLE);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || visible.length === 0) return undefined;
    const timer = setInterval(() => {
      setItems((list) =>
        list
          .map((t, i) => (i < MAX_VISIBLE && t.duration > 0 ? { ...t, remaining: t.remaining - TICK } : t))
          .filter((t) => t.duration <= 0 || t.remaining > 0)
      );
    }, TICK);
    return () => clearInterval(timer);
  }, [paused, visible.length]);

  const api = useMemo(() => ({ toast, dismiss }), [toast, dismiss]);

  return (
    <ToastContext.Provider value={api}>
      {children}
      {createPortal(
        <div
          role="status"
          aria-live="polite"
          aria-relevant="additions"
          className={cx('ui-toast-region', `ui-toast-region--${position}`)}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
        >
          {visible.map((t) => (
            <Toast
              key={t.id}
              color={t.color}
              title={t.title}
              subtitle={t.subtitle}
              body={t.body}
              actions={t.actions?.map((a) => ({
                ...a,
                onClick: () => {
                  a.onClick?.();
                  dismiss(t.id);
                },
              }))}
              showTimer={t.showTimer && t.duration > 0}
              progress={t.duration > 0 ? (t.remaining / t.duration) * 100 : 100}
              onClose={() => dismiss(t.id)}
            />
          ))}
          {items.length > MAX_VISIBLE && (
            <p className="ui-sr-only">{items.length - MAX_VISIBLE} avisos más en espera</p>
          )}
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast debe usarse dentro de <ToastProvider>');
  return ctx;
}

export default Toast;

import { useEffect, useRef } from 'react';
import { useToast } from '../orbita';

/**
 * Muestra un Toast de Órbita una sola vez por visita a la pantalla: al entrar, o cuando la
 * condición se cumple por primera vez (por ejemplo, al confirmar la selección).
 * clave: identifica el aviso; null o vacío = no mostrar. Cambiar de clave vuelve a mostrarlo.
 * opciones: las de toast() ({ title, body, color, actions, duration }). Las acciones también cierran el toast.
 */
export function useToastUnaVez(clave, opciones) {
  const { toast, dismiss } = useToast();
  const mostrados = useRef(new Set());
  const ultimas = useRef(opciones);
  ultimas.current = opciones;

  useEffect(() => {
    if (!clave || mostrados.current.has(clave)) return undefined;
    mostrados.current.add(clave);
    const o = ultimas.current;
    let id = null;
    id = toast({
      duration: 8000,
      ...o,
      actions: o.actions?.map((a) => ({
        ...a,
        onClick: () => {
          if (id) dismiss(id);
          a.onClick?.();
        }
      }))
    });
    // Al salir de la pantalla (o si cambia el aviso) se cierra, para no acumular toasts al volver.
    return () => {
      dismiss(id);
      mostrados.current.delete(clave);
    };
  }, [clave, toast, dismiss]);
}

export default useToastUnaVez;

import { useState } from 'react';

// Tema OBP Light / OBP Dark: data-theme en <html>, recordado en localStorage ('obp-tema').
// Sin valor guardado queda OBP Light (data-theme="light" en index.html).
export const CLAVE_TEMA = 'obp-tema';

export function temaGuardado() {
  try {
    const v = window.localStorage.getItem(CLAVE_TEMA);
    return v === 'dark' || v === 'light' ? v : null;
  } catch {
    return null;
  }
}

// Se llama una vez al arrancar la app (App.jsx), antes del primer render.
export function aplicarTemaGuardado() {
  const t = temaGuardado();
  if (t) document.documentElement.dataset.theme = t;
}

function temaActual() {
  const attr = document.documentElement.dataset.theme;
  if (attr === 'dark' || attr === 'light') return attr;
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function useTema() {
  const [tema, setTema] = useState(temaActual);
  const alternar = () => {
    const nuevo = temaActual() === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = nuevo;
    try {
      window.localStorage.setItem(CLAVE_TEMA, nuevo);
    } catch {
      // Sin almacenamiento: el tema dura hasta recargar.
    }
    setTema(nuevo);
  };
  return [tema, alternar];
}

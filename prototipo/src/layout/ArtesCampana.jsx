import { useEffect, useRef, useState } from 'react';
import { Alert, Button, Divider, FileDropzone, FileItem, Icon, Modal, Spinner } from '../orbita';
import { useStore } from '../store/index.js';
import { MARCAS_REALES } from './marcas.js';
import './artes.css';

// Artes de la campaña en Google Drive (simulado). El prototipo no sube nada: solo guarda los
// metadatos del archivo (id, nombre, tipo, tamaño, fecha) y simula la creación de la carpeta y el avance.

const FORMATOS = ['ai', 'psd', 'jpg', 'jpeg', 'png', 'webp', 'tif', 'tiff', 'zip', 'rar', '7z'];
const MAX_BYTES = 10 * 1024 * 1024 * 1024; // 10 GB
const CREAR_CARPETA_MS = 1500;
const TIC_MS = 100;

// Duración simulada de la subida: 2 s para archivos chicos, hasta 6 s a partir de ~1 GB.
export function duracionSubida(bytes) {
  const proporcion = Math.min(1, Math.max(0, bytes) / (1024 * 1024 * 1024));
  return Math.round(2000 + 4000 * proporcion);
}

// 1 536 → "1.5 KB"; 52 428 800 → "50 MB".
export function formatoTamano(bytes) {
  const n = Number(bytes) || 0;
  const unidades = ['B', 'KB', 'MB', 'GB'];
  let valor = n;
  let i = 0;
  while (valor >= 1024 && i < unidades.length - 1) {
    valor /= 1024;
    i += 1;
  }
  const texto = i === 0 || valor >= 100 ? String(Math.round(valor)) : String(Math.round(valor * 10) / 10);
  return `${texto} ${unidades[i]}`;
}

const extension = (nombre) => (nombre.includes('.') ? nombre.split('.').pop().toUpperCase() : '');

/**
 * Fila "Artes" dentro de una tarjeta (Resumen de la cotización, datos de la campaña).
 * Toda la fila abre el modal; el control accesible es el botón de la derecha.
 */
export function FilaArtes({ codigo, onAbrir }) {
  const s = useStore();
  const total = s.archivos(codigo).length;
  const pendientes = total === 0;
  const estado = pendientes ? 'pendientes' : `${total} en Drive`;
  const accion = pendientes ? 'Subir' : 'Ver';
  return (
    <div className="ar-fila-bloque">
      <Divider />
      {/* El clic en la fila es un atajo de puntero; teclado y lectores usan el botón. */}
      <div className="ar-fila" onClick={onAbrir}>
        <Icon name="drive" size={16} className="ar-fila__icono" />
        <span className="ar-fila__texto">
          Artes{' '}
          <span className={pendientes ? 'ar-fila__estado is-pendiente' : 'ar-fila__estado is-listo'}>· {estado}</span>
        </span>
        <Button
          variant="tertiary"
          size="sm"
          className="ar-fila__boton"
          aria-label={`Artes de la campaña: ${estado}, ${accion.toLowerCase()}`}
          onClick={(e) => {
            e.stopPropagation();
            onAbrir();
          }}
        >
          {accion}
        </Button>
      </div>
    </div>
  );
}

/**
 * Modal de artes: crea la carpeta en Drive la primera vez (≈1.5 s), luego permite subir y quitar artes.
 * aviso: muestra la nota de que hace falta al menos un arte para arrancar la campaña.
 */
// Arte principal de cada campaña (la imagen de su tarjeta), para la miniatura del archivo marcado `arte`.
const ARTE_DE = Object.assign({}, ...MARCAS_REALES.map((m) => m.artesPorCodigo || {}));

export function ModalArtes({ codigo, open, onClose, aviso = false }) {
  const s = useStore();
  const carpeta = s.carpetaDrive(codigo);
  const archivos = s.archivos(codigo);
  const [subidas, setSubidas] = useState([]);
  const timers = useRef(new Map());
  const { agregarArchivo, crearCarpetaDrive } = s;
  const agregarRef = useRef(agregarArchivo);
  agregarRef.current = agregarArchivo;

  // Crear la carpeta la primera vez que se abre.
  useEffect(() => {
    if (!open || carpeta) return undefined;
    const id = setTimeout(() => crearCarpetaDrive(codigo), CREAR_CARPETA_MS);
    return () => clearTimeout(id);
    // crearCarpetaDrive cambia en cada render del store; basta con open/carpeta/codigo.
  }, [open, carpeta, codigo]);

  // Limpia los timers de subida al desmontar.
  useEffect(() => {
    const mapa = timers.current;
    return () => {
      mapa.forEach((t) => clearInterval(t));
      mapa.clear();
    };
  }, []);

  const detener = (id) => {
    clearInterval(timers.current.get(id));
    timers.current.delete(id);
  };

  const subir = (files) => {
    const nuevas = files.map((f, i) => ({
      id: `${codigo}-${Date.now()}-${i}-${f.name}`,
      nombre: f.name,
      tamano: f.size,
      progreso: 0
    }));
    setSubidas((prev) => [...prev, ...nuevas]);
    for (const n of nuevas) {
      const inicio = Date.now();
      const duracion = duracionSubida(n.tamano);
      const t = setInterval(() => {
        const progreso = Math.min(100, Math.round(((Date.now() - inicio) / duracion) * 100));
        if (progreso >= 100) {
          detener(n.id);
          setSubidas((prev) => prev.filter((x) => x.id !== n.id));
          agregarRef.current(codigo, {
            id: n.id,
            nombre: n.nombre,
            tipo: extension(n.nombre),
            tamano: n.tamano,
            subidoEn: Date.now()
          });
          return;
        }
        setSubidas((prev) => prev.map((x) => (x.id === n.id ? { ...x, progreso } : x)));
      }, TIC_MS);
      timers.current.set(n.id, t);
    }
  };

  const cancelar = (id) => {
    detener(id);
    setSubidas((prev) => prev.filter((x) => x.id !== id));
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="md"
      title="Artes de la campaña"
      primaryAction={{ label: 'Listo', onClick: onClose }}
    >
      <div className="ar-modal">
        {aviso && archivos.length === 0 && <Alert stage="warning" description="Sube al menos un arte para arrancar la campaña." live />}

        {!carpeta ? (
          <div className="ar-creando" role="status">
            <Spinner size="sm" iconSize={20} />
            <span>Creando carpeta en Google Drive…</span>
          </div>
        ) : (
          <>
            <div className="ar-drive">
              <div className="ar-drive__textos">
                <span className="ar-drive__estado">
                  <Icon name="dot" size={10} />
                  Conectado a Google Drive
                </span>
                <span className="ar-drive__carpeta" title={carpeta.nombre}>
                  <Icon name="drive" size={16} className="ar-drive__icono" />
                  <span className="ar-drive__nombre">{carpeta.nombre}</span>
                </span>
              </div>
              <a
                className="ar-drive__abrir ui-focus-ring"
                href={carpeta.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                Abrir en Drive
                <Icon name="external-link" size={16} />
                <span className="ui-sr-only"> (se abre en otra pestaña)</span>
              </a>
            </div>

            <FileDropzone
              accept={FORMATOS}
              maxBytes={MAX_BYTES}
              ayuda="Arrastra o elige archivos · .ai, .psd, imagen o comprimido · hasta 10 GB"
              errorTexto="Formato no permitido o archivo de más de 10 GB. Usa .ai, .psd, imagen o comprimido."
              onFiles={subir}
            />

            {(subidas.length > 0 || archivos.length > 0) && (
              <ul className="ar-lista" aria-label="Artes de la campaña">
                {subidas.map((u) => (
                  <li key={u.id}>
                    <FileItem
                      nombre={u.nombre}
                      formato={extension(u.nombre)}
                      detalle={`Subiendo a Drive… ${u.progreso}%`}
                      progreso={u.progreso}
                      estado="cargando"
                      onQuitar={() => cancelar(u.id)}
                    />
                  </li>
                ))}
                {archivos.map((a) => (
                  <li key={a.id}>
                    <FileItem
                      nombre={a.nombre}
                      formato={a.tipo || extension(a.nombre)}
                      miniatura={a.arte ? ARTE_DE[codigo] : undefined}
                      detalle={`${formatoTamano(a.tamano)} · En Drive`}
                      estado="completo"
                      onQuitar={() => s.quitarArchivo(codigo, a.id)}
                    />
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>
    </Modal>
  );
}

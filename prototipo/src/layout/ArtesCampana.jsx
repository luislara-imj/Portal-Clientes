import { useEffect, useRef, useState } from 'react';
import { Alert, FileDropzone, Icon, IconButton, Input, Modal, ProgressBar, Spinner, cx } from '../orbita';
import { useStore } from '../store/index.js';
import { EstadoVacio } from './EstadoVacio.jsx';
import logoDrive from '../assets/google-drive.svg';
import './artes.css';

// Artes de la campaña en Google Drive (simulado). El prototipo no sube nada: solo guarda los
// metadatos del archivo (id, nombre, tipo, tamaño, fecha) y simula la creación de la carpeta y el avance.

const FORMATOS = ['ai', 'psd', 'jpg', 'jpeg', 'png', 'webp', 'tif', 'tiff', 'mp4', 'mov', 'avi', 'webm', 'mkv', 'zip', 'rar', '7z'];
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

// Familia del formato para darle color a cada archivo (etiquetas de categoría, all-colors de Órbita):
// ai (naranja), psd (azure), imagen (verde), video (azul), comprimido (neutro).
const FAMILIA = {
  AI: 'ai', PSD: 'psd', JPG: 'imagen', JPEG: 'imagen', PNG: 'imagen', WEBP: 'imagen', TIF: 'imagen', TIFF: 'imagen',
  MP4: 'video', MOV: 'video', AVI: 'video', WEBM: 'video', MKV: 'video',
  ZIP: 'comprimido', RAR: 'comprimido', '7Z': 'comprimido'
};
const iconoDe = (formato) => (familiaDe(formato) === 'video' ? 'video' : 'file');
const familiaDe = (formato) => FAMILIA[String(formato).toUpperCase()] || 'comprimido';

// Chips de formatos bajo la zona de carga.
// Filtros de la lista por familia (solo se muestran las que hay) y a partir de cuántos artes aparecen.
const NOMBRE_FAMILIA = { ai: 'AI', psd: 'PSD', imagen: 'Imágenes', video: 'Videos', comprimido: 'Comprimidos' };
const ARTES_PARA_FILTRAR = 6;
const sinAcentos = (t) => t.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

const CHIPS_FORMATO = [['AI', 'ai'], ['PSD', 'psd'], ['JPG', 'imagen'], ['PNG', 'imagen'], ['TIFF', 'imagen'], ['MP4', 'video'], ['MOV', 'video'], ['ZIP', 'comprimido']];

/**
 * Fila de un arte: ficha del color de su formato (ícono y formato), nombre en una línea, peso o avance
 * de subida y botón para quitar / cancelar. Compacta para que la lista aguante decenas de archivos.
 */
function FilaArte({ nombre, formato, tamano, progreso, cargando = false, onQuitar }) {
  return (
    <div className={cx('ar-fila-arte', `ar-arte--${familiaDe(formato)}`, cargando && 'is-cargando')}>
      <span className="ar-fila-arte__ficha" aria-hidden="true">
        <Icon name={iconoDe(formato)} size={16} />
        <span>{formato}</span>
      </span>
      <span className="ar-fila-arte__textos">
        <span className="ar-fila-arte__nombre" title={nombre}>{nombre}</span>
        {cargando ? (
          <span className="ar-fila-arte__subida">
            <ProgressBar value={progreso} size="xxs" showPercentage={false} aria-label={`Subiendo ${nombre}`} />
            <span>{progreso}%</span>
          </span>
        ) : (
          <span className="ar-fila-arte__meta">{formatoTamano(tamano)}</span>
        )}
      </span>
      <IconButton
        icon={cargando ? 'x' : 'trash'}
        label={cargando ? `Cancelar ${nombre}` : `Quitar ${nombre}`}
        variant="tertiary"
        size="xs"
        pill="pill"
        onClick={onQuitar}
      />
    </div>
  );
}

/**
 * Modal de artes: crea la carpeta en Drive la primera vez (≈1.5 s), luego permite subir y quitar artes.
 * aviso: muestra la nota de que hace falta al menos un arte para arrancar la campaña.
 */

export function ModalArtes({ codigo, open, onClose, aviso = false }) {
  const s = useStore();
  const carpeta = s.carpetaDrive(codigo);
  const archivos = s.archivos(codigo);
  const [subidas, setSubidas] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [filtro, setFiltro] = useState('todos');
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

  const pesoTotal = archivos.reduce((t, a) => t + (Number(a.tamano) || 0), 0);
  const conteo = archivos.length === 1 ? '1 arte' : `${archivos.length} artes`;
  const segmentos = carpeta ? carpeta.nombre.split(' / ') : [];
  const hayArtes = subidas.length > 0 || archivos.length > 0;
  // Lista: lo más reciente primero; filtro por familia y búsqueda por nombre.
  const familias = Object.keys(NOMBRE_FAMILIA)
    .map((f) => [f, archivos.filter((a) => familiaDe(a.tipo || extension(a.nombre)) === f).length])
    .filter(([, n]) => n > 0);
  const conHerramientas = archivos.length >= ARTES_PARA_FILTRAR;
  // Si se borró el último arte de la familia filtrada, se vuelve a "Todos".
  const filtroActivo = filtro === 'todos' || familias.some(([f]) => f === filtro) ? filtro : 'todos';
  const q = sinAcentos(busqueda.trim());
  const visibles = archivos
    .filter((a) => filtroActivo === 'todos' || familiaDe(a.tipo || extension(a.nombre)) === filtroActivo)
    .filter((a) => !q || sinAcentos(a.nombre).includes(q))
    .sort((x, y) => (y.subidoEn || 0) - (x.subidoEn || 0));
  const avanceSubidas = subidas.length ? Math.round(subidas.reduce((t, u) => t + u.progreso, 0) / subidas.length) : 0;

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="md"
      icon="paintbrush"
      title="Artes de la campaña"
      footerStart={
        carpeta && (
          <span className={archivos.length ? 'ar-pie ar-pie--listo' : 'ar-pie'}>
            <Icon name={archivos.length ? 'success' : 'info'} size={16} />
            {archivos.length ? `${conteo} en Drive` : 'Aún no hay artes'}
          </span>
        )
      }
      primaryAction={{ label: 'Listo', onClick: onClose }}
    >
      <div className="ar-modal">
        {aviso && archivos.length === 0 && <Alert stage="warning" description="Sube al menos un arte para arrancar la campaña." live />}

        {!carpeta ? (
          <div className="ar-creando" role="status">
            <span className="ar-drive__logo ar-drive__logo--cargando" aria-hidden="true">
              <img src={logoDrive} alt="" />
            </span>
            <span className="ar-creando__textos">
              <strong>Preparando tu carpeta</strong>
              <span><Spinner size="sm" iconSize={16} /> Creando la carpeta de la campaña en Google Drive…</span>
            </span>
          </div>
        ) : (
          <>
            <div className="ar-drive">
              <span className="ar-drive__logo">
                <img src={logoDrive} alt="Google Drive" />
                <span className="ar-drive__punto" aria-hidden="true" />
              </span>
              <div className="ar-drive__textos">
                <span className="ar-drive__titulo">
                  Google Drive
                  <span className="ar-drive__estado">
                    <Icon name="check" size={10} />
                    Conectado
                  </span>
                </span>
                <span className="ar-drive__ruta" title={carpeta.nombre}>
                  <Icon name="drive" size={10} className="ar-drive__carpeta" />
                  {segmentos.map((seg, i) => (
                    <span key={`${seg}-${i}`} className={cx('ar-drive__seg', i === segmentos.length - 1 && 'is-ultimo', seg.length > 16 && 'is-largo')}>
                      {i > 0 && <Icon name="chevron-right" size={10} className="ar-drive__sep" />}
                      <span className="ar-drive__texto-seg">{seg}</span>
                    </span>
                  ))}
                </span>
              </div>
              <a
                className="ar-drive__abrir ui-focus-ring"
                href={carpeta.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                Abrir en Drive
                <Icon name="external-link" size={10} />
                <span className="ui-sr-only"> (se abre en otra pestaña)</span>
              </a>
            </div>

            <FileDropzone
              className={cx('ar-dropzone', hayArtes && 'ar-dropzone--compacta')}
              accept={FORMATOS}
              maxBytes={MAX_BYTES}
              icono="upload"
              titulo={hayArtes ? 'Agrega más artes' : 'Arrastra tus artes aquí'}
              boton="Elegir archivos"
              ayuda={hayArtes ? 'Arrastra aquí o elige archivos · hasta 10 GB' : 'o elige archivos de tu computadora · hasta 10 GB por archivo'}
              errorTexto="Formato no permitido o archivo de más de 10 GB. Usa .ai, .psd, imagen, video o comprimido."
              onFiles={subir}
            >
              {!hayArtes && (
                <ul className="ar-formatos" aria-label="Formatos permitidos">
                  {CHIPS_FORMATO.map(([f, familia]) => (
                    <li key={f} className={`ar-formato ar-formato--${familia}`}>{f}</li>
                  ))}
                </ul>
              )}
            </FileDropzone>

            {hayArtes ? (
              <section className="ar-seccion" aria-labelledby="ar-lista-t">
                <header className="ar-seccion__cabecera">
                  <h3 id="ar-lista-t" className="ar-seccion__titulo">
                    Tus artes <span className="ar-seccion__cuenta">{archivos.length}</span>
                  </h3>
                  {subidas.length === 0 && (
                    <span className="ar-seccion__resumen">
                      <Icon name="success" size={10} /> Todo en Drive · {formatoTamano(pesoTotal)}
                    </span>
                  )}
                </header>

                {subidas.length > 0 && (
                  <div className="ar-subidas" role="status">
                    <div className="ar-subidas__texto">
                      <Spinner size="sm" iconSize={10} />
                      <span className="ar-subidas__mensaje">
                        Subiendo {subidas.length === 1 ? '1 archivo' : `${subidas.length} archivos`} a Drive
                      </span>
                      <strong>{avanceSubidas}%</strong>
                    </div>
                    <ProgressBar value={avanceSubidas} size="xs" showPercentage={false} aria-label="Avance total de la subida" />
                  </div>
                )}

                {conHerramientas && (
                  <div className="ar-herramientas">
                    <Input
                      size="sm"
                      iconLeft="search"
                      placeholder="Buscar por nombre"
                      aria-label="Buscar artes por nombre"
                      value={busqueda}
                      onChange={(e) => setBusqueda(e.target.value)}
                    />
                    <div className="ar-filtros" role="group" aria-label="Filtrar por formato">
                      {[['todos', archivos.length], ...familias].map(([f, n]) => (
                        <button
                          key={f}
                          type="button"
                          className={cx('ar-filtro', f !== 'todos' && `ar-arte--${f}`)}
                          aria-pressed={filtroActivo === f}
                          onClick={() => setFiltro(f)}
                        >
                          {f === 'todos' ? 'Todos' : NOMBRE_FAMILIA[f]}
                          <span>{n}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <ul className="ar-lista" aria-label="Artes de la campaña">
                  {subidas.map((u) => (
                    <li key={u.id}>
                      <FilaArte
                        nombre={u.nombre}
                        formato={extension(u.nombre)}
                        progreso={u.progreso}
                        cargando
                        onQuitar={() => cancelar(u.id)}
                      />
                    </li>
                  ))}
                  {visibles.map((a) => (
                    <li key={a.id}>
                      <FilaArte
                        nombre={a.nombre}
                        formato={a.tipo || extension(a.nombre)}
                        tamano={a.tamano}
                        onQuitar={() => s.quitarArchivo(codigo, a.id)}
                      />
                    </li>
                  ))}
                  {archivos.length > 0 && visibles.length === 0 && (
                    <li className="ar-lista__vacia">
                      <EstadoVacio
                        tamano="compacto"
                        tono="busqueda"
                        icono="paintbrush"
                        titulo="Ningún arte coincide"
                        descripcion={busqueda ? `No hay artes que coincidan con «${busqueda}».` : 'No hay artes de este tipo.'}
                        acciones={[{ label: 'Ver todos', variant: 'secondary', onClick: () => { setBusqueda(''); setFiltro('todos'); } }]}
                      />
                    </li>
                  )}
                </ul>
              </section>
            ) : (
              <ul className="ar-consejos">
                <li><Icon name="layers" size={16} /> Sube un archivo por medio o un .zip con todos.</li>
                <li><Icon name="video" size={16} /> Para pantallas digitales también puedes subir video.</li>
                <li><Icon name="drive" size={16} /> Todo se guarda en la carpeta de tu campaña.</li>
              </ul>
            )}
          </>
        )}
      </div>
    </Modal>
  );
}

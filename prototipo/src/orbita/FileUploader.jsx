import { useId, useRef, useState } from 'react';
import { Button } from './Button.jsx';
import { Icon } from './Icon.jsx';
import { IconButton } from './IconButton.jsx';
import { ProgressBar } from './ProgressBar.jsx';
import { cx } from './cx.js';
import './FileUploader.css';

/**
 * Drag and drop File de Órbita (archivo File Uploader). Estados: Default, Hover (al arrastrar)
 * y Error (tipo o peso no permitido).
 * accept: extensiones permitidas en minúsculas (['jpg', 'png', 'ai', 'psd'])
 * maxBytes: peso máximo por archivo · ayuda: texto bajo el título (formatos y peso)
 * onFiles(files): recibe los archivos válidos; los rechazados muestran el error.
 * Opcionales: titulo · icono · boton (texto del botón) · children: contenido extra bajo el botón (p. ej. formatos).
 */
export function FileDropzone({
  accept,
  maxBytes,
  ayuda,
  errorTexto,
  onFiles,
  disabled = false,
  titulo = 'Arrastra y suelta tus archivos',
  icono = 'file',
  boton = 'Seleccionar archivos',
  className,
  children
}) {
  const inputRef = useRef(null);
  const ayudaId = useId();
  const [arrastrando, setArrastrando] = useState(false);
  const [error, setError] = useState(false);

  const recibir = (lista) => {
    const archivos = Array.from(lista || []);
    if (!archivos.length) return;
    const validos = archivos.filter((f) => {
      const ext = f.name.split('.').pop()?.toLowerCase();
      return accept.includes(ext) && f.size <= maxBytes;
    });
    setError(validos.length < archivos.length);
    if (validos.length) onFiles(validos);
  };

  return (
    <div
      className={cx('ui-dropzone', arrastrando && 'is-hover', error && 'is-error', disabled && 'is-disabled', className)}
      onDragOver={(e) => {
        if (disabled) return;
        e.preventDefault();
        setArrastrando(true);
      }}
      onDragLeave={() => setArrastrando(false)}
      onDrop={(e) => {
        e.preventDefault();
        setArrastrando(false);
        if (!disabled) recibir(e.dataTransfer.files);
      }}
    >
      <Icon name={icono} size={32} className="ui-dropzone__icono" />
      <p className="ui-dropzone__titulo">{titulo}</p>
      <p id={ayudaId} className="ui-dropzone__ayuda" role={error ? 'alert' : undefined}>
        {error ? errorTexto : ayuda}
      </p>
      <Button
        variant={arrastrando ? 'primary' : 'secondary'}
        size="xs"
        disabled={disabled}
        aria-describedby={ayudaId}
        onClick={() => inputRef.current?.click()}
      >
        {boton}
      </Button>
      {children}
      <input
        ref={inputRef}
        type="file"
        multiple
        hidden
        accept={accept.map((a) => `.${a}`).join(',')}
        onChange={(e) => {
          recibir(e.target.files);
          e.target.value = '';
        }}
      />
    </div>
  );
}

/**
 * Loader de Órbita (tarjeta de archivo), tamaño SM. Estados: Loader (con % y tiempo restante),
 * Complete y Error.
 * nombre · formato (texto corto: PNG, AI…) · detalle (texto bajo el nombre)
 * miniatura: src opcional de una imagen; sustituye al ícono de formato · icono: ícono del formato (por defecto file)
 * progreso: 0–100 (solo en Loader) · estado: 'cargando' | 'completo' | 'error'
 * onQuitar · onReintentar (solo en Error)
 */
export function FileItem({ nombre, formato, detalle, miniatura, icono = 'file', progreso = 0, estado = 'completo', onQuitar, onReintentar, className }) {
  return (
    <div className={cx('ui-file-item', `is-${estado}`, className)}>
      {miniatura ? (
        <img className="ui-file-item__miniatura" src={miniatura} alt="" />
      ) : (
        <span className="ui-file-item__formato" aria-hidden="true">
          <Icon name={icono} size={24} />
          <span className="ui-file-item__etiqueta">{formato}</span>
        </span>
      )}
      <div className="ui-file-item__textos">
        <p className="ui-file-item__nombre" title={nombre}>{nombre}</p>
        <p className="ui-file-item__detalle">{estado === 'error' ? 'Error al cargar el archivo.' : detalle}</p>
        {estado === 'cargando' && <ProgressBar value={progreso} size="xxs" showPercentage={false} aria-label={`Subiendo ${nombre}`} />}
      </div>
      <div className="ui-file-item__acciones">
        {estado === 'error' && onReintentar && (
          <IconButton icon="refresh" label="Reintentar" variant="tertiary" size="xxs" tooltip={false} onClick={onReintentar} />
        )}
        {estado === 'completo' && onQuitar && (
          <IconButton icon="trash" label={`Quitar ${nombre}`} variant="tertiary" size="xxs" tooltip={false} onClick={onQuitar} />
        )}
        {estado === 'cargando' && onQuitar && (
          <IconButton icon="x" label={`Cancelar ${nombre}`} variant="tertiary" size="xxs" tooltip={false} onClick={onQuitar} />
        )}
      </div>
    </div>
  );
}

export default FileDropzone;

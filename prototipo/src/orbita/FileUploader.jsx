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
 */
export function FileDropzone({ accept, maxBytes, ayuda, errorTexto, onFiles, disabled = false, className }) {
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
      <Icon name="file" size={32} className="ui-dropzone__icono" />
      <p className="ui-dropzone__titulo">Arrastra y suelta tus archivos</p>
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
        Seleccionar archivos
      </Button>
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
 * progreso: 0–100 (solo en Loader) · estado: 'cargando' | 'completo' | 'error'
 * onQuitar · onReintentar (solo en Error)
 */
export function FileItem({ nombre, formato, detalle, progreso = 0, estado = 'completo', onQuitar, onReintentar, className }) {
  return (
    <div className={cx('ui-file-item', `is-${estado}`, className)}>
      <span className="ui-file-item__formato" aria-hidden="true">
        <Icon name="file" size={24} />
        <span className="ui-file-item__etiqueta">{formato}</span>
      </span>
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

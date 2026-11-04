import { useEffect, useRef, useState } from 'react';
import { Avatar, Button, Drawer, Icon, Input, useToast } from '../orbita';
import { useStore } from '../store/index.js';
import './configuracion.css';

const MAX_BYTES = 5 * 1024 * 1024;
const CORREO_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Lee una imagen y la reduce para guardarla en el navegador: foto recortada a cuadrado de 256 px (JPEG);
// logo dentro de 400 × 200 px sin recortar (PNG, conserva la transparencia). Los SVG se guardan tal cual.
function leerImagen(file, tipo) {
  return new Promise((resolve, reject) => {
    const lector = new FileReader();
    lector.onerror = () => reject(new Error('lectura'));
    lector.onload = () => {
      if (file.type === 'image/svg+xml') return resolve(lector.result);
      const img = new Image();
      img.onerror = () => reject(new Error('imagen'));
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (tipo === 'foto') {
          const lado = Math.min(img.width, img.height);
          canvas.width = 256;
          canvas.height = 256;
          ctx.drawImage(img, (img.width - lado) / 2, (img.height - lado) / 2, lado, lado, 0, 0, 256, 256);
          resolve(canvas.toDataURL('image/jpeg', 0.85));
        } else {
          const escala = Math.min(1, 400 / img.width, 200 / img.height);
          canvas.width = Math.round(img.width * escala);
          canvas.height = Math.round(img.height * escala);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL('image/png'));
        }
      };
      img.src = lector.result;
    };
    lector.readAsDataURL(file);
  });
}

/**
 * Carga de una imagen (foto de perfil o logo): vista previa, botón para elegir y para quitar, y error
 * si el archivo no es imagen o pesa más de 5 MB.
 */
function CargaImagen({ tipo, valor, nombre, onCambio }) {
  const inputRef = useRef(null);
  const [error, setError] = useState(null);
  const esFoto = tipo === 'foto';

  const elegir = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (!file.type.startsWith('image/') || file.size > MAX_BYTES) {
      setError('Usa una imagen JPG, PNG o SVG de hasta 5 MB.');
      return;
    }
    try {
      onCambio(await leerImagen(file, tipo));
      setError(null);
    } catch {
      setError('No pudimos leer la imagen. Intenta con otra.');
    }
  };

  return (
    <div className="cfg-imagen">
      <button
        type="button"
        className={esFoto ? 'cfg-imagen__vista cfg-imagen__vista--foto' : 'cfg-imagen__vista cfg-imagen__vista--logo'}
        onClick={() => inputRef.current?.click()}
        aria-label={esFoto ? 'Cambiar foto de perfil' : 'Cambiar logo de la empresa'}
      >
        {valor ? (
          <img src={valor} alt="" />
        ) : esFoto ? (
          <Avatar name={nombre} type="letter" size="xl" color="blue" theme="solid" decorative />
        ) : (
          <span className="cfg-imagen__vacio"><Icon name="image" size={24} /></span>
        )}
        <span className="cfg-imagen__camara" aria-hidden="true"><Icon name="camera" size={10} /></span>
      </button>
      <div className="cfg-imagen__textos">
        <strong>{esFoto ? 'Foto de perfil' : 'Logo de la empresa'}</strong>
        <span className={error ? 'cfg-imagen__ayuda is-error' : 'cfg-imagen__ayuda'} role={error ? 'alert' : undefined}>
          {error || (esFoto ? 'JPG o PNG. Se recorta en círculo.' : 'PNG o SVG con fondo transparente. Se verá junto a tu nombre.')}
        </span>
        <div className="cfg-imagen__acciones">
          <Button variant="secondary" size="xs" iconLeft="upload" onClick={() => inputRef.current?.click()}>
            {valor ? 'Cambiar' : esFoto ? 'Subir foto' : 'Subir logo'}
          </Button>
          {valor && (
            <Button variant="tertiary" size="xs" iconLeft="trash" onClick={() => onCambio(null)}>
              Quitar
            </Button>
          )}
        </div>
      </div>
      <input ref={inputRef} type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml" hidden onChange={elegir} />
    </div>
  );
}

/** Cómo se verá el usuario en la barra superior con los datos del borrador. */
function Vista({ usuario, empresa }) {
  return (
    <div className="cfg-vista" aria-hidden="true">
      <span className="cfg-vista__etiqueta">Así te verán en el portal</span>
      <div className="cfg-vista__chip">
        {empresa.logo && <img className="cfg-vista__logo" src={empresa.logo} alt="" />}
        <Avatar name={usuario.nombre || '?'} src={usuario.foto || undefined} size="sm" color="blue" theme="solid" decorative />
        <span className="cfg-vista__textos">
          <strong>{usuario.nombre || 'Tu nombre'}</strong>
          <span>{empresa.nombreComercial || empresa.razonSocial || 'Tu empresa'}</span>
        </span>
      </div>
    </div>
  );
}

/**
 * Panel "Configuración de la cuenta" (Drawer): datos del contacto (foto, nombre, puesto, correo, teléfono)
 * y de la empresa (logo, nombre comercial, razón social, teléfono, dirección). Se edita un borrador y se
 * guarda con "Guardar cambios". El nombre de contacto y el nombre comercial son obligatorios.
 */
export function ConfiguracionCuenta({ open, onClose }) {
  const s = useStore();
  const { toast } = useToast();
  const [borrador, setBorrador] = useState(s.perfil);

  useEffect(() => {
    if (open) setBorrador(s.perfil);
    // Solo al abrir: mientras está abierto se edita el borrador.
  }, [open]);

  if (!open) return null;
  const { usuario, empresa } = borrador;
  const cambiarUsuario = (campo) => (valor) => setBorrador((b) => ({ ...b, usuario: { ...b.usuario, [campo]: valor } }));
  const cambiarEmpresa = (campo) => (valor) => setBorrador((b) => ({ ...b, empresa: { ...b.empresa, [campo]: valor } }));
  const alEscribir = (fn) => (e) => fn(e.target.value);

  const errores = {
    nombre: usuario.nombre.trim() ? null : 'Escribe el nombre de contacto.',
    correo: !usuario.correo.trim() || CORREO_VALIDO.test(usuario.correo.trim()) ? null : 'Escribe un correo válido, por ejemplo nombre@empresa.com.',
    nombreComercial: empresa.nombreComercial.trim() ? null : 'Escribe el nombre comercial.'
  };
  const valido = !Object.values(errores).some(Boolean);
  const cambio = JSON.stringify(borrador) !== JSON.stringify(s.perfil);

  const guardar = () => {
    s.guardarPerfil(borrador);
    toast({ title: 'Datos guardados', color: 'success' });
    onClose();
  };

  const pie = (
    <div className="cfg-pie">
      <Button variant="secondary" size="md" onClick={onClose}>Cancelar</Button>
      <Button variant="primary" size="md" iconLeft="check" disabled={!valido || !cambio} onClick={guardar}>
        Guardar cambios
      </Button>
    </div>
  );

  return (
    <Drawer open onClose={onClose} size="lg" icon="gear" title="Configuración de la cuenta" subtitle="Tu perfil y los datos de tu empresa" footer={pie} closeLabel="Cerrar configuración">
      <div className="cfg">
        <Vista usuario={usuario} empresa={empresa} />

        <section className="cfg-seccion" aria-labelledby="cfg-perfil-t">
          <h3 id="cfg-perfil-t" className="cfg-seccion__titulo"><Icon name="user" size={16} /> Tu perfil</h3>
          <CargaImagen tipo="foto" valor={usuario.foto} nombre={usuario.nombre} onCambio={cambiarUsuario('foto')} />
          <div className="cfg-campos">
            <Input label="Nombre de contacto" size="sm" value={usuario.nombre} error={errores.nombre} onChange={alEscribir(cambiarUsuario('nombre'))} autoComplete="name" />
            <Input label="Puesto" size="sm" value={usuario.puesto} onChange={alEscribir(cambiarUsuario('puesto'))} placeholder="Gerente de marketing" autoComplete="organization-title" />
            <Input label="Correo" size="sm" type="email" iconLeft="mail" value={usuario.correo} error={errores.correo} onChange={alEscribir(cambiarUsuario('correo'))} autoComplete="email" />
            <Input label="Teléfono" size="sm" type="tel" iconLeft="phone" value={usuario.telefono} onChange={alEscribir(cambiarUsuario('telefono'))} placeholder="33 1234 5678" autoComplete="tel" />
          </div>
        </section>

        <section className="cfg-seccion" aria-labelledby="cfg-empresa-t">
          <h3 id="cfg-empresa-t" className="cfg-seccion__titulo"><Icon name="building" size={16} /> Tu empresa</h3>
          <CargaImagen tipo="logo" valor={empresa.logo} onCambio={cambiarEmpresa('logo')} />
          <div className="cfg-campos">
            <Input label="Nombre comercial" size="sm" value={empresa.nombreComercial} error={errores.nombreComercial} onChange={alEscribir(cambiarEmpresa('nombreComercial'))} autoComplete="organization" />
            <Input label="Razón social" size="sm" value={empresa.razonSocial} onChange={alEscribir(cambiarEmpresa('razonSocial'))} placeholder="Empresa S.A. de C.V." />
            <Input label="Teléfono de la empresa" size="sm" type="tel" iconLeft="phone" value={empresa.telefono} onChange={alEscribir(cambiarEmpresa('telefono'))} placeholder="33 3640 0000" />
            <Input className="cfg-campo--ancho" label="Dirección" size="sm" iconLeft="location" value={empresa.direccion} onChange={alEscribir(cambiarEmpresa('direccion'))} placeholder="Calle, número, colonia, ciudad, C.P." autoComplete="street-address" />
          </div>
        </section>
      </div>
    </Drawer>
  );
}

export default ConfiguracionCuenta;

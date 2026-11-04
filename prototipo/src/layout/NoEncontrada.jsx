import { useNavigate } from 'react-router-dom';
import { EstadoVacio } from './EstadoVacio.jsx';

/**
 * Estado "no encontrado" del portal (campaña, marca o página inexistente) con salida a Mis campañas.
 * titulo · descripcion · codigo: texto grande opcional (p. ej. 404).
 */
export function NoEncontrada({
  titulo = 'No encontramos esta campaña',
  descripcion = 'El enlace puede estar incompleto o la campaña ya no está disponible en tu cuenta.',
  codigo
}) {
  const navigate = useNavigate();
  return (
    <EstadoVacio
      tarjeta
      tamano="pagina"
      tono="busqueda"
      icono="compass"
      codigo={codigo}
      titulo={titulo}
      descripcion={descripcion}
      acciones={[
        { label: 'Ir a Mis campañas', icono: 'arrow-left', onClick: () => navigate('/campanas') },
        { label: 'Volver atrás', variant: 'tertiary', onClick: () => navigate(-1) }
      ]}
      nota="Si crees que es un error, contacta a tu ejecutivo de IMJ."
    />
  );
}

export default NoEncontrada;

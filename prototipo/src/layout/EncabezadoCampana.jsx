import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useStore } from '../store/index.js';

/**
 * Lee :codigo de la ruta y devuelve la campaña de la semilla (campanaFija: codigo, nombre,
 * inicio, fin, medios…) con su `fase` actual del store, o null si no existe.
 */
export function useCampanaDeRuta() {
  const { codigo } = useParams();
  const s = useStore();
  const fija = codigo ? s.campana(codigo) : null;
  const fase = fija ? s.estado.campanas[codigo]?.fase : undefined;
  return useMemo(() => (fija && fase ? { ...fija, fase } : null), [fija, fase]);
}

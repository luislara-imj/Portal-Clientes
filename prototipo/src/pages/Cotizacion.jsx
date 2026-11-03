import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge, Button, Card, useToast } from '../orbita';
import { useToastUnaVez } from '../layout/useToastUnaVez.js';
import { formatoFecha, formatoMXN, mediosSi, useStore } from '../store/index.js';
import { PaginaCampana } from '../layout/PaginaCampana.jsx';
import { FilaArtes, ModalArtes } from '../layout/ArtesCampana.jsx';
import { rutaCampana, vigencia } from '../layout/campanas.js';
import { Bloqueada, MediosCotizados, ModalAceptar, ModalIncluye, Montos } from './cotizacion/partes.jsx';
import '../layout/layout.css';

export default function Cotizacion() {
  return <PaginaCampana fase="cotizacion">{(campana) => <ContenidoCotizacion campana={campana} />}</PaginaCampana>;
}

function ContenidoCotizacion({ campana }) {
  const s = useStore();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [confirmando, setConfirmando] = useState(false);
  const [viendoIncluye, setViendoIncluye] = useState(false);
  // Modal de artes: null (cerrado) | { aviso } (aviso = se abrió desde "Aceptar" sin artes).
  const [artes, setArtes] = useState(null);
  const { codigo } = campana;

  const fase = s.fasesDeCampana(codigo).find((f) => f.clave === 'cotizacion');
  // Aviso como Toast, una sola vez al entrar, si la cotización cambió después de confirmar.
  const cotActual = s.cotizacion(codigo);
  useToastUnaVez(cotActual?.actualizada && !cotActual?.aceptada && fase?.estado !== 'bloqueada' ? 'cot-actualizada' : null, {
    color: 'info',
    title: 'Actualizamos la cotización con tus últimos cambios'
  });
  if (!fase || fase.estado === 'bloqueada') return <Bloqueada motivo={fase?.motivo} />;

  const cot = s.cotizacion(codigo);
  if (!cot) return null;
  const estadoCampana = s.estado.campanas[codigo];
  const puedeAceptar = fase.editable && cot.puedeAceptar;
  const textoVigencia = vigencia(campana.inicio, campana.fin);

  const aceptar = () => {
    s.aceptarCotizacion(codigo);
    setConfirmando(false);
    toast({ title: 'Campaña aceptada. La instalación ya comenzó.', color: 'success' });
    navigate(rutaCampana(codigo, 'instalacion'));
  };

  // Sin artes no se arranca: en vez de la confirmación se abre el modal de artes con el aviso.
  const pedirAceptar = () => {
    if (s.archivos(codigo).length === 0) setArtes({ aviso: true });
    else setConfirmando(true);
  };

  const descargar = () => toast({ title: 'La descarga estará disponible en la versión final', color: 'info' });

  const datos = [
    ['Vigencia', textoVigencia],
    ['Fecha de emisión', formatoFecha(campana.emision)],
    ['Responsable comercial', s.semilla.responsableComercial],
    ['Cliente', `${s.cliente.nombre} · ${s.cliente.empresa}`]
  ];

  return (
    <div className="mc-cuerpo cot">
      <Card as="section" padding="md" className="mc-principal cot-principal" aria-labelledby={cot.tipos.length === 0 ? 'cot-vacio-t' : 'cot-medios-t'}>
        {cot.tipos.length === 0 ? (
          <>
            <h2 id="cot-vacio-t" className="pg-subtitulo">Medios cotizados</h2>
            <p className="pg-texto">No hay medios incluidos en la cotización. Marca Sí en la propuesta para cotizarlos.</p>
          </>
        ) : (
          <MediosCotizados key={codigo} tipos={cot.tipos} medios={mediosSi(s.estado, codigo)} />
        )}
      </Card>

      <aside className="mc-lateral cot-lateral" aria-label="Datos y resumen de la cotización">
        <Card as="section" padding="md" aria-labelledby="cot-datos-t">
          <div className="pg-fila">
            <h2 id="cot-datos-t" className="pg-subtitulo">Datos de la cotización</h2>
            {cot.aceptada && (
              <Badge color="success" theme="soft" icon="check">
                Aceptada el {formatoFecha(estadoCampana.aceptadaEn)}
              </Badge>
            )}
          </div>
          <dl className="cot-datos">
            {datos.map(([etiqueta, valor]) => (
              <div key={etiqueta} className="cot-dato">
                <dt>{etiqueta}</dt>
                <dd>{valor}</dd>
              </div>
            ))}
          </dl>
        </Card>

        <Card as="section" padding="md" className="cot-resumen" aria-labelledby="cot-cierre-t">
          <h2 id="cot-cierre-t" className="pg-subtitulo">Resumen</h2>
          <div className="cot-resumen__montos">
            <Montos
              filas={[
                ['Subtotal', formatoMXN(cot.subtotal)],
                [`Descuento (${cot.descuentoPct}%)`, `-${formatoMXN(cot.descuento)}`],
                ['Subtotal con descuento', formatoMXN(cot.subtotalConDescuento)],
                [`IVA ${cot.ivaPct}%`, formatoMXN(cot.iva)],
                ['Total con IVA', formatoMXN(cot.total), true]
              ]}
            />
          </div>
          <FilaArtes codigo={codigo} onAbrir={() => setArtes({ aviso: false })} />
          <div className="cot-acciones">
            {puedeAceptar && (
              <Button variant="primary" size="lg" fullWidth onClick={pedirAceptar}>
                Aceptar y arrancar campaña
              </Button>
            )}
            <Button variant="secondary" size="md" fullWidth iconLeft="download" onClick={descargar}>
              Descargar PDF
            </Button>
            <Button variant="tertiary" size="sm" fullWidth onClick={() => setViendoIncluye(true)}>
              Qué incluye tu campaña
            </Button>
          </div>
        </Card>
      </aside>

      <ModalArtes codigo={codigo} open={!!artes} aviso={!!artes?.aviso} onClose={() => setArtes(null)} />

      <ModalIncluye open={viendoIncluye} onClose={() => setViendoIncluye(false)} incluye={cot.textos.incluye} />

      <ModalAceptar
        open={confirmando}
        onCancelar={() => setConfirmando(false)}
        onAceptar={aceptar}
        datos={[
          ['Código', codigo],
          ['Medios incluidos', String(cot.medios)],
          ['Vigencia', textoVigencia],
          ['Total con IVA', formatoMXN(cot.total), true]
        ]}
      />
    </div>
  );
}

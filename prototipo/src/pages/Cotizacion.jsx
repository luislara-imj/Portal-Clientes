import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge, Button, Card, Icon, useToast } from '../orbita';
import { useToastUnaVez } from '../layout/useToastUnaVez.js';
import { formatoFecha, formatoMXN, mediosSi, useStore } from '../store/index.js';
import { PaginaCampana } from '../layout/PaginaCampana.jsx';
import { EstadoVacio } from '../layout/EstadoVacio.jsx';
import { ModalArtes } from '../layout/ArtesCampana.jsx';
import { rutaCampana, vigencia } from '../layout/campanas.js';
import { Bloqueada, MediosCotizados, ModalAceptar, ModalIncluye, Montos } from './cotizacion/partes.jsx';
import { VistaPreviaPdf } from './cotizacion/VistaPreviaPdf.jsx';
import { DIAS_VIGENCIA_COTIZACION, sumarDias } from './cotizacion/documento.js';
import { ejecutivoDe } from '../data/ejecutivos.js';
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
  const [viendoPdf, setViendoPdf] = useState(false);
  // Modal de artes: solo se abre desde "Aceptar" cuando aún no hay artes (los artes tienen su propio apartado).
  const [pidiendoArtes, setPidiendoArtes] = useState(false);
  const { codigo } = campana;

  const fase = s.fasesDeCampana(codigo).find((f) => f.clave === 'cotizacion');
  // Aviso como Toast, una sola vez al entrar, si la cotización cambió después de confirmar.
  const cotActual = s.cotizacion(codigo);
  useToastUnaVez(cotActual?.actualizada && !cotActual?.aceptada && fase?.estado !== 'bloqueada' ? 'cot-actualizada' : null, {
    color: 'info',
    title: 'Actualizamos la cotización con tus últimos cambios'
  });
  if (!fase || fase.estado === 'bloqueada') return <Bloqueada motivo={fase?.motivo} onIrPropuesta={() => navigate(rutaCampana(codigo, 'propuesta'))} />;

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
    if (s.archivos(codigo).length === 0) setPidiendoArtes(true);
    else setConfirmando(true);
  };

  const validaHasta = sumarDias(campana.emision, DIAS_VIGENCIA_COTIZACION);
  // Responsable: el ejecutivo de IMJ de la campaña; si no hay, el valor de la semilla ("Por asignar").
  const ejecutivo = ejecutivoDe(codigo);
  const responsable = ejecutivo?.nombre ?? s.semilla.responsableComercial;
  const datos = [
    ['calendar', 'Vigencia de la campaña', textoVigencia],
    ['clock', 'Emisión', `${formatoFecha(campana.emision)} · vence ${formatoFecha(validaHasta)}`],
    ['user', 'Responsable comercial', responsable],
    ['building', 'Cliente', `${s.cliente.nombre} · ${s.cliente.empresa}`]
  ];

  return (
    <div className="mc-cuerpo cot">
      <Card as="section" padding="md" className="mc-principal cot-principal" aria-labelledby={cot.tipos.length === 0 ? undefined : 'cot-medios-t'}>
        {cot.tipos.length === 0 ? (
          <EstadoVacio
            tamano="pagina"
            icono="billboard"
            titulo="Tu cotización no tiene medios"
            descripcion="Incluye en la propuesta los medios que quieres para tu campaña y aquí verás su cotización."
            acciones={[{ label: 'Ir a la propuesta', icono: 'billboard', onClick: () => navigate(rutaCampana(codigo, 'propuesta')) }]}
          />
        ) : (
          <MediosCotizados
            key={codigo}
            tipos={cot.tipos}
            medios={mediosSi(s.estado, codigo)}
            campana={campana}
            totalConDescuento={cot.subtotalConDescuento}
            validaHasta={validaHasta}
          />
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
            {datos.map(([icono, etiqueta, valor]) => (
              <div key={etiqueta} className="cot-dato">
                <span className="cot-dato__icono" aria-hidden="true"><Icon name={icono} size={16} /></span>
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
                [`Descuento (${cot.descuentoPct}%)`, `−${formatoMXN(cot.descuento)}`, 'ahorro'],
                ['Subtotal con descuento', formatoMXN(cot.subtotalConDescuento)],
                [`IVA ${cot.ivaPct}%`, formatoMXN(cot.iva)]
              ]}
            />
          </div>
          <div className="cot-total">
            <span className="cot-total__etiqueta">Total con IVA</span>
            <strong className="cot-total__monto">{formatoMXN(cot.total)}</strong>
            {cot.descuento > 0 && (
              <span className="cot-total__ahorro"><Icon name="tag" size={10} /> Ahorras {formatoMXN(cot.descuento)}</span>
            )}
          </div>
          <div className="cot-acciones">
            {puedeAceptar && (
              <Button variant="primary" size="lg" fullWidth onClick={pedirAceptar}>
                Aceptar y arrancar campaña
              </Button>
            )}
            <div className="cot-acciones__fila">
              <Button variant="secondary" size="md" fullWidth iconLeft="file" onClick={() => setViendoPdf(true)}>
                Ver PDF
              </Button>
              <Button variant="tertiary" size="md" fullWidth onClick={() => setViendoIncluye(true)}>
                Qué incluye
              </Button>
            </div>
          </div>
        </Card>
      </aside>

      {/* Solo en celular: barra inferior fija con el total y la acción principal. */}
      <div className="cot-barra-movil">
        <div className="cot-barra-movil__textos">
          <span>Total con IVA</span>
          <strong>{formatoMXN(cot.total)}</strong>
        </div>
        {puedeAceptar ? (
          <Button variant="primary" size="md" onClick={pedirAceptar}>
            Aceptar
          </Button>
        ) : (
          <Button variant="secondary" size="md" iconLeft="file" onClick={() => setViendoPdf(true)}>
            Ver PDF
          </Button>
        )}
      </div>

      <ModalArtes codigo={codigo} open={pidiendoArtes} aviso onClose={() => setPidiendoArtes(false)} />

      <VistaPreviaPdf
        open={viendoPdf}
        onClose={() => setViendoPdf(false)}
        cot={cot}
        campana={campana}
        cliente={s.cliente}
        responsable={responsable}
        ejecutivo={ejecutivo}
        aceptadaEn={cot.aceptada ? estadoCampana.aceptadaEn : null}
      />

      <ModalIncluye open={viendoIncluye} onClose={() => setViendoIncluye(false)} textos={cot.textos} />

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

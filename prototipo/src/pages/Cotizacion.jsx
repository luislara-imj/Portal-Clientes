import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge, Button, Card, useToast } from '../orbita';
import { useToastUnaVez } from '../layout/useToastUnaVez.js';
import { formatoFecha, formatoMXN, useStore } from '../store/index.js';
import { PaginaCampana } from '../layout/PaginaCampana.jsx';
import { rutaCampana, vigencia } from '../layout/campanas.js';
import { Bloqueada, ModalAceptar, Montos, TablaTipo } from './cotizacion/partes.jsx';
import '../layout/layout.css';

export default function Cotizacion() {
  return <PaginaCampana fase="cotizacion">{(campana) => <ContenidoCotizacion campana={campana} />}</PaginaCampana>;
}

function ContenidoCotizacion({ campana }) {
  const s = useStore();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [confirmando, setConfirmando] = useState(false);
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

  const descargar = () => toast({ title: 'La descarga estará disponible en la versión final', color: 'info' });

  const datos = [
    ['Código', codigo],
    ['Cliente', `${s.cliente.nombre} · ${s.cliente.empresa}`],
    ['Vigencia', textoVigencia],
    ['Responsable comercial', s.semilla.responsableComercial],
    ['Fecha de emisión', formatoFecha(campana.emision)]
  ];

  return (
    <div className="cot">

      <Card as="section" padding="lg" aria-labelledby="cot-datos-t">
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

      <div className="cot-cuerpo">
        <div className="cot-tablas">
          {cot.tipos.length === 0 && (
            <Card padding="lg">
              <p className="pg-texto">No hay medios incluidos en la cotización. Marca Sí en la propuesta para cotizarlos.</p>
            </Card>
          )}
          {cot.tipos.map((t) => <TablaTipo key={t.tipo} tipo={t} />)}
        </div>

        <aside className="cot-cierre" aria-labelledby="cot-cierre-t">
          <Card padding="lg">
            <div className="pg-pila pg-pila--md">
              <h2 id="cot-cierre-t" className="pg-subtitulo">Resumen</h2>
              <Montos
                filas={[
                  ['Subtotal', formatoMXN(cot.subtotal)],
                  [`Descuento (${cot.descuentoPct}%)`, `-${formatoMXN(cot.descuento)}`],
                  ['Subtotal con descuento', formatoMXN(cot.subtotalConDescuento)],
                  [`IVA ${cot.ivaPct}%`, formatoMXN(cot.iva)],
                  ['Total con IVA', formatoMXN(cot.total), true]
                ]}
              />
              <div className="cot-acciones">
                {puedeAceptar && (
                  <Button variant="primary" size="lg" fullWidth onClick={() => setConfirmando(true)}>
                    Aceptar y arrancar campaña
                  </Button>
                )}
                <Button variant="secondary" size="md" fullWidth iconLeft="download" onClick={descargar}>
                  Descargar PDF
                </Button>
              </div>
            </div>
          </Card>
          <Card padding="lg">
            <div className="pg-pila pg-pila--md">
              <div className="pg-pila">
                <h3 className="pg-subtitulo">Tu campaña incluye</h3>
                <ul className="cot-lista">
                  {cot.textos.incluye.map((t) => <li key={t}>{t}</li>)}
                </ul>
              </div>
              <p className="pg-texto">Condiciones de pago: 50% anticipo y 50% contra instalación.</p>
              <p className="pg-texto">Precios sujetos a disponibilidad.</p>
            </div>
          </Card>
        </aside>
      </div>

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

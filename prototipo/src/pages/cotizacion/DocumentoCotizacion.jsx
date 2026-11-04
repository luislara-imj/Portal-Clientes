import { formatoFecha, formatoMXN } from '../../store/index.js';
import logo from '../../orbita/logo/obp-full-light.svg';
import { DIAS_VIGENCIA_COTIZACION, fechaLarga, importeConLetra, sumarDias, tiempoServicio } from './documento.js';
import { tiposOrdenados } from './capas.js';
import './documento.css';

const TELEFONOS = '33 3640 0944 · 33 3640 6194';

// En las tablas el MXN va en el encabezado del documento para que las cifras quepan.
const pesos = (v) => formatoMXN(v).replace(' MXN', '');

function Parte({ titulo, filas }) {
  return (
    <div className="doc-parte">
      <h2 className="doc-parte__titulo">{titulo}</h2>
      <dl>
        {filas.filter(([, v]) => v).map(([etiqueta, valor]) => (
          <div key={etiqueta} className="doc-parte__fila">
            <dt>{etiqueta}</dt>
            <dd>{valor}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

// Tabla de un tipo de medio con las columnas de la cotización formal (docs/TEMPLATES_REFERENCIA.md §2).
function TablaTipo({ tipo, inicio }) {
  return (
    <section className="doc-tipo">
      <h3 className="doc-tipo__titulo">
        {tipo.nombre}
        <span>{tipo.medios === 1 ? '1 medio' : `${tipo.medios} medios`}</span>
      </h3>
      <table className="doc-tabla">
        <thead>
          <tr>
            <th scope="col" className="doc-num">#</th>
            <th scope="col">Ciudad</th>
            <th scope="col">Medio</th>
            <th scope="col">Clave IMJ</th>
            <th scope="col" className="doc-der">Unid.</th>
            <th scope="col">Periodo</th>
            <th scope="col" className="doc-der">Precio unitario (MXN)</th>
            <th scope="col" className="doc-der">Importe (MXN)</th>
          </tr>
        </thead>
        <tbody>
          {tipo.lineas.map((l, i) => (
            <tr key={l.id}>
              <td className="doc-num">{inicio + i}</td>
              <td>{l.plaza || '—'}</td>
              <td className="doc-medio">
                <strong>{l.formato || '—'}</strong>
                <span>{l.detalle || l.nombre || '—'}</span>
              </td>
              <td className="doc-clave">{l.clave || '—'}</td>
              <td className="doc-der">{l.unidades}</td>
              <td className="doc-periodo">
                {formatoFecha(l.inicio)} – {formatoFecha(l.fin)}
                <span>{tiempoServicio(l)}</span>
              </td>
              <td className="doc-der">{pesos(l.precio)}</td>
              <td className="doc-der doc-importe">{pesos(l.subtotal)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <th scope="row" colSpan={7} className="doc-der">Subtotal {tipo.nombre.toLowerCase()}</th>
            <td className="doc-der doc-importe">{pesos(tipo.subtotal)}</td>
          </tr>
        </tfoot>
      </table>
    </section>
  );
}

/**
 * Cotización formal en hoja carta: encabezado con logo y folio, datos del cliente y la campaña,
 * una tabla por tipo de medio, totales con importe con letra, condiciones y firmas.
 * Es lo que se imprime o guarda como PDF; data-theme="light" la deja en papel blanco aunque el portal esté en oscuro.
 * cot = cotizacion(codigo) · campana = campanaFija · cliente · responsable · ejecutivo (opcional: correo y teléfono)
 * aceptadaEn (ms, opcional)
 */
export function DocumentoCotizacion({ cot, campana, cliente, responsable, ejecutivo, aceptadaEn }) {
  const tipos = tiposOrdenados(cot.tipos);
  const validaHasta = sumarDias(campana.emision, DIAS_VIGENCIA_COTIZACION);
  const t = cot.textos;
  // Numeración corrida de las líneas a lo largo de todas las tablas.
  const inicios = tipos.reduce((acc, tipo, i) => [...acc, i === 0 ? 1 : acc[i - 1] + tipos[i - 1].lineas.length], []);

  return (
    <article className="doc" data-theme="light" aria-label={`Cotización ${campana.codigo}`}>
      <header className="doc-encabezado">
        <div className="doc-marca">
          <img src={logo} alt="OBP" className="doc-marca__logo" />
          <div>
            <p className="doc-marca__nombre">OBP</p>
            <p className="doc-marca__lema">Out-of-Home Business Platform</p>
            <p className="doc-marca__contacto">Tel. {TELEFONOS}</p>
          </div>
        </div>
        <div className="doc-titulo">
          <h1>Cotización</h1>
          <dl>
            <div><dt>Folio</dt><dd>{campana.codigo}</dd></div>
            <div><dt>Fecha de emisión</dt><dd>{fechaLarga(campana.emision)}</dd></div>
            <div><dt>Válida hasta</dt><dd>{fechaLarga(validaHasta)}</dd></div>
          </dl>
        </div>
      </header>

      <div className="doc-partes">
        <Parte titulo="Cliente" filas={[['Atención a', cliente.nombre], ['Empresa', cliente.empresa]]} />
        <Parte
          titulo="Campaña"
          filas={[
            ['Nombre', campana.marca ? `${campana.marca} · ${campana.nombre}` : campana.nombre],
            ['Vigencia', `${fechaLarga(campana.inicio)} al ${fechaLarga(campana.fin)}`],
            ['Responsable comercial', responsable],
            ['Contacto', ejecutivo ? `${ejecutivo.correo} · ${ejecutivo.telefono}` : null]
          ]}
        />
      </div>

      <p className="doc-intro">
        Por medio de la presente ponemos a su consideración la propuesta económica de los medios que eligió para su campaña
        de publicidad exterior. Precios en pesos mexicanos (MXN).
      </p>

      {tipos.map((tipo, i) => <TablaTipo key={tipo.tipo} tipo={tipo} inicio={inicios[i]} />)}

      <section className="doc-cierre">
        <div className="doc-letra">
          <span className="doc-etiqueta">Importe total con letra</span>
          <p>{importeConLetra(cot.total)}</p>
        </div>
        <table className="doc-totales">
          <tbody>
            <tr><th scope="row">Subtotal</th><td>{formatoMXN(cot.subtotal)}</td></tr>
            <tr className="doc-totales__descuento"><th scope="row">Descuento ({cot.descuentoPct}%)</th><td>−{formatoMXN(cot.descuento)}</td></tr>
            <tr><th scope="row">Subtotal con descuento</th><td>{formatoMXN(cot.subtotalConDescuento)}</td></tr>
            <tr><th scope="row">IVA ({cot.ivaPct}%)</th><td>{formatoMXN(cot.iva)}</td></tr>
          </tbody>
          <tfoot>
            <tr><th scope="row">Total</th><td>{formatoMXN(cot.total)}</td></tr>
          </tfoot>
        </table>
      </section>

      <section className="doc-condiciones">
        <div>
          <h2 className="doc-parte__titulo">Su campaña incluye</h2>
          <ul>{t.incluye.map((x) => <li key={x}>{x}</li>)}</ul>
        </div>
        <div>
          <h2 className="doc-parte__titulo">Condiciones de pago</h2>
          <p>{t.condicionesPago}</p>
          <h2 className="doc-parte__titulo">Aclaraciones</h2>
          <p>{t.aclaraciones}</p>
        </div>
      </section>

      <section className="doc-firmas">
        <div className="doc-firma">
          <span className="doc-firma__linea" />
          <strong>{responsable}</strong>
          <span>{ejecutivo?.puesto ?? 'Responsable comercial'} · IMJ Media</span>
        </div>
        <div className="doc-firma">
          {aceptadaEn ? (
            <span className="doc-firma__sello">Aceptada en el portal el {formatoFecha(aceptadaEn)}</span>
          ) : (
            <span className="doc-firma__linea" />
          )}
          <strong>{cliente.nombre}</strong>
          <span>Aceptación del cliente · {cliente.empresa}</span>
        </div>
      </section>

      <footer className="doc-pie">
        Folio {campana.codigo} · Cotización sujeta a disponibilidad de los medios al momento de la aceptación ·
        ¿Dudas? Llame al {TELEFONOS} o escriba a su asesor.
      </footer>
    </article>
  );
}

export default DocumentoCotizacion;

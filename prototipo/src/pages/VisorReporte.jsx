import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Card, Lightbox, Tag, useToast } from '../orbita';
import { useStore } from '../store/index.js';
import { PaginaCampana } from '../layout/PaginaCampana.jsx';
import { rutaCampana, vigencia } from '../layout/campanas.js';
import { FichaMedio } from './reportes/FichaMedio.jsx';
import { ReportesBloqueados } from './reportes/ReportesBloqueados.jsx';
import {
  AVISO_DESCARGA, agruparPorPlazaYTipo, anclaPlaza, anclaTipo, cuantos, fechaCorta, fichaDe, mediosInstalados
} from './reportes/datos.js';
import '../layout/layout.css';
import './reportes/reportes.css';

// Visor de un reporte (#/campanas/:codigo/reportes/:periodo), como el archivo de reporte de Figma
// (nodo 1479:94329) adaptado a pantalla: portada, índice por plaza y tipo, fichas con fotos.
export default function VisorReporte() {
  const { codigo, periodo } = useParams();
  const s = useStore();
  const nombre = s.reportes(codigo)?.lista.find((r) => r.id === periodo)?.nombre ?? periodo;
  return (
    <PaginaCampana fase="reportes" migasExtra={[{ label: nombre }]}>
      {(campana) => <ContenidoVisor campana={campana} periodo={periodo} />}
    </PaginaCampana>
  );
}

// Desplaza a la sección sin tocar el hash (lo usa el router) y le pasa el foco.
function irA(e, id) {
  e.preventDefault();
  const destino = document.getElementById(id);
  if (!destino) return;
  destino.scrollIntoView({ behavior: 'smooth', block: 'start' });
  destino.focus({ preventScroll: true });
}

function ContenidoVisor({ campana, periodo }) {
  const s = useStore();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [galeria, setGaleria] = useState(null); // { imagenes, indice }
  const codigo = campana.codigo;

  // Al abrir un reporte (o cambiar de periodo) se empieza por la portada.
  useEffect(() => { window.scrollTo(0, 0); }, [codigo, periodo]);
  const volver = { label: 'Volver a reportes', onClick: () => navigate(rutaCampana(codigo, 'reportes')) };

  const fase = s.fasesDeCampana(codigo).find((f) => f.clave === 'reportes');
  const rep = s.reportes(codigo);
  const reporte = rep?.lista.find((r) => r.id === periodo) || null;
  const publicado = !!reporte && reporte.estado === 'publicado' && rep.disponible && fase?.estado !== 'bloqueada';

  const medios = useMemo(() => (publicado ? mediosInstalados(s, codigo) : []), [publicado, s, codigo]);
  const plazas = useMemo(() => agruparPorPlazaYTipo(medios), [medios]);

  if (!reporte) {
    return <ReportesBloqueados titulo="Reporte no encontrado" motivo="No existe un reporte para este periodo." accion={volver} />;
  }
  if (!publicado) {
    const motivo = fase?.estado === 'bloqueada'
      ? fase.motivo
      : reporte.publicacion ? `Se publica el ${fechaCorta(reporte.publicacion)}.` : reporte.motivo;
    return <ReportesBloqueados titulo={reporte.nombre} motivo={motivo} accion={volver} />;
  }

  const periodoTexto = reporte.periodoInicio && reporte.periodoFin
    ? `${fechaCorta(reporte.periodoInicio)} – ${fechaCorta(reporte.periodoFin)}`
    : `${fechaCorta(campana.inicio)} – ${fechaCorta(campana.fin)}`;

  const abrir = (ficha, indice) => setGaleria({
    indice,
    imagenes: ficha.pies.map((pie) => ({ alt: `${pie} de ${ficha.clave}`, caption: `${pie} · ${ficha.clave}` }))
  });

  return (
    <>
      <div className="rp-barra">
        <Button variant="secondary" size="sm" iconLeft="arrow-left" onClick={volver.onClick}>
          {volver.label}
        </Button>
        <Button variant="secondary" size="sm" iconLeft="download" onClick={() => toast({ title: AVISO_DESCARGA, color: 'info' })}>
          Descargar
        </Button>
      </div>

      <article className="rp-visor" aria-labelledby="rp-portada-t">
        <Card as="section" padding="lg" className="rp-portada">
          <h2 id="rp-portada-t" className="rp-portada__titulo">Reporte de campaña</h2>
          <p className="rp-portada__nombre">{campana.nombre}</p>
          <p className="rp-portada__reporte">{reporte.nombre}</p>
          <div className="pg-fila">
            <Tag color="gray" border>{`Periodo ${periodoTexto}`}</Tag>
          </div>
          <p className="pg-meta">
            Publicado el {fechaCorta(reporte.publicacion ?? reporte.publicadoEn)} · Vigencia {vigencia(campana.inicio, campana.fin)}
          </p>
        </Card>

        <Card as="nav" padding="md" className="rp-indice" aria-labelledby="rp-indice-t">
          <h2 id="rp-indice-t" className="rp-seccion__titulo">Índice</h2>
          {plazas.length === 0 ? (
            <p className="pg-texto">Sin dato: este reporte no tiene medios instalados.</p>
          ) : (
            <ol className="rp-indice__plazas">
              {plazas.map((p) => (
                <li key={p.plaza}>
                  <a className="rp-enlace rp-enlace--plaza" href={`#${anclaPlaza(p.plaza)}`} onClick={(e) => irA(e, anclaPlaza(p.plaza))}>
                    {p.nombre}
                  </a>
                  <span className="pg-meta"> · {cuantos(p.total)}</span>
                  <ul className="rp-indice__tipos">
                    {p.tipos.map((t) => (
                      <li key={t.tipo}>
                        <a className="rp-enlace" href={`#${anclaTipo(p.plaza, t.tipo)}`} onClick={(e) => irA(e, anclaTipo(p.plaza, t.tipo))}>
                          {t.nombre}
                        </a>
                        <span className="pg-meta"> · {cuantos(t.medios.length)}</span>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ol>
          )}
        </Card>

        {plazas.map((p) => (
          <section key={p.plaza} className="rp-plaza" aria-labelledby={anclaPlaza(p.plaza)}>
            <h2 id={anclaPlaza(p.plaza)} className="rp-plaza__titulo" tabIndex={-1}>
              {p.nombre}
            </h2>
            {p.tipos.map((t) => (
              <section key={t.tipo} className="rp-tipo" aria-labelledby={anclaTipo(p.plaza, t.tipo)}>
                <div className="rp-tipo__cabeza">
                  <h3 id={anclaTipo(p.plaza, t.tipo)} className="rp-seccion__titulo" tabIndex={-1}>
                    {t.nombre}
                  </h3>
                  <span className="pg-meta">{cuantos(t.medios.length)}</span>
                </div>
                <ul className="rp-fichas">
                  {t.medios.map((m, i) => {
                    const ficha = fichaDe(m, campana);
                    return (
                      <FichaMedio
                        key={m.id}
                        ficha={ficha}
                        titulo={`${t.nombre} en ${p.nombre}: medio ${i + 1} de ${t.medios.length}, ${ficha.etiquetaClave} ${ficha.clave}`}
                        onFoto={(indice) => abrir(ficha, indice)}
                      />
                    );
                  })}
                </ul>
              </section>
            ))}
          </section>
        ))}

        <div className="rp-barra">
          <Button variant="secondary" size="sm" iconLeft="arrow-left" onClick={volver.onClick}>
            {volver.label}
          </Button>
        </div>
      </article>

      <Lightbox
        open={!!galeria}
        images={galeria?.imagenes ?? []}
        index={galeria?.indice ?? 0}
        onIndexChange={(indice) => setGaleria((g) => (g ? { ...g, indice } : g))}
        onClose={() => setGaleria(null)}
        label="Fotos del medio"
      />
    </>
  );
}

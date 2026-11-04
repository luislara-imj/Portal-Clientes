import './IlustracionMedio.css';

// Ilustraciones sencillas por tipo de medio (SVG en línea, colores de Órbita por CSS: se adaptan al tema).
// Clases: cielo, suelo, estructura (postes y marcos), panel (la cara publicitaria), acento, vidrio.

function Escena({ children, suelo = true }) {
  return (
    <svg className="im" viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <rect className="im-cielo" width="320" height="180" />
      <circle className="im-nube" cx="250" cy="38" r="14" />
      <circle className="im-nube" cx="268" cy="34" r="18" />
      <circle className="im-nube" cx="288" cy="40" r="12" />
      {suelo && <rect className="im-suelo" y="150" width="320" height="30" />}
      {children}
    </svg>
  );
}

function Espectacular() {
  return (
    <Escena>
      <rect className="im-estructura" x="152" y="92" width="16" height="60" />
      <rect className="im-estructura" x="76" y="26" width="168" height="72" rx="3" />
      <rect className="im-panel" x="82" y="32" width="156" height="60" rx="2" />
      <rect className="im-acento" x="96" y="46" width="70" height="10" rx="5" />
      <rect className="im-acento-suave" x="96" y="62" width="110" height="8" rx="4" />
      <rect className="im-estructura" x="120" y="98" width="80" height="4" />
    </Escena>
  );
}

function Cartelera() {
  return (
    <Escena>
      <rect className="im-estructura" x="64" y="104" width="8" height="48" />
      <rect className="im-estructura" x="248" y="104" width="8" height="48" />
      <rect className="im-estructura" x="44" y="50" width="232" height="60" rx="3" />
      <rect className="im-panel" x="50" y="56" width="220" height="48" rx="2" />
      <rect className="im-acento" x="66" y="68" width="90" height="10" rx="5" />
      <rect className="im-acento-suave" x="66" y="84" width="140" height="8" rx="4" />
    </Escena>
  );
}

function Muro() {
  return (
    <Escena>
      <rect className="im-estructura" x="30" y="40" width="260" height="112" />
      <rect className="im-panel" x="48" y="56" width="224" height="80" rx="2" />
      <rect className="im-acento" x="64" y="72" width="96" height="12" rx="6" />
      <rect className="im-acento-suave" x="64" y="92" width="150" height="8" rx="4" />
      <rect className="im-acento-suave" x="64" y="106" width="110" height="8" rx="4" />
    </Escena>
  );
}

function Pantalla() {
  return (
    <Escena>
      <rect className="im-estructura" x="154" y="108" width="12" height="44" />
      <rect className="im-estructura" x="70" y="30" width="180" height="84" rx="6" />
      <rect className="im-vidrio" x="78" y="38" width="164" height="68" rx="3" />
      <circle className="im-acento" cx="160" cy="72" r="16" />
      <path className="im-panel" d="M154 64 L170 72 L154 80 Z" />
    </Escena>
  );
}

function Puente() {
  return (
    <Escena>
      <rect className="im-estructura" x="40" y="70" width="12" height="82" />
      <rect className="im-estructura" x="268" y="70" width="12" height="82" />
      <rect className="im-estructura" x="20" y="58" width="280" height="14" />
      <rect className="im-panel" x="70" y="76" width="180" height="34" rx="2" />
      <rect className="im-acento" x="84" y="86" width="80" height="8" rx="4" />
      <rect className="im-acento-suave" x="84" y="98" width="120" height="6" rx="3" />
    </Escena>
  );
}

function Parabus() {
  return (
    <Escena>
      <rect className="im-estructura" x="70" y="52" width="180" height="10" rx="2" />
      <rect className="im-estructura" x="74" y="62" width="6" height="90" />
      <rect className="im-vidrio" x="84" y="66" width="94" height="80" rx="2" />
      <rect className="im-panel" x="184" y="66" width="56" height="84" rx="2" />
      <rect className="im-acento" x="192" y="78" width="40" height="8" rx="4" />
      <rect className="im-acento-suave" x="192" y="92" width="30" height="6" rx="3" />
      <rect className="im-estructura" x="96" y="126" width="70" height="6" rx="2" />
    </Escena>
  );
}

function Camion() {
  return (
    <Escena>
      <rect className="im-estructura" x="40" y="62" width="240" height="78" rx="12" />
      <rect className="im-vidrio" x="54" y="72" width="34" height="26" rx="3" />
      <rect className="im-vidrio" x="236" y="72" width="34" height="26" rx="3" />
      <rect className="im-panel" x="96" y="72" width="132" height="54" rx="3" />
      <rect className="im-acento" x="108" y="84" width="64" height="10" rx="5" />
      <rect className="im-acento-suave" x="108" y="100" width="96" height="8" rx="4" />
      <circle className="im-rueda" cx="84" cy="142" r="13" />
      <circle className="im-rueda" cx="236" cy="142" r="13" />
    </Escena>
  );
}

function Valla() {
  return (
    <Escena>
      <rect className="im-estructura" x="30" y="40" width="190" height="96" rx="4" />
      <rect className="im-panel" x="38" y="48" width="174" height="80" rx="2" />
      <rect className="im-acento" x="52" y="62" width="80" height="12" rx="6" />
      <rect className="im-acento-suave" x="52" y="82" width="120" height="8" rx="4" />
      <path className="im-estructura" d="M220 84 H262 L284 108 V136 H220 Z" />
      <rect className="im-vidrio" x="230" y="92" width="30" height="18" rx="2" />
      <circle className="im-rueda" cx="70" cy="142" r="12" />
      <circle className="im-rueda" cx="190" cy="142" r="12" />
      <circle className="im-rueda" cx="258" cy="142" r="12" />
    </Escena>
  );
}

// Brand rider: auto particular o de plataforma (Uber, DiDi) rotulado con vinil. 360 = rotulado completo;
// 180 = vinil solo en las puertas.
const CARROCERIA =
  'M46 134 Q38 134 38 124 V110 Q38 100 50 98 L98 94 L120 66 Q124 62 132 62 H194 Q202 62 208 68 L234 94 L268 98 Q282 100 282 114 V124 Q282 134 272 134 Z';

function Rider({ completo }) {
  return (
    <Escena>
      <path className={completo ? 'im-panel' : 'im-estructura'} d={CARROCERIA} />
      <path className="im-vidrio" d="M124 70 H158 V94 H106 Z" />
      <path className="im-vidrio" d="M166 70 H198 Q202 70 205 73 L224 94 H166 Z" />
      {!completo && <rect className="im-panel" x="98" y="100" width="130" height="30" rx="4" />}
      <rect className="im-acento" x={completo ? 62 : 108} y="106" width="64" height="9" rx="4.5" />
      <rect className="im-acento-suave" x={completo ? 62 : 108} y="119" width={completo ? 120 : 90} height="6" rx="3" />
      {completo && (
        <>
          <circle className="im-acento" cx="226" cy="114" r="11" />
          <circle className="im-acento-suave" cx="226" cy="114" r="5" />
          <rect className="im-acento" x="140" y="58" width="26" height="6" rx="3" />
        </>
      )}
      <rect className="im-acento" x="272" y="104" width="8" height="6" rx="2" />
      <circle className="im-rueda" cx="88" cy="136" r="15" />
      <circle className="im-rueda" cx="232" cy="136" r="15" />
      <circle className="im-nube" cx="88" cy="136" r="5" />
      <circle className="im-nube" cx="232" cy="136" r="5" />
    </Escena>
  );
}

function Indoor() {
  return (
    <Escena suelo={false}>
      <rect className="im-piso" y="132" width="320" height="48" />
      <rect className="im-estructura" x="20" y="24" width="60" height="108" />
      <rect className="im-estructura" x="240" y="24" width="60" height="108" />
      <rect className="im-estructura" x="128" y="30" width="64" height="108" rx="6" />
      <rect className="im-vidrio" x="134" y="38" width="52" height="84" rx="3" />
      <rect className="im-panel" x="140" y="46" width="40" height="68" rx="2" />
      <rect className="im-acento" x="146" y="58" width="28" height="8" rx="4" />
      <rect className="im-acento-suave" x="146" y="72" width="20" height="6" rx="3" />
      <rect className="im-estructura" x="146" y="138" width="28" height="6" rx="2" />
    </Escena>
  );
}

const POR_FORMATO = {
  Espectacular,
  Cartelera,
  Muro,
  'Pantalla digital': Pantalla,
  'Puente peatonal': Puente,
  Parabús: Parabus
};

/** Ilustración del medio según su tipo y formato. */
export function IlustracionMedio({ medio }) {
  let Dibujo;
  if (medio.tipo === 'sitios') Dibujo = POR_FORMATO[medio.formato] ?? Espectacular;
  else if (medio.tipo === 'camiones') Dibujo = Camion;
  else if (medio.tipo === 'indoor') Dibujo = Indoor;
  else if (medio.tipo === 'vallas') Dibujo = Valla;
  else return <Rider completo={String(medio.formato).includes('360')} />;
  return <Dibujo />;
}

export default IlustracionMedio;

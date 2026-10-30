import { useEffect, useState } from 'react';
import {
  Accordion,
  Alert,
  AppBar,
  Avatar,
  Badge,
  Breadcrumbs,
  Button,
  Card,
  Checkbox,
  Divider,
  Icon,
  ICON_NAMES,
  IconButton,
  Input,
  KpiCard,
  Lightbox,
  Logo,
  MediaCard,
  Modal,
  Notification,
  Pagination,
  Picture,
  Popover,
  ProgressBar,
  Spinner,
  Stepper,
  Switch,
  Table,
  TabPanel,
  Tabs,
  Tag,
  Toast,
  ToastProvider,
  Toogle,
  Tooltip,
  useToast,
} from '../orbita';

/*
 * Galería de Órbita (#/componentes): todas las variantes y estados para revisar contra Figma.
 * Solo usa componentes y tokens (var(--ui-*)); los estilos de maquetación de la galería van en línea.
 */

const VARIANTS = ['primary', 'secondary', 'tertiary', 'destructive', 'ghost'];
const SIZES = ['xxs', 'xs', 'sm', 'md', 'lg'];
const STATES = [
  ['default', {}],
  ['hover', { state: 'hover' }],
  ['pressed', { state: 'pressed' }],
  ['selected', { selected: true }],
  ['focus', { state: 'focus' }],
  ['disabled', { disabled: true }],
  ['loading', { loading: true }],
];
const COLORS = ['accent', 'gray', 'success', 'warning', 'danger', 'info'];
const AVATAR_COLORS = ['blue', 'red', 'orange', 'yellow', 'lime', 'green', 'cyan', 'azure', 'violet', 'magenta', 'rose', 'disabled'];

// Imagen de muestra (contenido, no estilo): SVG en data URI para funcionar sin red.
function sampleImage(label, hue) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360" viewBox="0 0 640 360"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="hsl(${hue},55%,55%)"/><stop offset="1" stop-color="hsl(${hue + 40},60%,35%)"/></linearGradient></defs><rect width="640" height="360" fill="url(#g)"/><text x="320" y="190" font-family="sans-serif" font-size="40" fill="white" text-anchor="middle">${label}</text></svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}
const IMAGES = [
  { src: sampleImage('Espectacular CDMX', 220), alt: 'Espectacular en CDMX', caption: 'CDMX · Periférico Sur' },
  { src: sampleImage('Camión ZMG', 140), alt: 'Camión en Guadalajara', caption: 'ZMG · Ruta 380' },
  { src: sampleImage('Indoor MTY', 20), alt: 'Pantalla indoor en Monterrey', caption: 'MTY · Plaza Fiesta' },
];

const s = {
  page: { display: 'flex', flexDirection: 'column', gap: 'var(--ui-space-32)', padding: 'var(--ui-space-24) var(--ui-space-16) var(--ui-space-64)', maxWidth: '1200px', margin: '0 auto' },
  section: { display: 'flex', flexDirection: 'column', gap: 'var(--ui-space-16)', scrollMarginTop: 'var(--ui-space-80)' },
  h2: { margin: 0, font: 'var(--ui-font-heading-h2)', letterSpacing: 'var(--ui-type-heading-h2-tracking)' },
  h3: { margin: 0, font: 'var(--ui-font-heading-h5)', color: 'var(--ui-color-text-secondary)' },
  row: { display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 'var(--ui-space-12)' },
  rowTop: { display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', gap: 'var(--ui-space-16)' },
  col: { display: 'flex', flexDirection: 'column', gap: 'var(--ui-space-12)' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 'var(--ui-space-16)' },
  caption: { font: 'var(--ui-font-caption-md)', letterSpacing: 'var(--ui-type-caption-md-tracking)', color: 'var(--ui-color-text-tertiary)', minWidth: 'var(--ui-space-80)' },
  surface: { padding: 'var(--ui-space-16)', borderRadius: 'var(--ui-radius-surface-card)', background: 'var(--ui-color-bg-surface-default)', border: 'var(--ui-stroke-width-1) solid var(--ui-color-border-subtle)' },
  scroll: { overflowX: 'auto', paddingBottom: 'var(--ui-space-8)' },
  toc: { display: 'flex', flexWrap: 'wrap', gap: 'var(--ui-space-8)' },
  link: { color: 'var(--ui-color-text-link-default)', font: 'var(--ui-font-body-xs-semibold)' },
};

function Section({ id, title, children }) {
  return (
    <section id={id} style={s.section} aria-labelledby={`${id}-t`}>
      <h2 id={`${id}-t`} style={s.h2}>
        {title}
      </h2>
      {children}
    </section>
  );
}

function Label({ children }) {
  return <span style={s.caption}>{children}</span>;
}

function useTheme() {
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme || 'light');
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);
  return [theme, () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))];
}

const SECTIONS = [
  ['tokens', 'Tokens'], ['iconos', 'Icon'], ['button', 'Button'], ['iconbutton', 'IconButton'], ['badge', 'Badge'], ['tag', 'Tag'],
  ['input', 'Input'], ['checkbox', 'Checkbox'], ['switch', 'Switch'], ['toogle', 'Toogle'], ['spinner', 'Spinner'], ['divider', 'Divider'],
  ['tooltip', 'Tooltip'], ['popover', 'Popover'], ['progress', 'ProgressBar'], ['breadcrumbs', 'Breadcrumbs'], ['tabs', 'Tabs'],
  ['stepper', 'Stepper'], ['modal', 'Modal'], ['toast', 'Toast'], ['alert', 'Alert'], ['notification', 'Notification'],
  ['accordion', 'Accordion'], ['table', 'Table'], ['pagination', 'Pagination'], ['cards', 'Card, MediaCard, KpiCard'],
  ['picture', 'Picture y Lightbox'], ['avatar', 'Avatar'], ['logo', 'Logo'], ['appbar', 'AppBar'],
];

export default function Componentes() {
  return (
    <ToastProvider>
      <Galeria />
    </ToastProvider>
  );
}

function Galeria() {
  const [theme, toggleTheme] = useTheme();
  const { toast } = useToast();
  const [yn, setYn] = useState({ a: null, b: 'si', c: 'no' });
  const [vista, setVista] = useState('lista');
  const [toggles, setToggles] = useState({ a: true, b: false });
  const [checks, setChecks] = useState({ a: true, b: false });
  const [tab, setTab] = useState('propuesta');
  const [modal, setModal] = useState(null);
  const [lightbox, setLightbox] = useState(null);
  const [page, setPage] = useState(3);
  const [pageSize, setPageSize] = useState(20);
  const [sel, setSel] = useState(['ESP-0012']);
  const [sort, setSort] = useState({ key: 'precio', direction: 'desc' });
  const [tags, setTags] = useState(['CDMX', 'ZMG', 'MTY']);

  const rows = [
    { id: 'ESP-0012', clave: { title: 'ESP-0012', subtitle: 'Espectacular', avatar: 'Espectacular' }, plaza: 'CDMX', inicio: '01/11/2026', precio: '$45,000.00', estatus: { label: 'Disponible', color: 'success', icon: 'success' }, formatos: ['12.9 × 7.2 m', 'Iluminado', 'Digital'], liga: 'Ver ficha' },
    { id: 'CAM-0381', clave: { title: 'CAM-0381', subtitle: 'Camión', avatar: 'Camión' }, plaza: 'ZMG', inicio: '15/11/2026', precio: '$18,500.00', estatus: { label: 'En instalación', color: 'warning', icon: 'warning' }, formatos: ['Integral'], liga: 'Ver ficha' },
    { id: 'IND-0044', clave: { title: 'IND-0044', subtitle: 'Indoor', avatar: 'Indoor' }, plaza: 'MTY', inicio: '30/11/2026', precio: '$9,200.00', estatus: { label: 'Inactivo', color: 'gray', icon: 'pause' }, formatos: ['Pantalla 55"', 'Loop 60 s'], liga: 'Ver ficha' },
  ];

  return (
    <>
      <AppBar
        clientName="Ana López"
        companyName="Cliente de ejemplo S.A."
        theme={theme}
        onToggleTheme={toggleTheme}
        onReset={() => setModal('reset')}
        onLogout={() => toast({ title: 'Cerrar sesión', subtitle: 'En la galería no hace nada.', color: 'info' })}
      />
      <main style={s.page}>
        <div style={s.col}>
          <Breadcrumbs items={[{ label: 'Prototipo', href: '#/' }, { label: 'Componentes' }]} />
          <h1 style={{ margin: 0, font: 'var(--ui-font-heading-h1)', letterSpacing: 'var(--ui-type-heading-h1-tracking)' }}>Órbita · componentes</h1>
          <div style={s.row}>
            <Button variant="secondary" iconLeft={theme === 'dark' ? 'sun' : 'moon'} onClick={toggleTheme} aria-pressed={theme === 'dark'}>
              {theme === 'dark' ? 'Cambiar a OBP Light' : 'Cambiar a OBP Dark'}
            </Button>
            <Label>Tema actual: {theme === 'dark' ? 'OBP Dark' : 'OBP Light'}</Label>
          </div>
          <nav aria-label="Secciones de la galería" style={s.toc}>
            {SECTIONS.map(([id, t]) => (
              <a key={id} href={`#/componentes`} onClick={(e) => { e.preventDefault(); document.getElementById(id)?.scrollIntoView(); }} style={s.link}>
                {t}
              </a>
            ))}
          </nav>
        </div>

        <Section id="tokens" title="Tokens">
          <div style={s.row}>
            {['bg-canvas-default', 'bg-surface-default', 'bg-fill-brand-default', 'bg-fill-success-default', 'bg-fill-warning-default', 'bg-fill-danger-default', 'bg-fill-info-default', 'text-primary', 'border-default'].map((t) => (
              <div key={t} style={{ ...s.col, gap: 'var(--ui-space-4)', alignItems: 'center' }}>
                <span style={{ width: 'var(--ui-size-control-lg)', height: 'var(--ui-size-control-lg)', borderRadius: 'var(--ui-radius-control-sm)', background: `var(--ui-color-${t})`, boxShadow: 'inset 0 0 0 var(--ui-stroke-width-1) var(--ui-color-border-subtle)' }} />
                <Label>{t}</Label>
              </div>
            ))}
          </div>
          <div style={s.row}>
            {[1, 2, 3, 4, 5].map((n) => (
              <div key={n} style={{ ...s.surface, boxShadow: `var(--ui-shadow-${n})`, border: 0 }}>
                <Label>shadow-{n}</Label>
              </div>
            ))}
          </div>
          <div style={s.col}>
            {['heading-h1', 'heading-h2', 'heading-h3', 'heading-h4', 'heading-h5', 'heading-h6'].map((t) => (
              <span key={t} style={{ font: `var(--ui-font-${t})`, letterSpacing: `var(--ui-type-${t}-tracking)` }}>{t}</span>
            ))}
            {['body-lg', 'body-md', 'body-sm', 'body-xs'].map((t) => (
              <span key={t} style={{ font: `var(--ui-font-${t}-regular)`, letterSpacing: `var(--ui-type-${t}-tracking)` }}>{t} regular · <b style={{ font: `var(--ui-font-${t}-bold)` }}>bold</b></span>
            ))}
            <span style={{ font: 'var(--ui-font-caption-xs)', letterSpacing: 'var(--ui-type-caption-xs-tracking)' }}>CAPTION XS</span>
            <span style={{ font: 'var(--ui-font-code-md)' }}>code-md 0123456789</span>
          </div>
        </Section>

        <Section id="iconos" title="Icon">
          <div style={s.row}>
            {ICON_NAMES.map((n) => (
              <span key={n} style={{ ...s.col, gap: 'var(--ui-space-4)', alignItems: 'center', minWidth: 'var(--ui-space-80)' }}>
                <Icon name={n} size={20} />
                <Label>{n}</Label>
              </span>
            ))}
          </div>
          <div style={s.row}>
            {[10, 16, 20, 24, 32].map((z) => (
              <span key={z} style={s.row}><Icon name="megaphone" size={z} /><Label>{z}</Label></span>
            ))}
          </div>
        </Section>

        <Section id="button" title="Button">
          <h3 style={s.h3}>Variantes × estados (size xs, pill sm)</h3>
          <div style={s.scroll}>
            <div style={s.col}>
              {VARIANTS.map((v) => (
                <div key={v} style={{ ...s.row, flexWrap: 'nowrap' }}>
                  <Label>{v}</Label>
                  {STATES.map(([name, props]) => (
                    <Button key={name} variant={v} iconLeft="megaphone" iconRight="chevron-down" {...props}>
                      {name}
                    </Button>
                  ))}
                </div>
              ))}
            </div>
          </div>
          <h3 style={s.h3}>Tamaños</h3>
          <div style={s.row}>
            {SIZES.map((z) => (
              <Button key={z} size={z} iconLeft="download">
                Size {z}
              </Button>
            ))}
          </div>
          <h3 style={s.h3}>Radio (pill?) e íconos</h3>
          <div style={s.row}>
            {['none', 'xs', 'sm', 'md', 'lg', 'pill'].map((p) => (
              <Button key={p} variant="secondary" pill={p}>
                pill {p}
              </Button>
            ))}
            <Button iconLeft="download">Ícono izquierda</Button>
            <Button variant="secondary" iconRight="chevron-down">Ícono derecha</Button>
            <Button variant="tertiary" badge badgeLabel="Hay novedades">Con badge</Button>
          </div>
        </Section>

        <Section id="iconbutton" title="IconButton">
          <div style={s.scroll}>
            <div style={s.col}>
              {VARIANTS.map((v) => (
                <div key={v} style={{ ...s.row, flexWrap: 'nowrap' }}>
                  <Label>{v}</Label>
                  {STATES.map(([name, props]) => (
                    <IconButton key={name} icon="filter" label={`Filtrar (${name})`} variant={v} {...props} />
                  ))}
                </div>
              ))}
            </div>
          </div>
          <div style={s.row}>
            {SIZES.map((z) => (
              <IconButton key={z} icon="download" label={`Descargar ${z}`} size={z} />
            ))}
            <IconButton icon="filter" label="Filtros" badge="2 filtros activos" />
            <IconButton icon="ellipsis" label="Más acciones" variant="tertiary" pill="pill" />
          </div>
        </Section>

        <Section id="badge" title="Badge">
          {['soft', 'solid'].map((th) => (
            <div key={th} style={s.row}>
              <Label>{th}</Label>
              {COLORS.map((c) => (
                <Badge key={c} color={c} theme={th} icon="info">
                  {c}
                </Badge>
              ))}
              <Badge color="info" theme={th} disabled>disabled</Badge>
            </div>
          ))}
          <div style={s.row}>
            <Label>stroke</Label>
            {COLORS.map((c) => (
              <Badge key={c} color={c} theme="soft" stroke>
                {c}
              </Badge>
            ))}
          </div>
          <div style={s.row}>
            <Label>tamaños</Label>
            <Badge size="sm">sm</Badge>
            <Badge size="md">md</Badge>
            <Badge size="lg">lg</Badge>
            <Badge type="num" color="danger">5</Badge>
            <Badge type="num" color="gray" theme="soft">12</Badge>
            <Badge type="dot" color="danger" label="Nuevo" />
          </div>
        </Section>

        <Section id="tag" title="Tag">
          <div style={s.row}>
            {COLORS.map((c) => (
              <Tag key={c} color={c} icon="info">
                {c}
              </Tag>
            ))}
          </div>
          <div style={s.row}>
            <Label>xmark</Label>
            {['default', 'hover', 'pressed', 'selected'].map((st) => (
              <Tag key={st} color="gray" onRemove={() => {}} removeState={st === 'default' ? undefined : st}>
                {st}
              </Tag>
            ))}
            {['default', 'hover', 'pressed', 'selected'].map((st) => (
              <Tag key={`a${st}`} color="accent" onRemove={() => {}} removeState={st === 'default' ? undefined : st}>
                {st}
              </Tag>
            ))}
          </div>
          <div style={s.row}>
            <Label>interactivo</Label>
            {tags.map((t) => (
              <Tag key={t} color="accent" icon="location" onRemove={() => setTags((l) => l.filter((x) => x !== t))}>
                {t}
              </Tag>
            ))}
            {tags.length < 3 && <Button size="xxs" variant="ghost" onClick={() => setTags(['CDMX', 'ZMG', 'MTY'])}>Restaurar</Button>}
            <Tag color="gray" border>Con borde</Tag>
            <Tag color="accent" disabled onRemove={() => {}}>Disabled</Tag>
          </div>
        </Section>

        <Section id="input" title="Input">
          <div style={s.grid}>
            <Input label="Default (placeholder)" placeholder="Buscar medio…" iconLeft="search" helper="Texto de ayuda" />
            <Input label="Value" defaultValue="ESP-0012" iconLeft="search" helper="Texto de ayuda" />
            <Input label="Typing (foco)" defaultValue="Periférico" iconLeft="search" state="typing" helper="Texto de ayuda" />
            <Input label="Disabled" defaultValue="No editable" iconLeft="search" disabled helper="Texto de ayuda" />
            <Input label="Error" defaultValue="correo@" iconLeft="search" error="Escribe un correo válido" />
            <Input label="Contraseña" type="password" defaultValue="secreto123" helper="Usa el ojo para mostrarla" info="Mínimo 8 caracteres" />
            <Input label="Fecha" placeholder="dd/mm/aaaa" iconRight="calendar" />
          </div>
          <div style={s.row}>
            {['xs', 'sm', 'md', 'lg'].map((z) => (
              <Input key={z} label={`Size ${z}`} size={z} placeholder={z} />
            ))}
          </div>
        </Section>

        <Section id="checkbox" title="Checkbox">
          <div style={s.rowTop}>
            <Checkbox label="Default" helper="Supporting text" />
            <Checkbox label="Hover" state="hover" />
            <Checkbox label="Focus" state="focus" />
            <Checkbox label="Marcado" checked={checks.a} onChange={(e) => setChecks((c) => ({ ...c, a: e.target.checked }))} />
            <Checkbox label="Indeterminado" indeterminate readOnly />
            <Checkbox label="Error" error helper="Acepta para continuar" checked={checks.b} onChange={(e) => setChecks((c) => ({ ...c, b: e.target.checked }))} />
            <Checkbox label="Disabled" disabled />
            <Checkbox label="Disabled marcado" disabled checked readOnly />
            <Checkbox aria-label="Sin label visible" />
          </div>
        </Section>

        <Section id="switch" title="Switch (control segmentado)">
          <div style={s.rowTop}>
            <div style={s.col}>
              <Label>Sí / No vacío (nada seleccionado)</Label>
              <Switch label="¿Incluir ESP-0012?" options={[{ value: 'si', label: 'Sí', icon: 'check' }, { value: 'no', label: 'No', icon: 'x' }]} value={yn.a} onChange={(v) => setYn((y) => ({ ...y, a: v }))} />
            </div>
            <div style={s.col}>
              <Label>Sí seleccionado</Label>
              <Switch label="¿Incluir CAM-0381?" options={[{ value: 'si', label: 'Sí', icon: 'check' }, { value: 'no', label: 'No', icon: 'x' }]} value={yn.b} onChange={(v) => setYn((y) => ({ ...y, b: v }))} />
            </div>
            <div style={s.col}>
              <Label>Solo lectura (consulta)</Label>
              <Switch label="¿Incluir IND-0044?" readOnly options={[{ value: 'si', label: 'Sí', icon: 'check' }, { value: 'no', label: 'No', icon: 'x' }]} value={yn.c} />
            </div>
            <div style={s.col}>
              <Label>MD · tres opciones</Label>
              <Switch size="md" label="Vista" options={[{ value: 'lista', label: 'Lista' }, { value: 'cards', label: 'Cards' }, { value: 'kanban', label: 'Kanban' }]} value={vista} onChange={setVista} />
            </div>
            <div style={s.col}>
              <Label>Disabled</Label>
              <Switch label="Disabled" disabled options={[{ value: 'si', label: 'Sí' }, { value: 'no', label: 'No' }]} value="si" />
            </div>
            <div style={s.col}>
              <Label>Loading</Label>
              <Switch label="Cargando" loading options={[{ value: 'si', label: 'Sí' }, { value: 'no', label: 'No' }]} value="si" />
            </div>
          </div>
        </Section>

        <Section id="toogle" title="Toogle (interruptor)">
          <div style={s.row}>
            <Toogle label="Activo" checked={toggles.a} onChange={(v) => setToggles((t) => ({ ...t, a: v }))} />
            <Toogle label="Inactivo" checked={toggles.b} onChange={(v) => setToggles((t) => ({ ...t, b: v }))} />
            <Toogle label="Label a la izquierda" labelPosition="left" checked />
            <Toogle label="Con ícono" icon="bus" checked stroke />
            <Toogle label="Focus" state="focus" checked />
            <Toogle label="Disabled activo" disabled checked />
            <Toogle label="Disabled inactivo" disabled />
            <Toogle aria-label="Sin label" labelPosition="none" checked />
          </div>
        </Section>

        <Section id="spinner" title="Spinner">
          <div style={s.row}>
            <Spinner size="lg" label="Cargando campañas" />
            <span style={{ color: 'var(--ui-color-icon-brand-default)' }}><Spinner label="Cargando" /></span>
            <Button loading>Guardar</Button>
          </div>
        </Section>

        <Section id="divider" title="Divider">
          <div style={s.col}>
            <Divider />
            <Divider dashed />
            {['lg', 'md', 'sm', 'xs'].map((z) => (
              <Divider key={z} size={z}>Texto {z}</Divider>
            ))}
            <div style={{ ...s.row, height: 'var(--ui-size-control-lg)' }}>
              <span>Izquierda</span>
              <Divider orientation="vertical" />
              <span>Derecha</span>
              <Divider orientation="vertical" dashed />
              <span>Punteada</span>
            </div>
          </div>
        </Section>

        <Section id="tooltip" title="Tooltip">
          <div style={{ ...s.col, alignItems: 'flex-start', gap: 'var(--ui-space-48)', padding: 'var(--ui-space-40) var(--ui-space-16)' }}>
            <Tooltip label="Arriba centro" open><Button variant="secondary">Top</Button></Tooltip>
            <Tooltip label="Abajo izquierda" placement="bottom" align="left" open><Button variant="secondary">Bottom left</Button></Tooltip>
            <Tooltip label="A un lado" placement="side" open><Button variant="secondary">Side</Button></Tooltip>
            <Tooltip label="Con hover o foco"><Button variant="tertiary">Pasa el cursor</Button></Tooltip>
          </div>
        </Section>

        <Section id="popover" title="Popover">
          <div style={{ ...s.rowTop, minHeight: '280px' }}>
            <Popover
              trigger={<Button variant="secondary" iconRight="chevron-down">Abrir popover</Button>}
              title="Detalle del medio"
              description="ESP-0012 · CDMX"
              icon="billboard"
              badge={<Badge color="success" theme="soft" icon="success">Disponible</Badge>}
              primaryAction={{ label: 'Aceptar', onClick: () => {} }}
              secondaryAction={{ label: 'Cancelar', onClick: () => {} }}
              defaultOpen
            >
              Periférico Sur 4020, 12.9 × 7.2 m, iluminado.
            </Popover>
            <div style={{ marginLeft: 'auto' }}>
              <Popover trigger={<Button variant="secondary">Warning</Button>} type="warning" title="Fase bloqueada" description="Confirma la selección primero" icon="lock" align="end">
                Faltan 4 medios por responder.
              </Popover>
            </div>
          </div>
        </Section>

        <Section id="progress" title="ProgressBar">
          <div style={s.col}>
            {['brand', 'success', 'danger', 'neutro'].map((c, i) => (
              <ProgressBar key={c} color={c} value={25 * (i + 1)} label={`Instalación (${c})`} eta={i === 0 ? '1m restante' : undefined} />
            ))}
            {['xxs', 'xs', 'sm', 'md', 'lg'].map((z) => (
              <ProgressBar key={z} size={z} value={60} aria-label={`Barra ${z}`} showPercentage={false} />
            ))}
            <ProgressBar value={40} label="Con ayuda y cerrar" helper="2 de 5 medios instalados" onClose={() => {}} />
            <ProgressBar value={70} label="Compacta" compact />
            <ProgressBar value={50} label="Disabled" disabled helper="Sin avance" />
          </div>
        </Section>

        <Section id="breadcrumbs" title="Breadcrumbs">
          <div style={s.col}>
            <Breadcrumbs items={[{ label: 'Campañas', href: '#/componentes' }]} />
            <Breadcrumbs items={[{ label: 'Campañas', href: '#/componentes' }, { label: 'Alpina Leche', href: '#/componentes' }, { label: 'Cotización' }]} />
            <Breadcrumbs items={['Inicio', 'Campañas', 'Alpina Leche', 'Reportes', 'Noviembre', 'Archivo'].map((l, i, a) => (i < a.length - 1 ? { label: l, href: '#/componentes' } : { label: l }))} />
          </div>
        </Section>

        <Section id="tabs" title="Tabs (con contador)">
          <Tabs
            idPrefix="gal"
            label="Fases"
            value={tab}
            onChange={setTab}
            onAdd={() => toast({ title: 'Agregar pestaña', color: 'neutro' })}
            items={[
              { id: 'propuesta', label: 'Propuesta', count: 42 },
              { id: 'cotizacion', label: 'Cotización', count: 18 },
              { id: 'instalacion', label: 'Instalación' },
              { id: 'reportes', label: 'Reportes', disabled: true },
            ]}
          />
          {['propuesta', 'cotizacion', 'instalacion', 'reportes'].map((id) => (
            <TabPanel key={id} idPrefix="gal" id={id} active={tab === id}>
              <div style={s.surface}>Contenido de {id}</div>
            </TabPanel>
          ))}
          {['xxl', 'xs', 'sm', 'md', 'lg'].map((z) => (
            <div key={z} style={s.col}>
              <Label>size {z}{z === 'md' ? ' · pill false' : ''}</Label>
              <Tabs idPrefix={`g-${z}`} size={z} pill={z !== 'md'} value="b" items={[{ id: 'a', label: 'Pestaña' }, { id: 'b', label: 'Activa', count: 3 }, { id: 'c', label: 'Otra' }]} />
            </div>
          ))}
        </Section>

        <Section id="stepper" title="Stepper">
          <Stepper
            steps={[
              { title: 'Propuesta', status: 'complete', onClick: () => {} },
              { title: 'Cotización', status: 'current' },
              { title: 'Instalación', status: 'pending', locked: true, reason: 'Se desbloquea al aceptar la cotización' },
              { title: 'Reportes', status: 'pending', locked: true, reason: 'Falta terminar la instalación' },
              { title: 'Cierre', status: 'pending' },
            ]}
          />
          <div style={s.surface}>
            <Stepper
              orientation="vertical"
              steps={[
                { title: 'Propuesta', status: 'complete' },
                { title: 'Cotización', status: 'complete' },
                { title: 'Instalación', status: 'current' },
                { title: 'Reportes', status: 'pending', locked: true, reason: 'Disponible al terminar la instalación' },
              ]}
            />
          </div>
        </Section>

        <Section id="modal" title="Modal">
          <div style={s.row}>
            {['xs', 'sm', 'md', 'lg', 'xl', 'xxl'].map((z) => (
              <Button key={z} variant="secondary" onClick={() => setModal(z)}>
                Abrir {z.toUpperCase()}
              </Button>
            ))}
            <Button variant="destructive" onClick={() => setModal('reset')}>Reiniciar datos</Button>
          </div>
          <Modal
            open={Boolean(modal) && modal !== 'reset'}
            size={modal && modal !== 'reset' ? modal : 'sm'}
            onClose={() => setModal(null)}
            title={`Modal ${String(modal).toUpperCase()}`}
            icon="info"
            headerActions={<Badge color="accent" theme="soft">Borrador</Badge>}
            footerStart={<IconButton icon="download" label="Descargar" />}
            secondaryAction={{ label: 'Cancelar', onClick: () => setModal(null) }}
            primaryAction={{ label: 'Aceptar', onClick: () => setModal(null) }}
          >
            <p style={{ margin: 0 }}>El foco queda atrapado aquí. Escape o “Cerrar” lo cierran y el foco vuelve al botón que lo abrió.</p>
            <Input label="Campo de ejemplo" placeholder="Escribe algo" />
          </Modal>
          <Modal
            open={modal === 'reset'}
            size="sm"
            onClose={() => setModal(null)}
            title="¿Reiniciar datos?"
            icon="refresh"
            secondaryAction={{ label: 'Cancelar', onClick: () => setModal(null) }}
            primaryAction={{
              label: 'Reiniciar',
              onClick: () => {
                setModal(null);
                toast({ title: 'Datos reiniciados', subtitle: 'Todo volvió a la semilla (simulado).', color: 'success' });
              },
            }}
          >
            <p style={{ margin: 0 }}>Se borran todas las respuestas y avances y todo vuelve al estado inicial.</p>
          </Modal>
        </Section>

        <Section id="toast" title="Toast">
          <div style={s.row}>
            {['success', 'warning', 'danger', 'info', 'neutro'].map((c) => (
              <Button key={c} variant="secondary" onClick={() => toast({ title: `Aviso ${c}`, subtitle: 'Se cierra solo en 5 s', color: c })}>
                Lanzar {c}
              </Button>
            ))}
            <Button variant="secondary" onClick={() => [1, 2, 3, 4, 5].forEach((n) => toast({ title: `Aviso ${n} en cola`, color: 'info', duration: 3000 }))}>
              Lanzar 5 (cola)
            </Button>
          </div>
          <div style={s.rowTop}>
            <Toast color="success" title="Selección confirmada" subtitle="Alpina Leche" body="Se desbloqueó la cotización." actions={[{ label: 'Deshacer' }, { label: 'Ver cotización' }]} onClose={() => {}} progress={60} />
            <Toast color="warning" title="Faltan respuestas" subtitle="4 medios sin respuesta" body="Responde Sí o No en todos." onClose={() => {}} progress={30} />
            <Toast color="danger" title="No se pudo guardar" subtitle="Intenta de nuevo" onClose={() => {}} showTimer={false} />
            <Toast color="info" title="Descarga simulada" subtitle="En el prototipo no se descarga" onClose={() => {}} progress={80} />
            <Toast color="neutro" title="Aviso neutro" subtitle="Sin intención" onClose={() => {}} progress={50} />
          </div>
        </Section>

        <Section id="alert" title="Alert">
          <div style={s.col}>
            {['info', 'success', 'warning', 'danger'].map((st) => (
              <Alert key={st} stage={st} title={`Alerta ${st}`} description="Fase cerrada · solo consulta" actions={[{ label: 'Acción' }]} onClose={() => {}} />
            ))}
            {['info', 'success', 'warning', 'danger'].map((st) => (
              <Alert key={`s${st}`} stage={st} theme="solid" title={`Solid ${st}`} description="Descripción breve" />
            ))}
          </div>
        </Section>

        <Section id="notification" title="Notification">
          <div style={s.rowTop}>
            <Notification intent="informativa" title="Propuesta lista" subtitle="Alpina Leche" body="Tienes 42 medios por revisar." onClose={() => {}} isNew counter={5} progress={60} />
            <Notification intent="confirmacion" title="Cotización aceptada" subtitle="Alpina Leche" date="Hace 2 min" />
            <Notification intent="preventiva" title="Faltan respuestas" subtitle="Bajío Otoño" body="4 medios sin respuesta." date="Ayer" />
            <Notification intent="critica" variant="item" title="Error de instalación" subtitle="CAM-0381" date="30/10/2026" />
          </div>
        </Section>

        <Section id="accordion" title="Accordion">
          <div style={{ ...s.col, maxWidth: '480px' }}>
            <Accordion title="Abierto" description="Descripción" defaultOpen>
              <p style={{ margin: 0 }}>Contenido del acordeón.</p>
            </Accordion>
            <Accordion title="Cerrado" description="Descripción">
              <p style={{ margin: 0 }}>Contenido oculto.</p>
            </Accordion>
            <Accordion title="Vacío" description="Sin contenido" empty />
          </div>
        </Section>

        <Section id="table" title="Table">
          <Table
            caption="Medios de la propuesta"
            toolbar={
              <>
                <div style={{ ...s.row, flex: '1 1 260px' }}>
                  <Input label="Buscar" hideLabel placeholder="Buscar…" iconLeft="search" />
                  <IconButton icon="filter" label="Filtros" badge="1 filtro activo" />
                </div>
                <Switch label="Vista" options={[{ value: 'lista', label: 'Lista' }, { value: 'cards', label: 'Cards' }]} value={vista === 'cards' ? 'cards' : 'lista'} onChange={setVista} />
                <div style={s.row}>
                  <Button variant="secondary" iconLeft="download">Exportar</Button>
                  <Button>Confirmar</Button>
                </div>
              </>
            }
            columns={[
              { key: 'clave', header: 'CLAVE', type: 'primary', sticky: true },
              { key: 'plaza', header: 'PLAZA' },
              { key: 'inicio', header: 'INICIO', type: 'date', sortable: true },
              { key: 'precio', header: 'PRECIO', type: 'number', sortable: true },
              { key: 'estatus', header: 'ESTATUS', type: 'status' },
              { key: 'formatos', header: 'FORMATOS', type: 'tags', maxTags: 2 },
              { key: 'liga', header: 'DETALLE', type: 'link', onClick: (r) => toast({ title: `Ficha de ${r.id}`, color: 'info' }) },
              { key: 'acciones', header: '', render: (r) => <IconButton icon="ellipsis" label={`Acciones de ${r.id}`} variant="tertiary" /> },
            ]}
            rows={rows}
            selectable
            selectedKeys={sel}
            onSelectionChange={setSel}
            isRowDisabled={(r) => r.id === 'IND-0044'}
            sort={sort}
            onSortChange={(key) => setSort((p) => ({ key, direction: p.key === key && p.direction === 'asc' ? 'desc' : 'asc' }))}
            footer={<Pagination page={page} pageCount={200} onPageChange={setPage} pageSize={pageSize} pageSizeOptions={[10, 20, 50]} onPageSizeChange={setPageSize} />}
          />
          <Table caption="Tabla vacía" columns={[{ key: 'a', header: 'MEDIO' }, { key: 'b', header: 'PLAZA' }]} rows={[]} emptyMessage="Aún no hay medios en esta campaña" />
        </Section>

        <Section id="pagination" title="Pagination">
          <Pagination page={1} pageCount={5} onPageChange={() => {}} />
          <Pagination page={page} pageCount={200} onPageChange={setPage} />
        </Section>

        <Section id="cards" title="Card, MediaCard y KpiCard">
          <div style={s.rowTop}>
            <Card style={{ width: '260px' }}>
              <strong>Card genérica</strong>
              <span>Radio 12, border/subtle, shadow-1.</span>
            </Card>
            <Card onClick={() => toast({ title: 'Card clicable', color: 'neutro' })} style={{ width: '260px' }}>
              <strong>Card clicable</strong>
              <span>Foco y hover.</span>
            </Card>
          </div>
          <div style={s.rowTop}>
            <MediaCard image={IMAGES[0]} mediaType="Espectacular" mediaKey="ESP-0012" plaza="CDMX" onPlazaClick={() => {}} formats={[{ label: '12.9 × 7.2 m' }, { label: 'Iluminado' }]} status={{ label: 'Disponible', color: 'success', icon: 'success' }} exclusive actions={<><Button size="xs" variant="secondary">Detalle</Button><Button size="xs">Agregar</Button></>} />
            <MediaCard image={IMAGES[1]} mediaType="Camión" mediaKey="CAM-0381" plaza="ZMG" formats={[{ label: 'Integral' }]} status={{ label: 'Disponible', color: 'success', icon: 'success' }} state="hover" />
            <MediaCard image={IMAGES[2]} mediaType="Indoor" mediaKey="IND-0044" plaza="MTY" formats={[{ label: 'Pantalla 55"' }]} status={{ label: 'Inactivo', color: 'gray', icon: 'pause' }} disabled />
            <MediaCard mediaType="Indoor" mediaKey="IND-0050 (sin imagen, focus)" plaza="MTY" state="focus" />
          </div>
          <div style={s.rowTop}>
            <KpiCard title="Medios en propuesta" amount="42" trend={{ direction: 'positive', label: '+6' }} />
            <KpiCard title="Próximas a vencer" amount="3" stage="warning" trend={{ direction: 'neutral', label: '0' }} />
            <KpiCard title="Con incidencias" amount="1" stage="danger" trend={{ direction: 'negative', label: '-2' }} />
            <KpiCard title="En pausa" amount="2" stage="pause" />
            <KpiCard amount="$1,240,000 MXN" showHeader={false} />
          </div>
        </Section>

        <Section id="picture" title="Picture y Lightbox">
          <div style={s.rowTop}>
            {['none', 'sm', 'md'].map((r, i) => (
              <div key={r} style={{ width: '220px', ...s.col }}>
                <Picture src={IMAGES[i].src} alt={IMAGES[i].alt} radius={r} onClick={() => setLightbox(i)} label={`Ampliar ${IMAGES[i].alt}`} />
                <Label>radius {r} · clic abre Lightbox</Label>
              </div>
            ))}
            <div style={{ width: '140px', ...s.col }}>
              <Picture src={IMAGES[0].src} alt="Cuadrada" ratio="1:1" radius="pill" shadow />
              <Label>1:1 pill shadow</Label>
            </div>
            <div style={{ width: '220px', ...s.col }}>
              <Picture alt="Sin imagen" stroke />
              <Label>sin imagen + stroke</Label>
            </div>
          </div>
          <Lightbox open={lightbox !== null} onClose={() => setLightbox(null)} images={IMAGES} index={lightbox ?? 0} onIndexChange={setLightbox} size="sm" />
        </Section>

        <Section id="avatar" title="Avatar">
          {['solid', 'soft'].map((th) => (
            <div key={th} style={s.row}>
              <Label>{th}</Label>
              {AVATAR_COLORS.map((c) => (
                <Avatar key={c} name={`Ana ${c}`} color={c} theme={th} />
              ))}
            </div>
          ))}
          <div style={s.row}>
            <Label>tamaños</Label>
            {['xxs', 'xs', 'sm', 'md', 'lg', 'xl'].map((z) => (
              <Avatar key={z} name="Ana López" size={z} />
            ))}
            <Avatar type="icon" size="md" name="Usuario" />
            <Avatar src={IMAGES[0].src} size="md" name="Foto" status="success" />
            <Avatar name="Ana López" size="lg" status="warning" stroke />
            <Avatar name="Ana López" size="md" pill={false} theme="soft" stroke />
          </div>
        </Section>

        <Section id="logo" title="Logo">
          <div style={s.row}>
            <Logo size="sm" />
            <Logo size="md" />
            <Logo size="lg" />
            <Label>Texto “OBP” provisional: no hay SVG exportado del set OBP_logo.</Label>
          </div>
        </Section>

        <Section id="appbar" title="AppBar">
          <div style={{ ...s.surface, padding: 0, overflow: 'hidden' }}>
            <AppBar clientName="Ana López" companyName="Cliente de ejemplo S.A." theme={theme} onToggleTheme={toggleTheme} onReset={() => setModal('reset')} onLogout={() => {}} />
          </div>
          <div style={{ ...s.surface, padding: 0, overflow: 'hidden' }}>
            <AppBar theme={theme} onToggleTheme={toggleTheme} />
          </div>
          <Label>Sin onReset (login) no se muestra “Reiniciar datos”.</Label>
        </Section>
      </main>
    </>
  );
}

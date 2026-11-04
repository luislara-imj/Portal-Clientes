import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faAnglesLeft,
  faBroom,
  faSliders,
  faCloudArrowUp,
  faFile,
  faFolderOpen,
  faArrowUpRightFromSquare,
  faFilePowerpoint,
  faCircle,
  faTrashCan,
  faAnglesRight,
  faArrowDown,
  faArrowLeft,
  faArrowRotateRight,
  faArrowTrendDown,
  faArrowTrendUp,
  faArrowUp,
  faBuilding,
  faBullhorn,
  faBus,
  faCalendar,
  faCalendarXmark,
  faCheck,
  faChevronDown,
  faChevronLeft,
  faChevronRight,
  faChevronUp,
  faCircleCheck,
  faCircleExclamation,
  faCircleInfo,
  faCirclePause,
  faCrown,
  faDownload,
  faEllipsis,
  faEye,
  faEyeSlash,
  faFilter,
  faImage,
  faLocationDot,
  faLock,
  faMagnifyingGlass,
  faMagnifyingGlassPlus,
  faMagnifyingGlassMinus,
  faMinus,
  faMoon,
  faPlus,
  faRectangleAd,
  faRightFromBracket,
  faShapes,
  faSort,
  faSpinner,
  faSun,
  faTriangleExclamation,
  faUser,
  faXmark,
  faUsers,
  faClock,
  faRulerCombined,
  faLightbulb,
  faMapLocationDot,
  faRepeat,
  faBullseye,
  faCommentDots,
  faRoute,
  faLayerGroup,
  faChartSimple,
  faHandshake,
  faVenusMars,
  faTag,
  faFileInvoiceDollar,
  faScrewdriverWrench,
  faPaintbrush,
  faChartLine,
  faArrowRight,
  faFilm,
  faGear,
  faEnvelope,
  faPhone,
  faWifi,
  faCompass,
  faInbox,
  faHourglassHalf,
  faCamera,
} from '@fortawesome/free-solid-svg-icons';
import { cx } from './cx.js';
import './Icon.css';

/*
 * Único módulo que importa íconos. Órbita usa Font Awesome 7 Pro (Regular por defecto);
 * sin licencia web se usa Font Awesome Free (Solid) con el equivalente más cercano.
 * Para pasar a Pro basta con cambiar este mapa.
 */
const ICONS = {
  check: faCheck,
  lock: faLock,
  'chevron-down': faChevronDown,
  'chevron-up': faChevronUp,
  'chevron-right': faChevronRight,
  'chevron-left': faChevronLeft,
  'chevrons-left': faAnglesLeft,
  'chevrons-right': faAnglesRight,
  x: faXmark,
  eye: faEye,
  'eye-slash': faEyeSlash,
  calendar: faCalendar,
  'calendar-warning': faCalendarXmark, // Pro: calendar-circle-exclamation
  location: faLocationDot,
  download: faDownload,
  megaphone: faBullhorn,
  billboard: faRectangleAd, // Pro no tiene "billboard" en Free; equivalente cercano
  bus: faBus,
  building: faBuilding,
  image: faImage,
  warning: faTriangleExclamation,
  info: faCircleInfo,
  success: faCircleCheck,
  error: faCircleExclamation, // Pro: hexagon-exclamation / octagon-exclamation
  pause: faCirclePause,
  search: faMagnifyingGlass,
  filter: faFilter,
  'arrow-left': faArrowLeft,
  'arrow-right': faArrowRight,
  'arrow-up': faArrowUp,
  'arrow-down': faArrowDown,
  sort: faSort, // Pro: arrow-down-arrow-up
  'trend-up': faArrowTrendUp,
  'trend-down': faArrowTrendDown,
  minus: faMinus,
  plus: faPlus,
  ellipsis: faEllipsis,
  sun: faSun,
  moon: faMoon,
  logout: faRightFromBracket,
  refresh: faArrowRotateRight,
  loader: faSpinner,
  user: faUser,
  shapes: faShapes,
  exclusive: faCrown,
  file: faFile,
  'file-powerpoint': faFilePowerpoint,
  dot: faCircle,
  trash: faTrashCan,
  upload: faCloudArrowUp,
  broom: faBroom,
  sliders: faSliders,
  'zoom-in': faMagnifyingGlassPlus,
  'zoom-out': faMagnifyingGlassMinus,
  drive: faFolderOpen, // Free no incluye la marca de Google Drive en solid; carpeta abierta
  'external-link': faArrowUpRightFromSquare,
  users: faUsers,
  clock: faClock,
  ruler: faRulerCombined,
  lightbulb: faLightbulb,
  map: faMapLocationDot,
  repeat: faRepeat,
  target: faBullseye,
  comment: faCommentDots,
  route: faRoute,
  layers: faLayerGroup,
  chart: faChartSimple,
  handshake: faHandshake,
  gender: faVenusMars,
  tag: faTag,
  invoice: faFileInvoiceDollar,
  tools: faScrewdriverWrench,
  paintbrush: faPaintbrush,
  'chart-line': faChartLine,
  video: faFilm,
  gear: faGear,
  mail: faEnvelope,
  phone: faPhone,
  camera: faCamera,
  wifi: faWifi,
  compass: faCompass,
  inbox: faInbox,
  hourglass: faHourglassHalf,
};

export const ICON_NAMES = Object.keys(ICONS);

const SIZES = [10, 16, 20, 24, 32];

/**
 * <Icon name="check" size={16} />
 * Decorativo por defecto (aria-hidden). Con `label` se anuncia como imagen.
 */
export function Icon({ name, size = 16, label, spin = false, className, ...rest }) {
  const icon = ICONS[name];
  const s = SIZES.includes(Number(size)) ? Number(size) : 16;
  if (!icon) {
    if (import.meta.env?.DEV) console.warn(`[Icon] nombre desconocido: ${name}`);
    return null;
  }
  const a11y = label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true };
  return (
    <span className={cx('ui-icon', `ui-icon--${s}`, spin && 'ui-icon--spin', className)} {...a11y} {...rest}>
      <FontAwesomeIcon icon={icon} />
    </span>
  );
}

export default Icon;

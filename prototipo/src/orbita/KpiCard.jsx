import { Icon } from './Icon.jsx';
import { cx } from './cx.js';
import './KpiCard.css';

const STAGE_GLYPH = { default: 'trend-up', warning: 'calendar-warning', danger: 'error', pause: 'pause' };
const TREND = {
  positive: { glyph: 'trend-up', text: 'Sube' },
  negative: { glyph: 'trend-down', text: 'Baja' },
  neutral: { glyph: 'minus', text: 'Sin cambio' },
};

/**
 * Tarjeta indicador (§3.2, "Card- Dashboard"). 170 × 106 en Figma.
 * title · amount · stage: default | warning | danger | pause (ícono del encabezado)
 * showIcon · showHeader · trend: { direction: positive | negative | neutral, label }
 */
export function KpiCard({ title, amount, stage = 'default', showIcon = true, showHeader = true, trend, className }) {
  const t = trend ? TREND[trend.direction] ?? TREND.neutral : null;
  return (
    <section className={cx('ui-kpi-card', `ui-kpi-card--${stage}`, className)}>
      {showHeader && (
        <h3 className="ui-kpi-card__header">
          {showIcon && (
            <span className="ui-kpi-card__icon">
              <Icon name={STAGE_GLYPH[stage] ?? 'trend-up'} size={16} />
            </span>
          )}
          <span>{title}</span>
        </h3>
      )}
      <p className="ui-kpi-card__amount">{amount}</p>
      {t && (
        <p className={cx('ui-kpi-card__trend', `ui-kpi-card__trend--${trend.direction}`)}>
          <span>{trend.label}</span>
          <Icon name={t.glyph} size={16} label={t.text} />
        </p>
      )}
    </section>
  );
}

export default KpiCard;

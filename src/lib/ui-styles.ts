type UiTypes = {
  panel: string;
  elevated: string;
  elevatedHover: string;
  muted: string;
  sectionLabel: string;
  subheading: string;
  numeric: string;
};

export const ui: UiTypes = {
  panel: 'rounded-[4px] bg-surface border border-surface-border shadow-[var(--shadow-panel)]',
  elevated:
    'rounded-[4px] bg-surface-light border border-surface-border shadow-[var(--shadow-elevated)]',
  elevatedHover: 'hover:border-surface-ring transition-all duration-200',
  muted: 'text-ash',
  sectionLabel: 'text-[10px] font-medium uppercase tracking-[0.12em] text-ash block',
  subheading: 'text-[11px] font-medium uppercase tracking-[0.12em] text-ash',
  numeric: 'tabular-nums',
};

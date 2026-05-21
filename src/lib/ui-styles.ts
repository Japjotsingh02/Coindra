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
  panel: 'rounded-[4px] bg-[#0a0a0a] border border-[#222222]',
  elevated: 'rounded-[4px] bg-[#111111] border border-[#222222]',
  elevatedHover: 'hover:border-[#444444] transition-all duration-200',
  muted: 'text-[#888888]',
  sectionLabel: 'text-[10px] font-medium uppercase tracking-[0.12em] text-[#888888] block',
  subheading: 'text-[11px] font-medium uppercase tracking-[0.12em] text-[#888888]',
  numeric: 'tabular-nums',
};

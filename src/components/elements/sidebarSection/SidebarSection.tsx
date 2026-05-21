import { cn } from '@/lib/utils';
import { ui } from '@/lib/ui-styles';
import React from 'react';

interface SidebarSectionProps {
  /** Section label text shown above the selector. */
  label: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * Sidebar section wrapper.
 *
 * Renders a styled uppercase label and enforces consistent spacing between
 * the label and the selector/content passed as children.  All label margins
 * and section gap live here — callers only provide the selector element.
 *
 * @example
 * <SidebarSection label="Trading Pair">
 *   <Select ... />
 * </SidebarSection>
 */
export const SidebarSection = ({ label, children, className }: SidebarSectionProps) => {
  return (
    <div className={cn('flex flex-col gap-3', className)}>
      <label className={ui.sectionLabel}>{label}</label>
      {children}
    </div>
  );
};

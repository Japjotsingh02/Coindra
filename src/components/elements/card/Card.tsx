import { cn } from '@/lib/utils';
import { ui } from '@/lib/ui-styles';
import React from 'react';

export interface CardProps {
  header?: React.ReactNode;
  headerAction?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export const Card = ({ header, headerAction, children, className }: CardProps) => {
  const hasHeader = header !== undefined && header !== null;

  return (
    <div
      className={cn(
        ui.panel,
        ui.elevatedHover,
        'p-4 sm:p-5 2xl:p-6',
        'flex flex-col gap-4 sm:gap-6 xl:gap-8 2xl:gap-10',
        className
      )}
    >
      {hasHeader ? (
        <div className="flex items-center justify-between">
          {typeof header === 'string' ? <h5 className={ui.subheading}>{header}</h5> : header}
          {headerAction}
        </div>
      ) : (
        headerAction && <>{headerAction}</>
      )}
      {children}
    </div>
  );
};

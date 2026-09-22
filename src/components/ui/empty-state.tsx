import * as React from 'react';
import { cn } from '@/lib/utils';
import { Button } from './button';

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

/**
 * Centered message for empty lists and blank states.
 */
export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-8 text-center bg-white rounded-lg border border-dashed border-[#D2DDDB]',
        className
      )}
      {...props}
    >
      {icon && (
        <div className="mb-4 text-[#465A60] opacity-80 flex items-center justify-center w-12 h-12 rounded-full bg-[#F3F7F6]">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold text-[#0A2F38] mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-[#465A60] max-w-sm mb-6">{description}</p>
      )}
      {actionLabel && onAction && (
        <Button variant="primary" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

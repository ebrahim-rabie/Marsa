import * as React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'outline';
}

const badgeVariants = {
  default: 'bg-[#0F4C5C] text-white border-transparent',
  success: 'bg-[#1B7A50] text-white border-transparent',
  warning: 'bg-[#F2B01E] text-[#0A2F38] border-transparent',
  error: 'bg-[#B42318] text-white border-transparent',
  outline: 'bg-transparent text-[#0F4C5C] border-[#0F4C5C]',
};

/**
 * Status badge component.
 */
export function Badge({
  className,
  variant = 'default',
  ...props
}: BadgeProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
        badgeVariants[variant],
        className
      )}
      {...props}
    />
  );
}

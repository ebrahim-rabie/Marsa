import * as React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from './card';

export interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down';
  icon?: React.ReactNode;
}

/**
 * Dashboard stat card for displaying key metrics.
 */
export function StatCard({
  title,
  value,
  change,
  trend,
  icon,
  className,
  ...props
}: StatCardProps) {
  return (
    <Card className={cn('overflow-hidden', className)} {...props}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-1">
            <p className="text-sm font-medium text-[#465A60]">{title}</p>
            <div className="flex items-baseline gap-2">
              <h2 className="text-2xl font-bold text-[#0A2F38] tabular-nums tracking-tight">
                {value}
              </h2>
              {change && trend && (
                <span
                  className={cn(
                    'text-xs font-semibold flex items-center',
                    trend === 'up' ? 'text-[#1B7A50]' : 'text-[#B42318]'
                  )}
                >
                  {trend === 'up' ? (
                    <svg className="w-3 h-3 me-0.5 rtl:rotate-180 rtl:-scale-y-100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
                  ) : (
                    <svg className="w-3 h-3 me-0.5 rtl:rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"></polyline><polyline points="17 18 23 18 23 12"></polyline></svg>
                  )}
                  {change}
                </span>
              )}
            </div>
          </div>
          {icon && (
            <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full bg-[#F3F7F6] text-[#0F4C5C]">
              {icon}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

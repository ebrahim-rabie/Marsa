import * as React from 'react';
import { cn } from '@/lib/utils';

export interface VerificationBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  level: 0 | 1 | 2 | 3;
  locale?: 'en' | 'ar';
}

const levelLabels = {
  en: ['Unverified', 'Registered', 'Video-verified', 'Audited'],
  ar: ['غير موثق', 'مسجل', 'موثق بالفيديو', 'مدقق'],
};

/**
 * Supplier verification level badge.
 */
export function VerificationBadge({
  level,
  locale = 'en',
  className,
  ...props
}: VerificationBadgeProps) {
  const label = levelLabels[locale][level];

  return (
    <div
      className={cn('inline-flex items-center gap-2', className)}
      title={label}
      {...props}
    >
      <div className="flex items-center gap-0.5">
        {[1, 2, 3].map((segment) => {
          let segmentColor = 'bg-[#D2DDDB]'; // default unfilled
          if (segment <= level) {
            // If it's the current highest level, signal yellow, else petrol
            segmentColor = segment === level ? 'bg-[#F2B01E]' : 'bg-[#0F4C5C]';
          }
          
          return (
            <div
              key={segment}
              className={cn('h-3 w-1 rounded-sm', segmentColor)}
            />
          );
        })}
      </div>
      <span className="text-xs font-medium text-[#465A60] leading-none select-none">
        {label}
      </span>
    </div>
  );
}

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: SelectOption[];
}

/**
 * Native select dropdown component.
 */
export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, helperText, options, id, ...props }, ref) => {
    const selectId = id || React.useId();

    return (
      <div className={cn('flex flex-col gap-1.5 w-full', className)}>
        {label && (
          <label htmlFor={selectId} className="text-sm font-medium text-[#465A60]">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={cn(
              'flex h-10 w-full appearance-none rounded-md border bg-white px-3 py-2 pe-10 text-sm text-[#0A2F38] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F4C5C] disabled:cursor-not-allowed disabled:opacity-50 transition-colors',
              error ? 'border-[#B42318] focus-visible:ring-[#B42318]' : 'border-[#D2DDDB]'
            )}
            {...props}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 end-3 flex items-center text-[#465A60]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </div>
        </div>
        {(error || helperText) && (
          <p className={cn('text-xs mt-1', error ? 'text-[#B42318]' : 'text-[#465A60]')}>
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);
Select.displayName = 'Select';

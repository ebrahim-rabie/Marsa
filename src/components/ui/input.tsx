'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  iconStart?: React.ReactNode;
  iconEnd?: React.ReactNode;
}

/**
 * Input component with RTL awareness and validation states.
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { className, label, error, helperText, iconStart, iconEnd, id, ...props },
    ref
  ) => {
    const inputId = id || React.useId();

    return (
      <div className={cn('flex flex-col gap-1.5 w-full', className)}>
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-[#465A60]"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {iconStart && (
            <div className="absolute start-3 flex items-center text-[#465A60] pointer-events-none">
              {iconStart}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              'flex h-10 w-full rounded-md border bg-white px-3 py-2 text-sm text-[#0A2F38] placeholder:text-[#465A60] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F4C5C] disabled:cursor-not-allowed disabled:opacity-50 transition-colors',
              error ? 'border-[#B42318] focus-visible:ring-[#B42318]' : 'border-[#D2DDDB]',
              iconStart && 'ps-10',
              iconEnd && 'pe-10'
            )}
            {...props}
          />
          {iconEnd && (
            <div className="absolute end-3 flex items-center text-[#465A60] pointer-events-none">
              {iconEnd}
            </div>
          )}
        </div>
        {(error || helperText) && (
          <p
            className={cn(
              'text-xs mt-1',
              error ? 'text-[#B42318]' : 'text-[#465A60]'
            )}
          >
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';

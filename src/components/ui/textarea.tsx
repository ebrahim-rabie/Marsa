import * as React from 'react';
import { cn } from '@/lib/utils';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  showCount?: boolean;
}

/**
 * Multi-line textarea component.
 */
export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    { className, label, error, helperText, showCount, maxLength, id, value, onChange, ...props },
    ref
  ) => {
    const textareaId = id || React.useId();
    const [charCount, setCharCount] = React.useState(
      typeof value === 'string' ? value.length : 0
    );

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (showCount) setCharCount(e.target.value.length);
      if (onChange) onChange(e);
    };

    return (
      <div className={cn('flex flex-col gap-1.5 w-full', className)}>
        {label && (
          <label htmlFor={textareaId} className="text-sm font-medium text-[#465A60]">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          maxLength={maxLength}
          value={value}
          onChange={handleChange}
          className={cn(
            'flex min-h-[80px] w-full rounded-md border bg-white px-3 py-2 text-sm text-[#0A2F38] placeholder:text-[#465A60] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F4C5C] disabled:cursor-not-allowed disabled:opacity-50 transition-colors',
            error ? 'border-[#B42318] focus-visible:ring-[#B42318]' : 'border-[#D2DDDB]'
          )}
          {...props}
        />
        <div className="flex justify-between items-start mt-1">
          <div className="flex-1">
            {(error || helperText) && (
              <p className={cn('text-xs', error ? 'text-[#B42318]' : 'text-[#465A60]')}>
                {error || helperText}
              </p>
            )}
          </div>
          {showCount && maxLength && (
            <p className="text-xs text-[#465A60] ms-2 shrink-0">
              {charCount}/{maxLength}
            </p>
          )}
        </div>
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';

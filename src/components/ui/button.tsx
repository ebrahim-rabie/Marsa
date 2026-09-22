'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Spinner } from './spinner';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'signal' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  loading?: boolean;
}

const buttonVariants = {
  primary: 'bg-[#0F4C5C] text-white hover:bg-[#0A2F38] border border-transparent',
  secondary: 'bg-transparent border border-[#0F4C5C] text-[#0F4C5C] hover:bg-[#F3F7F6]',
  signal: 'bg-[#F2B01E] text-[#0A2F38] hover:bg-[#e0a21b] border border-transparent',
  ghost: 'bg-transparent text-[#465A60] hover:bg-[#F3F7F6] border border-transparent',
  destructive: 'bg-[#B42318] text-white hover:bg-[#8e1b12] border border-transparent',
};

const buttonSizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
};

/**
 * Button component for Marsa design system.
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      loading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F4C5C] disabled:pointer-events-none disabled:opacity-50',
          buttonVariants[variant],
          buttonSizes[size],
          fullWidth && 'w-full',
          className
        )}
        {...props}
      >
        {loading && <Spinner className="me-2" size="sm" />}
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';

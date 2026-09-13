import React from 'react';
import { cn } from './utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive' | 'retro-mac' | 'retro-win';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading = false, children, disabled, ...props }, ref) => {
    const sizeClasses = {
      sm: 'h-8 px-3 text-xs rounded-lg gap-1.5',
      md: 'h-10 px-4 text-sm rounded-xl gap-2',
      lg: 'h-12 px-6 text-base rounded-2xl gap-2.5',
    }[size];

    const variantClasses = {
      primary:
        'bg-[#2F6FED] hover:bg-[#2558BE] text-white shadow-sm font-medium transition-all active:scale-[0.98]',
      secondary:
        'bg-[#FAFAFA] dark:bg-zinc-800 hover:bg-[#F0F0F0] dark:hover:bg-zinc-700 text-[#111111] dark:text-zinc-100 border border-[#E5E5E5] dark:border-zinc-700 font-medium transition-all active:scale-[0.98]',
      ghost:
        'hover:bg-black/5 dark:hover:bg-white/10 text-[#6B6B6B] dark:text-zinc-400 hover:text-[#111111] dark:hover:text-zinc-100 font-medium transition-all',
      destructive:
        'bg-[#E5484D] hover:bg-[#C93B40] text-white font-medium shadow-sm transition-all active:scale-[0.98]',
      'retro-mac':
        'relative overflow-hidden bg-black text-white hover:bg-neutral-800 font-medium shadow-md transition-all active:scale-[0.98] border border-white/20',
      'retro-win':
        'relative overflow-hidden bg-white dark:bg-zinc-900 text-[#111111] dark:text-zinc-100 hover:bg-neutral-50 dark:hover:bg-zinc-800 font-medium shadow-sm border border-[#E5E5E5] dark:border-zinc-800 transition-all active:scale-[0.98]',
    }[variant];

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          'inline-flex items-center justify-center font-sans tracking-tight cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none transition-transform',
          sizeClasses,
          variantClasses,
          className
        )}
        {...props}
      >
        {/* Retro gloss reflection line on top for retro-mac & retro-win variants */}
        {(variant === 'retro-mac' || variant === 'retro-win') && (
          <div
            className="absolute top-0 inset-x-0 h-1/2 pointer-events-none opacity-20"
            style={{
              background: 'linear-gradient(180deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0) 100%)',
            }}
          />
        )}
        {isLoading && (
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

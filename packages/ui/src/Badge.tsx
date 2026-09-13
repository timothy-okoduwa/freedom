import React from 'react';
import { cn } from './utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'accent' | 'success' | 'warning' | 'danger' | 'retro-pill';
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'default',
  children,
  ...props
}) => {
  const variantStyles = {
    default: 'bg-black/5 text-[#4B4B4B] border border-black/5',
    accent: 'bg-[#EAF1FE] text-[#2F6FED] border border-[#2F6FED]/20',
    success: 'bg-[#E8F8F0] text-[#1FAE6B] border border-[#1FAE6B]/20',
    warning: 'bg-[#FEF5E7] text-[#E8A33D] border border-[#E8A33D]/20',
    danger: 'bg-[#FDECEE] text-[#E5484D] border border-[#E5484D]/20',
    'retro-pill': 'bg-white/90 backdrop-blur-sm text-black border border-black/10 shadow-sm font-mono',
  }[variant];

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium tracking-tight select-none',
        variantStyles,
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};

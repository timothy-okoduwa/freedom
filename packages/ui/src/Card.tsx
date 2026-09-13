import React from 'react';
import { cn } from './utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'surface' | 'flat' | 'raised';
}

export const Card: React.FC<CardProps> = ({
  className,
  variant = 'default',
  children,
  ...props
}) => {
  const variantStyles = {
    default: 'bg-white dark:bg-[#18181B] border border-[#E5E5E5] dark:border-[#27272A] rounded-2xl shadow-sm text-[#111] dark:text-white',
    surface: 'bg-[#FAFAFA] dark:bg-[#141417] border border-[#E5E5E5] dark:border-[#27272A] rounded-2xl text-[#111] dark:text-white',
    flat: 'bg-transparent border border-[#E5E5E5] dark:border-[#27272A] rounded-2xl text-[#111] dark:text-white',
    raised: 'bg-white dark:bg-[#18181B] border border-[#E5E5E5] dark:border-[#27272A] rounded-2xl shadow-lg text-[#111] dark:text-white',
  }[variant];

  return (
    <div className={cn(variantStyles, 'p-5 transition-all', className)} {...props}>
      {children}
    </div>
  );
};

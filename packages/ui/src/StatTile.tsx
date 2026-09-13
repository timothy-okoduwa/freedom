import React from 'react';
import { cn } from './utils';

export interface StatTileProps {
  label: string;
  value: string | number;
  subValue?: string;
  icon?: React.ReactNode;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  className?: string;
}

export const StatTile: React.FC<StatTileProps> = ({
  label,
  value,
  subValue,
  icon,
  trend,
  className,
}) => {
  return (
    <div className={cn('p-5 rounded-2xl bg-white dark:bg-[#18181B] border border-[#E5E5E5] dark:border-[#27272A] shadow-xs flex flex-col justify-between', className)}>
      <div className="flex items-center justify-between text-[#6B6B6B] dark:text-[#A1A1AA] mb-3">
        <span className="text-xs font-medium uppercase tracking-wider">{label}</span>
        {icon && <div className="text-lg text-[#2F6FED]">{icon}</div>}
      </div>
      <div>
        <div className="text-3xl font-semibold tracking-tight text-[#111111] dark:text-white font-mono tabular-nums">
          {value}
        </div>
        {(subValue || trend) && (
          <div className="flex items-center gap-2 mt-1 text-xs">
            {trend && (
              <span
                className={cn(
                  'font-medium',
                  trend.isPositive ? 'text-[#1FAE6B]' : 'text-[#E5484D]'
                )}
              >
                {trend.isPositive ? '↑' : '↓'} {trend.value}
              </span>
            )}
            {subValue && <span className="text-[#A3A3A3]">{subValue}</span>}
          </div>
        )}
      </div>
    </div>
  );
};

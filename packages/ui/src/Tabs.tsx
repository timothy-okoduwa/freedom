import React from 'react';
import { cn } from './utils';

export interface TabItem {
  id: string;
  label: React.ReactNode;
  badge?: React.ReactNode;
}

export interface TabsProps {
  items: TabItem[];
  activeId: string;
  onChange: (id: string) => void;
  className?: string;
  variant?: 'pill' | 'underline' | 'retro';
}

export const Tabs: React.FC<TabsProps> = ({
  items,
  activeId,
  onChange,
  className,
  variant = 'pill',
}) => {
  if (variant === 'retro') {
    return (
      <div className={cn('inline-flex p-1 bg-[#EBEBEB] rounded-xl border border-black/10 shadow-inner', className)}>
        {items.map((tab) => {
          const isActive = tab.id === activeId;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              className={cn(
                'relative px-4 py-1.5 rounded-lg text-xs font-medium transition-all select-none cursor-pointer flex items-center gap-1.5',
                isActive
                  ? 'bg-white text-black shadow-sm font-semibold'
                  : 'text-[#6B6B6B] hover:text-black'
              )}
            >
              {tab.label}
              {tab.badge && <span className="ml-1">{tab.badge}</span>}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className={cn('flex items-center gap-1 border-b border-[#E5E5E5]', className)}>
      {items.map((tab) => {
        const isActive = tab.id === activeId;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={cn(
              'px-4 py-2 text-sm font-medium transition-all border-b-2 -mb-px flex items-center gap-2 cursor-pointer',
              isActive
                ? 'border-[#2F6FED] text-[#2F6FED]'
                : 'border-transparent text-[#6B6B6B] hover:text-[#111111]'
            )}
          >
            {tab.label}
            {tab.badge && <span className="ml-1">{tab.badge}</span>}
          </button>
        );
      })}
    </div>
  );
};

'use client';

import React, { useState } from 'react';
import { cn } from './utils';

export interface AccordionItem {
  id: string;
  question: string;
  answer: React.ReactNode;
}

export interface AccordionProps {
  items: AccordionItem[];
  defaultOpenId?: string;
  className?: string;
}

export const Accordion: React.FC<AccordionProps> = ({
  items,
  defaultOpenId,
  className,
}) => {
  const [openIds, setOpenIds] = useState<Set<string>>(
    new Set(defaultOpenId ? [defaultOpenId] : [])
  );

  const toggle = (id: string) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div className={cn('flex flex-col divide-y divide-black/10 border-y border-black/10', className)}>
      {items.map((item) => {
        const isOpen = openIds.has(item.id);
        return (
          <div key={item.id} className="py-4 select-none">
            <button
              type="button"
              onClick={() => toggle(item.id)}
              className="w-full flex items-center justify-between text-left text-base sm:text-lg font-medium text-[#111111] hover:text-[#2F6FED] transition-colors cursor-pointer"
            >
              <span>{item.question}</span>
              <span
                className={cn(
                  'ml-4 text-xl font-mono text-[#6B6B6B] transition-transform duration-200',
                  isOpen && 'rotate-45 text-[#2F6FED]'
                )}
              >
                +
              </span>
            </button>
            <div
              className={cn(
                'grid transition-all duration-300 ease-in-out overflow-hidden text-sm sm:text-base text-[#6B6B6B]',
                isOpen ? 'grid-rows-[1fr] opacity-100 pt-3' : 'grid-rows-[0fr] opacity-0'
              )}
            >
              <div className="overflow-hidden leading-relaxed">{item.answer}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

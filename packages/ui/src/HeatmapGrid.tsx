import React from 'react';
import { cn } from './utils';

export interface HeatmapDay {
  date: string; // YYYY-MM-DD
  completionPct: number; // 0 to 100
  tasksCompleted?: number;
  tasksTotal?: number;
}

export interface HeatmapGridProps {
  days: HeatmapDay[];
  weeksCount?: number;
  className?: string;
  onDayClick?: (day: HeatmapDay) => void;
}

export const HeatmapGrid: React.FC<HeatmapGridProps> = ({
  days,
  weeksCount = 18,
  className,
  onDayClick,
}) => {
  const getTierColor = (pct: number) => {
    if (pct <= 0) return '#F0F0F0';
    if (pct < 30) return '#C9DCFB';
    if (pct < 60) return '#8FB8F6';
    if (pct < 85) return '#4C87EE';
    return '#2F6FED';
  };

  const dayMap = new Map<string, HeatmapDay>();
  days.forEach((d) => dayMap.set(d.date, d));

  // Generate grid for last N weeks (7 rows = Sun-Sat)
  const today = new Date();
  const cells: { dateStr: string; dayData?: HeatmapDay }[] = [];
  const totalDays = weeksCount * 7;

  for (let i = totalDays - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    cells.push({ dateStr, dayData: dayMap.get(dateStr) });
  }

  return (
    <div className={cn('flex flex-col gap-2 select-none', className)}>
      <div
        className="grid gap-1.5"
        style={{
          gridTemplateRows: 'repeat(7, minmax(0, 1fr))',
          gridAutoFlow: 'column',
        }}
      >
        {cells.map(({ dateStr, dayData }) => {
          const pct = dayData?.completionPct ?? 0;
          const color = getTierColor(pct);

          return (
            <div
              key={dateStr}
              onClick={() => dayData && onDayClick?.(dayData)}
              className={cn(
                'w-3.5 h-3.5 rounded-[3px] transition-all hover:scale-125 cursor-pointer relative group hover:z-50',
                pct <= 0 ? 'bg-[#EBEBEB] dark:bg-[#27272A]' : ''
              )}
              style={pct > 0 ? { backgroundColor: color } : undefined}
              title={`${dateStr}: ${pct}% completed`}
            >
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:flex flex-col items-center z-50 pointer-events-none">
                <div className="bg-black/95 text-white text-[10px] font-mono px-2 py-1 rounded shadow-xl whitespace-nowrap border border-white/10">
                  <span>{dateStr}</span>
                  <span className="text-[#8FB8F6] ml-1 font-semibold">{pct}%</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-end gap-1.5 text-[11px] text-[#A3A3A3] mt-2">
        <span>Less</span>
        <div className="w-2.5 h-2.5 rounded-[2px] bg-[#EBEBEB] dark:bg-[#27272A]" />
        <div className="w-2.5 h-2.5 rounded-[2px] bg-[#C9DCFB]" />
        <div className="w-2.5 h-2.5 rounded-[2px] bg-[#8FB8F6]" />
        <div className="w-2.5 h-2.5 rounded-[2px] bg-[#4C87EE]" />
        <div className="w-2.5 h-2.5 rounded-[2px] bg-[#2F6FED]" />
        <span>More</span>
      </div>
    </div>
  );
};

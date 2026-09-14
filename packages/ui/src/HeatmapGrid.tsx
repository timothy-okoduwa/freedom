import React, { useState } from 'react';
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
  const [hoveredDay, setHoveredDay] = useState<{
    dateStr: string;
    formattedDate: string;
    dayData?: HeatmapDay;
  } | null>(null);

  const getTierColor = (pct: number) => {
    if (pct <= 0) return '#F0F0F0';
    if (pct < 30) return '#C9DCFB';
    if (pct < 60) return '#8FB8F6';
    if (pct < 85) return '#4C87EE';
    return '#2F6FED';
  };

  const dayMap = new Map<string, HeatmapDay>();
  days.forEach((d) => dayMap.set(d.date, d));

  const today = new Date();
  const totalDays = weeksCount * 7;

  // Build grid columns ending on the Saturday of the CURRENT week
  const columns: Array<Array<{ dateStr: string; dayData?: HeatmapDay; dateObj: Date }>> = [];
  
  // Find Saturday of the current week (e.g. Sep 19, 2026 if today is Mon Sep 14, 2026)
  const dayOfWeek = today.getDay(); // 0 = Sun, 1 = Mon, ..., 6 = Sat
  const endSaturday = new Date(today);
  endSaturday.setDate(today.getDate() + (6 - dayOfWeek));

  // Find Sunday of the first column (weeksCount weeks back from endSaturday)
  const startSunday = new Date(endSaturday);
  startSunday.setDate(endSaturday.getDate() - (weeksCount * 7 - 1));

  let current = new Date(startSunday);
  for (let w = 0; w < weeksCount; w++) {
    const weekDays: Array<{ dateStr: string; dayData?: HeatmapDay; dateObj: Date }> = [];
    for (let d = 0; d < 7; d++) {
      const dateStr = current.toISOString().split('T')[0];
      weekDays.push({
        dateStr,
        dayData: dayMap.get(dateStr),
        dateObj: new Date(current),
      });
      current.setDate(current.getDate() + 1);
    }
    columns.push(weekDays);
  }

  // Generate Month Labels
  const monthLabels: { label: string; colIndex: number }[] = [];
  let lastMonth = -1;
  columns.forEach((col, colIdx) => {
    const month = col[0].dateObj.getMonth();
    if (month !== lastMonth) {
      const label = col[0].dateObj.toLocaleString('en-US', { month: 'short' });
      monthLabels.push({ label, colIndex: colIdx });
      lastMonth = month;
    }
  });

  return (
    <div className={cn('flex flex-col gap-3 select-none w-full', className)}>
      {/* Dynamic Hover Status Banner */}
      <div className="flex items-center justify-between text-xs px-3 py-2 bg-[#F8FAFC] dark:bg-[#202024] rounded-lg border border-[#E2E8F0] dark:border-[#2E2E34] transition-all min-h-[36px]">
        {hoveredDay ? (
          <div className="flex items-center gap-3 font-mono">
            <span className="font-bold text-[#111] dark:text-white flex items-center gap-1.5">
              <span>📅</span>
              {hoveredDay.formattedDate}
            </span>
            <span className="text-[#2F6FED] font-bold">
              ⚡ {hoveredDay.dayData?.completionPct ?? 0}% completed
            </span>
            {(hoveredDay.dayData?.tasksTotal ?? 0) > 0 && (
              <span className="text-[#1FAE6B] dark:text-emerald-400 font-medium">
                🎯 {hoveredDay.dayData?.tasksCompleted}/{hoveredDay.dayData?.tasksTotal} tasks done
              </span>
            )}
          </div>
        ) : (
          <span className="text-[#777] dark:text-[#A1A1AA] text-[11px]">
            Hover over any cell on the activity grid to view execution details.
          </span>
        )}
      </div>

      <div className="flex gap-2">
        {/* Day-of-Week Labels */}
        <div className="flex flex-col justify-between pt-5 pb-1 text-[10px] font-mono text-[#888] dark:text-[#71717A] h-[120px]">
          <span>Sun</span>
          <span>Tue</span>
          <span>Thu</span>
          <span>Sat</span>
        </div>

        {/* Heatmap Grid + Month Headers */}
        <div className="flex-1 overflow-x-visible">
          {/* Month Headers */}
          <div className="flex text-[10px] font-mono text-[#888] dark:text-[#71717A] mb-1.5 h-4 relative">
            {monthLabels.map((m, idx) => (
              <span
                key={idx}
                className="absolute"
                style={{ left: `${(m.colIndex / weeksCount) * 100}%` }}
              >
                {m.label}
              </span>
            ))}
          </div>

          {/* Grid Columns */}
          <div
            className="grid gap-1.5"
            style={{
              gridTemplateColumns: `repeat(${weeksCount}, minmax(0, 1fr))`,
              gridTemplateRows: 'repeat(7, minmax(0, 1fr))',
              gridAutoFlow: 'column',
            }}
          >
            {columns.flatMap((col, colIdx) =>
              col.map(({ dateStr, dayData, dateObj }, rowIdx) => {
                const pct = dayData?.completionPct ?? 0;
                const color = getTierColor(pct);
                const formattedDate = dateObj.toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                });

                // Smart edge-safe tooltip positioning
                let verticalPos = 'bottom-full mb-2';
                if (rowIdx < 2) verticalPos = 'top-full mt-2';

                let horizontalPos = 'left-1/2 -translate-x-1/2';
                if (colIdx < 3) horizontalPos = 'left-0 translate-x-0';
                else if (colIdx >= weeksCount - 3) horizontalPos = 'right-0 left-auto translate-x-0';

                return (
                  <div
                    key={dateStr}
                    onClick={() => dayData && onDayClick?.(dayData)}
                    onMouseEnter={() => setHoveredDay({ dateStr, formattedDate, dayData })}
                    onMouseLeave={() => setHoveredDay(null)}
                    className={cn(
                      'w-3.5 h-3.5 rounded-[3px] transition-all hover:scale-125 cursor-pointer relative group hover:z-50',
                      pct <= 0 ? 'bg-[#EBEBEB] dark:bg-[#27272A] hover:bg-[#D4D4D8] dark:hover:bg-[#3F3F46]' : ''
                    )}
                    style={pct > 0 ? { backgroundColor: color } : undefined}
                  >
                    {/* Floating Tooltip with Edge Positioning */}
                    <div
                      className={cn(
                        'absolute hidden group-hover:flex flex-col items-start z-50 pointer-events-none transition-opacity duration-150',
                        verticalPos,
                        horizontalPos
                      )}
                    >
                      <div className="bg-neutral-900/95 dark:bg-black/95 text-white text-[11px] font-mono px-2.5 py-1.5 rounded-md shadow-2xl whitespace-nowrap border border-white/10 flex flex-col gap-0.5">
                        <span className="font-semibold text-slate-200">{formattedDate}</span>
                        <div className="flex items-center gap-1.5 text-[10px]">
                          <span className="text-[#8FB8F6] font-bold">{pct}% completed</span>
                          {(dayData?.tasksTotal ?? 0) > 0 && (
                            <span className="text-slate-400">
                              ({dayData?.tasksCompleted}/{dayData?.tasksTotal})
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between text-[11px] text-[#A3A3A3] mt-1 pt-2 border-t border-[#F1F5F9] dark:border-[#27272A]">
        <span className="text-[10px]">Past {weeksCount} Weeks Activity</span>
        <div className="flex items-center gap-1.5">
          <span>Less</span>
          <div className="w-2.5 h-2.5 rounded-[2px] bg-[#EBEBEB] dark:bg-[#27272A]" />
          <div className="w-2.5 h-2.5 rounded-[2px] bg-[#C9DCFB]" />
          <div className="w-2.5 h-2.5 rounded-[2px] bg-[#8FB8F6]" />
          <div className="w-2.5 h-2.5 rounded-[2px] bg-[#4C87EE]" />
          <div className="w-2.5 h-2.5 rounded-[2px] bg-[#2F6FED]" />
          <span>More</span>
        </div>
      </div>
    </div>
  );
};

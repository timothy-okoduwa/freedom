'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MacWindow, ProgressRing } from '@freedom/ui';
import { DraggableSticker } from './DraggableSticker';

export const DemoPlayer: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [secondsRemaining, setSecondsRemaining] = useState(1458); // ~24m 18s
  const [isPaused, setIsPaused] = useState(false);
  const [activeTaskTitle, setActiveTaskTitle] = useState('Ship Freedom Monorepo Architecture');
  const [plannedMinutes, setPlannedMinutes] = useState(45);
  const [extensionMinutes, setExtensionMinutes] = useState(0);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [isPaused]);

  const totalSeconds = (plannedMinutes + extensionMinutes) * 60;
  const elapsed = totalSeconds - secondsRemaining;
  const progress = Math.min(100, Math.max(0, (elapsed / totalSeconds) * 100));

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const addExtension = (mins: number) => {
    setExtensionMinutes((prev) => prev + mins);
    setSecondsRemaining((prev) => prev + mins * 60);
  };

  return (
    <section ref={containerRef} className="max-w-4xl mx-auto px-4 -mt-6 sm:-mt-10 mb-24 relative z-30 select-none">
      {/* Draggable GIF Stickers around DemoPlayer */}
      <DraggableSticker
        src="/stuff/spongbob.gif"
        alt="Spongebob"
        containerRef={containerRef}
        className="absolute -left-12 -top-10 hidden lg:block rotate-[-8deg]"
        imageClassName="w-16 h-16 object-contain drop-shadow-xl"
        badgeText="Spongebob 🧽"
      />

      <DraggableSticker
        src="/stuff/naruto.gif"
        alt="Naruto"
        soundSrc="/stuff/naruto.mp3"
        containerRef={containerRef}
        className="absolute -right-12 -top-10 hidden lg:block rotate-[6deg]"
        imageClassName="w-16 h-16 object-contain drop-shadow-xl"
        badgeText="Hold/Drag for Naruto theme 🎶"
      />

      <DraggableSticker
        src="/stuff/jon-hamm-dancing.gif"
        alt="Jon Hamm"
        containerRef={containerRef}
        className="absolute -left-16 bottom-4 hidden xl:block rotate-[12deg]"
        imageClassName="w-20 h-auto object-contain rounded-xl border border-black/10 shadow-lg"
        badgeText="Jon Hamm 🕺"
      />

      <DraggableSticker
        src="/stuff/solo-leveling.gif"
        alt="Solo Leveling"
        soundSrc="/stuff/solo-level.mp3"
        containerRef={containerRef}
        className="absolute -right-16 bottom-4 hidden xl:block rotate-[-10deg]"
        imageClassName="w-16 h-16 object-contain drop-shadow-xl"
        badgeText="Hold/Drag for Solo Leveling theme ⚔️"
      />
      <MacWindow
        title="Freedom Execution Engine v2.0"
        caption="freedom-runtime.mov"
        className="w-full"
      >
        <div className="bg-[#FFFFFF] p-6 sm:p-10 border-b border-black/5">
          {/* Top Status Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E5E5E5] pb-6 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-[#1FAE6B] animate-pulse" />
              <div>
                <span className="text-xs uppercase font-mono tracking-wider text-[#6B6B6B] block">
                  Current Execution
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-[#111111] tracking-tight">
                  {activeTaskTitle}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs px-3 py-1 rounded-full bg-[#EAF1FE] text-[#2F6FED] font-medium font-mono">
                Task 2 of 5
              </span>
              {extensionMinutes > 0 && (
                <span className="text-xs px-3 py-1 rounded-full bg-[#FEF5E7] text-[#E8A33D] font-medium font-mono">
                  +{extensionMinutes}m Extended
                </span>
              )}
            </div>
          </div>

          {/* Central Countdown Hero Canvas */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-14 my-4">
            {/* Big Calm Progress Ring */}
            <ProgressRing
              progress={progress}
              size={180}
              strokeWidth={10}
              color={extensionMinutes > 0 ? '#E8A33D' : '#2F6FED'}
              bgColor="#F0F0F0"
            >
              <div className="flex flex-col items-center">
                <span className="text-4xl sm:text-5xl font-mono font-bold tracking-tighter text-[#111111] tabular-nums">
                  {formatTime(secondsRemaining)}
                </span>
                <span className="text-xs text-[#6B6B6B] mt-1 font-mono">
                  {Math.round(progress)}% done
                </span>
              </div>
            </ProgressRing>

            {/* Interactive Control Panel */}
            <div className="flex flex-col gap-3 w-full sm:w-auto">
              <div className="text-xs font-mono text-[#777] uppercase tracking-wider">
                Live Interactive Controls
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsPaused(!isPaused)}
                  className="px-5 py-2.5 rounded-xl bg-black text-white text-xs font-semibold hover:bg-neutral-800 transition-all cursor-pointer shadow-xs active:scale-95 flex items-center gap-2"
                >
                  {isPaused ? '▶ Resume Timer' : '⏸ Pause Timer'}
                </button>
                <button
                  type="button"
                  onClick={() => addExtension(10)}
                  className="px-4 py-2.5 rounded-xl bg-[#FAFAFA] border border-[#E5E5E5] text-xs font-semibold text-black hover:bg-neutral-100 transition-all cursor-pointer active:scale-95"
                >
                  +10 min
                </button>
              </div>

              {/* Up Next Card */}
              <div className="mt-3 p-3.5 rounded-xl bg-[#FAFAFA] border border-[#E5E5E5] text-xs space-y-1">
                <div className="text-[10px] uppercase font-mono tracking-wider text-[#A3A3A3]">
                  Up Next in Queue
                </div>
                <div className="flex items-center justify-between font-medium text-[#111]">
                  <span>☕ 10m Coffee & Recovery Break</span>
                  <span className="text-[#2F6FED] font-mono">Auto-starts</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="bg-[#FAFAFA] px-6 py-3.5 flex flex-wrap items-center justify-between gap-3 text-xs text-[#6B6B6B]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#1FAE6B]" />
            <span>Zero manual task checking. When time finishes, queue advances automatically.</span>
          </div>
          <span className="font-mono text-[#2F6FED] font-medium hidden sm:inline">
            Timestamp Source of Truth: Electron Main Process
          </span>
        </div>
      </MacWindow>
    </section>
  );
};

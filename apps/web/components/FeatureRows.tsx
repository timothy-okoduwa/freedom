'use client';

import React, { useRef } from 'react';
import { MacWindow, ProgressRing } from '@freedom/ui';
import { DraggableSticker } from './DraggableSticker';

export const FeatureRows: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <section id="features" ref={containerRef} className="max-w-6xl mx-auto px-4 py-16 sm:py-24 space-y-24 sm:space-y-36 relative select-none">
      {/* Draggable Stickers in FeatureRows */}
      <DraggableSticker
        src="/stuff/naruto.gif"
        alt="Naruto Running"
        soundSrc="/stuff/naruto.mp3"
        containerRef={containerRef}
        className="absolute left-2 top-20 hidden lg:block rotate-[-6deg]"
        imageClassName="w-16 h-16 object-contain drop-shadow-xl"
        badgeText="Hold/Drag for Naruto theme 🎶"
      />

      <DraggableSticker
        src="/stuff/cat.jpg"
        alt="Cat"
        containerRef={containerRef}
        className="absolute right-2 top-24 hidden lg:block rotate-[10deg]"
        imageClassName="w-14 h-14 object-cover rounded-xl border-2 border-black shadow-lg"
        badgeText="Cat 🐱"
      />

      <DraggableSticker
        src="/stuff/spongbob.gif"
        alt="Spongebob"
        containerRef={containerRef}
        className="absolute left-2 top-[48%] hidden xl:block rotate-[8deg]"
        imageClassName="w-16 h-16 object-contain drop-shadow-xl"
        badgeText="Spongebob 🧽"
      />

      <DraggableSticker
        src="/stuff/gif-pokemon.webp"
        alt="Pokemon"
        soundSrc="/stuff/pokemon.mp3"
        containerRef={containerRef}
        className="absolute right-2 top-[75%] hidden lg:block rotate-[-4deg]"
        imageClassName="w-16 h-16 object-contain drop-shadow-xl"
        badgeText="Hold/Drag for Pokemon theme 🎶"
      />
      {/* SECTION HEADER */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-xs uppercase font-mono tracking-widest text-[#2F6FED] font-semibold">
          capabilities
        </span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[#111111]">
          not a todo list. an engine.
        </h2>
        <p className="text-base sm:text-lg text-[#6B6B6B]">
          Todo apps ask you to manage them. Freedom manages the clock so you can just do the work.
        </p>
      </div>

      {/* FEATURE ROW 1: The Automatic Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/5 text-xs font-mono font-medium text-black">
            <span>01</span>
            <span>·</span>
            <span>hands-free flow</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#111111]">
            Plan once. The day executes itself.
          </h3>
          <p className="text-base text-[#6B6B6B] leading-relaxed">
            Order your tasks and breaks in the morning. When you hit Start Day, Freedom steps through
            the queue automatically. When a task ends, your break begins. When the break ends, the
            next task is ready. No manual clicking or decision fatigue.
          </p>
          <div className="pt-2 flex items-center gap-4 text-xs font-medium text-[#111111]">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1FAE6B]" />
              24-Hour Cap Safeguard
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2F6FED]" />
              Auto-Transitioning Breaks
            </span>
          </div>
        </div>

        <div className="w-full">
          <MacWindow caption="queue-execution.mov" className="rotate-1 hover:rotate-0 transition-transform">
            <div className="p-6 bg-white space-y-3">
              <div className="p-3 rounded-xl bg-[#EAF1FE] border border-[#2F6FED]/20 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#2F6FED] animate-ping" />
                  <span className="font-semibold text-sm text-[#111]">Write Architecture Spec</span>
                </div>
                <span className="font-mono text-xs font-bold text-[#2F6FED]">32m left</span>
              </div>
              <div className="p-3 rounded-xl bg-[#FAFAFA] border border-[#E5E5E5] flex items-center justify-between opacity-80">
                <div className="flex items-center gap-3">
                  <span className="text-xs">☕</span>
                  <span className="text-xs font-medium text-[#555]">5m Mindfulness & Water</span>
                </div>
                <span className="font-mono text-xs text-[#888]">Upcoming</span>
              </div>
              <div className="p-3 rounded-xl bg-[#FAFAFA] border border-[#E5E5E5] flex items-center justify-between opacity-60">
                <div className="flex items-center gap-3">
                  <span className="text-xs">💻</span>
                  <span className="text-xs font-medium text-[#555]">Ship Database Schema Migration</span>
                </div>
                <span className="font-mono text-xs text-[#888]">45m</span>
              </div>
            </div>
          </MacWindow>
        </div>
      </div>

      {/* FEATURE ROW 2: HeyClicky iMessage Chat & Interactive Tool Demo (Screenshot 2 style) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        <div className="space-y-6 order-1 lg:order-1">
          {/* Soundwave Rhythm Equalizer Bars */}
          <div className="flex items-center gap-1 h-5">
            <span className="w-1 bg-black/30 rounded-full h-2 animate-pulse" />
            <span className="w-1 bg-black/40 rounded-full h-3 animate-bounce" />
            <span className="w-1 bg-[#2F6FED] rounded-full h-5 animate-pulse" />
            <span className="w-1 bg-[#2F6FED] rounded-full h-3 animate-bounce" />
            <span className="w-1 bg-black/40 rounded-full h-4 animate-pulse" />
            <span className="w-1 bg-black/30 rounded-full h-2 animate-bounce" />
            <span className="w-1 bg-[#2F6FED] rounded-full h-4 animate-pulse" />
          </div>

          {/* iMessage Chat Bubbles (HeyClicky signature style) */}
          <div className="space-y-3 font-sans">
            <div className="inline-block px-5 py-3 rounded-2xl rounded-bl-xs bg-gradient-to-r from-[#60A5FA] to-[#2563EB] text-white text-base font-semibold shadow-md max-w-md">
              hey freedom, help me execute deep work and run my queue
            </div>
            <div>
              <div className="inline-block px-4 py-2 rounded-2xl rounded-tl-xs bg-[#F59E0B] text-white text-sm font-bold shadow-sm">
                on it!
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#111111]">
              finally do the thing
            </h3>
            <p className="text-base text-[#6B6B6B] leading-relaxed max-w-lg">
              from fl studio to claude code, jump into any tool. set your day plan, ask questions, and freedom lives on your screen to guide your deep work focus.
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-medium text-[#111111]">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2F6FED]" />
              Zero Decision Fatigue
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1FAE6B]" />
              Instant Task Auto-Advance
            </span>
          </div>
        </div>

        <div className="w-full order-2 lg:order-2">
          <MacWindow caption="FL Studio / Tool Execution Demo" className="rotate-1 hover:rotate-0 transition-transform shadow-2xl">
            <div className="relative bg-[#1A1E29] rounded-b-lg overflow-hidden group p-4 border border-white/10">
              <div className="relative rounded-xl overflow-hidden border border-white/10">
                <video
                  src="/stuff/h-bw.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-auto max-h-[280px] object-cover"
                />
                {/* Yellow Arrow Accent pointing on screen */}
                <div className="absolute top-1/3 left-1/4 pointer-events-none flex items-center gap-2">
                  <span className="text-yellow-400 font-mono font-bold text-xl animate-bounce">↗ DL Breaker</span>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-zinc-400">
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  Active Audio & Execution Stream
                </span>
                <span>44.1 kHz 60 BPM</span>
              </div>
            </div>
          </MacWindow>
        </div>
      </div>

      {/* FEATURE ROW 3: Planned vs. Actual & Productivity Score */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/5 text-xs font-mono font-medium text-black">
            <span>03</span>
            <span>·</span>
            <span>objective measurement</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#111111]">
            Planned vs. Actual. Real accountability.
          </h3>
          <p className="text-base text-[#6B6B6B] leading-relaxed">
            Checking off a 30-minute task after working on it for 4 hours isn't productivity—it's
            procrastination. Freedom measures your planning accuracy alongside completion, computing
            an honest Productivity Score from 0 to 100 each day.
          </p>
          <div className="pt-2 flex items-center gap-4 text-xs font-medium text-[#111111]">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1FAE6B]" />
              75% Streak Requirement
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E8A33D]" />
              Transparent Score Breakdown
            </span>
          </div>
        </div>

        <div className="w-full">
          <MacWindow caption="planned-vs-actual.mov" className="rotate-1 hover:rotate-0 transition-transform">
            <div className="p-6 bg-white space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-mono tracking-wider text-[#6B6B6B]">
                  Daily Wrap-up
                </span>
                <span className="text-xs font-bold text-[#2F6FED] font-mono">92 Score</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-[#FAFAFA] border border-[#E5E5E5]">
                  <div className="text-[10px] text-[#777]">Planned Time</div>
                  <div className="text-lg font-bold font-mono text-[#111]">4h 15m</div>
                </div>
                <div className="p-3 rounded-xl bg-[#FAFAFA] border border-[#E5E5E5]">
                  <div className="text-[10px] text-[#777]">Actual Time</div>
                  <div className="text-lg font-bold font-mono text-[#111]">4h 22m</div>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-[#E8F8F0] border border-[#1FAE6B]/20 text-xs text-[#1FAE6B] font-medium flex items-center justify-between">
                <span>Planning Accuracy: 96.8%</span>
                <span>🔥 12-Day Streak</span>
              </div>
            </div>
          </MacWindow>
        </div>
      </div>

      {/* FEATURE ROW 4: Crash-Proof & Offline-First */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        <div className="w-full order-2 lg:order-1">
          <MacWindow caption="timestamp-engine.mov" className="-rotate-1 hover:rotate-0 transition-transform">
            <div className="p-6 bg-[#FAFAFA] space-y-4 font-mono text-xs">
              <div className="p-4 rounded-xl bg-black text-white space-y-2">
                <div className="text-[#888]">// Pure Timestamp Math (No drift)</div>
                <div className="text-[#8FB8F6]">
                  getRemainingMs(state) = (planned + ext) - (now - startedAt - pausedMs)
                </div>
                <div className="text-[#1FAE6B] pt-2">
                  ✓ Sleep mode auto-detected & preserved
                </div>
                <div className="text-[#1FAE6B]">
                  ✓ Electron-store written on every state transition
                </div>
              </div>
            </div>
          </MacWindow>
        </div>

        <div className="space-y-4 order-1 lg:order-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/5 text-xs font-mono font-medium text-black">
            <span>04</span>
            <span>·</span>
            <span>bulletproof runtime</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#111111]">
            Crash-proof. Sleep-proof. Offline-ready.
          </h3>
          <p className="text-base text-[#6B6B6B] leading-relaxed">
            Most web timer tools break if your laptop sleeps, you lose internet, or you refresh the page.
            Freedom stores fixed timestamps in Electron's main process and writes to local disk on every
            tick. If your computer crashes, relaunching immediately offers 1-click resume.
          </p>
        </div>
      </div>
    </section>
  );
};

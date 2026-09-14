'use client';

import React, { useRef } from 'react';
import { Accordion } from '@freedom/ui';
import { DraggableSticker } from './DraggableSticker';

const FAQ_ITEMS = [
  {
    id: 'what-is-freedom',
    question: 'what is freedom?',
    answer:
      'Freedom is an execution engine for your computer. Instead of staring at a todo list and manually checking off items, you queue up your tasks and breaks in the morning, hit "Start Day", and Freedom runs the clock—timing each item, prompting on overruns, transitioning automatically, and measuring your planning accuracy.',
  },
  {
    id: 'how-different',
    question: 'how does it differ from a todo app or Pomodoro timer?',
    answer:
      'Todo apps require manual discipline: you have to look at them, decide what to do next, and remember to check them off. Pomodoro timers are rigid 25/5 intervals with no concept of your actual workload. Freedom treats your day as an ordered queue of custom-timed tasks with automatic transitions, measuring whether your actual time matched your plan.',
  },
  {
    id: 'floating-pill',
    question: 'what is the Granola-style floating widget?',
    answer:
      'While a task is running, you can minimize the main Freedom app completely. A tiny, calm pill stays on your screen showing your current task progress and countdown. It never steals focus from your IDE, browser, or documents, and it can be placed anywhere on screen.',
  },
  {
    id: 'offline',
    question: 'does it work offline?',
    answer:
      'Yes, 100%. Freedom’s runtime engine lives locally in your desktop process and writes every state change to disk. You can run full day plans on airplanes, off-grid cabins, or during internet outages without missing a single tick.',
  },
  {
    id: 'sleep-crash',
    question: 'what happens if my computer sleeps or crashes?',
    answer:
      'We use pure timestamp arithmetic instead of naive incrementing counters. If your laptop goes to sleep, the engine detects the suspend/resume events and accounts for sleep time. If your machine crashes, launching Freedom immediately presents a 1-click resume screen with your exact remaining time.',
  },
  {
    id: 'productivity-score',
    question: 'how is the Productivity Score calculated?',
    answer:
      'The score is a transparent 0–100 calculation based on four factors: completion percentage (40%), planning accuracy (35%), streak bonus (10%), and failure penalties. It rewards realistic estimation just as much as raw speed.',
  },
  {
    id: 'privacy',
    question: 'is my task data private?',
    answer:
      'Your task titles and day plans are strictly private to your account. Only your aggregate public stats (total productive minutes and current streak) are visible on opt-in leaderboards. We never sell data or train AI models on your task descriptions.',
  },
  {
    id: 'platforms',
    question: 'which platforms are supported?',
    answer:
      'Freedom currently supports macOS (Apple Silicon & Intel, Sonoma 14+ and Sequoia). A Windows 11 desktop release is currently in closed testing and shipping next month.',
  },
];

export const FaqSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <section id="faq" ref={containerRef} className="max-w-3xl mx-auto px-4 py-24 sm:py-32 relative select-none">
      {/* Smaller Question GIF positioned on right side without pushing centered layout */}
      <div className="absolute right-0 md:-right-24 top-16 hidden sm:block z-10">
        <div className="p-2 rounded-xl bg-white/90 backdrop-blur-xs border border-black/10 shadow-lg flex flex-col items-center rotate-[6deg] hover:rotate-0 transition-transform">
          <img
            src="/stuff/question.gif"
            alt="Question Mark Animation"
            className="w-24 sm:w-32 h-auto object-contain rounded-lg"
          />
          <span className="text-[9px] font-mono text-[#888] mt-1 font-medium">got questions?</span>
        </div>
      </div>

      {/* Centered Label & Header */}
      <div className="text-center space-y-3 mb-12">
        <span className="text-xs uppercase font-mono tracking-widest text-[#2F6FED] font-semibold">
          faq
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#111111]">
          frequently asked questions
        </h2>
        <p className="text-sm sm:text-base text-[#6B6B6B]">
          everything you need to know about freedom and how it runs your day.
        </p>
      </div>

      {/* Accordion Component */}
      <Accordion items={FAQ_ITEMS} defaultOpenId="what-is-freedom" />

      {/* Side Draggable Stickers */}
      <DraggableSticker
        src="/stuff/spongbob.gif"
        alt="Spongebob"
        containerRef={containerRef}
        className="absolute -left-16 top-24 hidden lg:block rotate-[-8deg]"
        imageClassName="w-14 h-14 object-contain drop-shadow-xl"
        badgeText="Spongebob 🧽"
      />

      <DraggableSticker
        src="/stuff/naruto.gif"
        alt="Naruto"
        soundSrc="/stuff/naruto.mp3"
        containerRef={containerRef}
        className="absolute -left-16 bottom-24 hidden lg:block rotate-[6deg]"
        imageClassName="w-14 h-14 object-contain drop-shadow-xl"
        badgeText="Hold/Drag for Naruto theme 🎶"
      />
    </section>
  );
};

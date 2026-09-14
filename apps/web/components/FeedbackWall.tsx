'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { MacWindow } from '@freedom/ui';
import { DraggableSticker } from './DraggableSticker';

interface Testimonial {
  name: string;
  handle: string;
  avatar: string;
  text: string;
  time: string;
  likes: string;
  reposts: string;
  tint: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    name: 'Sarah Chen',
    handle: '@schen_dev',
    avatar: 'SC',
    text: 'Freedom completely eliminated my afternoon focus slump. Hitting "Start Day" and having the floating widget guide me without stealing focus is pure magic.',
    time: 'Yesterday, 4:18 PM',
    likes: '1.4k',
    reposts: '84',
    tint: 'rgba(52, 199, 89, 0.25)', // green
  },
  {
    name: 'David Vance',
    handle: '@davidvance',
    avatar: 'DV',
    text: 'Finally an app that measures planning accuracy instead of just mindless checkbox ticking. My Productivity Score went from 68 to 91 in two weeks.',
    time: 'May 12, 11:04 AM',
    likes: '890',
    reposts: '42',
    tint: 'rgba(0, 195, 208, 0.25)', // cyan
  },
  {
    name: 'Elena Rostova',
    handle: '@erostova_ux',
    avatar: 'ER',
    text: 'The Granola-style floating pill is the only way timer apps should exist on desktop. Unobtrusive, calm, and keeps me anchored.',
    time: 'Jun 2, 8:45 PM',
    likes: '2.1k',
    reposts: '165',
    tint: 'rgba(255, 102, 102, 0.25)', // coral
  },
  {
    name: 'Marcus Brody',
    handle: '@mbrody_ai',
    avatar: 'MB',
    text: 'Laptop died mid-task, rebooted, and Freedom opened with my exact timestamp and 1-click resume ready. That is how software should be built.',
    time: 'May 28, 2:15 PM',
    likes: '3.4k',
    reposts: '290',
    tint: 'rgba(0, 136, 255, 0.25)', // blue
  },
  {
    name: 'Chloe Zhang',
    handle: '@chloezhang',
    avatar: 'CZ',
    text: 'Replaced 4 different apps (Pomodoro, todo list, time tracker, calendar blocks) with Freedom. Hands down the highest ROI tool on my Mac.',
    time: 'Jun 14, 10:20 AM',
    likes: '940',
    reposts: '51',
    tint: 'rgba(255, 141, 40, 0.25)', // orange
  },
  {
    name: 'Alex Rivera',
    handle: '@arivera_io',
    avatar: 'AR',
    text: 'The overtime prompt "+10m / Finish" strikes the perfect balance. No annoying alarms, just gentle accountability.',
    time: 'Jun 19, 7:32 PM',
    likes: '1.2k',
    reposts: '67',
    tint: 'rgba(255, 204, 0, 0.25)', // yellow
  },
];

export const FeedbackWall: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <section ref={containerRef} className="py-20 sm:py-28 overflow-hidden bg-white relative select-none">
      {/* Draggable Stickers */}
      <DraggableSticker
        src="/stuff/spongbob.gif"
        alt="Spongebob"
        containerRef={containerRef}
        className="absolute left-[4%] top-[120px] hidden lg:block rotate-[-7deg]"
        imageClassName="w-16 h-16 object-contain drop-shadow-xl"
        badgeText="Spongebob 🧽"
      />

      <DraggableSticker
        src="/stuff/naruto.gif"
        alt="Naruto"
        soundSrc="/stuff/naruto.mp3"
        containerRef={containerRef}
        className="absolute right-[4%] top-[120px] hidden lg:block rotate-[5deg]"
        imageClassName="w-16 h-16 object-contain drop-shadow-xl"
        badgeText="Hold/Drag for Naruto theme 🎶"
      />

      <DraggableSticker
        src="/stuff/gif-pokemon.webp"
        alt="Pokemon"
        soundSrc="/stuff/pokemon.mp3"
        containerRef={containerRef}
        className="absolute left-[5%] bottom-[120px] hidden xl:block rotate-[10deg]"
        imageClassName="w-16 h-16 object-contain drop-shadow-xl"
        badgeText="Hold/Drag for Pokemon theme 🎶"
      />
      {/* Label */}
      <div className="text-center mb-6">
        <span className="text-xs uppercase font-mono tracking-widest text-[#2F6FED] font-semibold">
          feedback
        </span>
      </div>

      {/* Marquee "they use it everyday" */}
      <div className="relative w-full overflow-hidden border-y border-black/8 py-4 mb-16 select-none bg-[#FAFAFA]">
        <div className="flex w-max animate-marquee space-x-8 text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-[#111111]">
          {Array.from({ length: 8 }).map((_, i) => (
            <span key={i} className="flex items-center gap-8">
              <span className={i % 2 === 0 ? 'text-[#111111]' : 'text-[#2F6FED]'}>
                they use it everyday
              </span>
              <span className="text-[#E5E5E5]">·</span>
            </span>
          ))}
        </div>
      </div>

      {/* 3-Column Review Cards Grid */}
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {TESTIMONIALS.map((t, idx) => (
          <MacWindow
            key={idx}
            tintHeader={t.tint}
            className="hover:-translate-y-1 transition-transform duration-200"
          >
            <div className="p-5 bg-white space-y-3 font-sans">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-black/5 border border-black/5 font-bold text-xs flex items-center justify-center text-[#333]">
                    {t.avatar}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#111]">{t.name}</div>
                    <div className="text-[11px] text-[#777]">{t.handle}</div>
                  </div>
                </div>
                <span className="text-xs text-[#2F6FED] font-medium">Follow</span>
              </div>

              {/* Body */}
              <p className="text-xs sm:text-sm text-[#333] leading-relaxed font-normal">
                "{t.text}"
              </p>

              {/* Timestamp & Stats */}
              <div className="pt-2 border-t border-black/5 flex items-center justify-between text-[10px] text-[#888] font-mono">
                <span>{t.time}</span>
                <div className="flex items-center gap-3">
                  <span>🔁 {t.reposts}</span>
                  <span>❤️ {t.likes}</span>
                </div>
              </div>
            </div>
          </MacWindow>
        ))}
      </div>

      {/* Ticker Banner */}
      <div className="max-w-xl mx-auto mt-16 px-4 space-y-5">
        <div className="p-4 rounded-2xl bg-[#FAFAFA] border border-[#E5E5E5] text-center shadow-xs flex items-center justify-center gap-2 text-xs sm:text-sm text-[#111]">
          <span className="w-2 h-2 rounded-full bg-[#1FAE6B] animate-ping" />
          <span className="font-semibold">25,000+ productive days run</span>
          <span className="text-[#888]">·</span>
          <Link href="/download" className="text-[#2F6FED] font-semibold hover:underline">
            join them today →
          </Link>
        </div>

        {/* Jon Hamm Dancing GIF right under the 25,000+ productive days run div */}
        <div className="flex justify-center pt-1">
          <img
            src="/stuff/jon-hamm-dancing.gif"
            alt="Jon Hamm Dancing"
            className="w-28 sm:w-36 h-auto object-contain rounded-xl shadow-lg border border-black/10 hover:scale-105 transition-transform cursor-pointer"
          />
        </div>
      </div>
    </section>
  );
};

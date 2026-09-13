'use client';

import React, { useRef } from 'react';
import { MacWindow } from '@freedom/ui';
import { motion } from 'framer-motion';

export const Hero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <section ref={containerRef} className="relative pt-24 pb-16 md:pt-32 md:pb-24 px-4 overflow-hidden min-h-[880px] flex flex-col items-center justify-center select-none">
      {/* Background Dot Grid Canvas Accent */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.18]"
        style={{
          backgroundImage:
            'radial-gradient(#94A3B8 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}
      />

      {/* 1. TOP-CENTER MAC WINDOW (Small, elevated high above headline with 80px+ clearance) */}
      <motion.div
        drag
        dragConstraints={containerRef}
        dragElastic={0}
        whileHover={{ scale: 1.05, zIndex: 50 }}
        whileTap={{ scale: 0.98 }}
        className="absolute top-2 left-1/2 -translate-x-1/2 hidden md:block cursor-grab active:cursor-grabbing z-20 w-[160px]"
      >
        <MacWindow caption="heyfreedom-draw.mov">
          <div className="p-1 bg-black/90 text-white rounded-b-lg">
            <video
              src="/stuff/gif-summerlove.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-14 object-cover rounded-md border border-white/10"
            />
          </div>
        </MacWindow>
      </motion.div>

      {/* 2. TOP-LEFT TALL VERTICAL MAC WINDOW */}
      <motion.div
        drag
        dragConstraints={containerRef}
        dragElastic={0}
        whileHover={{ scale: 1.05, zIndex: 50 }}
        whileTap={{ scale: 0.98 }}
        className="absolute left-3 xl:left-8 top-8 hidden md:block rotate-[-4deg] cursor-grab active:cursor-grabbing z-20 w-[200px]"
      >
        <MacWindow caption="it-executes-too-omg.mov">
          <div className="p-3 bg-[#FAFAFA] text-xs font-sans space-y-2">
            <div className="flex items-center justify-between font-semibold text-[#333] border-b border-black/5 pb-1">
              <span>Today's Queue</span>
              <span className="text-[10px] text-[#2F6FED]">4h 30m</span>
            </div>
            <div className="p-2 rounded-lg bg-white border border-black/5 shadow-2xs space-y-1">
              <div className="flex items-center justify-between text-[11px] font-medium text-black">
                <span>1. Deep Architecture</span>
                <span className="font-mono text-[#1FAE6B]">45m</span>
              </div>
              <div className="w-full bg-[#E5E5E5] h-1.5 rounded-full overflow-hidden">
                <div className="bg-[#2F6FED] h-full w-2/3 animate-pulse" />
              </div>
            </div>
            <div className="p-2 rounded-lg bg-white border border-black/5 shadow-2xs opacity-70">
              <div className="flex items-center justify-between text-[11px] text-[#444]">
                <span>2. Design System</span>
                <span className="font-mono text-[#6B6B6B]">20m</span>
              </div>
            </div>
          </div>
        </MacWindow>
      </motion.div>

      {/* 3. TOP-RIGHT HORIZONTAL MAC WINDOW */}
      <motion.div
        drag
        dragConstraints={containerRef}
        dragElastic={0}
        whileHover={{ scale: 1.05, zIndex: 50 }}
        whileTap={{ scale: 0.98 }}
        className="absolute right-3 xl:right-8 top-8 hidden md:block rotate-[5deg] cursor-grab active:cursor-grabbing z-20 w-[210px]"
      >
        <MacWindow caption="usecase.mov">
          <div className="p-3 bg-white flex items-center gap-3">
            <div className="relative w-10 h-10 flex items-center justify-center">
              <svg className="w-10 h-10 -rotate-90">
                <circle cx="20" cy="20" r="16" stroke="#E5E5E5" strokeWidth="3" fill="none" />
                <circle
                  cx="20"
                  cy="20"
                  r="16"
                  stroke="#2F6FED"
                  strokeWidth="3"
                  strokeDasharray="100"
                  strokeDashoffset="35"
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>
              <span className="absolute text-[10px] font-mono font-bold text-[#2F6FED]">65%</span>
            </div>
            <div>
              <div className="font-mono text-sm font-bold tracking-tight text-black tabular-nums">
                18:42
              </div>
              <div className="text-[10px] text-[#6B6B6B] truncate max-w-[90px]">
                Active: Design System
              </div>
            </div>
          </div>
        </MacWindow>
      </motion.div>

      {/* 4. BOTTOM-LEFT MAC WINDOW */}
      <motion.div
        drag
        dragConstraints={containerRef}
        dragElastic={0}
        whileHover={{ scale: 1.05, zIndex: 50 }}
        whileTap={{ scale: 0.98 }}
        className="absolute left-3 xl:left-8 top-[540px] hidden lg:block rotate-[3deg] cursor-grab active:cursor-grabbing z-20 w-[210px]"
      >
        <MacWindow caption="nohandstricklol.mov">
          <div className="p-2 bg-slate-900 text-white rounded-b-lg">
            <video
              src="/stuff/h-bw.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-24 object-cover rounded-md border border-white/10"
            />
          </div>
        </MacWindow>
      </motion.div>

      {/* 5. BOTTOM-RIGHT TALL VERTICAL MAC WINDOW */}
      <motion.div
        drag
        dragConstraints={containerRef}
        dragElastic={0}
        whileHover={{ scale: 1.05, zIndex: 50 }}
        whileTap={{ scale: 0.98 }}
        className="absolute right-3 xl:right-8 top-[540px] hidden lg:block rotate-[-4deg] cursor-grab active:cursor-grabbing z-20 w-[200px]"
      >
        <MacWindow caption="daddyshome.mov">
          <div className="p-3 bg-white space-y-2">
            <div className="text-xs font-semibold text-black">Still working?</div>
            <div className="text-[10px] text-[#6B6B6B]">Planned 30m finished. Extend?</div>
            <div className="flex gap-1.5 pt-1">
              <button className="flex-1 py-1 px-2 rounded-md bg-[#2F6FED] text-white text-[10px] font-medium shadow-xs cursor-pointer">
                +10m
              </button>
              <button className="flex-1 py-1 px-2 rounded-md bg-[#FAFAFA] border border-[#E5E5E5] text-black text-[10px] font-medium cursor-pointer">
                Finish
              </button>
            </div>
          </div>
        </MacWindow>
      </motion.div>

      {/* DENSE SCATTERED DRAGGABLE STICKERS (Organized outside center text) */}
      {/* Sticker 1: 100% Free Badge (Top Left) */}
      <motion.div
        drag
        dragConstraints={containerRef}
        dragElastic={0}
        whileHover={{ scale: 1.1, zIndex: 50 }}
        whileTap={{ scale: 0.95 }}
        className="absolute left-[18%] xl:left-[21%] top-[5%] hidden lg:block rotate-[-6deg] cursor-grab active:cursor-grabbing z-20"
      >
        <div className="px-3 py-1.5 rounded-full bg-[#1FAE6B] text-white text-[11px] font-mono font-bold shadow-lg border border-white/20 flex items-center gap-1.5">
          <span>⚡</span>
          <span>100% FREE</span>
        </div>
      </motion.div>

      {/* Sticker 2: Black-Square Flower (Top Right) */}
      <motion.div
        drag
        dragConstraints={containerRef}
        dragElastic={0}
        whileHover={{ scale: 1.2, zIndex: 50 }}
        className="absolute right-[22%] xl:right-[26%] top-[4%] hidden lg:block cursor-grab active:cursor-grabbing z-20"
      >
        <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center shadow-lg border border-white/20">
          <span className="text-white text-xs">❀</span>
        </div>
      </motion.div>

      {/* Sticker 3: Pokemon Gif (Right Middle) */}
      <motion.div
        drag
        dragConstraints={containerRef}
        dragElastic={0}
        whileHover={{ scale: 1.2, zIndex: 50 }}
        whileTap={{ scale: 0.9 }}
        className="absolute right-[16%] xl:right-[19%] top-[560px] hidden lg:block cursor-grab active:cursor-grabbing z-20"
      >
        <img
          src="/stuff/gif-pokemon.webp"
          alt="Pokemon"
          className="w-14 h-14 object-contain drop-shadow-xl"
        />
      </motion.div>

      {/* Sticker 4: Vintage Phone Gif (Bottom Left) */}
      <motion.div
        drag
        dragConstraints={containerRef}
        dragElastic={0}
        whileHover={{ scale: 1.2, zIndex: 50 }}
        whileTap={{ scale: 0.9 }}
        className="absolute left-[16%] xl:left-[19%] top-[600px] hidden lg:block cursor-grab active:cursor-grabbing z-20"
      >
        <img
          src="/stuff/gif-vintagephone.webp"
          alt="Vintage Phone"
          className="w-12 h-12 object-contain drop-shadow-lg"
        />
      </motion.div>

      {/* Sticker 5: Retro PC Icon (Left Middle) */}
      <motion.div
        drag
        dragConstraints={containerRef}
        dragElastic={0}
        whileHover={{ scale: 1.2, zIndex: 50 }}
        className="absolute left-[2%] top-[460px] hidden lg:block cursor-grab active:cursor-grabbing z-20"
      >
        <div className="p-1 rounded-xl bg-white border border-black/10 shadow-md">
          <img
            src="/stuff/sysicon0.avif"
            alt="System icon"
            className="w-8 h-8 object-contain"
          />
        </div>
      </motion.div>

      {/* Sticker 6: System Icon 1 (Right Middle) */}
      <motion.div
        drag
        dragConstraints={containerRef}
        dragElastic={0}
        whileHover={{ scale: 1.2, zIndex: 50 }}
        className="absolute right-[2%] top-[460px] hidden lg:block cursor-grab active:cursor-grabbing z-20"
      >
        <div className="p-1 rounded-xl bg-white border border-black/10 shadow-md">
          <img
            src="/stuff/sysicon1.avif"
            alt="System icon"
            className="w-8 h-8 object-contain"
          />
        </div>
      </motion.div>

      {/* Sticker 7: Blue Folder 1 (Left Side) */}
      <motion.div
        drag
        dragConstraints={containerRef}
        dragElastic={0}
        whileHover={{ scale: 1.2, zIndex: 50 }}
        className="absolute left-[16%] top-[300px] hidden md:flex flex-col items-center cursor-grab active:cursor-grabbing z-20"
      >
        <div className="w-10 h-7 border border-black rounded-xs relative bg-[#8FB8F6] p-0.5 shadow-xs">
          <div className="w-4 h-1.5 bg-black absolute -top-1.5 left-1 rounded-t-xs" />
        </div>
        <span className="text-[9px] font-mono font-bold mt-1 text-[#555]">day-plans</span>
      </motion.div>

      {/* Sticker 8: Trash Icon (Middle Left) */}
      <motion.div
        drag
        dragConstraints={containerRef}
        dragElastic={0}
        whileHover={{ scale: 1.2, zIndex: 50 }}
        className="absolute left-[2%] top-[320px] hidden md:flex flex-col items-center cursor-grab active:cursor-grabbing z-20"
      >
        <div className="w-8 h-9 border border-black rounded-b-xs relative flex flex-col items-center justify-center p-0.5 bg-[#FAFAFA] shadow-xs">
          <div className="w-9 h-1.5 bg-black absolute -top-2 rounded-full" />
          <div className="w-0.5 h-4 bg-black/40 rounded-full" />
        </div>
        <span className="text-[9px] font-mono font-bold mt-1 text-[#555]">distractions</span>
      </motion.div>

      {/* Sticker 9: Hello My Name Is Freedom Badge (Right Side) */}
      <motion.div
        drag
        dragConstraints={containerRef}
        dragElastic={0}
        whileHover={{ scale: 1.2, zIndex: 50 }}
        className="absolute right-[16%] xl:right-[18%] top-[240px] hidden lg:block rotate-[7deg] cursor-grab active:cursor-grabbing z-20"
      >
        <div className="px-3 py-1.5 rounded-lg bg-[#FF3B30] text-white text-[11px] font-mono font-bold shadow-xl border border-white/20">
          hello my name is <span className="underline">freedom</span>
        </div>
      </motion.div>

      {/* ASCII DECORATIONS IN WHITESPACE */}
      <motion.div
        drag
        dragConstraints={containerRef}
        dragElastic={0}
        whileHover={{ scale: 1.2, zIndex: 50 }}
        className="absolute left-[16%] top-[160px] hidden xl:block cursor-grab active:cursor-grabbing rotate-[-8deg] font-mono text-sm font-bold text-[#475569]"
      >
        ^ ω ^
      </motion.div>

      <motion.div
        drag
        dragConstraints={containerRef}
        dragElastic={0}
        whileHover={{ scale: 1.2, zIndex: 50 }}
        className="absolute right-[28%] top-[110px] hidden xl:block cursor-grab active:cursor-grabbing rotate-[6deg] font-mono text-sm font-bold text-[#475569]"
      >
        ¯\_(ツ)_/¯
      </motion.div>

      {/* CENTER HERO COPY & ACTIONS */}
      <div className="relative z-30 text-center max-w-2xl mx-auto space-y-6 mt-16 sm:mt-20">
        {/* Master Headline */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tighter text-[#111111] leading-none">
          freedom
        </h1>

        {/* Subtitle */}
        <p className="text-xl sm:text-2xl text-[#555555] font-normal tracking-tight max-w-xl mx-auto leading-snug">
          an automatic execution engine that lives on your mac.{' '}
          <span className="text-black font-semibold">
            plan once, press start, and let your day run itself.
          </span>
        </p>

        {/* Dual Call-to-Action Buttons */}
        <div id="download" className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <div className="flex flex-col items-center">
            <a
              href="/download"
              className="relative overflow-hidden group flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-2xl bg-black text-white text-base font-semibold shadow-lg hover:bg-neutral-800 transition-all active:scale-98 border border-white/20"
            >
              <div
                className="absolute top-0 inset-x-0 h-1/2 pointer-events-none opacity-20"
                style={{
                  background: 'linear-gradient(180deg, #FFFFFF 0%, rgba(255,255,255,0) 100%)',
                }}
              />
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.61-.75 1.04-1.8 1.01-2.87-.96.04-2.13.65-2.73 1.35-.53.61-.98 1.68-.93 2.71 1.07.08 2.05-.44 2.65-1.19z" />
              </svg>
              <span>download for mac</span>
            </a>
            <span className="text-[11px] text-[#888888] mt-1.5 font-medium">
              100% free · sonoma 14+ or sequoia
            </span>
          </div>

          <div className="flex flex-col items-center">
            <a
              href="#windows-waitlist"
              className="relative overflow-hidden group flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl bg-white text-black text-base font-semibold border border-[#E5E5E5] shadow-xs hover:bg-[#F9F9F9] transition-all active:scale-98"
            >
              <div
                className="absolute top-0 inset-x-0 h-1/2 pointer-events-none opacity-20"
                style={{
                  background: 'linear-gradient(180deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 100%)',
                }}
              />
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M0 3.449L9.75 2.1v9.451H0m10.95-9.613L24 0v11.4H10.95M0 12.6h9.75v9.451L0 20.699M10.95 12.6H24V24l-13.05-1.848" />
              </svg>
              <span>windows waitlist</span>
            </a>
            <span className="text-[11px] text-[#888888] mt-1.5 font-medium">
              coming q4 2026
            </span>
          </div>
        </div>

        {/* DEMO VIDEO PLAYER CARD (Bigger, sleek & zero side black space) */}
        <div className="pt-6 max-w-xl mx-auto w-full">
          <div className="relative rounded-2xl overflow-hidden border border-black/15 shadow-2xl bg-black group cursor-pointer p-0">
            <video
              src="/stuff/gif-happy2000.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-[260px] sm:h-[310px] object-cover rounded-2xl opacity-90 group-hover:opacity-100 transition-opacity"
            />
            {/* Play Video Overlay Button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="px-5 py-2.5 rounded-full bg-white/90 backdrop-blur-md border border-white/40 text-black text-xs font-semibold shadow-xl flex items-center gap-2 group-hover:scale-105 transition-transform">
                <span className="text-[10px]">▶</span>
                <span>play video</span>
              </div>
            </div>
            <div className="absolute bottom-3 inset-x-0 text-center pointer-events-none">
              <span className="text-[11px] font-mono text-white/80 tracking-wider drop-shadow-md">
                hello.mov
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

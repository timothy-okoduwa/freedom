'use client';

import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export const ManifestoSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const NUM_FOLDERS = 22;
  const train1Refs = useRef<(HTMLDivElement | null)[]>([]);
  const train2Refs = useRef<(HTMLDivElement | null)[]>([]);
  const train3Refs = useRef<(HTMLDivElement | null)[]>([]);

  // Folder color palettes
  const train1Folders = Array.from({ length: NUM_FOLDERS }).map((_, i) => ({
    color: `hsl(${280 + (i * 80) / NUM_FOLDERS}, 85%, ${72 - (i * 15) / NUM_FOLDERS}%)`,
  }));

  const train2Folders = Array.from({ length: NUM_FOLDERS }).map((_, i) => ({
    color: `hsl(${135 - (i * 50) / NUM_FOLDERS}, 80%, ${65 - (i * 10) / NUM_FOLDERS}%)`,
  }));

  const train3Folders = Array.from({ length: NUM_FOLDERS }).map((_, i) => ({
    color: `hsl(${50 - (i * 30) / NUM_FOLDERS}, 90%, ${60 - (i * 10) / NUM_FOLDERS}%)`,
  }));

  useEffect(() => {
    let animId: number;
    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = (now - startTime) / 1000;
      const width = containerRef.current?.offsetWidth || 1400;

      // Track 1: Magenta / Pink Rollercoaster (Left -> Right across camel humps)
      const speed1 = 0.06;
      train1Folders.forEach((_, i) => {
        const el = train1Refs.current[i];
        if (!el) return;

        const spacing = 0.022;
        let u = (elapsed * speed1 + i * spacing) % 1;
        if (u < 0) u += 1;

        const x = u * (width + 240) - 120;
        const camelHump = Math.sin(u * Math.PI * 4) * 120 + Math.sin(u * Math.PI * 2) * 40;
        const y = 220 - camelHump;

        const delta = 0.003;
        let uNext = u + delta;
        const xNext = uNext * (width + 240) - 120;
        const camelNext = Math.sin(uNext * Math.PI * 4) * 120 + Math.sin(uNext * Math.PI * 2) * 40;
        const yNext = 220 - camelNext;

        const angle = Math.atan2(yNext - y, xNext - x) * (180 / Math.PI);
        el.style.transform = `translate3d(${x}px, ${y}px, 0px) rotate(${angle}deg)`;
      });

      // Track 2: Green Rollercoaster (Right -> Left across camel humps)
      const speed2 = 0.05;
      train2Folders.forEach((_, i) => {
        const el = train2Refs.current[i];
        if (!el) return;

        const spacing = 0.024;
        let u = 1 - ((elapsed * speed2 + i * spacing) % 1);
        if (u < 0) u += 1;

        const x = u * (width + 240) - 120;
        const camelHump = Math.cos(u * Math.PI * 4) * 110 + Math.sin(u * Math.PI * 3) * 35;
        const y = 190 - camelHump;

        const delta = 0.003;
        let uNext = u - delta;
        const xNext = uNext * (width + 240) - 120;
        const camelNext = Math.cos(uNext * Math.PI * 4) * 110 + Math.sin(uNext * Math.PI * 3) * 35;
        const yNext = 190 - camelNext;

        const angle = Math.atan2(yNext - y, xNext - x) * (180 / Math.PI);
        el.style.transform = `translate3d(${x}px, ${y}px, 0px) rotate(${angle}deg)`;
      });

      // Track 3: Yellow Rollercoaster (Left -> Right wide camel humps)
      const speed3 = 0.045;
      train3Folders.forEach((_, i) => {
        const el = train3Refs.current[i];
        if (!el) return;

        const spacing = 0.023;
        let u = (elapsed * speed3 + i * spacing) % 1;
        if (u < 0) u += 1;

        const x = u * (width + 240) - 120;
        const camelHump = Math.sin(u * Math.PI * 6) * 85 + Math.cos(u * Math.PI * 2) * 55;
        const y = 260 - camelHump;

        const delta = 0.003;
        let uNext = u + delta;
        const xNext = uNext * (width + 240) - 120;
        const camelNext = Math.sin(uNext * Math.PI * 6) * 85 + Math.cos(uNext * Math.PI * 2) * 55;
        const yNext = 260 - camelNext;

        const angle = Math.atan2(yNext - y, xNext - x) * (180 / Math.PI);
        el.style.transform = `translate3d(${x}px, ${y}px, 0px) rotate(${angle}deg)`;
      });

      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <section id="the-dream" ref={containerRef} className="relative py-24 sm:py-36 px-4 overflow-hidden select-none bg-[#FAFAFA]">
      {/* Top Tag */}
      <div className="text-center mb-6">
        <span className="inline-block px-4 py-1 rounded-full bg-white border border-black/10 text-[11px] uppercase font-mono font-bold tracking-widest text-[#555] shadow-xs">
          THE DREAM
        </span>
      </div>

      {/* DYNAMIC 3D ROLLERCOASTER CAMEL-HUMP FOLDER TRAILS */}
      <div className="absolute inset-0 pointer-events-none hidden xl:block overflow-hidden">
        {/* Track 1: Magenta Folders */}
        {train1Folders.map((f, i) => (
          <div
            key={`t1-${i}`}
            ref={(el) => {
              train1Refs.current[i] = el;
            }}
            className="absolute top-0 left-0 w-16 h-12 border border-black/35 rounded-lg shadow-lg flex flex-col items-center justify-between p-1.5 will-change-transform"
            style={{
              backgroundColor: f.color,
              zIndex: 1,
            }}
          >
            <div className="w-7 h-2 bg-black/25 absolute -top-1.5 left-2 rounded-t-sm" />
          </div>
        ))}

        {/* Track 2: Green Folders */}
        {train2Folders.map((f, i) => (
          <div
            key={`t2-${i}`}
            ref={(el) => {
              train2Refs.current[i] = el;
            }}
            className="absolute top-0 left-0 w-16 h-12 border border-black/35 rounded-lg shadow-lg flex flex-col items-center justify-between p-1.5 will-change-transform"
            style={{
              backgroundColor: f.color,
              zIndex: 2,
            }}
          >
            <div className="w-7 h-2 bg-black/25 absolute -top-1.5 left-2 rounded-t-sm" />
          </div>
        ))}

        {/* Track 3: Yellow Folders */}
        {train3Folders.map((f, i) => (
          <div
            key={`t3-${i}`}
            ref={(el) => {
              train3Refs.current[i] = el;
            }}
            className="absolute top-0 left-0 w-16 h-12 border border-black/35 rounded-lg shadow-lg flex flex-col items-center justify-between p-1.5 will-change-transform"
            style={{
              backgroundColor: f.color,
              zIndex: 3,
            }}
          >
            <div className="w-7 h-2 bg-black/25 absolute -top-1.5 left-2 rounded-t-sm" />
          </div>
        ))}
      </div>

      {/* DRAGGABLE FUN STICKERS (Larger & Bounded) */}
      {/* 1. Pokemon Gif */}
      <motion.div
        drag
        dragConstraints={containerRef}
        dragElastic={0}
        whileHover={{ scale: 1.25, zIndex: 50 }}
        whileTap={{ scale: 0.95 }}
        className="absolute left-[12%] top-[22%] hidden lg:block cursor-grab active:cursor-grabbing z-20"
      >
        <img
          src="/stuff/gif-pokemon.webp"
          alt="Bouncing Pokemon Sticker"
          className="w-18 h-18 object-contain drop-shadow-xl"
        />
      </motion.div>

      {/* 2. Among Us Imposter */}
      <motion.div
        drag
        dragConstraints={containerRef}
        dragElastic={0}
        whileHover={{ scale: 1.25, zIndex: 50 }}
        whileTap={{ scale: 0.95 }}
        className="absolute left-[14%] bottom-[18%] hidden lg:block cursor-grab active:cursor-grabbing z-20"
      >
        <div className="w-11 h-14 bg-slate-800 rounded-t-2xl rounded-b-lg relative flex items-center justify-center p-1 border-2 border-black shadow-xl">
          <div className="w-6 h-4 bg-cyan-400 rounded-full border border-black absolute top-3 left-2" />
        </div>
      </motion.div>

      {/* 3. You've Got Mail Retro Icon */}
      <motion.div
        drag
        dragConstraints={containerRef}
        dragElastic={0}
        whileHover={{ scale: 1.2, zIndex: 50 }}
        whileTap={{ scale: 0.95 }}
        className="absolute right-[12%] top-[24%] hidden lg:block cursor-grab active:cursor-grabbing z-20"
      >
        <div className="px-4 py-2 rounded-2xl bg-[#2563EB] text-white text-xs font-mono font-bold shadow-2xl flex items-center gap-2.5 border border-white/30">
          <span className="text-sm">📬</span>
          <span>You've Got Mail</span>
        </div>
      </motion.div>

      {/* 4. Retro PC Desktop Icon */}
      <motion.div
        drag
        dragConstraints={containerRef}
        dragElastic={0}
        whileHover={{ scale: 1.25, zIndex: 50 }}
        whileTap={{ scale: 0.95 }}
        className="absolute right-[14%] bottom-[18%] hidden lg:block cursor-grab active:cursor-grabbing z-20"
      >
        <img
          src="/stuff/sysicon0.avif"
          alt="Retro PC"
          className="w-16 h-16 object-contain drop-shadow-xl"
        />
      </motion.div>

      {/* NOTES CARD (Matching Screenshot 3) */}
      <div className="relative max-w-lg mx-auto z-30">
        <div className="rounded-[22px] overflow-hidden border border-black/10 bg-[#FFFDF8] shadow-2xl">
          {/* Notes Window Header */}
          <div className="h-10 px-4 bg-[#FAF6ED] border-b border-black/8 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E]" />
              <span className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123]" />
              <span className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29]" />
            </div>
            <span className="text-xs font-mono font-semibold text-[#7A7466]">📁 notes</span>
            <div className="w-12" />
          </div>

          {/* Notes Content */}
          <div className="p-6 sm:p-8 space-y-4 text-sm sm:text-base font-sans text-[#2B2B28] leading-relaxed">
            <p>
              most productivity tools force you to micro-manage them.
            </p>
            <p>
              you end up spending more time organizing tasks than actually executing deep work!
            </p>
            <p>
              we believe your day should run itself.
            </p>
            <p>
              we wanna take your planned schedule, task queue, and break intervals, and turn them into an automatic execution engine—a calm floating presence on your mac that{' '}
              <mark className="bg-[#FFEAA7] text-black px-1.5 py-0.5 rounded font-semibold">
                removes decision fatigue and protects your focus rhythm.
              </mark>
            </p>
            <p>
              we're building the master execution layer for the next generation of high-agency builders.
            </p>
            <p className="text-xs text-[#7A7466] italic pt-2">
              it's early! try out what we have today and lmk what you think.
              <span className="animate-pulse font-bold">|</span>
            </p>

            {/* Founder Signature Section (Screenshot 3 style) */}
            <div className="pt-6 border-t border-black/8 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src="/freedom.png"
                  alt="Timothy Founder"
                  className="w-10 h-10 rounded-full object-cover border border-black/10 shadow-xs"
                />
                <div>
                  <div className="font-bold text-sm text-[#111]">timothy,</div>
                  <div className="text-xs text-[#7A7466]">founder</div>
                </div>
              </div>

              {/* Hand-written Cursive Signature "freedom" */}
              <div className="font-serif italic text-3xl font-extrabold tracking-tighter text-[#111111] select-none opacity-90 pr-2">
                freedom
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

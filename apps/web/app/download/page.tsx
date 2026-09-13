'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { Footer } from '../../components/Footer';

const DOWNLOAD_URL = 'https://github.com/timothy-okoduwa/freedom/releases/download/v1.0.0/Freedom-1.0.0-arm64.dmg';

export default function DownloadPage() {
  useEffect(() => {
    // Automatically trigger DMG download on mount
    const timer = setTimeout(() => {
      const link = document.createElement('a');
      link.href = DOWNLOAD_URL;
      link.download = 'Freedom.dmg';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="min-h-screen bg-[#FAFAFA] text-[#111111] pt-24 pb-16 flex flex-col justify-between selection:bg-[#2F6FED] selection:text-white font-sans">
      <div className="max-w-5xl mx-auto px-4 text-center space-y-8 my-auto pt-6">
        {/* Top Status Pill (Freedom Blue Theme) */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EAF1FE] border border-[#2F6FED]/30 text-xs font-mono font-bold text-[#2F6FED] shadow-xs">
          <span className="w-4 h-4 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-[10px] animate-pulse">
            ✓
          </span>
          <span>DOWNLOAD STARTED</span>
        </div>

        {/* Headline & Subtitle */}
        <div className="space-y-3">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight font-serif text-[#0F172A] leading-tight">
            Thanks for downloading! <br />
            <span className="italic font-normal text-[#334155]">Just a few steps left</span>
          </h1>
          <p className="text-sm sm:text-base text-[#64748B] max-w-lg mx-auto font-sans leading-relaxed">
            Your download will begin automatically. If it didn&apos;t start,{' '}
            <a
              href={DOWNLOAD_URL}
              download="Freedom.dmg"
              className="text-[#2F6FED] font-bold underline underline-offset-4 hover:text-[#1E56C9] transition-colors"
            >
              download Freedom manually
            </a>
            .
          </p>
        </div>

        {/* 3 Step Mac Installation Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 pt-8 max-w-4xl mx-auto text-left">
          {/* STEP 1: Open Freedom.dmg */}
          <div className="flex flex-col items-center space-y-4">
            {/* Step Number Circle (Freedom Blue) */}
            <div className="w-8 h-8 rounded-full bg-[#2F6FED] text-white font-mono font-extrabold text-sm flex items-center justify-center shadow-md z-10">
              1
            </div>

            {/* Step Card Graphic */}
            <div className="w-full h-56 rounded-2xl bg-gradient-to-b from-[#3B82F6] via-[#2F6FED] to-[#1D4ED8] p-4 border border-[#2F6FED]/50 shadow-xl flex flex-col justify-between overflow-hidden relative group">
              {/* Floating Downloads Pill Label */}
              <div className="w-fit mx-auto px-4 py-1.5 bg-white/95 backdrop-blur-md rounded-xl text-center font-bold text-[#0F172A] text-xs shadow-md border border-white/20">
                Downloads
              </div>

              {/* Mac Dock / Shelf Graphic */}
              <div className="w-full bg-white/15 backdrop-blur-md rounded-2xl p-3 flex items-end justify-around border border-white/20 shadow-inner my-auto">
                <div className="w-10 h-10 rounded-xl bg-white/20 border border-white/20 shadow-2xs" />
                {/* DMG File Document Icon */}
                <div className="relative group cursor-pointer">
                  <div className="w-16 h-20 rounded-xl bg-white shadow-2xl flex flex-col items-center justify-center p-2 border border-black/10 transition-transform group-hover:scale-105">
                    <div className="w-9 h-9 rounded-lg bg-[#F8FAFC] flex items-center justify-center p-1 border border-black/5">
                      <img src="/freedom.png" alt="DMG" className="w-7 h-7 object-contain" />
                    </div>
                    <span className="text-[8.5px] font-mono font-bold mt-1 text-[#0F172A]">Freedom.dmg</span>
                  </div>
                  {/* Cursor Pointer */}
                  <div className="absolute -bottom-2 -right-2 text-black drop-shadow-md">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M4.5 3.5L11.5 20.5L14.5 13.5L21.5 10.5L4.5 3.5Z" stroke="white" strokeWidth="1.5" />
                    </svg>
                  </div>
                </div>
                {/* Trash Can Placeholder */}
                <div className="w-10 h-10 rounded-xl bg-white/20 border border-white/20 flex flex-col items-center justify-center p-2 shadow-2xs">
                  <div className="w-5 h-6 border-2 border-white/70 rounded-b-xs relative flex flex-col items-center justify-center">
                    <div className="w-6 h-1 bg-white/70 absolute -top-1 rounded-full" />
                  </div>
                </div>
              </div>
            </div>

            {/* Caption */}
            <p className="text-xs text-center text-[#475569] font-medium leading-snug max-w-[220px]">
              Open <span className="font-bold text-[#0F172A] font-mono">Freedom.dmg</span> from your{' '}
              <span className="font-bold text-[#0F172A]">Downloads</span> folder
            </p>
          </div>

          {/* STEP 2: Drag Freedom to Applications */}
          <div className="flex flex-col items-center space-y-4">
            {/* Step Number Circle */}
            <div className="w-8 h-8 rounded-full bg-[#2F6FED] text-white font-mono font-extrabold text-sm flex items-center justify-center shadow-md z-10">
              2
            </div>

            {/* Step Card Graphic */}
            <div className="w-full h-56 rounded-2xl bg-white p-4 border border-[#E2E8F0] shadow-xl flex items-center justify-center gap-4 overflow-hidden relative">
              {/* Freedom App Icon */}
              <div className="relative flex flex-col items-center">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-b from-[#3B82F6] to-[#2563EB] p-3 shadow-lg flex items-center justify-center border border-white/20">
                  <img src="/freedom.png" alt="Freedom Icon" className="w-14 h-14 object-contain rounded-xl" />
                </div>
                {/* Dragging Hand Cursor */}
                <div className="absolute -bottom-3 -right-1 text-black drop-shadow-md">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 11.25V5.5a1.5 1.5 0 0 1 3 0v5.75M12 10V4.5a1.5 1.5 0 0 1 3 0V10m0-1V6.5a1.5 1.5 0 0 1 3 0v5.25" stroke="white" strokeWidth="1" />
                  </svg>
                </div>
              </div>

              {/* Arrow */}
              <span className="text-[#94A3B8] font-bold text-xl">→</span>

              {/* Target Box for Applications */}
              <div className="w-22 h-22 rounded-2xl border-2 border-dashed border-[#2F6FED]/40 bg-[#EAF1FE]/40 flex items-center justify-center p-2">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-b from-[#2563EB] to-[#1D4ED8] p-2 shadow-md flex items-center justify-center">
                  <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <polygon points="12 2 2 7 12 12 22 7 12 2" />
                    <polyline points="2 17 12 22 22 17" />
                    <polyline points="2 12 17 22 22 12" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Caption */}
            <p className="text-xs text-center text-[#475569] font-medium leading-snug max-w-[220px]">
              Drag the <span className="font-bold text-[#0F172A]">Freedom icon</span> into your{' '}
              <span className="font-bold text-[#0F172A]">Applications</span> folder
            </p>
          </div>

          {/* STEP 3: Open Freedom App */}
          <div className="flex flex-col items-center space-y-4">
            {/* Step Number Circle */}
            <div className="w-8 h-8 rounded-full bg-[#2F6FED] text-white font-mono font-extrabold text-sm flex items-center justify-center shadow-md z-10">
              3
            </div>

            {/* Step Card Graphic */}
            <div className="w-full h-56 rounded-2xl bg-white p-3.5 border border-[#E2E8F0] shadow-xl flex flex-col justify-start overflow-hidden">
              <div className="text-[11px] font-bold text-[#64748B] mb-2 px-2 font-mono">Applications</div>
              <div className="space-y-1 font-sans text-xs">
                {/* Item 1 */}
                <div className="px-3 py-1.5 rounded-lg flex items-center gap-2 text-[#64748B]">
                  <div className="w-4 h-4 rounded bg-[#4285F4] flex items-center justify-center text-[9px] text-white font-bold">G</div>
                  <span>Google Drive.app</span>
                </div>
                {/* Item 2 (Highlighted Freedom.app in Freedom Blue) */}
                <div className="relative px-3 py-2 rounded-xl bg-[#2F6FED] text-white font-semibold flex items-center justify-between shadow-md">
                  <div className="flex items-center gap-2">
                    <img src="/freedom.png" alt="Freedom" className="w-4 h-4 object-contain rounded-full" />
                    <span>Freedom.app</span>
                  </div>
                  {/* Cursor Click Pointer */}
                  <div className="absolute right-2 -bottom-2 text-white drop-shadow-md">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M4.5 3.5L11.5 20.5L14.5 13.5L21.5 10.5L4.5 3.5Z" stroke="black" strokeWidth="1.5" />
                    </svg>
                  </div>
                </div>
                {/* Item 3 */}
                <div className="px-3 py-1.5 rounded-lg flex items-center gap-2 text-[#64748B]">
                  <div className="w-4 h-4 rounded bg-[#FF9500] flex items-center justify-center text-[9px] text-white font-bold">H</div>
                  <span>Home.app</span>
                </div>
                {/* Item 4 */}
                <div className="px-3 py-1.5 rounded-lg flex items-center gap-2 text-[#64748B]">
                  <div className="w-4 h-4 rounded bg-slate-800 flex items-center justify-center text-[9px] text-white font-bold">iA</div>
                  <span>iA Presenter.app</span>
                </div>
              </div>
            </div>

            {/* Caption */}
            <p className="text-xs text-center text-[#475569] font-medium leading-snug max-w-[220px]">
              Open the <span className="font-bold text-[#0F172A]">Freedom app</span> from your{' '}
              <span className="font-bold text-[#0F172A]">Applications</span> folder
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}

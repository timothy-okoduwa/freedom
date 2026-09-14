'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Footer } from '../../components/Footer';
import { ShieldCheck, Zap, Copy, Check } from 'lucide-react';

const DOWNLOAD_URL = 'https://github.com/timothy-okoduwa/freedom/releases/download/v1.0.0/Freedom-1.0.0-arm64.dmg';
const TERMINAL_CMD = 'xattr -cr /Applications/Freedom.app';
const TERMINAL_CMD_SUDO = 'sudo xattr -rd com.apple.quarantine /Applications/Freedom.app';

export default function DownloadPage() {
  const [copiedCmd, setCopiedCmd] = useState(false);
  const [copiedSudo, setCopiedSudo] = useState(false);

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

  const copyText = (text: string, isSudo: boolean) => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(text);
      if (isSudo) {
        setCopiedSudo(true);
        setTimeout(() => setCopiedSudo(false), 2500);
      } else {
        setCopiedCmd(true);
        setTimeout(() => setCopiedCmd(false), 2500);
      }
    }
  };

  return (
    <main className="min-h-screen bg-[#FAFAFA] text-[#111111] pt-16 sm:pt-24 pb-16 flex flex-col justify-between selection:bg-[#2F6FED] selection:text-white font-sans">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-8 sm:space-y-12 w-full pt-4">
        {/* Top Status Pill (Freedom Blue Theme) */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EAF1FE] border border-[#2F6FED]/30 text-xs font-mono font-bold text-[#2F6FED] shadow-xs">
          <span className="w-4 h-4 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-[10px] animate-pulse">
            ✓
          </span>
          <span>DOWNLOAD STARTED</span>
        </div>

        {/* Headline & Subtitle */}
        <div className="space-y-3 px-2">
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight font-serif text-[#0F172A] leading-tight">
            Thanks for downloading! <br />
            <span className="italic font-normal text-[#334155]">Just a few steps left</span>
          </h1>
          <p className="text-xs sm:text-base text-[#64748B] max-w-lg mx-auto font-sans leading-relaxed">
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 pt-2 max-w-4xl mx-auto text-left w-full">
          {/* STEP 1: Open Freedom.dmg */}
          <div className="flex flex-col items-center space-y-3.5 max-w-xs sm:max-w-none w-full mx-auto">
            <div className="w-8 h-8 rounded-full bg-[#2F6FED] text-white font-mono font-extrabold text-sm flex items-center justify-center shadow-md z-10">
              1
            </div>
            <div className="w-full h-52 sm:h-56 rounded-2xl bg-gradient-to-b from-[#3B82F6] via-[#2F6FED] to-[#1D4ED8] p-4 border border-[#2F6FED]/50 shadow-xl flex flex-col justify-between overflow-hidden relative group">
              <div className="w-fit mx-auto px-4 py-1.5 bg-white/95 backdrop-blur-md rounded-xl text-center font-bold text-[#0F172A] text-xs shadow-md border border-white/20">
                Downloads
              </div>
              <div className="w-full bg-white/15 backdrop-blur-md rounded-2xl p-3 flex items-end justify-around border border-white/20 shadow-inner my-auto">
                <div className="w-9 h-9 rounded-xl bg-white/20 border border-white/20 shadow-2xs" />
                <div className="relative group cursor-pointer">
                  <div className="w-16 h-20 rounded-xl bg-white shadow-2xl flex flex-col items-center justify-center p-2 border border-black/10 transition-transform group-hover:scale-105">
                    <div className="w-9 h-9 rounded-lg bg-[#F8FAFC] flex items-center justify-center p-1 border border-black/5">
                      <img src="/freedom.png" alt="DMG" className="w-7 h-7 object-contain" />
                    </div>
                    <span className="text-[8.5px] font-mono font-bold mt-1 text-[#0F172A]">Freedom.dmg</span>
                  </div>
                  <div className="absolute -bottom-2 -right-2 text-black drop-shadow-md">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M4.5 3.5L11.5 20.5L14.5 13.5L21.5 10.5L4.5 3.5Z" stroke="white" strokeWidth="1.5" />
                    </svg>
                  </div>
                </div>
                <div className="w-9 h-9 rounded-xl bg-white/20 border border-white/20 flex flex-col items-center justify-center p-2 shadow-2xs">
                  <div className="w-5 h-6 border-2 border-white/70 rounded-b-xs relative flex flex-col items-center justify-center">
                    <div className="w-6 h-1 bg-white/70 absolute -top-1 rounded-full" />
                  </div>
                </div>
              </div>
            </div>
            <p className="text-xs text-center text-[#475569] font-medium leading-snug max-w-[220px]">
              Open <span className="font-bold text-[#0F172A] font-mono">Freedom.dmg</span> from your{' '}
              <span className="font-bold text-[#0F172A]">Downloads</span> folder
            </p>
          </div>

          {/* STEP 2: Drag Freedom to Applications */}
          <div className="flex flex-col items-center space-y-3.5 max-w-xs sm:max-w-none w-full mx-auto">
            <div className="w-8 h-8 rounded-full bg-[#2F6FED] text-white font-mono font-extrabold text-sm flex items-center justify-center shadow-md z-10">
              2
            </div>
            <div className="w-full h-52 sm:h-56 rounded-2xl bg-white p-4 border border-[#E2E8F0] shadow-xl flex items-center justify-center gap-4 overflow-hidden relative">
              <div className="relative flex flex-col items-center">
                <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-b from-[#3B82F6] to-[#2563EB] p-3 shadow-lg flex items-center justify-center border border-white/20">
                  <img src="/freedom.png" alt="Freedom Icon" className="w-12 h-12 sm:w-14 sm:h-14 object-contain rounded-xl" />
                </div>
                <div className="absolute -bottom-3 -right-1 text-black drop-shadow-md">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 11.25V5.5a1.5 1.5 0 0 1 3 0v5.75M12 10V4.5a1.5 1.5 0 0 1 3 0V10m0-1V6.5a1.5 1.5 0 0 1 3 0v5.25" stroke="white" strokeWidth="1" />
                  </svg>
                </div>
              </div>
              <span className="text-[#94A3B8] font-bold text-xl">→</span>
              <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-2xl border-2 border-dashed border-[#2F6FED]/40 bg-[#EAF1FE]/40 flex items-center justify-center p-2">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-gradient-to-b from-[#2563EB] to-[#1D4ED8] p-2 shadow-md flex items-center justify-center">
                  <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <polygon points="12 2 2 7 12 12 22 7 12 2" />
                    <polyline points="2 17 12 22 22 17" />
                    <polyline points="2 12 17 22 22 12" />
                  </svg>
                </div>
              </div>
            </div>
            <p className="text-xs text-center text-[#475569] font-medium leading-snug max-w-[220px]">
              Drag the <span className="font-bold text-[#0F172A]">Freedom icon</span> into your{' '}
              <span className="font-bold text-[#0F172A]">Applications</span> folder
            </p>
          </div>

          {/* STEP 3: Open Freedom App */}
          <div className="flex flex-col items-center space-y-3.5 max-w-xs sm:max-w-none w-full mx-auto">
            <div className="w-8 h-8 rounded-full bg-[#2F6FED] text-white font-mono font-extrabold text-sm flex items-center justify-center shadow-md z-10">
              3
            </div>
            <div className="w-full h-52 sm:h-56 rounded-2xl bg-white p-3.5 border border-[#E2E8F0] shadow-xl flex flex-col justify-start overflow-hidden">
              <div className="text-[11px] font-bold text-[#64748B] mb-2 px-2 font-mono">Applications</div>
              <div className="space-y-1 font-sans text-xs">
                <div className="px-3 py-1.5 rounded-lg flex items-center gap-2 text-[#64748B]">
                  <div className="w-4 h-4 rounded bg-[#4285F4] flex items-center justify-center text-[9px] text-white font-bold">G</div>
                  <span>Google Drive.app</span>
                </div>
                <div className="relative px-3 py-2 rounded-xl bg-[#2F6FED] text-white font-semibold flex items-center justify-between shadow-md">
                  <div className="flex items-center gap-2">
                    <img src="/freedom.png" alt="Freedom" className="w-4 h-4 object-contain rounded-full" />
                    <span>Freedom.app</span>
                  </div>
                  <div className="absolute right-2 -bottom-2 text-white drop-shadow-md">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M4.5 3.5L11.5 20.5L14.5 13.5L21.5 10.5L4.5 3.5Z" stroke="black" strokeWidth="1.5" />
                    </svg>
                  </div>
                </div>
                <div className="px-3 py-1.5 rounded-lg flex items-center gap-2 text-[#64748B]">
                  <div className="w-4 h-4 rounded bg-[#FF9500] flex items-center justify-center text-[9px] text-white font-bold">H</div>
                  <span>Home.app</span>
                </div>
                <div className="px-3 py-1.5 rounded-lg flex items-center gap-2 text-[#64748B]">
                  <div className="w-4 h-4 rounded bg-slate-800 flex items-center justify-center text-[9px] text-white font-bold">iA</div>
                  <span>iA Presenter.app</span>
                </div>
              </div>
            </div>
            <p className="text-xs text-center text-[#475569] font-medium leading-snug max-w-[220px]">
              Open the <span className="font-bold text-[#0F172A]">Freedom app</span> from your{' '}
              <span className="font-bold text-[#0F172A]">Applications</span> folder
            </p>
          </div>
        </div>

        {/* macOS Sequoia & Sonoma Unidentified Developer / "App is Damaged" Troubleshooting Card */}
        <div className="max-w-4xl mx-auto pt-6 sm:pt-10 text-left w-full">
          <div className="rounded-2xl sm:rounded-3xl bg-white border border-[#E2E8F0] shadow-xl p-4 sm:p-8 space-y-5 sm:space-y-6 w-full">
            <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-[#EFF6FF] border border-[#BFDBFE] text-[#2F6FED] flex items-center justify-center font-bold shrink-0">
                <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg sm:text-xl font-extrabold text-[#0F172A] tracking-tight">
                  Fix &quot;Freedom is damaged&quot; or &quot;Can&apos;t be opened&quot; on macOS
                </h3>
                <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
                  On macOS Sequoia and Sonoma, Apple strictly blocks independent open-source apps downloaded from the web by attaching a quarantine attribute (<code className="bg-slate-100 px-1 py-0.5 rounded text-[11px] font-mono text-[#0F172A]">com.apple.quarantine</code>). Because Freedom is an open-source build without a paid Apple Developer certificate, right-click and System Settings options will not show up until you run the quick 5-second fix below.
                </p>
              </div>
            </div>

            {/* #1 GUARANTEED SOLUTION BOX */}
            <div className="p-4 sm:p-6 rounded-2xl bg-[#0F172A] text-white space-y-4 shadow-md w-full">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
                <div className="flex items-center gap-2 font-bold text-sm sm:text-base text-[#38BDF8]">
                  <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#38BDF8] text-[#0F172A] flex items-center justify-center font-extrabold shrink-0">
                    <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" />
                  </span>
                  <span>1-Step Guaranteed Fix (Takes 5 seconds)</span>
                </div>
                <span className="text-[11px] sm:text-xs font-mono text-[#94A3B8]">Open Terminal on your Mac</span>
              </div>

              <ol className="list-decimal list-inside text-xs text-[#E2E8F0] space-y-2 leading-relaxed">
                <li>Make sure <strong className="text-white">Freedom.app</strong> is moved into your <strong className="text-white">Applications</strong> folder.</li>
                <li>Open <strong className="text-white">Terminal</strong> (Press <kbd className="px-1.5 py-0.5 rounded bg-white/20 font-mono text-white">Cmd + Space</kbd>, type <strong className="text-white">Terminal</strong>, and press Enter).</li>
                <li>Copy and paste the command below, then press Enter:</li>
              </ol>

              {/* Responsive Terminal Command Box */}
              <div className="p-3.5 rounded-xl bg-black/80 border border-white/15 font-mono text-xs text-[#38BDF8] flex flex-col sm:flex-row sm:items-center justify-between gap-3 w-full">
                <code className="block font-mono text-[11px] sm:text-xs text-[#38BDF8] break-all leading-relaxed bg-black/40 p-2.5 rounded-lg border border-white/10 select-all">
                  {TERMINAL_CMD}
                </code>
                <button
                  type="button"
                  onClick={() => copyText(TERMINAL_CMD, false)}
                  className="w-full sm:w-auto shrink-0 px-4 py-2.5 rounded-lg bg-[#38BDF8] hover:bg-[#0284C7] text-[#0F172A] text-xs font-sans font-bold transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                >
                  {copiedCmd ? <Check className="w-4 h-4 text-[#0F172A]" /> : <Copy className="w-4 h-4 text-[#0F172A]" />}
                  <span>{copiedCmd ? 'Copied!' : 'Copy Command'}</span>
                </button>
              </div>

              <p className="text-[11px] font-mono text-[#94A3B8] pt-1">
                Once executed, double-click <strong className="text-white font-sans">Freedom.app</strong> in your Applications folder and it will launch instantly!
              </p>
            </div>

            {/* Alternative Sudo Option */}
            <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2 text-xs text-[#475569] w-full">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 font-bold text-[#0F172A]">
                <span>Alternative Command (If permission denied)</span>
                <button
                  type="button"
                  onClick={() => copyText(TERMINAL_CMD_SUDO, true)}
                  className="text-[#2F6FED] font-mono text-[11px] hover:underline text-left sm:text-right"
                >
                  {copiedSudo ? '✓ Copied' : 'Copy Sudo Command'}
                </button>
              </div>
              <code className="block p-2.5 rounded-lg bg-white border border-[#E2E8F0] font-mono text-[10px] sm:text-[11px] text-[#0F172A] break-all">
                {TERMINAL_CMD_SUDO}
              </code>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}

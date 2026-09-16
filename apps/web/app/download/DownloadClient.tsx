'use client';

import React, { useEffect, useState } from 'react';
import { Footer } from '../../components/Footer';
import { ShieldCheck, Zap, Copy, Check, Monitor, Download } from 'lucide-react';
import { useUserOS } from '../../hooks/useUserOS';

const MAC_DOWNLOAD_URL = 'https://github.com/timothy-okoduwa/freedom/releases/download/v1.0.0/Freedom-1.0.0-arm64.dmg';
const WIN_DOWNLOAD_URL = 'https://github.com/timothy-okoduwa/freedom/releases/download/v1.0.0/Freedom.Setup.1.0.0.exe';
const TERMINAL_CMD = 'xattr -cr /Applications/Freedom.app';
const TERMINAL_CMD_SUDO = 'sudo xattr -rd com.apple.quarantine /Applications/Freedom.app';

export function DownloadClient() {
  const os = useUserOS();
  const [copiedCmd, setCopiedCmd] = useState(false);
  const [copiedSudo, setCopiedSudo] = useState(false);

  const downloadUrl = os === 'windows' ? WIN_DOWNLOAD_URL : MAC_DOWNLOAD_URL;
  const downloadFilename = os === 'windows' ? 'Freedom.Setup.1.0.0.exe' : 'Freedom-1.0.0-arm64.dmg';

  const triggerDownload = () => {
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = downloadFilename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    // Automatically trigger OS-specific download on mount
    const timer = setTimeout(() => {
      triggerDownload();
    }, 500);
    return () => clearTimeout(timer);
  }, [os, downloadUrl, downloadFilename]);

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
      <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-8 sm:space-y-10 w-full pt-4">
        {/* Top Status Pill (Freedom Blue Badge) */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#EAF1FE] border border-[#2F6FED]/30 text-xs font-mono font-bold text-[#2F6FED] shadow-2xs">
          <span className="w-4 h-4 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-[10px]">
            ✓
          </span>
          <span className="tracking-wide text-[11px] uppercase">
            {os === 'windows' ? 'WINDOWS DOWNLOAD STARTED' : 'MACOS DOWNLOAD STARTED'}
          </span>
        </div>

        {/* Headline & Subtitle */}
        <div className="space-y-3 px-2">
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-[#0F172A] leading-tight">
            Thanks for downloading! <br />
            <span className="italic font-normal font-serif text-[#334155]">Just a few steps left</span>
          </h1>
          <p className="text-xs sm:text-base text-[#64748B] max-w-lg mx-auto font-sans leading-relaxed">
            Your download will begin automatically. If it didn&apos;t start,{' '}
            <button
              type="button"
              onClick={triggerDownload}
              className="text-[#2F6FED] font-bold underline underline-offset-4 hover:text-[#1E56C9] transition-colors inline cursor-pointer border-none bg-transparent p-0"
            >
              download Freedom manually
            </button>
            .
          </p>
        </div>

        {/* Dynamic Installation Steps based on OS */}
        {os === 'windows' ? (
          /* WINDOWS INSTALLATION STEPS GRID */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 pt-2 max-w-4xl mx-auto text-left w-full">
            {/* STEP 1: Open Freedom.Setup.1.0.0.exe */}
            <div className="flex flex-col items-center space-y-3.5 max-w-xs sm:max-w-none w-full mx-auto">
              <div className="w-8 h-8 rounded-full bg-[#2F6FED] text-white font-mono font-extrabold text-sm flex items-center justify-center shadow-md z-10">
                1
              </div>
              <div className="w-full h-52 sm:h-56 rounded-2xl bg-white border border-black/10 shadow-md flex flex-col items-center justify-center p-6 text-center space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-[#EAF1FE] text-[#2F6FED] flex items-center justify-center">
                  <Download className="w-7 h-7" />
                </div>
                <div className="text-xs font-mono font-bold text-[#0F172A] break-all">
                  Freedom.Setup.1.0.0.exe
                </div>
              </div>
              <p className="text-xs text-center text-[#475569] font-medium leading-snug max-w-[220px]">
                Open <span className="font-bold text-[#0F172A] font-mono">Freedom.Setup.1.0.0.exe</span> from your{' '}
                <span className="font-bold text-[#0F172A]">Downloads</span> folder
              </p>
            </div>

            {/* STEP 2: Run Windows Installer Wizard */}
            <div className="flex flex-col items-center space-y-3.5 max-w-xs sm:max-w-none w-full mx-auto">
              <div className="w-8 h-8 rounded-full bg-[#2F6FED] text-white font-mono font-extrabold text-sm flex items-center justify-center shadow-md z-10">
                2
              </div>
              <div className="w-full h-52 sm:h-56 rounded-2xl bg-white border border-black/10 shadow-md flex flex-col items-center justify-center p-6 text-center space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-[#EAF1FE] text-[#2F6FED] flex items-center justify-center">
                  <Monitor className="w-7 h-7" />
                </div>
                <div className="text-xs font-sans font-bold text-[#0F172A]">
                  Windows Setup Wizard
                </div>
              </div>
              <p className="text-xs text-center text-[#475569] font-medium leading-snug max-w-[220px]">
                Follow the <span className="font-bold text-[#0F172A]">setup wizard</span> instructions to complete installation
              </p>
            </div>

            {/* STEP 3: Launch Freedom App */}
            <div className="flex flex-col items-center space-y-3.5 max-w-xs sm:max-w-none w-full mx-auto">
              <div className="w-8 h-8 rounded-full bg-[#2F6FED] text-white font-mono font-extrabold text-sm flex items-center justify-center shadow-md z-10">
                3
              </div>
              <div className="w-full h-52 sm:h-56 rounded-2xl bg-white border border-black/10 shadow-md flex flex-col items-center justify-center p-6 text-center space-y-3">
                <img
                  src="/freedom.png"
                  alt="Freedom Desktop App Icon"
                  className="w-14 h-14 object-contain rounded-xl shadow-sm"
                />
                <div className="text-xs font-sans font-bold text-[#0F172A]">
                  Launch Freedom
                </div>
              </div>
              <p className="text-xs text-center text-[#475569] font-medium leading-snug max-w-[220px]">
                Launch <span className="font-bold text-[#0F172A]">Freedom</span> from your Desktop shortcut or Start menu
              </p>
            </div>
          </div>
        ) : (
          /* MACOS INSTALLATION STEPS GRID */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 pt-2 max-w-4xl mx-auto text-left w-full">
            {/* STEP 1: Open Freedom.dmg */}
            <div className="flex flex-col items-center space-y-3.5 max-w-xs sm:max-w-none w-full mx-auto">
              <div className="w-8 h-8 rounded-full bg-[#2F6FED] text-white font-mono font-extrabold text-sm flex items-center justify-center shadow-md z-10">
                1
              </div>
              <div className="w-full h-52 sm:h-56 rounded-2xl bg-white border border-black/10 shadow-md flex items-center justify-center overflow-hidden">
                <img
                  src="/step-1.png"
                  alt="Step 1: Open Freedom.dmg from Downloads folder"
                  className="w-full h-full object-cover"
                />
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
              <div className="w-full h-52 sm:h-56 rounded-2xl bg-white border border-black/10 shadow-md flex items-center justify-center overflow-hidden">
                <img
                  src="/step-2.png"
                  alt="Step 2: Drag Freedom icon into Applications folder"
                  className="w-full h-full object-cover"
                />
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
              <div className="w-full h-52 sm:h-56 rounded-2xl bg-white border border-black/10 shadow-md flex items-center justify-center overflow-hidden">
                <img
                  src="/step-3.png"
                  alt="Step 3: Open Freedom app from Applications folder"
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-xs text-center text-[#475569] font-medium leading-snug max-w-[220px]">
                Open the <span className="font-bold text-[#0F172A]">Freedom app</span> from your{' '}
                <span className="font-bold text-[#0F172A]">Applications</span> folder
              </p>
            </div>
          </div>
        )}

        {/* macOS Sequoia & Sonoma Unidentified Developer / "App is Damaged" Troubleshooting Card (ONLY DISPLAYED ON MACOS) */}
        {os === 'mac' && (
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
        )}
      </div>
      <Footer />
    </main>
  );
}

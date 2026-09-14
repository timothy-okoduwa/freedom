import React from 'react';
import { Menubar } from '../../components/Menubar';
import { Footer } from '../../components/Footer';

export const metadata = {
  title: 'Trust & Data Privacy — Freedom',
  description: 'What happens to your data on Freedom. Full transparency into screen access, storage, background services, and security.',
};

export default function TrustPage() {
  return (
    <main className="min-h-screen bg-white text-[#111111] pt-20 font-sans selection:bg-[#2F6FED] selection:text-white">
      {/* Background Dot Grid */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.18]"
        style={{
          backgroundImage: 'radial-gradient(#94A3B8 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}
      />

      <Menubar />

      <div className="relative max-w-5xl mx-auto px-4 py-16 sm:py-24 space-y-12 z-10">
        {/* Header Section (Matching Image 2) */}
        <div className="text-center space-y-3">
          <div className="inline-block px-4 py-1 rounded-full border border-black/15 bg-white text-[#444444] text-[11px] font-mono tracking-widest uppercase shadow-2xs">
            THE FINE PRINT
          </div>
          <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tighter text-[#111111] leading-none">
            what happens to your data
          </h1>
        </div>

        {/* 3x3 Pastel Grid (Matching Image 2 Exact Layout & Color Scheme) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          {/* Card 1: SCREEN (Pastel Yellow) */}
          <div className="p-8 rounded-2xl bg-[#FEF3C7] border border-amber-200/60 shadow-2xs flex flex-col justify-between space-y-6">
            <div className="text-[11px] font-mono tracking-widest uppercase text-[#854D0E] font-semibold text-center">
              SCREEN
            </div>
            <p className="text-sm sm:text-base text-[#111111] font-normal leading-relaxed text-center">
              we only see your screen when you interact with the app. freedom doesn&apos;t continuously monitor or look at your screen.
            </p>
          </div>

          {/* Card 2: STORAGE (Pastel Blue) */}
          <div className="p-8 rounded-2xl bg-[#DBEAFE] border border-blue-200/60 shadow-2xs flex flex-col justify-between space-y-6">
            <div className="text-[11px] font-mono tracking-widest uppercase text-[#1E40AF] font-semibold text-center">
              STORAGE
            </div>
            <p className="text-sm sm:text-base text-[#111111] font-normal leading-relaxed text-center">
              we never store raw desktop snapshots. your session data is saved locally on your computer and synced securely to cloud firestore.
            </p>
          </div>

          {/* Card 3: PROCESSING (Pastel Pink) */}
          <div className="p-8 rounded-2xl bg-[#FCE7F3] border border-pink-200/60 shadow-2xs flex flex-col justify-between space-y-6">
            <div className="text-[11px] font-mono tracking-widest uppercase text-[#9D174D] font-semibold text-center">
              PROCESSING
            </div>
            <p className="text-sm sm:text-base text-[#111111] font-normal leading-relaxed text-center">
              everything is processed securely between your local encrypted desktop client and google cloud infrastructure.
            </p>
          </div>

          {/* Card 4: DELETION (Pastel Yellow) */}
          <div className="p-8 rounded-2xl bg-[#FEF3C7] border border-amber-200/60 shadow-2xs flex flex-col justify-between space-y-6">
            <div className="text-[11px] font-mono tracking-widest uppercase text-[#854D0E] font-semibold text-center">
              DELETION
            </div>
            <p className="text-sm sm:text-base text-[#111111] font-normal leading-relaxed text-center">
              want your data gone? just ask. we&apos;ll permanently delete your account and all associated day plans, any time.
            </p>
          </div>

          {/* Card 5: TRAINING (Pastel Blue) */}
          <div className="p-8 rounded-2xl bg-[#DBEAFE] border border-blue-200/60 shadow-2xs flex flex-col justify-between space-y-6">
            <div className="text-[11px] font-mono tracking-widest uppercase text-[#1E40AF] font-semibold text-center">
              TRAINING
            </div>
            <p className="text-sm sm:text-base text-[#111111] font-normal leading-relaxed text-center">
              we never train AI models on your task titles or personal day plans. neither do our cloud providers.
            </p>
          </div>

          {/* Card 6: BACKGROUND (Pastel Pink) */}
          <div className="p-8 rounded-2xl bg-[#FCE7F3] border border-pink-200/60 shadow-2xs flex flex-col justify-between space-y-6">
            <div className="text-[11px] font-mono tracking-widest uppercase text-[#9D174D] font-semibold text-center">
              BACKGROUND
            </div>
            <p className="text-sm sm:text-base text-[#111111] font-normal leading-relaxed text-center">
              in the background, freedom collects nothing. no keystrokes, no clipboard, no files, no screen. it only tracks active task duration.
            </p>
          </div>

          {/* Card 7: QUITTING (Pastel Yellow) */}
          <div className="p-8 rounded-2xl bg-[#FEF3C7] border border-amber-200/60 shadow-2xs flex flex-col justify-between space-y-6">
            <div className="text-[11px] font-mono tracking-widest uppercase text-[#854D0E] font-semibold text-center">
              QUITTING
            </div>
            <p className="text-sm sm:text-base text-[#111111] font-normal leading-relaxed text-center">
              close the app and it&apos;s closed. no background daemons, no silent telemetry, nothing keeps running.
            </p>
          </div>

          {/* Card 8: ANALYTICS (Pastel Blue) */}
          <div className="p-8 rounded-2xl bg-[#DBEAFE] border border-blue-200/60 shadow-2xs flex flex-col justify-between space-y-6">
            <div className="text-[11px] font-mono tracking-widest uppercase text-[#1E40AF] font-semibold text-center">
              ANALYTICS
            </div>
            <p className="text-sm sm:text-base text-[#111111] font-normal leading-relaxed text-center">
              the only third parties we share with are stripe, for subscription billing, and firebase, for cloud sync.
            </p>
          </div>

          {/* Card 9: CERTIFICATIONS (Pastel Pink) */}
          <div className="p-8 rounded-2xl bg-[#FCE7F3] border border-pink-200/60 shadow-2xs flex flex-col justify-between space-y-6">
            <div className="text-[11px] font-mono tracking-widest uppercase text-[#9D174D] font-semibold text-center">
              CERTIFICATIONS
            </div>
            <p className="text-sm sm:text-base text-[#111111] font-normal leading-relaxed text-center">
              no soc 2 or iso 27001 yet.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}

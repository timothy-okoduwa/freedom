import React from 'react';
import { MacWindow } from '@freedom/ui';

export const PricingSection: React.FC = () => {
  return (
    <section id="pricing" className="relative py-28 px-4 overflow-hidden sky-bg text-black">
      {/* Fluffy SVG Cloud Silhouettes floating in the sky */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-80">
        <svg className="absolute left-[5%] top-[10%] w-64 h-32 text-white/50 animate-float-slow" viewBox="0 0 200 100" fill="currentColor">
          <path d="M40 80 A 30 30 0 0 1 80 40 A 40 40 0 0 1 150 50 A 25 25 0 0 1 180 80 Z" />
        </svg>
        <svg className="absolute right-[8%] top-[18%] w-80 h-40 text-white/40 animate-float-delayed" viewBox="0 0 200 100" fill="currentColor">
          <path d="M30 80 A 25 25 0 0 1 70 50 A 45 45 0 0 1 160 55 A 30 30 0 0 1 190 80 Z" />
        </svg>
      </div>

      <div className="relative max-w-6xl mx-auto z-10">
        {/* Header */}
        <div className="text-center space-y-3 mb-10">
          <span className="text-xs uppercase font-mono tracking-widest text-white/90 bg-white/20 px-3 py-1 rounded-full font-semibold">
            pricing
          </span>
          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white drop-shadow-xs">
            100% free forever.
          </h2>
          <p className="text-base sm:text-lg text-white/90">
            no credit card, no paywalls, no trial limits. built for everyone.
          </p>
        </div>

        {/* 3 Pricing Cards in Retro Mac OS Windows */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch pt-4">
          {/* FREE TIER */}
          <MacWindow className="h-full">
            <div className="p-6 sm:p-7 bg-white h-full flex flex-col justify-between font-sans">
              <div>
                <h3 className="text-lg font-bold text-[#111] uppercase tracking-wider">Free App</h3>
                <p className="text-xs text-[#6B6B6B] mt-1">
                  100% free desktop engine · no limits
                </p>

                <div className="my-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold font-mono text-[#111]">$0</span>
                  </div>
                  <span className="text-[11px] text-[#888]">free forever, no credit card needed</span>
                </div>

                <div className="space-y-2.5 text-xs text-[#333] pt-4 border-t border-black/5">
                  <div className="font-semibold text-[11px] uppercase tracking-wider text-[#888]">
                    includes
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#1FAE6B]">✓</span>
                    <span>Full Day Plan builder & runner</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#1FAE6B]">✓</span>
                    <span>Core execution engine & timers</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#1FAE6B]">✓</span>
                    <span>Draggable floating widget capsule</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#1FAE6B]">✓</span>
                    <span>Productivity stats & Leaderboard</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#1FAE6B]">✓</span>
                    <span>Up to 3 friends</span>
                  </div>
                </div>
              </div>

              <div className="pt-8">
                <a
                  href="/Freedom.dmg"
                  download="Freedom.dmg"
                  className="block w-full text-center py-2.5 rounded-xl bg-[#FAFAFA] border border-[#E5E5E5] text-xs font-semibold text-black hover:bg-neutral-100 transition-all shadow-xs"
                >
                  download free
                </a>
              </div>
            </div>
          </MacWindow>

          {/* COMMUNITY EDITION (Featured with Popular Badge) */}
          <div className="relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 px-3 py-0.5 rounded-full bg-[#2F6FED] text-white text-[10px] font-bold uppercase tracking-wider shadow-md">
              100% Free
            </div>
            <MacWindow className="h-full border-2 border-[#2F6FED]/40 shadow-2xl">
              <div className="p-6 sm:p-7 bg-white h-full flex flex-col justify-between font-sans">
                <div>
                  <h3 className="text-lg font-bold text-[#111] uppercase tracking-wider flex items-center justify-between">
                    <span>Full Edition</span>
                    <span className="text-xs px-2 py-0.5 rounded-md bg-[#EAF1FE] text-[#2F6FED] font-mono">
                      v2.0
                    </span>
                  </h3>
                  <p className="text-xs text-[#6B6B6B] mt-1">
                    everything unlocked · 0 dollars forever
                  </p>

                  <div className="my-6">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-extrabold font-mono text-[#2F6FED]">
                        $0
                      </span>
                      <span className="text-xs text-[#6B6B6B]">/ forever</span>
                    </div>
                    <span className="text-[11px] text-[#888]">
                      all features included for all users
                    </span>
                  </div>

                  <div className="space-y-2.5 text-xs text-[#333] pt-4 border-t border-black/5">
                    <div className="font-semibold text-[11px] uppercase tracking-wider text-[#888]">
                      everything included
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[#2F6FED] font-bold">✓</span>
                      <span className="font-medium">Unlimited Day Plans & drafts</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[#2F6FED] font-bold">✓</span>
                      <span>Full Heatmap history (all-time)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[#2F6FED] font-bold">✓</span>
                      <span>Advanced Planning Accuracy metrics</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[#2F6FED] font-bold">✓</span>
                      <span>Audio player with Ninajirachi track</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[#2F6FED] font-bold">✓</span>
                      <span>Floating pill widget & dark mode</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[#2F6FED] font-bold">✓</span>
                      <span>Priority support</span>
                    </div>
                  </div>
                </div>

                <div className="pt-8">
                  <a
                    href="/Freedom.dmg"
                    download="Freedom.dmg"
                    className="relative overflow-hidden block w-full text-center py-2.5 rounded-xl bg-black text-white text-xs font-semibold hover:bg-neutral-800 transition-all shadow-md active:scale-98"
                  >
                    <div
                      className="absolute top-0 inset-x-0 h-1/2 pointer-events-none opacity-25"
                      style={{
                        background: 'linear-gradient(180deg, #FFFFFF 0%, rgba(255,255,255,0) 100%)',
                      }}
                    />
                    <span>get freedom (mac)</span>
                  </a>
                </div>
              </div>
            </MacWindow>
          </div>

          {/* OPEN SOURCE TIER */}
          <MacWindow className="h-full">
            <div className="p-6 sm:p-7 bg-white h-full flex flex-col justify-between font-sans">
              <div>
                <h3 className="text-lg font-bold text-[#111] uppercase tracking-wider">Open Source</h3>
                <p className="text-xs text-[#6B6B6B] mt-1">
                  for developers & hackers · build your own
                </p>

                <div className="my-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold font-mono text-[#111]">
                      $0
                    </span>
                  </div>
                  <span className="text-[11px] text-[#888]">
                    MIT License · Community driven
                  </span>
                </div>

                <div className="space-y-2.5 text-xs text-[#333] pt-4 border-t border-black/5">
                  <div className="font-semibold text-[11px] uppercase tracking-wider text-[#888]">
                    includes
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#1FAE6B]">✓</span>
                    <span>Full TypeScript monorepo source</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#1FAE6B]">✓</span>
                    <span>Electron + Next.js architecture</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#1FAE6B]">✓</span>
                    <span>Custom widgets & IPC channels</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#1FAE6B]">✓</span>
                    <span>Community PRs & discussions</span>
                  </div>
                </div>
              </div>

              <div className="pt-8">
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noreferrer"
                  className="block w-full text-center py-2.5 rounded-xl bg-[#FAFAFA] border border-[#E5E5E5] text-xs font-semibold text-black hover:bg-neutral-100 transition-all shadow-xs"
                >
                  view on github
                </a>
              </div>
            </div>
          </MacWindow>
        </div>

        {/* 100% Free Manifesto Banner */}
        <div className="mt-12 max-w-2xl mx-auto">
          <div className="rounded-2xl bg-black text-white p-6 shadow-2xl border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 font-sans">
            <div className="space-y-1 text-center sm:text-left">
              <div className="text-xs font-mono text-[#1FAE6B] font-bold">
                &lt; 100% free software &gt;
              </div>
              <div className="text-xs sm:text-sm text-neutral-300">
                Freedom is built to empower high-agency builders.{' '}
                <span className="text-white font-bold">No ads, no subscriptions, no catch.</span>
              </div>
            </div>
            <a
              href="/Freedom.dmg"
              download="Freedom.dmg"
              className="px-4 py-2 rounded-xl bg-white text-black text-xs font-bold hover:bg-neutral-200 transition-colors whitespace-nowrap"
            >
              download now
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

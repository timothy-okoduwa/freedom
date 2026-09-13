'use client';

import React from 'react';
import Link from 'next/link';
import { FreedomLogo } from '@freedom/ui';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-20 sm:mt-32 border-t border-black/8 bg-[#FFFFFF] pt-16 pb-12 px-4 select-none">
      <div className="max-w-6xl mx-auto">
        {/* 4 Navigation Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16 text-xs sm:text-sm">
          <div className="space-y-3">
            <h4 className="font-bold text-[#111111] uppercase font-mono tracking-wider text-[11px]">
              product
            </h4>
            <ul className="space-y-2 text-[#6B6B6B]">
              <li>
                <Link href="/download" className="hover:text-black transition-colors">
                  download for mac
                </Link>
              </li>
              <li>
                <a href="#windows-waitlist" className="hover:text-black transition-colors">
                  windows waitlist
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-black transition-colors">
                  features
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-black transition-colors">
                  pricing
                </a>
              </li>
              <li>
                <Link href="/changelog" className="hover:text-black transition-colors">
                  changelog
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-[#111111] uppercase font-mono tracking-wider text-[11px]">
              resources
            </h4>
            <ul className="space-y-2 text-[#6B6B6B]">
              <li>
                <a href="#the-dream" className="hover:text-black transition-colors">
                  the manifesto
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-black transition-colors">
                  frequently asked
                </a>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-black transition-colors">
                  privacy policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-black transition-colors">
                  terms of service
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-[#111111] uppercase font-mono tracking-wider text-[11px]">
              connect
            </h4>
            <ul className="space-y-2 text-[#6B6B6B]">
              <li>
                <a
                  href="https://x.com"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-black transition-colors"
                >
                  twitter / x
                </a>
              </li>
              <li>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-black transition-colors"
                >
                  github
                </a>
              </li>
              <li>
                <a
                  href="mailto:support@freedom.so"
                  className="hover:text-black transition-colors"
                >
                  support email
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-[#111111] uppercase font-mono tracking-wider text-[11px]">
              system status
            </h4>
            <div className="p-3 rounded-xl bg-[#FAFAFA] border border-[#E5E5E5] space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#1FAE6B] animate-pulse" />
                <span className="font-semibold text-xs text-[#111]">All Systems Operational</span>
              </div>
              <p className="text-[11px] text-[#888]">
                Freedom Desktop Cloud Sync: 99.99%
              </p>
            </div>
          </div>
        </div>

        {/* GIANT OVERSIZED RETRO PIXEL/BUBBLE WORDMARK (HeyClicky signature visual anchor) */}
        <div className="pt-8 pb-6 border-t border-black/5 flex items-center justify-between gap-4">
          {/* Retro Pixel Trash Can on left */}
          <div className="hidden sm:flex flex-col items-center opacity-60 hover:opacity-100 transition-opacity cursor-pointer">
            <div className="w-8 h-9 border-2 border-black rounded-b-md relative flex flex-col items-center justify-center p-1 bg-[#FAFAFA]">
              <div className="w-10 h-1.5 bg-black absolute -top-2 rounded-full" />
              <div className="w-3 h-0.5 bg-black absolute -top-3 rounded-full" />
              <div className="w-1 h-4 bg-black/40 rounded-full" />
            </div>
            <span className="text-[9px] font-mono mt-1 text-[#888]">trash</span>
          </div>

          {/* Huge Wordmark SVG */}
          <div className="flex-1 text-center select-none overflow-hidden flex items-center justify-center gap-3 sm:gap-6">
            <FreedomLogo size={72} className="shrink-0" />
            <h1
              className="text-6xl sm:text-8xl md:text-9xl lg:text-[140px] font-black tracking-tighter text-[#2F6FED] leading-none opacity-90 drop-shadow-sm font-sans"
              style={{ letterSpacing: '-0.06em' }}
            >
              freedom
            </h1>
          </div>

          {/* Retro Pixel Folder on right */}
          <div className="hidden sm:flex flex-col items-center opacity-60 hover:opacity-100 transition-opacity cursor-pointer">
            <div className="w-9 h-8 border-2 border-black rounded-md relative bg-[#8FB8F6] p-1">
              <div className="w-4 h-2 bg-black absolute -top-1.5 left-1 rounded-t-sm" />
            </div>
            <span className="text-[9px] font-mono mt-1 text-[#888]">app folder</span>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="text-center text-[11px] font-mono text-[#888888] pt-4">
          © 2026 Freedom Technologies Inc. · Built for high-agency builders.
        </div>
      </div>
    </footer>
  );
};

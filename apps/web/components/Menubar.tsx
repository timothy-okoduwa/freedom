'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FreedomLogo } from '@freedom/ui';
import { globalAudioStore, AUDIO_TRACKS, type AudioTrack } from '../lib/audioStore';
import { useUserOS } from '../hooks/useUserOS';

export const Menubar: React.FC = () => {
  const os = useUserOS();
  const [time, setTime] = useState('10:42 AM');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<AudioTrack>(AUDIO_TRACKS[0]);
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
  const [isCharging, setIsCharging] = useState<boolean>(false);
  const [isBluetoothOpen, setIsBluetoothOpen] = useState(false);
  const [isHeadphonesOpen, setIsHeadphonesOpen] = useState(false);

  useEffect(() => {
    const unsub = globalAudioStore.subscribe((data) => {
      setIsPlaying(data.isPlaying);
      setCurrentTrack(data.currentTrack);
    });

    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);

    // Read real laptop battery percentage via Web Battery API
    if (typeof window !== 'undefined' && 'getBattery' in navigator) {
      (navigator as any)
        .getBattery()
        .then((battery: any) => {
          const updateBattery = () => {
            setBatteryLevel(Math.round(battery.level * 100));
            setIsCharging(battery.charging);
          };
          updateBattery();
          battery.addEventListener('levelchange', updateBattery);
          battery.addEventListener('chargingchange', updateBattery);
        })
        .catch(() => {
          setBatteryLevel(100);
        });
    } else {
      setBatteryLevel(100);
    }

    return () => {
      clearInterval(interval);
      unsub();
    };
  }, []);

  const toggleAudio = () => {
    globalAudioStore.toggle();
  };

  return (
    <header className="fixed top-0 inset-x-0 z-50 h-10 bg-white/85 backdrop-blur-md border-b border-black/[0.08] select-none text-[13px] font-sans">
      <div className="max-w-7xl mx-auto h-full px-3 flex items-center justify-between">
        {/* Left Navigation */}
        <div className="flex items-center gap-5">
          <Link
            href="/"
            className="font-bold tracking-tight text-black flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <FreedomLogo size={20} />
            <span>freedom</span>
          </Link>
          <nav className="hidden md:flex items-center gap-4 text-[#555555] font-normal">
            <Link href="/#features" className="hover:text-black transition-colors">
              features
            </Link>
            <Link href="/#pricing" className="hover:text-black transition-colors">
              pricing
            </Link>
            <Link href="/#the-dream" className="hover:text-black transition-colors">
              the dream
            </Link>
            <Link href="/#faq" className="hover:text-black transition-colors">
              faq
            </Link>
            <Link href="/trust" className="hover:text-black transition-colors">
              trust
            </Link>
            <Link href="/changelog" className="hover:text-black transition-colors">
              changelog
            </Link>
          </nav>
        </div>

        {/* Center Logo Icon */}
        <div className="hidden lg:flex items-center justify-center opacity-90 hover:opacity-100 transition-opacity">
          <FreedomLogo size={22} />
        </div>

        {/* Right Status Bar (Mac OS Icons) */}
        <div className="flex items-center gap-2.5">
          {/* Wi-Fi Icon */}
          <div className="text-[#555] hover:text-black cursor-pointer p-0.5" title="Wi-Fi: Connected">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12.55a11 11 0 0 1 14.08 0" />
              <path d="M1.42 9a16 16 0 0 1 21.16 0" />
              <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
              <line x1="12" y1="20" x2="12.01" y2="20" strokeWidth="3" />
            </svg>
          </div>

          {/* Headphones Icon with Music Popover Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                if (isPlaying) {
                  globalAudioStore.stop();
                  setIsHeadphonesOpen(false);
                } else {
                  setIsHeadphonesOpen(!isHeadphonesOpen);
                }
              }}
              title={isPlaying ? `Playing: ${currentTrack.artist} — ${currentTrack.title} (Click to stop)` : 'Click to select music track'}
              className={`p-0.5 rounded transition-all cursor-pointer flex items-center gap-1.5 ${
                isPlaying
                  ? 'bg-black/5 hover:bg-black/10 text-black px-2 py-0.5 rounded-full border border-black/10'
                  : isHeadphonesOpen
                  ? 'text-black bg-black/10'
                  : 'text-[#555] hover:text-black'
              }`}
            >
              {isPlaying && (
                <span className="relative flex items-center justify-center shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1FAE6B] animate-ping absolute" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1FAE6B] relative" />
                </span>
              )}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                <path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3" />
              </svg>
              {isPlaying && (
                <span className="max-w-[130px] truncate text-[11px] font-medium text-[#111]">
                  {currentTrack.artist} — {currentTrack.title}
                </span>
              )}
            </button>

            {/* Glossy Music Track Selector Dropdown */}
            {isHeadphonesOpen && (
              <>
                <div
                  className="fixed inset-0 z-40 bg-transparent"
                  onClick={() => setIsHeadphonesOpen(false)}
                />
                <div className="absolute top-full right-0 mt-2.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="p-2 rounded-2xl bg-white/95 backdrop-blur-md border border-black/15 shadow-2xl text-xs font-medium text-black min-w-[240px] space-y-1">
                    <div className="px-2 py-1 flex items-center justify-between text-[10px] uppercase font-mono tracking-wider text-neutral-400 border-b border-black/5 pb-1.5 mb-1">
                      <span>Select Music Track</span>
                      {isPlaying && (
                        <span className="flex items-center gap-1 text-[#1FAE6B] font-bold">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#1FAE6B] animate-ping" />
                          Playing
                        </span>
                      )}
                    </div>

                    <div className="space-y-1">
                      {AUDIO_TRACKS.map((t) => {
                        const isSelected = isPlaying && currentTrack.id === t.id;
                        return (
                          <button
                            key={t.id}
                            type="button"
                            onClick={() => {
                              globalAudioStore.setTrackAndPlay(t);
                              setIsHeadphonesOpen(false);
                            }}
                            className={`w-full text-left px-2.5 py-1.5 rounded-xl flex items-center justify-between transition-colors cursor-pointer ${
                              isSelected
                                ? 'bg-[#2F6FED]/10 text-[#2F6FED] font-semibold'
                                : 'hover:bg-black/5 text-[#333]'
                            }`}
                          >
                            <div className="flex items-center gap-2 truncate">
                              <span className="text-xs">{t.id === 'mizmo_hello' ? '🎵' : '🎧'}</span>
                              <span className="truncate">{t.artist} — {t.title}</span>
                            </div>
                            {isSelected && (
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-[#2F6FED] shrink-0 ml-1">
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Bluetooth Icon with AirPods Popover */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsBluetoothOpen(!isBluetoothOpen)}
              title="Bluetooth"
              className={`p-0.5 rounded transition-colors cursor-pointer ${
                isBluetoothOpen ? 'text-black bg-black/10' : 'text-[#555] hover:text-black'
              }`}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 7l10 10-5 5V2l5 5L7 17" />
              </svg>
            </button>

            {/* Glossy AirPods Popover Pill */}
            {isBluetoothOpen && (
              <div className="absolute top-full right-0 mt-2.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-black/15 shadow-xl text-xs font-medium text-black flex items-center gap-2 whitespace-nowrap">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3" />
                  </svg>
                  <span className="font-sans font-semibold text-[#111]">Timothy&apos;s AirPods</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-black ml-0.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
              </div>
            )}
          </div>

          {/* Real Laptop Battery Indicator with % */}
          <div className="hidden sm:flex items-center gap-1.5 text-[#555] text-xs font-mono select-none" title={`Battery: ${batteryLevel ?? 100}%${isCharging ? ' (Charging)' : ''}`}>
            <span className="text-[11px] font-medium text-[#444] font-mono">
              {batteryLevel ?? 100}%
            </span>
            <div className="relative w-5 h-2.5 rounded-[3px] border border-[#777] p-[1px] flex items-center bg-black/5">
              <div
                className={`h-full rounded-[1px] transition-all duration-300 ${
                  isCharging
                    ? 'bg-[#34C759]'
                    : (batteryLevel ?? 100) <= 20
                    ? 'bg-[#FF3B30]'
                    : 'bg-[#111]'
                }`}
                style={{ width: `${Math.max(10, Math.min(100, batteryLevel ?? 100))}%` }}
              />
              <div className="absolute -right-[3px] top-1/2 -translate-y-1/2 w-[2px] h-1 bg-[#777] rounded-r-[1px]" />
            </div>
          </div>

          {/* Time */}
          <span className="font-mono text-xs font-medium text-[#444]">{time}</span>

          {/* Dynamic Get Freedom CTA Button (Apple / Windows Icon based on OS) */}
          <Link
            href="/download"
            className="relative overflow-hidden flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-black text-white text-xs font-medium shadow-sm hover:bg-neutral-800 transition-all active:scale-95"
          >
            <div
              className="absolute top-0 inset-x-0 h-1/2 pointer-events-none opacity-25"
              style={{
                background: 'linear-gradient(180deg, #FFFFFF 0%, rgba(255,255,255,0) 100%)',
              }}
            />
            {os === 'windows' ? (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <path d="M0 3.449L9.75 2.1v9.451H0m10.95-9.613L24 0v11.4H10.95M0 12.6h9.75v9.451L0 20.699M10.95 12.6H24V24l-13.05-1.848" />
              </svg>
            ) : (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.61-.75 1.04-1.8 1.01-2.87-.96.04-2.13.65-2.73 1.35-.53.61-.98 1.68-.93 2.71 1.07.08 2.05-.44 2.65-1.19z" />
              </svg>
            )}
            <span>get freedom</span>
          </Link>
        </div>
      </div>
    </header>
  );
};

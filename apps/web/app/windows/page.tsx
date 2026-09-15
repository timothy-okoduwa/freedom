'use client';

import React, { useState, useEffect } from 'react';
import { Menubar } from '../../components/Menubar';
import { Footer } from '../../components/Footer';
import { waitlistService, type WaitlistEntry } from '../../lib/firebase';
import { Monitor, Terminal, Lock, Copy, Check, CheckCircle2, ArrowRight } from 'lucide-react';

export default function WindowsWaitlistPage() {
  const [email, setEmail] = useState('');
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userRank, setUserRank] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [entries, setEntries] = useState<WaitlistEntry[]>([]);

  useEffect(() => {
    const saved = waitlistService.getSavedEmail();
    if (saved) {
      setUserEmail(saved);
      setEmail(saved);
      setIsSubmitted(true);
      waitlistService.joinWaitlist(saved).then((res) => {
        setUserRank(res.rank);
        setEntries(res.entries);
      });
    } else {
      waitlistService.getWaitlist().then((list) => setEntries(list));
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setIsSubmitting(true);

    const res = await waitlistService.joinWaitlist(email);
    setUserEmail(email.trim().toLowerCase());
    setUserRank(res.rank);
    setEntries(res.entries);
    setIsSubmitted(true);
    setIsSubmitting(false);
  };

  const copyReferralLink = () => {
    if (typeof window !== 'undefined') {
      const baseUrl = window.location.origin || 'https://usefreedom.top';
      navigator.clipboard.writeText(`${baseUrl}/windows?ref=${encodeURIComponent(userEmail || '')}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const maskEmail = (str: string) => {
    const parts = str.split('@');
    if (parts.length < 2) return '••••••••@••••.com';
    const name = parts[0];
    const domain = parts[1];
    const maskedName = name.length > 2 ? name[0] + '••••' + name[name.length - 1] : name[0] + '••••';
    return `${maskedName}@${domain}`;
  };

  return (
    <main className="min-h-screen bg-[#FFFFFF] text-[#111111] pt-20 font-sans selection:bg-[#2F6FED] selection:text-white">
      {/* Background Dot Grid */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.18]"
        style={{
          backgroundImage: 'radial-gradient(#94A3B8 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}
      />

      <Menubar />

      {/* Hero Section */}
      <section className="relative px-4 py-16 sm:py-24 max-w-4xl mx-auto text-center space-y-8 z-10">
        {/* Windows Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F0F4FF] border border-[#2F6FED]/20 text-[#2F6FED] text-xs font-mono font-medium">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M0 3.449L9.75 2.1v9.451H0m10.95-9.613L24 0v11.4H10.95M0 12.6h9.75v9.451L0 20.699M10.95 12.6H24V24l-13.05-1.848" />
          </svg>
          <span>WINDOWS 11 / 10 NATIVE APP · IN ACTIVE DEVELOPMENT</span>
        </div>

        {/* Heading */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-[#111111] leading-none">
          freedom for windows.
        </h1>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl text-[#555555] max-w-2xl mx-auto leading-relaxed">
          The automatic execution engine built for high-agency builders is coming natively to Windows.
          Floating taskbar widgets, native WSL2 workspace integration, and distraction shields.
        </p>

        {/* Waitlist Form Card */}
        <div className="max-w-md mx-auto pt-2">
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="flex flex-col sm:flex-row items-center gap-2.5 p-2 rounded-2xl bg-white border border-[#E5E5E5] shadow-lg">
                <input
                  type="email"
                  required
                  placeholder="Enter your work or personal email..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 text-sm text-[#111] placeholder-[#888] bg-transparent outline-none font-medium"
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto shrink-0 px-6 py-3 rounded-xl bg-[#2F6FED] hover:bg-[#255CBD] text-white text-sm font-semibold shadow-sm transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <span>{isSubmitting ? 'Joining...' : 'Join Waitlist'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center justify-between px-2 text-xs font-mono text-[#777]">
                <span className="flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-[#2F6FED]" /> Encrypted & Private
                </span>
                <span className="font-semibold text-[#111]">14,892+ on waitlist</span>
              </div>
            </form>
          ) : (
            <div className="p-6 rounded-2xl bg-[#F0FDF4] border border-[#1FAE6B]/30 text-center space-y-4 shadow-md animate-in fade-in zoom-in-95 duration-200">
              <div className="w-12 h-12 rounded-full bg-[#1FAE6B]/15 text-[#1FAE6B] flex items-center justify-center mx-auto shadow-xs">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-[#111]">You are on the priority list!</h3>
                <p className="text-xs text-[#555] mt-1 font-mono">
                  Registered Email: <strong className="text-[#111]">{userEmail}</strong>
                </p>
                <div className="mt-2 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1FAE6B] text-white text-xs font-mono font-bold shadow-sm">
                  PRIORITY POSITION #{userRank || 14892}
                </div>
              </div>

              <div className="pt-3 border-t border-[#1FAE6B]/20 flex flex-col sm:flex-row gap-2">
                <button
                  type="button"
                  onClick={copyReferralLink}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-white border border-[#1FAE6B]/40 text-[#111] text-xs font-semibold hover:bg-neutral-50 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-[#1FAE6B]" /> : <Copy className="w-3.5 h-3.5 text-[#2F6FED]" />}
                  <span>{copied ? 'Link Copied!' : 'Copy Referral Link'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsSubmitted(false)}
                  className="py-2.5 px-3 rounded-xl bg-transparent border border-black/10 text-[#666] text-xs font-medium hover:text-black transition-colors cursor-pointer"
                >
                  Change Email
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Priority Waitlist Leaderboard Table */}
      <section className="relative px-4 py-12 max-w-4xl mx-auto z-10">
        <div className="rounded-3xl bg-white border border-[#E5E5E5] shadow-xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E5E5E5] pb-4">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-[#2F6FED]">LIVE RECORD</span>
              <h3 className="text-xl font-extrabold text-[#111] tracking-tight">Priority Access Queue</h3>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#777]">
              <span className="w-2 h-2 rounded-full bg-[#1FAE6B] animate-pulse" />
              <span>Real-time sync</span>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-[#E5E5E5] text-[11px] font-mono text-[#888] uppercase tracking-wider">
                  <th className="py-3 px-3 font-semibold">Rank</th>
                  <th className="py-3 px-3 font-semibold">Member Email</th>
                  <th className="py-3 px-3 font-semibold hidden sm:table-cell">Joined</th>
                  <th className="py-3 px-3 font-semibold text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0F0F0]">
                {entries.map((entry) => {
                  const isUser = userEmail && entry.email.toLowerCase() === userEmail.toLowerCase();
                  return (
                    <tr
                      key={entry.rank}
                      className={`transition-colors ${
                        isUser
                          ? 'bg-[#F0F4FF] font-semibold text-[#111]'
                          : 'hover:bg-[#FAFAFA] text-[#555]'
                      }`}
                    >
                      <td className="py-3.5 px-3 font-mono font-bold">
                        #{entry.rank}
                      </td>
                      <td className="py-3.5 px-3">
                        {isUser ? (
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-[#111]">{entry.email}</span>
                            <span className="px-2 py-0.5 rounded-md bg-[#2F6FED] text-white text-[10px] font-mono font-bold uppercase">
                              YOU
                            </span>
                          </div>
                        ) : (
                          <div className="relative inline-block select-none">
                            <span className="filter blur-[5px] opacity-60 text-slate-700 font-mono tracking-widest">
                              {maskEmail(entry.email)}
                            </span>
                            <span className="sr-only">Blurred email for privacy</span>
                          </div>
                        )}
                      </td>
                      <td className="py-3.5 px-3 font-mono text-[#777] hidden sm:table-cell">
                        {entry.joinedAt}
                      </td>
                      <td className="py-3.5 px-3 text-right">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-mono font-medium ${
                            isUser
                              ? 'bg-[#1FAE6B] text-white font-bold'
                              : 'bg-neutral-100 text-neutral-600'
                          }`}
                        >
                          {isUser ? '✓ Priority Reserved' : 'In Queue'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="relative px-4 py-16 border-t border-[#E5E5E5] bg-[#FAFAFA] z-10">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center space-y-2">
            <span className="text-xs font-mono uppercase tracking-wider text-[#2F6FED]">built for windows</span>
            <h2 className="text-3xl font-extrabold text-[#111] tracking-tight">
              Crafted natively for Windows power users.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-white border border-[#E5E5E5] shadow-2xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#F0F4FF] text-[#2F6FED] flex items-center justify-center font-mono font-bold text-lg">
                <Monitor className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-[#111]">Taskbar Floating Pill</h3>
              <p className="text-sm text-[#555] leading-relaxed">
                Freedom floats over all Windows virtual desktops and full-screen apps without focus-stealing or taskbar clutter.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-[#E5E5E5] shadow-2xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#F0F4FF] text-[#2F6FED] flex items-center justify-center font-mono font-bold text-lg">
                <Terminal className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-[#111]">WSL2 & VS Code Integration</h3>
              <p className="text-sm text-[#555] leading-relaxed">
                Connects directly with your Windows Subsystem for Linux (WSL2) environments and VS Code workspaces.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

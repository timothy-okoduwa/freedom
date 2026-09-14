'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useSessionStore } from '../../stores/useSessionStore';
import { authService, firestoreService, getDicebearAvatar } from '../../lib/firebase';

import {
  LayoutDashboard,
  CalendarPlus,
  Timer,
  CheckSquare,
  History,
  BarChart3,
  Calendar,
  Trophy,
  Settings,
  Flame,
  LogOut,
  AppWindow,
} from 'lucide-react';
import { FreedomLogo } from '@freedom/ui';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, setUser, activeItem, loadActiveSession } = useSessionStore();

  const [authChecking, setAuthChecking] = useState(() => {
    if (typeof window !== 'undefined') {
      return !authService.getCachedUser() && !user;
    }
    return true;
  });

  // Apply theme on load
  useEffect(() => {
    const theme = (localStorage.getItem('freedom_theme') as string) || user?.theme || 'light';
    const isDark =
      theme === 'dark' ||
      (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [user?.theme]);

  useEffect(() => {
    loadActiveSession();

    // Check cached session on startup for instant recognition
    const cached = authService.getCachedUser();
    if (cached && !user) {
      setUser(cached);
      setAuthChecking(false);
    }

    const unsubscribe = authService.onAuthStateChange((currentUser) => {
      setUser(currentUser);
      setAuthChecking(false);
      if (!currentUser) {
        router.push('/login');
      } else {
        firestoreService.syncUserStats(currentUser.uid).then((updatedStats) => {
          if (updatedStats) {
            setUser({ ...currentUser, publicStats: updatedStats });
          }
        });
      }
    });


    return () => unsubscribe();
  }, [loadActiveSession, setUser, router]);

  const navItems = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Plan Builder', href: '/builder', icon: CalendarPlus },
    { label: 'Runtime Engine', href: '/runtime', icon: Timer, badge: activeItem ? 'LIVE' : undefined },
    { label: 'Daily Summary', href: '/summary', icon: CheckSquare },
    { label: 'Task History', href: '/history', icon: History },
    { label: 'Statistics', href: '/stats', icon: BarChart3 },
    { label: 'Heatmap', href: '/heatmap', icon: Calendar },
    { label: 'Leaderboard', href: '/leaderboard', icon: Trophy },
    { label: 'Settings', href: '/settings', icon: Settings },
  ];

  const handleSignOut = async () => {
    await authService.signOut();
    setUser(null);
    router.push('/login');
  };

  if (authChecking) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#FAFAFA] dark:bg-[#09090B] text-xs font-mono text-neutral-500">
        <div className="flex flex-col items-center gap-2">
          <div className="w-5 h-5 border-2 border-[#2F6FED] border-t-transparent rounded-full animate-spin" />
          <span>Restoring session...</span>
        </div>
      </div>
    );
  }

  const streak = user?.publicStats?.currentStreak ?? 0;
  const avatarUrl = user?.avatarUrl || getDicebearAvatar(user?.username || user?.uid || 'freedom');

  return (
    <div className="flex h-screen bg-[#FAFAFA] dark:bg-[#09090B] text-[#111111] dark:text-[#EDEDED] overflow-hidden select-none">
      {/* Persistent Left Nav Rail */}
      <aside className="w-60 bg-white dark:bg-[#121215] border-r border-[#E5E5E5] dark:border-[#27272A] flex flex-col justify-between p-4 z-20 transition-colors">
        <div className="space-y-6">
          {/* Logo & Streak Badge */}
          <div className="flex items-center justify-between px-2 pt-2">
            <Link href="/dashboard" className="flex items-center gap-2 font-bold text-base text-black dark:text-white">
              <FreedomLogo size={24} />
              <span className="tracking-tight">freedom</span>
            </Link>
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#E8F8F0] dark:bg-emerald-950/40 border border-[#1FAE6B]/20 text-[#1FAE6B] dark:text-emerald-400 text-[11px] font-mono font-semibold">
              <Flame className="w-3.5 h-3.5 text-amber-500" />
              <span>{streak}d</span>
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-[#EAF1FE] dark:bg-[#2F6FED]/20 text-[#2F6FED] font-semibold'
                      : 'text-[#6B6B6B] dark:text-[#A1A1AA] hover:text-[#111111] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#2F6FED]' : 'text-[#888] dark:text-[#71717A]'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="px-1.5 py-0.5 rounded-md bg-[#1FAE6B] text-white text-[9px] font-bold font-mono animate-pulse">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Area: User Profile & Floating Pill Button */}
        <div className="pt-3 border-t border-[#E5E5E5] dark:border-[#27272A] space-y-2.5">
          <button
            type="button"
            onClick={() => window.freedom?.widget?.show()}
            className="w-full py-2 px-3 rounded-xl bg-[#FAFAFA] dark:bg-[#18181B] border border-[#E5E5E5] dark:border-[#27272A] text-xs font-medium text-[#444] dark:text-[#D4D4D8] hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
          >
            <AppWindow className="w-3.5 h-3.5 text-[#2F6FED]" />
            <span>Show Floating Pill</span>
          </button>

          {/* User Account Info with Dicebear Avatar & Logout */}
          {user && (
            <div className="p-2 rounded-xl bg-[#FAFAFA] dark:bg-[#18181B] border border-[#E5E5E5] dark:border-[#27272A] flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0 pr-1">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={avatarUrl}
                  alt={user.displayName || 'User'}
                  className="w-8 h-8 rounded-full border border-black/10 dark:border-white/10 bg-white dark:bg-neutral-800 object-cover shrink-0"
                />
                <div className="truncate">
                  <div className="text-xs font-semibold text-[#111] dark:text-white truncate">
                    {user.displayName || 'Freedom User'}
                  </div>
                  <div className="text-[10px] text-[#888] dark:text-[#A1A1AA] font-mono truncate">
                    @{user.username || 'user'}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={handleSignOut}
                title="Sign Out"
                className="p-1.5 rounded-lg text-[#888] dark:text-[#A1A1AA] hover:text-[#E5484D] hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer shrink-0"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-6 sm:p-10">{children}</main>
    </div>
  );
}

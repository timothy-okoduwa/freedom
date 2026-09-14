'use client';

import React, { useState, useEffect } from 'react';
import { useSessionStore } from '../../../stores/useSessionStore';
import { authService, getDicebearAvatar } from '../../../lib/firebase';
import { soundManager, SOUND_OPTIONS, type SoundType } from '../../../lib/soundManager';
import { Card, Button } from '@freedom/ui';
import {
  Sparkles,
  RefreshCw,
  Save,
  Download,
  Trash2,
  Check,
  Sun,
  Moon,
  Monitor,
  Volume2,
  Play,
} from 'lucide-react';

const getSeedFromAvatarUrl = (url?: string) => {
  if (!url) return '';
  const match = url.match(/[?&]seed=([^&]+)/);
  return match ? decodeURIComponent(match[1]) : '';
};

export default function SettingsPage() {
  const { user, setUser } = useSessionStore();

  const [displayName, setDisplayName] = useState(user?.displayName || 'Timothy Freedom');
  const [username, setUsername] = useState(user?.username || 'timothy');
  const [avatarSeed, setAvatarSeed] = useState(
    getSeedFromAvatarUrl(user?.avatarUrl) || user?.username || 'timothy'
  );
  const [dailyGoalMinutes, setDailyGoalMinutes] = useState(user?.dailyGoalMinutes || 240);
  const [leaderboardOptIn, setLeaderboardOptIn] = useState(user?.leaderboardOptIn ?? true);
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark' | 'system'>('light');
  const [selectedSound, setSelectedSound] = useState<SoundType>('bell');

  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || '');
      setUsername(user.username || '');
      const seed = getSeedFromAvatarUrl(user.avatarUrl) || user.username || user.uid;
      setAvatarSeed(seed);
      setDailyGoalMinutes(user.dailyGoalMinutes || 240);
      setLeaderboardOptIn(user.leaderboardOptIn ?? true);
    }
  }, [user?.uid, user?.avatarUrl, user?.displayName, user?.username, user?.dailyGoalMinutes, user?.leaderboardOptIn]);

  useEffect(() => {
    // Load theme & sound preferences on mount
    const savedTheme = (localStorage.getItem('freedom_theme') as 'light' | 'dark' | 'system') || 'light';
    setCurrentTheme(savedTheme);

    const sound = soundManager.getSoundPreference();
    setSelectedSound(sound);
  }, []);

  const handleApplyTheme = (theme: 'light' | 'dark' | 'system') => {
    setCurrentTheme(theme);
    localStorage.setItem('freedom_theme', theme);
    const isDark =
      theme === 'dark' ||
      (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    authService.updateUser({ theme: theme === 'dark' ? 'dark' : 'light' });
  };

  const handleSoundChange = (sound: SoundType) => {
    setSelectedSound(sound);
    soundManager.setSoundPreference(sound);
    soundManager.playSound(sound);
  };

  const handleRandomizeAvatar = () => {
    const randomSeed = Math.random().toString(36).substring(2, 10);
    setAvatarSeed(randomSeed);
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    setSavedSuccess(false);
    try {
      const avatarUrl = getDicebearAvatar(avatarSeed);
      const updated = await authService.updateUser({
        displayName,
        username,
        avatarUrl,
        dailyGoalMinutes,
        leaderboardOptIn,
        theme: currentTheme === 'dark' ? 'dark' : 'light',
        subscriptionTier: 'free',
      });
      if (updated) {
        setUser(updated);
      }
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save profile:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleExportData = () => {
    const data = {
      user: { displayName, username, avatarSeed, dailyGoalMinutes },
      exportedAt: new Date().toISOString(),
      note: 'Freedom Personal Execution Archive',
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `freedom-export-${Date.now()}.json`;
    a.click();
  };

  const currentAvatarUrl = getDicebearAvatar(avatarSeed);

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-[#2F6FED]">Preferences</span>
          <h1 className="text-3xl font-extrabold tracking-tight text-[#111] dark:text-white mt-1">
            Settings
          </h1>
        </div>

        <Button
          variant="primary"
          size="md"
          disabled={saving}
          onClick={handleSaveProfile}
          className="flex items-center gap-2 bg-[#2F6FED] hover:bg-[#2558BE] text-white"
        >
          {savedSuccess ? (
            <>
              <Check className="w-4 h-4 text-emerald-300" />
              <span>Saved!</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Save Changes'}</span>
            </>
          )}
        </Button>
      </div>

      {/* Appearance: Light and Dark Mode */}
      <Card variant="default" className="p-6 space-y-4 bg-white dark:bg-[#18181B] border border-[#E5E5E5] dark:border-[#27272A] rounded-2xl">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#111] dark:text-white">Theme & Appearance</h3>
            <p className="text-xs text-[#888] dark:text-[#A1A1AA] mt-0.5">
              Customize Freedom to match your visual workflow.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 pt-1">
          <button
            type="button"
            onClick={() => handleApplyTheme('light')}
            className={`p-3.5 rounded-xl border flex flex-col items-center gap-2 transition-all cursor-pointer ${
              currentTheme === 'light'
                ? 'border-[#2F6FED] bg-[#EAF1FE] dark:bg-[#2F6FED]/20 text-[#2F6FED] shadow-xs'
                : 'border-[#E5E5E5] dark:border-[#27272A] hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
            }`}
          >
            <Sun className="w-5 h-5" />
            <span className="text-xs font-semibold">Light</span>
          </button>

          <button
            type="button"
            onClick={() => handleApplyTheme('dark')}
            className={`p-3.5 rounded-xl border flex flex-col items-center gap-2 transition-all cursor-pointer ${
              currentTheme === 'dark'
                ? 'border-[#2F6FED] bg-[#EAF1FE] dark:bg-[#2F6FED]/20 text-[#2F6FED] shadow-xs'
                : 'border-[#E5E5E5] dark:border-[#27272A] hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
            }`}
          >
            <Moon className="w-5 h-5" />
            <span className="text-xs font-semibold">Dark</span>
          </button>

          <button
            type="button"
            onClick={() => handleApplyTheme('system')}
            className={`p-3.5 rounded-xl border flex flex-col items-center gap-2 transition-all cursor-pointer ${
              currentTheme === 'system'
                ? 'border-[#2F6FED] bg-[#EAF1FE] dark:bg-[#2F6FED]/20 text-[#2F6FED] shadow-xs'
                : 'border-[#E5E5E5] dark:border-[#27272A] hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
            }`}
          >
            <Monitor className="w-5 h-5" />
            <span className="text-xs font-semibold">System</span>
          </button>
        </div>
      </Card>

      {/* Task Completion Sound Feedback */}
      <Card variant="default" className="p-6 space-y-4 bg-white dark:bg-[#18181B] border border-[#E5E5E5] dark:border-[#27272A] rounded-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-[#2F6FED] flex items-center justify-center">
              <Volume2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#111] dark:text-white">Task Completion Sound</h3>
              <p className="text-xs text-[#888] dark:text-[#A1A1AA]">
                Audio cue played whenever a deep work session or task finishes.
              </p>
            </div>
          </div>

          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => soundManager.playSound(selectedSound)}
            className="flex items-center gap-1.5 cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 text-[#2F6FED]" />
            <span>Test Sound</span>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
          {SOUND_OPTIONS.map((opt) => (
            <div
              key={opt.id}
              onClick={() => handleSoundChange(opt.id)}
              className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                selectedSound === opt.id
                  ? 'border-[#2F6FED] bg-[#EAF1FE]/70 dark:bg-[#2F6FED]/15'
                  : 'border-[#E5E5E5] dark:border-[#27272A] hover:bg-neutral-50 dark:hover:bg-neutral-800/50'
              }`}
            >
              <div>
                <div className={`text-xs font-semibold ${selectedSound === opt.id ? 'text-[#2F6FED]' : 'text-[#111] dark:text-white'}`}>
                  {opt.name}
                </div>
                <div className="text-[10px] text-[#888] dark:text-[#A1A1AA]">{opt.description}</div>
              </div>
              {selectedSound === opt.id && (
                <div className="w-4 h-4 rounded-full bg-[#2F6FED] text-white flex items-center justify-center">
                  <Check className="w-2.5 h-2.5" />
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Profile & Dicebear Avatar */}
      <Card variant="default" className="p-6 space-y-5 bg-white dark:bg-[#18181B] border border-[#E5E5E5] dark:border-[#27272A] rounded-2xl">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-[#111] dark:text-white">User Profile & Dicebear Avatar</h3>
          <span className="text-[11px] text-neutral-400 font-mono">https://api.dicebear.com</span>
        </div>

        <div className="flex items-center gap-5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={currentAvatarUrl}
            alt={displayName}
            className="w-20 h-20 rounded-full border-2 border-[#2F6FED]/20 bg-[#F4F4F5] dark:bg-neutral-800 object-cover shadow-sm p-1"
          />
          <div className="space-y-1.5">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={handleRandomizeAvatar}
              className="flex items-center gap-1.5 py-1.5 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5 text-[#2F6FED]" />
              <span>Generate New Avatar</span>
            </Button>
            <p className="text-[11px] text-[#888] dark:text-[#A1A1AA]">
              Click to generate a fresh avatar, then click &quot;Save Changes&quot; to keep it.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="block text-xs font-semibold text-[#111] dark:text-white mb-1">Display Name</label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[#E5E5E5] dark:border-[#27272A] bg-white dark:bg-[#09090B] text-xs text-black dark:text-white focus:outline-none focus:border-[#2F6FED]"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#111] dark:text-white mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[#E5E5E5] dark:border-[#27272A] bg-white dark:bg-[#09090B] text-xs text-black dark:text-white focus:outline-none focus:border-[#2F6FED]"
            />
          </div>
        </div>
      </Card>

      {/* Execution Preferences */}
      <Card variant="default" className="p-6 space-y-4 bg-white dark:bg-[#18181B] border border-[#E5E5E5] dark:border-[#27272A] rounded-2xl">
        <h3 className="text-sm font-bold text-[#111] dark:text-white">Execution Preferences</h3>

        <div>
          <label className="block text-xs font-semibold text-[#111] dark:text-white mb-1.5">
            Daily Productive Goal ({dailyGoalMinutes / 60} hours)
          </label>
          <div className="flex items-center gap-2">
            {[120, 180, 240, 300, 360].map((mins) => (
              <button
                key={mins}
                type="button"
                onClick={() => setDailyGoalMinutes(mins)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer ${
                  dailyGoalMinutes === mins
                    ? 'bg-[#2F6FED] text-white shadow-xs'
                    : 'bg-[#FAFAFA] dark:bg-neutral-800 border border-[#E5E5E5] dark:border-[#27272A] text-black dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-700'
                }`}
              >
                {mins / 60}h
              </button>
            ))}
          </div>
        </div>

        <div className="pt-2 flex items-center justify-between border-t border-neutral-100 dark:border-neutral-800">
          <div>
            <div className="text-xs font-semibold text-[#111] dark:text-white">Leaderboard Visibility</div>
            <div className="text-[11px] text-[#777] dark:text-[#A1A1AA]">
              Allow your aggregate productive hours and streak to be visible to others.
            </div>
          </div>
          <input
            type="checkbox"
            checked={leaderboardOptIn}
            onChange={(e) => setLeaderboardOptIn(e.target.checked)}
            className="w-4 h-4 accent-[#2F6FED] rounded cursor-pointer"
          />
        </div>
      </Card>

      {/* Product Tour & Help */}
      <Card variant="default" className="p-6 space-y-3 bg-white dark:bg-[#18181B] border border-[#E5E5E5] dark:border-[#27272A] rounded-2xl">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#111] dark:text-white">Interactive Product Tour</h3>
            <p className="text-xs text-[#6B6B6B] dark:text-[#A1A1AA] mt-0.5">
              Replay the step-by-step walkthrough to review Freedom features and shortcuts.
            </p>
          </div>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => window.dispatchEvent(new Event('freedom_open_product_tour'))}
            className="flex items-center gap-1.5 cursor-pointer bg-[#EFF6FF] dark:bg-blue-950/50 text-[#2F6FED] border border-[#BFDBFE] dark:border-blue-800 hover:bg-[#DBEAFE]"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Replay Product Tour</span>
          </Button>
        </div>
      </Card>

      {/* Unlocked Free Tier Notice */}
      <Card variant="surface" className="p-6 space-y-2 bg-[#F0FDF4] dark:bg-emerald-950/20 border border-[#BBF7D0] dark:border-emerald-800/40 rounded-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-[#1FAE6B] text-white flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5" />
            </span>
            <h3 className="text-sm font-bold text-[#111] dark:text-white">Freedom 100% Free & Unlocked</h3>
          </div>
          <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#1FAE6B] text-white font-mono font-bold">
            UNLOCKED
          </span>
        </div>
        <p className="text-xs text-[#15803D] dark:text-emerald-400">
          All features — unlimited Day Plans, Freedom floating capsule, cloud streak sync, competitive leaderboards, and full execution heatmaps — are completely free.
        </p>
      </Card>

      {/* Compliance & Data Export */}
      <Card variant="default" className="p-6 space-y-3 bg-white dark:bg-[#18181B] border border-[#E5E5E5] dark:border-[#27272A] rounded-2xl">
        <h3 className="text-sm font-bold text-[#111] dark:text-white">Data Privacy & Export</h3>
        <p className="text-xs text-[#6B6B6B] dark:text-[#A1A1AA]">
          Export your complete productivity history or manage your local session storage.
        </p>
        <div className="flex items-center gap-3 pt-2">
          <Button variant="secondary" size="sm" onClick={handleExportData} className="flex items-center gap-1.5 cursor-pointer">
            <Download className="w-3.5 h-3.5" />
            <span>Export Archive (JSON)</span>
          </Button>
          <Button
            variant="destructive"
            size="sm"
            className="flex items-center gap-1.5 cursor-pointer"
            onClick={() => {
              if (confirm('Are you sure? This will sign you out and clear your session.')) {
                authService.signOut();
                setUser(null);
                window.location.href = '/login';
              }
            }}
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Reset Local Session</span>
          </Button>
        </div>
      </Card>
    </div>
  );
}

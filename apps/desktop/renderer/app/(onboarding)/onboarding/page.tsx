'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, Button, ProgressBar } from '@freedom/ui';

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [displayName, setDisplayName] = useState('Timothy');
  const [username, setUsername] = useState('timothy');
  const [timezone, setTimezone] = useState(
    typeof Intl !== 'undefined' ? Intl.DateTimeFormat().resolvedOptions().timeZone : 'UTC'
  );
  const [dailyGoal, setDailyGoal] = useState(240); // 4 hours
  const [leaderboardOptIn, setLeaderboardOptIn] = useState(true);

  const totalSteps = 7;
  const progress = (step / totalSteps) * 100;

  const nextStep = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      router.push('/dashboard');
    }
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#FAFAFA]">
      <Card variant="raised" className="max-w-md w-full p-8 space-y-6 bg-white">
        {/* Progress header */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-[#888]">
            <span>Step {step} of {totalSteps}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <ProgressBar progress={progress} color="#2F6FED" />
        </div>

        {/* STEP 1: Welcome & Philosophy */}
        {step === 1 && (
          <div className="space-y-4 text-center py-4">
            <span className="text-3xl text-[#2F6FED]">❖</span>
            <h2 className="text-xl font-bold text-[#111]">Welcome to Freedom</h2>
            <p className="text-xs text-[#6B6B6B] leading-relaxed">
              Freedom is not another todo list. It is an automatic execution engine that replaces
              manual task checking with disciplined time measurement.
            </p>
          </div>
        )}

        {/* STEP 2: Profile */}
        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-[#111]">Create Your Profile</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-[#111] mb-1">Display Name</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E5E5E5] text-xs focus:outline-none focus:border-[#2F6FED]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#111] mb-1">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E5E5E5] text-xs focus:outline-none focus:border-[#2F6FED]"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Timezone */}
        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-[#111]">Select Your Timezone</h2>
            <p className="text-xs text-[#6B6B6B]">
              Ensures your 24-hour day boundaries and reset cycles occur accurately.
            </p>
            <input
              type="text"
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[#E5E5E5] text-xs font-mono focus:outline-none focus:border-[#2F6FED]"
            />
          </div>
        )}

        {/* STEP 4: Daily Goal */}
        {step === 4 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-[#111]">Daily Productive Goal</h2>
            <p className="text-xs text-[#6B6B6B]">
              How many hours of focused execution do you target each day?
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              {[120, 180, 240, 300, 360].map((mins) => (
                <button
                  key={mins}
                  type="button"
                  onClick={() => setDailyGoal(mins)}
                  className={`px-4 py-2 rounded-xl text-xs font-mono font-medium ${
                    dailyGoal === mins
                      ? 'bg-[#2F6FED] text-white'
                      : 'bg-[#FAFAFA] border border-[#E5E5E5] text-black'
                  }`}
                >
                  {mins / 60} hours
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 5: Leaderboard Opt-In */}
        {step === 5 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-[#111]">Leaderboard Visibility</h2>
            <p className="text-xs text-[#6B6B6B] leading-relaxed">
              Would you like to appear on community and friends leaderboards? Only your aggregate
              hours and streak are shared—never your private task titles.
            </p>
            <label className="flex items-center gap-3 p-3 rounded-xl border border-[#E5E5E5] cursor-pointer">
              <input
                type="checkbox"
                checked={leaderboardOptIn}
                onChange={(e) => setLeaderboardOptIn(e.target.checked)}
                className="w-4 h-4 accent-[#2F6FED]"
              />
              <span className="text-xs font-medium text-[#111]">Opt-in to public leaderboards</span>
            </label>
          </div>
        )}

        {/* STEP 6: Notifications */}
        {step === 6 && (
          <div className="space-y-4 text-center py-4">
            <div className="text-3xl">🔔</div>
            <h2 className="text-lg font-bold text-[#111]">Native Notifications</h2>
            <p className="text-xs text-[#6B6B6B] leading-relaxed">
              Freedom sends calm desktop notifications when a task ends, breaks begin, or your day
              plan completes.
            </p>
          </div>
        )}

        {/* STEP 7: Complete */}
        {step === 7 && (
          <div className="space-y-4 text-center py-4">
            <div className="text-3xl">🎉</div>
            <h2 className="text-xl font-bold text-[#111]">You're Ready to Focus</h2>
            <p className="text-xs text-[#6B6B6B] leading-relaxed">
              Your execution engine is configured. Build your first Day Plan and press Start Day to
              begin.
            </p>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-black/5">
          {step > 1 ? (
            <Button variant="ghost" size="sm" onClick={prevStep}>
              Back
            </Button>
          ) : (
            <div />
          )}
          <Button variant="primary" size="sm" onClick={nextStep}>
            {step === totalSteps ? 'Launch Freedom →' : 'Continue'}
          </Button>
        </div>
      </Card>
    </div>
  );
}

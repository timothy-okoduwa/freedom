'use client';

import React, { useState, useEffect, useCallback } from 'react';
import type { User, Team, TeamInvitation } from '@freedom/firestore-schema';
import { useSessionStore } from '../../../stores/useSessionStore';
import { firestoreService, getDicebearAvatar } from '../../../lib/firebase';
import { Card, Tabs, Button, Modal } from '@freedom/ui';
import {
  Trophy,
  Flame,
  Clock,
  Mail,
  UserPlus,
  Users,
  Copy,
  Check,
  Sparkles,
  Send,
  Plus,
  ShieldCheck,
  Shuffle,
  AlertCircle,
  LogIn,
} from 'lucide-react';

export default function LeaderboardPage() {
  const { user } = useSessionStore();
  const [activeTab, setActiveTab] = useState<'global' | 'friends' | 'teams'>('global');
  
  // Invite modal state
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [customInviteCode, setCustomInviteCode] = useState('FREEDOM-DEEP-WORK');
  const [codeChecking, setCodeChecking] = useState(false);
  const [codeAvailable, setCodeAvailable] = useState<boolean | null>(true);
  const [inviteStatus, setInviteStatus] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [sendingInvite, setSendingInvite] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // Teams state
  const [userTeams, setUserTeams] = useState<Team[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [teamMembers, setTeamMembers] = useState<User[]>([]);
  const [isCreateTeamOpen, setIsCreateTeamOpen] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamDesc, setNewTeamDesc] = useState('');
  const [newTeamCode, setNewTeamCode] = useState('');
  const [newTeamCodeAvailable, setNewTeamCodeAvailable] = useState<boolean | null>(null);
  const [creatingTeam, setCreatingTeam] = useState(false);

  // Join Team state
  const [isJoinTeamOpen, setIsJoinTeamOpen] = useState(false);
  const [joinCodeInput, setJoinCodeInput] = useState('');
  const [joiningTeam, setJoiningTeam] = useState(false);
  const [joinStatus, setJoinStatus] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Users rankings state
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Load global users & user's teams
  const loadData = useCallback(async () => {
    setLoading(true);
    const realUsers = await firestoreService.getLeaderboardUsers();
    if (realUsers.length > 0) {
      setUsers(realUsers);
    } else {
      const seedUsers: User[] = [
        {
          uid: 'u-1',
          displayName: 'Elena Vance',
          username: 'elena_v',
          timezone: 'UTC',
          dailyGoalMinutes: 300,
          theme: 'light',
          leaderboardOptIn: true,
          avatarUrl: getDicebearAvatar('elena_v'),
          authProvider: 'google',
          subscriptionTier: 'free',
          publicStats: { totalProductiveMinutes: 17040, currentStreak: 42, longestStreak: 42 },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          uid: 'u-2',
          displayName: 'Marcus Chen',
          username: 'marcus_c',
          timezone: 'UTC',
          dailyGoalMinutes: 240,
          theme: 'light',
          leaderboardOptIn: true,
          avatarUrl: getDicebearAvatar('marcus_c'),
          authProvider: 'google',
          subscriptionTier: 'free',
          publicStats: { totalProductiveMinutes: 14460, currentStreak: 35, longestStreak: 35 },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      if (user) seedUsers.push(user);
      seedUsers.sort((a, b) => (b.publicStats?.totalProductiveMinutes || 0) - (a.publicStats?.totalProductiveMinutes || 0));
      setUsers(seedUsers);
    }

    if (user?.uid) {
      const teams = await firestoreService.getUserTeams(user.uid);
      setUserTeams(teams);
      if (teams.length > 0 && !selectedTeam) {
        setSelectedTeam(teams[0]);
        const members = await firestoreService.getTeamMembers(teams[0].id);
        setTeamMembers(members);
      }
    }
    setLoading(false);
  }, [user, selectedTeam]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Handle selected team change
  const handleSelectTeam = async (team: Team) => {
    setSelectedTeam(team);
    setCustomInviteCode(team.inviteCode);
    const members = await firestoreService.getTeamMembers(team.id);
    setTeamMembers(members);
  };

  // Generate random invite code
  const generateRandomCode = (setter: (c: string) => void) => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let rand = 'FREEDOM-';
    for (let i = 0; i < 6; i++) {
      rand += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setter(rand);
  };

  // Check code availability
  const verifyCode = async (code: string, isNewTeam: boolean = false) => {
    if (!code.trim()) return;
    if (isNewTeam) {
      const avail = await firestoreService.checkInviteCodeAvailable(code);
      setNewTeamCodeAvailable(avail);
    } else {
      setCodeChecking(true);
      const avail = await firestoreService.checkInviteCodeAvailable(code, selectedTeam?.id);
      setCodeAvailable(avail);
      setCodeChecking(false);
    }
  };

  // Handle send email invitation
  const handleSendInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    if (codeAvailable === false) {
      setInviteStatus({ type: 'error', text: 'This invite code is already taken. Please choose another or generate one.' });
      return;
    }
    setSendingInvite(true);
    setInviteStatus(null);

    const activeCode = customInviteCode.trim().toUpperCase() || 'FREEDOM-DEEP-WORK';

    try {
      // 1. Send via email API
      const res = await fetch('/api/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientEmail: inviteEmail.trim(),
          teamName: selectedTeam?.name || 'Freedom Execution Team',
          inviteCode: activeCode,
          senderName: user?.displayName || 'Timothy',
        }),
      });
      const data = await res.json();

      // 2. Record invitation in Firestore
      if (user?.uid) {
        const inv: TeamInvitation = {
          id: `inv_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
          teamId: selectedTeam?.id || 'default_team',
          teamName: selectedTeam?.name || 'Freedom Execution Team',
          inviteCode: activeCode,
          recipientEmail: inviteEmail.trim(),
          senderId: user.uid,
          senderName: user.displayName || 'Freedom User',
          status: 'pending',
          createdAt: new Date().toISOString(),
        };
        await firestoreService.saveTeamInvitation(inv);
      }

      copyInviteCode(activeCode);
      setInviteStatus({
        type: 'success',
        text: `Invitation successfully created for ${inviteEmail.trim()}! Code ${activeCode} copied to clipboard.`,
      });
      setInviteEmail('');
    } catch (err: any) {
      setInviteStatus({
        type: 'error',
        text: 'Failed to reach invitation server. Invite code copied to clipboard!',
      });
      copyInviteCode(activeCode);
    } finally {
      setSendingInvite(false);
    }
  };

  // Copy code helper
  const copyInviteCode = (codeStr?: string) => {
    const target = codeStr || customInviteCode || 'FREEDOM-DEEP-WORK';
    navigator.clipboard.writeText(target);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Create New Team submit handler
  const handleCreateTeamSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeamName.trim() || !user?.uid) return;
    setCreatingTeam(true);

    try {
      const code = newTeamCode.trim().toUpperCase() || `FREEDOM-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
      const isAvail = await firestoreService.checkInviteCodeAvailable(code);
      if (!isAvail) {
        alert('This invite code is taken by another team. Please choose another.');
        setCreatingTeam(false);
        return;
      }

      const team = await firestoreService.createTeam(newTeamName, newTeamDesc, code, user.uid);
      setUserTeams((prev) => [...prev, team]);
      setSelectedTeam(team);
      setCustomInviteCode(team.inviteCode);
      setTeamMembers([user]);
      setIsCreateTeamOpen(false);
      setNewTeamName('');
      setNewTeamDesc('');
      setNewTeamCode('');
    } catch (err: any) {
      alert(`Failed to create team: ${err.message}`);
    } finally {
      setCreatingTeam(false);
    }
  };

  // Join Team submit handler
  const handleJoinTeamSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinCodeInput.trim() || !user?.uid) return;
    setJoiningTeam(true);
    setJoinStatus(null);

    const result = await firestoreService.joinTeamByCode(joinCodeInput, user.uid);
    if (result.success && result.team) {
      setJoinStatus({ type: 'success', text: result.message });
      setUserTeams((prev) => {
        if (prev.some((t) => t.id === result.team?.id)) return prev;
        return [...prev, result.team!];
      });
      setSelectedTeam(result.team);
      const members = await firestoreService.getTeamMembers(result.team.id);
      setTeamMembers(members);
      setTimeout(() => {
        setIsJoinTeamOpen(false);
        setJoinCodeInput('');
        setJoinStatus(null);
      }, 1500);
    } else {
      setJoinStatus({ type: 'error', text: result.message });
    }
    setJoiningTeam(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-[#2F6FED]">Social</span>
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100 mt-1">Leaderboards</h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Compare execution discipline with the global community, friends, and teams.
          </p>
        </div>

        {/* Tab Controls */}
        <Tabs
          variant="retro"
          activeId={activeTab}
          onChange={(id) => setActiveTab(id as any)}
          items={[
            { id: 'global', label: 'Global' },
            { id: 'friends', label: 'Friends' },
            { id: 'teams', label: 'Teams' },
          ]}
        />
      </div>

      {/* GLOBAL TAB */}
      {activeTab === 'global' && (
        <Card variant="default" className="p-0 overflow-hidden bg-white dark:bg-[#18181B] border border-[#E5E5E5] dark:border-[#27272A] rounded-2xl">
          <div className="p-4 bg-[#FAFAFA] dark:bg-zinc-900 border-b border-[#E5E5E5] dark:border-[#27272A] flex items-center justify-between text-xs font-mono text-zinc-500 dark:text-zinc-400">
            <span>Rank & Member</span>
            <div className="flex items-center gap-12 mr-4">
              <span>Current Streak</span>
              <span>Total Productive</span>
            </div>
          </div>
          {loading ? (
            <div className="p-8 text-center text-xs text-zinc-400">Loading rankings...</div>
          ) : (
            <div className="divide-y divide-black/5 dark:divide-white/10">
              {users.map((u, idx) => {
                const isCurrentUser = user?.uid === u.uid;
                const hours = Math.floor((u.publicStats?.totalProductiveMinutes || 0) / 60);
                const avatar = u.avatarUrl || getDicebearAvatar(u.username || u.uid);

                return (
                  <div
                    key={u.uid || idx}
                    className={`p-4 flex items-center justify-between transition-colors ${
                      isCurrentUser ? 'bg-[#EAF1FE]/40 dark:bg-blue-950/30' : 'hover:bg-neutral-50 dark:hover:bg-zinc-800/50'
                    }`}
                  >
                    <div className="flex items-center gap-4 min-w-0 pr-4">
                      <span className="font-mono text-sm font-bold text-zinc-400 dark:text-zinc-500 w-6">
                        #{idx + 1}
                      </span>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={avatar}
                        alt={u.displayName}
                        className="w-10 h-10 rounded-full border border-black/10 bg-white object-cover shadow-2xs shrink-0"
                      />
                      <div className="truncate">
                        <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5 truncate">
                          <span>{u.displayName || 'Freedom User'}</span>
                          {isCurrentUser && (
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-semibold bg-[#2F6FED] text-white">
                              YOU
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-zinc-500 dark:text-zinc-400 font-mono truncate">
                          @{u.username || 'user'}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-12 mr-4 shrink-0 font-mono text-xs">
                      <div className="flex items-center gap-1 text-[#1FAE6B] dark:text-emerald-400 font-semibold w-16">
                        <Flame className="w-3.5 h-3.5 text-amber-500" />
                        <span>{u.publicStats?.currentStreak || 0}d</span>
                      </div>
                      <div className="font-bold text-zinc-900 dark:text-zinc-100 w-16 text-right">{hours}h</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      )}

      {/* FRIENDS TAB */}
      {activeTab === 'friends' && (
        <Card variant="default" className="p-8 text-center space-y-4 bg-white dark:bg-[#18181B] border border-[#E5E5E5] dark:border-[#27272A] rounded-2xl">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-[#2F6FED] flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">Friends Leaderboard</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 max-w-sm mx-auto">
              Follow your friends and accountability partners to compete on execution consistency.
            </p>
          </div>
          <div className="pt-2">
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsInviteOpen(true)}
              className="inline-flex items-center gap-2 bg-[#2F6FED] text-white hover:bg-[#2558BE]"
            >
              <UserPlus className="w-4 h-4" />
              <span>Invite Friends to Freedom</span>
            </Button>
          </div>
        </Card>
      )}

      {/* TEAMS TAB */}
      {activeTab === 'teams' && (
        <div className="space-y-6">
          {/* Multi-Team Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-white dark:bg-[#18181B] border border-[#E5E5E5] dark:border-[#27272A] rounded-2xl">
            {/* Active Teams Selector Pills */}
            <div className="flex items-center gap-2 overflow-x-auto py-1">
              {userTeams.length > 0 ? (
                userTeams.map((team) => (
                  <button
                    key={team.id}
                    type="button"
                    onClick={() => handleSelectTeam(team)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                      selectedTeam?.id === team.id
                        ? 'bg-[#2F6FED] text-white shadow-xs'
                        : 'bg-neutral-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-neutral-200'
                    }`}
                  >
                    <Users className="w-3.5 h-3.5" />
                    <span>{team.name}</span>
                  </button>
                ))
              ) : (
                <span className="text-xs text-zinc-500">No teams created yet.</span>
              )}
            </div>

            {/* Actions: Create Team & Join Team */}
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setIsJoinTeamOpen(true)}
                className="flex items-center gap-1.5 text-xs"
              >
                <LogIn className="w-3.5 h-3.5 text-[#2F6FED]" />
                <span>Join Team</span>
              </Button>

              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  generateRandomCode(setNewTeamCode);
                  setIsCreateTeamOpen(true);
                }}
                className="flex items-center gap-1.5 bg-[#2F6FED] hover:bg-[#2558BE] text-white text-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create Team</span>
              </Button>

              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsInviteOpen(true)}
                className="flex items-center gap-1.5 bg-[#1FAE6B] hover:bg-emerald-600 text-white text-xs"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Invite Teammates</span>
              </Button>
            </div>
          </div>

          {/* Active Selected Team Card */}
          {selectedTeam ? (
            <Card variant="default" className="p-6 bg-white dark:bg-[#18181B] border border-[#E5E5E5] dark:border-[#27272A] rounded-2xl space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-black/5 dark:border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-[#2F6FED] flex items-center justify-center shrink-0">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">{selectedTeam.name}</h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">{selectedTeam.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 bg-neutral-50 dark:bg-zinc-800 p-2 rounded-xl border border-neutral-200 dark:border-zinc-700">
                  <span className="text-[11px] font-mono text-zinc-500">Invite Code:</span>
                  <span className="font-mono font-bold text-xs text-zinc-900 dark:text-zinc-100">{selectedTeam.inviteCode}</span>
                  <button
                    type="button"
                    onClick={() => copyInviteCode(selectedTeam.inviteCode)}
                    className="p-1 text-[#2F6FED] hover:text-[#2558BE] cursor-pointer"
                    title="Copy Invite Code"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Team Members List */}
              <div className="space-y-2">
                <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-500">Team Roster & Focus Leaderboard</h4>
                <div className="divide-y divide-black/5 dark:divide-white/10 rounded-xl border border-black/5 dark:border-white/10 overflow-hidden">
                  {(teamMembers.length > 0 ? teamMembers : [user].filter(Boolean) as User[]).map((u, idx) => (
                    <div key={u.uid} className="p-3.5 flex items-center justify-between bg-white dark:bg-zinc-900">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs text-zinc-400 font-bold">#{idx + 1}</span>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={u.avatarUrl || getDicebearAvatar(u.username || u.uid)} alt="" className="w-8 h-8 rounded-full border border-black/10" />
                        <div>
                          <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100">{u.displayName}</div>
                          <div className="text-[10px] font-mono text-zinc-400">@{u.username}</div>
                        </div>
                      </div>
                      <div className="font-mono text-xs font-bold text-[#2F6FED]">
                        {Math.floor((u.publicStats?.totalProductiveMinutes || 0) / 60)}h productive
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          ) : (
            <Card variant="default" className="p-8 text-center bg-white dark:bg-[#18181B] border border-[#E5E5E5] dark:border-[#27272A] rounded-2xl">
              <Users className="w-8 h-8 text-[#2F6FED] mx-auto mb-2 opacity-60" />
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">No active team selected</h3>
              <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">Create a new team or join an existing team using a shared invite code.</p>
            </Card>
          )}
        </div>
      )}

      {/* MODAL 1: Invite Teammate via Email (With Customizable Code) */}
      <Modal
        isOpen={isInviteOpen}
        onClose={() => {
          setIsInviteOpen(false);
          setInviteStatus(null);
        }}
        title="Invite Teammate via Email"
        description="Send an email invite or share your custom team invite code."
      >
        <div className="space-y-4 pt-2">
          {inviteStatus && (
            <div
              className={`p-3 rounded-xl text-xs flex items-start gap-2 ${
                inviteStatus.type === 'success'
                  ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                  : 'bg-red-50 border border-red-200 text-red-800'
              }`}
            >
              {inviteStatus.type === 'success' ? (
                <Check className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
              )}
              <span>{inviteStatus.text}</span>
            </div>
          )}

          <form onSubmit={handleSendInvite} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
                Recipient Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-2.5 text-neutral-400 dark:text-zinc-500" />
                <input
                  type="email"
                  required
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="colleague@company.com"
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#E5E5E5] dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-xs focus:outline-none focus:border-[#2F6FED]"
                />
              </div>
            </div>

            {/* Customizable Team Invite Code Field */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                  Custom Team Invite Code
                </label>
                <button
                  type="button"
                  onClick={() => {
                    generateRandomCode((code) => {
                      setCustomInviteCode(code);
                      verifyCode(code);
                    });
                  }}
                  className="text-[11px] text-[#2F6FED] font-medium hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Shuffle className="w-3 h-3" />
                  <span>🎲 Generate Code</span>
                </button>
              </div>
              <div className="relative flex items-center gap-2">
                <input
                  type="text"
                  required
                  value={customInviteCode}
                  onChange={(e) => {
                    const uppercaseVal = e.target.value.toUpperCase();
                    setCustomInviteCode(uppercaseVal);
                    verifyCode(uppercaseVal);
                  }}
                  placeholder="FREEDOM-TEAM-CODE"
                  className="w-full px-3 py-2 rounded-xl border border-[#E5E5E5] dark:border-zinc-700 bg-white dark:bg-zinc-800 font-mono font-bold text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-[#2F6FED]"
                />
                <button
                  type="button"
                  onClick={() => copyInviteCode()}
                  className="p-2 rounded-xl bg-neutral-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 hover:bg-neutral-200 text-xs font-medium cursor-pointer shrink-0"
                  title="Copy Code"
                >
                  {copiedCode ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              {/* Uniqueness status helper */}
              <div className="mt-1 text-[11px] font-mono">
                {codeChecking ? (
                  <span className="text-zinc-400">Checking availability...</span>
                ) : codeAvailable === true ? (
                  <span className="text-emerald-600 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> ✓ Invite code is available!
                  </span>
                ) : codeAvailable === false ? (
                  <span className="text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> ✗ Code taken by another team. Choose another.
                  </span>
                ) : null}
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={sendingInvite || codeAvailable === false}
              className="w-full flex items-center justify-center gap-2 bg-[#2F6FED] hover:bg-[#2558BE] text-white disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{sendingInvite ? 'Sending Invite...' : 'Send Invitation Email'}</span>
            </Button>
          </form>
        </div>
      </Modal>

      {/* MODAL 2: Create New Team */}
      <Modal
        isOpen={isCreateTeamOpen}
        onClose={() => setIsCreateTeamOpen(false)}
        title="Create a New Team"
        description="Form an execution team and invite colleagues to track deep work."
      >
        <form onSubmit={handleCreateTeamSubmit} className="space-y-4 pt-2">
          <div>
            <label className="block text-xs font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
              Team Name
            </label>
            <input
              type="text"
              required
              value={newTeamName}
              onChange={(e) => setNewTeamName(e.target.value)}
              placeholder="e.g. Freedom Core Engineering"
              className="w-full px-3 py-2 rounded-xl border border-[#E5E5E5] dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-xs focus:outline-none focus:border-[#2F6FED]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
              Team Description
            </label>
            <textarea
              rows={2}
              value={newTeamDesc}
              onChange={(e) => setNewTeamDesc(e.target.value)}
              placeholder="What does your team build?"
              className="w-full px-3 py-2 rounded-xl border border-[#E5E5E5] dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-xs focus:outline-none focus:border-[#2F6FED]"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                Custom Invite Code
              </label>
              <button
                type="button"
                onClick={() => {
                  generateRandomCode((code) => {
                    setNewTeamCode(code);
                    verifyCode(code, true);
                  });
                }}
                className="text-[11px] text-[#2F6FED] font-medium hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Shuffle className="w-3 h-3" />
                <span>🎲 Random Code</span>
              </button>
            </div>
            <input
              type="text"
              required
              value={newTeamCode}
              onChange={(e) => {
                const code = e.target.value.toUpperCase();
                setNewTeamCode(code);
                verifyCode(code, true);
              }}
              placeholder="FREEDOM-DEEPWORK"
              className="w-full px-3 py-2 rounded-xl border border-[#E5E5E5] dark:border-zinc-700 bg-white dark:bg-zinc-800 font-mono font-bold text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-[#2F6FED]"
            />
            {newTeamCodeAvailable === true && (
              <span className="text-[11px] text-emerald-600 font-mono mt-1 block">✓ Code available!</span>
            )}
            {newTeamCodeAvailable === false && (
              <span className="text-[11px] text-red-500 font-mono mt-1 block">✗ Code taken by another team.</span>
            )}
          </div>

          <Button
            type="submit"
            variant="primary"
            size="md"
            disabled={creatingTeam || newTeamCodeAvailable === false}
            className="w-full flex items-center justify-center gap-2 bg-[#2F6FED] hover:bg-[#2558BE] text-white disabled:opacity-50"
          >
            <Plus className="w-4 h-4" />
            <span>{creatingTeam ? 'Creating Team...' : 'Create Team'}</span>
          </Button>
        </form>
      </Modal>

      {/* MODAL 3: Join Team by Code */}
      <Modal
        isOpen={isJoinTeamOpen}
        onClose={() => {
          setIsJoinTeamOpen(false);
          setJoinStatus(null);
        }}
        title="Join an Existing Team"
        description="Enter a team's custom invite code to join their focus leaderboard."
      >
        <form onSubmit={handleJoinTeamSubmit} className="space-y-4 pt-2">
          {joinStatus && (
            <div
              className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                joinStatus.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}
            >
              {joinStatus.type === 'success' ? <Check className="w-4 h-4 text-emerald-600 shrink-0" /> : <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />}
              <span>{joinStatus.text}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
              Team Invite Code
            </label>
            <input
              type="text"
              required
              value={joinCodeInput}
              onChange={(e) => setJoinCodeInput(e.target.value.toUpperCase())}
              placeholder="FREEDOM-DEEP-WORK"
              className="w-full px-3 py-2 rounded-xl border border-[#E5E5E5] dark:border-zinc-700 bg-white dark:bg-zinc-800 font-mono font-bold text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-[#2F6FED]"
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="md"
            disabled={joiningTeam || !joinCodeInput.trim()}
            className="w-full flex items-center justify-center gap-2 bg-[#2F6FED] hover:bg-[#2558BE] text-white disabled:opacity-50"
          >
            <LogIn className="w-4 h-4" />
            <span>{joiningTeam ? 'Joining Team...' : 'Join Team'}</span>
          </Button>
        </form>
      </Modal>
    </div>
  );
}

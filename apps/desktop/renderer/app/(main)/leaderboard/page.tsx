'use client';

import React, { useState, useEffect, useCallback } from 'react';
import type { User, Team, TeamInvitation, FriendRequest, Competition } from '@freedom/firestore-schema';
import { useSessionStore } from '../../../stores/useSessionStore';
import { firestoreService, getDicebearAvatar, getTimezoneCountryFlag } from '../../../lib/firebase';
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
  Swords,
  UserCheck,
  UserX,
  Timer,
  Trash2,
  Lock,
} from 'lucide-react';

function getCrownBadge(rank: number, totalParticipants: number) {
  if (totalParticipants < 2) return null;
  if (totalParticipants === 2) {
    if (rank === 1) return { type: 'gold', label: 'Gold Crown', icon: '👑', color: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-300 dark:border-amber-700' };
    if (rank === 2) return { type: 'silver', label: 'Silver Crown', icon: '🥈', color: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-300 dark:border-slate-600' };
    return null;
  }
  if (totalParticipants >= 3 && totalParticipants <= 4) {
    if (rank === 1) return { type: 'gold', label: 'Gold Crown', icon: '👑', color: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-300 dark:border-amber-700' };
    if (rank === 2) return { type: 'silver', label: 'Silver Crown', icon: '🥈', color: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-300 dark:border-slate-600' };
    if (rank === 3) return { type: 'bronze', label: 'Bronze Crown', icon: '🥉', color: 'bg-amber-900/10 text-amber-900 dark:bg-amber-950/40 dark:text-amber-400 border-amber-800/30' };
    return null;
  }
  if (totalParticipants >= 5) {
    if (rank === 1) return { type: 'diamond', label: 'Diamond Crown', icon: '💎', color: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-950/60 dark:text-cyan-300 border-cyan-300 dark:border-cyan-700 font-bold' };
    if (rank === 2) return { type: 'gold', label: 'Gold Crown', icon: '👑', color: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-300 dark:border-amber-700' };
    if (rank === 3) return { type: 'silver', label: 'Silver Crown', icon: '🥈', color: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-300 dark:border-slate-600' };
    if (rank === 4) return { type: 'bronze', label: 'Bronze Crown', icon: '🥉', color: 'bg-amber-900/10 text-amber-900 dark:bg-amber-950/40 dark:text-amber-400 border-amber-800/30' };
    return null;
  }
  return null;
}

export default function LeaderboardPage() {
  const { user } = useSessionStore();
  const [activeTab, setActiveTab] = useState<'global' | 'friends' | 'teams' | 'competitions'>('global');

  // Invite modal state
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteType, setInviteType] = useState<'friend' | 'team'>('friend');
  const [inviteEmail, setInviteEmail] = useState('');
  const [customInviteCode, setCustomInviteCode] = useState('FREEDOM-DEEP-WORK');
  const [codeChecking, setCodeChecking] = useState(false);
  const [codeAvailable, setCodeAvailable] = useState<boolean | null>(true);
  const [inviteStatus, setInviteStatus] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [sendingInvite, setSendingInvite] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // Friends & Requests state
  const [friends, setFriends] = useState<User[]>([]);
  const [pendingRequests, setPendingRequests] = useState<FriendRequest[]>([]);
  const [loadingFriends, setLoadingFriends] = useState(false);

  // Teams state
  const [userTeams, setUserTeams] = useState<Team[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [teamMembers, setTeamMembers] = useState<User[]>([]);
  const [pendingTeamInvites, setPendingTeamInvites] = useState<TeamInvitation[]>([]);
  const [isCreateTeamOpen, setIsCreateTeamOpen] = useState(false);
  const [teamInviteMethod, setTeamInviteMethod] = useState<'code' | 'emails'>('code');
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamDesc, setNewTeamDesc] = useState('');
  const [newTeamCode, setNewTeamCode] = useState('');
  const [newTeamEmailsInput, setNewTeamEmailsInput] = useState('');
  const [newTeamCodeAvailable, setNewTeamCodeAvailable] = useState<boolean | null>(null);
  const [creatingTeam, setCreatingTeam] = useState(false);

  // Join Team state
  const [isJoinTeamOpen, setIsJoinTeamOpen] = useState(false);
  const [joinCodeInput, setJoinCodeInput] = useState('');
  const [joiningTeam, setJoiningTeam] = useState(false);
  const [joinStatus, setJoinStatus] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Competitions state
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [isCreateCompOpen, setIsCreateCompOpen] = useState(false);
  const [compName, setCompName] = useState('');
  const [compDesc, setCompDesc] = useState('');
  const [compScope, setCompScope] = useState<'global' | 'friends' | 'team'>('friends');
  const [compSelectedTeamId, setCompSelectedTeamId] = useState<string>('');
  const [compMetric, setCompMetric] = useState<'streak' | 'productive_hours'>('productive_hours');
  const [compDurationUnit, setCompDurationUnit] = useState<'hours' | 'days'>('hours');
  const [compDurationVal, setCompDurationVal] = useState<number>(24);
  const [creatingComp, setCreatingComp] = useState(false);

  // Users rankings state
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Load global users, friends, teams, competitions
  const loadData = useCallback(async () => {
    setLoading(true);

    if (user?.uid) {
      await firestoreService.syncUserStats(user.uid);
    }

    const realUsers = await firestoreService.getLeaderboardUsers();
    if (realUsers.length > 0) {
      setUsers(realUsers);
    } else {
      const seedUsers: User[] = [
        {
          uid: 'u-1',
          displayName: 'Elena Vance',
          username: 'elena_v',
          timezone: 'Europe/London',
          dailyGoalMinutes: 300,
          theme: 'light',
          leaderboardOptIn: true,
          avatarUrl: getDicebearAvatar('elena_v'),
          countryFlag: '🇬🇧',
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
          timezone: 'America/New_York',
          dailyGoalMinutes: 240,
          theme: 'light',
          leaderboardOptIn: true,
          avatarUrl: getDicebearAvatar('marcus_c'),
          countryFlag: '🇺🇸',
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
      // Load Friends
      setLoadingFriends(true);
      const friendsList = await firestoreService.getFriendsLeaderboard(user.uid);
      setFriends(friendsList);

      const requests = await firestoreService.getPendingFriendRequests(user.email || user.uid);
      setPendingRequests(requests);
      setLoadingFriends(false);

      // Load Teams
      const teams = await firestoreService.getUserTeams(user.uid);
      setUserTeams(teams);
      if (teams.length > 0) {
        if (!selectedTeam) setSelectedTeam(teams[0]);
        setCompSelectedTeamId(teams[0].id);
        const members = await firestoreService.getTeamMembers(teams[0].id);
        setTeamMembers(members);
      }

      // Load Pending Team Invitations
      if (user.email) {
        const teamInvs = await firestoreService.getPendingTeamInvitations(user.email);
        setPendingTeamInvites(teamInvs);
      }

      // Load Competitions
      const compList = await firestoreService.getCompetitions(user.uid);
      setCompetitions(compList);
    }
    setLoading(false);
  }, [user, selectedTeam]);

  // Handle Accepting Pending Team Invite
  const handleAcceptTeamInvite = async (inv: TeamInvitation) => {
    if (!user?.uid) return;
    const res = await firestoreService.acceptTeamInvitation(inv, user.uid);
    alert(res.message);
    if (res.success && res.team) {
      setSelectedTeam(res.team);
    }
    loadData();
  };

  // Handle Removing Member from Team (Owner ONLY)
  const handleRemoveTeamMember = async (targetUserId: string) => {
    if (!selectedTeam || !user?.uid) return;
    if (selectedTeam.ownerId !== user.uid) {
      alert('Only the team owner can remove members.');
      return;
    }
    if (targetUserId === user.uid) {
      alert('Team owner cannot be removed from their own team.');
      return;
    }
    if (!confirm('Are you sure you want to remove this member from your team?')) return;

    const ok = await firestoreService.removeTeamMember(selectedTeam.id, targetUserId);
    if (ok) {
      // Re-query fresh team members from Firestore to guarantee UI sync
      const freshMembers = await firestoreService.getTeamMembers(selectedTeam.id);
      setTeamMembers(freshMembers);
      alert('Member successfully removed from team.');
    } else {
      alert('Failed to remove member from team.');
    }
  };

  // Handle Deleting Team (Owner ONLY)
  const handleDeleteTeam = async () => {
    if (!selectedTeam || !user?.uid) return;
    if (selectedTeam.ownerId !== user.uid) {
      alert('Only the team owner can delete this team.');
      return;
    }
    if (!confirm(`Are you sure you want to delete team "${selectedTeam.name}"? This action is permanent and will remove all members and invitations.`)) {
      return;
    }

    const res = await firestoreService.deleteTeam(selectedTeam.id, user.uid);
    alert(res.message);
    if (res.success) {
      const remainingTeams = userTeams.filter((t) => t.id !== selectedTeam.id);
      setUserTeams(remainingTeams);
      if (remainingTeams.length > 0) {
        setSelectedTeam(remainingTeams[0]);
        setCustomInviteCode(remainingTeams[0].inviteCode);
        const members = await firestoreService.getTeamMembers(remainingTeams[0].id);
        setTeamMembers(members);
      } else {
        setSelectedTeam(null);
        setTeamMembers([]);
      }
      loadData();
    }
  };

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

  // Handle accept friend request
  const handleAcceptFriendRequest = async (reqId: string) => {
    if (!user?.uid) return;
    const success = await firestoreService.acceptFriendRequest(reqId, user.uid);
    if (success) {
      setPendingRequests((prev) => prev.filter((r) => r.id !== reqId));
      const updatedFriends = await firestoreService.getFriendsLeaderboard(user.uid);
      setFriends(updatedFriends);
    }
  };

  // Handle decline friend request
  const handleDeclineFriendRequest = async (reqId: string) => {
    const success = await firestoreService.declineFriendRequest(reqId);
    if (success) {
      setPendingRequests((prev) => prev.filter((r) => r.id !== reqId));
    }
  };

  // Handle send email invitation
  const handleSendInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim() || !user) return;

    setSendingInvite(true);
    setInviteStatus(null);

    const targetEmail = inviteEmail.trim().toLowerCase();
    const activeCode = customInviteCode.trim().toUpperCase() || 'FREEDOM-DEEP-WORK';

    try {
      let isExistingUser = false;

      if (inviteType === 'friend') {
        const friendResult = await firestoreService.sendFriendInvite(user, targetEmail);
        if (!friendResult.success) {
          setInviteStatus({ type: 'error', text: friendResult.message });
          setSendingInvite(false);
          return;
        }
        isExistingUser = friendResult.isExistingUser;
      } else {
        // Team invite
        const inv: TeamInvitation = {
          id: `inv_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
          teamId: selectedTeam?.id || 'default_team',
          teamName: selectedTeam?.name || 'Freedom Execution Team',
          inviteCode: activeCode,
          recipientEmail: targetEmail,
          senderId: user.uid,
          senderName: user.displayName || 'Freedom User',
          status: 'pending',
          createdAt: new Date().toISOString(),
        };
        await firestoreService.saveTeamInvitation(inv);
        isExistingUser = false;
      }

      // Send Email via Electron IPC if available, fallback to Next fetch
      let emailResult = { success: false, message: '' };

      if (typeof window !== 'undefined' && window.freedom?.invite) {
        emailResult = await window.freedom.invite.sendEmail({
          recipientEmail: targetEmail,
          senderName: user.displayName || 'Timothy',
          inviteType,
          teamName: selectedTeam?.name || 'Freedom Execution Team',
          inviteCode: activeCode,
          isExistingUser,
          downloadUrl: 'https://freedom-mac.vercel.app/',
        });
      } else {
        const res = await fetch('/api/invite', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            recipientEmail: targetEmail,
            teamName: selectedTeam?.name || 'Freedom Execution Team',
            inviteCode: activeCode,
            senderName: user.displayName || 'Timothy',
            isExistingUser,
          }),
        });
        emailResult = await res.json();
      }

      if (emailResult.success) {
        setInviteStatus({
          type: 'success',
          text: `Invitation email successfully sent to ${targetEmail}!`,
        });
      } else {
        copyInviteCode(activeCode);
        setInviteStatus({
          type: 'info',
          text: `Invite created for ${targetEmail}! Code ${activeCode} copied to clipboard.`,
        });
      }
      setInviteEmail('');
    } catch (err: any) {
      setInviteStatus({
        type: 'error',
        text: err.message || 'Failed to process invitation.',
      });
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

      // If user provided email list option, send emails to all listed recipients
      if (teamInviteMethod === 'emails' && newTeamEmailsInput.trim()) {
        const rawEmails = newTeamEmailsInput.split(/[\n,;]+/).map((e) => e.trim().toLowerCase()).filter(Boolean);
        const uniqueEmails = Array.from(new Set(rawEmails));

        for (const email of uniqueEmails) {
          const inv: TeamInvitation = {
            id: `inv_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
            teamId: team.id,
            teamName: team.name,
            inviteCode: team.inviteCode,
            recipientEmail: email,
            senderId: user.uid,
            senderName: user.displayName || 'Timothy',
            status: 'pending',
            createdAt: new Date().toISOString(),
          };
          await firestoreService.saveTeamInvitation(inv);

          if (typeof window !== 'undefined' && window.freedom?.invite) {
            await window.freedom.invite.sendEmail({
              recipientEmail: email,
              senderName: user.displayName || 'Timothy',
              inviteType: 'team',
              teamName: team.name,
              inviteCode: team.inviteCode,
              downloadUrl: 'https://freedom-mac.vercel.app/',
            });
          }
        }
      }

      setIsCreateTeamOpen(false);
      setNewTeamName('');
      setNewTeamDesc('');
      setNewTeamCode('');
      setNewTeamEmailsInput('');
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

  // Create Competition Submit Handler
  const handleCreateCompSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!compName.trim() || !user?.uid) return;

    if (compScope === 'team' && userTeams.length === 0) {
      alert('You do not belong to any team yet. Please create or join a team first!');
      return;
    }

    setCreatingComp(true);

    try {
      const now = new Date();
      const end = new Date(now);
      if (compDurationUnit === 'hours') {
        end.setHours(end.getHours() + compDurationVal);
      } else {
        end.setDate(end.getDate() + compDurationVal);
      }

      // Target team selection
      const targetTeam = userTeams.find((t) => t.id === compSelectedTeamId) || selectedTeam || userTeams[0];

      let participants: string[] = [user.uid];
      if (compScope === 'friends') {
        friends.forEach((f) => participants.push(f.uid));
      } else if (compScope === 'team' && targetTeam) {
        const members = await firestoreService.getTeamMembers(targetTeam.id);
        members.forEach((m) => participants.push(m.uid));
      }

      const comp = await firestoreService.createCompetition({
        name: compName.trim(),
        description: compDesc.trim() || 'A Freedom execution sprint competition.',
        scope: compScope,
        teamId: compScope === 'team' ? targetTeam?.id : undefined,
        metric: compMetric,
        durationUnit: compDurationUnit,
        durationValue: compDurationVal,
        startDate: now.toISOString(),
        endDate: end.toISOString(),
        createdBy: user.uid,
        createdByName: user.displayName || 'Timothy',
        participantUids: Array.from(new Set(participants)),
      });

      setCompetitions((prev) => [comp, ...prev]);
      setIsCreateCompOpen(false);
      setCompName('');
      setCompDesc('');
    } catch (err: any) {
      alert(`Failed to create competition: ${err.message}`);
    } finally {
      setCreatingComp(false);
    }
  };

  const isTeamOwner = user?.uid && selectedTeam?.ownerId === user.uid;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
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
            { id: 'competitions', label: 'Competitions' },
          ]}
        />
      </div>

      {/* GLOBAL TAB */}
      {activeTab === 'global' && (
        <Card variant="default" data-tour="leaderboard-table-card" className="p-0 overflow-hidden bg-white dark:bg-[#18181B] border border-[#E5E5E5] dark:border-[#27272A] rounded-2xl">
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
                const rank = idx + 1;
                const isCurrentUser = user?.uid === u.uid;
                const hours = Math.floor((u.publicStats?.totalProductiveMinutes || 0) / 60);
                const avatar = u.avatarUrl || getDicebearAvatar(u.username || u.uid);
                const crown = getCrownBadge(rank, users.length);
                const countryFlag = u.countryFlag || getTimezoneCountryFlag(u.timezone);

                return (
                  <div
                    key={u.uid || idx}
                    className={`p-4 flex items-center justify-between transition-colors ${
                      isCurrentUser ? 'bg-[#EAF1FE]/40 dark:bg-blue-950/30' : 'hover:bg-neutral-50 dark:hover:bg-zinc-800/50'
                    }`}
                  >
                    <div className="flex items-center gap-3.5 min-w-0 pr-4">
                      <span className="font-mono text-sm font-bold text-zinc-400 dark:text-zinc-500 w-6">
                        #{rank}
                      </span>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={avatar}
                        alt={u.displayName}
                        className="w-10 h-10 rounded-full border border-black/10 bg-white object-cover shadow-2xs shrink-0"
                      />
                      <div className="truncate">
                        <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5 truncate">
                          <span className="text-base leading-none">{countryFlag}</span>
                          <span>{u.displayName || 'Freedom User'}</span>
                          {isCurrentUser && (
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-semibold bg-[#2F6FED] text-white">
                              YOU
                            </span>
                          )}
                          {crown && (
                            <span className={`px-1.5 py-0.5 rounded-full border text-[10px] flex items-center gap-1 shrink-0 ${crown.color}`}>
                              <span>{crown.icon}</span>
                              <span className="font-mono">{crown.label}</span>
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
        <div className="space-y-6">
          {/* Pending Requests Banner */}
          {pendingRequests.length > 0 && (
            <Card variant="surface" className="p-4 bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-2xl space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-900 dark:text-amber-200 uppercase font-mono tracking-wider">
                <Mail className="w-4 h-4 text-amber-600" />
                <span>Pending Friend Requests ({pendingRequests.length})</span>
              </div>
              <div className="space-y-2">
                {pendingRequests.map((req) => (
                  <div key={req.id} className="p-3 bg-white dark:bg-zinc-900 rounded-xl border border-amber-200 dark:border-amber-800/40 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={req.senderAvatarUrl || getDicebearAvatar(req.senderName)} alt="" className="w-8 h-8 rounded-full border shrink-0" />
                      <div className="truncate">
                        <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate">{req.senderName}</div>
                        <div className="text-[10px] text-zinc-400 font-mono truncate">{req.senderEmail}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleAcceptFriendRequest(req.id)}
                        className="px-3 py-1.5 rounded-lg bg-[#1FAE6B] hover:bg-emerald-600 text-white text-xs font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>Accept</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeclineFriendRequest(req.id)}
                        className="px-2 py-1.5 rounded-lg bg-neutral-100 dark:bg-zinc-800 text-zinc-600 hover:text-red-500 text-xs font-medium cursor-pointer"
                      >
                        <UserX className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Action Toolbar */}
          <div className="flex items-center justify-between p-4 bg-white dark:bg-[#18181B] border border-[#E5E5E5] dark:border-[#27272A] rounded-2xl">
            <div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Friends Leaderboard</h3>
              <p className="text-xs text-zinc-500">Track execution output with your connected accountability partners.</p>
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                setInviteType('friend');
                setIsInviteOpen(true);
              }}
              className="flex items-center gap-2 bg-[#2F6FED] hover:bg-[#2558BE] text-white text-xs"
            >
              <UserPlus className="w-4 h-4" />
              <span>Invite Friends</span>
            </Button>
          </div>

          {/* Friends List Card */}
          <Card variant="default" className="p-0 overflow-hidden bg-white dark:bg-[#18181B] border border-[#E5E5E5] dark:border-[#27272A] rounded-2xl">
            <div className="p-4 bg-[#FAFAFA] dark:bg-zinc-900 border-b border-[#E5E5E5] dark:border-[#27272A] flex items-center justify-between text-xs font-mono text-zinc-500">
              <span>Rank & Member</span>
              <div className="flex items-center gap-12 mr-4">
                <span>Current Streak</span>
                <span>Total Productive</span>
              </div>
            </div>
            {loadingFriends ? (
              <div className="p-8 text-center text-xs text-zinc-400">Loading friends...</div>
            ) : friends.length > 0 ? (
              <div className="divide-y divide-black/5 dark:divide-white/10">
                {friends.map((u, idx) => {
                  const rank = idx + 1;
                  const isCurrentUser = user?.uid === u.uid;
                  const hours = Math.floor((u.publicStats?.totalProductiveMinutes || 0) / 60);
                  const crown = getCrownBadge(rank, friends.length);
                  const countryFlag = u.countryFlag || getTimezoneCountryFlag(u.timezone);

                  return (
                    <div
                      key={u.uid}
                      className={`p-4 flex items-center justify-between transition-colors ${
                        isCurrentUser ? 'bg-[#EAF1FE]/40 dark:bg-blue-950/30' : 'hover:bg-neutral-50 dark:hover:bg-zinc-800/50'
                      }`}
                    >
                      <div className="flex items-center gap-3.5 min-w-0 pr-4">
                        <span className="font-mono text-sm font-bold text-zinc-400 w-6">#{rank}</span>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={u.avatarUrl || getDicebearAvatar(u.username || u.uid)} alt="" className="w-10 h-10 rounded-full border object-cover shrink-0" />
                        <div className="truncate">
                          <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5 truncate">
                            <span className="text-base leading-none">{countryFlag}</span>
                            <span>{u.displayName}</span>
                            {isCurrentUser && <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-[#2F6FED] text-white">YOU</span>}
                            {crown && (
                              <span className={`px-1.5 py-0.5 rounded-full border text-[10px] flex items-center gap-1 shrink-0 ${crown.color}`}>
                                <span>{crown.icon}</span>
                                <span className="font-mono">{crown.label}</span>
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-zinc-500 font-mono">@{u.username}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-12 mr-4 shrink-0 font-mono text-xs">
                        <div className="flex items-center gap-1 text-[#1FAE6B] font-semibold w-16">
                          <Flame className="w-3.5 h-3.5 text-amber-500" />
                          <span>{u.publicStats?.currentStreak || 0}d</span>
                        </div>
                        <div className="font-bold text-zinc-900 dark:text-zinc-100 w-16 text-right">{hours}h</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-8 text-center space-y-2">
                <Users className="w-8 h-8 text-zinc-300 mx-auto" />
                <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">No friends added yet</h4>
                <p className="text-xs text-zinc-500 max-w-xs mx-auto">Invite friends by email to compare daily execution and earn dynamic crowns.</p>
              </div>
            )}
          </Card>
        </div>
      )}

      {/* TEAMS TAB */}
      {activeTab === 'teams' && (
        <div className="space-y-6">
          {/* Multi-Team Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-white dark:bg-[#18181B] border border-[#E5E5E5] dark:border-[#27272A] rounded-2xl" data-tour="leaderboard-team-card">
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
                onClick={() => {
                  setInviteType('team');
                  setIsInviteOpen(true);
                }}
                className="flex items-center gap-1.5 bg-[#1FAE6B] hover:bg-emerald-600 text-white text-xs"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Invite Teammates</span>
              </Button>
            </div>
          </div>

          {/* Pending Team Invitations Banner */}
          {pendingTeamInvites.length > 0 && (
            <Card variant="surface" className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl space-y-3">
              <h4 className="text-xs font-bold font-mono text-amber-700 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span>Pending Team Invitations ({pendingTeamInvites.length})</span>
              </h4>
              <div className="space-y-2">
                {pendingTeamInvites.map((inv) => (
                  <div key={inv.id} className="flex items-center justify-between p-3 bg-white dark:bg-zinc-900 rounded-xl border border-amber-500/20">
                    <div>
                      <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100">{inv.teamName}</div>
                      <div className="text-[11px] text-zinc-500">
                        Invited by <span className="font-semibold text-zinc-700 dark:text-zinc-300">{inv.senderName}</span> • Code: <span className="font-mono font-bold text-amber-600">{inv.inviteCode}</span>
                      </div>
                    </div>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleAcceptTeamInvite(inv)}
                      className="bg-[#1FAE6B] hover:bg-emerald-600 text-white text-xs px-3 py-1"
                    >
                      Accept & Join Team
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          )}

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

                {/* Invite Code & Delete Team - Restricted to Team Owner ONLY */}
                {isTeamOwner ? (
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="flex items-center gap-2 bg-neutral-50 dark:bg-zinc-800 p-2 rounded-xl border border-neutral-200 dark:border-zinc-700">
                      <span className="text-[11px] font-mono text-zinc-500">Invite Code (Admin):</span>
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

                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={handleDeleteTeam}
                      className="flex items-center gap-1.5 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 border border-red-200 dark:border-red-900/50"
                      title="Delete Team (Owner Only)"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete Team</span>
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-xs text-zinc-400 bg-neutral-100 dark:bg-zinc-800/50 px-3 py-1.5 rounded-xl border">
                    <Lock className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Invite code managed by Team Owner</span>
                  </div>
                )}
              </div>

              {/* Team Members List */}
              <div className="space-y-2">
                <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-500">Team Roster & Focus Leaderboard</h4>
                <div className="divide-y divide-black/5 dark:divide-white/10 rounded-xl border border-black/5 dark:border-white/10 overflow-hidden">
                  {(teamMembers.length > 0 ? teamMembers : [user].filter(Boolean) as User[]).map((u, idx) => {
                    const rank = idx + 1;
                    const crown = getCrownBadge(rank, teamMembers.length || 1);
                    const isMemberOwner = u.uid === selectedTeam.ownerId;
                    const countryFlag = u.countryFlag || getTimezoneCountryFlag(u.timezone);

                    return (
                      <div key={u.uid} className="p-3.5 flex items-center justify-between bg-white dark:bg-zinc-900">
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-xs text-zinc-400 font-bold">#{rank}</span>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={u.avatarUrl || getDicebearAvatar(u.username || u.uid)} alt="" className="w-8 h-8 rounded-full border border-black/10" />
                          <div>
                            <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                              <span className="text-base leading-none">{countryFlag}</span>
                              <span>{u.displayName}</span>
                              {isMemberOwner && (
                                <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-semibold bg-amber-500 text-white">
                                  OWNER
                                </span>
                              )}
                              {crown && (
                                <span className={`px-1.5 py-0.5 rounded-full border text-[9px] flex items-center gap-1 ${crown.color}`}>
                                  <span>{crown.icon}</span>
                                  <span>{crown.label}</span>
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] font-mono text-zinc-400">@{u.username}</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="font-mono text-xs font-bold text-[#2F6FED]">
                            {Math.floor((u.publicStats?.totalProductiveMinutes || 0) / 60)}h productive
                          </div>
                          {/* Remove member button for Team Owner */}
                          {isTeamOwner && !isMemberOwner && (
                            <button
                              type="button"
                              onClick={() => handleRemoveTeamMember(u.uid)}
                              className="p-1 text-zinc-400 hover:text-red-500 transition-colors cursor-pointer"
                              title="Remove member from team"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
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

      {/* COMPETITIONS TAB */}
      {activeTab === 'competitions' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-white dark:bg-[#18181B] border border-[#E5E5E5] dark:border-[#27272A] rounded-2xl">
            <div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <Swords className="w-4 h-4 text-amber-500" />
                <span>Lock-in Competitions</span>
              </h3>
              <p className="text-xs text-zinc-500">Create custom timed sprints (hours or days) and compete for Diamond, Gold, Silver & Bronze Crowns.</p>
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsCreateCompOpen(true)}
              className="flex items-center gap-2 bg-[#2F6FED] hover:bg-[#2558BE] text-white text-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Create Competition</span>
            </Button>
          </div>

          {competitions.length > 0 ? (
            <div className="space-y-4">
              {competitions.map((comp) => {
                const isExpired = new Date(comp.endDate).getTime() < Date.now();
                return (
                  <Card key={comp.id} variant="default" className="p-6 bg-white dark:bg-[#18181B] border border-[#E5E5E5] dark:border-[#27272A] rounded-2xl space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-black/5 dark:border-white/10 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-blue-50 text-[#2F6FED] border border-blue-200">
                            {comp.metric === 'streak' ? 'Streak Sprint' : 'Productivity Sprint'}
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-amber-50 text-amber-700 border border-amber-200">
                            {comp.durationValue} {comp.durationUnit}
                          </span>
                        </div>
                        <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mt-1">{comp.name}</h3>
                        <p className="text-xs text-zinc-500">{comp.description}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-[11px] font-mono text-zinc-400">Created by {comp.createdByName}</div>
                        <div className="text-xs font-mono font-bold text-[#2F6FED] flex items-center gap-1 mt-0.5">
                          <Timer className="w-3.5 h-3.5" />
                          <span>{isExpired ? 'Completed' : `Ends: ${new Date(comp.endDate).toLocaleDateString()}`}</span>
                        </div>
                      </div>
                    </div>

                    {/* Participant Rankings */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-mono font-semibold uppercase text-zinc-500">Participant Lock-in Leaderboard</h4>
                      <div className="divide-y divide-black/5 dark:divide-white/10 rounded-xl border border-black/5 dark:border-white/10 overflow-hidden">
                        {users
                          .filter((u) => comp.participantUids.includes(u.uid))
                          .map((u, idx) => {
                            const rank = idx + 1;
                            const crown = getCrownBadge(rank, comp.participantUids.length);
                            const countryFlag = u.countryFlag || getTimezoneCountryFlag(u.timezone);

                            return (
                              <div key={u.uid} className="p-3 flex items-center justify-between bg-white dark:bg-zinc-900">
                                <div className="flex items-center gap-3">
                                  <span className="font-mono text-xs font-bold text-zinc-400">#{rank}</span>
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img src={u.avatarUrl || getDicebearAvatar(u.username || u.uid)} alt="" className="w-7 h-7 rounded-full" />
                                  <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                                    <span className="text-base leading-none">{countryFlag}</span>
                                    <span>{u.displayName}</span>
                                    {crown && (
                                      <span className={`px-1.5 py-0.5 rounded-full border text-[9px] flex items-center gap-1 ${crown.color}`}>
                                        <span>{crown.icon}</span>
                                        <span>{crown.label}</span>
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <div className="font-mono text-xs font-bold text-[#2F6FED]">
                                  {comp.metric === 'streak'
                                    ? `${u.publicStats?.currentStreak || 0} days`
                                    : `${Math.floor((u.publicStats?.totalProductiveMinutes || 0) / 60)}h productive`}
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card variant="default" className="p-8 text-center bg-white dark:bg-[#18181B] border border-[#E5E5E5] dark:border-[#27272A] rounded-2xl space-y-2">
              <Swords className="w-8 h-8 text-amber-500 mx-auto opacity-70" />
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">No Active Competitions</h3>
              <p className="text-xs text-zinc-500 max-w-xs mx-auto">Create a sprint competition (e.g. 48-hour lock-in) with friends or teammates to compete for dynamic crowns.</p>
            </Card>
          )}
        </div>
      )}

      {/* MODAL 1: Invite Friends / Teammates via Email */}
      <Modal
        isOpen={isInviteOpen}
        onClose={() => {
          setIsInviteOpen(false);
          setInviteStatus(null);
        }}
        title={inviteType === 'friend' ? 'Invite Friend to Freedom' : 'Invite Teammate via Email'}
        description={inviteType === 'friend' ? 'Send a friend invite to compete on focus discipline.' : 'Send an email invite with custom team code.'}
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
                  placeholder="friend@company.com"
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#E5E5E5] dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-xs focus:outline-none focus:border-[#2F6FED]"
                />
              </div>
            </div>

            {inviteType === 'team' && (
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
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={sendingInvite}
              className="w-full flex items-center justify-center gap-2 bg-[#2F6FED] hover:bg-[#2558BE] text-white disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{sendingInvite ? 'Sending Invite...' : 'Send Invitation Email'}</span>
            </Button>
          </form>
        </div>
      </Modal>

      {/* MODAL 2: Create New Team with 2 Invite Options */}
      <Modal
        isOpen={isCreateTeamOpen}
        onClose={() => setIsCreateTeamOpen(false)}
        title="Create a New Team"
        description="Form an execution team and invite colleagues."
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

          {/* Invitation Method Toggle */}
          <div>
            <label className="block text-xs font-semibold text-zinc-900 dark:text-zinc-100 mb-1.5">
              Invitation Method
            </label>
            <div className="grid grid-cols-2 gap-2 p-1 bg-neutral-100 dark:bg-zinc-800 rounded-xl text-xs">
              <button
                type="button"
                onClick={() => setTeamInviteMethod('code')}
                className={`py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                  teamInviteMethod === 'code'
                    ? 'bg-white dark:bg-zinc-700 text-[#2F6FED] shadow-2xs'
                    : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
                }`}
              >
                Option 1: Invite Code
              </button>
              <button
                type="button"
                onClick={() => setTeamInviteMethod('emails')}
                className={`py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                  teamInviteMethod === 'emails'
                    ? 'bg-white dark:bg-zinc-700 text-[#2F6FED] shadow-2xs'
                    : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
                }`}
              >
                Option 2: Email List
              </button>
            </div>
          </div>

          {teamInviteMethod === 'code' ? (
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
            </div>
          ) : (
            <div>
              <label className="block text-xs font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
                Teammate Emails (Separated by commas or new lines)
              </label>
              <textarea
                rows={3}
                required
                value={newTeamEmailsInput}
                onChange={(e) => setNewTeamEmailsInput(e.target.value)}
                placeholder="alex@company.com, sarah@company.com, john@company.com"
                className="w-full px-3 py-2 rounded-xl border border-[#E5E5E5] dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-xs focus:outline-none focus:border-[#2F6FED]"
              />
              <p className="text-[11px] text-zinc-400 mt-1">Invites will be dispatched to all emails upon team creation.</p>
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            size="md"
            disabled={creatingTeam || (teamInviteMethod === 'code' && newTeamCodeAvailable === false)}
            className="w-full flex items-center justify-center gap-2 bg-[#2F6FED] hover:bg-[#2558BE] text-white disabled:opacity-50"
          >
            <Plus className="w-4 h-4" />
            <span>{creatingTeam ? 'Creating Team...' : 'Create Team & Send Invites'}</span>
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

      {/* MODAL 4: Create Competition */}
      <Modal
        isOpen={isCreateCompOpen}
        onClose={() => setIsCreateCompOpen(false)}
        title="Create Lock-in Competition"
        description="Set up a focus sprint to compete for Diamond, Gold, Silver & Bronze Crowns."
      >
        <form onSubmit={handleCreateCompSubmit} className="space-y-4 pt-2">
          <div>
            <label className="block text-xs font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
              Competition Name
            </label>
            <input
              type="text"
              required
              value={compName}
              onChange={(e) => setCompName(e.target.value)}
              placeholder="e.g. Frontend Lock-in 48H Sprint"
              className="w-full px-3 py-2 rounded-xl border border-[#E5E5E5] dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-xs focus:outline-none focus:border-[#2F6FED]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
              Scope
            </label>
            <select
              value={compScope}
              onChange={(e) => setCompScope(e.target.value as any)}
              className="w-full px-3 py-2 rounded-xl border border-[#E5E5E5] dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-xs focus:outline-none focus:border-[#2F6FED]"
            >
              <option value="friends">Friends Only</option>
              <option value="team">Team Only</option>
              <option value="global">Global Community</option>
            </select>
          </div>

          {/* Team Dropdown Selector when Scope is Team */}
          {compScope === 'team' && (
            <div>
              <label className="block text-xs font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
                Select Team
              </label>
              {userTeams.length > 0 ? (
                <select
                  value={compSelectedTeamId}
                  onChange={(e) => setCompSelectedTeamId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E5E5E5] dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-xs focus:outline-none focus:border-[#2F6FED]"
                >
                  {userTeams.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 rounded-xl space-y-2">
                  <p className="text-xs text-amber-800 dark:text-amber-300 font-medium">
                    ⚠️ You must create or join a team first before starting a team competition.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setIsCreateCompOpen(false);
                      generateRandomCode(setNewTeamCode);
                      setIsCreateTeamOpen(true);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-[#2F6FED] text-white text-xs font-semibold hover:bg-[#2558BE] transition-colors"
                  >
                    + Create Team First
                  </button>
                </div>
              )}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
              Winning Metric
            </label>
            <select
              value={compMetric}
              onChange={(e) => setCompMetric(e.target.value as any)}
              className="w-full px-3 py-2 rounded-xl border border-[#E5E5E5] dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-xs focus:outline-none focus:border-[#2F6FED]"
            >
              <option value="productive_hours">Total Productive Hours</option>
              <option value="streak">Current Streak</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
                Duration Unit
              </label>
              <select
                value={compDurationUnit}
                onChange={(e) => setCompDurationUnit(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-[#E5E5E5] dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-xs focus:outline-none focus:border-[#2F6FED]"
              >
                <option value="hours">Hours</option>
                <option value="days">Days</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
                Duration Value
              </label>
              <input
                type="number"
                min={1}
                required
                value={compDurationVal}
                onChange={(e) => setCompDurationVal(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-[#E5E5E5] dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-xs focus:outline-none focus:border-[#2F6FED]"
              />
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="md"
            disabled={creatingComp || !compName.trim() || (compScope === 'team' && userTeams.length === 0)}
            className="w-full flex items-center justify-center gap-2 bg-[#2F6FED] hover:bg-[#2558BE] text-white disabled:opacity-50"
          >
            <Swords className="w-4 h-4" />
            <span>{creatingComp ? 'Starting Competition...' : 'Start Competition'}</span>
          </Button>
        </form>
      </Modal>
    </div>
  );
}

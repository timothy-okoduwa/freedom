export type Theme = 'light' | 'dark';
export type AuthProvider = 'google' | 'github';
export type SubscriptionTier = 'free' | 'pro';

export interface UserPublicStats {
  totalProductiveMinutes: number;
  currentStreak: number;
  longestStreak: number;
}

export interface User {
  uid: string;
  email?: string;
  displayName: string;
  username: string;
  timezone: string;
  dailyGoalMinutes: number;
  theme: Theme;
  leaderboardOptIn: boolean;
  avatarUrl?: string;
  countryCode?: string;
  countryFlag?: string;
  authProvider: AuthProvider;

  subscriptionTier: SubscriptionTier;
  publicStats: UserPublicStats;
  createdAt: string;
  updatedAt: string;
}

export type DayPlanState = 'draft' | 'running' | 'paused' | 'completed' | 'expired' | 'failed';
export type DayPlanItemType = 'task' | 'break';
export type DayPlanItemState = 'pending' | 'running' | 'paused' | 'completed' | 'skipped' | 'failed';

export interface DayPlanItem {
  id: string;
  type: DayPlanItemType;
  title: string;
  order: number;
  plannedDurationMinutes: number;
  actualMinutes: number;
  extensionMinutes: number;
  startedAt?: string | null;
  endedAt?: string | null;
  state: DayPlanItemState;
}

export interface DayPlan {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  state: DayPlanState;
  items: DayPlanItem[];
  createdAt: string;
  startedAt?: string | null;
  completedAt?: string | null;
}

export interface DailyStats {
  id: string; // `${userId}_${date}`
  userId: string;
  date: string; // YYYY-MM-DD
  productiveMinutes: number;
  breakMinutes: number;
  sessionMinutes: number;
  completionPct: number;
  tasksCompleted: number;
  tasksFailed: number;
  planningAccuracy: number;
  productivityScore: number;
  scoreBreakdown: {
    completionComponent: number;
    accuracyComponent: number;
    streakBonusComponent: number;
    failurePenalty: number;
  };
}

export type FriendshipStatus = 'pending' | 'accepted' | 'declined';

export interface Friendship {
  id: string; // sortedUidA_sortedUidB
  userAId: string;
  userBId: string;
  status: FriendshipStatus;
  requestedBy: string;
  createdAt: string;
  respondedAt?: string | null;
}

export interface Team {
  id: string;
  name: string;
  description: string;
  iconUrl?: string;
  ownerId: string;
  inviteCode: string;
  createdAt: string;
}

export type TeamRole = 'owner' | 'member';

export interface TeamMembership {
  id: string; // userId enforces 1 team per user for MVP
  teamId: string;
  userId: string;
  role: TeamRole;
  joinedAt: string;
}

export type TeamInvitationStatus = 'pending' | 'accepted' | 'expired';

export interface TeamInvitation {
  id: string;
  teamId: string;
  teamName: string;
  inviteCode: string;
  recipientEmail: string;
  senderId: string;
  senderName: string;
  status: TeamInvitationStatus;
  createdAt: string;
}

export type CrownType = 'diamond' | 'gold' | 'silver' | 'bronze';

export interface FriendRequest {
  id: string;
  senderId: string;
  senderName: string;
  senderEmail?: string;
  senderAvatarUrl?: string;
  recipientEmail: string;
  recipientId?: string;
  status: FriendshipStatus;
  createdAt: string;
}

export interface Competition {
  id: string;
  name: string;
  description?: string;
  scope: 'global' | 'friends' | 'team';
  teamId?: string;
  metric: 'streak' | 'productive_hours';
  durationUnit: 'hours' | 'days';
  durationValue: number;
  startDate: string;
  endDate: string;
  createdBy: string;
  createdByName: string;
  createdAt: string;
  participantUids: string[];
}

export interface ActiveItemState {
  dayPlanId: string;
  itemId: string;
  itemType: DayPlanItemType;
  title: string;
  plannedDurationMinutes: number;
  startedAt: string; // ISO timestamp
  extensionMinutes: number;
  pausedAt: string | null;
  accumulatedPauseMs: number;
}


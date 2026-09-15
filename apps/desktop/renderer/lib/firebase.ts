import type {
  User,
  DayPlan,
  AuthProvider,
  Team,
  TeamMembership,
  TeamInvitation,
  FriendRequest,
  Friendship,
  Competition,
  UserPublicStats,
} from '@freedom/firestore-schema';
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  GoogleAuthProvider,
  signOut as fbSignOut,
  onAuthStateChanged,
  browserLocalPersistence,
  setPersistence,
  type Auth,
  type User as FirebaseUser,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  collection,
  query,
  where,
  getDocs,
  limit,
  type Firestore,
} from 'firebase/firestore';


export function cleanUndefined<T extends Record<string, any>>(obj: T): T {
  const cleaned: any = {};
  Object.keys(obj).forEach((key) => {
    if (obj[key] !== undefined) {
      cleaned[key] = obj[key];
    }
  });
  return cleaned as T;
}

export function getLocalDateString(d: Date = new Date()): string {

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getTimezoneCountryFlag(tz?: string): string {
  const userTz = tz || (typeof window !== 'undefined' ? Intl.DateTimeFormat().resolvedOptions().timeZone : 'Africa/Lagos');
  if (userTz.includes('Lagos') || userTz.includes('Africa/')) return '🇳🇬';
  if (userTz.includes('America/New_York') || userTz.includes('America/Chicago') || userTz.includes('America/Los_Angeles') || userTz.includes('America/Denver') || userTz.includes('US/')) return '🇺🇸';
  if (userTz.includes('Europe/London') || userTz.includes('GB')) return '🇬🇧';
  if (userTz.includes('America/Toronto') || userTz.includes('America/Vancouver') || userTz.includes('Canada/')) return '🇨🇦';
  if (userTz.includes('Europe/Berlin') || userTz.includes('Europe/Frankfurt') || userTz.includes('Europe/Paris')) return '🇩🇪';
  if (userTz.includes('Asia/Tokyo') || userTz.includes('Japan')) return '🇯🇵';
  if (userTz.includes('Australia/') || userTz.includes('Pacific/Auckland')) return '🇦🇺';
  if (userTz.includes('Asia/Kolkata') || userTz.includes('Asia/Calcutta')) return '🇮🇳';
  if (userTz.includes('Asia/Shanghai') || userTz.includes('Asia/Hong_Kong')) return '🇨🇳';
  if (userTz.includes('America/Sao_Paulo')) return '🇧🇷';
  return '🇳🇬';
}

export function getDicebearAvatar(seed: string): string {

  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(seed || 'freedom')}`;
}

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'AIzaSyDCEeMsrfXIAxpEEPiQHyuhHp8ftRNLpnw',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'freedo-m.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'freedo-m',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'freedo-m.firebasestorage.app',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '367884662643',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:367884662643:web:d8809c8519492b2085f706',
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || 'G-T219CJ7HJ9',
};

function getFirebaseApp(): FirebaseApp {
  if (typeof window === 'undefined') {
    return getApps().length ? getApp() : initializeApp(firebaseConfig);
  }
  return getApps().length ? getApp() : initializeApp(firebaseConfig);
}

let persistenceConfigured = false;

export function getFirebaseAuth(): Auth {
  const app = getFirebaseApp();
  const auth = getAuth(app);
  if (typeof window !== 'undefined' && !persistenceConfigured) {
    persistenceConfigured = true;
    setPersistence(auth, browserLocalPersistence).catch((err) => {
      console.warn('Firebase setPersistence error:', err);
    });
  }
  return auth;
}

export function getFirebaseDb(): Firestore {
  const app = getFirebaseApp();
  return getFirestore(app);
}

const CACHED_USER_KEY = 'freedom_user_profile';

export const authService = {
  getCachedUser(): User | null {
    if (typeof window === 'undefined') return null;
    try {
      const raw = localStorage.getItem(CACHED_USER_KEY);
      if (raw) return JSON.parse(raw);
    } catch {}
    return null;
  },

  setCachedUser(user: User | null): void {
    if (typeof window === 'undefined') return;
    try {
      if (user) {
        localStorage.setItem(CACHED_USER_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(CACHED_USER_KEY);
      }
      if (window.freedom?.session?.setUser) {
        window.freedom.session.setUser(user);
      }
    } catch (e) {}
  },

  onAuthStateChange(callback: (user: User | null) => void): () => void {
    if (typeof window === 'undefined') return () => {};
    try {
      const auth = getFirebaseAuth();

      // Read disk-persisted session for instant auth restoration across app restarts
      if (window.freedom?.session?.getUser) {
        window.freedom.session.getUser().then((diskUser: any) => {
          if (diskUser) {
            localStorage.setItem(CACHED_USER_KEY, JSON.stringify(diskUser));
            callback(diskUser);
          }
        });
      }

      // Immediately deliver cached user so UI has immediate session recognition without flickering
      const initialCached = this.getCachedUser();
      if (initialCached) {
        callback(initialCached);
      }

      let isReady = false;

      auth.authStateReady?.().then(async () => {
        isReady = true;
        const fbUser = auth.currentUser;
        if (fbUser) {
          const userDoc = await this.syncFirebaseUser(fbUser);
          this.setCachedUser(userDoc);
          callback(userDoc);
        } else if (!this.getCachedUser()) {
          callback(null);
        }
      });

      return onAuthStateChanged(auth, async (fbUser) => {
        if (fbUser) {
          const userDoc = await this.syncFirebaseUser(fbUser);
          this.setCachedUser(userDoc);
          callback(userDoc);
        } else if (isReady && !this.getCachedUser()) {
          callback(null);
        }
      });
    } catch (err) {
      console.warn('onAuthStateChange failed to initialize:', err);
      const fallbackCached = this.getCachedUser();
      callback(fallbackCached);
      return () => {};
    }
  },

  async syncFirebaseUser(fbUser: FirebaseUser, provider: AuthProvider = 'google'): Promise<User> {
    const rawUsername = fbUser.email?.split('@')[0] || fbUser.uid.slice(0, 8);
    const username = rawUsername.toLowerCase().replace(/[^a-z0-9_]/g, '');
    const displayName = fbUser.displayName || rawUsername;
    const avatarUrl = fbUser.photoURL || getDicebearAvatar(username);

    try {
      const db = getFirebaseDb();
      const userRef = doc(db, 'users', fbUser.uid);
      const snap = await getDoc(userRef);
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const countryFlag = getTimezoneCountryFlag(timezone);

      if (snap.exists()) {
        const existing = snap.data() as User;
        if (!existing.avatarUrl || !existing.countryFlag) {
          existing.avatarUrl = existing.avatarUrl || avatarUrl;
          existing.countryFlag = existing.countryFlag || countryFlag;
          await setDoc(userRef, { avatarUrl: existing.avatarUrl, countryFlag: existing.countryFlag }, { merge: true });
        }
        this.setCachedUser(existing);
        return existing;
      }

      const newUser: User = {
        uid: fbUser.uid,
        email: fbUser.email || '',
        displayName,
        username,
        timezone,
        dailyGoalMinutes: 240,
        theme: 'light',
        leaderboardOptIn: true,
        avatarUrl,
        countryFlag,
        authProvider: provider,
        hasSeenWalkthrough: false,
        subscriptionTier: 'free',
        publicStats: {
          totalProductiveMinutes: 0,
          currentStreak: 0,
          longestStreak: 0,
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };


      await setDoc(userRef, newUser);
      this.setCachedUser(newUser);
      return newUser;
    } catch (err) {
      console.warn('Firestore syncFirebaseUser failed, using offline fallback:', err);
      const fallbackUser: User = {
        uid: fbUser.uid,
        email: fbUser.email || '',
        displayName,
        username,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        dailyGoalMinutes: 240,
        theme: 'light',
        leaderboardOptIn: true,
        avatarUrl,
        authProvider: provider,
        hasSeenWalkthrough: false,
        subscriptionTier: 'free',
        publicStats: {
          totalProductiveMinutes: 0,
          currentStreak: 0,
          longestStreak: 0,
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      this.setCachedUser(fallbackUser);
      return fallbackUser;
    }
  },

  async getCurrentUser(): Promise<User | null> {
    if (typeof window === 'undefined') return null;

    try {
      const auth = getFirebaseAuth();
      if (auth.currentUser) {
        const db = getFirebaseDb();
        const snap = await getDoc(doc(db, 'users', auth.currentUser.uid));
        if (snap.exists()) {
          return snap.data() as User;
        }
        return this.syncFirebaseUser(auth.currentUser);
      }
    } catch (err) {
      console.warn('getCurrentUser error:', err);
    }

    return null;
  },

  async updateUser(updates: Partial<User>): Promise<User | null> {
    try {
      const auth = getFirebaseAuth();
      if (auth.currentUser) {
        const db = getFirebaseDb();
        const userRef = doc(db, 'users', auth.currentUser.uid);
        const updated = {
          ...updates,
          updatedAt: new Date().toISOString(),
        };
        await setDoc(userRef, updated, { merge: true });
        const snap = await getDoc(userRef);
        const userDoc = snap.data() as User;
        this.setCachedUser(userDoc);
        return userDoc;
      }
    } catch (err) {
      console.warn('updateUser error:', err);
    }
    return null;
  },

  async signUpWithEmail(email: string, pass: string, displayName: string): Promise<User> {
    const auth = getFirebaseAuth();
    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    if (displayName.trim()) {
      await updateProfile(cred.user, { displayName: displayName.trim() });
    }
    return this.syncFirebaseUser(cred.user, 'google');
  },

  async signInWithEmail(email: string, pass: string): Promise<User> {
    const auth = getFirebaseAuth();
    const cred = await signInWithEmailAndPassword(auth, email, pass);
    return this.syncFirebaseUser(cred.user, 'google');
  },

  async signInWithGoogle(): Promise<User> {
    const auth = getFirebaseAuth();
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    const cred = await signInWithPopup(auth, provider);
    return this.syncFirebaseUser(cred.user, 'google');
  },

  async signOut(): Promise<void> {
    try {
      this.setCachedUser(null);
      const auth = getFirebaseAuth();
      await fbSignOut(auth);
    } catch (err) {
      console.warn('signOut error:', err);
    }
  },
};

export const firestoreService = {
  async getUserPlans(userId: string, limitDays: number = 180): Promise<DayPlan[]> {
    if (typeof window === 'undefined') return [];

    try {
      const db = getFirebaseDb();
      const q = query(
        collection(db, 'dayPlans'),
        where('userId', '==', userId),
        limit(limitDays)
      );
      const snap = await getDocs(q);
      return snap.docs.map((d) => d.data() as DayPlan);
    } catch (err) {
      console.warn('Firestore getUserPlans query failed:', err);
    }
    return [];
  },

  async getDayPlans(userId: string): Promise<DayPlan[]> {
    return this.getUserPlans(userId, 30);
  },

  async getTodayPlan(userId: string): Promise<DayPlan | null> {
    if (typeof window === 'undefined') return null;
    const today = getLocalDateString();

    try {
      const db = getFirebaseDb();
      const q = query(
        collection(db, 'dayPlans'),
        where('userId', '==', userId),
        where('date', '==', today)
      );
      const snap = await getDocs(q);
      if (!snap.empty) {
        return snap.docs[0].data() as DayPlan;
      }
    } catch (err) {
      console.warn('Firestore getTodayPlan failed:', err);
    }
    return null;
  },

  async saveDayPlan(plan: DayPlan): Promise<void> {
    if (typeof window === 'undefined') return;

    try {
      const db = getFirebaseDb();
      const planRef = doc(db, 'dayPlans', plan.id);
      await setDoc(planRef, plan, { merge: true });
    } catch (err) {
      console.warn('Firestore saveDayPlan failed:', err);
    }
  },

  async getLeaderboardUsers(): Promise<User[]> {
    try {
      const db = getFirebaseDb();
      const q = query(
        collection(db, 'users'),
        where('leaderboardOptIn', '==', true),
        limit(50)
      );
      const snap = await getDocs(q);
      const users = snap.docs.map((d) => d.data() as User);
      users.sort(
        (a, b) =>
          (b.publicStats?.totalProductiveMinutes || 0) -
          (a.publicStats?.totalProductiveMinutes || 0)
      );
      return users;
    } catch (err) {
      console.warn('Firestore getLeaderboardUsers failed:', err);
    }
    return [];
  },

  async checkInviteCodeAvailable(inviteCode: string, currentTeamId?: string): Promise<boolean> {
    const cleanCode = inviteCode.trim().toUpperCase();
    if (!cleanCode) return false;
    try {
      const db = getFirebaseDb();
      const q = query(collection(db, 'teams'), where('inviteCode', '==', cleanCode));
      const snap = await getDocs(q);
      if (snap.empty) return true;
      if (currentTeamId) {
        return snap.docs.every((d) => d.id === currentTeamId);
      }
      return false;
    } catch (err) {
      console.warn('checkInviteCodeAvailable failed:', err);
      return true; // Fallback permit
    }
  },

  async createTeam(name: string, description: string, inviteCode: string, ownerId: string): Promise<Team> {
    const db = getFirebaseDb();
    const teamId = `team_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    const cleanCode = inviteCode.trim().toUpperCase() || `FREEDOM-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

    const newTeam: Team = {
      id: teamId,
      name: name.trim(),
      description: description.trim() || 'A Freedom execution team',
      ownerId,
      inviteCode: cleanCode,
      createdAt: new Date().toISOString(),
    };

    const membership: TeamMembership = {
      id: `${ownerId}_${teamId}`,
      teamId,
      userId: ownerId,
      role: 'owner',
      joinedAt: new Date().toISOString(),
    };

    await setDoc(doc(db, 'teams', teamId), newTeam);
    await setDoc(doc(db, 'teamMemberships', membership.id), membership);

    return newTeam;
  },

  async joinTeamByCode(inviteCode: string, userId: string): Promise<{ success: boolean; message: string; team?: Team }> {
    const cleanCode = inviteCode.trim().toUpperCase();
    if (!cleanCode) return { success: false, message: 'Please enter a valid invite code.' };

    try {
      const db = getFirebaseDb();
      const q = query(collection(db, 'teams'), where('inviteCode', '==', cleanCode));
      const snap = await getDocs(q);

      if (snap.empty) {
        return { success: false, message: `No team found with invite code "${cleanCode}".` };
      }

      const team = snap.docs[0].data() as Team;
      const memId = `${userId}_${team.id}`;
      const memSnap = await getDoc(doc(db, 'teamMemberships', memId));

      if (!memSnap.exists()) {
        const newMem: TeamMembership = {
          id: memId,
          teamId: team.id,
          userId,
          role: 'member',
          joinedAt: new Date().toISOString(),
        };
        await setDoc(doc(db, 'teamMemberships', memId), newMem);
      }

      return { success: true, message: `Successfully joined team "${team.name}"!`, team };
    } catch (err: any) {
      return { success: false, message: err.message || 'Failed to join team.' };
    }
  },

  async getUserTeams(userId: string): Promise<Team[]> {
    try {
      const db = getFirebaseDb();
      const q = query(collection(db, 'teamMemberships'), where('userId', '==', userId));
      const snap = await getDocs(q);
      const teamIds = snap.docs.map((d) => (d.data() as TeamMembership).teamId);

      if (teamIds.length === 0) return [];

      const teams: Team[] = [];
      for (const tId of teamIds) {
        const tSnap = await getDoc(doc(db, 'teams', tId));
        if (tSnap.exists()) {
          teams.push(tSnap.data() as Team);
        }
      }
      return teams;
    } catch (err) {
      console.warn('getUserTeams failed:', err);
      return [];
    }
  },

  async getTeamMembers(teamId: string): Promise<User[]> {
    try {
      const db = getFirebaseDb();
      const q = query(collection(db, 'teamMemberships'), where('teamId', '==', teamId));
      const snap = await getDocs(q);
      const userIds = snap.docs.map((d) => (d.data() as TeamMembership).userId);

      const members: User[] = [];
      for (const uId of userIds) {
        const uSnap = await getDoc(doc(db, 'users', uId));
        if (uSnap.exists()) {
          members.push(uSnap.data() as User);
        }
      }
      members.sort(
        (a, b) =>
          (b.publicStats?.totalProductiveMinutes || 0) -
          (a.publicStats?.totalProductiveMinutes || 0)
      );
      return members;
    } catch (err) {
      console.warn('getTeamMembers failed:', err);
      return [];
    }
  },

  async removeTeamMember(teamId: string, userId: string): Promise<boolean> {
    try {
      const db = getFirebaseDb();
      // Delete any membership document matching teamId and userId
      const q = query(
        collection(db, 'teamMemberships'),
        where('teamId', '==', teamId),
        where('userId', '==', userId)
      );
      const snap = await getDocs(q);
      for (const d of snap.docs) {
        await deleteDoc(doc(db, 'teamMemberships', d.id));
      }

      // Also attempt hardcoded document ID deletion as fallback
      await deleteDoc(doc(db, 'teamMemberships', `${userId}_${teamId}`)).catch(() => {});
      await deleteDoc(doc(db, 'teamMemberships', `${teamId}_${userId}`)).catch(() => {});

      return true;
    } catch (err) {
      console.warn('removeTeamMember failed:', err);
      return false;
    }
  },

  async deleteTeam(teamId: string, ownerId: string): Promise<{ success: boolean; message: string }> {
    try {
      const db = getFirebaseDb();
      const teamRef = doc(db, 'teams', teamId);
      const teamSnap = await getDoc(teamRef);

      if (!teamSnap.exists()) {
        return { success: false, message: 'Team not found.' };
      }

      const teamData = teamSnap.data() as Team;
      if (teamData.ownerId !== ownerId) {
        return { success: false, message: 'Only the team owner can delete this team.' };
      }

      // 1. Delete team document
      await deleteDoc(teamRef);

      // 2. Delete all memberships associated with teamId
      const memQuery = query(collection(db, 'teamMemberships'), where('teamId', '==', teamId));
      const memSnap = await getDocs(memQuery);
      for (const d of memSnap.docs) {
        await deleteDoc(doc(db, 'teamMemberships', d.id)).catch(() => {});
      }

      // 3. Delete all invitations associated with teamId or inviteCode
      const invQuery = query(collection(db, 'invitations'), where('teamId', '==', teamId));
      const invSnap = await getDocs(invQuery);
      for (const d of invSnap.docs) {
        await deleteDoc(doc(db, 'invitations', d.id)).catch(() => {});
      }

      if (teamData.inviteCode) {
        const codeInvQuery = query(collection(db, 'invitations'), where('inviteCode', '==', teamData.inviteCode));
        const codeInvSnap = await getDocs(codeInvQuery);
        for (const d of codeInvSnap.docs) {
          await deleteDoc(doc(db, 'invitations', d.id)).catch(() => {});
        }
      }

      return { success: true, message: `Team "${teamData.name}" has been deleted.` };
    } catch (err: any) {
      console.warn('deleteTeam failed:', err);
      return { success: false, message: err.message || 'Failed to delete team.' };
    }
  },

  async saveTeamInvitation(invitation: TeamInvitation): Promise<void> {
    try {
      const db = getFirebaseDb();
      await setDoc(doc(db, 'invitations', invitation.id), invitation);
    } catch (err) {
      console.warn('saveTeamInvitation failed:', err);
    }
  },

  async getPendingTeamInvitations(recipientEmail: string): Promise<TeamInvitation[]> {
    const cleanEmail = recipientEmail.trim().toLowerCase();
    if (!cleanEmail) return [];
    try {
      const db = getFirebaseDb();
      const q = query(
        collection(db, 'invitations'),
        where('recipientEmail', '==', cleanEmail),
        where('status', '==', 'pending')
      );
      const snap = await getDocs(q);
      const allInvs = snap.docs.map((d) => d.data() as TeamInvitation);

      const validInvs: TeamInvitation[] = [];
      for (const inv of allInvs) {
        if (!inv.inviteCode) continue;
        const tQuery = query(collection(db, 'teams'), where('inviteCode', '==', inv.inviteCode.trim().toUpperCase()));
        const tSnap = await getDocs(tQuery);
        if (tSnap.empty) {
          // Stale orphaned invitation -> clean up automatically from Firestore
          await deleteDoc(doc(db, 'invitations', inv.id)).catch(() => {});
        } else {
          validInvs.push(inv);
        }
      }
      return validInvs;
    } catch (err) {
      console.warn('getPendingTeamInvitations failed:', err);
      return [];
    }
  },

  async acceptTeamInvitation(invitation: TeamInvitation, userId: string): Promise<{ success: boolean; message: string; team?: Team }> {
    try {
      const db = getFirebaseDb();
      const joinRes = await this.joinTeamByCode(invitation.inviteCode, userId);
      if (joinRes.success) {
        await setDoc(doc(db, 'invitations', invitation.id), { status: 'accepted' }, { merge: true });
      } else {
        // Clean up invalid or orphaned invitation
        await deleteDoc(doc(db, 'invitations', invitation.id)).catch(() => {});
        return {
          success: false,
          message: `This team invitation is no longer valid because the team was deleted or no longer exists.`,
        };
      }
      return joinRes;
    } catch (err: any) {
      return { success: false, message: err.message || 'Failed to accept team invitation.' };
    }
  },

  async syncUserStats(userId: string): Promise<UserPublicStats | null> {
    if (typeof window === 'undefined' || !userId) return null;

    try {
      const db = getFirebaseDb();
      const q = query(collection(db, 'dayPlans'), where('userId', '==', userId));
      const snap = await getDocs(q);
      const plans = snap.docs.map((d) => d.data() as DayPlan);

      let totalProductiveMinutes = 0;
      const activeDatesSet = new Set<string>();

      plans.forEach((p) => {
        let planProductiveMins = 0;
        if (p.items) {
          p.items.forEach((item) => {
            if (item.type === 'task' && item.state === 'completed') {
              const itemMins = item.actualMinutes || item.plannedDurationMinutes || 0;
              planProductiveMins += itemMins;
            }
          });
        }
        totalProductiveMinutes += planProductiveMins;
        if (planProductiveMins > 0) {
          activeDatesSet.add(p.date);
        }
      });

      // Compute streak
      const activeDates = Array.from(activeDatesSet).sort((a, b) => (a < b ? 1 : -1));
      let currentStreak = 0;
      let longestStreak = 0;

      if (activeDates.length > 0) {
        const todayStr = getLocalDateString();
        const yesterdayDate = new Date();
        yesterdayDate.setDate(yesterdayDate.getDate() - 1);
        const yesterdayStr = getLocalDateString(yesterdayDate);

        let anchorDate: Date | null = null;
        if (activeDatesSet.has(todayStr)) {
          anchorDate = new Date();
        } else if (activeDatesSet.has(yesterdayStr)) {
          anchorDate = yesterdayDate;
        }

        if (anchorDate) {
          let curr = new Date(anchorDate);
          while (activeDatesSet.has(getLocalDateString(curr))) {
            currentStreak++;
            curr.setDate(curr.getDate() - 1);
          }
        }

        let tempStreak = 0;
        const sortedAsc = Array.from(activeDatesSet).sort();
        for (let i = 0; i < sortedAsc.length; i++) {
          if (i === 0) {
            tempStreak = 1;
          } else {
            const prev = new Date(sortedAsc[i - 1]);
            const curr = new Date(sortedAsc[i]);
            const diffDays = Math.round((curr.getTime() - prev.getTime()) / 86400000);
            if (diffDays === 1) {
              tempStreak++;
            } else {
              tempStreak = 1;
            }
          }
          if (tempStreak > longestStreak) longestStreak = tempStreak;
        }
      }

      if (currentStreak > longestStreak) longestStreak = currentStreak;

      const publicStats: UserPublicStats = {
        totalProductiveMinutes,
        currentStreak,
        longestStreak,
      };

      const userRef = doc(db, 'users', userId);
      await setDoc(userRef, { publicStats, updatedAt: new Date().toISOString() }, { merge: true });

      const cached = authService.getCachedUser();
      if (cached && cached.uid === userId) {
        cached.publicStats = publicStats;
        authService.setCachedUser(cached);
      }

      return publicStats;
    } catch (err) {
      console.warn('syncUserStats failed:', err);
      return null;
    }
  },

  async sendFriendInvite(sender: User, recipientEmail: string): Promise<{ success: boolean; message: string; isExistingUser: boolean }> {
    const cleanEmail = recipientEmail.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      return { success: false, message: 'Valid recipient email required.', isExistingUser: false };
    }

    if (sender.email?.toLowerCase() === cleanEmail) {
      return { success: false, message: 'You cannot send a friend request to yourself.', isExistingUser: true };
    }

    try {
      const db = getFirebaseDb();
      const q = query(collection(db, 'users'), where('email', '==', cleanEmail));
      const snap = await getDocs(q);

      let isExistingUser = false;
      let recipientId: string | undefined = undefined;

      if (!snap.empty) {
        isExistingUser = true;
        recipientId = snap.docs[0].data().uid;
      }

      const reqId = `freq_${sender.uid}_${recipientId || Date.now()}`;
      const friendReq: Record<string, any> = {
        id: reqId,
        senderId: sender.uid,
        senderName: sender.displayName || 'Freedom Teammate',
        senderEmail: sender.email || '',
        senderAvatarUrl: sender.avatarUrl || '',
        recipientEmail: cleanEmail,
        status: 'pending',
        createdAt: new Date().toISOString(),
      };

      if (recipientId) {
        friendReq.recipientId = recipientId;
      }

      await setDoc(doc(db, 'friendRequests', reqId), friendReq as FriendRequest);


      return {
        success: true,
        message: isExistingUser
          ? `Friend invitation sent to registered Freedom user!`
          : `Friend invite created for ${cleanEmail}!`,
        isExistingUser,
      };
    } catch (err: any) {
      return { success: false, message: err.message || 'Failed to process friend invite.', isExistingUser: false };
    }
  },

  async getPendingFriendRequests(userEmailOrUid: string): Promise<FriendRequest[]> {
    try {
      const db = getFirebaseDb();
      const q1 = query(
        collection(db, 'friendRequests'),
        where('recipientEmail', '==', userEmailOrUid.toLowerCase()),
        where('status', '==', 'pending')
      );
      const snap1 = await getDocs(q1);

      const q2 = query(
        collection(db, 'friendRequests'),
        where('recipientId', '==', userEmailOrUid),
        where('status', '==', 'pending')
      );
      const snap2 = await getDocs(q2);

      const requestsMap = new Map<string, FriendRequest>();
      snap1.docs.forEach((d) => requestsMap.set(d.id, d.data() as FriendRequest));
      snap2.docs.forEach((d) => requestsMap.set(d.id, d.data() as FriendRequest));

      return Array.from(requestsMap.values());
    } catch (err) {
      console.warn('getPendingFriendRequests failed:', err);
      return [];
    }
  },

  async acceptFriendRequest(requestId: string, currentUserId: string): Promise<boolean> {
    try {
      const db = getFirebaseDb();
      const reqRef = doc(db, 'friendRequests', requestId);
      const reqSnap = await getDoc(reqRef);

      if (!reqSnap.exists()) return false;
      const reqData = reqSnap.data() as FriendRequest;

      await setDoc(reqRef, { status: 'accepted' }, { merge: true });

      const friendshipId = [reqData.senderId, currentUserId].sort().join('_');
      const friendship: Friendship = {
        id: friendshipId,
        userAId: reqData.senderId,
        userBId: currentUserId,
        status: 'accepted',
        requestedBy: reqData.senderId,
        createdAt: new Date().toISOString(),
        respondedAt: new Date().toISOString(),
      };

      await setDoc(doc(db, 'friendships', friendshipId), friendship);
      return true;
    } catch (err) {
      console.warn('acceptFriendRequest failed:', err);
      return false;
    }
  },

  async declineFriendRequest(requestId: string): Promise<boolean> {
    try {
      const db = getFirebaseDb();
      await setDoc(doc(db, 'friendRequests', requestId), { status: 'declined' }, { merge: true });
      return true;
    } catch (err) {
      console.warn('declineFriendRequest failed:', err);
      return false;
    }
  },

  async getFriendsLeaderboard(userId: string): Promise<User[]> {
    try {
      const db = getFirebaseDb();
      const q1 = query(collection(db, 'friendships'), where('userAId', '==', userId), where('status', '==', 'accepted'));
      const q2 = query(collection(db, 'friendships'), where('userBId', '==', userId), where('status', '==', 'accepted'));

      const [snap1, snap2] = await Promise.all([getDocs(q1), getDocs(q2)]);

      const friendUids = new Set<string>();
      friendUids.add(userId);

      snap1.docs.forEach((d) => {
        const f = d.data() as Friendship;
        friendUids.add(f.userBId);
      });
      snap2.docs.forEach((d) => {
        const f = d.data() as Friendship;
        friendUids.add(f.userAId);
      });

      const users: User[] = [];
      for (const fUid of Array.from(friendUids)) {
        const uSnap = await getDoc(doc(db, 'users', fUid));
        if (uSnap.exists()) {
          users.push(uSnap.data() as User);
        }
      }

      users.sort(
        (a, b) =>
          (b.publicStats?.totalProductiveMinutes || 0) -
          (a.publicStats?.totalProductiveMinutes || 0)
      );

      return users;
    } catch (err) {
      console.warn('getFriendsLeaderboard failed:', err);
      return [];
    }
  },

  async createCompetition(comp: Omit<Competition, 'id' | 'createdAt'>): Promise<Competition> {
    const db = getFirebaseDb();
    const compId = `comp_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    const fullComp: Competition = cleanUndefined({
      ...comp,
      id: compId,
      createdAt: new Date().toISOString(),
    });
    await setDoc(doc(db, 'competitions', compId), fullComp);
    return fullComp;
  },


  async getCompetitions(userId: string): Promise<Competition[]> {
    try {
      const db = getFirebaseDb();
      const q = query(collection(db, 'competitions'), limit(20));
      const snap = await getDocs(q);
      const comps = snap.docs.map((d) => d.data() as Competition);
      return comps.filter((c) => c.createdBy === userId || c.participantUids.includes(userId));
    } catch (err) {
      console.warn('getCompetitions failed:', err);
      return [];
    }
  },
};



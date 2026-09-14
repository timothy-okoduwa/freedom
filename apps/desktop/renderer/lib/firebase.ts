import type { User, DayPlan, AuthProvider, Team, TeamMembership, TeamInvitation } from '@freedom/firestore-schema';
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
  collection,
  query,
  where,
  getDocs,
  limit,
  type Firestore,
} from 'firebase/firestore';

export function getLocalDateString(d: Date = new Date()): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
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

      if (snap.exists()) {
        const existing = snap.data() as User;
        if (!existing.avatarUrl) {
          existing.avatarUrl = avatarUrl;
          await setDoc(userRef, { avatarUrl }, { merge: true });
        }
        this.setCachedUser(existing);
        return existing;
      }

      const newUser: User = {
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
      return members;
    } catch (err) {
      console.warn('getTeamMembers failed:', err);
      return [];
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
};

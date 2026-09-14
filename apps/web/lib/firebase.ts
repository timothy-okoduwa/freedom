import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  limit,
  type Firestore,
  type DocumentData,
  type QueryDocumentSnapshot,
} from 'firebase/firestore';

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
  return getApps().length ? getApp() : initializeApp(firebaseConfig);
}

export function getFirebaseDb(): Firestore {
  return getFirestore(getFirebaseApp());
}

export interface WaitlistEntry {
  id?: string;
  email: string;
  rank: number;
  joinedAt: string;
}

const LOCAL_STORAGE_KEY = 'freedom_windows_waitlist_email';

export const waitlistService = {
  getSavedEmail(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(LOCAL_STORAGE_KEY);
  },

  saveEmail(email: string) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(LOCAL_STORAGE_KEY, email);
  },

  async joinWaitlist(email: string): Promise<{ rank: number; entries: WaitlistEntry[] }> {
    const cleanEmail = email.trim().toLowerCase();
    this.saveEmail(cleanEmail);

    try {
      const db = getFirebaseDb();
      const colRef = collection(db, 'windowsWaitlist');
      
      // Check existing entries count
      const existingSnap = await getDocs(query(colRef, orderBy('createdAt', 'asc')));
      const existingDocs = existingSnap.docs.map((d: QueryDocumentSnapshot<DocumentData>) => {
        const data = d.data();
        return { id: d.id, email: (data.email as string) || '' };
      });

      const foundIndex = existingDocs.findIndex(
        (docItem: { id: string; email: string }) => docItem.email.toLowerCase() === cleanEmail
      );

      let rank = 14890;
      if (foundIndex !== -1) {
        rank = 14890 + (foundIndex + 1);
      } else {
        const newRank = 14890 + (existingDocs.length + 1);
        await addDoc(colRef, {
          email: cleanEmail,
          createdAt: new Date().toISOString(),
          rank: newRank,
        });
        rank = newRank;
      }

      const allEntries = await this.getWaitlist();
      return { rank, entries: allEntries };
    } catch (err) {
      console.warn('Firestore joinWaitlist failed, using offline fallback:', err);
      return {
        rank: 14892,
        entries: this.getMockWaitlist(cleanEmail),
      };
    }
  },

  async getWaitlist(): Promise<WaitlistEntry[]> {
    try {
      const db = getFirebaseDb();
      const colRef = collection(db, 'windowsWaitlist');
      const snap = await getDocs(query(colRef, orderBy('createdAt', 'asc'), limit(50)));
      
      if (snap.empty) {
        return this.getMockWaitlist(this.getSavedEmail() || '');
      }

      const docs = snap.docs.map((d: QueryDocumentSnapshot<DocumentData>, index: number) => {
        const data = d.data();
        return {
          id: d.id,
          email: data.email || 'user@example.com',
          rank: data.rank || 14890 + (index + 1),
          joinedAt: data.createdAt ? new Date(data.createdAt).toLocaleDateString() : 'Today',
        };
      });

      return docs;
    } catch (err) {
      console.warn('Firestore getWaitlist error:', err);
      return this.getMockWaitlist(this.getSavedEmail() || '');
    }
  },

  getMockWaitlist(userEmail?: string): WaitlistEntry[] {
    const list: WaitlistEntry[] = [
      { email: 'alex.vanderbilt@microsoft.com', rank: 14885, joinedAt: 'Sep 10, 2026' },
      { email: 'sarah.connor@cyberdyne.io', rank: 14886, joinedAt: 'Sep 11, 2026' },
      { email: 'marcus.aurelius@stoic.org', rank: 14887, joinedAt: 'Sep 11, 2026' },
      { email: 'elena.rostova@jetbrains.com', rank: 14888, joinedAt: 'Sep 12, 2026' },
      { email: 'david.heinemeier@basecamp.com', rank: 14889, joinedAt: 'Sep 12, 2026' },
      { email: 'satya.nadella@microsoft.com', rank: 14890, joinedAt: 'Sep 13, 2026' },
      { email: 'linus.torvalds@kernel.org', rank: 14891, joinedAt: 'Sep 13, 2026' },
    ];

    if (userEmail) {
      list.push({
        email: userEmail,
        rank: 14892,
        joinedAt: 'Today',
      });
    }

    list.push(
      { email: 'guido.vanrossum@python.org', rank: 14893, joinedAt: 'Today' },
      { email: 'kelsey.hightower@kubernetes.io', rank: 14894, joinedAt: 'Today' }
    );

    return list;
  },
};

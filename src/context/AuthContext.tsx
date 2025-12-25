'use client';

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import {
  User as FirebaseUser,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, isFirebaseConfigured } from '@/lib/firebase';
import { User, UserRole } from '@/types';
import { getRoleForEmail } from '@/config/admins';

// Demo admin users for testing without Firebase
const DEMO_ADMIN_USERS: Record<string, User> = {
  'admin@demo.com': {
    id: 'demo-superadmin',
    email: 'admin@demo.com',
    name: 'Super Admin',
    role: 'superadmin' as UserRole,
    isActive: true,
    createdAt: { seconds: Date.now() / 1000, nanoseconds: 0 } as any,
  },
  'salon@demo.com': {
    id: 'demo-salon-admin',
    email: 'salon@demo.com',
    name: 'Salon Admin',
    role: 'salon_admin' as UserRole,
    assignedSalonIds: ['glamour-studio'],
    isActive: true,
    createdAt: { seconds: Date.now() / 1000, nanoseconds: 0 } as any,
  },
};

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  isDemo: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  canManageSalon: (salonId: string) => boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const isDemo = !isFirebaseConfigured();

  // Computed role checks
  const isAdmin = user?.role === 'salon_admin' || user?.role === 'superadmin';
  const isSuperAdmin = user?.role === 'superadmin';

  // Check if user can manage a specific salon
  const canManageSalon = useCallback((salonId: string): boolean => {
    if (!user) return false;
    if (user.role === 'superadmin') return true;
    if (user.role === 'salon_admin' && user.assignedSalonIds?.includes(salonId)) return true;
    return false;
  }, [user]);

  // Refresh user data from Firestore
  const refreshUserData = useCallback(async () => {
    if (isDemo && user) {
      // In demo mode, just return the current user
      return;
    }
    if (firebaseUser && db) {
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setUser({
          id: userDoc.id,
          ...userData,
          role: userData.role || 'customer',
          isActive: userData.isActive ?? true,
        } as User);
      }
    }
  }, [firebaseUser, isDemo, user]);

  useEffect(() => {
    // If Firebase is not configured, skip auth setup
    if (!auth || isDemo) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setFirebaseUser(firebaseUser);

      if (firebaseUser && db) {
        // Get role from email config
        const { role: configRole, assignedSalonIds } = getRoleForEmail(firebaseUser.email || '');

        // Fetch user data from Firestore
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUser({
            id: userDoc.id,
            ...userData,
            // Use role from config if admin, otherwise use stored role or default to customer
            role: configRole !== 'customer' ? configRole : (userData.role || 'customer'),
            assignedSalonIds: assignedSalonIds || userData.assignedSalonIds,
            isActive: userData.isActive ?? true,
          } as User);
        } else {
          // User doesn't exist in Firestore yet - create with role from config
          const newUser: Partial<User> = {
            email: firebaseUser.email || '',
            name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
            role: configRole,
            assignedSalonIds,
            isActive: true,
          };
          await setDoc(doc(db, 'users', firebaseUser.uid), {
            ...newUser,
            createdAt: serverTimestamp(),
          });
          setUser({
            id: firebaseUser.uid,
            ...newUser,
            createdAt: { seconds: Date.now() / 1000, nanoseconds: 0 },
          } as User);
        }
      } else {
        setUser(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, [isDemo]);

  const signIn = async (email: string, password: string) => {
    // Always check for demo admin users first (for testing)
    const demoUser = DEMO_ADMIN_USERS[email.toLowerCase()];
    if (demoUser && password === 'demo123') {
      setUser(demoUser);
      return;
    }

    // In demo mode (no Firebase), only demo credentials work
    if (isDemo) {
      throw new Error('Invalid demo credentials. Use admin@demo.com or salon@demo.com with password "demo123"');
    }

    // Try Firebase authentication
    if (!auth) {
      throw new Error('Firebase is not configured. Please set up your Firebase credentials.');
    }
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signUp = async (email: string, password: string, name: string) => {
    if (!auth || !db || isDemo) {
      throw new Error('Firebase is not configured. Please set up your Firebase credentials.');
    }
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);

    // Create user document in Firestore with default role
    await setDoc(doc(db, 'users', userCredential.user.uid), {
      email,
      name,
      role: 'customer',
      isActive: true,
      createdAt: serverTimestamp(),
    });
  };

  const logout = async () => {
    if (isDemo) {
      setUser(null);
      return;
    }
    if (!auth) {
      return;
    }
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{
      user,
      firebaseUser,
      loading,
      isDemo,
      isAdmin,
      isSuperAdmin,
      canManageSalon,
      signIn,
      signUp,
      logout,
      refreshUserData,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

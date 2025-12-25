'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '@/lib/firebase';
import { useAuth } from './AuthContext';
import { Salon } from '@/types';
import { AdminPermissions } from '@/types/admin';
import { demoSalon } from '@/lib/demo-data';

interface AdminContextType {
  currentSalonId: string | null;
  setCurrentSalonId: (salonId: string | null) => void;
  managedSalons: Salon[];
  currentSalon: Salon | null;
  permissions: AdminPermissions;
  loading: boolean;
}

const defaultPermissions: AdminPermissions = {
  canManageServices: false,
  canManageStylists: false,
  canManageBookings: false,
  canViewAnalytics: false,
  canManageSalonSettings: false,
  canManageAdminUsers: false,
  canCreateSalons: false,
};

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
  const { user, isSuperAdmin, canManageSalon, isDemo } = useAuth();
  const [currentSalonId, setCurrentSalonId] = useState<string | null>(null);
  const [managedSalons, setManagedSalons] = useState<Salon[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch salons the user can manage
  const fetchManagedSalons = useCallback(async () => {
    if (!user) {
      setManagedSalons([]);
      setLoading(false);
      return;
    }

    // Demo mode
    if (isDemo) {
      const demoSalonData: Salon = {
        id: 'glamour-studio',
        slug: 'glamour-studio',
        name: demoSalon.name,
        description: demoSalon.description,
        address: demoSalon.address,
        phone: demoSalon.phone,
        email: demoSalon.email,
        logo: demoSalon.logo,
        coverImage: demoSalon.coverImage,
        taxRate: 0.18,
        createdAt: { seconds: Date.now() / 1000, nanoseconds: 0 } as any,
      };

      if (isSuperAdmin) {
        setManagedSalons([demoSalonData]);
      } else if (user.assignedSalonIds?.length) {
        setManagedSalons([demoSalonData]);
      }

      // Auto-select first salon if none selected
      if (!currentSalonId && (isSuperAdmin || user.assignedSalonIds?.length)) {
        setCurrentSalonId('glamour-studio');
      }

      setLoading(false);
      return;
    }

    // Firebase mode
    if (!db || !isFirebaseConfigured()) {
      setLoading(false);
      return;
    }

    try {
      let salons: Salon[] = [];

      if (isSuperAdmin) {
        // Superadmin can see all salons
        const snapshot = await getDocs(collection(db, 'salons'));
        salons = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as Salon[];
      } else if (user.assignedSalonIds?.length) {
        // Salon admin can only see assigned salons
        const snapshot = await getDocs(
          query(
            collection(db, 'salons'),
            where('__name__', 'in', user.assignedSalonIds)
          )
        );
        salons = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as Salon[];
      }

      setManagedSalons(salons);

      // Auto-select first salon if none selected
      if (!currentSalonId && salons.length > 0) {
        setCurrentSalonId(salons[0].id);
      }
    } catch (error) {
      console.error('Error fetching managed salons:', error);
    } finally {
      setLoading(false);
    }
  }, [user, isSuperAdmin, currentSalonId, isDemo]);

  useEffect(() => {
    fetchManagedSalons();
  }, [fetchManagedSalons]);

  // Get current salon from list
  const currentSalon = managedSalons.find(s => s.id === currentSalonId) || null;

  // Calculate permissions based on user role and current salon
  const permissions: AdminPermissions = {
    canManageServices: currentSalonId ? canManageSalon(currentSalonId) : false,
    canManageStylists: currentSalonId ? canManageSalon(currentSalonId) : false,
    canManageBookings: currentSalonId ? canManageSalon(currentSalonId) : false,
    canViewAnalytics: currentSalonId ? canManageSalon(currentSalonId) : false,
    canManageSalonSettings: currentSalonId ? canManageSalon(currentSalonId) : false,
    canManageAdminUsers: isSuperAdmin,
    canCreateSalons: isSuperAdmin,
  };

  return (
    <AdminContext.Provider
      value={{
        currentSalonId,
        setCurrentSalonId,
        managedSalons,
        currentSalon,
        permissions,
        loading,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}

'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '@/lib/firebase';
import { Salon, Service, Stylist } from '@/types';
import { demoSalon, demoServices, demoStylists } from '@/lib/demo-data';

interface SalonContextType {
  salon: Salon | null;
  services: Service[];
  stylists: Stylist[];
  loading: boolean;
  error: string | null;
}

const SalonContext = createContext<SalonContextType | undefined>(undefined);

interface SalonProviderProps {
  children: ReactNode;
  salonSlug: string;
}

export function SalonProvider({ children, salonSlug }: SalonProviderProps) {
  const [salon, setSalon] = useState<Salon | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [stylists, setStylists] = useState<Stylist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSalonData() {
      try {
        setLoading(true);
        setError(null);

        // Use demo data if Firebase is not configured
        if (!isFirebaseConfigured() || !db) {
          if (salonSlug === 'glamour-studio') {
            setSalon(demoSalon);
            setServices(demoServices);
            setStylists(demoStylists);
          } else {
            setError('Salon not found');
          }
          setLoading(false);
          return;
        }

        // Fetch from Firebase
        const salonsQuery = query(
          collection(db, 'salons'),
          where('slug', '==', salonSlug)
        );
        const salonsSnapshot = await getDocs(salonsQuery);

        if (salonsSnapshot.empty) {
          setError('Salon not found');
          setLoading(false);
          return;
        }

        const salonDoc = salonsSnapshot.docs[0];
        const salonData = { id: salonDoc.id, ...salonDoc.data() } as Salon;
        setSalon(salonData);

        // Fetch services
        const servicesQuery = query(
          collection(db, 'salons', salonDoc.id, 'services'),
          where('active', '==', true),
          orderBy('order')
        );
        const servicesSnapshot = await getDocs(servicesQuery);
        const servicesData = servicesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as Service[];
        setServices(servicesData);

        // Fetch stylists
        const stylistsQuery = query(
          collection(db, 'salons', salonDoc.id, 'stylists'),
          where('active', '==', true)
        );
        const stylistsSnapshot = await getDocs(stylistsQuery);
        const stylistsData = stylistsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as Stylist[];
        setStylists(stylistsData);

        setLoading(false);
      } catch (err) {
        console.error('Error fetching salon data:', err);
        // Fall back to demo data on error
        if (salonSlug === 'glamour-studio') {
          setSalon(demoSalon);
          setServices(demoServices);
          setStylists(demoStylists);
          setError(null);
        } else {
          setError('Failed to load salon data');
        }
        setLoading(false);
      }
    }

    fetchSalonData();
  }, [salonSlug]);

  return (
    <SalonContext.Provider value={{ salon, services, stylists, loading, error }}>
      {children}
    </SalonContext.Provider>
  );
}

export function useSalon() {
  const context = useContext(SalonContext);
  if (context === undefined) {
    throw new Error('useSalon must be used within a SalonProvider');
  }
  return context;
}

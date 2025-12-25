'use client';

import { createContext, useContext, useReducer, ReactNode, useEffect, useState } from 'react';
import { Service, Stylist, BookingState } from '@/types';

// Type for confirmed/saved bookings
export interface ConfirmedBooking {
  id: string;
  services: Service[];
  stylist: Stylist | null;
  date: string; // ISO string for serialization
  time: string;
  subtotal: number;
  tax: number;
  total: number;
  status: 'upcoming' | 'past';
  createdAt: string;
}

type BookingAction =
  | { type: 'ADD_SERVICE'; payload: Service }
  | { type: 'REMOVE_SERVICE'; payload: string }
  | { type: 'SET_SERVICES'; payload: Service[] }
  | { type: 'SET_STYLIST'; payload: Stylist | null }
  | { type: 'SET_FIRST_AVAILABLE'; payload: boolean }
  | { type: 'SET_DATE'; payload: Date | null }
  | { type: 'SET_TIME'; payload: string | null }
  | { type: 'RESET' };

interface BookingContextType {
  state: BookingState;
  dispatch: React.Dispatch<BookingAction>;
  addService: (service: Service) => void;
  removeService: (serviceId: string) => void;
  setServices: (services: Service[]) => void;
  setStylist: (stylist: Stylist | null) => void;
  setFirstAvailable: (value: boolean) => void;
  setDate: (date: Date | null) => void;
  setTime: (time: string | null) => void;
  reset: () => void;
  getTotalPrice: () => number;
  getTotalDuration: () => number;
  confirmedBookings: ConfirmedBooking[];
  addConfirmedBooking: (booking: Omit<ConfirmedBooking, 'id' | 'createdAt'>) => string;
}

const initialState: BookingState = {
  selectedServices: [],
  selectedStylist: null,
  useFirstAvailable: false,
  selectedDate: null,
  selectedTime: null,
};

function bookingReducer(state: BookingState, action: BookingAction): BookingState {
  switch (action.type) {
    case 'ADD_SERVICE':
      if (state.selectedServices.find(s => s.id === action.payload.id)) {
        return state;
      }
      return {
        ...state,
        selectedServices: [...state.selectedServices, action.payload],
      };
    case 'REMOVE_SERVICE':
      return {
        ...state,
        selectedServices: state.selectedServices.filter(s => s.id !== action.payload),
      };
    case 'SET_SERVICES':
      return {
        ...state,
        selectedServices: action.payload,
      };
    case 'SET_STYLIST':
      return {
        ...state,
        selectedStylist: action.payload,
        useFirstAvailable: false,
      };
    case 'SET_FIRST_AVAILABLE':
      return {
        ...state,
        useFirstAvailable: action.payload,
        selectedStylist: action.payload ? null : state.selectedStylist,
      };
    case 'SET_DATE':
      return {
        ...state,
        selectedDate: action.payload,
        selectedTime: null, // Reset time when date changes
      };
    case 'SET_TIME':
      return {
        ...state,
        selectedTime: action.payload,
      };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

const STORAGE_KEY = 'beauty-salon-bookings';

export function BookingProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(bookingReducer, initialState);
  const [confirmedBookings, setConfirmedBookings] = useState<ConfirmedBooking[]>([]);

  // Load confirmed bookings from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const bookings: ConfirmedBooking[] = JSON.parse(stored);
        // Update status based on date
        const now = new Date();
        const updatedBookings = bookings.map(booking => {
          const bookingDate = new Date(booking.date);
          const [hours, minutes] = booking.time.split(':').map(Number);
          bookingDate.setHours(hours, minutes);
          return {
            ...booking,
            status: bookingDate < now ? 'past' as const : 'upcoming' as const,
          };
        });
        setConfirmedBookings(updatedBookings);
      } catch (e) {
        console.error('Failed to parse stored bookings:', e);
      }
    }
  }, []);

  // Save confirmed bookings to localStorage when they change
  useEffect(() => {
    if (confirmedBookings.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(confirmedBookings));
    }
  }, [confirmedBookings]);

  const addConfirmedBooking = (booking: Omit<ConfirmedBooking, 'id' | 'createdAt'>): string => {
    const newBooking: ConfirmedBooking = {
      ...booking,
      id: `booking-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
    };
    setConfirmedBookings(prev => [newBooking, ...prev]);
    return newBooking.id;
  };

  const addService = (service: Service) => {
    dispatch({ type: 'ADD_SERVICE', payload: service });
  };

  const removeService = (serviceId: string) => {
    dispatch({ type: 'REMOVE_SERVICE', payload: serviceId });
  };

  const setServices = (services: Service[]) => {
    dispatch({ type: 'SET_SERVICES', payload: services });
  };

  const setStylist = (stylist: Stylist | null) => {
    dispatch({ type: 'SET_STYLIST', payload: stylist });
  };

  const setFirstAvailable = (value: boolean) => {
    dispatch({ type: 'SET_FIRST_AVAILABLE', payload: value });
  };

  const setDate = (date: Date | null) => {
    dispatch({ type: 'SET_DATE', payload: date });
  };

  const setTime = (time: string | null) => {
    dispatch({ type: 'SET_TIME', payload: time });
  };

  const reset = () => {
    dispatch({ type: 'RESET' });
  };

  const getTotalPrice = () => {
    return state.selectedServices.reduce((sum, service) => sum + service.price, 0);
  };

  const getTotalDuration = () => {
    return state.selectedServices.reduce((sum, service) => sum + service.duration, 0);
  };

  return (
    <BookingContext.Provider
      value={{
        state,
        dispatch,
        addService,
        removeService,
        setServices,
        setStylist,
        setFirstAvailable,
        setDate,
        setTime,
        reset,
        getTotalPrice,
        getTotalDuration,
        confirmedBookings,
        addConfirmedBooking,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
}

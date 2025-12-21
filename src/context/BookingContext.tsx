'use client';

import { createContext, useContext, useReducer, ReactNode } from 'react';
import { Service, Stylist, BookingState } from '@/types';

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

export function BookingProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(bookingReducer, initialState);

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

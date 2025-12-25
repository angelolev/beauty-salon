import { Timestamp } from 'firebase/firestore';

// User roles for access control
export type UserRole = 'customer' | 'salon_admin' | 'superadmin';

export interface Salon {
  id: string;
  slug: string;
  name: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  logo?: string;
  coverImage?: string;
  taxRate: number;
  createdAt: Timestamp;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  category: string;
  image?: string;
  featured: boolean;
  order: number;
  active: boolean;
}

export interface Stylist {
  id: string;
  name: string;
  specialty: string;
  bio?: string;
  avatar?: string;
  serviceIds: string[];
  active: boolean;
}

export interface Availability {
  id: string;
  stylistId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  slotDuration: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: UserRole;
  assignedSalonIds?: string[]; // For salon_admin - salons they can manage
  isActive: boolean;
  createdAt: Timestamp;
  updatedAt?: Timestamp;
}

export interface Booking {
  id: string;
  userId: string;
  serviceIds: string[];
  stylistId: string | null;
  assignedStylistId: string;
  date: Timestamp;
  startTime: string;
  endTime: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  subtotal: number;
  tax: number;
  total: number;
  paymentMethodId?: string;
  createdAt: Timestamp;
}

export interface PaymentMethod {
  id: string;
  type: 'visa' | 'mastercard' | 'amex';
  lastFour: string;
  expiryMonth: number;
  expiryYear: number;
  isDefault: boolean;
}

export interface TimeSlot {
  time: string;
  available: boolean;
}

export interface BookingState {
  selectedServices: Service[];
  selectedStylist: Stylist | null;
  useFirstAvailable: boolean;
  selectedDate: Date | null;
  selectedTime: string | null;
}

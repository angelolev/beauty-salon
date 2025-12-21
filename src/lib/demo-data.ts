import { Salon, Service, Stylist, Booking, PaymentMethod } from '@/types';

// Demo Salon
export const demoSalon: Salon = {
  id: 'glamour-studio',
  slug: 'glamour-studio',
  name: 'Glamour Studio',
  description: 'Your premier destination for beauty and wellness',
  address: '123 Beauty Lane, New York, NY 10001',
  phone: '+1 (555) 123-4567',
  email: 'hello@glamourstudio.com',
  taxRate: 0.1,
  createdAt: { seconds: Date.now() / 1000, nanoseconds: 0 } as never,
};

// Demo Services
export const demoServices: Service[] = [
  {
    id: 'haircut',
    name: 'Haircut',
    description: 'Professional haircut tailored to your style. Includes wash, cut, and blow-dry.',
    price: 30,
    duration: 45,
    category: 'Haircuts',
    featured: true,
    order: 1,
    active: true,
  },
  {
    id: 'manicure',
    name: 'Manicure',
    description: 'Classic manicure with nail shaping, cuticle care, and polish of your choice.',
    price: 25,
    duration: 30,
    category: 'Manicures',
    featured: true,
    order: 2,
    active: true,
  },
  {
    id: 'facial',
    name: 'Facial',
    description: 'Rejuvenating facial treatment to cleanse, exfoliate, and hydrate your skin.',
    price: 40,
    duration: 60,
    category: 'Facials',
    featured: true,
    order: 3,
    active: true,
  },
  {
    id: 'eyebrow-shaping',
    name: 'Eyebrow Shaping',
    description: 'Expert eyebrow shaping to frame your face perfectly.',
    price: 20,
    duration: 20,
    category: 'Eyebrows',
    featured: false,
    order: 4,
    active: true,
  },
];

// Demo Stylists
export const demoStylists: Stylist[] = [
  {
    id: 'ava-bennett',
    name: 'Ava Bennett',
    specialty: 'Specializes in color treatments',
    bio: 'Ava has 8 years of experience in hair coloring and treatments.',
    serviceIds: ['haircut', 'hair-coloring'],
    active: true,
  },
  {
    id: 'chloe-davis',
    name: 'Chloe Davis',
    specialty: 'Expert in hair extensions',
    bio: 'Chloe is a certified hair extension specialist with 5 years of experience.',
    serviceIds: ['haircut', 'hair-coloring'],
    active: true,
  },
  {
    id: 'isabella-clark',
    name: 'Isabella Clark',
    specialty: 'Master of precision cuts',
    bio: 'Isabella trained in Paris and specializes in precision cutting techniques.',
    serviceIds: ['haircut', 'eyebrow-shaping'],
    active: true,
  },
];

// Demo Bookings
export const demoBookings: Booking[] = [];

// Demo Payment Methods
export const demoPaymentMethods: PaymentMethod[] = [
  {
    id: '1',
    type: 'mastercard',
    lastFour: '4242',
    expiryMonth: 12,
    expiryYear: 2025,
    isDefault: true,
  },
  {
    id: '2',
    type: 'visa',
    lastFour: '1234',
    expiryMonth: 6,
    expiryYear: 2026,
    isDefault: false,
  },
];

// Helper to check if we should use demo data (when Firebase is not configured)
export function shouldUseDemoData(): boolean {
  return !process.env.NEXT_PUBLIC_FIREBASE_API_KEY ||
         process.env.NEXT_PUBLIC_FIREBASE_API_KEY === 'your-api-key';
}

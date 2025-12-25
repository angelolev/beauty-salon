import { Salon, Service, Stylist, Booking, PaymentMethod } from '@/types';

// Demo Salon
export const demoSalon: Salon = {
  id: 'glamour-studio',
  slug: 'glamour-studio',
  name: 'Glamour Studio',
  description: 'Tu destino principal para belleza y bienestar',
  address: 'Av. José Pardo 123, Miraflores, Lima 15074, Perú',
  phone: '+51 1 555-4567',
  email: 'hola@glamourstudio.pe',
  taxRate: 0.18,
  createdAt: { seconds: Date.now() / 1000, nanoseconds: 0 } as never,
};

// Demo Services
export const demoServices: Service[] = [
  {
    id: 'haircut',
    name: 'Corte de Cabello',
    description: 'Corte profesional adaptado a tu estilo. Incluye lavado, corte y secado.',
    price: 30,
    duration: 45,
    category: 'Cortes',
    featured: true,
    order: 1,
    active: true,
  },
  {
    id: 'manicure',
    name: 'Manicura',
    description: 'Manicura clásica con limado, cuidado de cutículas y esmaltado a tu elección.',
    price: 25,
    duration: 30,
    category: 'Manicura',
    featured: true,
    order: 2,
    active: true,
  },
  {
    id: 'facial',
    name: 'Facial',
    description: 'Tratamiento facial rejuvenecedor para limpiar, exfoliar e hidratar tu piel.',
    price: 40,
    duration: 60,
    category: 'Faciales',
    featured: true,
    order: 3,
    active: true,
  },
  {
    id: 'eyebrow-shaping',
    name: 'Diseño de Cejas',
    description: 'Diseño de cejas experto para enmarcar tu rostro perfectamente.',
    price: 20,
    duration: 20,
    category: 'Cejas',
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
    specialty: 'Especialista en color y tratamientos',
    bio: 'Ava tiene 8 años de experiencia en coloración y tratamientos capilares.',
    serviceIds: ['haircut', 'hair-coloring'],
    active: true,
  },
  {
    id: 'chloe-davis',
    name: 'Chloe Davis',
    specialty: 'Experta en extensiones de cabello',
    bio: 'Chloe es una especialista certificada en extensiones de cabello con 5 años de experiencia.',
    serviceIds: ['haircut', 'hair-coloring'],
    active: true,
  },
  {
    id: 'isabella-clark',
    name: 'Isabella Clark',
    specialty: 'Maestra en cortes de precisión',
    bio: 'Isabella se formó en París y se especializa en técnicas de corte de precisión.',
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
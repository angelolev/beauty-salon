/**
 * Firebase Seed Script
 *
 * This script populates your Firebase Firestore with demo data for the beauty salon app.
 *
 * Before running:
 * 1. Create a Firebase project at https://console.firebase.google.com
 * 2. Enable Firestore Database
 * 3. Enable Authentication (Email/Password)
 * 4. Copy your Firebase config to .env.local
 * 5. Run: pnpm seed
 */

import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  Timestamp,
} from 'firebase/firestore';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Demo Salon Data
const salonData = {
  slug: 'glamour-studio',
  name: 'Glamour Studio',
  description: 'Tu destino principal para la belleza y el bienestar',
  address: 'Av. José Pardo 123, Miraflores, Lima 15074, Perú',
  phone: '+51 1 555-4567',
  email: 'hola@glamourstudio.pe',
  taxRate: 0.18,
  createdAt: Timestamp.now(),
};

// Services Data
const servicesData = [
  {
    id: 'haircut',
    name: 'Haircut',
    description:
      'Professional haircut tailored to your style. Includes wash, cut, and blow-dry.',
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
    description:
      'Classic manicure with nail shaping, cuticle care, and polish of your choice.',
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
    description:
      'Rejuvenating facial treatment to cleanse, exfoliate, and hydrate your skin.',
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
    description:
      'Expert eyebrow shaping to frame your face perfectly. Includes threading or waxing.',
    price: 20,
    duration: 20,
    category: 'Eyebrows',
    featured: false,
    order: 4,
    active: true,
  },
  {
    id: 'hair-coloring',
    name: 'Hair Coloring',
    description:
      'Full hair coloring service with premium products for vibrant, long-lasting color.',
    price: 80,
    duration: 120,
    category: 'Hair Coloring',
    featured: false,
    order: 5,
    active: true,
  },
  {
    id: 'pedicure',
    name: 'Pedicure',
    description:
      'Relaxing pedicure with foot soak, exfoliation, and nail care.',
    price: 35,
    duration: 45,
    category: 'Manicures',
    featured: false,
    order: 6,
    active: true,
  },
];

// Stylists Data
const stylistsData = [
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
  {
    id: 'sophia-martinez',
    name: 'Sophia Martinez',
    specialty: 'Nail art specialist',
    bio: 'Sophia creates stunning nail art and provides exceptional manicure services.',
    serviceIds: ['manicure', 'pedicure'],
    active: true,
  },
  {
    id: 'emma-wilson',
    name: 'Emma Wilson',
    specialty: 'Skincare expert',
    bio: 'Emma is a licensed esthetician specializing in facials and skincare.',
    serviceIds: ['facial', 'eyebrow-shaping'],
    active: true,
  },
];

// Availability Data (for each stylist)
const generateAvailability = (stylistId: string) => {
  const availability = [];
  // Monday to Saturday (1-6), 9 AM to 6 PM
  for (let day = 1; day <= 6; day++) {
    availability.push({
      id: `${stylistId}-day-${day}`,
      stylistId,
      dayOfWeek: day,
      startTime: '09:00',
      endTime: '18:00',
      slotDuration: 30,
    });
  }
  return availability;
};

async function seedDatabase() {
  console.log('Starting database seed...');

  try {
    // Create salon
    const salonRef = doc(db, 'salons', 'glamour-studio');
    await setDoc(salonRef, salonData);
    console.log('Created salon: Glamour Studio');

    // Create services
    for (const service of servicesData) {
      const serviceRef = doc(
        db,
        'salons',
        'glamour-studio',
        'services',
        service.id
      );
      await setDoc(serviceRef, service);
      console.log(`Created service: ${service.name}`);
    }

    // Create stylists
    for (const stylist of stylistsData) {
      const stylistRef = doc(
        db,
        'salons',
        'glamour-studio',
        'stylists',
        stylist.id
      );
      await setDoc(stylistRef, stylist);
      console.log(`Created stylist: ${stylist.name}`);

      // Create availability for this stylist
      const availability = generateAvailability(stylist.id);
      for (const slot of availability) {
        const availabilityRef = doc(
          db,
          'salons',
          'glamour-studio',
          'availability',
          slot.id
        );
        await setDoc(availabilityRef, slot);
      }
      console.log(`Created availability for: ${stylist.name}`);
    }

    console.log('');
    console.log('Database seeded successfully!');
    console.log('');
    console.log('You can now access the demo salon at: /glamour-studio');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();

/**
 * Firebase Seed Script - Luxe Spa & Wellness
 *
 * This script populates your Firebase Firestore with demo data for a luxury spa salon.
 *
 * Before running:
 * 1. Create a Firebase project at https://console.firebase.google.com
 * 2. Enable Firestore Database
 * 3. Enable Authentication (Email/Password)
 * 4. Copy your Firebase config to .env.local
 * 5. Run: pnpm tsx scripts/seed-luxe-spa.ts
 */

import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  Timestamp,
} from "firebase/firestore";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: ".env.local" });

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

// Luxe Spa Salon Data
const salonData = {
  slug: "luxe-spa-wellness",
  name: "Luxe Spa & Wellness",
  description:
    "Experimenta la máxima relajación y rejuvenecimiento en nuestro spa de lujo",
  address: "Calle Las Begonias 450, San Isidro, Lima 15046, Perú",
  phone: "+51 1 987-6543",
  email: "info@luxespawellness.pe",
  taxRate: 0.18,
  createdAt: Timestamp.now(),
};

// Services Data
const servicesData = [
  {
    id: "deep-tissue-massage",
    name: "Deep Tissue Massage",
    description:
      "Therapeutic massage targeting deep layers of muscle tissue. Perfect for chronic pain and tension relief.",
    price: 120,
    duration: 90,
    category: "Massages",
    featured: true,
    order: 1,
    active: true,
  },
  {
    id: "hot-stone-massage",
    name: "Hot Stone Massage",
    description:
      "Relaxing massage using heated stones to melt away tension and improve circulation.",
    price: 140,
    duration: 75,
    category: "Massages",
    featured: true,
    order: 2,
    active: true,
  },
  {
    id: "aromatherapy-facial",
    name: "Aromatherapy Facial",
    description:
      "Luxurious facial treatment using organic essential oils to revitalize and nourish your skin.",
    price: 95,
    duration: 60,
    category: "Facials",
    featured: true,
    order: 3,
    active: true,
  },
  {
    id: "anti-aging-facial",
    name: "Anti-Aging Facial",
    description:
      "Advanced facial treatment with collagen and peptides to reduce fine lines and restore youthful glow.",
    price: 135,
    duration: 75,
    category: "Facials",
    featured: false,
    order: 4,
    active: true,
  },
  {
    id: "gel-manicure",
    name: "Luxury Gel Manicure",
    description:
      "Premium gel manicure with hand massage, cuticle care, and long-lasting gel polish.",
    price: 45,
    duration: 45,
    category: "Nail Care",
    featured: false,
    order: 5,
    active: true,
  },
  {
    id: "spa-pedicure",
    name: "Deluxe Spa Pedicure",
    description:
      "Ultimate pedicure experience with sea salt soak, sugar scrub, paraffin treatment, and massage.",
    price: 65,
    duration: 60,
    category: "Nail Care",
    featured: false,
    order: 6,
    active: true,
  },
  {
    id: "balayage",
    name: "Balayage Hair Treatment",
    description:
      "Hand-painted hair coloring technique for natural-looking, sun-kissed highlights.",
    price: 180,
    duration: 150,
    category: "Hair Services",
    featured: true,
    order: 7,
    active: true,
  },
  {
    id: "keratin-treatment",
    name: "Keratin Smoothing Treatment",
    description:
      "Professional keratin treatment to eliminate frizz and create smooth, shiny hair for months.",
    price: 250,
    duration: 180,
    category: "Hair Services",
    featured: false,
    order: 8,
    active: true,
  },
  {
    id: "body-wrap",
    name: "Detoxifying Body Wrap",
    description:
      "Full body wrap using marine algae and essential oils to detoxify and hydrate your skin.",
    price: 155,
    duration: 90,
    category: "Body Treatments",
    featured: false,
    order: 9,
    active: true,
  },
  {
    id: "couples-massage",
    name: "Couples Relaxation Massage",
    description:
      "Intimate massage experience for two in our private couples suite with champagne.",
    price: 280,
    duration: 90,
    category: "Massages",
    featured: true,
    order: 10,
    active: true,
  },
];

// Stylists Data
const stylistsData = [
  {
    id: "maya-anderson",
    name: "Maya Anderson",
    specialty: "Licensed Massage Therapist - Deep Tissue Specialist",
    bio: "Maya is a certified massage therapist with 12 years of experience in deep tissue and sports massage. She studied at the Swedish Institute in NYC.",
    serviceIds: ["deep-tissue-massage", "hot-stone-massage", "couples-massage"],
    active: true,
  },
  {
    id: "jade-thomson",
    name: "Jade Thomson",
    specialty: "Holistic Wellness Expert",
    bio: "Jade combines traditional massage techniques with energy healing. She specializes in hot stone therapy and aromatherapy treatments.",
    serviceIds: ["hot-stone-massage", "aromatherapy-facial", "couples-massage"],
    active: true,
  },
  {
    id: "olivia-chen",
    name: "Olivia Chen",
    specialty: "Master Esthetician",
    bio: "Olivia is a licensed esthetician with expertise in anti-aging treatments and skincare. She trained in Seoul and Paris.",
    serviceIds: ["aromatherapy-facial", "anti-aging-facial", "body-wrap"],
    active: true,
  },
  {
    id: "luna-rodriguez",
    name: "Luna Rodriguez",
    specialty: "Advanced Skincare Specialist",
    bio: "Luna specializes in organic and natural skincare treatments. She has certifications in facial lymphatic drainage and LED therapy.",
    serviceIds: ["aromatherapy-facial", "anti-aging-facial"],
    active: true,
  },
  {
    id: "harper-brown",
    name: "Harper Brown",
    specialty: "Luxury Nail Artist",
    bio: "Harper creates stunning nail designs and provides premium nail care services. She has won multiple awards for her nail art.",
    serviceIds: ["gel-manicure", "spa-pedicure"],
    active: true,
  },
  {
    id: "scarlett-lee",
    name: "Scarlett Lee",
    specialty: "Master Colorist & Hair Stylist",
    bio: "Scarlett is a master hair colorist specializing in balayage and color correction. She has 15 years of experience.",
    serviceIds: ["balayage", "keratin-treatment"],
    active: true,
  },
  {
    id: "aria-patel",
    name: "Aria Patel",
    specialty: "Hair Transformation Specialist",
    bio: "Aria specializes in hair treatments and transformations. She is certified in Brazilian Blowout and keratin treatments.",
    serviceIds: ["keratin-treatment", "balayage"],
    active: true,
  },
  {
    id: "zoe-williams",
    name: "Zoe Williams",
    specialty: "Body Treatment Expert",
    bio: "Zoe is an expert in body treatments and holistic wellness. She specializes in detoxifying wraps and scrubs.",
    serviceIds: ["body-wrap", "hot-stone-massage"],
    active: true,
  },
];

// Availability Data (for each stylist)
const generateAvailability = (stylistId: string) => {
  const availability = [];
  // Tuesday to Sunday (2-0), 10 AM to 8 PM (luxury spa hours)
  const days = [2, 3, 4, 5, 6, 0]; // Tuesday through Sunday
  for (const day of days) {
    availability.push({
      id: `${stylistId}-day-${day}`,
      stylistId,
      dayOfWeek: day,
      startTime: "10:00",
      endTime: "20:00",
      slotDuration: 30,
    });
  }
  return availability;
};

async function seedDatabase() {
  console.log("Starting database seed for Luxe Spa & Wellness...");

  try {
    // Create salon
    const salonRef = doc(db, "salons", "luxe-spa-wellness");
    await setDoc(salonRef, salonData);
    console.log("✓ Created salon: Luxe Spa & Wellness");

    // Create services
    for (const service of servicesData) {
      const serviceRef = doc(
        db,
        "salons",
        "luxe-spa-wellness",
        "services",
        service.id
      );
      await setDoc(serviceRef, service);
      console.log(`✓ Created service: ${service.name}`);
    }

    // Create stylists
    for (const stylist of stylistsData) {
      const stylistRef = doc(
        db,
        "salons",
        "luxe-spa-wellness",
        "stylists",
        stylist.id
      );
      await setDoc(stylistRef, stylist);
      console.log(`✓ Created specialist: ${stylist.name}`);

      // Create availability for this stylist
      const availability = generateAvailability(stylist.id);
      for (const slot of availability) {
        const availabilityRef = doc(
          db,
          "salons",
          "luxe-spa-wellness",
          "availability",
          slot.id
        );
        await setDoc(availabilityRef, slot);
      }
      console.log(`✓ Created availability for: ${stylist.name}`);
    }

    console.log("");
    console.log("═══════════════════════════════════════════════════");
    console.log("🎉 Database seeded successfully!");
    console.log("═══════════════════════════════════════════════════");
    console.log("");
    console.log("Salon Details:");
    console.log("  Name: Luxe Spa & Wellness");
    console.log("  Slug: luxe-spa-wellness");
    console.log("  Services: 10 luxury spa services");
    console.log("  Specialists: 8 expert practitioners");
    console.log("  Hours: Tuesday-Sunday, 10 AM - 8 PM");
    console.log("");
    console.log("Access URL: /luxe-spa-wellness");
    console.log("");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

seedDatabase();

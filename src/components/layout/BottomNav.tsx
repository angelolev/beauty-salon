'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Calendar, User } from 'lucide-react';

interface BottomNavProps {
  salonSlug: string;
}

export default function BottomNav({ salonSlug }: BottomNavProps) {
  const pathname = usePathname();

  const navItems = [
    {
      href: `/${salonSlug}`,
      icon: Home,
      label: 'Home',
      isActive: pathname === `/${salonSlug}`,
    },
    {
      href: `/${salonSlug}/bookings`,
      icon: Calendar,
      label: 'Bookings',
      isActive: pathname.includes('/bookings'),
    },
    {
      href: `/${salonSlug}/profile`,
      icon: User,
      label: 'Profile',
      isActive: pathname.includes('/profile'),
    },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-2 z-50">
      <div className="max-w-md mx-auto flex items-center justify-around">
        {navItems.map(({ href, icon: Icon, label, isActive }) => (
          <Link
            key={href}
            href={href}
            className={`flex flex-col items-center py-2 px-4 ${
              isActive ? 'text-[#E91E8C]' : 'text-gray-500'
            }`}
          >
            <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
            <span className="text-xs mt-1 font-medium">{label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}

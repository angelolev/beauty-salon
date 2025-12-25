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
      label: 'Inicio',
      isActive: pathname === `/${salonSlug}`,
    },
    {
      href: `/${salonSlug}/bookings`,
      icon: Calendar,
      label: 'Reservas',
      isActive: pathname.includes('/bookings'),
    },
    {
      href: `/${salonSlug}/profile`,
      icon: User,
      label: 'Perfil',
      isActive: pathname.includes('/profile'),
    },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-[var(--background)]/90 backdrop-blur-lg border-t border-[var(--border)] px-6 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] z-50">
      <div className="max-w-md mx-auto flex items-center justify-around">
        {navItems.map(({ href, icon: Icon, label, isActive }) => (
          <Link
            key={href}
            href={href}
            className={`flex flex-col items-center py-2 px-4 rounded-full transition-all duration-300 ${
              isActive
                ? 'text-[var(--primary-700)] bg-[var(--primary-50)]'
                : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--secondary-50)]'
            }`}
          >
            <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
            <span className="text-[10px] mt-1 font-bold">{label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
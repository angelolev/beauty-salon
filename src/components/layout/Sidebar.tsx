'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Calendar, User, Scissors } from 'lucide-react';

interface SidebarProps {
  salonSlug: string;
  salonName?: string;
}

export default function Sidebar({ salonSlug, salonName = 'Beauty Salon' }: SidebarProps) {
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
      label: 'Mis Reservas',
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
    <aside className="hidden lg:flex flex-col w-72 bg-white dark:bg-[var(--card)] h-screen fixed left-0 top-0 shadow-sm z-30">
      {/* Logo/Brand */}
      <div className="p-8">
        <Link href={`/${salonSlug}`} className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[var(--primary-100)] rounded-full flex items-center justify-center">
            <Scissors size={20} className="text-[var(--primary)] rotate-[-45deg]" />
          </div>
          <h1 className="font-bold text-xl text-[var(--foreground)] font-[family-name:var(--font-heading)] tracking-tight">
            {salonName}
          </h1>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-6 py-4">
        <ul className="space-y-2">
          {navItems.map(({ href, icon: Icon, label, isActive }) => (
            <li key={href}>
              <Link
                href={href}
                className={`flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all duration-200 group font-medium ${
                  isActive
                    ? 'bg-[var(--primary-light)] text-[var(--primary)]'
                    : 'text-[var(--secondary-500)] hover:bg-[var(--secondary-50)] hover:text-[var(--foreground)]'
                }`}
              >
                <Icon size={20} className={isActive ? 'text-[var(--primary)]' : 'text-[var(--secondary-400)] group-hover:text-[var(--foreground)]'} />
                <span>{label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-8 border-t border-[var(--border)]">
        <p className="text-xs text-[var(--secondary-400)] text-center font-medium uppercase tracking-widest">
          Beauty Salon App
        </p>
      </div>
    </aside>
  );
}
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
      label: 'Home',
      isActive: pathname === `/${salonSlug}`,
    },
    {
      href: `/${salonSlug}/bookings`,
      icon: Calendar,
      label: 'My Bookings',
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
    <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-gray-200 min-h-screen fixed left-0 top-0">
      {/* Logo/Brand */}
      <div className="p-6 border-b border-gray-100">
        <Link href={`/${salonSlug}`} className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#E91E8C] rounded-xl flex items-center justify-center">
            <Scissors size={20} className="text-white" />
          </div>
          <div>
            <h1 className="font-bold text-gray-900">{salonName}</h1>
            <p className="text-xs text-[#8B7E8B]">Beauty & Wellness</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {navItems.map(({ href, icon: Icon, label, isActive }) => (
            <li key={href}>
              <Link
                href={href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                  isActive
                    ? 'bg-pink-50 text-[#E91E8C]'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                <span className="font-medium">{label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-100">
        <p className="text-xs text-[#8B7E8B] text-center">
          Powered by Beauty Salon App
        </p>
      </div>
    </aside>
  );
}

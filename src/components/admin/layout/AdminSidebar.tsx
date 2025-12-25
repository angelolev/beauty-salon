'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  Store,
  Scissors,
  Users,
  Calendar,
  BarChart3,
  Settings,
  UserCog,
  LogOut,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useAdmin } from '@/context/AdminContext';

const navigation = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Salones', href: '/admin/salons', icon: Store, superadminOnly: true },
];

const salonNavigation = [
  { name: 'Servicios', href: '/services', icon: Scissors },
  { name: 'Estilistas', href: '/stylists', icon: Users },
  { name: 'Reservas', href: '/bookings', icon: Calendar },
  { name: 'Clientes', href: '/customers', icon: Users },
  { name: 'Analíticas', href: '/analytics', icon: BarChart3 },
  { name: 'Configuración', href: '/settings', icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { user, isSuperAdmin, logout } = useAuth();
  const { currentSalon, currentSalonId, managedSalons, setCurrentSalonId } = useAdmin();

  const handleLogout = async () => {
    await logout();
    window.location.href = '/admin/login';
  };

  return (
    <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
      <div className="flex min-h-0 flex-1 flex-col bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
        {/* Logo */}
        <div className="flex h-16 flex-shrink-0 items-center px-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <Scissors className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-semibold text-gray-900 dark:text-white">
              Admin Panel
            </span>
          </div>
        </div>

        {/* Salon Selector */}
        {managedSalons.length > 0 && (
          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
              Salón actual
            </label>
            <select
              value={currentSalonId || ''}
              onChange={(e) => setCurrentSalonId(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {managedSalons.map((salon) => (
                <option key={salon.id} value={salon.id}>
                  {salon.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-2 py-4 overflow-y-auto">
          {/* Main navigation */}
          <div className="space-y-1">
            {navigation.map((item) => {
              // Skip superadmin-only items for non-superadmins
              if (item.superadminOnly && !isSuperAdmin) return null;

              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <item.icon
                    className={`mr-3 h-5 w-5 flex-shrink-0 ${
                      isActive ? 'text-primary' : 'text-gray-400 group-hover:text-gray-500'
                    }`}
                  />
                  {item.name}
                </Link>
              );
            })}
          </div>

          {/* Salon-specific navigation */}
          {currentSalonId && (
            <>
              <div className="pt-4">
                <p className="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {currentSalon?.name || 'Salón'}
                </p>
              </div>
              <div className="mt-2 space-y-1">
                {salonNavigation.map((item) => {
                  const href = `/admin/salons/${currentSalonId}${item.href}`;
                  const isActive = pathname.startsWith(href);
                  return (
                    <Link
                      key={item.name}
                      href={href}
                      className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                        isActive
                          ? 'bg-primary/10 text-primary'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      <item.icon
                        className={`mr-3 h-5 w-5 flex-shrink-0 ${
                          isActive ? 'text-primary' : 'text-gray-400 group-hover:text-gray-500'
                        }`}
                      />
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </>
          )}

          {/* Superadmin: User management */}
          {isSuperAdmin && (
            <>
              <div className="pt-4">
                <p className="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Administración
                </p>
              </div>
              <div className="mt-2 space-y-1">
                <Link
                  href="/admin/users"
                  className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    pathname.startsWith('/admin/users')
                      ? 'bg-primary/10 text-primary'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <UserCog className="mr-3 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500" />
                  Usuarios Admin
                </Link>
              </div>
            </>
          )}
        </nav>

        {/* User section */}
        <div className="flex flex-shrink-0 border-t border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center w-full">
            <div className="flex-shrink-0">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-primary font-medium">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
            <div className="ml-3 flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {user?.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {isSuperAdmin ? 'Super Admin' : 'Salon Admin'}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="ml-2 p-2 text-gray-400 hover:text-gray-500 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              title="Cerrar sesión"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}

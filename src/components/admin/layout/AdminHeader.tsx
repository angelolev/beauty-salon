'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  Menu,
  X,
  Bell,
  Search,
  Moon,
  Sun,
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
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { useAdmin } from '@/context/AdminContext';

// Get page title from pathname
function getPageTitle(pathname: string): string {
  const segments = pathname.split('/').filter(Boolean);

  if (segments.length <= 1) return 'Dashboard';

  const titleMap: Record<string, string> = {
    dashboard: 'Dashboard',
    salons: 'Salones',
    services: 'Servicios',
    stylists: 'Estilistas',
    bookings: 'Reservas',
    customers: 'Clientes',
    analytics: 'Analíticas',
    settings: 'Configuración',
    users: 'Usuarios Admin',
    new: 'Nuevo',
  };

  const lastSegment = segments[segments.length - 1];
  return titleMap[lastSegment] || lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1);
}

export default function AdminHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { user, isSuperAdmin, logout } = useAuth();
  const { currentSalon, currentSalonId, managedSalons, setCurrentSalonId } = useAdmin();

  const pageTitle = getPageTitle(pathname);

  const handleLogout = async () => {
    await logout();
    window.location.href = '/admin/login';
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    ...(isSuperAdmin ? [{ name: 'Salones', href: '/admin/salons', icon: Store }] : []),
  ];

  const salonNavigation = currentSalonId ? [
    { name: 'Servicios', href: `/admin/salons/${currentSalonId}/services`, icon: Scissors },
    { name: 'Estilistas', href: `/admin/salons/${currentSalonId}/stylists`, icon: Users },
    { name: 'Reservas', href: `/admin/salons/${currentSalonId}/bookings`, icon: Calendar },
    { name: 'Clientes', href: `/admin/salons/${currentSalonId}/customers`, icon: Users },
    { name: 'Analíticas', href: `/admin/salons/${currentSalonId}/analytics`, icon: BarChart3 },
    { name: 'Configuración', href: `/admin/salons/${currentSalonId}/settings`, icon: Settings },
  ] : [];

  return (
    <>
      <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
        {/* Mobile menu button */}
        <button
          type="button"
          className="lg:hidden -m-2.5 p-2.5 text-gray-700 dark:text-gray-300"
          onClick={() => setMobileMenuOpen(true)}
        >
          <span className="sr-only">Abrir menú</span>
          <Menu className="h-6 w-6" />
        </button>

        {/* Separator */}
        <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 lg:hidden" />

        {/* Page title */}
        <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
          <div className="flex items-center">
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
              {pageTitle}
            </h1>
          </div>

          {/* Search (desktop) */}
          <div className="hidden sm:flex flex-1 items-center justify-center px-2">
            <div className="w-full max-w-lg">
              <label htmlFor="search" className="sr-only">Buscar</label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="search"
                  name="search"
                  className="block w-full rounded-lg border-0 bg-gray-50 dark:bg-gray-700 py-2 pl-10 pr-3 text-gray-900 dark:text-white placeholder:text-gray-400 focus:bg-white dark:focus:bg-gray-600 focus:ring-2 focus:ring-primary sm:text-sm sm:leading-6"
                  placeholder="Buscar..."
                  type="search"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-x-4 lg:gap-x-6">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-400 hover:text-gray-500 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>

            {/* Notifications */}
            <button className="p-2 text-gray-400 hover:text-gray-500 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
              <span className="sr-only">Ver notificaciones</span>
              <Bell className="h-5 w-5" />
            </button>

            {/* Separator */}
            <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200 dark:lg:bg-gray-700" />

            {/* User info (desktop) */}
            <div className="hidden lg:flex lg:items-center">
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {user?.name}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-gray-900/50"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Menu panel */}
          <div className="fixed inset-y-0 left-0 w-full max-w-xs bg-white dark:bg-gray-800 shadow-xl">
            <div className="flex h-16 items-center justify-between px-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                  <Scissors className="h-5 w-5 text-white" />
                </div>
                <span className="text-lg font-semibold text-gray-900 dark:text-white">
                  Admin
                </span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-500"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Salon selector */}
            {managedSalons.length > 0 && (
              <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Salón actual
                </label>
                <select
                  value={currentSalonId || ''}
                  onChange={(e) => setCurrentSalonId(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
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
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg ${
                    pathname === item.href
                      ? 'bg-primary/10 text-primary'
                      : 'text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              ))}

              {salonNavigation.length > 0 && (
                <>
                  <div className="pt-4">
                    <p className="px-3 text-xs font-semibold text-gray-500 uppercase">
                      {currentSalon?.name}
                    </p>
                  </div>
                  {salonNavigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg ${
                        pathname.startsWith(item.href)
                          ? 'bg-primary/10 text-primary'
                          : 'text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <item.icon className="mr-3 h-5 w-5" />
                      {item.name}
                    </Link>
                  ))}
                </>
              )}

              {isSuperAdmin && (
                <>
                  <div className="pt-4">
                    <p className="px-3 text-xs font-semibold text-gray-500 uppercase">
                      Administración
                    </p>
                  </div>
                  <Link
                    href="/admin/users"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg ${
                      pathname.startsWith('/admin/users')
                        ? 'bg-primary/10 text-primary'
                        : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <UserCog className="mr-3 h-5 w-5" />
                    Usuarios Admin
                  </Link>
                </>
              )}
            </nav>

            {/* User section */}
            <div className="border-t border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-medium">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {user?.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {isSuperAdmin ? 'Super Admin' : 'Salon Admin'}
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-400 hover:text-gray-500"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

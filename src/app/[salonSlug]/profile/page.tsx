'use client';

import { useParams, useRouter } from 'next/navigation';
import { LogOut, User, Mail, Phone, ChevronRight, HelpCircle, Sun, Moon, Monitor } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import Header from '@/components/layout/Header';
import Avatar from '@/components/ui/Avatar';
import Button from '@/components/ui/Button';

export default function ProfilePage() {
  const params = useParams();
  const router = useRouter();
  const salonSlug = params.salonSlug as string;
  const { user, loading, logout, isDemo } = useAuth();
  const { theme, setTheme } = useTheme();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const handleLogin = () => {
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Not logged in state
  if (!user) {
    return (
      <div className="min-h-screen bg-white dark:bg-[var(--background)]">
        <Header title="Perfil" />

        <main className="p-4 lg:p-6">
          <div className="max-w-md mx-auto flex flex-col items-center justify-center min-h-[60vh]">
            <div className="w-24 h-24 rounded-full bg-gray-100 dark:bg-[var(--card)] flex items-center justify-center mb-4">
              <User size={48} className="text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Bienvenido al Salón de Belleza
            </h2>
            <p className="text-gray-500 dark:text-[var(--muted)] text-center mb-6">
              {isDemo
                ? 'Ejecutando en modo demo. Configura Firebase para habilitar la autenticación.'
                : 'Inicia sesión para gestionar tus reservas y perfil'}
            </p>
            {!isDemo && <Button onClick={handleLogin}>Iniciar Sesión</Button>}
          </div>
        </main>
      </div>
    );
  }

  const menuItems = [
    {
      icon: User,
      label: 'Información Personal',
      value: undefined,
      onClick: () => {},
    },
    {
      icon: Mail,
      label: 'Correo Electrónico',
      value: user.email,
      onClick: () => {},
    },
    {
      icon: Phone,
      label: 'Teléfono',
      value: user.phone || 'Añadir número de teléfono',
      onClick: () => {},
    },
  ];

  const themeOptions = [
    { value: 'light' as const, label: 'Claro', icon: Sun },
    { value: 'dark' as const, label: 'Oscuro', icon: Moon },
    { value: 'system' as const, label: 'Sistema', icon: Monitor },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-[var(--background)]">
      <Header title="Perfil" />

      <main className="p-4 lg:p-6">
        <div className="max-w-2xl mx-auto">
          {/* Desktop: Two column layout */}
          <div className="lg:grid lg:grid-cols-3 lg:gap-8">
            {/* Profile Header */}
            <div className="flex flex-col items-center mb-8 lg:mb-0 lg:bg-gray-50 dark:lg:bg-[var(--card)] lg:rounded-xl lg:p-6">
              <Avatar
                src={undefined}
                alt={user.name}
                size="xl"
              />
              <h2 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">
                {user.name}
              </h2>
              <p className="text-[#8B7E8B] dark:text-[var(--muted)]">{user.email}</p>

              {/* Desktop: Quick actions */}
              <div className="hidden lg:flex flex-col w-full mt-6 space-y-2">
                <Button variant="outline" fullWidth onClick={() => {}}>
                  Editar Perfil
                </Button>
              </div>
            </div>

            {/* Menu Items */}
            <div className="lg:col-span-2">
              <div className="space-y-1 mb-8">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 lg:mb-4">
                  Cuenta
                </h3>
                {menuItems.map((item, index) => (
                  <button
                    key={index}
                    onClick={item.onClick}
                    className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-[var(--card)] rounded-xl transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <item.icon size={20} className="text-gray-500 dark:text-gray-400" />
                      <div className="text-left">
                        <p className="font-medium text-gray-900 dark:text-white">{item.label}</p>
                        {item.value && (
                          <p className="text-sm text-[#8B7E8B] dark:text-[var(--muted)]">{item.value}</p>
                        )}
                      </div>
                    </div>
                    <ChevronRight size={20} className="text-gray-400" />
                  </button>
                ))}
              </div>

              {/* Appearance Section */}
              <div className="space-y-1 mb-8">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 lg:mb-4">
                  Apariencia
                </h3>
                <div className="flex gap-2 p-2 bg-gray-100 dark:bg-[var(--card)] rounded-xl">
                  {themeOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setTheme(option.value)}
                      className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-sm font-medium transition-colors ${
                        theme === option.value
                          ? 'bg-white dark:bg-[var(--background)] text-gray-900 dark:text-white shadow-sm'
                          : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                      }`}
                    >
                      <option.icon size={18} />
                      <span className="hidden sm:inline">{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Help Section */}
              <div className="space-y-1 mb-8">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 lg:mb-4">
                  Soporte
                </h3>
                <button
                  onClick={() => {}}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-[var(--card)] rounded-xl transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <HelpCircle size={20} className="text-gray-500 dark:text-gray-400" />
                    <p className="font-medium text-gray-900 dark:text-white">Ayuda y Soporte</p>
                  </div>
                  <ChevronRight size={20} className="text-gray-400" />
                </button>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-4 p-4 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
              >
                <LogOut size={20} />
                <span className="font-medium">Cerrar Sesión</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
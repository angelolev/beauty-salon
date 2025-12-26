"use client";

import { useParams, useRouter } from "next/navigation";
import {
  Bell,
  Sun,
  Moon,
  Star,
  Share2,
  Lock,
  FileText,
  Cookie,
  Mail,
  MessageSquare,
  LogOut,
  ChevronRight,
  Camera,
  User,
  Phone,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import Header from "@/components/layout/Header";
import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";

export default function ProfilePage() {
  const params = useParams();
  const router = useRouter();
  const salonSlug = params.salonSlug as string;
  const { user, loading, logout, isDemo } = useAuth();
  const { theme, setTheme } = useTheme();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const handleLogin = () => {
    router.push("/login");
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
        <Header title="Mi Perfil" showBack />

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
                ? "Ejecutando en modo demo. Configura Firebase para habilitar la autenticación."
                : "Inicia sesión para gestionar tus reservas y perfil"}
            </p>
            {!isDemo && <Button onClick={handleLogin}>Iniciar Sesión</Button>}
          </div>
        </main>
      </div>
    );
  }

  const isDarkMode =
    theme === "dark" ||
    (theme === "system" &&
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  const menuItems = [
    {
      icon: Bell,
      label: "Notificaciones",
      type: "toggle" as const,
      value: false,
      onChange: () => {},
    },
    {
      icon: isDarkMode ? Moon : Sun,
      label: "Modo Oscuro",
      type: "toggle" as const,
      value: isDarkMode,
      onChange: () => setTheme(isDarkMode ? "light" : "dark"),
    },
    {
      icon: Star,
      label: "Calificar App",
      type: "link" as const,
      onClick: () => {},
    },
    {
      icon: Share2,
      label: "Compartir App",
      type: "link" as const,
      onClick: () => {},
    },
    {
      icon: Lock,
      label: "Política de Privacidad",
      type: "link" as const,
      onClick: () => {},
    },
    {
      icon: FileText,
      label: "Términos y Condiciones",
      type: "link" as const,
      onClick: () => {},
    },
    {
      icon: Cookie,
      label: "Política de Cookies",
      type: "link" as const,
      onClick: () => {},
    },
    {
      icon: Mail,
      label: "Contacto",
      type: "link" as const,
      onClick: () => {},
    },
    {
      icon: MessageSquare,
      label: "Feedback",
      type: "link" as const,
      onClick: () => {},
    },
  ];

  const accountItems = [
    {
      icon: User,
      label: "Información Personal",
      description: "Actualiza tu nombre y otros detalles",
      onClick: () => {},
    },
    {
      icon: Mail,
      label: "Correo Electrónico",
      description: user.email,
      onClick: () => {},
    },
    {
      icon: Phone,
      label: "Teléfono",
      description: user.phone || "Añadir número de teléfono",
      onClick: () => {},
    },
  ];

  const appItems = [
    {
      icon: Star,
      label: "Calificar App",
      description: "Comparte tu experiencia",
      onClick: () => {},
    },
    {
      icon: Share2,
      label: "Compartir App",
      description: "Invita a tus amigos",
      onClick: () => {},
    },
  ];

  const legalItems = [
    {
      icon: Lock,
      label: "Política de Privacidad",
      onClick: () => {},
    },
    {
      icon: FileText,
      label: "Términos y Condiciones",
      onClick: () => {},
    },
    {
      icon: Cookie,
      label: "Política de Cookies",
      onClick: () => {},
    },
  ];

  const supportItems = [
    {
      icon: Mail,
      label: "Contacto",
      description: "Envíanos un mensaje",
      onClick: () => {},
    },
    {
      icon: MessageSquare,
      label: "Feedback",
      description: "Ayúdanos a mejorar",
      onClick: () => {},
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-[var(--background)]">
      <Header title="Mi Perfil" showBack />

      <main className="px-6 lg:px-10 py-6">
        {/* Mobile & Tablet: Original Clean Design */}
        <div className="lg:hidden max-w-2xl mx-auto">
          {/* Profile Header */}
          <div className="flex flex-col items-center mb-8 pt-4">
            <div className="relative mb-4">
              <Avatar src={user.photoURL} alt={user.name} size="xl" />
              <button className="absolute bottom-0 right-0 w-8 h-8 bg-gray-900 dark:bg-white rounded-full flex items-center justify-center shadow-lg">
                <Camera size={16} className="text-white dark:text-gray-900" />
              </button>
            </div>

            <button className="flex items-center gap-2 group mb-1">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {user.name}
              </h2>
              <ChevronRight
                size={20}
                className="text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors"
              />
            </button>

            <p className="text-gray-500 dark:text-[var(--muted)] text-sm">
              @{user.email?.split("@")[0] || "usuario"}
            </p>
          </div>

          {/* Menu Items */}
          <div className="space-y-1">
            {menuItems.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-[var(--card)] rounded-2xl transition-colors"
              >
                <div className="flex items-center gap-4">
                  <item.icon
                    size={22}
                    className="text-gray-700 dark:text-gray-300"
                  />
                  <span className="font-medium text-gray-900 dark:text-white text-base">
                    {item.label}
                  </span>
                </div>

                {item.type === "toggle" ? (
                  <button
                    onClick={item.onChange}
                    className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                      item.value
                        ? "bg-[#6366F1]"
                        : "bg-gray-300 dark:bg-gray-600"
                    }`}
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                        item.value ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                ) : (
                  <button onClick={item.onClick}>
                    <ChevronRight size={20} className="text-gray-400" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-3 p-4 mt-8 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-2xl transition-colors font-medium"
          >
            <LogOut size={20} />
            <span>Cerrar Sesión</span>
          </button>
        </div>

        {/* Desktop: Card-Based Layout */}
        <div className="hidden lg:block max-w-7xl mx-auto">
          <div className="grid grid-cols-12 gap-8">
            {/* Left Sidebar - Profile Card */}
            <div className="col-span-4 xl:col-span-3">
              <div className="bg-white dark:bg-[var(--card)] rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-[var(--border)] sticky top-6">
                <div className="flex flex-col items-center">
                  <div className="relative mb-4">
                    <Avatar src={user.photoURL} alt={user.name} size="xl" />
                    <button className="absolute bottom-0 right-0 w-10 h-10 bg-gray-900 dark:bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform">
                      <Camera
                        size={18}
                        className="text-white dark:text-gray-900"
                      />
                    </button>
                  </div>

                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                    {user.name}
                  </h2>
                  <p className="text-gray-500 dark:text-[var(--muted)] text-sm mb-6">
                    {user.email}
                  </p>

                  <Button variant="outline" fullWidth onClick={() => {}}>
                    Editar Perfil
                  </Button>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 p-3 mt-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors font-medium"
                  >
                    <LogOut size={18} />
                    <span>Cerrar Sesión</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Content - Settings Cards */}
            <div className="col-span-8 xl:col-span-9 space-y-6">
              {/* Preferences Card */}
              <div className="bg-white dark:bg-[var(--card)] rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-[var(--border)]">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Preferencias
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-[var(--background)] rounded-xl">
                    <div className="flex items-center gap-3">
                      <Bell size={20} className="text-gray-600 dark:text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          Notificaciones
                        </p>
                        <p className="text-sm text-gray-500 dark:text-[var(--muted)]">
                          Recibe actualizaciones sobre tus reservas
                        </p>
                      </div>
                    </div>
                    <button className="relative inline-flex h-7 w-12 items-center rounded-full transition-colors bg-gray-300 dark:bg-gray-600">
                      <span className="inline-block h-5 w-5 transform rounded-full bg-white transition-transform translate-x-1" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-[var(--background)] rounded-xl">
                    <div className="flex items-center gap-3">
                      {isDarkMode ? (
                        <Moon size={20} className="text-gray-600 dark:text-gray-400" />
                      ) : (
                        <Sun size={20} className="text-gray-600 dark:text-gray-400" />
                      )}
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          Modo Oscuro
                        </p>
                        <p className="text-sm text-gray-500 dark:text-[var(--muted)]">
                          Cambia entre tema claro y oscuro
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setTheme(isDarkMode ? "light" : "dark")}
                      className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                        isDarkMode
                          ? "bg-[#6366F1]"
                          : "bg-gray-300 dark:bg-gray-600"
                      }`}
                    >
                      <span
                        className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                          isDarkMode ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Account Information */}
              <div className="bg-white dark:bg-[var(--card)] rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-[var(--border)]">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Información de Cuenta
                </h3>
                <div className="space-y-2">
                  {accountItems.map((item, index) => (
                    <button
                      key={index}
                      onClick={item.onClick}
                      className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-[var(--background)] rounded-xl transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <item.icon
                          size={20}
                          className="text-gray-600 dark:text-gray-400"
                        />
                        <div className="text-left">
                          <p className="font-medium text-gray-900 dark:text-white">
                            {item.label}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-[var(--muted)]">
                            {item.description}
                          </p>
                        </div>
                      </div>
                      <ChevronRight
                        size={20}
                        className="text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors"
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* App Section */}
              <div className="bg-white dark:bg-[var(--card)] rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-[var(--border)]">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  App
                </h3>
                <div className="space-y-2">
                  {appItems.map((item, index) => (
                    <button
                      key={index}
                      onClick={item.onClick}
                      className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-[var(--background)] rounded-xl transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <item.icon
                          size={20}
                          className="text-gray-600 dark:text-gray-400"
                        />
                        <div className="text-left">
                          <p className="font-medium text-gray-900 dark:text-white">
                            {item.label}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-[var(--muted)]">
                            {item.description}
                          </p>
                        </div>
                      </div>
                      <ChevronRight
                        size={20}
                        className="text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors"
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Legal Section */}
              <div className="bg-white dark:bg-[var(--card)] rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-[var(--border)]">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Legal
                </h3>
                <div className="space-y-2">
                  {legalItems.map((item, index) => (
                    <button
                      key={index}
                      onClick={item.onClick}
                      className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-[var(--background)] rounded-xl transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <item.icon
                          size={20}
                          className="text-gray-600 dark:text-gray-400"
                        />
                        <p className="font-medium text-gray-900 dark:text-white">
                          {item.label}
                        </p>
                      </div>
                      <ChevronRight
                        size={20}
                        className="text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors"
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Support Section */}
              <div className="bg-white dark:bg-[var(--card)] rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-[var(--border)]">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Soporte
                </h3>
                <div className="space-y-2">
                  {supportItems.map((item, index) => (
                    <button
                      key={index}
                      onClick={item.onClick}
                      className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-[var(--background)] rounded-xl transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <item.icon
                          size={20}
                          className="text-gray-600 dark:text-gray-400"
                        />
                        <div className="text-left">
                          <p className="font-medium text-gray-900 dark:text-white">
                            {item.label}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-[var(--muted)]">
                            {item.description}
                          </p>
                        </div>
                      </div>
                      <ChevronRight
                        size={20}
                        className="text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

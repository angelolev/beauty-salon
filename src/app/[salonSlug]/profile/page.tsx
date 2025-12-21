'use client';

import { useParams, useRouter } from 'next/navigation';
import { LogOut, User, Mail, Phone, ChevronRight, Settings, HelpCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import Header from '@/components/layout/Header';
import Avatar from '@/components/ui/Avatar';
import Button from '@/components/ui/Button';

export default function ProfilePage() {
  const params = useParams();
  const router = useRouter();
  const salonSlug = params.salonSlug as string;
  const { user, loading, logout, isDemo } = useAuth();

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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#E91E8C]"></div>
      </div>
    );
  }

  // Not logged in state
  if (!user) {
    return (
      <div className="min-h-screen bg-white">
        <Header title="Profile" />

        <main className="p-4 lg:p-6">
          <div className="max-w-md mx-auto flex flex-col items-center justify-center min-h-[60vh]">
            <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <User size={48} className="text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Welcome to Beauty Salon
            </h2>
            <p className="text-gray-500 text-center mb-6">
              {isDemo
                ? 'Running in demo mode. Set up Firebase to enable authentication.'
                : 'Sign in to manage your bookings and profile'}
            </p>
            {!isDemo && <Button onClick={handleLogin}>Sign In</Button>}
          </div>
        </main>
      </div>
    );
  }

  const menuItems = [
    {
      icon: User,
      label: 'Personal Information',
      value: undefined,
      onClick: () => {},
    },
    {
      icon: Mail,
      label: 'Email',
      value: user.email,
      onClick: () => {},
    },
    {
      icon: Phone,
      label: 'Phone',
      value: user.phone || 'Add phone number',
      onClick: () => {},
    },
  ];

  const settingsItems = [
    {
      icon: Settings,
      label: 'Settings',
      onClick: () => {},
    },
    {
      icon: HelpCircle,
      label: 'Help & Support',
      onClick: () => {},
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header title="Profile" />

      <main className="p-4 lg:p-6">
        <div className="max-w-2xl mx-auto">
          {/* Desktop: Two column layout */}
          <div className="lg:grid lg:grid-cols-3 lg:gap-8">
            {/* Profile Header */}
            <div className="flex flex-col items-center mb-8 lg:mb-0 lg:bg-gray-50 lg:rounded-xl lg:p-6">
              <Avatar
                src={undefined}
                alt={user.name}
                size="xl"
              />
              <h2 className="mt-4 text-xl font-semibold text-gray-900">
                {user.name}
              </h2>
              <p className="text-[#8B7E8B]">{user.email}</p>

              {/* Desktop: Quick actions */}
              <div className="hidden lg:flex flex-col w-full mt-6 space-y-2">
                <Button variant="outline" fullWidth onClick={() => {}}>
                  Edit Profile
                </Button>
              </div>
            </div>

            {/* Menu Items */}
            <div className="lg:col-span-2">
              <div className="space-y-1 mb-8">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3 lg:mb-4">
                  Account
                </h3>
                {menuItems.map((item, index) => (
                  <button
                    key={index}
                    onClick={item.onClick}
                    className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <item.icon size={20} className="text-gray-500" />
                      <div className="text-left">
                        <p className="font-medium text-gray-900">{item.label}</p>
                        {item.value && (
                          <p className="text-sm text-[#8B7E8B]">{item.value}</p>
                        )}
                      </div>
                    </div>
                    <ChevronRight size={20} className="text-gray-400" />
                  </button>
                ))}
              </div>

              {/* Settings Section */}
              <div className="space-y-1 mb-8">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3 lg:mb-4">
                  Settings
                </h3>
                {settingsItems.map((item, index) => (
                  <button
                    key={index}
                    onClick={item.onClick}
                    className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <item.icon size={20} className="text-gray-500" />
                      <p className="font-medium text-gray-900">{item.label}</p>
                    </div>
                    <ChevronRight size={20} className="text-gray-400" />
                  </button>
                ))}
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-4 p-4 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
              >
                <LogOut size={20} />
                <span className="font-medium">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

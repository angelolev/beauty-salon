'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Plus,
  Store,
  MapPin,
  Phone,
  Mail,
  Settings,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useAdmin } from '@/context/AdminContext';
import Button from '@/components/ui/Button';

export default function SalonsListPage() {
  const router = useRouter();
  const { isSuperAdmin } = useAuth();
  const { managedSalons, loading, setCurrentSalonId } = useAdmin();

  // Redirect non-superadmins
  useEffect(() => {
    if (!loading && !isSuperAdmin) {
      router.push('/admin/dashboard');
    }
  }, [loading, isSuperAdmin, router]);

  const handleSelectSalon = (salonId: string) => {
    setCurrentSalonId(salonId);
    router.push(`/admin/salons/${salonId}/services`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isSuperAdmin) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Salones</h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Gestiona todos los salones de la plataforma
          </p>
        </div>
        <Link href="/admin/salons/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Salón
          </Button>
        </Link>
      </div>

      {/* Salons Grid */}
      {managedSalons.length === 0 ? (
        <div className="text-center py-12">
          <Store className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-semibold text-gray-900 dark:text-white">No hay salones</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Comienza creando tu primer salón
          </p>
          <div className="mt-6">
            <Link href="/admin/salons/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Crear Salón
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {managedSalons.map((salon) => (
            <div
              key={salon.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
            >
              {/* Cover Image */}
              <div className="h-32 bg-gradient-to-r from-primary/20 to-primary/10 relative">
                {salon.coverImage && (
                  <img
                    src={salon.coverImage}
                    alt={salon.name}
                    className="w-full h-full object-cover"
                  />
                )}
                {salon.logo && (
                  <div className="absolute -bottom-6 left-4">
                    <img
                      src={salon.logo}
                      alt={`${salon.name} logo`}
                      className="h-12 w-12 rounded-lg border-2 border-white dark:border-gray-800 object-cover bg-white"
                    />
                  </div>
                )}
              </div>

              <div className="p-4 pt-8">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {salon.name}
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                  {salon.description}
                </p>

                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <MapPin className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate">{salon.address}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <Phone className="h-4 w-4 flex-shrink-0" />
                    <span>{salon.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <Mail className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate">{salon.email}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
                  <button
                    onClick={() => handleSelectSalon(salon.id)}
                    className="text-sm text-primary hover:text-primary/80 font-medium flex items-center gap-1"
                  >
                    Gestionar
                    <ChevronRight className="h-4 w-4" />
                  </button>
                  <Link
                    href={`/admin/salons/${salon.id}/settings`}
                    className="p-2 text-gray-400 hover:text-gray-500 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <Settings className="h-5 w-5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

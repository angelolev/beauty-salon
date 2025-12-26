'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  Plus,
  Search,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Users,
  Calendar,
} from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';
import { useAuth } from '@/context/AuthContext';
import { Stylist, Service } from '@/types';
import { demoStylists, demoServices } from '@/lib/demo-data';
import Button from '@/components/ui/Button';
import Avatar from '@/components/ui/Avatar';

export default function StylistsPage() {
  const params = useParams();
  const salonId = params.salonId as string;
  const { permissions } = useAdmin();
  const { isDemo } = useAuth();
  const [stylists, setStylists] = useState<Stylist[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (isDemo) {
        setStylists(demoStylists);
        setServices(demoServices);
        setLoading(false);
        return;
      }
      // TODO: Fetch from Firebase
      setStylists(demoStylists);
      setServices(demoServices);
      setLoading(false);
    };

    fetchData();
  }, [salonId, isDemo]);

  // Filter stylists
  const filteredStylists = stylists.filter(stylist =>
    stylist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    stylist.specialty.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get service names for a stylist
  const getStylistServices = (serviceIds: string[]) => {
    return services
      .filter(s => serviceIds.includes(s.id))
      .map(s => s.name);
  };

  const handleToggleActive = async (stylistId: string, currentActive: boolean) => {
    setStylists(prev => prev.map(s =>
      s.id === stylistId ? { ...s, active: !currentActive } : s
    ));
    setActiveMenu(null);
  };

  const handleDelete = async (stylistId: string) => {
    if (!confirm('¿Estás seguro de eliminar este estilista?')) return;
    setStylists(prev => prev.filter(s => s.id !== stylistId));
    setActiveMenu(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Estilistas</h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Gestiona el equipo de profesionales de tu salón
          </p>
        </div>
        {permissions.canManageStylists && (
          <Link href={`/admin/salons/${salonId}/stylists/new`}>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Estilista
            </Button>
          </Link>
        )}
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar estilistas..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Stylists Grid */}
      {filteredStylists.length === 0 ? (
        <div className="text-center py-12">
          <Users className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-semibold text-gray-900 dark:text-white">No hay estilistas</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {searchQuery
              ? 'No se encontraron estilistas con ese nombre'
              : 'Comienza agregando un nuevo estilista'}
          </p>
          {permissions.canManageStylists && !searchQuery && (
            <div className="mt-6">
              <Link href={`/admin/salons/${salonId}/stylists/new`}>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Nuevo Estilista
                </Button>
              </Link>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStylists.map((stylist) => {
            const stylistServices = getStylistServices(stylist.serviceIds);
            return (
              <div
                key={stylist.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar
                        src={stylist.avatar}
                        alt={stylist.name}
                        size="lg"
                      />
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                          {stylist.name}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {stylist.specialty}
                        </p>
                        <span className={`mt-1 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          stylist.active
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                        }`}>
                          {stylist.active ? 'Activo' : 'Inactivo'}
                        </span>
                      </div>
                    </div>
                    <div className="relative">
                      <button
                        onClick={() => setActiveMenu(activeMenu === stylist.id ? null : stylist.id)}
                        className="p-2 text-gray-400 hover:text-gray-500 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <MoreVertical className="h-5 w-5" />
                      </button>
                      {activeMenu === stylist.id && (
                        <div className="absolute right-0 mt-2 w-48 rounded-lg bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 z-10">
                          <div className="py-1">
                            <Link
                              href={`/admin/salons/${salonId}/stylists/${stylist.id}`}
                              className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                              onClick={() => setActiveMenu(null)}
                            >
                              <Edit className="h-4 w-4 mr-3" />
                              Editar
                            </Link>
                            <Link
                              href={`/admin/salons/${salonId}/stylists/${stylist.id}/availability`}
                              className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                              onClick={() => setActiveMenu(null)}
                            >
                              <Calendar className="h-4 w-4 mr-3" />
                              Disponibilidad
                            </Link>
                            <button
                              onClick={() => handleToggleActive(stylist.id, stylist.active)}
                              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                              {stylist.active ? (
                                <>
                                  <EyeOff className="h-4 w-4 mr-3" />
                                  Desactivar
                                </>
                              ) : (
                                <>
                                  <Eye className="h-4 w-4 mr-3" />
                                  Activar
                                </>
                              )}
                            </button>
                            <button
                              onClick={() => handleDelete(stylist.id)}
                              className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                              <Trash2 className="h-4 w-4 mr-3" />
                              Eliminar
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {stylist.bio && (
                    <p className="mt-4 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                      {stylist.bio}
                    </p>
                  )}

                  <div className="mt-4">
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                      Servicios ({stylistServices.length})
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {stylistServices.slice(0, 3).map((serviceName, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                        >
                          {serviceName}
                        </span>
                      ))}
                      {stylistServices.length > 3 && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                          +{stylistServices.length - 3} más
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="px-6 py-3 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between text-sm">
                    <Link
                      href={`/admin/salons/${salonId}/stylists/${stylist.id}`}
                      className="text-primary hover:text-primary/80 font-medium"
                    >
                      Ver detalles
                    </Link>
                    <Link
                      href={`/admin/salons/${salonId}/stylists/${stylist.id}/availability`}
                      className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                    >
                      Horarios
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

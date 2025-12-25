'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import {
  Search,
  Calendar,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  MoreVertical,
  Eye,
} from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';
import { useAuth } from '@/context/AuthContext';
import { Booking, Service, Stylist } from '@/types';
import { demoServices, demoStylists } from '@/lib/demo-data';
import { formatCurrency, formatDate } from '@/utils/formatters';

// Demo bookings for development
const demoBookings: (Booking & { customerName: string; customerEmail: string })[] = [
  {
    id: '1',
    userId: 'user1',
    customerName: 'María García',
    customerEmail: 'maria@example.com',
    serviceIds: ['1', '2'],
    stylistId: '1',
    assignedStylistId: '1',
    date: { seconds: Date.now() / 1000, nanoseconds: 0 } as any,
    startTime: '10:00',
    endTime: '11:00',
    status: 'confirmed',
    subtotal: 80,
    tax: 14.4,
    total: 94.4,
    createdAt: { seconds: Date.now() / 1000, nanoseconds: 0 } as any,
  },
  {
    id: '2',
    userId: 'user2',
    customerName: 'Ana López',
    customerEmail: 'ana@example.com',
    serviceIds: ['3'],
    stylistId: '2',
    assignedStylistId: '2',
    date: { seconds: Date.now() / 1000, nanoseconds: 0 } as any,
    startTime: '14:00',
    endTime: '15:00',
    status: 'pending',
    subtotal: 60,
    tax: 10.8,
    total: 70.8,
    createdAt: { seconds: Date.now() / 1000, nanoseconds: 0 } as any,
  },
  {
    id: '3',
    userId: 'user3',
    customerName: 'Carlos Ruiz',
    customerEmail: 'carlos@example.com',
    serviceIds: ['1'],
    stylistId: null,
    assignedStylistId: '3',
    date: { seconds: (Date.now() - 86400000) / 1000, nanoseconds: 0 } as any,
    startTime: '16:00',
    endTime: '16:30',
    status: 'completed',
    subtotal: 35,
    tax: 6.3,
    total: 41.3,
    createdAt: { seconds: (Date.now() - 86400000) / 1000, nanoseconds: 0 } as any,
  },
  {
    id: '4',
    userId: 'user4',
    customerName: 'Laura Martínez',
    customerEmail: 'laura@example.com',
    serviceIds: ['2', '4'],
    stylistId: '1',
    assignedStylistId: '1',
    date: { seconds: (Date.now() - 172800000) / 1000, nanoseconds: 0 } as any,
    startTime: '11:00',
    endTime: '12:00',
    status: 'cancelled',
    subtotal: 75,
    tax: 13.5,
    total: 88.5,
    createdAt: { seconds: (Date.now() - 172800000) / 1000, nanoseconds: 0 } as any,
  },
];

type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

const statusConfig: Record<BookingStatus, { label: string; color: string; icon: React.ElementType }> = {
  pending: { label: 'Pendiente', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400', icon: Clock },
  confirmed: { label: 'Confirmada', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400', icon: CheckCircle },
  completed: { label: 'Completada', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400', icon: CheckCircle },
  cancelled: { label: 'Cancelada', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400', icon: XCircle },
};

export default function BookingsPage() {
  const params = useParams();
  const salonId = params.salonId as string;
  const { permissions } = useAdmin();
  const { isDemo } = useAuth();
  const [bookings, setBookings] = useState<(Booking & { customerName: string; customerEmail: string })[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [stylists, setStylists] = useState<Stylist[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (isDemo) {
        setBookings(demoBookings);
        setServices(demoServices);
        setStylists(demoStylists);
        setLoading(false);
        return;
      }
      // TODO: Fetch from Firebase
      setBookings(demoBookings);
      setServices(demoServices);
      setStylists(demoStylists);
      setLoading(false);
    };

    fetchData();
  }, [salonId, isDemo]);

  // Filter bookings
  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = booking.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         booking.customerEmail.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Get service names for a booking
  const getBookingServices = (serviceIds: string[]) => {
    return services
      .filter(s => serviceIds.includes(s.id))
      .map(s => s.name);
  };

  // Get stylist name
  const getStylistName = (stylistId: string) => {
    const stylist = stylists.find(s => s.id === stylistId);
    return stylist?.name || 'Sin asignar';
  };

  const handleUpdateStatus = async (bookingId: string, newStatus: BookingStatus) => {
    setBookings(prev => prev.map(b =>
      b.id === bookingId ? { ...b, status: newStatus } : b
    ));
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
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Reservas</h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Gestiona las reservas de tus clientes
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por cliente..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="all">Todos los estados</option>
          <option value="pending">Pendientes</option>
          <option value="confirmed">Confirmadas</option>
          <option value="completed">Completadas</option>
          <option value="cancelled">Canceladas</option>
        </select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {(['pending', 'confirmed', 'completed', 'cancelled'] as BookingStatus[]).map(status => {
          const config = statusConfig[status];
          const count = bookings.filter(b => b.status === status).length;
          return (
            <button
              key={status}
              onClick={() => setStatusFilter(status === statusFilter ? 'all' : status)}
              className={`p-4 rounded-lg border transition-colors ${
                statusFilter === status
                  ? 'border-primary bg-primary/5'
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-gray-900 dark:text-white">{count}</span>
                <config.icon className={`h-5 w-5 ${
                  status === 'pending' ? 'text-yellow-500' :
                  status === 'confirmed' ? 'text-blue-500' :
                  status === 'completed' ? 'text-green-500' :
                  'text-red-500'
                }`} />
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{config.label}</p>
            </button>
          );
        })}
      </div>

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <div className="text-center py-12">
          <Calendar className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-semibold text-gray-900 dark:text-white">No hay reservas</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {searchQuery || statusFilter !== 'all'
              ? 'No se encontraron reservas con los filtros aplicados'
              : 'Las reservas aparecerán aquí cuando los clientes las realicen'}
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Servicios
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Fecha y Hora
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Estilista
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="relative px-6 py-3">
                    <span className="sr-only">Acciones</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredBookings.map((booking) => {
                  const config = statusConfig[booking.status];
                  const bookingServices = getBookingServices(booking.serviceIds);
                  const bookingDate = new Date(booking.date.seconds * 1000);

                  return (
                    <tr key={booking.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {booking.customerName}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {booking.customerEmail}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {bookingServices.map((service, i) => (
                            <span
                              key={i}
                              className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                            >
                              {service}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        <div>{formatDate(bookingDate)}</div>
                        <div className="text-gray-500 dark:text-gray-400">
                          {booking.startTime} - {booking.endTime}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {getStylistName(booking.assignedStylistId)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {formatCurrency(booking.total)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
                          <config.icon className="h-3 w-3" />
                          {config.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="relative">
                          <button
                            onClick={() => setActiveMenu(activeMenu === booking.id ? null : booking.id)}
                            className="p-2 text-gray-400 hover:text-gray-500 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            <MoreVertical className="h-5 w-5" />
                          </button>
                          {activeMenu === booking.id && (
                            <div className="absolute right-0 mt-2 w-48 rounded-lg bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 z-10">
                              <div className="py-1">
                                <button
                                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                  onClick={() => setActiveMenu(null)}
                                >
                                  <Eye className="h-4 w-4 mr-3" />
                                  Ver detalles
                                </button>
                                {booking.status === 'pending' && (
                                  <button
                                    onClick={() => handleUpdateStatus(booking.id, 'confirmed')}
                                    className="flex items-center w-full px-4 py-2 text-sm text-green-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                                  >
                                    <CheckCircle className="h-4 w-4 mr-3" />
                                    Confirmar
                                  </button>
                                )}
                                {booking.status === 'confirmed' && (
                                  <button
                                    onClick={() => handleUpdateStatus(booking.id, 'completed')}
                                    className="flex items-center w-full px-4 py-2 text-sm text-green-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                                  >
                                    <CheckCircle className="h-4 w-4 mr-3" />
                                    Marcar completada
                                  </button>
                                )}
                                {(booking.status === 'pending' || booking.status === 'confirmed') && (
                                  <button
                                    onClick={() => handleUpdateStatus(booking.id, 'cancelled')}
                                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                                  >
                                    <XCircle className="h-4 w-4 mr-3" />
                                    Cancelar
                                  </button>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Calendar,
  DollarSign,
  Users,
  TrendingUp,
  ArrowUpRight,
  Clock,
  Scissors,
} from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';
import { useAuth } from '@/context/AuthContext';
import { DashboardStats } from '@/types/admin';

// Demo stats for development
const demoStats: DashboardStats = {
  totalBookings: 156,
  bookingsToday: 8,
  bookingsThisWeek: 42,
  bookingsThisMonth: 156,
  revenue: {
    today: 450,
    thisWeek: 2850,
    thisMonth: 12500,
    total: 45000,
  },
  popularServices: [
    { serviceId: '1', name: 'Corte de Cabello', count: 45 },
    { serviceId: '2', name: 'Manicura', count: 32 },
    { serviceId: '3', name: 'Tratamiento Facial', count: 28 },
    { serviceId: '4', name: 'Coloración', count: 24 },
  ],
  busyHours: [
    { hour: 9, count: 12 },
    { hour: 10, count: 18 },
    { hour: 11, count: 22 },
    { hour: 12, count: 15 },
    { hour: 13, count: 8 },
    { hour: 14, count: 14 },
    { hour: 15, count: 20 },
    { hour: 16, count: 25 },
    { hour: 17, count: 18 },
  ],
  topStylists: [
    { stylistId: '1', name: 'Ava Bennett', bookingCount: 42, revenue: 3500 },
    { stylistId: '2', name: 'Chloe Davis', bookingCount: 38, revenue: 3200 },
    { stylistId: '3', name: 'Isabella Clark', bookingCount: 35, revenue: 2900 },
  ],
  customerCount: 89,
  cancellationRate: 5.2,
};

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: React.ElementType;
  href?: string;
}

function StatCard({ title, value, change, changeType = 'neutral', icon: Icon, href }: StatCardProps) {
  const content = (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
          <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
          {change && (
            <p className={`mt-2 text-sm flex items-center gap-1 ${
              changeType === 'positive' ? 'text-green-600' :
              changeType === 'negative' ? 'text-red-600' :
              'text-gray-500'
            }`}>
              {changeType === 'positive' && <TrendingUp className="h-4 w-4" />}
              {change}
            </p>
          )}
        </div>
        <div className="flex-shrink-0">
          <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <Icon className="h-6 w-6 text-primary" />
          </div>
        </div>
      </div>
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}

export default function AdminDashboardPage() {
  const { currentSalonId, currentSalon, loading } = useAdmin();
  const { isDemo } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    // In demo mode or while loading, use demo stats
    if (isDemo || !currentSalonId) {
      setStats(demoStats);
      return;
    }

    // TODO: Fetch real stats from Firebase
    setStats(demoStats);
  }, [currentSalonId, isDemo]);

  if (loading || !stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Welcome message */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Bienvenido al Panel de Administración
        </h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {currentSalon ? `Gestionando: ${currentSalon.name}` : 'Selecciona un salón para comenzar'}
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Reservas Hoy"
          value={stats.bookingsToday}
          change="+12% vs ayer"
          changeType="positive"
          icon={Calendar}
          href={currentSalonId ? `/admin/salons/${currentSalonId}/bookings` : undefined}
        />
        <StatCard
          title="Ingresos del Mes"
          value={formatCurrency(stats.revenue.thisMonth)}
          change="+8% vs mes anterior"
          changeType="positive"
          icon={DollarSign}
          href={currentSalonId ? `/admin/salons/${currentSalonId}/analytics` : undefined}
        />
        <StatCard
          title="Clientes Activos"
          value={stats.customerCount}
          change="+5 nuevos esta semana"
          changeType="positive"
          icon={Users}
          href={currentSalonId ? `/admin/salons/${currentSalonId}/customers` : undefined}
        />
        <StatCard
          title="Tasa de Cancelación"
          value={`${stats.cancellationRate}%`}
          change="-2% vs mes anterior"
          changeType="positive"
          icon={TrendingUp}
        />
      </div>

      {/* Two column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Popular Services */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Servicios Populares
            </h3>
            {currentSalonId && (
              <Link
                href={`/admin/salons/${currentSalonId}/services`}
                className="text-sm text-primary hover:text-primary/80 flex items-center gap-1"
              >
                Ver todos <ArrowUpRight className="h-4 w-4" />
              </Link>
            )}
          </div>
          <div className="space-y-4">
            {stats.popularServices.map((service, index) => (
              <div key={service.serviceId} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${
                    index === 0 ? 'bg-yellow-100 text-yellow-600' :
                    index === 1 ? 'bg-gray-100 text-gray-600' :
                    index === 2 ? 'bg-orange-100 text-orange-600' :
                    'bg-gray-50 text-gray-500'
                  }`}>
                    <Scissors className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {service.name}
                  </span>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {service.count} reservas
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Stylists */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Top Estilistas
            </h3>
            {currentSalonId && (
              <Link
                href={`/admin/salons/${currentSalonId}/stylists`}
                className="text-sm text-primary hover:text-primary/80 flex items-center gap-1"
              >
                Ver todos <ArrowUpRight className="h-4 w-4" />
              </Link>
            )}
          </div>
          <div className="space-y-4">
            {stats.topStylists.map((stylist, index) => (
              <div key={stylist.stylistId} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    index === 0 ? 'bg-yellow-100 text-yellow-600' :
                    index === 1 ? 'bg-gray-100 text-gray-600' :
                    'bg-orange-100 text-orange-600'
                  }`}>
                    {index + 1}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {stylist.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {stylist.bookingCount} citas
                    </p>
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {formatCurrency(stylist.revenue)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Busy Hours */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Horas Más Ocupadas
          </h3>
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <Clock className="h-4 w-4" />
            Este mes
          </div>
        </div>
        <div className="flex items-end gap-2 h-32">
          {stats.busyHours.map((hour) => {
            const maxCount = Math.max(...stats.busyHours.map(h => h.count));
            const height = (hour.count / maxCount) * 100;
            return (
              <div key={hour.hour} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full bg-primary/20 rounded-t-sm hover:bg-primary/30 transition-colors relative group"
                  style={{ height: `${height}%` }}
                >
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {hour.count} citas
                  </div>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {hour.hour}:00
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Acciones Rápidas
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {currentSalonId && (
            <>
              <Link
                href={`/admin/salons/${currentSalonId}/services/new`}
                className="flex flex-col items-center gap-2 p-4 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              >
                <Scissors className="h-6 w-6 text-primary" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  Nuevo Servicio
                </span>
              </Link>
              <Link
                href={`/admin/salons/${currentSalonId}/stylists/new`}
                className="flex flex-col items-center gap-2 p-4 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              >
                <Users className="h-6 w-6 text-primary" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  Nuevo Estilista
                </span>
              </Link>
              <Link
                href={`/admin/salons/${currentSalonId}/bookings`}
                className="flex flex-col items-center gap-2 p-4 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              >
                <Calendar className="h-6 w-6 text-primary" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  Ver Reservas
                </span>
              </Link>
              <Link
                href={`/admin/salons/${currentSalonId}/analytics`}
                className="flex flex-col items-center gap-2 p-4 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              >
                <TrendingUp className="h-6 w-6 text-primary" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  Ver Analíticas
                </span>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

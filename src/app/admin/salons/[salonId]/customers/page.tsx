'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  Search,
  Users,
  Mail,
  Phone,
  Calendar,
  DollarSign,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { formatCurrency, formatDate } from '@/utils/formatters';

// Demo customers for development
interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  totalBookings: number;
  totalSpent: number;
  lastVisit: Date | null;
  createdAt: Date;
}

const demoCustomers: Customer[] = [
  {
    id: 'user1',
    name: 'María García',
    email: 'maria@example.com',
    phone: '+51 999 888 777',
    totalBookings: 12,
    totalSpent: 850,
    lastVisit: new Date(Date.now() - 86400000 * 2),
    createdAt: new Date(Date.now() - 86400000 * 120),
  },
  {
    id: 'user2',
    name: 'Ana López',
    email: 'ana@example.com',
    phone: '+51 999 777 666',
    totalBookings: 8,
    totalSpent: 520,
    lastVisit: new Date(Date.now() - 86400000 * 7),
    createdAt: new Date(Date.now() - 86400000 * 90),
  },
  {
    id: 'user3',
    name: 'Carlos Ruiz',
    email: 'carlos@example.com',
    totalBookings: 5,
    totalSpent: 280,
    lastVisit: new Date(Date.now() - 86400000 * 14),
    createdAt: new Date(Date.now() - 86400000 * 60),
  },
  {
    id: 'user4',
    name: 'Laura Martínez',
    email: 'laura@example.com',
    phone: '+51 999 555 444',
    totalBookings: 3,
    totalSpent: 180,
    lastVisit: new Date(Date.now() - 86400000 * 30),
    createdAt: new Date(Date.now() - 86400000 * 45),
  },
  {
    id: 'user5',
    name: 'Pedro Sánchez',
    email: 'pedro@example.com',
    totalBookings: 1,
    totalSpent: 45,
    lastVisit: new Date(Date.now() - 86400000 * 5),
    createdAt: new Date(Date.now() - 86400000 * 10),
  },
];

export default function CustomersPage() {
  const params = useParams();
  const salonId = params.salonId as string;
  const { isDemo } = useAuth();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'totalSpent' | 'lastVisit'>('lastVisit');

  useEffect(() => {
    const fetchCustomers = async () => {
      if (isDemo) {
        setCustomers(demoCustomers);
        setLoading(false);
        return;
      }
      // TODO: Fetch from Firebase
      setCustomers(demoCustomers);
      setLoading(false);
    };

    fetchCustomers();
  }, [salonId, isDemo]);

  // Filter and sort customers
  const filteredCustomers = customers
    .filter(customer =>
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phone?.includes(searchQuery)
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'totalSpent':
          return b.totalSpent - a.totalSpent;
        case 'lastVisit':
          if (!a.lastVisit) return 1;
          if (!b.lastVisit) return -1;
          return b.lastVisit.getTime() - a.lastVisit.getTime();
        default:
          return 0;
      }
    });

  // Calculate totals
  const totalCustomers = customers.length;
  const totalRevenue = customers.reduce((sum, c) => sum + c.totalSpent, 0);
  const avgPerCustomer = totalCustomers > 0 ? totalRevenue / totalCustomers : 0;

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
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Clientes</h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Gestiona la información de tus clientes
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalCustomers}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total clientes</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(totalRevenue)}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Ingresos totales</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(avgPerCustomer)}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Promedio por cliente</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nombre, email o teléfono..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
          className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="lastVisit">Última visita</option>
          <option value="totalSpent">Mayor gasto</option>
          <option value="name">Nombre A-Z</option>
        </select>
      </div>

      {/* Customers List */}
      {filteredCustomers.length === 0 ? (
        <div className="text-center py-12">
          <Users className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-semibold text-gray-900 dark:text-white">No hay clientes</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {searchQuery
              ? 'No se encontraron clientes con esa búsqueda'
              : 'Los clientes aparecerán aquí cuando realicen reservas'}
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredCustomers.map((customer) => (
              <li key={customer.id}>
                <Link
                  href={`/admin/salons/${salonId}/customers/${customer.id}`}
                  className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-primary font-medium text-lg">
                        {customer.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {customer.name}
                      </p>
                      <div className="flex items-center gap-3 mt-1 text-sm text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {customer.email}
                        </span>
                        {customer.phone && (
                          <span className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {customer.phone}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="hidden sm:block text-right">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {customer.totalBookings} reservas
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {formatCurrency(customer.totalSpent)} gastado
                      </p>
                    </div>
                    <div className="hidden md:block text-right">
                      <p className="text-xs text-gray-500 dark:text-gray-400">Última visita</p>
                      <p className="text-sm text-gray-900 dark:text-white">
                        {customer.lastVisit
                          ? formatDate(customer.lastVisit)
                          : 'Nunca'}
                      </p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  Users,
  Scissors,
} from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';

// Demo data for charts
const revenueData = [
  { name: 'Ene', revenue: 4500, bookings: 45 },
  { name: 'Feb', revenue: 5200, bookings: 52 },
  { name: 'Mar', revenue: 4800, bookings: 48 },
  { name: 'Abr', revenue: 6100, bookings: 61 },
  { name: 'May', revenue: 5800, bookings: 58 },
  { name: 'Jun', revenue: 7200, bookings: 72 },
  { name: 'Jul', revenue: 6800, bookings: 68 },
  { name: 'Ago', revenue: 7500, bookings: 75 },
  { name: 'Sep', revenue: 8200, bookings: 82 },
  { name: 'Oct', revenue: 7900, bookings: 79 },
  { name: 'Nov', revenue: 9100, bookings: 91 },
  { name: 'Dic', revenue: 10500, bookings: 105 },
];

const serviceData = [
  { name: 'Cortes', value: 35, color: '#FF9EAA' },
  { name: 'Coloración', value: 25, color: '#FFB347' },
  { name: 'Manicura', value: 20, color: '#87CEEB' },
  { name: 'Faciales', value: 12, color: '#98D8C8' },
  { name: 'Otros', value: 8, color: '#DDA0DD' },
];

const weeklyData = [
  { name: 'Lun', bookings: 12, revenue: 540 },
  { name: 'Mar', bookings: 15, revenue: 675 },
  { name: 'Mié', bookings: 18, revenue: 810 },
  { name: 'Jue', bookings: 14, revenue: 630 },
  { name: 'Vie', bookings: 22, revenue: 990 },
  { name: 'Sáb', bookings: 28, revenue: 1260 },
  { name: 'Dom', bookings: 8, revenue: 360 },
];

const hourlyData = [
  { hour: '9:00', count: 5 },
  { hour: '10:00', count: 8 },
  { hour: '11:00', count: 12 },
  { hour: '12:00', count: 10 },
  { hour: '13:00', count: 4 },
  { hour: '14:00', count: 7 },
  { hour: '15:00', count: 11 },
  { hour: '16:00', count: 15 },
  { hour: '17:00', count: 13 },
  { hour: '18:00', count: 6 },
];

interface StatCardProps {
  title: string;
  value: string;
  change: number;
  icon: React.ElementType;
}

function StatCard({ title, value, change, icon: Icon }: StatCardProps) {
  const isPositive = change >= 0;
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
          <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
          <div className={`mt-2 flex items-center text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {isPositive ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
            <span>{isPositive ? '+' : ''}{change}% vs mes anterior</span>
          </div>
        </div>
        <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
          <Icon className="h-6 w-6 text-primary" />
        </div>
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  const params = useParams();
  const [dateRange, setDateRange] = useState<'week' | 'month' | 'year'>('month');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Analíticas</h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Visualiza el rendimiento de tu salón
          </p>
        </div>
        <div className="flex gap-2">
          {(['week', 'month', 'year'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setDateRange(range)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                dateRange === range
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {range === 'week' ? 'Semana' : range === 'month' ? 'Mes' : 'Año'}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Ingresos"
          value={formatCurrency(12500)}
          change={12}
          icon={DollarSign}
        />
        <StatCard
          title="Reservas"
          value="156"
          change={8}
          icon={Calendar}
        />
        <StatCard
          title="Nuevos Clientes"
          value="24"
          change={15}
          icon={Users}
        />
        <StatCard
          title="Servicios Realizados"
          value="203"
          change={-3}
          icon={Scissors}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Ingresos Mensuales
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} />
                <YAxis stroke="#9CA3AF" fontSize={12} tickFormatter={(v) => `S/${v/1000}k`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                  formatter={(value: number) => [formatCurrency(value), 'Ingresos']}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#FF9EAA"
                  strokeWidth={3}
                  dot={{ fill: '#FF9EAA', strokeWidth: 2 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Services Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Servicios Más Populares
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={serviceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {serviceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                  formatter={(value: number) => [`${value}%`, 'Porcentaje']}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Weekly Bookings */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Reservas por Día
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} />
                <YAxis stroke="#9CA3AF" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                />
                <Bar dataKey="bookings" fill="#FF9EAA" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Hourly Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Horas Más Ocupadas
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hourlyData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                <XAxis type="number" stroke="#9CA3AF" fontSize={12} />
                <YAxis dataKey="hour" type="category" stroke="#9CA3AF" fontSize={12} width={50} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                  formatter={(value: number) => [`${value} reservas`, 'Total']}
                />
                <Bar dataKey="count" fill="#87CEEB" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top Performers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Stylists */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Top Estilistas
          </h3>
          <div className="space-y-4">
            {[
              { name: 'Ava Bennett', bookings: 42, revenue: 3500 },
              { name: 'Chloe Davis', bookings: 38, revenue: 3200 },
              { name: 'Isabella Clark', bookings: 35, revenue: 2900 },
            ].map((stylist, index) => (
              <div key={stylist.name} className="flex items-center justify-between">
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
                      {stylist.bookings} reservas
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

        {/* Top Services */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Servicios Más Solicitados
          </h3>
          <div className="space-y-4">
            {[
              { name: 'Corte de Cabello', count: 85, revenue: 2975 },
              { name: 'Coloración', count: 52, revenue: 4680 },
              { name: 'Manicura', count: 48, revenue: 1440 },
              { name: 'Tratamiento Facial', count: 32, revenue: 1920 },
            ].map((service, index) => (
              <div key={service.name} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Scissors className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {service.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {service.count} veces
                    </p>
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {formatCurrency(service.revenue)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

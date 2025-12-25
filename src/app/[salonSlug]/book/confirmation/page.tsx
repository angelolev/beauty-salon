'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle, Calendar, Clock, User, Scissors } from 'lucide-react';
import Button from '@/components/ui/Button';
import { formatFullDate, formatTime, formatCurrency } from '@/utils/formatters';
import { useBooking, ConfirmedBooking } from '@/context/BookingContext';

export default function BookingConfirmationPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const salonSlug = params.salonSlug as string;
  const bookingId = searchParams.get('id');
  const { confirmedBookings } = useBooking();
  const [booking, setBooking] = useState<ConfirmedBooking | null>(null);

  useEffect(() => {
    if (bookingId) {
      const found = confirmedBookings.find(b => b.id === bookingId);
      if (found) {
        setBooking(found);
      }
    }
  }, [bookingId, confirmedBookings]);

  if (!booking) {
    return (
      <div className="min-h-screen bg-white dark:bg-[var(--background)] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 dark:text-gray-400 mb-4">Cargando confirmación...</p>
        </div>
      </div>
    );
  }

  const bookingDate = new Date(booking.date);
  const stylistName = booking.stylist?.name || 'Primero Disponible';
  const serviceName = booking.services.map(s => s.name).join(', ');

  return (
    <div className="min-h-screen bg-white dark:bg-[var(--background)]">
      <main className="p-4 lg:p-6">
        <div className="max-w-md mx-auto pt-8 lg:pt-16">
          {/* Success Icon */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 mb-4">
              <CheckCircle size={48} className="text-green-500 dark:text-green-400" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              ¡Reserva Confirmada!
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              Tu cita ha sido reservada exitosamente
            </p>
          </div>

          {/* Booking Details Card */}
          <div className="bg-gray-50 dark:bg-[var(--card)] rounded-2xl p-6 mb-6">
            <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-4">
              Detalles de la Cita
            </h2>

            <div className="space-y-4">
              {/* Service */}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <Scissors size={18} className="text-primary" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Servicio</p>
                  <p className="font-medium text-gray-900 dark:text-white">{serviceName}</p>
                </div>
              </div>

              {/* Stylist */}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <User size={18} className="text-primary" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Estilista</p>
                  <p className="font-medium text-gray-900 dark:text-white">{stylistName}</p>
                </div>
              </div>

              {/* Date */}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <Calendar size={18} className="text-primary" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Fecha</p>
                  <p className="font-medium text-gray-900 dark:text-white">{formatFullDate(bookingDate)}</p>
                </div>
              </div>

              {/* Time */}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <Clock size={18} className="text-primary" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Hora</p>
                  <p className="font-medium text-gray-900 dark:text-white">{formatTime(booking.time)}</p>
                </div>
              </div>
            </div>

            {/* Price Summary */}
            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-[var(--border)]">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-500 dark:text-gray-400">Subtotal</span>
                <span className="text-gray-900 dark:text-white">{formatCurrency(booking.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-500 dark:text-gray-400">Impuestos (incluidos)</span>
                <span className="text-gray-900 dark:text-white">{formatCurrency(booking.tax)}</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span className="text-gray-900 dark:text-white">Total Pagado</span>
                <span className="text-primary">{formatCurrency(booking.total)}</span>
              </div>
            </div>
          </div>

          {/* Confirmation Number */}
          <div className="text-center mb-8">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Número de Confirmación</p>
            <p className="font-mono text-lg font-semibold text-gray-900 dark:text-white">
              {booking.id.split('-').slice(-1)[0].toUpperCase()}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              fullWidth
              size="lg"
              onClick={() => router.push(`/${salonSlug}/bookings`)}
            >
              Ver Mis Reservas
            </Button>
            <Button
              variant="outline"
              fullWidth
              size="lg"
              onClick={() => router.push(`/${salonSlug}`)}
            >
              Volver al Inicio
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}

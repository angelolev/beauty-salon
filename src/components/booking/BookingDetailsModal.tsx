'use client';

import { X, Calendar, Clock, User, Scissors, CreditCard } from 'lucide-react';
import { ConfirmedBooking } from '@/context/BookingContext';
import Avatar from '@/components/ui/Avatar';
import Button from '@/components/ui/Button';
import { formatFullDate, formatTime, formatCurrency } from '@/utils/formatters';

interface BookingDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: ConfirmedBooking | null;
}

export default function BookingDetailsModal({
  isOpen,
  onClose,
  booking,
}: BookingDetailsModalProps) {
  if (!isOpen || !booking) return null;

  const bookingDate = new Date(booking.date);
  const stylistName = booking.stylist?.name || 'Primero Disponible';
  const serviceName = booking.services.map(s => s.name).join(', ');
  const totalDuration = booking.services.reduce((sum, s) => sum + s.duration, 0);
  const isPast = booking.status === 'past';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white dark:bg-[var(--card)] rounded-2xl w-full max-w-md mx-4 max-h-[80vh] mb-20 lg:mb-0 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-[var(--border)]">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Detalles de la Cita</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-[var(--border)] rounded-full transition-colors"
          >
            <X size={20} className="text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* Status Badge */}
          <div className="mb-4">
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                isPast
                  ? 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                  : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
              }`}
            >
              {isPast ? 'Completada' : 'Próxima'}
            </span>
          </div>

          {/* Stylist Section */}
          <div className="flex items-center gap-4 mb-6 pb-4 border-b border-gray-100 dark:border-[var(--border)]">
            <Avatar
              src={booking.stylist?.avatar}
              alt={stylistName}
              size="xl"
            />
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white text-lg">{stylistName}</h3>
              {booking.stylist?.specialty && (
                <p className="text-sm text-[#8B7E8B] dark:text-[var(--muted)]">{booking.stylist.specialty}</p>
              )}
            </div>
          </div>

          {/* Details */}
          <div className="space-y-4 mb-6">
            {/* Service */}
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center flex-shrink-0">
                <Scissors size={18} className="text-primary" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Servicio</p>
                <p className="font-medium text-gray-900 dark:text-white">{serviceName}</p>
                <p className="text-sm text-[#8B7E8B] dark:text-[var(--muted)]">{totalDuration} min</p>
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
          <div className="bg-gray-50 dark:bg-[var(--background)] rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <CreditCard size={18} className="text-gray-500 dark:text-gray-400" />
              <h4 className="font-medium text-gray-900 dark:text-white">Resumen de Pago</h4>
            </div>

            <div className="space-y-2 text-sm">
              {booking.services.map((service) => (
                <div key={service.id} className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">{service.name}</span>
                  <span className="text-gray-900 dark:text-white">{formatCurrency(service.price)}</span>
                </div>
              ))}
              <div className="flex justify-between pt-2 border-t border-gray-200 dark:border-[var(--border)]">
                <span className="text-gray-500 dark:text-gray-400">Subtotal</span>
                <span className="text-gray-900 dark:text-white">{formatCurrency(booking.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Impuestos (incluidos)</span>
                <span className="text-gray-900 dark:text-white">{formatCurrency(booking.tax)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-200 dark:border-[var(--border)] font-semibold">
                <span className="text-gray-900 dark:text-white">Total</span>
                <span className="text-primary">{formatCurrency(booking.total)}</span>
              </div>
            </div>
          </div>

          {/* Confirmation Number */}
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">Confirmación</p>
            <p className="font-mono text-sm text-gray-700 dark:text-gray-300">
              {booking.id.split('-').slice(-1)[0].toUpperCase()}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 dark:border-[var(--border)]">
          <Button
            variant="outline"
            fullWidth
            onClick={onClose}
          >
            Cerrar
          </Button>
        </div>
      </div>
    </div>
  );
}

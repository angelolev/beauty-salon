'use client';

import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { useBooking, ConfirmedBooking } from '@/context/BookingContext';
import { useToast } from '@/context/ToastContext';
import Avatar from '@/components/ui/Avatar';
import Button from '@/components/ui/Button';
import Header from '@/components/layout/Header';
import BookingDetailsModal from '@/components/booking/BookingDetailsModal';
import { formatDate, formatTime, formatCurrency } from '@/utils/formatters';

export default function BookingsPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const { confirmedBookings } = useBooking();
  const { success: showSuccessToast } = useToast();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [selectedBooking, setSelectedBooking] = useState<ConfirmedBooking | null>(null);

  useEffect(() => {
    if (searchParams.get('success') === 'true') {
      showSuccessToast('¡Tu reserva ha sido confirmada exitosamente!');
      window.history.replaceState({}, '', `/${params.salonSlug}/bookings`);
    }
  }, [searchParams, params.salonSlug, showSuccessToast]);

  // Update status based on current time and filter by tab
  const now = new Date();
  const filteredBookings = confirmedBookings
    .map(booking => {
      const bookingDate = new Date(booking.date);
      const [hours, minutes] = booking.time.split(':').map(Number);
      bookingDate.setHours(hours, minutes);
      return {
        ...booking,
        status: bookingDate < now ? 'past' as const : 'upcoming' as const,
      };
    })
    .filter(booking => booking.status === activeTab);

  return (
    <div className="min-h-screen bg-white dark:bg-[var(--background)]">
      <Header title="Mis Reservas" showBack />

      <main className="px-6 lg:px-10">
        <div className="w-full">
          {/* Tabs */}
          <div className="flex border-b border-gray-200 dark:border-[var(--border)] mb-8">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`flex-1 lg:flex-none lg:px-12 py-4 text-base font-bold border-b-2 transition-colors ${
                activeTab === 'upcoming'
                  ? 'border-[var(--primary)] text-[var(--foreground)]'
                  : 'border-transparent text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
              }`}
            >
              Próximas
            </button>
            <button
              onClick={() => setActiveTab('past')}
              className={`flex-1 lg:flex-none lg:px-12 py-4 text-base font-bold border-b-2 transition-colors ${
                activeTab === 'past'
                  ? 'border-[var(--primary)] text-[var(--foreground)]'
                  : 'border-transparent text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
              }`}
            >
              Pasadas
            </button>
          </div>

          {/* Bookings List - Mobile */}
          <div className="md:hidden space-y-4">
            {filteredBookings.map((booking) => {
              const stylistName = booking.stylist?.name || 'Primero Disponible';
              const serviceName = booking.services.map(s => s.name).join(', ');
              const bookingDate = new Date(booking.date);

              return (
                <div
                  key={booking.id}
                  className="flex items-center justify-between py-4 border-b border-[var(--border)] last:border-0"
                >
                  <div className="flex items-center gap-4">
                    <Avatar
                      src={booking.stylist?.avatar}
                      alt={stylistName}
                      size="lg"
                    />
                    <div>
                      <h3 className="font-bold text-[var(--foreground)]">
                        {stylistName}
                      </h3>
                      <p className="text-sm text-[var(--muted-foreground)]">
                        {formatDate(bookingDate)}, {formatTime(booking.time)}
                      </p>
                      <p className="text-sm text-[var(--muted-foreground)] line-clamp-1">{serviceName}</p>
                    </div>
                  </div>
                  <Button variant="secondary" size="sm" onClick={() => setSelectedBooking(booking)}>
                    Ver
                  </Button>
                </div>
              );
            })}
          </div>

          {/* Bookings List - Desktop: Card Grid */}
          <div className="hidden md:grid md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
            {filteredBookings.map((booking) => {
              const stylistName = booking.stylist?.name || 'Primero Disponible';
              const serviceName = booking.services.map(s => s.name).join(', ');
              const bookingDate = new Date(booking.date);

              return (
                <div
                  key={booking.id}
                  className="bg-white dark:bg-[var(--card)] rounded-[2rem] p-6 shadow-sm hover:shadow-md transition-shadow border border-transparent hover:border-[var(--border)]"
                >
                  <div className="flex items-start justify-between mb-4">
                    <Avatar
                      src={booking.stylist?.avatar}
                      alt={stylistName}
                      size="lg"
                    />
                    <span className="text-lg font-bold text-[var(--primary)] bg-[var(--primary-50)] px-3 py-1 rounded-full text-sm">
                      {formatCurrency(booking.total)}
                    </span>
                  </div>
                  
                  <div className="mb-4">
                    <h3 className="font-bold text-lg text-[var(--foreground)] mb-1">
                      {stylistName}
                    </h3>
                    <p className="text-sm text-[var(--muted-foreground)] font-medium">
                      {formatDate(bookingDate)} • {formatTime(booking.time)}
                    </p>
                  </div>
                  
                  <p className="text-sm text-[var(--secondary-500)] mb-6 line-clamp-2 h-10">{serviceName}</p>
                  
                  <Button variant="outline" fullWidth onClick={() => setSelectedBooking(booking)}>
                    Ver Detalles
                  </Button>
                </div>
              );
            })}
          </div>

          {filteredBookings.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 bg-[var(--card)] rounded-[var(--radius-xl)] shadow-sm">
              <p className="text-[var(--muted-foreground)] text-lg mb-6 font-medium">
                {activeTab === 'upcoming'
                  ? 'No hay reservas próximas'
                  : 'No hay reservas pasadas'}
              </p>
              {activeTab === 'upcoming' && (
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() =>
                    (window.location.href = `/${params.salonSlug}`)
                  }
                >
                  Reservar Ahora
                </Button>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Booking Details Modal */}
      <BookingDetailsModal
        isOpen={selectedBooking !== null}
        onClose={() => setSelectedBooking(null)}
        booking={selectedBooking}
      />
    </div>
  );
}
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { CreditCard } from 'lucide-react';
import { useSalon } from '@/context/SalonContext';
import { useBooking } from '@/context/BookingContext';
import Header from '@/components/layout/Header';
import Button from '@/components/ui/Button';
import BookingSummaryCard from '@/components/booking/BookingSummaryCard';
import EditBookingModal from '@/components/booking/EditBookingModal';
import { formatCurrency } from '@/utils/formatters';

export default function BookingSummaryPage() {
  const params = useParams();
  const router = useRouter();
  const salonSlug = params.salonSlug as string;
  const { salon } = useSalon();
  const { state, getTotalPrice, setDate, setTime } = useBooking();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleEditSave = (newDate: Date, newTime: string) => {
    setDate(newDate);
    // Need to set time after date since setDate resets time
    setTimeout(() => setTime(newTime), 0);
  };

  // Validate booking state
  useEffect(() => {
    if (state.selectedServices.length === 0) {
      router.replace(`/${salonSlug}`);
    } else if (!state.selectedDate || !state.selectedTime) {
      router.replace(`/${salonSlug}/book/datetime`);
    }
  }, [state, salonSlug, router]);

  if (state.selectedServices.length === 0 || !state.selectedDate || !state.selectedTime) {
    return null;
  }

  const subtotal = getTotalPrice();
  // Taxes are now included in the price
  const taxRate = salon?.taxRate || 0.18;
  const tax = subtotal * (taxRate / (1 + taxRate)); // Back-calculate tax from total
  const total = subtotal;

  const handleConfirmBooking = () => {
    router.push(`/${salonSlug}/book/payment`);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[var(--background)]">
      <Header title="Resumen de Reserva" showClose />

      <main className="p-4 pb-40 lg:p-6 lg:pb-6">
        <div className="max-w-2xl mx-auto">
          {/* Desktop: Two column layout */}
          <div className="lg:grid lg:grid-cols-5 lg:gap-8">
            {/* Appointment Details */}
            <section className="mb-8 lg:mb-0 lg:col-span-3">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Tu Cita</h2>
              <div className="lg:bg-gray-50 lg:dark:bg-[var(--card)] lg:rounded-xl lg:p-4">
                <BookingSummaryCard
                  services={state.selectedServices}
                  stylist={state.selectedStylist}
                  date={state.selectedDate}
                  time={state.selectedTime}
                  onEditDateTime={() => setIsEditModalOpen(true)}
                />
              </div>
            </section>

            {/* Payment Summary */}
            <section className="lg:col-span-2">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Pago</h2>
              <div className="lg:bg-gray-50 lg:dark:bg-[var(--card)] lg:rounded-xl lg:p-4">
                <div className="flex items-center gap-4 mb-4 lg:mb-6">
                  <div className="w-14 h-14 rounded-xl bg-gray-100 dark:bg-[var(--border)] lg:bg-white lg:dark:bg-[var(--background)] flex items-center justify-center">
                    <CreditCard size={24} className="text-gray-500 dark:text-gray-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{formatCurrency(total)}</h3>
                    <p className="text-sm text-[#8B7E8B] dark:text-[var(--muted)]">Total</p>
                  </div>
                </div>

                {/* Price breakdown for desktop */}
                <div className="hidden lg:block space-y-2 text-sm border-t border-gray-200 dark:border-[var(--border)] pt-4">
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Subtotal</span>
                    <span className="dark:text-white">{formatCurrency(subtotal - tax)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Impuestos (incluidos)</span>
                    <span className="dark:text-white">{formatCurrency(tax)}</span>
                  </div>
                  <div className="flex justify-between font-semibold pt-2 border-t border-gray-200 dark:border-[var(--border)]">
                    <span className="dark:text-white">Total</span>
                    <span className="dark:text-white">{formatCurrency(total)}</span>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-20 lg:bottom-0 left-0 right-0 p-4 bg-white dark:bg-[var(--card)] border-t border-gray-100 dark:border-[var(--border)] lg:relative lg:border-0 lg:mt-8">
        <div className="max-w-2xl mx-auto">
          <Button fullWidth size="lg" onClick={handleConfirmBooking}>
            Confirmar Reserva
          </Button>
        </div>
      </div>

      {/* Edit Date/Time Modal */}
      <EditBookingModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        currentDate={state.selectedDate}
        currentTime={state.selectedTime}
        onSave={handleEditSave}
      />
    </div>
  );
}
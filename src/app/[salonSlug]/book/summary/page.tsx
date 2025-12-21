'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { CreditCard } from 'lucide-react';
import { useSalon } from '@/context/SalonContext';
import { useBooking } from '@/context/BookingContext';
import Header from '@/components/layout/Header';
import Button from '@/components/ui/Button';
import BookingSummaryCard from '@/components/booking/BookingSummaryCard';
import { formatCurrency } from '@/utils/formatters';

export default function BookingSummaryPage() {
  const params = useParams();
  const router = useRouter();
  const salonSlug = params.salonSlug as string;
  const { salon } = useSalon();
  const { state, getTotalPrice } = useBooking();

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
  const taxRate = salon?.taxRate || 0.1;
  const tax = subtotal * taxRate;
  const total = subtotal + tax;

  const handleConfirmBooking = () => {
    router.push(`/${salonSlug}/book/payment`);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header title="Booking Summary" showClose />

      <main className="p-4 pb-32 lg:p-6 lg:pb-6">
        <div className="max-w-2xl mx-auto">
          {/* Desktop: Two column layout */}
          <div className="lg:grid lg:grid-cols-5 lg:gap-8">
            {/* Appointment Details */}
            <section className="mb-8 lg:mb-0 lg:col-span-3">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Appointment</h2>
              <div className="lg:bg-gray-50 lg:rounded-xl lg:p-4">
                <BookingSummaryCard
                  services={state.selectedServices}
                  stylist={state.selectedStylist}
                  date={state.selectedDate}
                  time={state.selectedTime}
                />
              </div>
            </section>

            {/* Payment Summary */}
            <section className="lg:col-span-2">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment</h2>
              <div className="lg:bg-gray-50 lg:rounded-xl lg:p-4">
                <div className="flex items-center gap-4 mb-4 lg:mb-6">
                  <div className="w-14 h-14 rounded-xl bg-gray-100 lg:bg-white flex items-center justify-center">
                    <CreditCard size={24} className="text-gray-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{formatCurrency(total)}</h3>
                    <p className="text-sm text-[#8B7E8B]">Total</p>
                  </div>
                </div>

                {/* Price breakdown for desktop */}
                <div className="hidden lg:block space-y-2 text-sm border-t border-gray-200 pt-4">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Subtotal</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Tax</span>
                    <span>{formatCurrency(tax)}</span>
                  </div>
                  <div className="flex justify-between font-semibold pt-2 border-t border-gray-200">
                    <span>Total</span>
                    <span>{formatCurrency(total)}</span>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-20 lg:bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 lg:relative lg:border-0 lg:mt-8">
        <div className="max-w-2xl mx-auto">
          <Button fullWidth size="lg" onClick={handleConfirmBooking}>
            Confirm Booking
          </Button>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { useSalon } from '@/context/SalonContext';
import { useBooking } from '@/context/BookingContext';
import Header from '@/components/layout/Header';
import Button from '@/components/ui/Button';
import Avatar from '@/components/ui/Avatar';
import PaymentMethodCard from '@/components/payment/PaymentMethodCard';
import { formatCurrency, formatTime } from '@/utils/formatters';
import { PaymentMethod } from '@/types';

// Demo payment methods
const demoPaymentMethods: PaymentMethod[] = [
  {
    id: '1',
    type: 'mastercard',
    lastFour: '4242',
    expiryMonth: 12,
    expiryYear: 2025,
    isDefault: true,
  },
  {
    id: '2',
    type: 'visa',
    lastFour: '1234',
    expiryMonth: 6,
    expiryYear: 2026,
    isDefault: false,
  },
];

export default function PaymentPage() {
  const params = useParams();
  const router = useRouter();
  const salonSlug = params.salonSlug as string;
  const { salon } = useSalon();
  const { state, getTotalPrice, reset, addConfirmedBooking } = useBooking();
  const [selectedPaymentId, setSelectedPaymentId] = useState<string | null>(
    demoPaymentMethods.find(m => m.isDefault)?.id || null
  );
  const [isProcessing, setIsProcessing] = useState(false);

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

  const stylistName = state.selectedStylist?.name || 'Primero Disponible';
  const serviceName = state.selectedServices.map(s => s.name).join(', ');

  const handleConfirmAndPay = async () => {
    if (!selectedPaymentId || !state.selectedDate || !state.selectedTime) return;

    setIsProcessing(true);

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Save the confirmed booking and get the ID
    const bookingId = addConfirmedBooking({
      services: state.selectedServices,
      stylist: state.selectedStylist,
      date: state.selectedDate.toISOString(),
      time: state.selectedTime,
      subtotal: subtotal - tax, // Save pre-tax amount as subtotal
      tax,
      total,
      status: 'upcoming',
    });

    // Reset booking state and redirect to confirmation page
    reset();
    router.push(`/${salonSlug}/book/confirmation?id=${bookingId}`);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[var(--background)]">
      <Header title="Pago" showClose />

      <main className="p-4 pb-40 lg:p-6 lg:pb-6">
        <div className="max-w-3xl mx-auto">
          {/* Desktop: Two column layout */}
          <div className="lg:grid lg:grid-cols-5 lg:gap-8">
            {/* Payment Methods */}
            <section className="mb-8 lg:mb-0 lg:col-span-3">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Método de Pago</h2>
              <div className="space-y-2 lg:bg-gray-50 lg:dark:bg-[var(--card)] lg:rounded-xl lg:p-4">
                {demoPaymentMethods.map((method) => (
                  <PaymentMethodCard
                    key={method.id}
                    method={method}
                    isSelected={selectedPaymentId === method.id}
                    onSelect={() => setSelectedPaymentId(method.id)}
                  />
                ))}
                <PaymentMethodCard
                  isAddNew
                  isSelected={false}
                  onSelect={() => {
                    alert('¡Añadir método de pago próximamente!');
                  }}
                />
              </div>
            </section>

            {/* Booking Summary */}
            <section className="lg:col-span-2">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Resumen de Reserva</h2>
              <div className="lg:bg-gray-50 lg:dark:bg-[var(--card)] lg:rounded-xl lg:p-4">
                {/* Service with Stylist */}
                <div className="flex items-center gap-4 mb-6">
                  {state.selectedStylist ? (
                    <Avatar
                      src={state.selectedStylist.avatar}
                      alt={state.selectedStylist.name}
                      size="lg"
                    />
                  ) : (
                    <div className="w-16 h-16 relative rounded-xl overflow-hidden bg-[#FDE8D7] dark:bg-[#3D2E2E] flex-shrink-0">
                      {state.selectedServices[0]?.image ? (
                        <Image
                          src={state.selectedServices[0].image}
                          alt={state.selectedServices[0].name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl">
                          💇
                        </div>
                      )}
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {serviceName} con {stylistName}
                    </h3>
                    <p className="text-sm text-[#8B7E8B] dark:text-[var(--muted)]">
                      {formatTime(state.selectedTime)} - {formatTime(
                        `${parseInt(state.selectedTime.split(':')[0]) + 1}:${state.selectedTime.split(':')[1]}`
                      )}
                    </p>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3 text-sm border-t border-gray-200 dark:border-[var(--border)] lg:border-gray-300 lg:dark:border-[var(--border)] pt-4">
                  {state.selectedServices.map((service) => (
                    <div key={service.id} className="flex justify-between">
                      <span className="text-[#8B7E8B] dark:text-[var(--muted)]">{service.name}</span>
                      <span className="text-gray-900 dark:text-white">{formatCurrency(service.price)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between">
                    <span className="text-[#8B7E8B] dark:text-[var(--muted)]">Subtotal</span>
                    <span className="text-gray-900 dark:text-white">{formatCurrency(subtotal - tax)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8B7E8B] dark:text-[var(--muted)]">Impuestos (incluidos)</span>
                    <span className="text-gray-900 dark:text-white">{formatCurrency(tax)}</span>
                  </div>
                  <div className="flex justify-between pt-3 border-t border-gray-200 dark:border-[var(--border)] lg:border-gray-300 lg:dark:border-[var(--border)]">
                    <span className="font-semibold text-gray-900 dark:text-white">Total</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{formatCurrency(total)}</span>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-20 lg:bottom-0 left-0 right-0 p-4 bg-white dark:bg-[var(--card)] border-t border-gray-100 dark:border-[var(--border)] lg:relative lg:border-0 lg:mt-8">
        <div className="max-w-3xl mx-auto">
          <Button
            fullWidth
            size="lg"
            onClick={handleConfirmAndPay}
            disabled={!selectedPaymentId || isProcessing}
            className="lg:max-w-md lg:mx-auto lg:block"
          >
            {isProcessing ? 'Procesando...' : 'Confirmar y Pagar'}
          </Button>
        </div>
      </div>
    </div>
  );
}
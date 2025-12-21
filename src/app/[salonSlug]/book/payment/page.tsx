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
  const { state, getTotalPrice, reset } = useBooking();
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
  const taxRate = salon?.taxRate || 0.1;
  const tax = subtotal * taxRate;
  const total = subtotal + tax;

  const stylistName = state.selectedStylist?.name || 'First Available';
  const serviceName = state.selectedServices.map(s => s.name).join(', ');

  const handleConfirmAndPay = async () => {
    if (!selectedPaymentId) return;

    setIsProcessing(true);

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 1500));

    // In a real app, create the booking in Firestore here

    // Reset booking state and redirect to bookings
    reset();
    router.push(`/${salonSlug}/bookings?success=true`);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header title="Payment" showClose />

      <main className="p-4 pb-32 lg:p-6 lg:pb-6">
        <div className="max-w-3xl mx-auto">
          {/* Desktop: Two column layout */}
          <div className="lg:grid lg:grid-cols-5 lg:gap-8">
            {/* Payment Methods */}
            <section className="mb-8 lg:mb-0 lg:col-span-3">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Method</h2>
              <div className="space-y-2 lg:bg-gray-50 lg:rounded-xl lg:p-4">
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
                    alert('Add payment method coming soon!');
                  }}
                />
              </div>
            </section>

            {/* Booking Summary */}
            <section className="lg:col-span-2">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Booking Summary</h2>
              <div className="lg:bg-gray-50 lg:rounded-xl lg:p-4">
                {/* Service with Stylist */}
                <div className="flex items-center gap-4 mb-6">
                  {state.selectedStylist ? (
                    <Avatar
                      src={state.selectedStylist.avatar}
                      alt={state.selectedStylist.name}
                      size="lg"
                    />
                  ) : (
                    <div className="w-16 h-16 relative rounded-xl overflow-hidden bg-[#FDE8D7] flex-shrink-0">
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
                    <h3 className="font-semibold text-gray-900">
                      {serviceName} with {stylistName}
                    </h3>
                    <p className="text-sm text-[#8B7E8B]">
                      {formatTime(state.selectedTime)} - {formatTime(
                        `${parseInt(state.selectedTime.split(':')[0]) + 1}:${state.selectedTime.split(':')[1]}`
                      )}
                    </p>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3 text-sm border-t border-gray-200 lg:border-gray-300 pt-4">
                  {state.selectedServices.map((service) => (
                    <div key={service.id} className="flex justify-between">
                      <span className="text-[#8B7E8B]">{service.name}</span>
                      <span className="text-gray-900">{formatCurrency(service.price)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between">
                    <span className="text-[#8B7E8B]">Subtotal</span>
                    <span className="text-gray-900">{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8B7E8B]">Taxes</span>
                    <span className="text-gray-900">{formatCurrency(tax)}</span>
                  </div>
                  <div className="flex justify-between pt-3 border-t border-gray-200 lg:border-gray-300">
                    <span className="font-semibold text-gray-900">Total</span>
                    <span className="font-semibold text-gray-900">{formatCurrency(total)}</span>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-20 lg:bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 lg:relative lg:border-0 lg:mt-8">
        <div className="max-w-3xl mx-auto">
          <Button
            fullWidth
            size="lg"
            onClick={handleConfirmAndPay}
            disabled={!selectedPaymentId || isProcessing}
            className="lg:max-w-md lg:mx-auto lg:block"
          >
            {isProcessing ? 'Processing...' : 'Confirm and Pay'}
          </Button>
        </div>
      </div>
    </div>
  );
}

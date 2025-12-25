'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useBooking } from '@/context/BookingContext';
import Header from '@/components/layout/Header';
import Button from '@/components/ui/Button';
import Calendar from '@/components/booking/Calendar';
import TimeSlotPicker from '@/components/booking/TimeSlotPicker';
import { TimeSlot } from '@/types';

// Generate time slots for a day (9 AM to 6 PM, 30-min intervals)
function generateTimeSlots(): TimeSlot[] {
  const slots: TimeSlot[] = [];
  for (let hour = 9; hour < 18; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      // Randomly make some slots unavailable for demo
      const available = Math.random() > 0.3;
      slots.push({ time, available });
    }
  }
  return slots;
}

export default function DateTimePage() {
  const params = useParams();
  const router = useRouter();
  const salonSlug = params.salonSlug as string;
  const { state, setDate, setTime } = useBooking();
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);

  // Check if user has selected services and stylist
  useEffect(() => {
    if (state.selectedServices.length === 0) {
      router.replace(`/${salonSlug}`);
    } else if (!state.useFirstAvailable && !state.selectedStylist) {
      router.replace(`/${salonSlug}/book/stylist`);
    }
  }, [state.selectedServices, state.useFirstAvailable, state.selectedStylist, salonSlug, router]);

  // Generate time slots when date changes
  useEffect(() => {
    if (state.selectedDate) {
      // In a real app, fetch available slots from the backend
      setTimeSlots(generateTimeSlots());
    }
  }, [state.selectedDate]);

  const handleDateSelect = (date: Date) => {
    setDate(date);
  };

  const handleTimeSelect = (time: string) => {
    setTime(time);
  };

  const handleContinue = () => {
    if (state.selectedDate && state.selectedTime) {
      router.push(`/${salonSlug}/book/summary`);
    }
  };

  const isValid = state.selectedDate !== null && state.selectedTime !== null;

  if (state.selectedServices.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[var(--background)]">
      <Header title="Reservar Cita" showClose />

      <main className="p-4 pb-40 lg:p-6 lg:pb-6">
        <div className="max-w-4xl mx-auto">
          {/* Desktop: Side by side layout */}
          <div className="lg:grid lg:grid-cols-2 lg:gap-8">
            {/* Date Selection */}
            <section className="mb-8 lg:mb-0">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Seleccionar Fecha</h2>
              <div className="lg:bg-gray-50 lg:dark:bg-[var(--card)] lg:rounded-xl lg:p-4">
                <Calendar
                  selectedDate={state.selectedDate}
                  onDateSelect={handleDateSelect}
                />
              </div>
            </section>

            {/* Time Selection */}
            <section>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Seleccionar Hora</h2>
              {state.selectedDate ? (
                <div className="lg:bg-gray-50 lg:dark:bg-[var(--card)] lg:rounded-xl lg:p-4">
                  <TimeSlotPicker
                    slots={timeSlots}
                    selectedTime={state.selectedTime}
                    onTimeSelect={handleTimeSelect}
                  />
                </div>
              ) : (
                <div className="bg-gray-50 dark:bg-[var(--card)] rounded-xl p-8 text-center">
                  <p className="text-gray-500 dark:text-gray-400">Por favor, selecciona una fecha primero</p>
                </div>
              )}
            </section>
          </div>
        </div>
      </main>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-20 lg:bottom-0 left-0 right-0 p-4 bg-white dark:bg-[var(--card)] border-t border-gray-100 dark:border-[var(--border)] lg:relative lg:border-0 lg:mt-8">
        <div className="max-w-4xl mx-auto">
          <Button
            fullWidth
            size="lg"
            onClick={handleContinue}
            disabled={!isValid}
            className="lg:max-w-md lg:mx-auto lg:block"
          >
            Reservar Cita
          </Button>
        </div>
      </div>
    </div>
  );
}
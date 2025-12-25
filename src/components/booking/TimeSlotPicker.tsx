'use client';

import { TimeSlot } from '@/types';
import { formatTime } from '@/utils/formatters';

interface TimeSlotPickerProps {
  slots: TimeSlot[];
  selectedTime: string | null;
  onTimeSelect: (time: string) => void;
}

export default function TimeSlotPicker({
  slots,
  selectedTime,
  onTimeSelect,
}: TimeSlotPickerProps) {
  const availableSlots = slots.filter(slot => slot.available);

  if (availableSlots.length === 0) {
    return (
      <p className="text-[var(--muted-foreground)] text-center py-8 bg-[var(--card)] rounded-[var(--radius-xl)] border border-[var(--border)]">
        No hay horarios disponibles para esta fecha.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {availableSlots.map((slot) => {
        const isSelected = selectedTime === slot.time;

        return (
          <button
            key={slot.time}
            onClick={() => onTimeSelect(slot.time)}
            className={`
              py-3 px-4 rounded-full text-sm font-bold transition-all duration-300
              ${isSelected
                ? 'bg-[var(--primary)] text-[var(--primary-foreground)] shadow-md transform scale-105'
                : 'bg-[var(--card)] border border-[var(--border)] text-[var(--foreground)] hover:border-[var(--primary-300)] hover:bg-[var(--primary-50)] hover:shadow-sm'
              }
            `}
          >
            {formatTime(slot.time)}
          </button>
        );
      })}
    </div>
  );
}

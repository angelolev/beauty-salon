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
      <p className="text-gray-500 text-center py-4">
        No available time slots for this date.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      {availableSlots.map((slot) => {
        const isSelected = selectedTime === slot.time;

        return (
          <button
            key={slot.time}
            onClick={() => onTimeSelect(slot.time)}
            className={`
              py-3 px-4 rounded-xl text-sm font-medium transition-colors
              ${isSelected
                ? 'bg-[#E91E8C] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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

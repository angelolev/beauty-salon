'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import Calendar from './Calendar';
import TimeSlotPicker from './TimeSlotPicker';
import Button from '@/components/ui/Button';
import { TimeSlot } from '@/types';

interface EditBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentDate: Date | null;
  currentTime: string | null;
  onSave: (date: Date, time: string) => void;
}

// Generate demo time slots
function generateTimeSlots(): TimeSlot[] {
  const slots: TimeSlot[] = [];
  for (let hour = 9; hour <= 18; hour++) {
    for (let min = 0; min < 60; min += 30) {
      if (hour === 18 && min > 0) break;
      const time = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
      slots.push({
        time,
        available: Math.random() > 0.3,
      });
    }
  }
  return slots;
}

export default function EditBookingModal({
  isOpen,
  onClose,
  currentDate,
  currentTime,
  onSave,
}: EditBookingModalProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(currentDate);
  const [selectedTime, setSelectedTime] = useState<string | null>(currentTime);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedDate(currentDate);
      setSelectedTime(currentTime);
    }
  }, [isOpen, currentDate, currentTime]);

  // Generate new time slots when date changes
  useEffect(() => {
    if (selectedDate) {
      const slots = generateTimeSlots();
      // Ensure current time is always available if same date
      if (currentDate && currentTime && selectedDate.toDateString() === currentDate.toDateString()) {
        const currentSlotIndex = slots.findIndex(s => s.time === currentTime);
        if (currentSlotIndex !== -1) {
          slots[currentSlotIndex].available = true;
        }
      }
      setTimeSlots(slots);
    }
  }, [selectedDate, currentDate, currentTime]);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setSelectedTime(null); // Reset time when date changes
  };

  const handleSave = () => {
    if (selectedDate && selectedTime) {
      onSave(selectedDate, selectedTime);
      onClose();
    }
  };

  const hasChanges =
    (selectedDate?.toDateString() !== currentDate?.toDateString()) ||
    (selectedTime !== currentTime);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white dark:bg-[var(--card)] rounded-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-[var(--border)]">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Editar Fecha y Hora</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-[var(--border)] rounded-full transition-colors"
          >
            <X size={20} className="text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Calendar */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Seleccionar Fecha</h3>
            <Calendar
              selectedDate={selectedDate}
              onDateSelect={handleDateSelect}
            />
          </div>

          {/* Time Slots */}
          {selectedDate && (
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Seleccionar Hora</h3>
              <TimeSlotPicker
                slots={timeSlots}
                selectedTime={selectedTime}
                onTimeSelect={setSelectedTime}
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 dark:border-[var(--border)] flex gap-3">
          <Button
            variant="outline"
            fullWidth
            onClick={onClose}
          >
            Cancelar
          </Button>
          <Button
            fullWidth
            onClick={handleSave}
            disabled={!selectedDate || !selectedTime || !hasChanges}
          >
            Guardar Cambios
          </Button>
        </div>
      </div>
    </div>
  );
}
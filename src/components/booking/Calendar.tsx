'use client';

import { useState } from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addMonths,
  subMonths,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
  isBefore,
  startOfDay,
} from 'date-fns';
import { es } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { DAYS_OF_WEEK_SHORT } from '@/utils/constants';

interface CalendarProps {
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
  availableDates?: Date[];
}

export default function Calendar({
  selectedDate,
  onDateSelect,
  availableDates,
}: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const today = startOfDay(new Date());

  const isDateAvailable = (date: Date) => {
    // Past dates are not available
    if (isBefore(date, today)) return false;

    // If availableDates is provided, check against it
    if (availableDates) {
      return availableDates.some(d => isSameDay(d, date));
    }

    // By default, all future dates are available
    return true;
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  return (
    <div className="w-full">
      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={goToPreviousMonth}
          className="p-2 hover:bg-gray-100 dark:hover:bg-[var(--border)] rounded-full transition-colors"
        >
          <ChevronLeft size={20} className="text-gray-600 dark:text-gray-400" />
        </button>
        <h3 className="font-semibold text-gray-900 dark:text-white capitalize">
          {format(currentMonth, 'MMMM yyyy', { locale: es })}
        </h3>
        <button
          onClick={goToNextMonth}
          className="p-2 hover:bg-gray-100 dark:hover:bg-[var(--border)] rounded-full transition-colors"
        >
          <ChevronRight size={20} className="text-gray-600 dark:text-gray-400" />
        </button>
      </div>

      {/* Day Headers */}
      <div className="grid grid-cols-7 mb-2">
        {/* Adjusted to start week on Monday for Hispanic markets usually, but DAYS_OF_WEEK_SHORT starts with D (Sunday) */}
        {/* If week starts on Monday, order should be L, M, M, J, V, S, D */}
        {/* For now keeping weekStartsOn: 0 (Sunday) to match constants order */}
        {DAYS_OF_WEEK_SHORT.map((day, index) => (
          <div
            key={index}
            className="text-center text-sm font-medium text-gray-500 dark:text-gray-400 py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => {
          const isCurrentMonth = isSameMonth(day, currentMonth);
          const isSelected = selectedDate && isSameDay(day, selectedDate);
          const isTodayDate = isToday(day);
          const available = isDateAvailable(day);

          return (
            <button
              key={index}
              onClick={() => available && onDateSelect(day)}
              disabled={!available || !isCurrentMonth}
              className={`
                aspect-square flex items-center justify-center rounded-full text-sm
                transition-colors
                ${!isCurrentMonth ? 'text-gray-300 dark:text-gray-600' : ''}
                ${isCurrentMonth && !available ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed' : ''}
                ${isCurrentMonth && available && !isSelected ? 'text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-[var(--border)]' : ''}
                ${isSelected ? 'bg-primary text-white' : ''}
                ${isTodayDate && !isSelected ? 'font-bold' : ''}
              `}
            >
              {format(day, 'd')}
            </button>
          );
        })}
      </div>
    </div>
  );
}

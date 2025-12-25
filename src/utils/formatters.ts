import { format, formatDistanceToNow, isToday, isTomorrow } from 'date-fns';
import { es } from 'date-fns/locale';

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN',
  }).format(amount);
}

export function formatTime(time: string): string {
  const [hours, minutes] = time.split(':').map(Number);
  const date = new Date();
  date.setHours(hours, minutes);
  return format(date, 'HH:mm', { locale: es });
}

export function formatDate(date: Date): string {
  if (isToday(date)) {
    return 'Hoy';
  }
  if (isTomorrow(date)) {
    return 'Mañana';
  }
  return format(date, 'EEE, d MMM', { locale: es });
}

export function formatFullDate(date: Date): string {
  return format(date, "EEEE, d 'de' MMMM 'de' yyyy", { locale: es });
}

export function formatRelativeDate(date: Date): string {
  return formatDistanceToNow(date, { addSuffix: true, locale: es });
}

export function formatBookingDateTime(date: Date, time: string): string {
  const dateStr = formatDate(date);
  const timeStr = formatTime(time);
  return `${dateStr}, ${timeStr}`;
}

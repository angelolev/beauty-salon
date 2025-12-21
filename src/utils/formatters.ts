import { format, formatDistanceToNow, isToday, isTomorrow } from 'date-fns';

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

export function formatTime(time: string): string {
  const [hours, minutes] = time.split(':').map(Number);
  const date = new Date();
  date.setHours(hours, minutes);
  return format(date, 'h:mm a');
}

export function formatDate(date: Date): string {
  if (isToday(date)) {
    return 'Today';
  }
  if (isTomorrow(date)) {
    return 'Tomorrow';
  }
  return format(date, 'EEE, MMM d');
}

export function formatFullDate(date: Date): string {
  return format(date, 'EEEE, MMMM d, yyyy');
}

export function formatRelativeDate(date: Date): string {
  return formatDistanceToNow(date, { addSuffix: true });
}

export function formatBookingDateTime(date: Date, time: string): string {
  const dateStr = formatDate(date);
  const timeStr = formatTime(time);
  return `${dateStr}, ${timeStr}`;
}

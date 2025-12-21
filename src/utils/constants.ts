export const DAYS_OF_WEEK = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

export const DAYS_OF_WEEK_SHORT = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export const SERVICE_CATEGORIES = [
  'Haircuts',
  'Manicures',
  'Facials',
  'Eyebrows',
  'Hair Coloring',
  'Spa',
];

export const DEFAULT_SLOT_DURATION = 30; // minutes

export const BOOKING_STATUSES = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  completed: 'Completed',
  cancelled: 'Cancelled',
} as const;

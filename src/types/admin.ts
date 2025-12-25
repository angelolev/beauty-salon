import { Timestamp } from 'firebase/firestore';

// Admin permissions for role-based access control
export interface AdminPermissions {
  canManageServices: boolean;
  canManageStylists: boolean;
  canManageBookings: boolean;
  canViewAnalytics: boolean;
  canManageSalonSettings: boolean;
  canManageAdminUsers: boolean; // superadmin only
  canCreateSalons: boolean; // superadmin only
}

// Dashboard statistics
export interface DashboardStats {
  totalBookings: number;
  bookingsToday: number;
  bookingsThisWeek: number;
  bookingsThisMonth: number;
  revenue: {
    today: number;
    thisWeek: number;
    thisMonth: number;
    total: number;
  };
  popularServices: Array<{
    serviceId: string;
    name: string;
    count: number;
  }>;
  busyHours: Array<{
    hour: number;
    count: number;
  }>;
  topStylists: Array<{
    stylistId: string;
    name: string;
    bookingCount: number;
    revenue: number;
  }>;
  customerCount: number;
  cancellationRate: number;
}

// Activity log for audit trail
export interface AdminActivityLog {
  id: string;
  userId: string; // admin who performed action
  userName: string;
  salonId: string; // affected salon
  action: 'create' | 'update' | 'delete' | 'cancel' | 'confirm' | 'reschedule';
  entityType: 'service' | 'stylist' | 'booking' | 'salon' | 'availability' | 'user';
  entityId: string;
  entityName?: string;
  previousValue?: Record<string, unknown>;
  newValue?: Record<string, unknown>;
  createdAt: Timestamp;
  ipAddress?: string;
}

// Booking filters for admin view
export interface BookingFilters {
  dateFrom?: Date;
  dateTo?: Date;
  status?: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  stylistId?: string;
  serviceId?: string;
  searchQuery?: string;
}

// Pagination for admin lists
export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

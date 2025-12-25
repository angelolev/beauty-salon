// Admin role configuration
// Users with these emails will automatically get admin roles when they log in

// Superadmin emails - full access to all salons
export const SUPERADMIN_EMAILS = [
  'angelokta7@gmail.com',
  // Add more superadmin emails here
];

// Salon admin configuration - email -> array of salon IDs they can manage
export const SALON_ADMIN_CONFIG: Record<string, string[]> = {
  // Example: 'manager@glamourstudio.com': ['glamour-studio'],
  // Add salon admin mappings here
};

// Helper function to get role for an email
export function getRoleForEmail(email: string): {
  role: 'superadmin' | 'salon_admin' | 'customer';
  assignedSalonIds?: string[];
} {
  const normalizedEmail = email.toLowerCase();

  if (SUPERADMIN_EMAILS.map(e => e.toLowerCase()).includes(normalizedEmail)) {
    return { role: 'superadmin' };
  }

  const salonIds = SALON_ADMIN_CONFIG[normalizedEmail];
  if (salonIds && salonIds.length > 0) {
    return { role: 'salon_admin', assignedSalonIds: salonIds };
  }

  return { role: 'customer' };
}

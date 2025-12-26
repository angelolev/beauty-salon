'use client';

import { useParams } from 'next/navigation';
import { SalonProvider, useSalon } from '@/context/SalonContext';
import { BookingProvider } from '@/context/BookingContext';
import BottomNav from '@/components/layout/BottomNav';
import Sidebar from '@/components/layout/Sidebar';
import PageTransition from '@/components/ui/PageTransition';

function SalonLayoutContent({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const salonSlug = params.salonSlug as string;
  const { salon } = useSalon();

  return (
    <div className="min-h-screen bg-white dark:bg-[var(--background)]">
      {/* Desktop Sidebar */}
      <Sidebar salonSlug={salonSlug} salonName={salon?.name} />

      {/* Main Content */}
      <div className="lg:pl-72 transition-all duration-300">
        <div className="min-h-screen bg-white dark:bg-[var(--background)]">
          <div className="w-full">
            <PageTransition>
              <div className="pb-20 lg:pb-0">
                {children}
              </div>
            </PageTransition>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Nav */}
      <BottomNav salonSlug={salonSlug} />
    </div>
  );
}

export default function SalonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const salonSlug = params.salonSlug as string;

  return (
    <SalonProvider salonSlug={salonSlug}>
      <BookingProvider>
        <SalonLayoutContent>{children}</SalonLayoutContent>
      </BookingProvider>
    </SalonProvider>
  );
}

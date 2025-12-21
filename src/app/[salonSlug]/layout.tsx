'use client';

import { useParams } from 'next/navigation';
import { SalonProvider, useSalon } from '@/context/SalonContext';
import { BookingProvider } from '@/context/BookingContext';
import BottomNav from '@/components/layout/BottomNav';
import Sidebar from '@/components/layout/Sidebar';

function SalonLayoutContent({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const salonSlug = params.salonSlug as string;
  const { salon } = useSalon();

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* Desktop Sidebar */}
      <Sidebar salonSlug={salonSlug} salonName={salon?.name} />

      {/* Main Content */}
      <div className="lg:pl-64">
        <div className="min-h-screen bg-white lg:bg-[#FAFAFA]">
          <div className="max-w-4xl mx-auto lg:py-6 lg:px-6">
            <div className="bg-white lg:rounded-2xl lg:shadow-sm min-h-screen lg:min-h-0">
              <div className="pb-20 lg:pb-6">
                {children}
              </div>
            </div>
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

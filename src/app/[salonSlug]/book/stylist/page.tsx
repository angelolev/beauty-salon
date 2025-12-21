'use client';

import { useParams, useRouter } from 'next/navigation';
import { useSalon } from '@/context/SalonContext';
import { useBooking } from '@/context/BookingContext';
import Header from '@/components/layout/Header';
import Button from '@/components/ui/Button';
import StylistCard from '@/components/booking/StylistCard';

export default function SelectStylistPage() {
  const params = useParams();
  const router = useRouter();
  const salonSlug = params.salonSlug as string;
  const { stylists, loading } = useSalon();
  const { state, setStylist, setFirstAvailable } = useBooking();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#E91E8C]"></div>
      </div>
    );
  }

  // Check if user has selected services
  if (state.selectedServices.length === 0) {
    router.replace(`/${salonSlug}`);
    return null;
  }

  const handleFirstAvailable = () => {
    setFirstAvailable(true);
  };

  const handleSelectStylist = (stylist: typeof stylists[0]) => {
    setStylist(stylist);
  };

  const handleContinue = () => {
    if (state.useFirstAvailable || state.selectedStylist) {
      router.push(`/${salonSlug}/book/datetime`);
    }
  };

  const isValid = state.useFirstAvailable || state.selectedStylist !== null;

  return (
    <div className="min-h-screen bg-white">
      <Header title="Select Stylist" showClose />

      <main className="p-4 lg:p-6">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Choose a stylist</h2>

          {/* Mobile: List view */}
          <div className="md:hidden space-y-2">
            <StylistCard
              isFirstAvailable
              isSelected={state.useFirstAvailable}
              onSelect={handleFirstAvailable}
            />
            {stylists.map((stylist) => (
              <StylistCard
                key={stylist.id}
                stylist={stylist}
                isSelected={state.selectedStylist?.id === stylist.id}
                onSelect={() => handleSelectStylist(stylist)}
              />
            ))}
          </div>

          {/* Tablet/Desktop: Grid view */}
          <div className="hidden md:grid md:grid-cols-2 gap-3">
            <StylistCard
              isFirstAvailable
              isSelected={state.useFirstAvailable}
              onSelect={handleFirstAvailable}
              variant="card"
            />
            {stylists.map((stylist) => (
              <StylistCard
                key={stylist.id}
                stylist={stylist}
                isSelected={state.selectedStylist?.id === stylist.id}
                onSelect={() => handleSelectStylist(stylist)}
                variant="card"
              />
            ))}
          </div>
        </div>
      </main>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-20 lg:bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 lg:relative lg:border-0 lg:mt-8">
        <div className="max-w-2xl mx-auto">
          <Button
            fullWidth
            size="lg"
            onClick={handleContinue}
            disabled={!isValid}
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
}

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
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--primary)]"></div>
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
    <div className="min-h-screen bg-[var(--background)] pb-24 md:pb-8">
      <Header title="Seleccionar Estilista" showClose />

      <main className="px-4 pt-4 lg:px-8 lg:pt-8 max-w-3xl mx-auto">
        <h2 className="text-xl font-bold text-[var(--foreground)] mb-6 font-[family-name:var(--font-heading)]">Elige un estilista</h2>

        <div className="space-y-4">
          {/* Mobile: List view */}
          <div className="md:hidden space-y-3">
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
          <div className="hidden md:grid md:grid-cols-2 gap-4">
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
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-[var(--background)]/90 backdrop-blur-md border-t border-[var(--border)] lg:relative lg:border-0 lg:mt-8 lg:bg-transparent lg:backdrop-blur-none z-20">
        <div className="max-w-3xl mx-auto">
          <Button
            fullWidth
            size="lg"
            onClick={handleContinue}
            disabled={!isValid}
            className="shadow-lg"
          >
            Continuar
          </Button>
        </div>
      </div>
    </div>
  );
}
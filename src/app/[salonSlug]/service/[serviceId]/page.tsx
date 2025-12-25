'use client';

import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { useSalon } from '@/context/SalonContext';
import { useBooking } from '@/context/BookingContext';
import Header from '@/components/layout/Header';
import Button from '@/components/ui/Button';
import { formatCurrency } from '@/utils/formatters';
import { Clock, Tag, Star } from 'lucide-react';

const categoryEmoji: Record<string, string> = {
  'Cortes': '💇',
  'Manicura': '💅',
  'Faciales': '🧖',
  'Cejas': '👁️',
  'Coloración': '🎨',
  'Spa': '🧘',
  // Fallback English keys just in case
  'Haircuts': '💇',
  'Manicures': '💅',
  'Eyebrows': '👁️',
  'Hair Coloring': '🎨',
};

export default function ServiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const salonSlug = params.salonSlug as string;
  const serviceId = params.serviceId as string;
  const { services, loading } = useSalon();
  const { setServices } = useBooking();

  const service = services.find(s => s.id === serviceId);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-white dark:bg-[var(--background)] flex flex-col items-center justify-center p-4">
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Servicio No Encontrado</h1>
        <p className="text-gray-500 dark:text-gray-400 text-center">
          Este servicio no existe o ha sido eliminado.
        </p>
      </div>
    );
  }

  const handleBookNow = () => {
    setServices([service]);
    router.push(`/${salonSlug}/book/stylist`);
  };

  const emoji = categoryEmoji[service.category] || '✨';

  return (
    <div className="min-h-screen bg-white dark:bg-[var(--background)]">
      <Header title={service.name} showBack />

      <main className="lg:p-6">
        <div className="max-w-4xl mx-auto">
          {/* Desktop: Side by side layout */}
          <div className="lg:grid lg:grid-cols-2 lg:gap-8">
            {/* Service Image */}
            <div className="relative h-64 lg:h-80 lg:rounded-2xl overflow-hidden bg-primary/5 dark:bg-[#3D2E2E]">
              {service.image ? (
                <Image
                  src={service.image}
                  alt={service.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-8xl">
                  {emoji}
                </div>
              )}
            </div>

            {/* Service Info */}
            <div className="p-4 pb-40 lg:p-0 lg:pb-0">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-1">{service.name}</h1>
                  <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <Clock size={16} />
                      {service.duration} min
                    </span>
                    <span className="flex items-center gap-1">
                      <Tag size={16} />
                      {service.category}
                    </span>
                  </div>
                </div>
                <span className="text-2xl lg:text-3xl font-bold text-primary">
                  {formatCurrency(service.price)}
                </span>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h2 className="font-semibold text-gray-900 dark:text-white mb-2">Sobre este servicio</h2>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {service.description || `Servicio profesional de ${service.name.toLowerCase()} proporcionado por nuestros estilistas expertos. Experimenta un cuidado de alta calidad en un ambiente relajante.`}
                </p>
              </div>

              {/* Features */}
              <div className="mb-6 lg:mb-8">
                <h2 className="font-semibold text-gray-900 dark:text-white mb-3">Qué está incluido</h2>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Star size={16} className="text-primary" />
                    Consulta profesional
                  </li>
                  <li className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Star size={16} className="text-primary" />
                    Productos premium utilizados
                  </li>
                  <li className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Star size={16} className="text-primary" />
                    Consejos de cuidado posterior incluidos
                  </li>
                </ul>
              </div>

              {/* Category Badge */}
              <div className="mb-6 lg:hidden">
                <span className="inline-block bg-gray-100 dark:bg-[var(--card)] text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full text-sm">
                  {service.category}
                </span>
              </div>

              {/* Desktop Book Button */}
              <div className="hidden lg:block">
                <Button fullWidth size="lg" onClick={handleBookNow}>
                  Reservar Ahora - {formatCurrency(service.price)}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Fixed Bottom Button */}
      <div className="lg:hidden fixed bottom-20 left-0 right-0 p-4 bg-white dark:bg-[var(--card)] border-t border-gray-100 dark:border-[var(--border)]">
        <div className="max-w-md mx-auto">
          <Button fullWidth size="lg" onClick={handleBookNow}>
            Reservar Ahora
          </Button>
        </div>
      </div>
    </div>
  );
}
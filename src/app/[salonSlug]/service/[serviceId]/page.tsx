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
  Haircuts: '💇',
  Manicures: '💅',
  Facials: '🧖',
  Eyebrows: '👁️',
  'Hair Coloring': '🎨',
  Spa: '🧘',
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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#E91E8C]"></div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h1 className="text-xl font-semibold text-gray-900 mb-2">Service Not Found</h1>
        <p className="text-gray-500 text-center">
          This service doesn&apos;t exist or may have been removed.
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
    <div className="min-h-screen bg-white">
      <Header title={service.name} showBack />

      <main className="lg:p-6">
        <div className="max-w-4xl mx-auto">
          {/* Desktop: Side by side layout */}
          <div className="lg:grid lg:grid-cols-2 lg:gap-8">
            {/* Service Image */}
            <div className="relative h-64 lg:h-80 lg:rounded-2xl overflow-hidden bg-[#FDE8D7]">
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
            <div className="p-4 lg:p-0">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-1">{service.name}</h1>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
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
                <span className="text-2xl lg:text-3xl font-bold text-[#E91E8C]">
                  {formatCurrency(service.price)}
                </span>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h2 className="font-semibold text-gray-900 mb-2">About this service</h2>
                <p className="text-gray-600 leading-relaxed">
                  {service.description || `Professional ${service.name.toLowerCase()} service provided by our expert stylists. Experience top-quality care in a relaxing environment.`}
                </p>
              </div>

              {/* Features */}
              <div className="mb-6 lg:mb-8">
                <h2 className="font-semibold text-gray-900 mb-3">What&apos;s included</h2>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-gray-600">
                    <Star size={16} className="text-[#E91E8C]" />
                    Professional consultation
                  </li>
                  <li className="flex items-center gap-2 text-gray-600">
                    <Star size={16} className="text-[#E91E8C]" />
                    Premium products used
                  </li>
                  <li className="flex items-center gap-2 text-gray-600">
                    <Star size={16} className="text-[#E91E8C]" />
                    Aftercare advice included
                  </li>
                </ul>
              </div>

              {/* Category Badge */}
              <div className="mb-6 lg:hidden">
                <span className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                  {service.category}
                </span>
              </div>

              {/* Desktop Book Button */}
              <div className="hidden lg:block">
                <Button fullWidth size="lg" onClick={handleBookNow}>
                  Book Now - {formatCurrency(service.price)}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Fixed Bottom Button */}
      <div className="lg:hidden fixed bottom-20 left-0 right-0 p-4 bg-white border-t border-gray-100">
        <div className="max-w-md mx-auto">
          <Button fullWidth size="lg" onClick={handleBookNow}>
            Book Now
          </Button>
        </div>
      </div>
    </div>
  );
}

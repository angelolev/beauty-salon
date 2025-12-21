'use client';

import { useParams } from 'next/navigation';
import { useSalon } from '@/context/SalonContext';
import Header from '@/components/layout/Header';
import FeaturedCarousel from '@/components/home/FeaturedCarousel';
import ServiceCard from '@/components/home/ServiceCard';

export default function HomePage() {
  const params = useParams();
  const salonSlug = params.salonSlug as string;
  const { salon, services, loading, error } = useSalon();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#E91E8C]"></div>
      </div>
    );
  }

  if (error || !salon) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h1 className="text-xl font-semibold text-gray-900 mb-2">Salon Not Found</h1>
        <p className="text-gray-500 text-center">
          The salon you&apos;re looking for doesn&apos;t exist or may have been removed.
        </p>
      </div>
    );
  }

  // Group services by category for featured carousel
  const categories = [...new Set(services.map(s => s.category))];
  const featuredItems = categories.slice(0, 4).map(category => {
    const categoryServices = services.filter(s => s.category === category);
    return {
      id: category,
      title: category,
      description: `Professional ${category.toLowerCase()} for all styles`,
      image: categoryServices[0]?.image || '/images/placeholder.jpg',
      href: `/${salonSlug}?category=${encodeURIComponent(category)}`,
    };
  });

  return (
    <div className="min-h-screen bg-white">
      <Header title="Home" showSearch />

      <main className="px-4 pb-4 lg:px-6 lg:pb-6">
        {/* Featured Section */}
        {featuredItems.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Featured</h2>
            <FeaturedCarousel items={featuredItems} />
          </section>
        )}

        {/* Services Section */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Services</h2>

          {/* Mobile: List view */}
          <div className="md:hidden divide-y divide-gray-100">
            {services.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                salonSlug={salonSlug}
              />
            ))}
          </div>

          {/* Tablet/Desktop: Grid view */}
          <div className="hidden md:grid md:grid-cols-2 xl:grid-cols-3 gap-4">
            {services.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                salonSlug={salonSlug}
                variant="card"
              />
            ))}
          </div>

          {services.length === 0 && (
            <p className="text-gray-500 text-center py-8">
              No services available at this time.
            </p>
          )}
        </section>
      </main>
    </div>
  );
}

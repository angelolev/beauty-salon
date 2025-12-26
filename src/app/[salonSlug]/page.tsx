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
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--primary)]"></div>
      </div>
    );
  }

  if (error || !salon) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[var(--background)]">
        <h1 className="text-xl font-bold text-[var(--foreground)] font-[family-name:var(--font-heading)] mb-2">Salón No Encontrado</h1>
        <p className="text-[var(--muted-foreground)] text-center">
          El salón que buscas no existe o ha sido eliminado.
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
      description: `Servicios profesionales de ${category.toLowerCase()} para todos los estilos`,
      image: categoryServices[0]?.image || '/images/placeholder.jpg',
      href: `/${salonSlug}?category=${encodeURIComponent(category)}`,
    };
  });

  return (
    <div className="min-h-screen bg-[var(--background)] pb-20 md:pb-8">
      <Header title="Inicio" showSearch salonSlug={salonSlug} />

      <main className="px-6 pb-6 lg:px-10 lg:pb-10 space-y-12">
        {/* Featured Section */}
        {featuredItems.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-[var(--gray-800)] dark:text-white mb-6 font-[family-name:var(--font-heading)]">Destacados</h2>
            <FeaturedCarousel items={featuredItems} />
          </section>
        )}

        {/* Services Section */}
        <section>
          <h2 className="text-2xl font-bold text-[var(--gray-800)] dark:text-white mb-6 font-[family-name:var(--font-heading)]">Servicios</h2>

          {/* Mobile: List view */}
          <div className="md:hidden divide-y divide-[var(--border)]">
            {services.map((service, index) => (
              <div key={service.id} className="stagger-item">
                <ServiceCard
                  service={service}
                  salonSlug={salonSlug}
                />
              </div>
            ))}
          </div>

          {/* Tablet/Desktop: Grid view */}
          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
            {services.map((service, index) => (
              <div key={service.id} className="stagger-item">
                <ServiceCard
                  service={service}
                  salonSlug={salonSlug}
                  variant="card"
                />
              </div>
            ))}
          </div>

          {services.length === 0 && (
            <p className="text-[var(--muted-foreground)] text-center py-12 bg-[var(--card)] rounded-[var(--radius-xl)] border border-[var(--border)]">
              No hay servicios disponibles en este momento.
            </p>
          )}
        </section>
      </main>
    </div>
  );
}
'use client';

import Image from 'next/image';
import Link from 'next/link';

interface FeaturedItem {
  id: string;
  title: string;
  description: string;
  image: string;
  href: string;
}

interface FeaturedCarouselProps {
  items: FeaturedItem[];
}

const categoryGradients: Record<string, string> = {
  'Cortes': 'from-[var(--primary-100)] to-[var(--secondary-100)] dark:from-[var(--primary-900)] dark:to-[#1A1E1B]',
  'Manicura': 'from-[var(--secondary-100)] to-[var(--accent-100)] dark:from-[var(--primary-800)] dark:to-[#1A1E1B]',
  'Faciales': 'from-[var(--accent-100)] to-[var(--primary-50)] dark:from-[var(--primary-900)] dark:to-[#1A1E1B]',
  'Cejas': 'from-[var(--secondary-200)] to-[var(--primary-100)] dark:from-[var(--primary-800)] dark:to-[#1A1E1B]',
  // Fallback English keys
  Haircuts: 'from-[var(--primary-100)] to-[var(--secondary-100)] dark:from-[var(--primary-900)] dark:to-[#1A1E1B]',
  Manicures: 'from-[var(--secondary-100)] to-[var(--accent-100)] dark:from-[var(--primary-800)] dark:to-[#1A1E1B]',
  Facials: 'from-[var(--accent-100)] to-[var(--primary-50)] dark:from-[var(--primary-900)] dark:to-[#1A1E1B]',
  Eyebrows: 'from-[var(--secondary-200)] to-[var(--primary-100)] dark:from-[var(--primary-800)] dark:to-[#1A1E1B]',
  // Default
  'Massages': 'from-[var(--primary-50)] to-[var(--accent-50)] dark:from-[var(--primary-900)] dark:to-[#1A1E1B]',
};

export default function FeaturedCarousel({ items }: FeaturedCarouselProps) {
  if (items.length === 0) return null;

  return (
    <>
      {/* Mobile: Horizontal scroll */}
      <div className="md:hidden overflow-x-auto no-scrollbar -mx-4 px-4 pb-4">
        <div className="flex gap-4" style={{ width: 'max-content' }}>
          {items.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className="w-[280px] flex-shrink-0 group"
            >
              <div className={`relative h-[180px] rounded-[var(--radius-xl)] overflow-hidden mb-3 bg-gradient-to-br ${categoryGradients[item.title] || 'from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900'} hover:shadow-lg hover:-translate-y-1 transition-all duration-300`}>
                {item.image && item.image !== '/images/placeholder.jpg' ? (
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-6xl opacity-70 grayscale-[0.3]">
                      {(item.title === 'Haircuts' || item.title === 'Cortes') && '💇'}
                      {(item.title === 'Manicures' || item.title === 'Manicura') && '💅'}
                      {(item.title === 'Facials' || item.title === 'Faciales') && '🧖'}
                      {(item.title === 'Eyebrows' || item.title === 'Cejas') && '👁️'}
                    </span>
                  </div>
                )}
              </div>
              <h3 className="font-bold text-lg text-[var(--gray-800)] font-[family-name:var(--font-heading)]">{item.title}</h3>
              <p className="text-sm text-[var(--gray-500)]">{item.description}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Tablet/Desktop: Grid */}
      <div className="hidden md:grid md:grid-cols-2 xl:grid-cols-4 gap-6">
        {items.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className="group"
          >
            <div className={`relative h-[180px] xl:h-[200px] rounded-[var(--radius-xl)] overflow-hidden mb-4 bg-gradient-to-br ${categoryGradients[item.title] || 'from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900'} group-hover:shadow-xl group-hover:-translate-y-1 transition-all duration-300`}>
              {item.image && item.image !== '/images/placeholder.jpg' ? (
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-6xl opacity-70 grayscale-[0.3]">
                    {(item.title === 'Haircuts' || item.title === 'Cortes') && '💇'}
                    {(item.title === 'Manicures' || item.title === 'Manicura') && '💅'}
                    {(item.title === 'Facials' || item.title === 'Faciales') && '🧖'}
                    {(item.title === 'Eyebrows' || item.title === 'Cejas') && '👁️'}
                  </span>
                </div>
              )}
            </div>
            <h3 className="font-bold text-lg text-[var(--gray-800)] font-[family-name:var(--font-heading)]">{item.title}</h3>
            <p className="text-sm text-[var(--gray-500)] line-clamp-1">{item.description}</p>
          </Link>
        ))}
      </div>
    </>
  );
}
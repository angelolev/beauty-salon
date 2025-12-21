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
  Haircuts: 'from-pink-100 to-rose-50',
  Manicures: 'from-purple-100 to-pink-50',
  Facials: 'from-teal-100 to-cyan-50',
  Eyebrows: 'from-amber-100 to-orange-50',
};

export default function FeaturedCarousel({ items }: FeaturedCarouselProps) {
  if (items.length === 0) return null;

  return (
    <>
      {/* Mobile: Horizontal scroll */}
      <div className="md:hidden overflow-x-auto no-scrollbar -mx-4 px-4">
        <div className="flex gap-4" style={{ width: 'max-content' }}>
          {items.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className="w-[280px] flex-shrink-0"
            >
              <div className={`relative h-[180px] rounded-xl overflow-hidden mb-3 bg-gradient-to-br ${categoryGradients[item.title] || 'from-gray-100 to-gray-50'}`}>
                {item.image && item.image !== '/images/placeholder.jpg' ? (
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-6xl opacity-50">
                      {item.title === 'Haircuts' && '💇'}
                      {item.title === 'Manicures' && '💅'}
                      {item.title === 'Facials' && '🧖'}
                      {item.title === 'Eyebrows' && '👁️'}
                    </span>
                  </div>
                )}
              </div>
              <h3 className="font-semibold text-gray-900">{item.title}</h3>
              <p className="text-sm text-[#8B7E8B]">{item.description}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Tablet/Desktop: Grid */}
      <div className="hidden md:grid md:grid-cols-2 xl:grid-cols-4 gap-4">
        {items.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className="group"
          >
            <div className={`relative h-[160px] xl:h-[140px] rounded-xl overflow-hidden mb-3 bg-gradient-to-br ${categoryGradients[item.title] || 'from-gray-100 to-gray-50'} group-hover:shadow-md transition-shadow`}>
              {item.image && item.image !== '/images/placeholder.jpg' ? (
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-5xl opacity-50">
                    {item.title === 'Haircuts' && '💇'}
                    {item.title === 'Manicures' && '💅'}
                    {item.title === 'Facials' && '🧖'}
                    {item.title === 'Eyebrows' && '👁️'}
                  </span>
                </div>
              )}
            </div>
            <h3 className="font-semibold text-gray-900">{item.title}</h3>
            <p className="text-sm text-[#8B7E8B] line-clamp-1">{item.description}</p>
          </Link>
        ))}
      </div>
    </>
  );
}

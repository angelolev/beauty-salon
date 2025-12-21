'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Service } from '@/types';
import { formatCurrency } from '@/utils/formatters';
import { Clock } from 'lucide-react';

interface ServiceCardProps {
  service: Service;
  salonSlug: string;
  variant?: 'list' | 'card';
}

const categoryEmoji: Record<string, string> = {
  Haircuts: '💇',
  Manicures: '💅',
  Facials: '🧖',
  Eyebrows: '👁️',
  'Hair Coloring': '🎨',
  Spa: '🧘',
};

export default function ServiceCard({ service, salonSlug, variant = 'list' }: ServiceCardProps) {
  const emoji = categoryEmoji[service.category] || '✨';

  if (variant === 'card') {
    return (
      <Link
        href={`/${salonSlug}/service/${service.id}`}
        className="block bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-md transition-shadow"
      >
        <div className="relative h-40 bg-[#FDE8D7]">
          {service.image ? (
            <Image
              src={service.image}
              alt={service.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-5xl">
              {emoji}
            </div>
          )}
        </div>
        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-gray-900">{service.name}</h3>
            <span className="text-[#E91E8C] font-bold">{formatCurrency(service.price)}</span>
          </div>
          <p className="text-sm text-[#8B7E8B] line-clamp-2 mb-3">
            {service.description}
          </p>
          <div className="flex items-center text-sm text-gray-500">
            <Clock size={14} className="mr-1" />
            <span>{service.duration} min</span>
          </div>
        </div>
      </Link>
    );
  }

  // List variant (default)
  return (
    <Link
      href={`/${salonSlug}/service/${service.id}`}
      className="flex items-center gap-4 py-3"
    >
      <div className="w-16 h-16 relative rounded-xl overflow-hidden bg-[#FDE8D7] flex-shrink-0">
        {service.image ? (
          <Image
            src={service.image}
            alt={service.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-2xl">
            {emoji}
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-gray-900">{service.name}</h3>
        <p className="text-[#E91E8C] font-medium">{formatCurrency(service.price)}</p>
      </div>
    </Link>
  );
}

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
  'Cortes': '💇',
  'Manicura': '💅',
  'Faciales': '🧖',
  'Cejas': '👁️',
  'Coloración': '🎨',
  'Spa': '🧘',
  // Fallback English keys
  'Haircuts': '💇',
  'Manicures': '💅',
  'Eyebrows': '👁️',
  'Hair Coloring': '🎨',
};

export default function ServiceCard({ service, salonSlug, variant = 'list' }: ServiceCardProps) {
  const emoji = categoryEmoji[service.category] || '✨';

  if (variant === 'card') {
    return (
      <Link
        href={`/${salonSlug}/service/${service.id}`}
        className="block bg-[var(--card)] border border-[var(--border)] rounded-[var(--radius-xl)] overflow-hidden card-hover"
      >
        <div className="relative h-48 bg-[var(--secondary-50)] dark:bg-[var(--primary-900)]">
          {service.image ? (
            <Image
              src={service.image}
              alt={service.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-6xl">
              {emoji}
            </div>
          )}
        </div>
        <div className="p-5">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-bold text-[var(--foreground)] font-[family-name:var(--font-heading)]">{service.name}</h3>
            <span className="text-[var(--primary)] font-bold">{formatCurrency(service.price)}</span>
          </div>
          <p className="text-sm text-[var(--muted-foreground)] line-clamp-2 mb-3">
            {service.description}
          </p>
          <div className="flex items-center text-sm text-[var(--gray-500)]">
            <Clock size={16} className="mr-1.5" />
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
      className="flex items-center gap-4 py-4 px-2 hover:bg-[var(--secondary-50)] rounded-[var(--radius-lg)] transition-colors group"
    >
      <div className="w-16 h-16 relative rounded-[var(--radius-lg)] overflow-hidden bg-[var(--secondary-50)] dark:bg-[var(--primary-900)] flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
        {service.image ? (
          <Image
            src={service.image}
            alt={service.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-3xl">
            {emoji}
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-[var(--foreground)] font-[family-name:var(--font-heading)]">{service.name}</h3>
        <p className="text-[var(--primary)] font-bold">{formatCurrency(service.price)}</p>
      </div>
    </Link>
  );
}
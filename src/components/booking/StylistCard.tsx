'use client';

import { Calendar } from 'lucide-react';
import Avatar from '@/components/ui/Avatar';
import { Stylist } from '@/types';

interface StylistCardProps {
  stylist?: Stylist;
  isFirstAvailable?: boolean;
  isSelected: boolean;
  onSelect: () => void;
  variant?: 'list' | 'card';
}

export default function StylistCard({
  stylist,
  isFirstAvailable = false,
  isSelected,
  onSelect,
  variant = 'list',
}: StylistCardProps) {
  if (variant === 'card') {
    return (
      <button
        onClick={onSelect}
        className={`w-full p-5 rounded-[var(--radius-xl)] border-2 transition-all duration-300 text-left ${
          isSelected
            ? 'border-[var(--primary)] bg-[var(--primary-50)] shadow-sm'
            : 'border-[var(--border)] bg-[var(--card)] hover:border-[var(--primary-200)] hover:bg-[var(--secondary-50)] hover:shadow-md'
        }`}
      >
        <div className="flex items-center gap-4 mb-3">
          {isFirstAvailable ? (
            <div className="w-14 h-14 rounded-full bg-[var(--secondary-100)] flex items-center justify-center text-[var(--primary)]">
              <Calendar size={24} />
            </div>
          ) : (
            <Avatar
              src={stylist?.avatar}
              alt={stylist?.name || ''}
              size="lg"
            />
          )}
          <div className="flex-1">
            <h3 className="font-bold text-[var(--foreground)] font-[family-name:var(--font-heading)]">
              {isFirstAvailable ? 'Primero disponible' : stylist?.name}
            </h3>
            <p className="text-sm text-[var(--muted-foreground)]">
              {isFirstAvailable ? 'Cualquier estilista disponible' : stylist?.specialty}
            </p>
          </div>
        </div>
        {!isFirstAvailable && stylist?.bio && (
          <p className="text-sm text-[var(--gray-500)] line-clamp-2">{stylist.bio}</p>
        )}
      </button>
    );
  }

  // List variant (default)
  return (
    <button
      onClick={onSelect}
      className={`w-full flex items-center gap-4 p-4 rounded-[var(--radius-xl)] transition-all duration-300 ${
        isSelected 
          ? 'bg-[var(--primary-50)] ring-2 ring-[var(--primary)] shadow-sm' 
          : 'bg-[var(--card)] border border-[var(--border)] hover:bg-[var(--secondary-50)] hover:border-[var(--secondary-200)]'
      }`}
    >
      {isFirstAvailable ? (
        <div className="w-16 h-16 rounded-full bg-[var(--secondary-100)] flex items-center justify-center text-[var(--primary)] shrink-0">
          <Calendar size={28} />
        </div>
      ) : (
        <Avatar
          src={stylist?.avatar}
          alt={stylist?.name || ''}
          size="lg"
        />
      )}

      <div className="flex-1 text-left">
        <h3 className="font-bold text-lg text-[var(--foreground)] font-[family-name:var(--font-heading)]">
          {isFirstAvailable ? 'Primero disponible' : stylist?.name}
        </h3>
        <p className="text-sm text-[var(--muted-foreground)]">
          {isFirstAvailable ? 'Cualquier estilista disponible' : stylist?.specialty}
        </p>
      </div>
    </button>
  );
}
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
        className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
          isSelected
            ? 'border-[#E91E8C] bg-pink-50'
            : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'
        }`}
      >
        <div className="flex items-center gap-4 mb-3">
          {isFirstAvailable ? (
            <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center">
              <Calendar size={24} className="text-gray-500" />
            </div>
          ) : (
            <Avatar
              src={stylist?.avatar}
              alt={stylist?.name || ''}
              size="lg"
            />
          )}
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">
              {isFirstAvailable ? 'First available' : stylist?.name}
            </h3>
            <p className="text-sm text-[#8B7E8B]">
              {isFirstAvailable ? 'Any available stylist' : stylist?.specialty}
            </p>
          </div>
        </div>
        {!isFirstAvailable && stylist?.bio && (
          <p className="text-sm text-gray-500 line-clamp-2">{stylist.bio}</p>
        )}
      </button>
    );
  }

  // List variant (default)
  return (
    <button
      onClick={onSelect}
      className={`w-full flex items-center gap-4 p-3 rounded-xl transition-colors ${
        isSelected ? 'bg-pink-50 ring-2 ring-[#E91E8C]' : 'hover:bg-gray-50'
      }`}
    >
      {isFirstAvailable ? (
        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
          <Calendar size={24} className="text-gray-500" />
        </div>
      ) : (
        <Avatar
          src={stylist?.avatar}
          alt={stylist?.name || ''}
          size="lg"
        />
      )}

      <div className="flex-1 text-left">
        <h3 className="font-semibold text-gray-900">
          {isFirstAvailable ? 'First available' : stylist?.name}
        </h3>
        <p className="text-sm text-[#8B7E8B]">
          {isFirstAvailable ? 'Any available stylist' : stylist?.specialty}
        </p>
      </div>
    </button>
  );
}

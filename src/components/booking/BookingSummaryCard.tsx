'use client';

import Image from 'next/image';
import { Calendar } from 'lucide-react';
import Avatar from '@/components/ui/Avatar';
import { Service, Stylist } from '@/types';
import { formatBookingDateTime } from '@/utils/formatters';

interface BookingSummaryCardProps {
  services: Service[];
  stylist: Stylist | null;
  date: Date | null;
  time: string | null;
}

export default function BookingSummaryCard({
  services,
  stylist,
  date,
  time,
}: BookingSummaryCardProps) {
  return (
    <div className="space-y-4">
      {/* Services */}
      {services.map((service) => (
        <div key={service.id} className="flex items-center gap-4">
          <div className="w-14 h-14 relative rounded-xl overflow-hidden bg-[#FDE8D7] flex-shrink-0">
            {service.image ? (
              <Image
                src={service.image}
                alt={service.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-2xl">
                {service.category === 'Haircuts' && '💇'}
                {service.category === 'Manicures' && '💅'}
                {service.category === 'Facials' && '🧖'}
                {service.category === 'Eyebrows' && '👁️'}
              </div>
            )}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{service.name}</h3>
            <p className="text-sm text-[#8B7E8B]">{service.category}</p>
          </div>
        </div>
      ))}

      {/* Stylist */}
      {stylist && (
        <div className="flex items-center gap-4">
          <Avatar src={stylist.avatar} alt={stylist.name} size="lg" />
          <div>
            <h3 className="font-semibold text-gray-900">{stylist.name}</h3>
            <p className="text-sm text-[#8B7E8B]">Stylist</p>
          </div>
        </div>
      )}

      {/* Date & Time */}
      {date && time && (
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-gray-100 flex items-center justify-center">
            <Calendar size={24} className="text-gray-500" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">
              {formatBookingDateTime(date, time)}
            </h3>
            <p className="text-sm text-[#8B7E8B]">Date & Time</p>
          </div>
        </div>
      )}
    </div>
  );
}

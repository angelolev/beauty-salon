'use client';

import Image from 'next/image';
import { Calendar, Pencil } from 'lucide-react';
import Avatar from '@/components/ui/Avatar';
import { Service, Stylist } from '@/types';
import { formatBookingDateTime } from '@/utils/formatters';

interface BookingSummaryCardProps {
  services: Service[];
  stylist: Stylist | null;
  date: Date | null;
  time: string | null;
  onEditDateTime?: () => void;
}

export default function BookingSummaryCard({
  services,
  stylist,
  date,
  time,
  onEditDateTime,
}: BookingSummaryCardProps) {
  return (
    <div className="space-y-4">
      {/* Services */}
      {services.map((service) => (
        <div key={service.id} className="flex items-center gap-4">
          <div className="w-14 h-14 relative rounded-xl overflow-hidden bg-[var(--cream-100)] dark:bg-[var(--primary-900)] flex-shrink-0">
            {service.image ? (
              <Image
                src={service.image}
                alt={service.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-2xl">
                {(service.category === 'Haircuts' || service.category === 'Cortes') && '💇'}
                {(service.category === 'Manicures' || service.category === 'Manicura') && '💅'}
                {(service.category === 'Facials' || service.category === 'Faciales') && '🧖'}
                {(service.category === 'Eyebrows' || service.category === 'Cejas') && '👁️'}
              </div>
            )}
          </div>
          <div>
            <h3 className="font-semibold text-[var(--foreground)]">{service.name}</h3>
            <p className="text-sm text-[var(--muted)]">{service.category}</p>
          </div>
        </div>
      ))}

      {/* Stylist */}
      {stylist && (
        <div className="flex items-center gap-4">
          <Avatar src={stylist.avatar} alt={stylist.name} size="lg" />
          <div>
            <h3 className="font-semibold text-[var(--foreground)]">{stylist.name}</h3>
            <p className="text-sm text-[var(--muted)]">Estilista</p>
          </div>
        </div>
      )}

      {/* Date & Time */}
      {date && time && (
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-[var(--primary-100)] dark:bg-[var(--primary-900)] flex items-center justify-center">
            <Calendar size={24} className="text-[var(--primary)]" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-[var(--foreground)]">
              {formatBookingDateTime(date, time)}
            </h3>
            <p className="text-sm text-[var(--muted)]">Fecha y Hora</p>
          </div>
          {onEditDateTime && (
            <button
              onClick={onEditDateTime}
              className="p-2 hover:bg-[var(--primary-100)] dark:hover:bg-[var(--primary-900)] rounded-full transition-colors"
              aria-label="Editar fecha y hora"
            >
              <Pencil size={18} className="text-[var(--primary)]" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
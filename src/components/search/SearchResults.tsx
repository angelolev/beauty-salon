'use client';

import { Service } from '@/types';
import ServiceCard from '@/components/home/ServiceCard';
import { SearchX } from 'lucide-react';

interface SearchResultsProps {
  services: Service[];
  query: string;
  salonSlug: string;
  onServiceClick?: () => void;
}

export default function SearchResults({
  services,
  query,
  salonSlug,
  onServiceClick,
}: SearchResultsProps) {
  // Empty state when no query
  if (!query.trim()) {
    return (
      <div className="text-center py-16 px-4">
        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-[var(--secondary-100)] dark:bg-[var(--secondary-800)] flex items-center justify-center">
          <SearchX size={40} className="text-[var(--muted-foreground)]" />
        </div>
        <h3 className="text-lg font-bold text-[var(--foreground)] mb-2 font-[family-name:var(--font-heading)]">
          Busca servicios
        </h3>
        <p className="text-sm text-[var(--muted-foreground)]">
          Busca por nombre, categoría o descripción
        </p>
      </div>
    );
  }

  // Empty state when no results
  if (services.length === 0) {
    return (
      <div className="text-center py-16 px-4">
        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-[var(--secondary-100)] dark:bg-[var(--secondary-800)] flex items-center justify-center">
          <SearchX size={40} className="text-[var(--muted-foreground)]" />
        </div>
        <h3 className="text-lg font-bold text-[var(--foreground)] mb-2 font-[family-name:var(--font-heading)]">
          No se encontraron servicios
        </h3>
        <p className="text-sm text-[var(--muted-foreground)]">
          Intenta con otras palabras clave
        </p>
      </div>
    );
  }

  // Results found
  return (
    <div>
      {/* Results header */}
      <div className="mb-4 pb-3 border-b border-[var(--border)]">
        <p className="text-sm text-[var(--muted-foreground)]">
          {services.length} {services.length === 1 ? 'servicio encontrado' : 'servicios encontrados'}
        </p>
      </div>

      {/* Results grid/list */}
      <div className="space-y-2">
        {services.map((service) => (
          <div key={service.id} onClick={onServiceClick}>
            <ServiceCard
              service={service}
              salonSlug={salonSlug}
              variant="list"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

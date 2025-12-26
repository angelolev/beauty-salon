'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { useSalon } from '@/context/SalonContext';
import { useDebounce } from '@/hooks/useDebounce';
import SearchInput from './SearchInput';
import SearchResults from './SearchResults';
import { Service } from '@/types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  salonSlug: string;
}

export default function SearchModal({ isOpen, onClose, salonSlug }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [mounted, setMounted] = useState(false);
  const debouncedQuery = useDebounce(query, 300);
  const { salon, services } = useSalon();

  // Handle mounting for portal
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Handle body scroll lock when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setQuery(''); // Clear search when closing
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  // Filter services based on debounced query
  const filteredServices = (services || []).filter((service: Service) => {
    if (!debouncedQuery.trim()) return true;

    const lowerQuery = debouncedQuery.toLowerCase().trim();
    return (
      service.name.toLowerCase().includes(lowerQuery) ||
      service.description.toLowerCase().includes(lowerQuery) ||
      service.category.toLowerCase().includes(lowerQuery)
    );
  });

  if (!mounted || !isOpen) return null;

  const modalContent = (
    <>
      {/* Backdrop */}
      <div
        className="search-backdrop fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Container - Mobile */}
      <div className="fixed inset-0 z-50 lg:hidden">
        <div className="search-modal h-full flex flex-col bg-[var(--background)]">
          {/* Header */}
          <div className="sticky top-0 bg-[var(--background)]/95 backdrop-blur-md border-b border-[var(--border)] p-4 pb-safe">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold font-[family-name:var(--font-heading)] text-[var(--foreground)]">
                Buscar
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-[var(--secondary-100)] dark:hover:bg-[var(--secondary-800)] rounded-full transition-colors"
                aria-label="Cerrar búsqueda"
              >
                <X size={24} className="text-[var(--foreground)]" />
              </button>
            </div>

            <SearchInput
              value={query}
              onChange={setQuery}
              onClear={() => setQuery('')}
            />
          </div>

          {/* Results */}
          <div className="flex-1 overflow-y-auto p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
            <SearchResults
              services={filteredServices}
              query={debouncedQuery}
              salonSlug={salonSlug}
              onServiceClick={onClose}
            />
          </div>
        </div>
      </div>

      {/* Modal Container - Desktop */}
      <div className="hidden lg:flex fixed inset-0 z-50 items-start justify-center pt-20 px-4">
        <div className="search-modal w-full max-w-4xl bg-[var(--card)] rounded-[var(--radius-xl)] shadow-xl max-h-[calc(100vh-10rem)] flex flex-col">
          {/* Header */}
          <div className="sticky top-0 bg-[var(--card)] rounded-t-[var(--radius-xl)] border-b border-[var(--border)] p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold font-[family-name:var(--font-heading)] text-[var(--foreground)]">
                Buscar Servicios
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-[var(--secondary-100)] dark:hover:bg-[var(--secondary-800)] rounded-full transition-colors"
                aria-label="Cerrar búsqueda"
              >
                <X size={24} className="text-[var(--foreground)]" />
              </button>
            </div>

            <SearchInput
              value={query}
              onChange={setQuery}
              onClear={() => setQuery('')}
            />
          </div>

          {/* Results */}
          <div className="flex-1 overflow-y-auto p-6">
            <SearchResults
              services={filteredServices}
              query={debouncedQuery}
              salonSlug={salonSlug}
              onServiceClick={onClose}
            />
          </div>
        </div>
      </div>
    </>
  );

  return createPortal(modalContent, document.body);
}

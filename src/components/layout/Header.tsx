'use client';

import { useState } from 'react';
import { Search, ArrowLeft, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import SearchModal from '@/components/search/SearchModal';

interface HeaderProps {
  title: string;
  showBack?: boolean;
  showSearch?: boolean;
  showClose?: boolean;
  onClose?: () => void;
  salonSlug?: string;
}

export default function Header({
  title,
  showBack = false,
  showSearch = false,
  showClose = false,
  onClose,
  salonSlug,
}: HeaderProps) {
  const router = useRouter();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[var(--background)]/80 backdrop-blur-md border-b border-[var(--border)] px-4 py-4 transition-colors duration-300">
      <div className="max-w-md lg:max-w-7xl mx-auto flex items-center justify-between">
        <div className="w-10">
          {showBack && (
            <button
              onClick={() => router.back()}
              className="p-2.5 -m-2 text-[var(--muted-foreground)] hover:text-[var(--primary)] hover:bg-[var(--secondary-50)] rounded-full transition-all duration-200"
            >
              <ArrowLeft size={24} />
            </button>
          )}
          {showClose && (
            <button
              onClick={onClose || (() => router.back())}
              className="p-2.5 -m-2 text-[var(--muted-foreground)] hover:text-[var(--primary)] hover:bg-[var(--secondary-50)] rounded-full transition-all duration-200"
            >
              <X size={24} />
            </button>
          )}
        </div>

        <h1 className="text-lg font-bold font-[family-name:var(--font-heading)] text-[var(--foreground)]">{title}</h1>

        <div className="w-10">
          {showSearch && (
            <>
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2.5 -m-2 text-[var(--muted-foreground)] hover:text-[var(--primary)] hover:bg-[var(--secondary-50)] rounded-full transition-all duration-200"
                aria-label="Buscar servicios"
              >
                <Search size={24} />
              </button>

              {salonSlug && (
                <SearchModal
                  isOpen={isSearchOpen}
                  onClose={() => setIsSearchOpen(false)}
                  salonSlug={salonSlug}
                />
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
}


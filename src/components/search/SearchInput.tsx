'use client';

import { Search, X } from 'lucide-react';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  placeholder?: string;
  autoFocus?: boolean;
}

export default function SearchInput({
  value,
  onChange,
  onClear,
  placeholder = 'Buscar servicios...',
  autoFocus = true,
}: SearchInputProps) {
  return (
    <div className="relative">
      {/* Search Icon */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
        <Search size={24} className="text-[var(--muted-foreground)]" />
      </div>

      {/* Input */}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className="w-full pl-14 pr-12 py-4 text-lg lg:text-xl bg-[var(--secondary-100)] dark:bg-[var(--secondary-800)] rounded-[var(--radius-lg)] border-2 border-transparent text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] transition-all duration-300 outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary-100)] dark:focus:ring-[var(--primary-900)]"
      />

      {/* Clear Button */}
      {value && (
        <button
          onClick={onClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--secondary-200)] dark:hover:bg-[var(--secondary-700)] rounded-full transition-all duration-200"
          aria-label="Limpiar búsqueda"
        >
          <X size={20} />
        </button>
      )}
    </div>
  );
}

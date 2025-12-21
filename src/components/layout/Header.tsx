'use client';

import { Search, ArrowLeft, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface HeaderProps {
  title: string;
  showBack?: boolean;
  showSearch?: boolean;
  showClose?: boolean;
  onClose?: () => void;
}

export default function Header({
  title,
  showBack = false,
  showSearch = false,
  showClose = false,
  onClose,
}: HeaderProps) {
  const router = useRouter();

  return (
    <header className="sticky top-0 bg-white z-40 px-4 py-4">
      <div className="max-w-md mx-auto flex items-center justify-between">
        <div className="w-10">
          {showBack && (
            <button
              onClick={() => router.back()}
              className="p-2 -ml-2 text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft size={24} />
            </button>
          )}
          {showClose && (
            <button
              onClick={onClose || (() => router.back())}
              className="p-2 -ml-2 text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={24} />
            </button>
          )}
        </div>

        <h1 className="text-lg font-semibold text-gray-900">{title}</h1>

        <div className="w-10">
          {showSearch && (
            <button className="p-2 -mr-2 text-gray-700 hover:bg-gray-100 rounded-full transition-colors">
              <Search size={24} />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

'use client';

import Image from 'next/image';

interface AvatarProps {
  src?: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeMap = {
  sm: 32,
  md: 48,
  lg: 64,
  xl: 80,
};

const sizeClasses = {
  sm: 'w-8 h-8',
  md: 'w-12 h-12',
  lg: 'w-16 h-16',
  xl: 'w-20 h-20',
};

export default function Avatar({ src, alt, size = 'md', className = '' }: AvatarProps) {
  const dimension = sizeMap[size];

  if (!src) {
    // Placeholder with initials
    const initials = alt
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

    return (
      <div
        className={`${sizeClasses[size]} rounded-full bg-[var(--primary-100)] dark:bg-[var(--primary-900)] flex items-center justify-center text-[var(--primary-600)] dark:text-[var(--primary-300)] font-medium transition-all hover:ring-2 hover:ring-[var(--primary-200)] ${className}`}
      >
        {initials}
      </div>
    );
  }

  return (
    <div className={`${sizeClasses[size]} relative rounded-full overflow-hidden bg-[var(--primary-100)] dark:bg-[var(--primary-900)] ${className}`}>
      <Image
        src={src}
        alt={alt}
        width={dimension}
        height={dimension}
        className="object-cover w-full h-full"
      />
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
  type?: 'fade' | 'slideLeft' | 'slideRight' | 'fadeUp';
}

export default function PageTransition({
  children,
  className = '',
  type = 'fadeUp'
}: PageTransitionProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const animationClass = {
    fade: 'page-fade',
    slideLeft: 'page-slide-left',
    slideRight: 'page-slide-right',
    fadeUp: 'page-transition'
  }[type];

  return (
    <div className={`${mounted ? animationClass : 'opacity-0'} ${className}`}>
      {children}
    </div>
  );
}

'use client';

import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', label, error, id, ...props }, ref) => {
    return (
      <div className="w-full space-y-2">
        {label && (
          <label htmlFor={id} className="block text-sm font-semibold text-[var(--gray-700)] dark:text-[var(--gray-300)] font-[family-name:var(--font-heading)] ml-1">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={`w-full px-5 py-3.5 bg-white dark:bg-[var(--card)] border border-[var(--input)] rounded-[var(--radius-lg)] font-[family-name:var(--font-body)] text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] transition-all duration-300 outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary-100)] dark:focus:ring-[var(--primary-900)] disabled:bg-[var(--gray-50)] disabled:cursor-not-allowed ${error ? 'border-red-300 focus:border-red-400 focus:ring-red-100' : ''} ${className}`}
          {...props}
        />
        {error && (
          <p className="ml-1 text-sm text-red-500 font-medium">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;

'use client';

import { Plus } from 'lucide-react';
import { PaymentMethod } from '@/types';

interface PaymentMethodCardProps {
  method?: PaymentMethod;
  isAddNew?: boolean;
  isSelected: boolean;
  onSelect: () => void;
}

const cardLogos: Record<string, string> = {
  visa: '💳',
  mastercard: '💳',
  amex: '💳',
};

export default function PaymentMethodCard({
  method,
  isAddNew = false,
  isSelected,
  onSelect,
}: PaymentMethodCardProps) {
  if (isAddNew) {
    return (
      <button
        onClick={onSelect}
        className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors"
      >
        <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
          <Plus size={24} className="text-gray-500" />
        </div>
        <span className="font-medium text-gray-900">Add Payment Method</span>
      </button>
    );
  }

  if (!method) return null;

  return (
    <button
      onClick={onSelect}
      className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-colors"
    >
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-2xl">
          {cardLogos[method.type] || '💳'}
        </div>
        <div className="text-left">
          <h3 className="font-medium text-gray-900">Credit Card</h3>
          <p className="text-sm text-[#8B7E8B]">Ending in {method.lastFour}</p>
        </div>
      </div>

      <div
        className={`w-6 h-6 rounded-full border-2 transition-colors ${
          isSelected
            ? 'border-[#E91E8C] bg-[#E91E8C]'
            : 'border-gray-300 bg-white'
        }`}
      >
        {isSelected && (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-white" />
          </div>
        )}
      </div>
    </button>
  );
}

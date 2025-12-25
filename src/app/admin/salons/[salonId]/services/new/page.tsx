'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import ServiceForm from '@/components/admin/services/ServiceForm';
import { Service } from '@/types';
import { useAuth } from '@/context/AuthContext';

export default function NewServicePage() {
  const params = useParams();
  const salonId = params.salonId as string;
  const { isDemo } = useAuth();

  const handleSubmit = async (data: Partial<Service>) => {
    if (isDemo) {
      // In demo mode, just simulate success
      console.log('Demo mode: Would create service', data);
      return;
    }

    // TODO: Save to Firebase
    console.log('Would create service:', data);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href={`/admin/salons/${salonId}/services`}
          className="p-2 text-gray-400 hover:text-gray-500 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Nuevo Servicio</h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Agrega un nuevo servicio a tu catálogo
          </p>
        </div>
      </div>

      {/* Form */}
      <ServiceForm salonId={salonId} onSubmit={handleSubmit} />
    </div>
  );
}

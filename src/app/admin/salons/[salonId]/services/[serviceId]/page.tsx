'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import ServiceForm from '@/components/admin/services/ServiceForm';
import { Service } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { demoServices } from '@/lib/demo-data';

export default function EditServicePage() {
  const params = useParams();
  const salonId = params.salonId as string;
  const serviceId = params.serviceId as string;
  const { isDemo } = useAuth();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchService = async () => {
      if (isDemo) {
        const found = demoServices.find(s => s.id === serviceId);
        setService(found || null);
        setLoading(false);
        return;
      }

      // TODO: Fetch from Firebase
      const found = demoServices.find(s => s.id === serviceId);
      setService(found || null);
      setLoading(false);
    };

    fetchService();
  }, [serviceId, isDemo]);

  const handleSubmit = async (data: Partial<Service>) => {
    if (isDemo) {
      console.log('Demo mode: Would update service', data);
      return;
    }

    // TODO: Update in Firebase
    console.log('Would update service:', data);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Servicio no encontrado</h3>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          El servicio que buscas no existe o fue eliminado.
        </p>
        <Link
          href={`/admin/salons/${salonId}/services`}
          className="mt-4 inline-flex items-center text-primary hover:text-primary/80"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver a servicios
        </Link>
      </div>
    );
  }

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
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Editar Servicio</h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {service.name}
          </p>
        </div>
      </div>

      {/* Form */}
      <ServiceForm salonId={salonId} service={service} onSubmit={handleSubmit} />
    </div>
  );
}

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Scissors, Upload, X } from 'lucide-react';
import { Service } from '@/types';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

interface ServiceFormProps {
  salonId: string;
  service?: Service;
  onSubmit: (data: Partial<Service>) => Promise<void>;
}

const categories = [
  'Cortes',
  'Coloración',
  'Tratamientos',
  'Manicura',
  'Pedicura',
  'Faciales',
  'Depilación',
  'Maquillaje',
  'Cejas',
  'Spa',
  'Otros',
];

export default function ServiceForm({ salonId, service, onSubmit }: ServiceFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: service?.name || '',
    description: service?.description || '',
    price: service?.price?.toString() || '',
    duration: service?.duration?.toString() || '30',
    category: service?.category || 'Cortes',
    image: service?.image || '',
    featured: service?.featured || false,
    active: service?.active ?? true,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await onSubmit({
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        duration: parseInt(formData.duration),
        category: formData.category,
        image: formData.image || undefined,
        featured: formData.featured,
        active: formData.active,
        order: service?.order || 0,
      });

      router.push(`/admin/salons/${salonId}/services`);
    } catch (err: any) {
      setError(err.message || 'Error al guardar el servicio');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 text-sm">
          {error}
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Información del Servicio
        </h3>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Nombre del servicio *
            </label>
            <Input
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="Ej: Corte de cabello"
            />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Descripción
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe el servicio..."
              className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Precio (S/) *
            </label>
            <Input
              id="price"
              name="price"
              type="number"
              min="0"
              step="0.01"
              required
              value={formData.price}
              onChange={handleChange}
              placeholder="50.00"
            />
          </div>

          <div>
            <label htmlFor="duration" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Duración (minutos) *
            </label>
            <select
              id="duration"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="15">15 minutos</option>
              <option value="30">30 minutos</option>
              <option value="45">45 minutos</option>
              <option value="60">1 hora</option>
              <option value="90">1 hora 30 min</option>
              <option value="120">2 horas</option>
              <option value="180">3 horas</option>
            </select>
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Categoría *
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              URL de imagen
            </label>
            <Input
              id="image"
              name="image"
              type="url"
              value={formData.image}
              onChange={handleChange}
              placeholder="https://..."
            />
          </div>

          <div className="sm:col-span-2">
            {/* Image preview */}
            {formData.image ? (
              <div className="relative w-32 h-32 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                <img
                  src={formData.image}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '';
                    setFormData(prev => ({ ...prev, image: '' }));
                  }}
                />
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, image: '' }))}
                  className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="w-32 h-32 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                <Scissors className="h-8 w-8 text-gray-400" />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Configuración
        </h3>

        <div className="space-y-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="featured"
              checked={formData.featured}
              onChange={handleChange}
              className="h-5 w-5 rounded border-gray-300 dark:border-gray-600 text-primary focus:ring-primary"
            />
            <div>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                Servicio destacado
              </span>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Aparecerá en la sección de servicios destacados
              </p>
            </div>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="active"
              checked={formData.active}
              onChange={handleChange}
              className="h-5 w-5 rounded border-gray-300 dark:border-gray-600 text-primary focus:ring-primary"
            />
            <div>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                Servicio activo
              </span>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Los servicios inactivos no aparecen en el catálogo
              </p>
            </div>
          </label>
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push(`/admin/salons/${salonId}/services`)}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Guardando...' : service ? 'Guardar cambios' : 'Crear servicio'}
        </Button>
      </div>
    </form>
  );
}

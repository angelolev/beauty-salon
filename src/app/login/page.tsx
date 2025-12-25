'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Scissors } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export default function LoginPage() {
  const router = useRouter();
  const { signIn, isDemo } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signIn(email, password);
      router.push('/glamour-studio');
    } catch (err: unknown) {
      console.error('Login error:', err);
      setError('Correo electrónico o contraseña inválidos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex">
      {/* Left side - Branding (desktop only) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-pink-500 to-primary p-12 flex-col justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <Scissors size={24} className="text-white" />
          </div>
          <span className="text-2xl font-bold text-white">Salón de Belleza</span>
        </div>

        <div>
          <h1 className="text-4xl font-bold text-white mb-4">
            Bienvenido de nuevo a tu destino de belleza
          </h1>
          <p className="text-pink-100 text-lg">
            Reserva citas, gestiona tu horario y descubre nuevos servicios, todo en un solo lugar.
          </p>
        </div>

        <p className="text-pink-200 text-sm">
          Con la confianza de miles de entusiastas de la belleza
        </p>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex flex-col justify-center p-6 lg:p-12">
        <div className="max-w-md mx-auto w-full">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <Scissors size={20} className="text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">Salón de Belleza</span>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Bienvenido de nuevo</h1>
            <p className="text-[#8B7E8B]">Inicia sesión para continuar en tu cuenta</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-red-600 text-sm text-center">{error}</p>
              </div>
            )}

            {isDemo && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
                <p className="text-amber-700 text-sm text-center">
                  Modo demo: Firebase no configurado
                </p>
              </div>
            )}

            <Input
              type="email"
              label="Correo Electrónico"
              placeholder="Introduce tu correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isDemo}
            />

            <Input
              type="password"
              label="Contraseña"
              placeholder="Introduce tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isDemo}
            />

            <Button type="submit" fullWidth size="lg" disabled={loading || isDemo}>
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </Button>
          </form>

          <p className="mt-6 text-center text-[#8B7E8B]">
            ¿No tienes una cuenta?{' '}
            <Link href="/signup" className="text-primary font-medium hover:underline">
              Regístrate
            </Link>
          </p>

          {/* Demo link */}
          <div className="mt-8 p-4 bg-gray-50 rounded-xl">
            <p className="text-xs text-[#8B7E8B] text-center mb-2">Modo Demo</p>
            <p className="text-xs text-gray-600 text-center">
              Navegar sin iniciar sesión:{' '}
              <Link href="/glamour-studio" className="text-primary hover:underline">
                Ver Salón de Demo
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
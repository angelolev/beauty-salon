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
  const { signIn, signInWithGoogle, isDemo } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);

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

  const handleGoogleSignIn = async () => {
    setError('');
    setLoadingGoogle(true);

    try {
      await signInWithGoogle();
      router.push('/glamour-studio');
    } catch (err: any) {
      console.error('Google sign-in error:', err);
      setError(err.message || 'Error al iniciar sesión con Google');
    } finally {
      setLoadingGoogle(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[var(--background)] flex">
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
            <span className="text-xl font-bold text-gray-900 dark:text-white">Salón de Belleza</span>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-2">Bienvenido de nuevo</h1>
            <p className="text-[#8B7E8B] dark:text-[var(--muted-foreground)]">Inicia sesión para continuar en tu cuenta</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                <p className="text-red-600 dark:text-red-400 text-sm text-center">{error}</p>
              </div>
            )}

            {isDemo && (
              <div className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
                <p className="text-amber-700 dark:text-amber-400 text-sm text-center">
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

          {/* Google Sign-In */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-[var(--border)]"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-[#FAFAFA] dark:bg-[var(--background)] text-[#8B7E8B] dark:text-[var(--muted-foreground)]">
                  O continúa con
                </span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              fullWidth
              size="lg"
              onClick={handleGoogleSignIn}
              disabled={loadingGoogle || isDemo}
              className="mt-4"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              {loadingGoogle ? 'Iniciando sesión...' : 'Iniciar sesión con Google'}
            </Button>
          </div>

          <p className="mt-6 text-center text-[#8B7E8B] dark:text-[var(--muted-foreground)]">
            ¿No tienes una cuenta?{' '}
            <Link href="/signup" className="text-primary font-medium hover:underline">
              Regístrate
            </Link>
          </p>

          {/* Demo link */}
          <div className="mt-8 p-4 bg-gray-50 dark:bg-[var(--card)] rounded-xl border border-transparent dark:border-[var(--border)]">
            <p className="text-xs text-[#8B7E8B] dark:text-[var(--muted-foreground)] text-center mb-2">Modo Demo</p>
            <p className="text-xs text-gray-600 dark:text-gray-400 text-center">
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
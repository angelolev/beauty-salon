'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Scissors } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export default function SignupPage() {
  const router = useRouter();
  const { signUp, isDemo } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);

    try {
      await signUp(email, password, name);
      router.push('/glamour-studio');
    } catch (err: unknown) {
      console.error('Signup error:', err);
      setError('Fallo al crear la cuenta. Por favor, inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[var(--background)] flex">
      {/* Left side - Branding (desktop only) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary to-pink-600 p-12 flex-col justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <Scissors size={24} className="text-white" />
          </div>
          <span className="text-2xl font-bold text-white">Salón de Belleza</span>
        </div>

        <div>
          <h1 className="text-4xl font-bold text-white mb-4">
            Empieza tu viaje de belleza hoy
          </h1>
          <p className="text-pink-100 text-lg">
            Únete a miles de clientes felices que confían en nosotros para sus necesidades de belleza.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex -space-x-2">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="w-8 h-8 rounded-full bg-white/30 border-2 border-white/50"
              />
            ))}
          </div>
          <p className="text-pink-200 text-sm">+10,000 clientes felices</p>
        </div>
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
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-2">Crear Cuenta</h1>
            <p className="text-[#8B7E8B] dark:text-[var(--muted-foreground)]">Regístrate para reservar tus citas</p>
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
              type="text"
              label="Nombre Completo"
              placeholder="Introduce tu nombre"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={isDemo}
            />

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
              placeholder="Crea una contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isDemo}
            />

            <Input
              type="password"
              label="Confirmar Contraseña"
              placeholder="Confirma tu contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={isDemo}
            />

            <Button type="submit" fullWidth size="lg" disabled={loading || isDemo}>
              {loading ? 'Creando cuenta...' : 'Registrarse'}
            </Button>
          </form>

          <p className="mt-6 text-center text-[#8B7E8B] dark:text-[var(--muted-foreground)]">
            ¿Ya tienes una cuenta?{' '}
            <Link href="/login" className="text-primary font-medium hover:underline">
              Iniciar Sesión
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
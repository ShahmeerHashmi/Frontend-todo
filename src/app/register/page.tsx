/**
 * Neo-Kinetic Registration - Bold & Memorable
 */

'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/useAuth';
import { APIError } from '@/lib/api';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      await register(email, password);
      router.push('/tasks');
    } catch (error) {
      if (error instanceof APIError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach(err => {
          fieldErrors[err.field] = err.message;
        });
        setErrors(Object.keys(fieldErrors).length > 0 ? fieldErrors : { general: error.message });
      } else {
        setErrors({ general: 'An unexpected error occurred' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {/* Animated background orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-32 right-20 w-96 h-96 rounded-full blur-3xl opacity-15 animate-pulse"
          style={{
            background: 'radial-gradient(circle, var(--color-lime) 0%, transparent 70%)',
            animationDuration: '5s',
          }}
        />
        <div
          className="absolute bottom-32 left-20 w-96 h-96 rounded-full blur-3xl opacity-20 animate-pulse"
          style={{
            background: 'radial-gradient(circle, var(--color-electric) 0%, transparent 70%)',
            animationDuration: '4s',
            animationDelay: '1s',
          }}
        />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-12 animate-slideDown">
          <div
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, var(--color-electric) 0%, var(--color-lime) 100%)',
              boxShadow: 'var(--shadow-electric)',
            }}
          >
            <div
              className="absolute inset-0 opacity-30"
              style={{
                background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.3) 50%, transparent 70%)',
                backgroundSize: '200% 200%',
                animation: 'shimmer 3s infinite',
              }}
            />
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
              <path d="M10 6h12M10 16h12M10 26h8"/>
              <circle cx="6" cy="6" r="1" fill="white"/>
              <circle cx="6" cy="16" r="1" fill="white"/>
              <circle cx="6" cy="26" r="1" fill="white"/>
            </svg>
          </div>
          <h1 className="text-4xl font-bold mb-3" style={{ color: 'var(--color-navy)' }}>
            Start your journey
          </h1>
          <p className="text-base" style={{ color: 'var(--color-gray)' }}>
            Join thousands achieving more every day
          </p>
        </div>

        {/* Register Card */}
        <div className="card animate-floatIn delay-100">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                disabled={isLoading}
                autoComplete="email"
                placeholder="you@example.com"
              />
              {errors.email && <p className="error-message">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                disabled={isLoading}
                autoComplete="new-password"
                placeholder="••••••••"
              />
              <p className="text-xs mt-2 font-mono" style={{ color: 'var(--color-gray)' }}>
                Minimum 8 characters
              </p>
              {errors.password && <p className="error-message">{errors.password}</p>}
            </div>

            {errors.general && (
              <div
                className="px-4 py-3 rounded-xl border-2 text-sm font-medium animate-scaleIn"
                style={{
                  backgroundColor: 'var(--color-pink-light)',
                  borderColor: 'var(--color-pink)',
                  color: 'var(--color-pink)',
                }}
              >
                {errors.general}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                  Creating account...
                </span>
              ) : (
                'Create account'
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t" style={{ borderColor: 'var(--color-light-gray)' }}>
            <p className="text-center text-sm" style={{ color: 'var(--color-gray)' }}>
              Already have an account?{' '}
              <Link
                href="/login"
                className="font-semibold hover:underline transition-colors"
                style={{ color: 'var(--color-electric)' }}
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

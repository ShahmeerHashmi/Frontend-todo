/**
 * Neo-Kinetic Header - Bold & Electric
 */

'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/useAuth';

export function Header() {
  const router = useRouter();
  const { logout, user } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header
      className="border-b sticky top-0 z-50 backdrop-blur-md"
      style={{
        backgroundColor: 'rgba(250, 251, 253, 0.9)',
        borderColor: 'var(--color-light-gray)',
      }}
    >
      <div className="max-w-3xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo with shimmer effect */}
        <div className="flex items-center gap-3">
          <div
            className="inline-flex items-center justify-center w-12 h-12 rounded-xl relative overflow-hidden transition-transform hover:scale-105 cursor-pointer"
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
            <svg width="24" height="24" viewBox="0 0 32 32" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
              <path d="M10 6h12M10 16h12M10 26h8"/>
              <circle cx="6" cy="6" r="1" fill="white"/>
              <circle cx="6" cy="16" r="1" fill="white"/>
              <circle cx="6" cy="26" r="1" fill="white"/>
            </svg>
          </div>
          <div>
            <h1 className="font-bold text-xl" style={{ color: 'var(--color-navy)', fontFamily: 'var(--font-display)' }}>
              Tasks
            </h1>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {user && (
            <div className="hidden sm:flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm"
                style={{
                  background: 'var(--color-electric-light)',
                  color: 'var(--color-electric-dark)',
                }}
              >
                {user.email[0].toUpperCase()}
              </div>
              <span
                className="text-sm font-medium font-mono"
                style={{ color: 'var(--color-gray)' }}
              >
                {user.email}
              </span>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="btn-secondary text-sm px-4 py-2.5 hover:border-color-pink transition-all"
          >
            Sign out
          </button>
        </div>
      </div>
    </header>
  );
}

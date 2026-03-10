'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

const PUBLIC_PATHS = ['/', '/cart'];

export default function AccessGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const isPublicPath = PUBLIC_PATHS.includes(pathname);
  const isAdmin = user?.role === 'admin';
  const canAccess = isPublicPath || isAdmin;

  useEffect(() => {
    if (isLoading) return;
    if (!canAccess) {
      router.replace('/?login=1&reason=no-permission');
    }
  }, [canAccess, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-300">
        Carregando...
      </div>
    );
  }

  if (!canAccess) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-300">
        Redirecionando para login...
      </div>
    );
  }

  return <>{children}</>;
}

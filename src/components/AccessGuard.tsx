'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

const PUBLIC_PATHS = ['/', '/cart'];

export default function AccessGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading, hasAdminUser } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [hasAdmin, setHasAdmin] = useState<boolean | null>(null);

  // Check if admin exists (only on client side)
  useEffect(() => {
    setHasAdmin(hasAdminUser());
  }, [hasAdminUser]);

  const isPublicPath = PUBLIC_PATHS.includes(pathname);
  const isOneUserPath = pathname === '/oneuser';
  const isSetupPath = isOneUserPath && hasAdmin === false;
  const isAdmin = user?.role === 'admin';
  const canAccess = isPublicPath || isSetupPath || isAdmin;

  useEffect(() => {
    if (isLoading || hasAdmin === null) return;
    if (!canAccess) {
      router.replace('/?login=1&reason=no-permission');
    }
  }, [canAccess, isLoading, hasAdmin, router]);

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

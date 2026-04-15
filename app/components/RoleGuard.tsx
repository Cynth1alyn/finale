'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/app/lib/AppContext';

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles?: string[];
  redirectTo?: string;
}

export default function RoleGuard({ 
  children, 
  allowedRoles, 
  redirectTo = '/dashboard' 
}: RoleGuardProps) {
  const { currentUser, isLoading } = useAppContext();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!currentUser) {
        router.push('/login');
      } else if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
        router.push(redirectTo);
      }
    }
  }, [currentUser, isLoading, allowedRoles, router, redirectTo]);

  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100vh',
        background: 'var(--bg-primary)',
        color: 'var(--text-primary)'
      }}>
        <div className="animate-pulse">กำลังตรวจสอบสิทธิ์...</div>
      </div>
    );
  }

  if (!currentUser) return null;
  if (allowedRoles && !allowedRoles.includes(currentUser.role)) return null;

  return <>{children}</>;
}

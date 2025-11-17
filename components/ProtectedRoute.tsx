"use client";

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireOnboarding?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireOnboarding = true 
}) => {
  const { user, userProfile, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading) {
      // If not authenticated, redirect to auth
      if (!user) {
        router.push('/auth');
        return;
      }

      // If authenticated but no profile yet, wait for it to load
      if (!userProfile) {
        return;
      }

      // If onboarding is required and user hasn't completed it, redirect to onboarding
      // But don't redirect if already on onboarding page
      if (requireOnboarding && !userProfile.isOnboardingComplete && pathname !== '/onboarding') {
        router.push('/onboarding');
        return;
      }
    }
  }, [user, userProfile, loading, router, pathname, requireOnboarding]);

  // Show loading spinner while checking authentication
  if (loading || (user && !userProfile)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Show nothing if not authenticated (will redirect)
  if (!user) {
    return null;
  }

  // Show nothing if onboarding required but not completed (will redirect)
  if (requireOnboarding && userProfile && !userProfile.isOnboardingComplete && pathname !== '/onboarding') {
    return null;
  }

  // Render protected content if authenticated and onboarding completed (if required)
  return <>{children}</>;
};
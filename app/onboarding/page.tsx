import { OnboardingComponent } from '@/components/OnboardingComponent';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Get Started',
  description: 'Complete your profile setup to start your health journey with NibletAI',
};

export default function OnboardingPage() {
  return (
    <ProtectedRoute requireOnboarding={false}>
      <OnboardingComponent />
    </ProtectedRoute>
  );
}
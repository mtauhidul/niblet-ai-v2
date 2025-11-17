import { OnboardingComponent } from '@/components/OnboardingComponent';
import { ProtectedRoute } from '@/components/ProtectedRoute';

export default function OnboardingPage() {
  return (
    <ProtectedRoute requireOnboarding={false}>
      <OnboardingComponent />
    </ProtectedRoute>
  );
}
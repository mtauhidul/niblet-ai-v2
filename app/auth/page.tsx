"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Shield, Sparkles, Zap } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Logo } from "@/components/logo";

const getTimeBasedGreeting = (userName: string) => {
  const hour = new Date().getHours();
  let timeOfDay = '';
  
  if (hour < 12) {
    timeOfDay = 'Good morning';
  } else if (hour < 17) {
    timeOfDay = 'Good afternoon';
  } else {
    timeOfDay = 'Good evening';
  }
  
  return `${timeOfDay}, ${userName}! Welcome back to your health journey.`;
};

export default function AuthPage() {
  const [loading, setLoading] = useState(false);
  const { user, userProfile, signInWithGoogle } = useAuth();
  const router = useRouter();

  // Redirect if already authenticated and show personalized greeting  
  useEffect(() => {
    if (user && userProfile) {
      // Show personalized greeting
      const greeting = getTimeBasedGreeting(userProfile.firstName || 'there');
      toast.success(greeting);
      
      if (!userProfile.isOnboardingComplete) {
        router.push('/onboarding');
      } else {
        router.push('/dashboard');
      }
    }
  }, [user, userProfile, router]);

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      await signInWithGoogle();
    } catch (error) {
      console.error('Sign in error:', error);
      toast.error('Failed to sign in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-black/60 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <Logo size="md" showText={true} href="/" />
            <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm">Back</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Auth Content */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 pt-24 pb-16">
        <div className="w-full max-w-md">
          
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <Logo size="lg" showText={false} href={undefined} />
          </div>

          {/* Card */}
          <div className="card p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white mb-3">
                Welcome
              </h1>
              <p className="text-gray-400">
                Sign in to track your health goals
              </p>
            </div>

            {/* Google Sign In Button */}
            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full bg-white hover:bg-gray-100 text-black font-semibold py-3.5 px-6 rounded-full transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
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
              {loading ? "Signing in..." : "Continue with Google"}
            </button>

            {/* Trust Indicators */}
            <div className="flex items-center justify-center gap-4 mt-6 text-xs text-gray-500">
              <div className="flex items-center gap-1.5">
                <Shield className="h-3.5 w-3.5 text-[#CAFF66]" />
                <span>Secure</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-[#CAFF66]" />
                <span>AI-Powered</span>
              </div>
            </div>

            {/* Terms */}
            <p className="text-xs text-gray-500 text-center mt-6">
              By continuing, you agree to our Terms and Privacy Policy
            </p>
          </div>

        </div>
      </main>
    </div>
  );
}
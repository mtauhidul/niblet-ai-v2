"use client";

import { Logo } from "@/components/logo";
import { useAuth } from "@/contexts/AuthContext";
import {
  Activity,
  ArrowRight,
  BarChart3,
  Camera,
  CheckCircle2,
  Clock,
  LineChart,
  Lock,
  MessageCircle,
  Shield,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen">
      {/* Navigation - Minimal */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-black/60 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <Logo size="md" showText={true} href="/" />
            <Link href={user ? "/dashboard" : "/auth"}>
              <button className="btn-primary text-sm px-6 py-2.5">
                {user ? "Dashboard" : "Get Started"}
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section - Mobile First */}
      <main className="pt-24 pb-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          {/* Badge */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#CAFF66]/10 border border-[#CAFF66]/20">
              <Sparkles className="h-4 w-4 text-[#CAFF66]" />
              <span className="text-xs font-semibold text-[#CAFF66] uppercase tracking-wide">
                AI Health Tracker
              </span>
            </div>
          </div>

          {/* Headline - Large, Bold */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white text-center leading-[1.1] mb-6">
            Track Calories.
            <br />
            <span className="text-[#CAFF66]">Reach Your Goal.</span>
          </h1>

          {/* Subheadline - Minimal */}
          <p className="text-base sm:text-lg text-gray-400 text-center max-w-2xl mx-auto mb-10">
            AI-powered calorie tracking, meal logging, and personalized health
            insights to help you achieve your wellness goals.
          </p>

          {/* CTA - Single Primary Action */}
          <div className="flex justify-center mb-16">
            <Link href={user ? "/dashboard" : "/auth"}>
              <button className="btn-primary text-base px-8 py-4 flex items-center gap-2">
                Start Free
                <ArrowRight className="h-5 w-5" />
              </button>
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-sm text-gray-500 mb-24">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-[#CAFF66]" />
              <span>Secure & Private</span>
            </div>
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-[#CAFF66]" />
              <span>AI-Powered</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-[#CAFF66]" />
              <span>Free to Use</span>
            </div>
          </div>
        </div>

        {/* How It Works - Process */}
        <div className="max-w-6xl mx-auto mb-32">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              How It Works
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Simple, effective tracking in three steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {/* Step 1 */}
            <div className="relative">
              <div className="card p-8 h-full">
                <div className="absolute -top-4 -left-4 w-12 h-12 rounded-2xl bg-[#CAFF66] flex items-center justify-center font-bold text-black text-xl">
                  1
                </div>
                <div className="w-12 h-12 rounded-2xl bg-[#CAFF66]/10 flex items-center justify-center mb-6 mt-4">
                  <Target
                    className="h-6 w-6 text-[#CAFF66]"
                    strokeWidth={2.5}
                  />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  Set Your Goals
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Define your target weight, daily calorie goals, and activity
                  level during onboarding.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative">
              <div className="card p-8 h-full">
                <div className="absolute -top-4 -left-4 w-12 h-12 rounded-2xl bg-[#C8A8FF] flex items-center justify-center font-bold text-black text-xl">
                  2
                </div>
                <div className="w-12 h-12 rounded-2xl bg-[#C8A8FF]/10 flex items-center justify-center mb-6 mt-4">
                  <MessageCircle
                    className="h-6 w-6 text-[#C8A8FF]"
                    strokeWidth={2.5}
                  />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  Log Your Meals
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Chat with your AI assistant to log meals, upload food photos,
                  or enter nutrition manually.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative">
              <div className="card p-8 h-full">
                <div className="absolute -top-4 -left-4 w-12 h-12 rounded-2xl bg-[#FFE5A8] flex items-center justify-center font-bold text-black text-xl">
                  3
                </div>
                <div className="w-12 h-12 rounded-2xl bg-[#FFE5A8]/10 flex items-center justify-center mb-6 mt-4">
                  <LineChart
                    className="h-6 w-6 text-[#FFE5A8]"
                    strokeWidth={2.5}
                  />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  Track Progress
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Monitor your daily intake, weight trends, and progress towards
                  your goals with visual charts.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Features - Benefits Focused */}
        <div className="max-w-6xl mx-auto mb-32">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Everything You Need
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Comprehensive tools to support your health journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="card p-6 group hover:-translate-y-1 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-[#CAFF66]/10 flex items-center justify-center mb-4 group-hover:bg-[#CAFF66]/20 transition-colors">
                <MessageCircle
                  className="h-5 w-5 text-[#CAFF66]"
                  strokeWidth={2.5}
                />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                AI Chat Assistant
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Get instant nutritional advice and log meals through natural
                conversation.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="card p-6 group hover:-translate-y-1 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-[#C8A8FF]/10 flex items-center justify-center mb-4 group-hover:bg-[#C8A8FF]/20 transition-colors">
                <Camera className="h-5 w-5 text-[#C8A8FF]" strokeWidth={2.5} />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Photo Logging
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Upload food photos for automatic nutritional analysis and quick
                meal logging.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="card p-6 group hover:-translate-y-1 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-[#FFE5A8]/10 flex items-center justify-center mb-4 group-hover:bg-[#FFE5A8]/20 transition-colors">
                <TrendingUp
                  className="h-5 w-5 text-[#FFE5A8]"
                  strokeWidth={2.5}
                />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Weight Tracking
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Monitor your weight over time with visual trends and automatic
                BMI calculation.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="card p-6 group hover:-translate-y-1 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-[#9EE2C2]/10 flex items-center justify-center mb-4 group-hover:bg-[#9EE2C2]/20 transition-colors">
                <BarChart3
                  className="h-5 w-5 text-[#9EE2C2]"
                  strokeWidth={2.5}
                />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Progress Charts
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Visualize your calorie intake and weight progress with detailed
                analytics.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="card p-6 group hover:-translate-y-1 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-[#FF6F43]/10 flex items-center justify-center mb-4 group-hover:bg-[#FF6F43]/20 transition-colors">
                <Target className="h-5 w-5 text-[#FF6F43]" strokeWidth={2.5} />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Custom Goals
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Set personalized targets based on your activity level and health
                objectives.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="card p-6 group hover:-translate-y-1 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-[#E8D6FF]/10 flex items-center justify-center mb-4 group-hover:bg-[#E8D6FF]/20 transition-colors">
                <Clock className="h-5 w-5 text-[#E8D6FF]" strokeWidth={2.5} />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Meal History
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Access complete logs of your meals and weight entries anytime.
              </p>
            </div>
          </div>
        </div>

        {/* Why Choose Section */}
        <div className="max-w-5xl mx-auto mb-32">
          <div className="card p-8 sm:p-12">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Why Niblet?
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                A smarter approach to health tracking
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-xl bg-[#CAFF66]/10 flex items-center justify-center">
                    <CheckCircle2
                      className="h-5 w-5 text-[#CAFF66]"
                      strokeWidth={2.5}
                    />
                  </div>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">
                    AI-Powered Intelligence
                  </h4>
                  <p className="text-sm text-gray-400">
                    Get personalized insights and meal analysis using advanced
                    AI technology.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-xl bg-[#CAFF66]/10 flex items-center justify-center">
                    <CheckCircle2
                      className="h-5 w-5 text-[#CAFF66]"
                      strokeWidth={2.5}
                    />
                  </div>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">
                    Privacy First
                  </h4>
                  <p className="text-sm text-gray-400">
                    Your health data is encrypted and stored securely with
                    Firebase.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-xl bg-[#CAFF66]/10 flex items-center justify-center">
                    <CheckCircle2
                      className="h-5 w-5 text-[#CAFF66]"
                      strokeWidth={2.5}
                    />
                  </div>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">
                    Mobile-Optimized
                  </h4>
                  <p className="text-sm text-gray-400">
                    Seamless experience on any device with responsive design.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-xl bg-[#CAFF66]/10 flex items-center justify-center">
                    <CheckCircle2
                      className="h-5 w-5 text-[#CAFF66]"
                      strokeWidth={2.5}
                    />
                  </div>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">
                    Real-Time Sync
                  </h4>
                  <p className="text-sm text-gray-400">
                    Access your data instantly across all your devices.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Privacy & Security */}
        <div className="max-w-4xl mx-auto mb-32">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#CAFF66]/10 mb-6">
              <Lock className="h-8 w-8 text-[#CAFF66]" strokeWidth={2} />
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Your Data is Safe
            </h2>
            <p className="text-base text-gray-400 max-w-2xl mx-auto mb-8">
              Niblet uses Firebase Authentication and Cloud Firestore to keep
              your health data secure and private. Your information is encrypted
              and never shared with third parties.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-[#CAFF66]" />
                <span>End-to-end Encryption</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-[#CAFF66]" />
                <span>Secure Authentication</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#CAFF66]" />
                <span>GDPR Compliant</span>
              </div>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="max-w-4xl mx-auto text-center">
          <div className="card p-12 sm:p-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Start Your Health Journey Today
            </h2>
            <p className="text-gray-400 mb-10 max-w-2xl mx-auto">
              Join Niblet and take control of your nutrition with AI-powered
              tracking and personalized insights.
            </p>
            <Link href="/auth">
              <button className="btn-primary text-base px-10 py-4 flex items-center gap-2 mx-auto">
                Get Started Free
                <ArrowRight className="h-5 w-5" />
              </button>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-4">
              <Logo size="sm" showText={true} href="/" />
              <div className="hidden sm:flex items-center gap-3">
                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                  <Shield className="h-3 w-3 text-[#CAFF66]" />
                  <span>Encrypted</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                  <Lock className="h-3 w-3 text-[#CAFF66]" />
                  <span>Secure</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-600">
              <div className="w-1.5 h-1.5 rounded-full bg-[#CAFF66] animate-pulse"></div>
              <span>All systems operational</span>
            </div>
          </div>
          <div className="border-t border-white/5 pt-3">
            <p className="text-xs text-gray-500 text-center sm:text-left">
              © 2025 Niblet. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

"use client";

import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  MessageCircle,
  TrendingUp,
  Zap
} from "lucide-react";
import { Logo } from "@/components/logo";
import { useAuth } from "@/contexts/AuthContext";

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
      </nav>      {/* Hero Section - Mobile First */}
      <main className="pt-24 pb-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          
          {/* Badge */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#CAFF66]/10 border border-[#CAFF66]/20">
              <Sparkles className="h-4 w-4 text-[#CAFF66]" />
              <span className="text-xs font-semibold text-[#CAFF66] uppercase tracking-wide">AI Health Tracker</span>
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
            AI-assisted calorie, meal, and weight tracking for your personalized health goals.
          </p>

          {/* CTA - Single Primary Action */}
          <div className="flex justify-center mb-24">
            <Link href={user ? "/dashboard" : "/auth"}>
              <button className="btn-primary text-base px-8 py-4 flex items-center gap-2">
                Start Free
                <ArrowRight className="h-5 w-5" />
              </button>
            </Link>
          </div>

        </div>

        {/* Features - 3 Cards Only */}
        <div className="max-w-5xl mx-auto mb-24">
          <h2 className="text-3xl sm:text-4xl font-bold text-white text-center mb-12">
            Features
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Feature 1 */}
            <div className="card p-8 group hover:-translate-y-1 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-[#CAFF66]/10 flex items-center justify-center mb-6 group-hover:bg-[#CAFF66]/20 transition-colors">
                <MessageCircle className="h-6 w-6 text-[#CAFF66]" strokeWidth={2.5} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                Track Calories
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Log meals and track nutrition with AI assistance.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="card p-8 group hover:-translate-y-1 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-[#C8A8FF]/10 flex items-center justify-center mb-6 group-hover:bg-[#C8A8FF]/20 transition-colors">
                <Zap className="h-6 w-6 text-[#C8A8FF]" strokeWidth={2.5} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                Monitor Weight
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Track weight changes toward your goal.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="card p-8 group hover:-translate-y-1 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-[#FFE5A8]/10 flex items-center justify-center mb-6 group-hover:bg-[#FFE5A8]/20 transition-colors">
                <TrendingUp className="h-6 w-6 text-[#FFE5A8]" strokeWidth={2.5} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                Personalized Goals
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Set and achieve your health targets.
              </p>
            </div>

          </div>
        </div>

        {/* Final CTA - Minimal */}
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-10">
            Start Now
          </h2>
          <Link href="/auth">
            <button className="btn-primary text-base px-10 py-4 flex items-center gap-2 mx-auto">
              Get Started
              <ArrowRight className="h-5 w-5" />
            </button>
          </Link>
        </div>

      </main>

      {/* Footer - Minimal */}
      <footer className="border-t border-white/5 py-12 px-4 sm:px-6 mt-24">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <Logo size="md" showText={true} href="/" />
            <p className="text-sm text-gray-500">
              © 2025 Niblet. Health made simple.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

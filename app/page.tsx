import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Activity } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen">
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">NibletAI</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/auth">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/auth">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>
      
      <main className="container mx-auto px-6 py-20">
        <div className="text-center space-y-8">
          <h1 className="text-6xl font-bold">
            Your AI-Powered Health Assistant
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Transform your health journey with personalized AI guidance.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/auth">
              <Button size="lg">Start Your Journey</Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline" size="lg">View Demo</Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

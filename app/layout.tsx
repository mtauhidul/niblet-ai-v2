import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { UserProvider } from "@/contexts/UserContext";
import { ChatProvider } from "@/contexts/ChatContext";
import { Toaster } from "sonner";

const inter = Inter({
  weight: ['400', '500', '600', '700'],
  variable: "--font-primary",
  subsets: ["latin"],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: "NibletAI - Your AI-Powered Health Assistant",
    template: "%s | NibletAI"
  },
  description: "Transform your health journey with personalized AI guidance, smart tracking, and data-driven insights. Track calories, set goals, and get AI-powered nutritional advice.",
  keywords: ["health", "AI", "nutrition", "calorie tracking", "fitness", "weight loss", "meal planning", "health assistant"],
  authors: [{ name: "NibletAI Team" }],
  creator: "NibletAI",
  publisher: "NibletAI",
  applicationName: "NibletAI",
  metadataBase: new URL('https://niblet-ai.com'),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://niblet-ai.com",
    title: "NibletAI - Your AI-Powered Health Assistant",
    description: "Transform your health journey with personalized AI guidance, smart tracking, and data-driven insights.",
    siteName: "NibletAI",
    images: [
      {
        url: "/niblet_fi.png",
        width: 1200,
        height: 630,
        alt: "NibletAI - Your AI-Powered Health Assistant"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "NibletAI - Your AI-Powered Health Assistant",
    description: "Transform your health journey with personalized AI guidance, smart tracking, and data-driven insights.",
    images: ["/niblet_fi.png"],
    creator: "@nibletai"
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    }
  },
  icons: {
    icon: "/icon.png",
    apple: "/icon.png"
  },
  manifest: "/manifest.json"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} antialiased`}
        suppressHydrationWarning={true}
      >
        <AuthProvider>
          <UserProvider>
            <ChatProvider>
              {children}
              <Toaster />
            </ChatProvider>
          </UserProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

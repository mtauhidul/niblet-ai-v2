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
  title: "NibletAI - Your AI-Powered Health Assistant",
  description: "Transform your health journey with personalized AI guidance, smart tracking, and data-driven insights.",
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

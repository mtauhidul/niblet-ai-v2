import { BottomNavigation } from "@/components/bottom-navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      {/* Main content area with bottom padding for navigation */}
      <main className="pb-16">{children}</main>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
}

import { BottomNavigation } from "@/components/bottom-navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      {/* Main content area - takes remaining space */}
      <main className="flex-1 overflow-hidden">
        {children}
      </main>

      {/* Bottom Navigation - fixed height */}
      <BottomNavigation />
    </div>
  );
}

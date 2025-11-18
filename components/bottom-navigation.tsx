"use client";

import { cn } from "@/lib/utils";
import { BarChart3, FileText, Home, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavigationItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  href: string;
}

const navigationItems: NavigationItem[] = [
  {
    icon: Home,
    label: "Home",
    href: "/dashboard",
  },
  {
    icon: FileText,
    label: "Logs",
    href: "/dashboard/logs",
  },
  {
    icon: BarChart3,
    label: "Chart",
    href: "/dashboard/chart",
  },
  {
    icon: User,
    label: "Profile",
    href: "/dashboard/profile",
  },
];

export function BottomNavigation() {
  const pathname = usePathname();

  return (
    <div className="bg-black/60 backdrop-blur-xl border-t border-white/5 shrink-0">
      <div className="flex items-center justify-around px-2 py-3 safe-area-inset-bottom">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1.5 px-4 py-2 rounded-xl transition-all duration-200 min-w-0 flex-1 no-underline",
                isActive
                  ? "text-[#CAFF66]"
                  : "text-gray-400 hover:text-white hover:no-underline"
              )}
            >
              <Icon
                className={cn(
                  "h-5 w-5 transition-all duration-200",
                  isActive ? "text-[#CAFF66]" : "text-gray-400"
                )}
              />
              <span
                className={cn(
                  "text-[10px] font-semibold transition-all duration-200 truncate uppercase tracking-wide",
                  isActive ? "text-[#CAFF66]" : "text-gray-400"
                )}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

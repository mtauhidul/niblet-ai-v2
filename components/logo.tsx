import { Activity } from "lucide-react";
import Link from "next/link";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  href?: string;
  className?: string;
}

const sizeClasses = {
  sm: {
    container: "w-6 h-6",
    icon: "h-3 w-3",
    text: "text-sm"
  },
  md: {
    container: "w-8 h-8",
    icon: "h-4 w-4",
    text: "text-lg"
  },
  lg: {
    container: "w-16 h-16",
    icon: "h-8 w-8",
    text: "text-2xl"
  }
};

export function Logo({ size = "md", showText = true, href = "/", className = "" }: LogoProps) {
  const sizes = sizeClasses[size];
  
  const logoContent = (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className={`${sizes.container} rounded-full bg-[#CAFF66] flex items-center justify-center`}>
        <Activity className={`${sizes.icon} text-black`} strokeWidth={3} />
      </div>
      {showText && (
        <span className={`${sizes.text} font-semibold text-white`}>
          Niblet
        </span>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href}>
        {logoContent}
      </Link>
    );
  }

  return logoContent;
}

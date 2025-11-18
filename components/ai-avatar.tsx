import { cn } from "@/lib/utils";
import { Bot } from "lucide-react";

interface AIAvatarProps {
  className?: string;
}

export function AIAvatar({ className }: AIAvatarProps) {
  const isLarge = className?.includes('h-16');
  
  return (
    <div className={cn(
      "flex items-center justify-center bg-primary rounded-full",
      className
    )}>
      <Bot className={cn(
        "text-primary-foreground",
        isLarge ? "h-8 w-8" : "h-4 w-4"
      )} />
    </div>
  );
}
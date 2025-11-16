"use client";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Markdown } from "./ui/markdown";
import { AIAvatar } from "./ai-avatar";
import { User } from "lucide-react";
import { useEffect, useRef } from "react";

interface ChatMessage {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

interface ChatViewProps {
  messages: ChatMessage[];
  isLoading?: boolean;
}

export function ChatView({ messages, isLoading = false }: ChatViewProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const formatTime = (timestamp: Date) => {
    return timestamp.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="flex flex-col h-full bg-background overflow-hidden">

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-3">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <Avatar className="h-12 w-12 mb-3">
              <AvatarFallback asChild>
                <AIAvatar className="h-12 w-12" />
              </AvatarFallback>
            </Avatar>
            <h3 className="font-semibold text-base mb-2">Welcome to NibletAI!</h3>
            <p className="text-muted-foreground text-xs leading-relaxed">
              I&apos;m your AI health assistant. Ask me anything about your fitness goals!
            </p>
          </div>
        ) : (
          <>
            {messages.map((message, index) => (
              <div
                key={message.id}
                className={cn(
                  "flex gap-3 items-start animate-in slide-in-from-bottom-2 duration-300",
                  message.role === "user" ? "flex-row-reverse" : "flex-row"
                )}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Avatar */}
                <Avatar className="h-7 w-7 shrink-0">
                  {message.role === "assistant" ? (
                    <>
                      <AvatarImage src="/avatars/ai.png" alt="AI" />
                      <AvatarFallback asChild>
                        <AIAvatar className="h-7 w-7" />
                      </AvatarFallback>
                    </>
                  ) : (
                    <AvatarFallback className="bg-blue-500 text-white">
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  )}
                </Avatar>

                {/* Message Content */}
                <div className={cn(
                  "flex flex-col gap-1 max-w-[80%]",
                  message.role === "user" ? "items-end" : "items-start"
                )}>
                  <div className={cn(
                    "rounded-2xl px-3 py-2 shadow-sm",
                    message.role === "user" 
                      ? "bg-blue-600 text-white rounded-br-md" 
                      : "bg-muted rounded-bl-md"
                  )}>
                    {message.role === "assistant" ? (
                      <Markdown className="prose prose-xs max-w-none prose-p:my-0.5 prose-headings:my-1 text-xs">
                        {message.content}
                      </Markdown>
                    ) : (
                      <p className="text-xs whitespace-pre-wrap leading-relaxed">{message.content}</p>
                    )}
                  </div>
                  <span className={cn(
                    "text-[10px] text-muted-foreground px-1",
                    message.role === "user" ? "text-right" : "text-left"
                  )}>
                    {formatTime(message.timestamp)}
                  </span>
                </div>
              </div>
            ))}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex gap-3 items-start animate-in slide-in-from-bottom-2">
                <Avatar className="h-7 w-7 shrink-0">
                  <AvatarImage src="/avatars/ai.png" alt="AI" />
                  <AvatarFallback asChild>
                    <AIAvatar className="h-7 w-7" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-1">
                  <div className="bg-muted rounded-2xl rounded-bl-md px-3 py-2 shadow-sm">
                    <div className="flex items-center gap-1">
                      <div className="flex gap-1">
                        <div className="w-1.5 h-1.5 bg-muted-foreground/60 rounded-full animate-bounce" />
                        <div className="w-1.5 h-1.5 bg-muted-foreground/60 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                        <div className="w-1.5 h-1.5 bg-muted-foreground/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      </div>
                      <span className="text-[10px] text-muted-foreground ml-2">Thinking...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>
    </div>
  );
}

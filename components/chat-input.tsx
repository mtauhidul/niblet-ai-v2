"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Paperclip, Send } from "lucide-react";
import { useRef, useState } from "react";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

export default function ChatInput({ onSendMessage, disabled = false }: ChatInputProps) {
  const [input, setInput] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (input.trim() && !disabled) {
      onSendMessage(input.trim());
      setInput("");
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = Math.min(textarea.scrollHeight, 120) + "px";
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    adjustTextareaHeight();
  };

  return (
    <div className="bg-background border-t">
      <div className="p-3">
        <form onSubmit={handleSubmit} className="relative">
          <div className="relative flex items-end gap-2 bg-muted/30 border border-border rounded-2xl p-2 focus-within:ring-1 focus-within:ring-ring">
            {/* Attachment Button */}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0 rounded-full hover:bg-muted shrink-0"
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled}
            >
              <Paperclip className="h-3.5 w-3.5" />
              <span className="sr-only">Attach file</span>
            </Button>

            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,.pdf,.txt,.doc,.docx"
              className="sr-only"
              onChange={(e) => {
                console.log("Files selected:", e.target.files);
                // TODO: Handle file uploads
              }}
            />

            {/* Text Input */}
            <div className="flex-1 min-w-0">
              <Textarea
                ref={textareaRef}
                value={input}
                onChange={handleInputChange}
                placeholder={disabled ? "AI is responding..." : "Type a message about your health goals..."}
                className={cn(
                  "min-h-8 max-h-20 resize-none border-0 bg-transparent p-0 shadow-none focus-visible:ring-0 placeholder:text-muted-foreground text-sm",
                  disabled && "cursor-not-allowed opacity-50"
                )}
                rows={1}
                disabled={disabled}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit();
                  }
                }}
              />
            </div>

            {/* Send Button */}
            <Button
              type="submit"
              size="sm"
              className={cn(
                "h-7 w-7 p-0 rounded-full shrink-0 transition-all duration-200",
                input.trim() && !disabled
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              )}
              disabled={!input.trim() || disabled}
            >
              <Send className="h-3.5 w-3.5" />
              <span className="sr-only">Send message</span>
            </Button>
          </div>

        </form>

        {/* Quick Actions */}
        <div className="flex gap-2 mt-2 overflow-x-auto pb-1">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="text-xs rounded-full whitespace-nowrap shrink-0"
            onClick={() => setInput("What should I eat for breakfast?")}
            disabled={disabled}
          >
            💪 Meals
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="text-xs rounded-full whitespace-nowrap shrink-0"
            onClick={() => setInput("How am I progressing towards my weight goal?")}
            disabled={disabled}
          >
            📊 Progress
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="text-xs rounded-full whitespace-nowrap shrink-0"
            onClick={() => setInput("Create a workout plan for me")}
            disabled={disabled}
          >
            🏋️ Workout
          </Button>
        </div>
      </div>
    </div>
  );
}

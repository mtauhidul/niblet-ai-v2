"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Paperclip, Send } from "lucide-react";
import { useRef, useState } from "react";

interface ChatInputProps {
  onSendMessage: (message: string, image?: File) => void;
  disabled?: boolean;
}

export default function ChatInput({ onSendMessage, disabled = false }: ChatInputProps) {
  const [input, setInput] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if ((input.trim() || selectedImage) && !disabled) {
      onSendMessage(input.trim(), selectedImage || undefined);
      setInput("");
      setSelectedImage(null);
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
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
              accept="image/*"
              className="sr-only"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setSelectedImage(file);
                }
              }}
            />

            {/* Text Input */}
            <div className="flex-1 min-w-0">
              {/* Selected Image Preview */}
              {selectedImage && (
                <div className="mb-2 relative">
                  <div className="flex items-center gap-2 p-2 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <span className="text-xs text-blue-700 dark:text-blue-300">📷 {selectedImage.name}</span>
                    <button
                      type="button"
                      onClick={() => setSelectedImage(null)}
                      className="ml-auto text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              )}
              <Textarea
                ref={textareaRef}
                value={input}
                onChange={handleInputChange}
                placeholder={disabled ? "Niblet is responding..." : selectedImage ? "Describe this food or ask about it..." : "Ask Niblet about meals, goals, or upload food photos..."}
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
                (input.trim() || selectedImage) && !disabled
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              )}
              disabled={(!input.trim() && !selectedImage) || disabled}
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
            onClick={() => setInput("I just ate 150g grilled chicken with 100g rice and steamed broccoli")}
            disabled={disabled}
          >
            🍳 Log meal
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="text-xs rounded-full whitespace-nowrap shrink-0"
            onClick={() => setInput("My current weight is 70kg")}
            disabled={disabled}
          >
            ⚖️ Log weight
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="text-xs rounded-full whitespace-nowrap shrink-0"
            onClick={() => setInput("How am I doing with my goals today?")}
            disabled={disabled}
          >
            📊 Progress
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="text-xs rounded-full whitespace-nowrap shrink-0"
            onClick={() => setInput("Suggest a healthy dinner under 500 calories")}
            disabled={disabled}
          >
            🥗 Meal ideas
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="text-xs rounded-full whitespace-nowrap shrink-0"
            onClick={() => setInput("Remove my last meal")}
            disabled={disabled}
          >
            🗑️ Remove meal
          </Button>
        </div>
      </div>
    </div>
  );
}

"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { IconPlus, IconSend } from "@tabler/icons-react";
import { useRef, useState } from "react";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
}

export default function ChatInput({ onSendMessage }: ChatInputProps) {
  const [input, setInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSendMessage(input.trim());
      setInput("");
    }
  };

  return (
    <div className="w-xl">
      <div className="bg-background border border-border rounded-2xl overflow-hidden">
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="sr-only"
          onChange={(e) => {
            console.log(e.target.files);
          }}
        />

        <div className="px-3 pt-3 pb-2 grow">
          <form onSubmit={handleSubmit}>
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about your health goals..."
              className="w-full bg-transparent! p-0 border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 text-foreground placeholder-muted-foreground resize-none border-none outline-none text-sm min-h-10 max-h-[25vh]"
              rows={1}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = "auto";
                target.style.height = target.scrollHeight + "px";
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />
          </form>
        </div>

        <div className="mb-2 px-2 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0 rounded-full border border-border hover:bg-accent"
              onClick={() => fileInputRef.current?.click()}
            >
              <IconPlus className="size-3" />
            </Button>
          </div>

          <div>
            <Button
              type="submit"
              disabled={!input.trim()}
              className="size-7 p-0 rounded-full bg-primary disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleSubmit}
            >
              <IconSend className="size-3 fill-primary" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import { CodeBlock } from "@/components/ui/code-block";

interface MarkdownProps {
  children: string;
  className?: string;
}

interface CodeProps {
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export function Markdown({ children, className }: MarkdownProps) {
  return (
    <div className={cn("markdown", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkBreaks]}
        components={{
          code: ({ inline, className, children, ...props }: CodeProps) => {
            const match = /language-(\w+)/.exec(className || "");
            const language = match ? match[1] : "";

            if (!inline && language) {
              return (
                <CodeBlock
                  language={language}
                  value={String(children).replace(/\n$/, "")}
                />
              );
            }

            return (
              <code
                className={cn(
                  "bg-white/10 px-1.5 py-0.5 rounded text-sm font-mono",
                  className
                )}
                {...props}
              >
                {children}
              </code>
            );
          },
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}

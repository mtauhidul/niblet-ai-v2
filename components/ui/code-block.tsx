"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface CodeBlockProps {
  language: string;
  value: string;
}

export function CodeBlock({ language, value }: CodeBlockProps) {
  const [highlightedCode, setHighlightedCode] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function highlightCode() {
      try {
        const shiki = await import("shiki");
        const highlighter = await shiki.createHighlighter({
          themes: ["github-dark"],
          langs: [language || "text"],
        });

        const html = highlighter.codeToHtml(value, {
          lang: language || "text",
          theme: "github-dark",
        });

        setHighlightedCode(html);
      } catch (error) {
        console.error("Error highlighting code:", error);
        setHighlightedCode(`<pre><code>${value}</code></pre>`);
      } finally {
        setIsLoading(false);
      }
    }

    highlightCode();
  }, [language, value]);

  if (isLoading) {
    return (
      <pre className={cn("rounded-lg bg-[#0d1117] p-4 overflow-x-auto")}>
        <code>{value}</code>
      </pre>
    );
  }

  return (
    <div
      className={cn("rounded-lg overflow-x-auto my-2")}
      dangerouslySetInnerHTML={{ __html: highlightedCode }}
    />
  );
}

import { Message, MessageAvatar, MessageContent } from "./ui/message";

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
  return (
    <div className="flex flex-col gap-4 max-h-96 overflow-y-auto p-4 border rounded-lg">
      {messages.map((message) => (
        <Message
          key={message.id}
          className={message.role === "user" ? "justify-end" : "justify-start"}
        >
          {message.role === "assistant" && (
            <MessageAvatar src="/avatars/ai.png" alt="AI" fallback="AI" />
          )}
          <MessageContent
            markdown={message.role === "assistant"}
            className={
              message.role === "user"
                ? "bg-primary text-primary-foreground"
                : "bg-transparent p-0"
            }
          >
            {message.content}
          </MessageContent>
        </Message>
      ))}

      {isLoading && (
        <Message className="justify-start">
          <MessageAvatar src="/avatars/ai.png" alt="AI" fallback="AI" />
          <MessageContent className="bg-transparent p-0">
            AI is thinking...
          </MessageContent>
        </Message>
      )}
    </div>
  );
}

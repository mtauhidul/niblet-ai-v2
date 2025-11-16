"use client";

import ChatInput from "@/components/chat-input";
import { ChatView } from "@/components/chat-view";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

export default function Dashboard() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "Hello! I'm your AI health assistant. How can I help you with your fitness and nutrition goals today?",
      role: "assistant",
      timestamp: new Date(),
    },
  ]);
  const [messageCounter, setMessageCounter] = useState(2);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = (content: string) => {
    const userMessage: Message = {
      id: messageCounter.toString(),
      content,
      role: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setMessageCounter((prev) => prev + 1);
    setIsLoading(true);

    // Simulate AI response (replace with actual AI integration later)
    setTimeout(() => {
      const aiResponse: Message = {
        id: (messageCounter + 1).toString(),
        content: generateAIResponse(content),
        role: "assistant",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);
      setMessageCounter((prev) => prev + 1);
      setIsLoading(false);
    }, 1000);
  };

  const generateAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();

    if (lowerMessage.includes("weight") || lowerMessage.includes("lose")) {
      return "Based on your current progress, you're doing great! You've lost 3.6kg so far. To continue your weight loss journey, I recommend maintaining your current calorie deficit of around 1,950 calories per day. Would you like some meal suggestions or workout tips?";
    }

    if (
      lowerMessage.includes("calories") ||
      lowerMessage.includes("food") ||
      lowerMessage.includes("meal")
    ) {
      return "Your average daily intake has been around 2,075 calories. To reach your target weight of 70kg, I suggest aiming for 1,950 calories per day. Focus on lean proteins, vegetables, and whole grains. Would you like me to suggest some healthy meal ideas?";
    }

    if (
      lowerMessage.includes("exercise") ||
      lowerMessage.includes("workout") ||
      lowerMessage.includes("fitness")
    ) {
      return "Regular exercise is key to reaching your goals! I recommend a mix of cardio and strength training. Based on your progress, 5 days per week seems to be working well. Would you like me to suggest some specific workout routines?";
    }

    if (lowerMessage.includes("progress") || lowerMessage.includes("goal")) {
      return "You're making excellent progress! You're 57% of the way to your target weight. At your current rate, you should reach your goal of 70kg by March 2025. Keep up the great work! Is there anything specific you'd like to adjust about your current plan?";
    }

    return "I'm here to help with your health and fitness journey! I can assist with meal planning, workout suggestions, progress tracking, and motivation. What specific area would you like to focus on today?";
  };

  return (
    <div className="container mx-auto p-6">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to your health and fitness dashboard
          </p>
        </div>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Progress Overview</h2>
          <Progress value={70} className="w-full" />
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">AI Assistant</h2>
          <ChatView messages={messages} isLoading={isLoading} />
          <ChatInput onSendMessage={handleSendMessage} />
        </section>
      </div>
    </div>
  );
}

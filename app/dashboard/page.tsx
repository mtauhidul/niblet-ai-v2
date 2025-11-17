"use client";

import ChatInput from "@/components/chat-input";
import { ChatView } from "@/components/chat-view";
import { DashboardHeader } from "@/components/dashboard-header";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/AuthContext";
import { useUserData } from "@/contexts/UserContext";
import { useMemo, useState } from "react";

const getTimeBasedGreeting = (userName: string) => {
  const hour = new Date().getHours();
  let timeOfDay = "";

  if (hour < 12) {
    timeOfDay = "Good morning";
  } else if (hour < 17) {
    timeOfDay = "Good afternoon";
  } else {
    timeOfDay = "Good evening";
  }

  return `${timeOfDay}, ${userName}!`;
};

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

export default function Dashboard() {
  const { userProfile } = useAuth();
  const { mealLogs, weightLogs, loading: dataLoading } = useUserData();

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: userProfile?.firstName
        ? `${getTimeBasedGreeting(
            userProfile.firstName
          )}! I'm your AI health assistant. How can I help you with your fitness and nutrition goals today?`
        : "Hello! I'm your AI health assistant. How can I help you with your fitness and nutrition goals today?",
      role: "assistant",
      timestamp: new Date(),
    },
  ]);
  const [messageCounter, setMessageCounter] = useState(2);
  const [isLoading, setIsLoading] = useState(false);

  // Calculate daily calorie progress
  const progressData = useMemo(() => {
    if (!userProfile) return { progress: 0, message: "No data available" };

    const targetCalories = userProfile.targetCalories || 2000; // Default to 2000 if not set
    
    // Get today's meals
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todaysMeals = mealLogs.filter(meal => {
      const mealDate = new Date(meal.consumedAt);
      mealDate.setHours(0, 0, 0, 0);
      return mealDate.getTime() === today.getTime();
    });

    const consumedCalories = todaysMeals.reduce((total, meal) => total + meal.calories, 0);
    const progress = Math.min((consumedCalories / targetCalories) * 100, 100);
    const remaining = Math.max(targetCalories - consumedCalories, 0);

    return {
      progress: Math.round(progress),
      message: remaining > 0 ? `${remaining} cal remaining` : "Target reached!",
      consumedCalories: Math.round(consumedCalories),
      targetCalories,
      remaining: Math.round(remaining),
    };
  }, [userProfile, mealLogs]);

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: messageCounter.toString(),
      content,
      role: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setMessageCounter((prev) => prev + 1);
    setIsLoading(true);

    try {
      // Get contextual information for AI
      const context = getContextualInfo();
      
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: `${content}\n\nContext: ${context}`,
          context: "general_chat"
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to get AI response');
      }

      const aiResponse: Message = {
        id: (messageCounter + 1).toString(),
        content: data.response || generateAIResponse(content), // Fallback to local response
        role: "assistant",
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, aiResponse]);
      setMessageCounter((prev) => prev + 1);
    } catch (error) {
      console.error('Error getting AI response:', error);
      // Fallback to local generation on error
      const fallbackResponse: Message = {
        id: (messageCounter + 1).toString(),
        content: generateAIResponse(content),
        role: "assistant",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, fallbackResponse]);
      setMessageCounter((prev) => prev + 1);
    } finally {
      setIsLoading(false);
    }
  };

  // Generate contextual information for AI
  const getContextualInfo = (): string => {
    const context = [];
    
    if (userProfile) {
      context.push(`User Profile: ${userProfile.firstName}, ${userProfile.age}yo, ${userProfile.gender}, ${userProfile.currentWeight}kg, Activity: ${userProfile.activityLevel}`);
      if (userProfile.targetWeight) context.push(`Target: ${userProfile.targetWeight}kg`);
      if (userProfile.targetCalories) context.push(`Daily calorie target: ${userProfile.targetCalories}`);
    }
    
    if (progressData.consumedCalories !== undefined) {
      context.push(`Today's intake: ${progressData.consumedCalories}/${progressData.targetCalories} calories`);
    }
    
    if (weightLogs.length > 0) {
      context.push(`Latest weight: ${weightLogs[0].weight}kg`);
    }
    
    return context.join(' | ');
  };

  const generateAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    const latestWeight = weightLogs[0]?.weight || 0;
    const targetCalories = userProfile?.targetCalories || 2000;

    // Calculate today's calories from meal logs
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todaysMeals = mealLogs.filter((meal) => {
      const mealDate = new Date(meal.consumedAt);
      mealDate.setHours(0, 0, 0, 0);
      return mealDate.getTime() === today.getTime();
    });
    const todaysCalories = todaysMeals.reduce(
      (total, meal) => total + meal.calories,
      0
    );

    if (lowerMessage.includes("weight") || lowerMessage.includes("lose")) {
      if (weightLogs.length > 1) {
        const weightLost =
          (weightLogs[weightLogs.length - 1]?.weight || 0) - latestWeight;
        return `Based on your current progress, you're doing great! ${
          latestWeight
            ? `Your current weight is ${latestWeight}kg`
            : "Start logging your weight to track progress"
        }. ${
          weightLost > 0 ? `You've lost ${weightLost.toFixed(1)}kg so far.` : ""
        } ${
          targetCalories
            ? `To continue your journey, I recommend maintaining around ${targetCalories} calories per day.`
            : "Set your calorie target in your profile."
        } Would you like some meal suggestions or workout tips?`;
      }
      return "I'd love to help you with your weight goals! Start by logging your current weight and setting your target weight in your profile. This will help me provide personalized advice.";
    }

    if (
      lowerMessage.includes("calories") ||
      lowerMessage.includes("food") ||
      lowerMessage.includes("meal")
    ) {
      if (todaysCalories > 0) {
        return `Today you've consumed ${todaysCalories} calories. ${
          targetCalories
            ? `Your target is ${targetCalories} calories per day.`
            : "Set your calorie target in your profile for better tracking."
        } ${
          todaysCalories < targetCalories
            ? "You have some room for more nutritious foods today!"
            : "You're on track with your calories!"
        } Focus on lean proteins, vegetables, and whole grains. Would you like me to suggest some healthy meal ideas?`;
      }
      return `${
        targetCalories
          ? `Your target is ${targetCalories} calories per day.`
          : "Set your calorie target in your profile."
      } Start logging your meals to track your intake! Focus on lean proteins, vegetables, and whole grains. Would you like me to suggest some healthy meal ideas?`;
    }

    if (
      lowerMessage.includes("exercise") ||
      lowerMessage.includes("workout") ||
      lowerMessage.includes("fitness")
    ) {
      return "Regular exercise is key to reaching your goals! I recommend a mix of cardio and strength training. Would you like me to suggest some specific workout routines based on your fitness level?";
    }

    if (lowerMessage.includes("progress") || lowerMessage.includes("goal")) {
      if (progressData.progress > 0 && progressData.consumedCalories !== undefined) {
        return `You're making excellent progress with your nutrition! You've consumed ${progressData.consumedCalories} calories today, which is ${progressData.progress}% of your daily target. ${
          progressData.remaining && progressData.remaining > 0
            ? `You have ${progressData.remaining} calories remaining for today.`
            : "You've reached your calorie target for today!"
        } Keep up the great work! Is there anything specific you'd like to adjust about your current plan?`;
      }
      return "Let's get you started on tracking your daily nutrition! Set your calorie target in your profile and start logging your meals. I can provide personalized guidance on your health journey.";
    }

    return "I'm here to help with your health and fitness journey! I can assist with meal planning, workout suggestions, progress tracking, and motivation. What specific area would you like to focus on today?";
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header - fixed height */}
      <div className="px-4 py-3 border-b bg-background/95 backdrop-blur">
        <DashboardHeader
          title="Dashboard"
          description="Your health journey at a glance"
        />
      </div>

      {/* Main content - flexible height */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Progress Overview - compact */}
        <div className="px-4 py-3 border-b bg-background">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold">Progress</h3>
            <span className="text-xs text-muted-foreground">
              {dataLoading ? "Loading..." : progressData.message}
            </span>
          </div>
          <Progress value={progressData.progress} className="h-2" />
          {progressData.consumedCalories !== undefined && progressData.targetCalories && (
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>Consumed: {progressData.consumedCalories} cal</span>
              <span>Target: {progressData.targetCalories} cal</span>
            </div>
          )}
        </div>

        {/* Chat Section - takes remaining space */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="px-4 py-2 border-b">
            <h3 className="text-sm font-semibold">Niblet AI Assistant</h3>
          </div>

          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-hidden">
              <ChatView messages={messages} isLoading={isLoading} />
            </div>
            <ChatInput onSendMessage={handleSendMessage} disabled={isLoading} />
          </div>
        </div>
      </div>
    </div>
  );
}

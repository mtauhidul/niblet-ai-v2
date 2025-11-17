"use client";

import ChatInput from "@/components/chat-input";
import { ChatView } from "@/components/chat-view";
import { DashboardHeader } from "@/components/dashboard-header";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useUserData } from "@/contexts/UserContext";
import { useChat } from "@/contexts/ChatContext";
import { useMemo } from "react";
import { RefreshCw } from "lucide-react";





export default function Dashboard() {
  const { userProfile } = useAuth();
  const { mealLogs, loading: dataLoading } = useUserData();
  const { messages, isLoading, loadingType, sendMessage, startNewSession } = useChat();

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

  // Add a new session button to the header
  const handleNewSession = () => {
    startNewSession();
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
          <div className="px-4 py-2 border-b flex items-center justify-between">
            <h3 className="text-sm font-semibold">Niblet AI Assistant</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleNewSession}
              className="text-xs h-7 px-2"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              New Session
            </Button>
          </div>

          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-hidden">
              <ChatView messages={messages} isLoading={isLoading} loadingType={loadingType} />
            </div>
            <ChatInput onSendMessage={sendMessage} disabled={isLoading} />
          </div>
        </div>
      </div>
    </div>
  );
}

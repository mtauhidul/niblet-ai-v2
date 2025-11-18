"use client";

import ChatInput from "@/components/chat-input";
import { ChatView } from "@/components/chat-view";
import { useAuth } from "@/contexts/AuthContext";
import { useUserData } from "@/contexts/UserContext";
import { useChat } from "@/contexts/ChatContext";
import { useMemo } from "react";
import { Flame, Target, TrendingUp, RefreshCw } from "lucide-react";
import { Logo } from "@/components/logo";

export default function Dashboard() {
  const { userProfile } = useAuth();
  const { mealLogs, loading: dataLoading } = useUserData();
  const { messages, isLoading, loadingType, sendMessage, startNewSession } = useChat();

  // Calculate daily calorie progress
  const progressData = useMemo(() => {
    if (!userProfile) return { 
      progress: 0, 
      consumedCalories: 0, 
      targetCalories: 2000, 
      remaining: 2000 
    };

    const targetCalories = userProfile.targetCalories || 2000;
    
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
      consumedCalories: Math.round(consumedCalories),
      targetCalories,
      remaining: Math.round(remaining),
    };
  }, [userProfile, mealLogs]);

  const handleNewSession = () => {
    startNewSession();
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header - Minimal with Logo */}
      <div className="px-4 py-3 border-b border-white/5">
        <div className="flex items-center justify-between">
          <Logo size="md" showText={true} href="/dashboard" />
          <button
            onClick={handleNewSession}
            className="text-xs text-gray-400 hover:text-white transition-colors flex items-center gap-1"
          >
            <RefreshCw className="h-3 w-3" />
            New Chat
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* KPI Cards - Ultra Compact */}
        <div className="px-3 py-2 border-b border-white/5">
          <div className="grid grid-cols-3 gap-1.5 mb-2">
            
            {/* Consumed Calories */}
            <div className="card p-2">
              <div className="flex items-center gap-1 mb-0.5">
                <Flame className="h-3 w-3 text-[#CAFF66]" strokeWidth={2.5} />
                <div className="text-[9px] text-gray-500 uppercase tracking-wide">In</div>
              </div>
              <div className="text-lg font-bold text-white leading-tight">
                {dataLoading ? "..." : progressData.consumedCalories}
              </div>
            </div>

            {/* Target Calories */}
            <div className="card p-2">
              <div className="flex items-center gap-1 mb-0.5">
                <Target className="h-3 w-3 text-[#FFE5A8]" strokeWidth={2.5} />
                <div className="text-[9px] text-gray-500 uppercase tracking-wide">Goal</div>
              </div>
              <div className="text-lg font-bold text-white leading-tight">
                {progressData.targetCalories}
              </div>
            </div>

            {/* Remaining Calories */}
            <div className="card p-2">
              <div className="flex items-center gap-1 mb-0.5">
                <TrendingUp className="h-3 w-3 text-[#C8A8FF]" strokeWidth={2.5} />
                <div className="text-[9px] text-gray-500 uppercase tracking-wide">Left</div>
              </div>
              <div className="text-lg font-bold text-white leading-tight">
                {dataLoading ? "..." : progressData.remaining}
              </div>
            </div>

          </div>

          {/* Progress Bar - Ultra Compact */}
          <div className="flex items-center gap-2">
            <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#CAFF66] transition-all duration-500 rounded-full"
                style={{ width: `${progressData.progress}%` }}
              />
            </div>
            <span className="text-[9px] font-semibold text-gray-500 min-w-7 text-right">{progressData.progress}%</span>
          </div>
        </div>

        {/* Chat Section */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="px-4 py-3 border-b border-white/5">
            <h3 className="text-sm font-semibold text-white">Niblet AI</h3>
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

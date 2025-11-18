"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useUserData } from './UserContext';

interface ChatMessage {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
  image?: {
    url: string;
    file?: File;
  };
  metadata?: {
    mealLogged?: boolean;
    mealRemoved?: boolean;
    weightLogged?: boolean;
    loggedMeal?: {
      mealName: string;
      calories: number;
      protein: number;
      carbs: number;
      fat: number;
      mealType: string;
    };
    removedMeal?: {
      mealName: string;
      mealId?: string;
    };
    loggedWeight?: {
      weight: number;
    };
  };
}

interface ChatContextType {
  messages: ChatMessage[];
  isLoading: boolean;
  loadingType: 'thinking' | 'logging';
  sendMessage: (content: string, image?: File) => Promise<void>;
  clearChat: () => void;
  startNewSession: () => void;
}

const ChatContext = createContext<ChatContextType | null>(null);

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

// Generate a truly unique ID
const generateUniqueId = (): string => {
  return `${Date.now()}-${performance.now()}-${Math.random().toString(36).substring(2, 11)}`;
};

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { userProfile, user } = useAuth();
  const { addMealLog, deleteMealLog, mealLogs, addWeightLog } = useUserData();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingType, setLoadingType] = useState<'thinking' | 'logging'>('thinking');

  // Load messages from sessionStorage on mount
  useEffect(() => {
    if (user?.uid) {
      const savedMessages = sessionStorage.getItem(`chat_messages_${user.uid}`);
      const version = sessionStorage.getItem(`chat_version_${user.uid}`);
      
      // Clear old messages if they're from an incompatible version
      if (version !== "2.0" && savedMessages) {
        console.log("Clearing old chat messages due to version incompatibility");
        sessionStorage.removeItem(`chat_messages_${user.uid}`);
        sessionStorage.setItem(`chat_version_${user.uid}`, "2.0");
        return;
      }
      
      if (savedMessages) {
        try {
          const parsedMessages = JSON.parse(savedMessages).map((msg: ChatMessage & { timestamp: string }, index: number) => ({
            ...msg,
            // Ensure unique ID for legacy messages that might have duplicate IDs
            id: msg.id?.includes('-') && msg.id.split('-').length >= 3 ? msg.id : `${generateUniqueId()}-legacy-${index}`,
            timestamp: new Date(msg.timestamp)
          }));
          
          // Remove any potential duplicates based on content and timestamp
          const uniqueMessages = parsedMessages.filter((msg: ChatMessage, index: number, arr: ChatMessage[]) => 
            arr.findIndex((m: ChatMessage) => m.content === msg.content && m.role === msg.role && 
              Math.abs(new Date(m.timestamp).getTime() - new Date(msg.timestamp).getTime()) < 1000) === index
          );
          
          setMessages(uniqueMessages);
        } catch (error) {
          console.error('Error loading saved messages:', error);
        }
      }
    }
  }, [user?.uid]);

  // Save messages to sessionStorage whenever messages change
  useEffect(() => {
    if (user?.uid && messages.length > 0) {
      // Remove File objects before saving to sessionStorage (they can't be serialized)
      const messagesToSave = messages.map(msg => ({
        ...msg,
        ...(msg.image && {
          image: {
            url: msg.image.url,
            // Don't save the file object
          }
        })
      }));
      sessionStorage.setItem(`chat_messages_${user.uid}`, JSON.stringify(messagesToSave));
      sessionStorage.setItem(`chat_version_${user.uid}`, "2.0");
    }
  }, [messages, user?.uid]);

  // Clear messages when user logs out
  useEffect(() => {
    if (!user) {
      setMessages([]);
    }
  }, [user]);





  const buildUserContext = (): string => {
    const context = [];
    
    if (userProfile) {
      context.push(`User: ${userProfile.firstName}`);
      context.push(`Age: ${userProfile.age}, Gender: ${userProfile.gender}`);
      context.push(`Current Weight: ${userProfile.currentWeight}kg`);
      if (userProfile.targetWeight) context.push(`Target Weight: ${userProfile.targetWeight}kg`);
      if (userProfile.goalType) context.push(`Goal: ${userProfile.goalType.replace('_', ' ')}`);
      if (userProfile.targetCalories) context.push(`Daily Calorie Target: ${userProfile.targetCalories}`);
      if (userProfile.targetProtein) context.push(`Daily Protein Target: ${userProfile.targetProtein}g`);
      context.push(`Activity Level: ${userProfile.activityLevel?.replace('_', ' ')}`);
      
      // Add location information for better meal suggestions
      if (userProfile.city && userProfile.country) {
        context.push(`Location: ${userProfile.city}, ${userProfile.country}`);
      }
      if (userProfile.timezone) {
        context.push(`Timezone: ${userProfile.timezone}`);
      }
    }
    
    // Today's meal data
    const today = new Date().toDateString();
    const todaysMeals = mealLogs.filter(meal => 
      new Date(meal.consumedAt).toDateString() === today
    );
    
    if (todaysMeals.length > 0) {
      const totalCalories = todaysMeals.reduce((sum, meal) => sum + meal.calories, 0);
      const totalProtein = todaysMeals.reduce((sum, meal) => sum + meal.protein, 0);
      context.push(`Today's Intake: ${totalCalories} calories, ${totalProtein}g protein`);
      context.push(`Meals logged today: ${todaysMeals.length}`);
      
      // Add recent meal names for removal reference
      const recentMealNames = todaysMeals.slice(0, 3).map(meal => meal.mealName).join(', ');
      if (recentMealNames) {
        context.push(`Recent meals: ${recentMealNames}`);
      }
    } else {
      context.push("No meals logged today yet");
    }
    
    const currentTime = new Date().toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      timeZoneName: 'short'
    });
    context.push(`Current Time: ${currentTime}`);
    
    return context.join(', ');
  };

  const sendMessage = async (content: string, image?: File): Promise<void> => {
    if (!content.trim() && !image) return;

    // Create image URL for display if image is provided
    let imageData;
    if (image) {
      imageData = {
        url: URL.createObjectURL(image),
        file: image
      };
    }

    const userMessage: ChatMessage = {
      id: generateUniqueId(),
      content: content.trim() || (image ? "🍽️ Food image" : ""),
      role: "user",
      timestamp: new Date(),
      ...(imageData && { image: imageData }),
    };

    setMessages(prev => [...prev, userMessage]);
    
    // Check if this might be a meal/weight logging/removal request to show appropriate loading text
    const isMealLogging = content.toLowerCase().match(/(i ate|i had|i consumed|just ate|just had)/);
    const isWeightLogging = content.toLowerCase().match(/(i weigh|my weight|current weight|weighed myself|weight today)/);
    const isMealRemoving = content.toLowerCase().match(/(remove|delete|cancel|undo.*meal)/);
    setLoadingType(isMealLogging || isWeightLogging || isMealRemoving ? 'logging' : 'thinking');
    setIsLoading(true);

    try {
      const userContext = buildUserContext();
      
      // Prepare the prompt for the AI
      const aiPrompt = `
        You are Niblet, a friendly AI health coach. Keep responses SHORT (1-2 sentences max) and helpful.
        
        User Context: ${userContext}
        
        User Message: "${content}"
        ${image ? "User has uploaded a food image. You can identify the food but MUST ask for portion size/amount to calculate accurate nutrition." : ""}
        
        Rules:
        1. Keep responses very short and encouraging
        2. Use user's name and context when relevant
        3. ONLY log meals when user explicitly mentions eating/consuming food (past tense)
        4. For meal suggestions, DO NOT log - just provide advice
        5. Use accurate nutrition data from USDA database standards
        6. Include realistic amounts of protein, carbs, AND fats
        
        Examples:
        - "What should I eat?" = Suggestion only (no logging)
        - "I ate chicken salad" = Log the meal with accurate nutrition
        
        For ACTUAL meal logging (past tense consumption), respond with:
        {
          "response": "Great choice! Meal logged successfully.",
          "mealLog": {
            "shouldLog": true,
            "mealName": "exact meal name",
            "mealType": "breakfast/lunch/dinner/snack",
            "amount": realistic_amount,
            "unit": "g/ml/piece/serving", 
            "calories": accurate_calories,
            "protein": accurate_protein_grams,
            "carbs": accurate_carbs_grams,
            "fat": accurate_fat_grams,
            "fiber": accurate_fiber_grams
          }
        }
        
        For meal suggestions or advice, respond with:
        {
          "response": "Short helpful advice with specific recommendations"
        }
      `;

      const requestBody: {
        message: string;
        context: string;
        image?: string;
      } = {
        message: aiPrompt,
        context: "niblet_assistant"
      };

      // Handle image upload if present
      if (image) {
        const base64Image = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(image);
        });
        requestBody.image = base64Image;
      }

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to get AI response');
      }

      let aiResponseData;
      try {
        aiResponseData = JSON.parse(data.response);
      } catch {
        // Fallback if response is not JSON
        aiResponseData = { response: data.response };
      }

      const aiMessage: ChatMessage = {
        id: generateUniqueId(),
        content: aiResponseData.response,
        role: "assistant",
        timestamp: new Date(),
      };

      // Handle meal logging if detected and should log is true
      if (aiResponseData.mealLog && aiResponseData.mealLog.shouldLog === true) {
        try {
          const mealData = aiResponseData.mealLog;
          
          await addMealLog({
            mealName: mealData.mealName,
            mealType: mealData.mealType as 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'other',
            amount: mealData.amount,
            unit: mealData.unit as 'g' | 'ml' | 'oz' | 'cup' | 'piece' | 'serving',
            calories: mealData.calories,
            protein: mealData.protein,
            carbohydrates: mealData.carbs,
            fat: mealData.fat,
            fiber: mealData.fiber,
            consumedAt: new Date(),
          });

          // Add meal log metadata to the message
          aiMessage.metadata = {
            mealLogged: true,
            loggedMeal: {
              mealName: mealData.mealName,
              calories: mealData.calories,
              protein: mealData.protein,
              carbs: mealData.carbs,
              fat: mealData.fat,
              mealType: mealData.mealType,
            }
          };

          // Update AI response to confirm logging
          aiMessage.content += `\n\n✅ Logged: ${mealData.mealName} - ${mealData.calories}cal, ${mealData.protein}g protein, ${mealData.carbs}g carbs, ${mealData.fat}g fat`;
          
        } catch (error) {
          console.error('Error logging meal:', error);
          aiMessage.content += `\n\n❌ Couldn't log that meal. Please try again.`;
        }
        
        // Reset loading type after meal processing
        setLoadingType('thinking');
      }

      // Handle weight logging if detected and should log is true
      if (aiResponseData.weightLog && aiResponseData.weightLog.shouldLog === true) {
        try {
          const weightData = aiResponseData.weightLog;
          
          await addWeightLog(weightData.weight);

          // Add weight log metadata to the message
          aiMessage.metadata = {
            ...aiMessage.metadata,
            weightLogged: true,
            loggedWeight: {
              weight: weightData.weight,
            }
          };

          // Update AI response to confirm logging
          aiMessage.content += `\n\n⚖️ Weight logged: ${weightData.weight}kg`;
          
        } catch (error) {
          console.error('Error logging weight:', error);
          aiMessage.content += `\n\n❌ Couldn't log your weight. Please try again.`;
        }
      }

      // Handle meal removal if detected
      if (aiResponseData.mealRemoval && aiResponseData.mealRemoval.shouldRemove) {
        try {
          const removalData = aiResponseData.mealRemoval;
          let mealToDelete = null;

          if (removalData.mealToRemove === 'latest' || removalData.mealToRemove === 'last meal') {
            // Find the most recent meal
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            const todaysMeals = mealLogs
              .filter(meal => {
                const mealDate = new Date(meal.consumedAt);
                mealDate.setHours(0, 0, 0, 0);
                return mealDate.getTime() === today.getTime();
              })
              .sort((a, b) => new Date(b.consumedAt).getTime() - new Date(a.consumedAt).getTime());

            if (todaysMeals.length > 0) {
              mealToDelete = todaysMeals[0];
            }
          } else {
            // Find meal by name (search recent meals)
            const recentMeals = mealLogs
              .slice(0, 10) // Search last 10 meals
              .find(meal => 
                meal.mealName.toLowerCase().includes(removalData.mealToRemove.toLowerCase())
              );
            
            if (recentMeals) {
              mealToDelete = recentMeals;
            }
          }

          if (mealToDelete) {
            await deleteMealLog(mealToDelete.id);

            // Add meal removal metadata to the message
            aiMessage.metadata = {
              mealRemoved: true,
              removedMeal: {
                mealName: mealToDelete.mealName,
                mealId: mealToDelete.id
              }
            };

            // Update AI response to confirm removal
            aiMessage.content += `\n\n✅ Removed: ${mealToDelete.mealName} (${mealToDelete.calories}cal)`;
          } else {
            aiMessage.content += `\n\n❌ Couldn't find that meal to remove. Try "remove last meal" or be more specific.`;
          }
        } catch (error) {
          console.error('Error removing meal:', error);
          aiMessage.content += `\n\n❌ Couldn't remove that meal. Please try again.`;
        }
      }
      
      setMessages(prev => [...prev, aiMessage]);

    } catch (error) {
      console.error('Error getting AI response:', error);
      
      const fallbackMessage: ChatMessage = {
        id: generateUniqueId(),
        content: `Hi ${userProfile?.firstName || 'there'}! I'm having a bit of trouble connecting right now, but I'm here to help with your health journey. Can you try asking me again?`,
        role: "assistant",
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, fallbackMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    if (user?.uid) {
      sessionStorage.removeItem(`chat_messages_${user.uid}`);
    }
  };

  const startNewSession = () => {
    clearChat();
    
    // Check if this is the first session of the day for daily check-in
    const today = new Date().toDateString();
    const lastCheckIn = user?.uid ? sessionStorage.getItem(`last_checkin_${user.uid}`) : null;
    const isFirstSessionToday = lastCheckIn !== today;
    
    const greetingContent = `Good ${getTimeOfDay()}, ${userProfile?.firstName || 'there'}! 👋 What meal would you like to log?`;
    
    if (isFirstSessionToday && userProfile?.firstName) {
      // Mark that we've done the daily check-in
      if (user?.uid) {
        sessionStorage.setItem(`last_checkin_${user.uid}`, today);
      }
    }
    
    const greetingMessage: ChatMessage = {
      id: generateUniqueId(),
      content: greetingContent,
      role: "assistant",
      timestamp: new Date(),
    };
    
    setMessages([greetingMessage]);
  };

  // Helper function to get time-based greeting
  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 17) return 'afternoon';
    return 'evening';
  };

  const value: ChatContextType = {
    messages,
    isLoading,
    loadingType,
    sendMessage,
    clearChat,
    startNewSession,
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};
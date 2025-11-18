"use client";

import { AddMealModal } from "@/components/modals/add-meal-modal";
import { LogWeightModal } from "@/components/modals/log-weight-modal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Scale, Utensils, Trash2 } from "lucide-react";
import { useUserData } from "@/contexts/UserContext";
import { format, isToday, isYesterday } from "date-fns";
import { toast } from "sonner";
import { useState } from "react";
import { Logo } from "@/components/logo";

const formatRelativeDate = (date: Date) => {
  if (isToday(date)) return "Today";
  if (isYesterday(date)) return "Yesterday";
  return format(date, "MMM d, yyyy");
};

const getMealTypeEmoji = (mealType: string) => {
  switch (mealType) {
    case 'breakfast': return '🌅';
    case 'lunch': return '☀️';
    case 'dinner': return '🌙';
    case 'snack': return '🍎';
    default: return '🍽️';
  }
};

export default function LogsPage() {
  const { mealLogs, weightLogs, loading, deleteMealLog, deleteWeightLog } = useUserData();
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());

  const handleDeleteMeal = async (mealId: string) => {
    if (deletingIds.has(mealId)) return;
    
    setDeletingIds(prev => new Set(prev).add(mealId));
    try {
      await deleteMealLog(mealId);
      toast.success("Meal deleted successfully");
    } catch (error) {
      console.error("Error deleting meal:", error);
      toast.error("Failed to delete meal. Please try again.");
    } finally {
      setDeletingIds(prev => {
        const next = new Set(prev);
        next.delete(mealId);
        return next;
      });
    }
  };

  const handleDeleteWeight = async (weightId: string) => {
    if (deletingIds.has(weightId)) return;
    
    setDeletingIds(prev => new Set(prev).add(weightId));
    try {
      await deleteWeightLog(weightId);
      toast.success("Weight entry deleted successfully");
    } catch (error) {
      console.error("Error deleting weight:", error);
      toast.error("Failed to delete weight entry. Please try again.");
    } finally {
      setDeletingIds(prev => {
        const next = new Set(prev);
        next.delete(weightId);
        return next;
      });
    }
  };
  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 border-b border-white/5">
        <Logo size="md" showText={true} href="/dashboard" />
      </div>

      {/* Content - scrollable */}
      <div className="flex-1 overflow-auto">
        <Tabs defaultValue="meals" className="h-full flex flex-col">
          <div className="px-3 py-2 border-b border-white/5">
            <TabsList className="grid w-full grid-cols-2 bg-white/5 p-1">
              <TabsTrigger 
                value="meals" 
                className="flex items-center gap-1.5 text-xs data-[state=active]:bg-[#CAFF66] data-[state=active]:text-black text-gray-400"
              >
                <Utensils className="h-3.5 w-3.5" />
                Meals
              </TabsTrigger>
              <TabsTrigger 
                value="weight" 
                className="flex items-center gap-1.5 text-xs data-[state=active]:bg-[#CAFF66] data-[state=active]:text-black text-gray-400"
              >
                <Scale className="h-3.5 w-3.5" />
                Weight
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="meals" className="flex-1 overflow-auto p-3 space-y-3">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-sm font-semibold text-white">Meal History</h3>
              <AddMealModal />
            </div>

            <div className="space-y-2.5">
              {loading ? (
                <div className="text-center py-8">
                  <p className="text-sm text-gray-400">Loading meals...</p>
                </div>
              ) : mealLogs.length > 0 ? (
                mealLogs
                  .sort((a, b) => new Date(b.consumedAt).getTime() - new Date(a.consumedAt).getTime())
                  .map((meal) => {
                    const mealDate = new Date(meal.consumedAt);
                    
                    return (
                      <div key={meal.id} className="card p-3 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-base">{getMealTypeEmoji(meal.mealType)}</span>
                            <div className="flex flex-col">
                              <span className="text-xs text-gray-400">{formatRelativeDate(mealDate)}</span>
                              <span className="text-sm font-semibold text-white capitalize">{meal.mealType}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-[#CAFF66]">{meal.calories}</span>
                            <button
                              onClick={() => handleDeleteMeal(meal.id)}
                              disabled={deletingIds.has(meal.id)}
                              className="h-7 w-7 rounded-full flex items-center justify-center text-gray-400 hover:text-red-400 hover:bg-red-400/10 transition-colors disabled:opacity-50"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-white">
                            {meal.mealName} <span className="text-gray-500">• {meal.amount} {meal.unit}</span>
                          </p>
                          <div className="flex gap-3 text-xs text-gray-400">
                            <span>P: {meal.protein}g</span>
                            <span>C: {meal.carbohydrates}g</span>
                            <span>F: {meal.fat}g</span>
                          </div>
                        </div>
                        {meal.notes && (
                          <p className="text-xs text-gray-500 italic">{meal.notes}</p>
                        )}
                      </div>
                    );
                  })
              ) : (
                <div className="card p-8 text-center">
                  <p className="text-sm text-gray-400">
                    No meals logged yet. Start tracking your meals.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="weight" className="flex-1 overflow-auto p-3 space-y-3">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-sm font-semibold text-white">Weight Progress</h3>
              <LogWeightModal />
            </div>

            <div className="space-y-2.5">
              {loading ? (
                <div className="text-center py-8">
                  <p className="text-sm text-gray-400">Loading weight logs...</p>
                </div>
              ) : weightLogs.length > 0 ? (
                weightLogs
                  .sort((a, b) => new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime())
                  .map((weight, index) => {
                    const weightDate = new Date(weight.recordedAt);
                    const previousWeight = weightLogs[index + 1];
                    const change = previousWeight ? weight.weight - previousWeight.weight : 0;
                    
                    return (
                      <div key={weight.id} className="card p-3 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Scale className="h-4 w-4 text-[#C8A8FF]" />
                            <div className="flex flex-col">
                              <span className="text-xs text-gray-400">{formatRelativeDate(weightDate)}</span>
                              <span className="text-[10px] text-gray-500">{format(weightDate, 'h:mm a')}</span>
                            </div>
                          </div>
                          <button
                            onClick={() => handleDeleteWeight(weight.id)}
                            disabled={deletingIds.has(weight.id)}
                            className="h-7 w-7 rounded-full flex items-center justify-center text-gray-400 hover:text-red-400 hover:bg-red-400/10 transition-colors disabled:opacity-50"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex flex-col">
                            <span className="text-2xl font-bold text-white">{weight.weight} <span className="text-lg text-gray-400">kg</span></span>
                            {change !== 0 && (
                              <span className={`text-xs font-semibold ${change > 0 ? 'text-red-400' : 'text-[#CAFF66]'}`}>
                                {change > 0 ? '+' : ''}{change.toFixed(1)} kg
                              </span>
                            )}
                          </div>
                        </div>
                        {weight.notes && (
                          <p className="text-xs text-gray-500 italic">{weight.notes}</p>
                        )}
                      </div>
                    );
                  })
              ) : (
                <div className="card p-8 text-center">
                  <p className="text-sm text-gray-400">
                    No weight entries yet. Start tracking your weight.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

"use client";

import { DashboardHeader } from "@/components/dashboard-header";
import { AddMealModal } from "@/components/modals/add-meal-modal";
import { LogWeightModal } from "@/components/modals/log-weight-modal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Calendar, Scale, Utensils, Trash2 } from "lucide-react";
import { useUserData } from "@/contexts/UserContext";
import { format, isToday, isYesterday } from "date-fns";
import { toast } from "sonner";
import { useState } from "react";

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
      {/* Header - fixed */}
      <div className="px-4 py-3 border-b bg-background/95 backdrop-blur">
        <DashboardHeader 
          title="Logs" 
          description="Track meals and weight" 
        />
      </div>

      {/* Content - scrollable */}
      <div className="flex-1 overflow-auto">
        <Tabs defaultValue="meals" className="h-full flex flex-col">
          <div className="px-4 py-2 border-b">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="meals" className="flex items-center gap-1 text-xs">
                <Utensils className="h-3 w-3" />
                Meals
              </TabsTrigger>
              <TabsTrigger value="weight" className="flex items-center gap-1 text-xs">
                <Scale className="h-3 w-3" />
                Weight
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="meals" className="flex-1 overflow-auto p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">Meal History</h3>
              <AddMealModal />
            </div>

            <div className="space-y-3">
              {loading ? (
                <div className="text-center py-8">
                  <p className="text-sm text-muted-foreground">Loading meals...</p>
                </div>
              ) : mealLogs.length > 0 ? (
                mealLogs
                  .sort((a, b) => new Date(b.consumedAt).getTime() - new Date(a.consumedAt).getTime())
                  .map((meal) => {
                    const mealDate = new Date(meal.consumedAt);
                    
                    return (
                      <div key={meal.id} className="rounded-lg border p-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">
                              {getMealTypeEmoji(meal.mealType)} {formatRelativeDate(mealDate)} - {meal.mealType.charAt(0).toUpperCase() + meal.mealType.slice(1)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">{meal.calories} cal</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteMeal(meal.id)}
                              disabled={deletingIds.has(meal.id)}
                              className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">
                            {meal.mealName} - {meal.amount} {meal.unit}
                          </p>
                          <div className="flex gap-4 text-xs text-muted-foreground">
                            <span>Protein: {meal.protein}g</span>
                            <span>Carbs: {meal.carbohydrates}g</span>
                            <span>Fat: {meal.fat}g</span>
                          </div>
                        </div>
                        {meal.notes && (
                          <p className="text-xs text-muted-foreground italic">{meal.notes}</p>
                        )}
                      </div>
                    );
                  })
              ) : (
                <div className="rounded-lg border border-dashed p-8 text-center">
                  <p className="text-sm text-muted-foreground">
                    No meals logged yet. Start tracking your meals to see them here.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="weight" className="flex-1 overflow-auto p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">Weight Progress</h3>
              <LogWeightModal />
            </div>

            <div className="space-y-3">
              {loading ? (
                <div className="text-center py-8">
                  <p className="text-sm text-muted-foreground">Loading weight logs...</p>
                </div>
              ) : weightLogs.length > 0 ? (
                weightLogs
                  .sort((a, b) => new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime())
                  .map((weight, index) => {
                    const weightDate = new Date(weight.recordedAt);
                    const previousWeight = weightLogs[index + 1];
                    const change = previousWeight ? weight.weight - previousWeight.weight : 0;
                    
                    return (
                      <div key={weight.id} className="rounded-lg border p-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{formatRelativeDate(weightDate)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">
                              {format(weightDate, 'h:mm a')}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteWeight(weight.id)}
                              disabled={deletingIds.has(weight.id)}
                              className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex flex-col">
                            <span className="text-lg font-semibold">{weight.weight} kg</span>
                            {change !== 0 && (
                              <span className={`text-sm ${change > 0 ? 'text-red-600' : 'text-green-600'}`}>
                                {change > 0 ? '+' : ''}{change.toFixed(1)} kg from previous
                              </span>
                            )}
                          </div>
                        </div>
                        {weight.notes && (
                          <p className="text-xs text-muted-foreground italic">{weight.notes}</p>
                        )}
                      </div>
                    );
                  })
              ) : (
                <div className="rounded-lg border border-dashed p-8 text-center">
                  <p className="text-sm text-muted-foreground">
                    No weight entries yet. Start tracking your weight to see progress here.
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

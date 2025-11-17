"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Target, Loader2, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { toast } from "sonner";

interface GoalInput {
  goalType: string;
  targetWeight: string;
  targetDate: string;
}

interface AIGoalsResponse {
  weightDifference: number;
  dailyCalories: number;
  dailyProtein: number;
  dailyCarbs: number;
  dailyFat: number;
  dailyWater: number;
  recommendedWeeklyWeightChange: number;
  estimatedTimeframe: string;
  currentBMI: number;
  targetBMI: number;
}

export function UpdateGoalsModal() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [calculating, setCalculating] = useState(false);
  const { userProfile, refreshUserProfile } = useAuth();
  
  const [goalInput, setGoalInput] = useState<GoalInput>({
    goalType: "",
    targetWeight: "",
    targetDate: "",
  });

  const [aiResponse, setAiResponse] = useState<AIGoalsResponse | null>(null);

  // Populate form with existing goals when modal opens
  useEffect(() => {
    if (open && userProfile) {
      // Format the target date for the date input
      let formattedDate = "";
      if (userProfile.goalTargetDate) {
        try {
          const targetDate = userProfile.goalTargetDate instanceof Date 
            ? userProfile.goalTargetDate 
            : new Date(userProfile.goalTargetDate);
          
          if (!isNaN(targetDate.getTime())) {
            formattedDate = targetDate.toISOString().split('T')[0];
          }
        } catch (error) {
          console.log('Error formatting target date:', error);
        }
      }

      setGoalInput({
        goalType: userProfile.goalType || "",
        targetWeight: userProfile.targetWeight ? userProfile.targetWeight.toString() : "",
        targetDate: formattedDate,
      });
    }
  }, [open, userProfile]);

  // Reset form when modal closes
  useEffect(() => {
    if (!open) {
      setAiResponse(null);
      // Only reset if no existing goals, otherwise keep populated values
      if (!userProfile?.goalType) {
        setGoalInput({ goalType: "", targetWeight: "", targetDate: "" });
      }
    }
  }, [open, userProfile?.goalType]);

  // Calculate goals using AI
  const calculateGoalsWithAI = async () => {
    if (!userProfile || !goalInput.goalType || !goalInput.targetWeight || !goalInput.targetDate) {
      return;
    }

    setCalculating(true);
    try {
      const currentWeight = userProfile.currentWeight || 70;
      const age = userProfile.age || 25;
      const height = userProfile.height || 170;
      const gender = userProfile.gender || 'other';
      const activityLevel = userProfile.activityLevel || 'moderately_active';
      
      const weightDifference = parseFloat(goalInput.targetWeight) - currentWeight;
      const targetDateObj = new Date(goalInput.targetDate);
      const currentDate = new Date();
      const daysToGoal = Math.max(1, Math.ceil((targetDateObj.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24)));
      const weeksToGoal = daysToGoal / 7;

      // Calculate current BMI
      const currentBMI = currentWeight / Math.pow(height / 100, 2);
      const targetBMI = parseFloat(goalInput.targetWeight) / Math.pow(height / 100, 2);
      
      // AI prompt for calculating nutritional needs
      const aiPrompt = `
        As a nutrition expert and health coach, calculate precise daily nutritional targets for this user's health goals:
        
        User Profile:
        - Current Weight: ${currentWeight} kg
        - Target Weight: ${goalInput.targetWeight} kg
        - Weight Difference: ${weightDifference.toFixed(1)} kg ${weightDifference > 0 ? 'to gain' : 'to lose'}
        - Age: ${age} years
        - Height: ${height} cm
        - Current BMI: ${currentBMI.toFixed(1)}
        - Target BMI: ${targetBMI.toFixed(1)}
        - Gender: ${gender}
        - Activity Level: ${activityLevel.replace('_', ' ')}
        - Goal Type: ${goalInput.goalType.replace('_', ' ')}
        - Time Frame: ${weeksToGoal.toFixed(1)} weeks (${daysToGoal} days)
        - Target Date: ${goalInput.targetDate}

        Calculate and provide ONLY a JSON response with these exact fields (no additional text):
        {
          "weightDifference": ${Math.abs(weightDifference)},
          "dailyCalories": [calculated daily calories based on TDEE and goal],
          "dailyProtein": [calculated daily protein in grams based on body weight and goals],
          "dailyCarbs": [calculated daily carbs in grams for optimal performance], 
          "dailyFat": [calculated daily fat in grams for hormone production],
          "dailyWater": [calculated daily water in ml based on weight and activity],
          "recommendedWeeklyWeightChange": [safe weekly weight change in kg],
          "estimatedTimeframe": "[realistic timeframe description]",
          "currentBMI": ${currentBMI.toFixed(2)},
          "targetBMI": ${targetBMI.toFixed(2)}
        }

        Consider:
        - Safe weight loss: 0.5-1kg per week
        - Safe weight gain: 0.25-0.5kg per week  
        - BMR calculation based on age, gender, height, weight
        - Activity level multiplier
        - Protein: 1.6-2.2g per kg body weight
        - Fat: 20-35% of total calories
        - Carbs: remaining calories
        - Water: 35ml per kg body weight + activity needs
      `;

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: aiPrompt,
          context: "nutrition_calculation"
        }),
      });

      const data = await response.json();
      
      try {
        // Parse AI response JSON
        const aiGoals = JSON.parse(data.response);
        setAiResponse(aiGoals);
      } catch (error) {
        console.error('Error parsing AI response:', error);
        // Fallback calculation
        const bmr = calculateBMR(currentWeight, height, age, gender);
        const activityMultiplier = getActivityMultiplier(activityLevel);
        const tdee = bmr * activityMultiplier;
        
        const weeklyWeightChange = Math.min(0.75, Math.abs(weightDifference) / weeksToGoal);
        const calorieAdjustment = (weightDifference < 0 ? -500 : 300) * (weeklyWeightChange / 0.5);
        const dailyCalories = Math.round(tdee + calorieAdjustment);
        
        const fallbackCurrentBMI = currentWeight / Math.pow(height / 100, 2);
        const fallbackTargetBMI = parseFloat(goalInput.targetWeight) / Math.pow(height / 100, 2);
        
        setAiResponse({
          weightDifference: Math.abs(weightDifference),
          dailyCalories,
          dailyProtein: Math.round(currentWeight * 1.8),
          dailyCarbs: Math.round((dailyCalories * 0.45) / 4),
          dailyFat: Math.round((dailyCalories * 0.25) / 9),
          dailyWater: Math.round(currentWeight * 35 + 500),
          recommendedWeeklyWeightChange: weeklyWeightChange,
          estimatedTimeframe: `${Math.ceil(Math.abs(weightDifference) / weeklyWeightChange)} weeks`,
          currentBMI: Number(fallbackCurrentBMI.toFixed(2)),
          targetBMI: Number(fallbackTargetBMI.toFixed(2))
        });
      }
    } catch (error) {
      console.error('Error calculating goals:', error);
    } finally {
      setCalculating(false);
    }
  };

  // Helper functions
  const calculateBMR = (weight: number, height: number, age: number, gender: string) => {
    if (gender === 'male') {
      return 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
    } else {
      return 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
    }
  };

  const getActivityMultiplier = (activityLevel: string) => {
    switch (activityLevel) {
      case 'sedentary': return 1.2;
      case 'lightly_active': return 1.375;
      case 'moderately_active': return 1.55;
      case 'very_active': return 1.725;
      case 'extremely_active': return 1.9;
      default: return 1.55;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiResponse || !userProfile?.id) return;

    setLoading(true);
    try {
      const userDoc = doc(db, 'users', userProfile.id);
      
      await updateDoc(userDoc, {
        goalType: goalInput.goalType,
        targetWeight: parseFloat(goalInput.targetWeight),
        targetCalories: aiResponse.dailyCalories,
        targetProtein: aiResponse.dailyProtein,
        targetCarbs: aiResponse.dailyCarbs,
        targetFat: aiResponse.dailyFat,
        targetWater: aiResponse.dailyWater,
        bmi: aiResponse.currentBMI, // Update current BMI
        goalTargetDate: new Date(goalInput.targetDate),
        goalCreatedAt: new Date(),
        updatedAt: new Date(),
      });

      await refreshUserProfile();
      toast.success("Goals updated successfully! Your AI-calculated nutrition plan is now active.");
      setOpen(false);
      setAiResponse(null);
      // Don't clear the form - it will repopulate with the updated values when reopened
    } catch (error) {
      console.error('Error updating goals:', error);
      toast.error("Failed to update goals. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const updateGoalInput = (field: keyof GoalInput, value: string) => {
    setGoalInput(prev => ({ ...prev, [field]: value }));
  };

  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const canCalculate = goalInput.goalType && goalInput.targetWeight && goalInput.targetDate;
  const hasExistingGoals = userProfile?.goalType && userProfile?.targetWeight;
  const buttonText = hasExistingGoals ? "Update Goals" : "Create Goals";
  const dialogTitle = hasExistingGoals ? "Update Health Goals" : "Create Health Goals";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Target className="h-4 w-4" />
          {buttonText}
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[90vw] max-w-[420px] max-h-[85vh] overflow-y-auto p-4">
        <DialogHeader className="pb-2">
          <DialogTitle className="text-lg flex items-center gap-2">
            <Target className="h-5 w-5" />
            {dialogTitle}
          </DialogTitle>
          <DialogDescription className="text-sm">
            {hasExistingGoals 
              ? "Your current goals are pre-filled below. Update them and let AI recalculate personalized nutrition targets."
              : "Set your first goal and let AI calculate personalized nutrition targets"
            }
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Step 1: Goal Input */}
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="goalType" className="text-sm font-medium">Goal Type *</Label>
              <Select
                value={goalInput.goalType}
                onValueChange={(value) => updateGoalInput("goalType", value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="What's your primary goal?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weight_loss">🔥 Weight Loss</SelectItem>
                  <SelectItem value="weight_gain">💪 Weight Gain</SelectItem>
                  <SelectItem value="maintain_weight">⚖️ Maintain Weight</SelectItem>
                  <SelectItem value="muscle_gain">🏋️ Muscle Gain</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="targetWeight" className="text-sm font-medium">Target Weight (kg) *</Label>
                <Input
                  id="targetWeight"
                  type="number"
                  step="0.1"
                  placeholder="70.0"
                  value={goalInput.targetWeight}
                  onChange={(e) => updateGoalInput("targetWeight", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="targetDate" className="text-sm font-medium">Target Date *</Label>
                <Input
                  id="targetDate"
                  type="date"
                  min={getTomorrowDate()}
                  value={goalInput.targetDate}
                  onChange={(e) => updateGoalInput("targetDate", e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Calculate Button */}
            <Button
              type="button"
              onClick={calculateGoalsWithAI}
              disabled={!canCalculate || calculating}
              className="w-full"
              variant={aiResponse ? "secondary" : "default"}
            >
              {calculating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  AI is calculating...
                </>
              ) : aiResponse ? (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Recalculate with AI
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Calculate with AI
                </>
              )}
            </Button>
          </div>

          {/* Step 2: AI Results */}
          {aiResponse && (
            <div className="space-y-3 p-3 rounded-lg bg-linear-to-r from-emerald-50/80 to-blue-50/80 dark:from-emerald-950/30 dark:to-blue-950/30 border border-emerald-200/50 dark:border-emerald-800/50">
              <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/50">
                  <Sparkles className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                  AI Nutrition Plan
                </h3>
              </div>
              
              {/* Main Targets - Highlighted */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-3">
                <div className="bg-white/70 dark:bg-gray-900/50 rounded-lg p-2 border">
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                      {aiResponse.dailyCalories}
                    </div>
                    <div className="text-xs text-muted-foreground">Daily Calories</div>
                  </div>
                </div>
                <div className="bg-white/70 dark:bg-gray-900/50 rounded-lg p-2 border">
                  <div className="text-center">
                    <div className="text-lg font-bold text-orange-600 dark:text-orange-400">
                      {aiResponse.weightDifference.toFixed(1)}kg
                    </div>
                    <div className="text-xs text-muted-foreground">Weight Goal</div>
                  </div>
                </div>
                <div className="bg-white/70 dark:bg-gray-900/50 rounded-lg p-2 border">
                  <div className="text-center">
                    <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
                      {aiResponse.recommendedWeeklyWeightChange.toFixed(1)}kg
                    </div>
                    <div className="text-xs text-muted-foreground">Per Week</div>
                  </div>
                </div>
              </div>

              {/* Macros - Compact Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="bg-white/50 dark:bg-gray-900/30 rounded p-2 text-center">
                  <div className="font-semibold text-green-600 dark:text-green-400">{aiResponse.dailyProtein}g</div>
                  <div className="text-muted-foreground">Protein</div>
                </div>
                <div className="bg-white/50 dark:bg-gray-900/30 rounded p-2 text-center">
                  <div className="font-semibold text-yellow-600 dark:text-yellow-400">{aiResponse.dailyCarbs}g</div>
                  <div className="text-muted-foreground">Carbs</div>
                </div>
                <div className="bg-white/50 dark:bg-gray-900/30 rounded p-2 text-center">
                  <div className="font-semibold text-red-600 dark:text-red-400">{aiResponse.dailyFat}g</div>
                  <div className="text-muted-foreground">Fat</div>
                </div>
                <div className="bg-white/50 dark:bg-gray-900/30 rounded p-2 text-center">
                  <div className="font-semibold text-cyan-600 dark:text-cyan-400">{(aiResponse.dailyWater / 1000).toFixed(1)}L</div>
                  <div className="text-muted-foreground">Water</div>
                </div>
              </div>

              {/* BMI & Timeline - Bottom Row */}
              <div className="flex flex-wrap gap-2 text-xs">
                <div className="flex-1 min-w-0 bg-white/40 dark:bg-gray-900/20 rounded px-2 py-1">
                  <span className="text-muted-foreground">BMI:</span>{" "}
                  <span className="font-medium">{aiResponse.currentBMI} → {aiResponse.targetBMI}</span>
                </div>
                <div className="flex-1 min-w-0 bg-white/40 dark:bg-gray-900/20 rounded px-2 py-1">
                  <span className="text-muted-foreground">Timeline:</span>{" "}
                  <span className="font-medium">{aiResponse.estimatedTimeframe}</span>
                </div>
              </div>
            </div>
          )}

          {/* Current Profile Info */}
          {userProfile && (
            <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg">
              <strong>Current Profile:</strong> {userProfile.currentWeight || '--'}kg, {userProfile.height || '--'}cm, 
              {userProfile.age || '--'} years, {userProfile.gender || 'not set'}, {userProfile.activityLevel?.replace('_', ' ') || 'not set'}
            </div>
          )}

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setOpen(false);
                setAiResponse(null);
                setGoalInput({ goalType: "", targetWeight: "", targetDate: "" });
              }}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!aiResponse || loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {hasExistingGoals ? "Updating Goals..." : "Creating Goals..."}
                </>
              ) : (
                hasExistingGoals ? "Update Goals" : "Create Goals"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
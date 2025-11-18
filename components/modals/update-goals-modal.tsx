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
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { Loader2, Sparkles, Target } from "lucide-react";
import { useEffect, useState } from "react";
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
          const targetDate =
            userProfile.goalTargetDate instanceof Date
              ? userProfile.goalTargetDate
              : new Date(userProfile.goalTargetDate);

          if (!isNaN(targetDate.getTime())) {
            formattedDate = targetDate.toISOString().split("T")[0];
          }
        } catch (error) {
          console.log("Error formatting target date:", error);
        }
      }

      setGoalInput({
        goalType: userProfile.goalType || "",
        targetWeight: userProfile.targetWeight
          ? userProfile.targetWeight.toString()
          : "",
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
    if (
      !userProfile ||
      !goalInput.goalType ||
      !goalInput.targetWeight ||
      !goalInput.targetDate
    ) {
      return;
    }

    setCalculating(true);
    try {
      const currentWeight = userProfile.currentWeight || 70;
      const age = userProfile.age || 25;
      const height = userProfile.height || 170;
      const gender = userProfile.gender || "other";
      const activityLevel = userProfile.activityLevel || "moderately_active";

      const targetWeight = parseFloat(goalInput.targetWeight);
      const weightDifference = targetWeight - currentWeight;
      
      // Validate goal type matches weight direction
      if (goalInput.goalType === "lose_weight" && weightDifference >= 0) {
        toast.error("Target weight must be less than current weight for weight loss goal");
        setCalculating(false);
        return;
      }
      if (goalInput.goalType === "gain_weight" && weightDifference <= 0) {
        toast.error("Target weight must be greater than current weight for weight gain goal");
        setCalculating(false);
        return;
      }
      if (goalInput.goalType === "maintain_weight" && Math.abs(weightDifference) > 2) {
        toast.error("Target weight should be within 2kg of current weight for maintenance");
        setCalculating(false);
        return;
      }
      // Parse date correctly to avoid timezone issues
      const targetDateObj = new Date(goalInput.targetDate + 'T00:00:00');
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0); // Reset time to start of day
      const daysToGoal = Math.max(
        1,
        Math.ceil(
          (targetDateObj.getTime() - currentDate.getTime()) /
            (1000 * 60 * 60 * 24)
        )
      );
      const weeksToGoal = daysToGoal / 7;
      const totalWeightChange = Math.abs(weightDifference);
      
      // Validate timeframe is realistic for goal
      if (goalInput.goalType !== "maintain_weight" && totalWeightChange >= 0.5) {
        const minWeeks = weightDifference < 0 
          ? Math.ceil(totalWeightChange / 1.0) // Min weeks for weight loss (1kg/week max)
          : Math.ceil(totalWeightChange / 0.5); // Min weeks for weight gain (0.5kg/week max)
        
        if (weeksToGoal < minWeeks) {
          toast.error(`This goal requires at least ${minWeeks} weeks for safe and healthy progress`);
          setCalculating(false);
          return;
        }
      }

      // Calculate current BMI
      const currentBMI = currentWeight / Math.pow(height / 100, 2);
      const targetBMI =
        parseFloat(goalInput.targetWeight) / Math.pow(height / 100, 2);

      // Calculate BMR using Mifflin-St Jeor Equation
      let bmr;
      if (gender === "male") {
        bmr = 10 * currentWeight + 6.25 * height - 5 * age + 5;
      } else if (gender === "female") {
        bmr = 10 * currentWeight + 6.25 * height - 5 * age - 161;
      } else {
        bmr = 10 * currentWeight + 6.25 * height - 5 * age - 78; // average
      }

      // Activity multipliers
      const activityMultipliers: { [key: string]: number } = {
        sedentary: 1.2,
        lightly_active: 1.375,
        moderately_active: 1.55,
        very_active: 1.725,
        extremely_active: 1.9,
      };
      const activityMultiplier = activityMultipliers[activityLevel] || 1.55;
      const tdee = bmr * activityMultiplier;

      // Calculate required daily deficit/surplus
      // 1kg of fat = ~7700 calories
      
      let safeWeeklyChange: number;
      let targetCalories: number;
      
      if (goalInput.goalType === "maintain_weight" || totalWeightChange < 0.5) {
        // Maintenance: no weight change needed
        safeWeeklyChange = 0;
        targetCalories = Math.round(tdee);
      } else if (weightDifference < 0) {
        // Weight loss: max 1kg/week, safe is 0.5-1kg/week
        safeWeeklyChange = Math.min(1.0, Math.max(0.5, totalWeightChange / weeksToGoal));
        const weeklyCalorieChange = safeWeeklyChange * 7700;
        const dailyCalorieAdjustment = weeklyCalorieChange / 7;
        targetCalories = Math.round(tdee - dailyCalorieAdjustment);
        // Ensure minimum calories for safety
        const minCalories = gender === "female" ? 1200 : 1500;
        targetCalories = Math.max(targetCalories, minCalories);
      } else {
        // Weight gain: max 0.5kg/week, safe is 0.25-0.5kg/week
        safeWeeklyChange = Math.min(0.5, Math.max(0.25, totalWeightChange / weeksToGoal));
        const weeklyCalorieChange = safeWeeklyChange * 7700;
        const dailyCalorieAdjustment = weeklyCalorieChange / 7;
        targetCalories = Math.round(tdee + dailyCalorieAdjustment);
      }

      // Calculate macros
      const protein = Math.round(currentWeight * 1.8); // 1.8g per kg
      const fat = Math.round((targetCalories * 0.25) / 9); // 25% of calories, 9 cal/g
      const proteinCalories = protein * 4; // 4 cal/g
      const fatCalories = fat * 9;
      const carbCalories = targetCalories - proteinCalories - fatCalories;
      const carbs = Math.round(carbCalories / 4); // 4 cal/g
      
      // Water calculation based on weight and activity level
      // Base: 35ml per kg + activity adjustment
      const activityWaterBonus: { [key: string]: number } = {
        sedentary: 0,
        lightly_active: 250,
        moderately_active: 500,
        very_active: 750,
        extremely_active: 1000,
      };
      const baseWater = currentWeight * 35;
      const activityBonus = activityWaterBonus[activityLevel] || 500;
      const water = Math.round(baseWater + activityBonus);

      // Calculate estimated timeframe
      let estimatedTimeframe: string;
      if (goalInput.goalType === "maintain_weight" || totalWeightChange < 0.5) {
        estimatedTimeframe = "Maintain current weight";
      } else if (safeWeeklyChange > 0) {
        const estimatedWeeks = Math.ceil(totalWeightChange / safeWeeklyChange);
        estimatedTimeframe = `${estimatedWeeks} weeks to reach ${goalInput.targetWeight}kg`;
      } else {
        estimatedTimeframe = `${weeksToGoal.toFixed(0)} weeks to reach ${goalInput.targetWeight}kg`;
      }

      // Log calculation summary for health safety verification
      console.log('✅ Health Goals Calculated:', {
        goalType: goalInput.goalType,
        currentWeight: `${currentWeight}kg`,
        targetWeight: `${targetWeight}kg`,
        weightChange: `${weightDifference > 0 ? '+' : ''}${weightDifference.toFixed(1)}kg`,
        timeframe: `${daysToGoal} days (${weeksToGoal.toFixed(1)} weeks)`,
        safeWeeklyChange: `${safeWeeklyChange.toFixed(2)}kg/week`,
        bmr: `${Math.round(bmr)} cal`,
        tdee: `${Math.round(tdee)} cal`,
        targetCalories: `${targetCalories} cal`,
        macros: `P:${protein}g | C:${carbs}g | F:${fat}g`,
        water: `${(water/1000).toFixed(1)}L`,
        bmi: `${currentBMI.toFixed(1)} → ${targetBMI.toFixed(1)}`
      });

      // Use our calculated values directly (more accurate than AI parsing)
      setAiResponse({
        weightDifference: Math.abs(weightDifference),
        dailyCalories: targetCalories,
        dailyProtein: protein,
        dailyCarbs: carbs,
        dailyFat: fat,
        dailyWater: water,
        recommendedWeeklyWeightChange: parseFloat(safeWeeklyChange.toFixed(2)),
        estimatedTimeframe: estimatedTimeframe,
        currentBMI: parseFloat(currentBMI.toFixed(2)),
        targetBMI: parseFloat(targetBMI.toFixed(2)),
      });
    } catch (error) {
      console.error("Error calculating goals:", error);
    } finally {
      setCalculating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiResponse || !userProfile?.id) return;

    setLoading(true);
    try {
      const userDoc = doc(db, "users", userProfile.id);

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
      toast.success(
        "Goals updated successfully! Your AI-calculated nutrition plan is now active."
      );
      setOpen(false);
      setAiResponse(null);
      // Don't clear the form - it will repopulate with the updated values when reopened
    } catch (error) {
      console.error("Error updating goals:", error);
      toast.error("Failed to update goals. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const updateGoalInput = (field: keyof GoalInput, value: string) => {
    setGoalInput((prev) => ({ ...prev, [field]: value }));
  };

  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  };

  const canCalculate =
    goalInput.goalType && goalInput.targetWeight && goalInput.targetDate;
  const hasExistingGoals = userProfile?.goalType && userProfile?.targetWeight;
  const buttonText = hasExistingGoals ? "Update Goals" : "Create Goals";
  const dialogTitle = hasExistingGoals
    ? "Update Health Goals"
    : "Create Health Goals";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-2 bg-[#CAFF66] text-black border-[#CAFF66] hover:bg-[#CAFF66]/90 hover:text-black h-8 px-4 font-medium"
        >
          <Target className="h-3.5 w-3.5" />
          <span className="text-xs">{buttonText}</span>
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
              : "Set your first goal and let AI calculate personalized nutrition targets"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Step 1: Goal Input */}
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="goalType" className="text-sm font-medium">
                Goal Type *
              </Label>
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
                  <SelectItem value="maintain_weight">
                    ⚖️ Maintain Weight
                  </SelectItem>
                  <SelectItem value="muscle_gain">🏋️ Muscle Gain</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="targetWeight" className="text-sm font-medium">
                  Target Weight (kg) *
                </Label>
                <Input
                  id="targetWeight"
                  type="number"
                  step="0.1"
                  placeholder="70.0"
                  value={goalInput.targetWeight}
                  onChange={(e) =>
                    updateGoalInput("targetWeight", e.target.value)
                  }
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="targetDate" className="text-sm font-medium">
                  Target Date *
                </Label>
                <Input
                  id="targetDate"
                  type="date"
                  min={getTomorrowDate()}
                  value={goalInput.targetDate}
                  onChange={(e) =>
                    updateGoalInput("targetDate", e.target.value)
                  }
                  className="[&::-webkit-calendar-picker-indicator]:opacity-100 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:invert"
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
            <div className="space-y-3 p-3 rounded-lg bg-muted/30 border">
              <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10">
                  <Sparkles className="h-3 w-3 text-primary" />
                </div>
                <h3 className="text-sm font-semibold text-foreground">
                  AI Nutrition Plan
                </h3>
              </div>

              {/* Main Targets - Highlighted */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-3">
                <div className="bg-card rounded-lg p-2 border">
                  <div className="text-center">
                    <div className="text-lg font-bold text-primary">
                      {aiResponse.dailyCalories}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Daily Calories
                    </div>
                  </div>
                </div>
                <div className="bg-card rounded-lg p-2 border">
                  <div className="text-center">
                    <div className="text-lg font-bold text-secondary">
                      {aiResponse.weightDifference.toFixed(1)}kg
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Weight Goal
                    </div>
                  </div>
                </div>
                <div className="bg-card rounded-lg p-2 border">
                  <div className="text-center">
                    <div className="text-lg font-bold text-primary">
                      {aiResponse.recommendedWeeklyWeightChange.toFixed(1)}kg
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Per Week
                    </div>
                  </div>
                </div>
              </div>

              {/* Macros - Compact Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="bg-muted/30 rounded p-2 text-center">
                  <div className="font-semibold text-primary">
                    {aiResponse.dailyProtein}g
                  </div>
                  <div className="text-muted-foreground">Protein</div>
                </div>
                <div className="bg-muted/30 rounded p-2 text-center">
                  <div className="font-semibold text-secondary">
                    {aiResponse.dailyCarbs}g
                  </div>
                  <div className="text-muted-foreground">Carbs</div>
                </div>
                <div className="bg-muted/30 rounded p-2 text-center">
                  <div className="font-semibold text-primary">
                    {aiResponse.dailyFat}g
                  </div>
                  <div className="text-muted-foreground">Fat</div>
                </div>
                <div className="bg-background/50 rounded p-2 text-center">
                  <div className="font-semibold text-cyan-600 dark:text-cyan-400">
                    {(aiResponse.dailyWater / 1000).toFixed(1)}L
                  </div>
                  <div className="text-muted-foreground">Water</div>
                </div>
              </div>

              {/* BMI & Timeline - Bottom Row */}
              <div className="flex flex-wrap gap-2 text-xs">
                <div className="flex-1 min-w-0 bg-background/40 rounded px-2 py-1">
                  <span className="text-muted-foreground">BMI:</span>{" "}
                  <span className="font-medium">
                    {aiResponse.currentBMI} → {aiResponse.targetBMI}
                  </span>
                </div>
                <div className="flex-1 min-w-0 bg-background/40 rounded px-2 py-1">
                  <span className="text-muted-foreground">Timeline:</span>{" "}
                  <span className="font-medium">
                    {aiResponse.estimatedTimeframe}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Current Profile Info */}
          {userProfile && (
            <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg">
              <strong>Current Profile:</strong>{" "}
              {userProfile.currentWeight || "--"}kg,{" "}
              {userProfile.height || "--"}cm,
              {userProfile.age || "--"} years, {userProfile.gender || "not set"}
              , {userProfile.activityLevel?.replace("_", " ") || "not set"}
            </div>
          )}

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setOpen(false);
                setAiResponse(null);
                setGoalInput({
                  goalType: "",
                  targetWeight: "",
                  targetDate: "",
                });
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
              ) : hasExistingGoals ? (
                "Update Goals"
              ) : (
                "Create Goals"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

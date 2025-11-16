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
import { Target } from "lucide-react";
import { useState } from "react";

interface GoalsData {
  goalType: string;
  targetWeight: string;
  targetCalories: string;
  targetProtein: string;
  targetCarbs: string;
  targetFat: string;
  targetWater: string;
}

export function UpdateGoalsModal() {
  const [open, setOpen] = useState(false);
  const [goalsData, setGoalsData] = useState<GoalsData>({
    goalType: "weight_loss",
    targetWeight: "70",
    targetCalories: "1950",
    targetProtein: "120",
    targetCarbs: "150",
    targetFat: "65",
    targetWater: "2500",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Goals data:", goalsData);
    // TODO: Save to Firestore
    setOpen(false);
  };

  const updateGoalsData = (field: keyof GoalsData, value: string) => {
    setGoalsData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Target className="h-4 w-4" />
          Update Goals
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[90vw] max-w-[360px] max-h-[85vh] overflow-y-auto p-4">
        <DialogHeader className="pb-2">
          <DialogTitle className="text-lg">Update Goals</DialogTitle>
          <DialogDescription className="text-sm">
            Set your health and fitness goals
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="goalType" className="text-sm">Goal Type *</Label>
              <Select
                value={goalsData.goalType}
                onValueChange={(value) => updateGoalsData("goalType", value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your goal" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weight_loss">Weight Loss</SelectItem>
                  <SelectItem value="weight_gain">Weight Gain</SelectItem>
                  <SelectItem value="maintain_weight">Maintain Weight</SelectItem>
                  <SelectItem value="muscle_gain">Muscle Gain</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="targetWeight">Target Weight (kg)</Label>
                <Input
                  id="targetWeight"
                  type="number"
                  step="0.1"
                  placeholder="70.0"
                  value={goalsData.targetWeight}
                  onChange={(e) => updateGoalsData("targetWeight", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="targetCalories">Daily Calories</Label>
                <Input
                  id="targetCalories"
                  type="number"
                  placeholder="1950"
                  value={goalsData.targetCalories}
                  onChange={(e) => updateGoalsData("targetCalories", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Daily Macronutrients (grams)</Label>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="targetProtein" className="text-sm text-muted-foreground">Protein</Label>
                  <Input
                    id="targetProtein"
                    type="number"
                    placeholder="120"
                    value={goalsData.targetProtein}
                    onChange={(e) => updateGoalsData("targetProtein", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="targetCarbs" className="text-sm text-muted-foreground">Carbs</Label>
                  <Input
                    id="targetCarbs"
                    type="number"
                    placeholder="150"
                    value={goalsData.targetCarbs}
                    onChange={(e) => updateGoalsData("targetCarbs", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="targetFat" className="text-sm text-muted-foreground">Fat</Label>
                  <Input
                    id="targetFat"
                    type="number"
                    placeholder="65"
                    value={goalsData.targetFat}
                    onChange={(e) => updateGoalsData("targetFat", e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="targetWater">Daily Water Goal (ml)</Label>
              <Input
                id="targetWater"
                type="number"
                placeholder="2500"
                value={goalsData.targetWater}
                onChange={(e) => updateGoalsData("targetWater", e.target.value)}
              />
            </div>

            <div className="rounded-lg bg-blue-50 p-4 text-sm text-blue-800 dark:bg-blue-950 dark:text-blue-200">
              <p className="font-medium mb-1">💡 Tips for setting goals:</p>
              <ul className="space-y-1 text-xs">
                <li>• Aim for 0.5-1kg weight loss per week for sustainable results</li>
                <li>• Protein: 1.6-2.2g per kg of body weight for muscle maintenance</li>
                <li>• Stay hydrated with at least 8 glasses (2L) of water daily</li>
              </ul>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Update Goals</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
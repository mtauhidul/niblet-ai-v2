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
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import { useState } from "react";

interface MealData {
  mealName: string;
  mealType: string;
  amount: string;
  unit: string;
  calories: string;
  protein: string;
  carbs: string;
  fat: string;
  notes: string;
}

export function AddMealModal() {
  const [open, setOpen] = useState(false);
  const [mealData, setMealData] = useState<MealData>({
    mealName: "",
    mealType: "",
    amount: "",
    unit: "g",
    calories: "",
    protein: "",
    carbs: "",
    fat: "",
    notes: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Meal data:", mealData);
    // TODO: Save to Firestore
    setOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setMealData({
      mealName: "",
      mealType: "",
      amount: "",
      unit: "g",
      calories: "",
      protein: "",
      carbs: "",
      fat: "",
      notes: "",
    });
  };

  const updateMealData = (field: keyof MealData, value: string) => {
    setMealData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add New Meal
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[90vw] max-w-[360px] max-h-[85vh] overflow-y-auto p-4">
        <DialogHeader className="pb-2">
          <DialogTitle className="text-lg">Add New Meal</DialogTitle>
          <DialogDescription className="text-sm">
            Log your meal with nutritional information
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="mealName" className="text-sm">Meal Name *</Label>
              <Input
                id="mealName"
                placeholder="e.g., Grilled Chicken Salad"
                value={mealData.mealName}
                onChange={(e) => updateMealData("mealName", e.target.value)}
                required
                className="h-9 text-sm"
              />
            </div>

            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="mealType" className="text-sm">Meal Type *</Label>
                <Select
                  value={mealData.mealType}
                  onValueChange={(value) => updateMealData("mealType", value)}
                  required
                >
                  <SelectTrigger className="h-9 text-sm">
                    <SelectValue placeholder="Select meal type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="breakfast" className="text-sm">Breakfast</SelectItem>
                    <SelectItem value="lunch" className="text-sm">Lunch</SelectItem>
                    <SelectItem value="dinner" className="text-sm">Dinner</SelectItem>
                    <SelectItem value="snack" className="text-sm">Snack</SelectItem>
                    <SelectItem value="other" className="text-sm">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="amount" className="text-sm">Amount *</Label>
                <div className="flex gap-2">
                  <Input
                    id="amount"
                    type="number"
                    placeholder="100"
                    value={mealData.amount}
                    onChange={(e) => updateMealData("amount", e.target.value)}
                    required
                    className="flex-1 h-9 text-sm"
                  />
                  <Select
                    value={mealData.unit}
                    onValueChange={(value) => updateMealData("unit", value)}
                  >
                    <SelectTrigger className="w-16 h-9 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="g">g</SelectItem>
                      <SelectItem value="ml">ml</SelectItem>
                      <SelectItem value="oz">oz</SelectItem>
                      <SelectItem value="cup">cup</SelectItem>
                      <SelectItem value="piece">piece</SelectItem>
                      <SelectItem value="serving">serving</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="calories">Calories *</Label>
                <Input
                  id="calories"
                  type="number"
                  placeholder="250"
                  value={mealData.calories}
                  onChange={(e) => updateMealData("calories", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="protein">Protein (g)</Label>
                <Input
                  id="protein"
                  type="number"
                  placeholder="25"
                  value={mealData.protein}
                  onChange={(e) => updateMealData("protein", e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="carbs">Carbs (g)</Label>
                <Input
                  id="carbs"
                  type="number"
                  placeholder="15"
                  value={mealData.carbs}
                  onChange={(e) => updateMealData("carbs", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fat">Fat (g)</Label>
                <Input
                  id="fat"
                  type="number"
                  placeholder="8"
                  value={mealData.fat}
                  onChange={(e) => updateMealData("fat", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Any additional notes about the meal..."
                value={mealData.notes}
                onChange={(e) => updateMealData("notes", e.target.value)}
                rows={3}
              />
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
            <Button type="submit">Log Meal</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
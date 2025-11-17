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
import { Scale } from "lucide-react";
import { useState } from "react";
import { useUserData } from "@/contexts/UserContext";
import { toast } from "sonner";

export function LogWeightModal() {
  const [open, setOpen] = useState(false);
  const [weight, setWeight] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { addWeightLog } = useUserData();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!weight) {
      toast.error("Please enter a weight");
      return;
    }

    const weightValue = parseFloat(weight);
    if (isNaN(weightValue) || weightValue <= 0) {
      toast.error("Please enter a valid weight");
      return;
    }

    setIsLoading(true);
    
    try {
      await addWeightLog(weightValue);
      toast.success("Weight logged successfully!");
      setOpen(false);
      resetForm();
    } catch (error) {
      console.error("Error logging weight:", error);
      toast.error("Failed to log weight");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setWeight("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Scale className="h-4 w-4" />
          Log Weight
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[90vw] max-w-[320px] p-6">
        <DialogHeader>
          <DialogTitle>Log Weight</DialogTitle>
          <DialogDescription>
            Record your current weight in kilograms
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="weight" className="text-sm font-medium">Weight (kg)</Label>
            <Input
              id="weight"
              type="number"
              step="0.1"
              placeholder="75.5"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              required
              className="h-10"
              autoFocus
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !weight}>
              {isLoading ? "Logging..." : "Log Weight"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
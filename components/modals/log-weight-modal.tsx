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
import { Textarea } from "@/components/ui/textarea";
import { Scale } from "lucide-react";
import { useState } from "react";

interface WeightData {
  weight: string;
  bodyFat: string;
  muscleMass: string;
  waist: string;
  chest: string;
  arm: string;
  thigh: string;
  notes: string;
}

export function LogWeightModal() {
  const [open, setOpen] = useState(false);
  const [weightData, setWeightData] = useState<WeightData>({
    weight: "",
    bodyFat: "",
    muscleMass: "",
    waist: "",
    chest: "",
    arm: "",
    thigh: "",
    notes: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Weight data:", weightData);
    // TODO: Save to Firestore
    setOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setWeightData({
      weight: "",
      bodyFat: "",
      muscleMass: "",
      waist: "",
      chest: "",
      arm: "",
      thigh: "",
      notes: "",
    });
  };

  const updateWeightData = (field: keyof WeightData, value: string) => {
    setWeightData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Scale className="h-4 w-4" />
          Log Weight
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[90vw] max-w-[360px] max-h-[85vh] overflow-y-auto p-4">
        <DialogHeader className="pb-2">
          <DialogTitle className="text-lg">Log Weight Entry</DialogTitle>
          <DialogDescription className="text-sm">
            Record your weight and body measurements
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="weight" className="text-sm">Weight (kg) *</Label>
              <Input
                id="weight"
                type="number"
                step="0.1"
                placeholder="75.5"
                value={weightData.weight}
                onChange={(e) => updateWeightData("weight", e.target.value)}
                required
                className="h-9 text-sm"
              />
            </div>

            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="bodyFat" className="text-sm">Body Fat (%)</Label>
                <Input
                  id="bodyFat"
                  type="number"
                  step="0.1"
                  placeholder="15.5"
                  value={weightData.bodyFat}
                  onChange={(e) => updateWeightData("bodyFat", e.target.value)}
                  className="h-9 text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="muscleMass" className="text-sm">Muscle Mass (kg)</Label>
                <Input
                  id="muscleMass"
                  type="number"
                  step="0.1"
                  placeholder="45.2"
                  value={weightData.muscleMass}
                  onChange={(e) => updateWeightData("muscleMass", e.target.value)}
                  className="h-9 text-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Body Measurements (cm)</Label>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="waist" className="text-sm text-muted-foreground">Waist</Label>
                  <Input
                    id="waist"
                    type="number"
                    step="0.1"
                    placeholder="85.0"
                    value={weightData.waist}
                    onChange={(e) => updateWeightData("waist", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="chest" className="text-sm text-muted-foreground">Chest</Label>
                  <Input
                    id="chest"
                    type="number"
                    step="0.1"
                    placeholder="100.0"
                    value={weightData.chest}
                    onChange={(e) => updateWeightData("chest", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="arm" className="text-sm text-muted-foreground">Arm</Label>
                  <Input
                    id="arm"
                    type="number"
                    step="0.1"
                    placeholder="35.0"
                    value={weightData.arm}
                    onChange={(e) => updateWeightData("arm", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="thigh" className="text-sm text-muted-foreground">Thigh</Label>
                  <Input
                    id="thigh"
                    type="number"
                    step="0.1"
                    placeholder="55.0"
                    value={weightData.thigh}
                    onChange={(e) => updateWeightData("thigh", e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Any additional notes about today's measurement..."
                value={weightData.notes}
                onChange={(e) => updateWeightData("notes", e.target.value)}
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
            <Button type="submit">Log Weight</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
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
import { Edit } from "lucide-react";
import { useState } from "react";

interface ProfileData {
  firstName: string;
  lastName: string;
  age: string;
  gender: string;
  height: string;
  activityLevel: string;
}

export function EditProfileModal() {
  const [open, setOpen] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    firstName: "John",
    lastName: "Doe",
    age: "28",
    gender: "male",
    height: "175",
    activityLevel: "moderately_active",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Profile data:", profileData);
    // TODO: Save to Firestore
    setOpen(false);
  };

  const updateProfileData = (field: keyof ProfileData, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Edit className="h-4 w-4" />
          Edit Profile
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[85vw] max-w-[340px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-base">Edit Profile</DialogTitle>
          <DialogDescription className="text-xs">
            Update your personal information
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-3 w-full">
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="firstName" className="text-xs font-medium">First Name *</Label>
              <Input
                id="firstName"
                placeholder="John"
                value={profileData.firstName}
                onChange={(e) => updateProfileData("firstName", e.target.value)}
                required
                className="h-8 text-xs"
              />
            </div>
            
            <div className="space-y-1.5">
              <Label htmlFor="lastName" className="text-xs font-medium">Last Name *</Label>
              <Input
                id="lastName"
                placeholder="Doe"
                value={profileData.lastName}
                onChange={(e) => updateProfileData("lastName", e.target.value)}
                required
                className="h-8 text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="age" className="text-xs font-medium">Age</Label>
              <Input
                id="age"
                type="number"
                placeholder="28"
                value={profileData.age}
                onChange={(e) => updateProfileData("age", e.target.value)}
                className="h-8 text-xs"
              />
            </div>
            
            <div className="space-y-1.5">
              <Label htmlFor="gender" className="text-xs font-medium">Gender</Label>
              <Select
                value={profileData.gender}
                onValueChange={(value) => updateProfileData("gender", value)}
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male" className="text-xs">Male</SelectItem>
                  <SelectItem value="female" className="text-xs">Female</SelectItem>
                  <SelectItem value="other" className="text-xs">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="height" className="text-xs font-medium">Height (cm)</Label>
              <Input
                id="height"
                type="number"
                placeholder="175"
                value={profileData.height}
                onChange={(e) => updateProfileData("height", e.target.value)}
                className="h-8 text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="activityLevel" className="text-xs font-medium">Activity Level</Label>
              <Select
                value={profileData.activityLevel}
                onValueChange={(value) => updateProfileData("activityLevel", value)}
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="Select activity level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sedentary" className="text-xs">Sedentary</SelectItem>
                  <SelectItem value="lightly_active" className="text-xs">Lightly Active</SelectItem>
                  <SelectItem value="moderately_active" className="text-xs">Moderately Active</SelectItem>
                  <SelectItem value="very_active" className="text-xs">Very Active</SelectItem>
                  <SelectItem value="extremely_active" className="text-xs">Extremely Active</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="flex-col gap-2 mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="h-8 text-xs w-full"
            >
              Cancel
            </Button>
            <Button type="submit" className="h-8 text-xs w-full">
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
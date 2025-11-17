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
import { Edit } from "lucide-react";
import { useEffect, useState } from "react";

interface ProfileData {
  firstName: string;
  lastName: string;
  age: string;
  gender: string;
  height: string;
  activityLevel: string;
  city: string;
  country: string;
}

export function EditProfileModal() {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const { userProfile, refreshUserProfile } = useAuth();
  const [profileData, setProfileData] = useState<ProfileData>({
    firstName: "",
    lastName: "",
    age: "",
    gender: "",
    height: "",
    activityLevel: "",
    city: "",
    country: "",
  });

  // Load user profile data when modal opens or user profile changes
  useEffect(() => {
    if (userProfile) {
      setProfileData({
        firstName: userProfile.firstName || "",
        lastName: userProfile.lastName || "",
        age: userProfile.age?.toString() || "",
        gender: userProfile.gender || "",
        height: userProfile.height?.toString() || "",
        activityLevel: userProfile.activityLevel || "",
        city: userProfile.city || "",
        country: userProfile.country || "",
      });
    }
  }, [userProfile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userProfile?.id) return;

    setSaving(true);
    try {
      const userDoc = doc(db, "users", userProfile.id);

      // Calculate BMI if height and current weight are available
      let bmi = userProfile.bmi;
      if (profileData.height && userProfile.currentWeight) {
        const heightInM = parseFloat(profileData.height) / 100;
        bmi = userProfile.currentWeight / (heightInM * heightInM);
      }

      await updateDoc(userDoc, {
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        age: profileData.age ? parseInt(profileData.age) : null,
        gender: profileData.gender || null,
        height: profileData.height ? parseFloat(profileData.height) : null,
        activityLevel: profileData.activityLevel || null,
        city: profileData.city.trim() || null,
        country: profileData.country.trim() || null,
        bmi: bmi,
        updatedAt: new Date(),
      });

      await refreshUserProfile();
      setOpen(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setSaving(false);
    }
  };

  const updateProfileData = (field: keyof ProfileData, value: string) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
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
              <Label htmlFor="firstName" className="text-xs font-medium">
                First Name *
              </Label>
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
              <Label htmlFor="lastName" className="text-xs font-medium">
                Last Name *
              </Label>
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
              <Label htmlFor="age" className="text-xs font-medium">
                Age
              </Label>
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
              <Label htmlFor="gender" className="text-xs font-medium">
                Gender
              </Label>
              <Select
                value={profileData.gender}
                onValueChange={(value) => updateProfileData("gender", value)}
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male" className="text-xs">
                    Male
                  </SelectItem>
                  <SelectItem value="female" className="text-xs">
                    Female
                  </SelectItem>
                  <SelectItem value="other" className="text-xs">
                    Other
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="height" className="text-xs font-medium">
                Height (cm)
              </Label>
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
              <Label htmlFor="activityLevel" className="text-xs font-medium">
                Activity Level
              </Label>
              <Select
                value={profileData.activityLevel}
                onValueChange={(value) =>
                  updateProfileData("activityLevel", value)
                }
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="Select activity level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sedentary" className="text-xs">
                    Sedentary
                  </SelectItem>
                  <SelectItem value="lightly_active" className="text-xs">
                    Lightly Active
                  </SelectItem>
                  <SelectItem value="moderately_active" className="text-xs">
                    Moderately Active
                  </SelectItem>
                  <SelectItem value="very_active" className="text-xs">
                    Very Active
                  </SelectItem>
                  <SelectItem value="extremely_active" className="text-xs">
                    Extremely Active
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Location Fields */}
            <div className="space-y-1.5">
              <Label htmlFor="city" className="text-xs font-medium">
                City
              </Label>
              <Input
                id="city"
                type="text"
                placeholder="e.g., Tokyo"
                value={profileData.city}
                onChange={(e) => updateProfileData("city", e.target.value)}
                className="h-8 text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="country" className="text-xs font-medium">
                Country
              </Label>
              <Input
                id="country"
                type="text"
                placeholder="e.g., Japan"
                value={profileData.country}
                onChange={(e) => updateProfileData("country", e.target.value)}
                className="h-8 text-xs"
              />
            </div>
          </div>

          <DialogFooter className="flex-col gap-2 mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="h-8 text-xs w-full"
              disabled={saving}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="h-8 text-xs w-full"
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

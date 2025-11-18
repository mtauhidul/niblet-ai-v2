"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { updateUser } from "@/lib/firestore";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  MapPin,
  Target,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";

interface OnboardingData {
  age: string;
  gender: "male" | "female" | "other" | "";
  height: string; // in cm
  currentWeight: string; // in kg
  activityLevel:
    | "sedentary"
    | "lightly_active"
    | "moderately_active"
    | "very_active"
    | "extremely_active"
    | "";
  city: string;
  country: string;
}

const activityLevels = [
  {
    value: "sedentary",
    label: "Sedentary",
    description: "Little or no exercise",
  },
  {
    value: "lightly_active",
    label: "Lightly Active",
    description: "Light exercise 1-3 days/week",
  },
  {
    value: "moderately_active",
    label: "Moderately Active",
    description: "Moderate exercise 3-5 days/week",
  },
  {
    value: "very_active",
    label: "Very Active",
    description: "Hard exercise 6-7 days/week",
  },
  {
    value: "extremely_active",
    label: "Extremely Active",
    description: "Very hard exercise, physical job",
  },
];

const calculateBMI = (weight: number, height: number): number => {
  if (!weight || !height || height === 0) return 0;
  const heightInMeters = height / 100;
  return Number((weight / (heightInMeters * heightInMeters)).toFixed(1));
};

const getBMICategory = (bmi: number): { category: string; color: string } => {
  if (bmi < 18.5) return { category: "Underweight", color: "text-blue-600" };
  if (bmi < 25) return { category: "Normal weight", color: "text-green-600" };
  if (bmi < 30) return { category: "Overweight", color: "text-yellow-600" };
  return { category: "Obese", color: "text-red-600" };
};

export const OnboardingComponent: React.FC = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<OnboardingData>({
    age: "",
    gender: "",
    height: "",
    currentWeight: "",
    activityLevel: "",
    city: "",
    country: "",
  });

  const totalSteps = 5;
  const progress = (currentStep / totalSteps) * 100;

  // Calculate BMI whenever height or weight changes
  const bmi = calculateBMI(Number(data.currentWeight), Number(data.height));
  const bmiInfo = getBMICategory(bmi);

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return data.age && Number(data.age) > 0 && Number(data.age) < 120;
      case 2:
        return data.gender !== "";
      case 3:
        return (
          data.height &&
          data.currentWeight &&
          Number(data.height) > 0 &&
          Number(data.currentWeight) > 0
        );
      case 4:
        return data.activityLevel !== "";
      case 5:
        return data.city.trim() !== "" && data.country.trim() !== "";
      default:
        return false;
    }
  };

  const handleSubmit = async () => {
    if (!user?.uid || !isStepValid()) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      // Detect user's timezone
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      const updateData = {
        age: Number(data.age),
        gender: data.gender as "male" | "female" | "other",
        height: Number(data.height),
        currentWeight: Number(data.currentWeight),
        bmi: bmi,
        activityLevel: data.activityLevel as
          | "sedentary"
          | "lightly_active"
          | "moderately_active"
          | "very_active"
          | "extremely_active",
        city: data.city.trim(),
        country: data.country.trim(),
        timezone: timezone,
        isOnboardingComplete: true,
      };

      await updateUser(user.uid, updateData);

      // Also create an initial weight log entry
      try {
        const { createWeightLog } = await import("@/lib/firestore");
        await createWeightLog({
          userId: user.uid,
          weight: Number(data.currentWeight),
          recordedAt: new Date(),
          notes: "Initial weight from onboarding",
        });
      } catch (weightLogError) {
        console.warn("Failed to create initial weight log:", weightLogError);
        // Don't fail onboarding if weight log creation fails
      }

      console.log(
        "Onboarding completed, isOnboardingComplete should now be true"
      );
      toast.success("Profile updated successfully!");

      // Move to completion step
      setCurrentStep(totalSteps + 1);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <User className="h-12 w-12 mx-auto text-primary mb-4" />
              <h3 className="text-2xl font-bold">Tell us about yourself</h3>
              <p className="text-muted-foreground">
                Let&apos;s start with your age
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                placeholder="Enter your age"
                value={data.age}
                onChange={(e) => setData({ ...data, age: e.target.value })}
                min="1"
                max="120"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <User className="h-12 w-12 mx-auto text-primary mb-4" />
              <h3 className="text-2xl font-bold">Gender</h3>
              <p className="text-muted-foreground">
                This helps us provide better recommendations
              </p>
            </div>
            <div className="space-y-2">
              <Label>Select your gender</Label>
              <Select
                value={data.gender}
                onValueChange={(value: "male" | "female" | "other") =>
                  setData({ ...data, gender: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose your gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <Target className="h-12 w-12 mx-auto text-primary mb-4" />
              <h3 className="text-2xl font-bold">Physical Measurements</h3>
              <p className="text-muted-foreground">
                Help us calculate your BMI
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="height">Height (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  placeholder="170"
                  value={data.height}
                  onChange={(e) => setData({ ...data, height: e.target.value })}
                  min="50"
                  max="300"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weight">Current Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  placeholder="70"
                  value={data.currentWeight}
                  onChange={(e) =>
                    setData({ ...data, currentWeight: e.target.value })
                  }
                  min="20"
                  max="300"
                  step="0.1"
                />
              </div>
            </div>

            {bmi > 0 && (
              <div className="mt-6 p-4 bg-muted rounded-lg">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-1">Your BMI</p>
                  <p className="text-3xl font-bold">{bmi}</p>
                  <p className={`text-sm font-medium ${bmiInfo.color}`}>
                    {bmiInfo.category}
                  </p>
                </div>
              </div>
            )}
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <Target className="h-12 w-12 mx-auto text-primary mb-4" />
              <h3 className="text-2xl font-bold">Activity Level</h3>
              <p className="text-muted-foreground">
                How active are you typically?
              </p>
            </div>

            <div className="space-y-2">
              <Label>Select your activity level</Label>
              <Select
                value={data.activityLevel}
                onValueChange={(
                  value:
                    | "sedentary"
                    | "lightly_active"
                    | "moderately_active"
                    | "very_active"
                    | "extremely_active"
                ) => setData({ ...data, activityLevel: value })}
              >
                <SelectTrigger className="h-auto w-full min-h-16 py-2">
                  <SelectValue placeholder="Choose your activity level" />
                </SelectTrigger>
                <SelectContent className="max-h-64">
                  {activityLevels.map((level) => (
                    <SelectItem
                      key={level.value}
                      value={level.value}
                      className="py-2 px-2"
                    >
                      <div className="flex flex-col gap-1">
                        <div className="font-medium text-sm">{level.label}</div>
                        <div className="text-xs text-muted-foreground">
                          {level.description}
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <MapPin className="h-12 w-12 mx-auto text-primary mb-4" />
              <h3 className="text-2xl font-bold">Your Location</h3>
              <p className="text-muted-foreground">
                Help us provide better meal suggestions based on local food
                availability
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  type="text"
                  placeholder="e.g., Texas"
                  value={data.city}
                  onChange={(e) => setData({ ...data, city: e.target.value })}
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  type="text"
                  placeholder="e.g., USA"
                  value={data.country}
                  onChange={(e) =>
                    setData({ ...data, country: e.target.value })
                  }
                  className="h-12"
                />
              </div>

              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  💡 <strong>Why we need this:</strong> Your location helps our
                  AI suggest meals with locally available ingredients and
                  calculate nutrition more accurately based on regional food
                  variations.
                </p>
              </div>
            </div>
          </div>
        );

      case totalSteps + 1:
        return (
          <div className="text-center space-y-6">
            <CheckCircle className="h-16 w-16 mx-auto text-green-600" />
            <div>
              <h3 className="text-2xl font-bold">Welcome to NibletAI! 🎉</h3>
              <p className="text-muted-foreground mt-2">
                Your profile has been set up successfully.
              </p>
            </div>

            <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                <strong>Next Step:</strong> Visit your profile goals section to
                set your health goals and start your journey towards better
                health!
              </p>
            </div>

            <Button
              onClick={() => router.push("/dashboard")}
              className="w-full"
            >
              Go to Dashboard
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center justify-between mb-2">
            <CardTitle>Profile Setup</CardTitle>
            {currentStep <= totalSteps && (
              <span className="text-sm text-muted-foreground">
                {currentStep} of {totalSteps}
              </span>
            )}
          </div>
          {currentStep <= totalSteps && (
            <>
              <Progress value={progress} className="w-full" />
              <CardDescription>
                Help us personalize your experience
              </CardDescription>
            </>
          )}
        </CardHeader>

        <CardContent className="space-y-6">
          {renderStep()}

          {currentStep <= totalSteps && (
            <div className="flex justify-between pt-4">
              <Button
                variant="outline"
                onClick={handlePrev}
                disabled={currentStep === 1}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Previous
              </Button>

              {currentStep === totalSteps ? (
                <Button
                  onClick={handleSubmit}
                  disabled={!isStepValid() || loading}
                  className="flex items-center gap-2"
                >
                  {loading ? "Saving..." : "Complete Setup"}
                  <CheckCircle className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  disabled={!isStepValid()}
                  className="flex items-center gap-2"
                >
                  Next
                  <ArrowRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

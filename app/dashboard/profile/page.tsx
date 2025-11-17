"use client";

import { DashboardHeader } from "@/components/dashboard-header";
import { EditProfileModal } from "@/components/modals/edit-profile-modal";
import { UpdateGoalsModal } from "@/components/modals/update-goals-modal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Info, Settings, Target, User, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useUserData } from "@/contexts/UserContext";
import { toast } from "sonner";

const formatActivityLevel = (level?: string) => {
  if (!level) return 'Not set';
  const formatted = level.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  return formatted;
};

const LogoutSection = () => {
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Error logging out. Please try again.");
    }
  };

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-muted-foreground">Account</h3>
      <Button
        variant="destructive"
        onClick={handleLogout}
        className="w-full flex items-center gap-2"
      >
        <LogOut className="h-4 w-4" />
        Logout
      </Button>
    </div>
  );
};

export default function ProfilePage() {
  const { userProfile, loading } = useAuth();
  const { weightLogs } = useUserData();

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  return (
    <div className="h-full flex flex-col">
      {/* Header - fixed */}
      <div className="px-4 py-3 border-b bg-background/95 backdrop-blur">
        <DashboardHeader 
          title="Profile" 
          description="Manage your profile and goals" 
        />
      </div>

      {/* Content - scrollable */}
      <div className="flex-1 overflow-auto">
        <Tabs defaultValue="profile" className="h-full flex flex-col">
          <div className="px-4 py-2 border-b">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="profile" className="flex items-center gap-1 text-xs">
                <User className="h-3 w-3" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="goals" className="flex items-center gap-1 text-xs">
                <Target className="h-3 w-3" />
                Goals
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="profile" className="flex-1 overflow-auto p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">Personal Information</h3>
              <EditProfileModal />
            </div>

            <div className="space-y-4">
              {/* Profile Information Cards */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-lg border p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <Info className="h-4 w-4 text-muted-foreground" />
                    <h3 className="font-medium">Basic Information</h3>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Name
                      </span>
                      <span className="text-sm font-medium">
                        {userProfile ? `${userProfile.firstName} ${userProfile.lastName}` : 'Not set'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Email
                      </span>
                      <span className="text-sm font-medium">
                        {userProfile?.email || 'Not available'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Age</span>
                      <span className="text-sm font-medium">
                        {userProfile?.age ? `${userProfile.age} years` : 'Not set'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Gender
                      </span>
                      <span className="text-sm font-medium capitalize">
                        {userProfile?.gender || 'Not set'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <Settings className="h-4 w-4 text-muted-foreground" />
                    <h3 className="font-medium">Physical Stats</h3>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Height
                      </span>
                      <span className="text-sm font-medium">
                        {userProfile?.height ? `${userProfile.height} cm` : 'Not set'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Current Weight
                      </span>
                      <span className="text-sm font-medium">
                        {weightLogs.length > 0 ? `${weightLogs[0].weight} kg` : userProfile?.currentWeight ? `${userProfile.currentWeight} kg` : 'Not set'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">BMI</span>
                      <span className="text-sm font-medium">
                        {userProfile?.bmi ? userProfile.bmi.toFixed(1) : 'Not calculated'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Activity Level
                      </span>
                      <span className="text-sm font-medium">
                        {formatActivityLevel(userProfile?.activityLevel)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="goals" className="flex-1 overflow-auto p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">Health & Fitness Goals</h3>
              <UpdateGoalsModal />
            </div>

            <div className="space-y-4">
              {/* Check if goals are set */}
              {userProfile?.goalType && userProfile?.targetWeight ? (
                <>
                  {/* Current Goals */}
                  <div className="rounded-lg border p-4 space-y-3">
                    <h3 className="font-medium flex items-center gap-2">
                      <Target className="h-4 w-4 text-green-600" />
                      Current Goals
                    </h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">
                            Goal Type
                          </span>
                          <span className="text-sm font-medium text-green-600 capitalize">
                            {userProfile.goalType.replace('_', ' ')}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">
                            Target Weight
                          </span>
                          <span className="text-sm font-medium">
                            {userProfile.targetWeight} kg
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">
                            Weight Difference
                          </span>
                          <span className="text-sm font-medium">
                            {userProfile.currentWeight 
                              ? `${Math.abs(userProfile.currentWeight - userProfile.targetWeight).toFixed(1)} kg ${userProfile.currentWeight > userProfile.targetWeight ? 'to lose' : 'to gain'}`
                              : 'Update current weight'
                            }
                          </span>
                        </div>
                        {userProfile.goalTargetDate && (
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">
                              Target Date
                            </span>
                            <span className="text-sm font-medium">
                              {(() => {
                                try {
                                  const date = userProfile.goalTargetDate instanceof Date 
                                    ? userProfile.goalTargetDate 
                                    : new Date(userProfile.goalTargetDate);
                                  return isNaN(date.getTime()) ? 'Invalid date' : date.toLocaleDateString();
                                } catch {
                                  return 'Invalid date';
                                }
                              })()}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">
                            Daily Calorie Goal
                          </span>
                          <span className="text-sm font-medium">
                            {userProfile.targetCalories ? `${userProfile.targetCalories} cal` : 'Not set'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">
                            Protein Goal
                          </span>
                          <span className="text-sm font-medium">
                            {userProfile.targetProtein ? `${userProfile.targetProtein}g` : 'Not set'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">
                            Carbs Goal
                          </span>
                          <span className="text-sm font-medium">
                            {userProfile.targetCarbs ? `${userProfile.targetCarbs}g` : 'Not set'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">
                            Fat Goal
                          </span>
                          <span className="text-sm font-medium">
                            {userProfile.targetFat ? `${userProfile.targetFat}g` : 'Not set'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">
                            Water Intake Goal
                          </span>
                          <span className="text-sm font-medium">
                            {userProfile.targetWater ? `${(userProfile.targetWater / 1000).toFixed(1)} L/day` : 'Not set'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                /* No Goals Set State */
                <div className="rounded-lg border border-dashed p-8 text-center space-y-4">
                  <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                    <Target className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-medium text-lg">No Goals Set Yet</h3>
                    <p className="text-sm text-muted-foreground max-w-md mx-auto">
                      Set up your health and fitness goals to get personalized nutrition recommendations and track your progress effectively.
                    </p>
                  </div>
                  <div className="pt-2 flex justify-center">
                    <UpdateGoalsModal />
                  </div>
                </div>
              )}

              {/* Goal Progress - Only show if goals are set */}
              {userProfile?.goalType && userProfile?.targetWeight && (
                <div className="rounded-lg border p-4 space-y-4">
                  <h3 className="font-medium">Goal Progress</h3>
                  
                  {userProfile?.currentWeight ? (
                    <div className="space-y-3">
                      {/* Weight Progress */}
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="font-medium">Weight Progress</span>
                          <span className="text-muted-foreground">
                            {Math.abs(userProfile.currentWeight - userProfile.targetWeight) < 0.5 
                              ? '🎉 Goal Achieved!' 
                              : `${Math.abs(userProfile.currentWeight - userProfile.targetWeight).toFixed(1)} kg remaining`
                            }
                          </span>
                        </div>
                        
                        {/* Calculate progress percentage */}
                        {(() => {
                          const initialWeight = userProfile.currentWeight; // We could store this when goal is created
                          const targetWeight = userProfile.targetWeight;
                          const currentWeight = userProfile.currentWeight;
                          
                          // Calculate total journey and progress made
                          const totalJourney = Math.abs(initialWeight - targetWeight);
                          const remaining = Math.abs(currentWeight - targetWeight);
                          const progressMade = Math.max(0, totalJourney - remaining);
                          const progressPercentage = totalJourney > 0 ? (progressMade / totalJourney) * 100 : 0;
                          
                          return (
                            <>
                              <div className="w-full bg-gray-200 rounded-full h-3">
                                <div 
                                  className="bg-linear-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-500 ease-out" 
                                  style={{ 
                                    width: `${Math.min(100, Math.max(5, progressPercentage))}%` 
                                  }}
                                ></div>
                              </div>
                              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                                <span>Start: {initialWeight}kg</span>
                                <span className="font-medium">{Math.round(progressPercentage)}% Complete</span>
                                <span>Goal: {targetWeight}kg</span>
                              </div>
                            </>
                          );
                        })()}
                      </div>
                      
                      {/* Time Progress (if target date is set) */}
                      {userProfile.goalTargetDate && (
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="font-medium">Time Progress</span>
                            <span className="text-muted-foreground">
                              {(() => {
                                try {
                                  const targetDate = userProfile.goalTargetDate instanceof Date 
                                    ? userProfile.goalTargetDate 
                                    : new Date(userProfile.goalTargetDate);
                                  const currentDate = new Date();
                                  const createdDate = userProfile.goalCreatedAt 
                                    ? (userProfile.goalCreatedAt instanceof Date 
                                        ? userProfile.goalCreatedAt 
                                        : new Date(userProfile.goalCreatedAt))
                                    : currentDate;
                                  
                                  if (isNaN(targetDate.getTime()) || isNaN(createdDate.getTime())) {
                                    return 'Invalid dates';
                                  }
                                
                                  const totalDays = Math.max(1, Math.ceil((targetDate.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24)));
                                  const daysPassed = Math.max(0, Math.ceil((currentDate.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24)));
                                  const daysRemaining = Math.max(0, totalDays - daysPassed);
                                  
                                  if (daysRemaining === 0) {
                                    return 'Target date reached!';
                                  } else if (daysRemaining === 1) {
                                    return '1 day remaining';
                                  } else {
                                    return `${daysRemaining} days remaining`;
                                  }
                                } catch {
                                  return 'Unable to calculate timeline';
                                }
                              })()}
                            </span>
                          </div>
                          
                          {(() => {
                            try {
                              const targetDate = userProfile.goalTargetDate instanceof Date 
                                ? userProfile.goalTargetDate 
                                : new Date(userProfile.goalTargetDate);
                              const currentDate = new Date();
                              const createdDate = userProfile.goalCreatedAt 
                                ? (userProfile.goalCreatedAt instanceof Date 
                                    ? userProfile.goalCreatedAt 
                                    : new Date(userProfile.goalCreatedAt))
                                : currentDate;
                              
                              if (isNaN(targetDate.getTime()) || isNaN(createdDate.getTime())) {
                                return (
                                  <div className="text-center text-sm text-muted-foreground py-4">
                                    Unable to display progress - invalid dates
                                  </div>
                                );
                              }
                              
                              const totalDays = Math.max(1, Math.ceil((targetDate.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24)));
                              const daysPassed = Math.max(0, Math.ceil((currentDate.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24)));
                              const timeProgress = Math.min(100, (daysPassed / totalDays) * 100);
                              
                              return (
                                <>
                                  <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div 
                                      className="bg-blue-500 h-2 rounded-full transition-all duration-500" 
                                      style={{ width: `${timeProgress}%` }}
                                    ></div>
                                  </div>
                                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                                    <span>Started: {createdDate.toLocaleDateString()}</span>
                                    <span>Target: {targetDate.toLocaleDateString()}</span>
                                  </div>
                                </>
                              );
                            } catch {
                              return (
                                <div className="text-center text-sm text-muted-foreground py-4">
                                  Unable to display progress
                                </div>
                              );
                            }
                          })()}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground text-center py-6 bg-muted/50 rounded-lg">
                      <p>Log your current weight to track progress towards your goal</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Logout Section - Fixed Bottom */}
      <div className="p-4 border-t bg-background">
        <LogoutSection />
      </div>
    </div>
  );
}

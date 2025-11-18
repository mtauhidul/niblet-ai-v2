"use client";

import { Logo } from "@/components/logo";
import { EditProfileModal } from "@/components/modals/edit-profile-modal";
import { UpdateGoalsModal } from "@/components/modals/update-goals-modal";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { useUserData } from "@/contexts/UserContext";
import { Activity, LogOut, Target, User } from "lucide-react";
import { toast } from "sonner";

const formatActivityLevel = (level?: string) => {
  if (!level) return "Not set";
  const formatted = level
    .replace(/_/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());
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
    <div className="space-y-2">
      <h3 className="text-[10px] font-medium text-gray-400 uppercase tracking-wide">Account</h3>
      <Button
        variant="destructive"
        onClick={handleLogout}
        className="w-full flex items-center justify-center gap-2 h-9 bg-red-500/10 hover:bg-red-500/20 text-red-400 border-red-500/20"
      >
        <LogOut className="h-3.5 w-3.5" />
        <span className="text-xs">Logout</span>
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
      <div className="px-4 py-3">
        <Logo size="md" showText />
      </div>

      {/* Content - scrollable */}
      <div className="flex-1 overflow-auto">
        <Tabs defaultValue="profile" className="h-full flex flex-col">
          <div className="px-4 py-2">
            <TabsList className="grid w-full grid-cols-2 bg-white/5">
              <TabsTrigger
                value="profile"
                className="flex items-center gap-1.5 text-xs data-[state=active]:bg-[#CAFF66] data-[state=active]:text-black"
              >
                <User className="h-3 w-3" />
                Profile
              </TabsTrigger>
              <TabsTrigger
                value="goals"
                className="flex items-center gap-1.5 text-xs data-[state=active]:bg-[#CAFF66] data-[state=active]:text-black"
              >
                <Target className="h-3 w-3" />
                Goals
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent
            value="profile"
            className="flex-1 overflow-auto p-4 space-y-3"
          >
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-[10px] font-medium text-gray-400 uppercase tracking-wide">Personal Info</h3>
              <EditProfileModal />
            </div>

            <div className="space-y-2">
              {/* Profile Information Cards */}
              <div className="grid gap-2">
                <div className="card p-3 space-y-2">
                  <div className="flex items-center gap-2 mb-1">
                    <User className="h-3.5 w-3.5 text-[#CAFF66]" />
                    <h3 className="text-xs font-medium text-white">Basic Information</h3>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-gray-400 uppercase">Name</span>
                      <span className="text-xs font-medium text-white">
                        {userProfile
                          ? `${userProfile.firstName} ${userProfile.lastName}`
                          : "Not set"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-gray-400 uppercase">Email</span>
                      <span className="text-xs font-medium text-white truncate ml-2">
                        {userProfile?.email || "Not available"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-gray-400 uppercase">Age</span>
                      <span className="text-xs font-medium text-white">
                        {userProfile?.age
                          ? `${userProfile.age} years`
                          : "Not set"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-gray-400 uppercase">Gender</span>
                      <span className="text-xs font-medium text-white capitalize">
                        {userProfile?.gender || "Not set"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-gray-400 uppercase">Location</span>
                      <span className="text-xs font-medium text-white">
                        {userProfile?.city && userProfile?.country
                          ? `${userProfile.city}, ${userProfile.country}`
                          : "Not set"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="card p-3 space-y-2">
                  <div className="flex items-center gap-2 mb-1">
                    <Activity className="h-3.5 w-3.5 text-[#C8A8FF]" />
                    <h3 className="text-xs font-medium text-white">Physical Stats</h3>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-gray-400 uppercase">Height</span>
                      <span className="text-xs font-medium text-white">
                        {userProfile?.height
                          ? `${userProfile.height} cm`
                          : "Not set"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-gray-400 uppercase">Weight</span>
                      <span className="text-xs font-medium text-white">
                        {weightLogs.length > 0
                          ? `${weightLogs[0].weight} kg`
                          : userProfile?.currentWeight
                          ? `${userProfile.currentWeight} kg`
                          : "Not set"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-gray-400 uppercase">BMI</span>
                      <span className="text-xs font-medium text-white">
                        {userProfile?.bmi
                          ? userProfile.bmi.toFixed(1)
                          : "Not calculated"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-gray-400 uppercase">Activity</span>
                      <span className="text-xs font-medium text-white">
                        {formatActivityLevel(userProfile?.activityLevel)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent
            value="goals"
            className="flex-1 overflow-auto p-4 space-y-3"
          >
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-[10px] font-medium text-gray-400 uppercase tracking-wide">Goals</h3>
              <UpdateGoalsModal />
            </div>

            <div className="space-y-2">
              {/* Check if goals are set */}
              {userProfile?.goalType && userProfile?.targetWeight ? (
                <>
                  {/* Current Goals */}
                  <div className="card p-3 space-y-2">
                    <h3 className="text-xs font-medium text-white flex items-center gap-2 mb-1">
                      <Target className="h-3.5 w-3.5 text-[#FFE5A8]" />
                      Current Goals
                    </h3>
                    <div className="grid gap-2">
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] text-gray-400 uppercase">Type</span>
                          <span className="text-xs font-medium text-[#CAFF66] capitalize">
                            {userProfile.goalType.replace("_", " ")}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] text-gray-400 uppercase">Target Weight</span>
                          <span className="text-xs font-medium text-white">
                            {userProfile.targetWeight} kg
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] text-gray-400 uppercase">To Go</span>
                          <span className="text-xs font-medium text-white">
                            {userProfile.currentWeight
                              ? `${Math.abs(
                                  userProfile.currentWeight -
                                    userProfile.targetWeight
                                ).toFixed(1)} kg ${
                                  userProfile.currentWeight >
                                  userProfile.targetWeight
                                    ? "to lose"
                                    : "to gain"
                                }`
                              : "Update weight"}
                          </span>
                        </div>
                        {userProfile.goalTargetDate && (
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] text-gray-400 uppercase">Target Date</span>
                            <span className="text-xs font-medium text-white">
                              {(() => {
                                try {
                                  const date =
                                    userProfile.goalTargetDate instanceof Date
                                      ? userProfile.goalTargetDate
                                      : new Date(userProfile.goalTargetDate);
                                  return isNaN(date.getTime())
                                    ? "Invalid"
                                    : date.toLocaleDateString();
                                } catch {
                                  return "Invalid";
                                }
                              })()}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="space-y-1.5 pt-1 border-t border-white/10">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] text-gray-400 uppercase">Calories</span>
                          <span className="text-xs font-medium text-white">
                            {userProfile.targetCalories
                              ? `${userProfile.targetCalories}`
                              : "Not set"}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] text-gray-400 uppercase">Protein</span>
                          <span className="text-xs font-medium text-white">
                            {userProfile.targetProtein
                              ? `${userProfile.targetProtein}g`
                              : "Not set"}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] text-gray-400 uppercase">Carbs</span>
                          <span className="text-xs font-medium text-white">
                            {userProfile.targetCarbs
                              ? `${userProfile.targetCarbs}g`
                              : "Not set"}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] text-gray-400 uppercase">Fat</span>
                          <span className="text-xs font-medium text-white">
                            {userProfile.targetFat
                              ? `${userProfile.targetFat}g`
                              : "Not set"}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] text-gray-400 uppercase">Water</span>
                          <span className="text-xs font-medium text-white">
                            {userProfile.targetWater
                              ? `${(userProfile.targetWater / 1000).toFixed(1)}L`
                              : "Not set"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                /* No Goals Set State */
                <div className="card border-dashed p-6 text-center space-y-3 flex flex-col items-center">
                  <div className="w-10 h-10 bg-[#FFE5A8]/10 rounded-full flex items-center justify-center">
                    <Target className="h-5 w-5 text-[#FFE5A8]" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-medium text-white">No Goals Set</h3>
                    <p className="text-xs text-gray-400">
                      Set goals to track progress
                    </p>
                  </div>
                  <div className="pt-1 flex justify-center">
                    <UpdateGoalsModal />
                  </div>
                </div>
              )}

              {/* Goal Progress - Only show if goals are set */}
              {userProfile?.goalType && userProfile?.targetWeight && (
                <div className="card p-3 space-y-2.5">
                  <h3 className="text-xs font-medium text-white">Goal Progress</h3>

                  {userProfile?.currentWeight ? (
                    <div className="space-y-2.5">
                      {/* Weight Progress */}
                      <div>
                        <div className="flex justify-between items-center mb-1.5">
                          <span className="text-[10px] font-medium text-gray-400 uppercase">Weight</span>
                          <span className="text-[9px] text-gray-500">
                            {Math.abs(
                              userProfile.currentWeight -
                                userProfile.targetWeight
                            ) < 0.5
                              ? "🎉 Reached!"
                              : `${Math.abs(
                                  userProfile.currentWeight -
                                    userProfile.targetWeight
                                ).toFixed(1)} kg left`}
                          </span>
                        </div>

                        {/* Calculate progress percentage */}
                        {(() => {
                          const initialWeight = userProfile.currentWeight;
                          const targetWeight = userProfile.targetWeight;
                          const currentWeight = userProfile.currentWeight;

                          const totalJourney = Math.abs(
                            initialWeight - targetWeight
                          );
                          const remaining = Math.abs(
                            currentWeight - targetWeight
                          );
                          const progressMade = Math.max(
                            0,
                            totalJourney - remaining
                          );
                          const progressPercentage =
                            totalJourney > 0
                              ? (progressMade / totalJourney) * 100
                              : 0;

                          return (
                            <>
                              <div className="w-full bg-white/5 rounded-full h-1">
                                <div
                                  className="bg-[#CAFF66] h-1 rounded-full transition-all duration-500"
                                  style={{
                                    width: `${Math.min(
                                      100,
                                      Math.max(2, progressPercentage)
                                    )}%`,
                                  }}
                                ></div>
                              </div>
                              <div className="flex justify-between text-[9px] text-gray-500">
                                <span>{initialWeight}kg</span>
                                <span className="text-white font-medium">
                                  {Math.round(progressPercentage)}%
                                </span>
                                <span>{targetWeight}kg</span>
                              </div>
                            </>
                          );
                        })()}
                      </div>

                      {/* Time Progress (if target date is set) */}
                      {userProfile.goalTargetDate && (
                        <div>
                          <div className="flex justify-between items-center mb-1.5">
                            <span className="text-[10px] font-medium text-gray-400 uppercase">Time</span>
                            <span className="text-[9px] text-gray-500">
                              {(() => {
                                try {
                                  const targetDate =
                                    userProfile.goalTargetDate instanceof Date
                                      ? userProfile.goalTargetDate
                                      : new Date(userProfile.goalTargetDate);
                                  const currentDate = new Date();
                                  const createdDate = userProfile.goalCreatedAt
                                    ? userProfile.goalCreatedAt instanceof Date
                                      ? userProfile.goalCreatedAt
                                      : new Date(userProfile.goalCreatedAt)
                                    : currentDate;

                                  if (
                                    isNaN(targetDate.getTime()) ||
                                    isNaN(createdDate.getTime())
                                  ) {
                                    return "Invalid";
                                  }

                                  const totalDays = Math.max(
                                    1,
                                    Math.ceil(
                                      (targetDate.getTime() -
                                        createdDate.getTime()) /
                                        (1000 * 60 * 60 * 24)
                                    )
                                  );
                                  const daysPassed = Math.max(
                                    0,
                                    Math.ceil(
                                      (currentDate.getTime() -
                                        createdDate.getTime()) /
                                        (1000 * 60 * 60 * 24)
                                    )
                                  );
                                  const daysRemaining = Math.max(
                                    0,
                                    totalDays - daysPassed
                                  );

                                  if (daysRemaining === 0) {
                                    return "🎉 Reached!";
                                  } else {
                                    return `${daysRemaining}d left`;
                                  }
                                } catch {
                                  return "Invalid";
                                }
                              })()}
                            </span>
                          </div>

                          {(() => {
                            try {
                              const targetDate =
                                userProfile.goalTargetDate instanceof Date
                                  ? userProfile.goalTargetDate
                                  : new Date(userProfile.goalTargetDate);
                              const currentDate = new Date();
                              const createdDate = userProfile.goalCreatedAt
                                ? userProfile.goalCreatedAt instanceof Date
                                  ? userProfile.goalCreatedAt
                                  : new Date(userProfile.goalCreatedAt)
                                : currentDate;

                              if (
                                isNaN(targetDate.getTime()) ||
                                isNaN(createdDate.getTime())
                              ) {
                                return (
                                  <div className="text-center text-[9px] text-gray-500 py-2">
                                    Invalid dates
                                  </div>
                                );
                              }

                              const totalDays = Math.max(
                                1,
                                Math.ceil(
                                  (targetDate.getTime() -
                                    createdDate.getTime()) /
                                    (1000 * 60 * 60 * 24)
                                )
                              );
                              const daysPassed = Math.max(
                                0,
                                Math.ceil(
                                  (currentDate.getTime() -
                                    createdDate.getTime()) /
                                    (1000 * 60 * 60 * 24)
                                )
                              );
                              const timeProgress = Math.min(
                                100,
                                (daysPassed / totalDays) * 100
                              );

                              return (
                                <>
                                  <div className="w-full bg-white/5 rounded-full h-1">
                                    <div
                                      className="bg-[#C8A8FF] h-1 rounded-full transition-all duration-500"
                                      style={{ width: `${timeProgress}%` }}
                                    ></div>
                                  </div>
                                  <div className="flex justify-between text-[9px] text-gray-500">
                                    <span>
                                      {createdDate.toLocaleDateString()}
                                    </span>
                                    <span>
                                      {targetDate.toLocaleDateString()}
                                    </span>
                                  </div>
                                </>
                              );
                            } catch {
                              return (
                                <div className="text-center text-[9px] text-gray-500 py-2">
                                  Invalid dates
                                </div>
                              );
                            }
                          })()}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-xs text-gray-400 text-center py-4 bg-white/5 rounded-lg">
                      <p>
                        Log weight to track progress
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Logout Section - Fixed Bottom */}
      <div className="p-4">
        <LogoutSection />
      </div>
    </div>
  );
}

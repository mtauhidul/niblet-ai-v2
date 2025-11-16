import { DashboardHeader } from "@/components/dashboard-header";
import { EditProfileModal } from "@/components/modals/edit-profile-modal";
import { UpdateGoalsModal } from "@/components/modals/update-goals-modal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Info, Settings, Target, User } from "lucide-react";

export default function ProfilePage() {
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
                      <span className="text-sm font-medium">John Doe</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Email
                      </span>
                      <span className="text-sm font-medium">
                        john.doe@example.com
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Age</span>
                      <span className="text-sm font-medium">32 years</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Gender
                      </span>
                      <span className="text-sm font-medium">Male</span>
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
                      <span className="text-sm font-medium">175 cm</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Current Weight
                      </span>
                      <span className="text-sm font-medium">74.9 kg</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">BMI</span>
                      <span className="text-sm font-medium">24.5</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Activity Level
                      </span>
                      <span className="text-sm font-medium">
                        Moderately Active
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Account Settings */}
              <div className="rounded-lg border p-4 space-y-3">
                <h3 className="font-medium">Account Settings</h3>
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Email Notifications</span>
                    <button className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded">
                      Enabled
                    </button>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Push Notifications</span>
                    <button className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded">
                      Enabled
                    </button>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Data Privacy</span>
                    <button className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">
                      Manage
                    </button>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Two-Factor Auth</span>
                    <button className="text-xs px-2 py-1 bg-gray-100 text-gray-800 rounded">
                      Setup
                    </button>
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
                        Target Weight
                      </span>
                      <span className="text-sm font-medium text-green-600">
                        70.0 kg
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Weight to Lose
                      </span>
                      <span className="text-sm font-medium">
                        4.9 kg remaining
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Target Date
                      </span>
                      <span className="text-sm font-medium">March 2025</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Daily Calorie Goal
                      </span>
                      <span className="text-sm font-medium">1,950 cal</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Weekly Exercise
                      </span>
                      <span className="text-sm font-medium">5 days/week</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Water Intake
                      </span>
                      <span className="text-sm font-medium">3.0 L/day</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Goal Progress */}
              <div className="rounded-lg border p-4 space-y-3">
                <h3 className="font-medium">Goal Progress</h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Weight Loss Progress</span>
                      <span>57% Complete</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full w-[57%]"></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>This Week&apos;s Calorie Goal</span>
                      <span>4/7 days on track</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full w-[57%]"></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Exercise Consistency</span>
                      <span>3/5 workouts completed</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-orange-600 h-2 rounded-full w-[60%]"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="rounded-lg border p-4 space-y-3">
                <h3 className="font-medium">Quick Actions</h3>
                <div className="grid gap-2 md:grid-cols-3">
                  <button className="p-3 text-left rounded-lg border hover:bg-accent transition-colors">
                    <div className="text-sm font-medium">
                      Adjust Target Weight
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Modify your weight goal
                    </div>
                  </button>
                  <button className="p-3 text-left rounded-lg border hover:bg-accent transition-colors">
                    <div className="text-sm font-medium">
                      Update Calorie Goal
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Change daily calorie target
                    </div>
                  </button>
                  <button className="p-3 text-left rounded-lg border hover:bg-accent transition-colors">
                    <div className="text-sm font-medium">Set New Deadline</div>
                    <div className="text-xs text-muted-foreground">
                      Adjust target date
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

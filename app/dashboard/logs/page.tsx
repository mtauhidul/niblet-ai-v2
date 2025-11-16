import { DashboardHeader } from "@/components/dashboard-header";
import { AddMealModal } from "@/components/modals/add-meal-modal";
import { LogWeightModal } from "@/components/modals/log-weight-modal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Scale, Utensils } from "lucide-react";

export default function LogsPage() {
  return (
    <div className="h-full flex flex-col">
      {/* Header - fixed */}
      <div className="px-4 py-3 border-b bg-background/95 backdrop-blur">
        <DashboardHeader 
          title="Logs" 
          description="Track meals and weight" 
        />
      </div>

      {/* Content - scrollable */}
      <div className="flex-1 overflow-auto">
        <Tabs defaultValue="meals" className="h-full flex flex-col">
          <div className="px-4 py-2 border-b">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="meals" className="flex items-center gap-1 text-xs">
                <Utensils className="h-3 w-3" />
                Meals
              </TabsTrigger>
              <TabsTrigger value="weight" className="flex items-center gap-1 text-xs">
                <Scale className="h-3 w-3" />
                Weight
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="meals" className="flex-1 overflow-auto p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">Meal History</h3>
              <AddMealModal />
            </div>

            <div className="space-y-3">
              {/* Sample meal entries */}
              <div className="rounded-lg border p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Today - Breakfast</span>
                  </div>
                  <span className="text-sm text-muted-foreground">320 cal</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Oatmeal with berries and honey
                </p>
              </div>

              <div className="rounded-lg border p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Yesterday - Dinner</span>
                  </div>
                  <span className="text-sm text-muted-foreground">580 cal</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Grilled chicken with vegetables
                </p>
              </div>

              <div className="rounded-lg border border-dashed p-8 text-center">
                <p className="text-sm text-muted-foreground">
                  Your complete meal tracking history will appear here
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="weight" className="flex-1 overflow-auto p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">Weight Progress</h3>
              <LogWeightModal />
            </div>

            <div className="space-y-3">
              {/* Sample weight entries */}
              <div className="rounded-lg border p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Today</span>
                  </div>
                  <span className="text-sm text-muted-foreground">Morning</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold">72.5 kg</span>
                  <span className="text-sm text-green-600">
                    -0.3 kg from yesterday
                  </span>
                </div>
              </div>

              <div className="rounded-lg border p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Yesterday</span>
                  </div>
                  <span className="text-sm text-muted-foreground">Morning</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold">72.8 kg</span>
                  <span className="text-sm text-red-600">
                    +0.1 kg from previous
                  </span>
                </div>
              </div>

              <div className="rounded-lg border border-dashed p-8 text-center">
                <p className="text-sm text-muted-foreground">
                  Your complete weight tracking history will appear here
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

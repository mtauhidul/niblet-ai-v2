import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Scale, Utensils } from "lucide-react";

export default function LogsPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Logs</h1>
          <p className="text-muted-foreground">
            Track your meals and weight progress
          </p>
        </div>

        <Tabs defaultValue="meals" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="meals" className="flex items-center gap-2">
              <Utensils className="h-4 w-4" />
              Meal Logs
            </TabsTrigger>
            <TabsTrigger value="weight" className="flex items-center gap-2">
              <Scale className="h-4 w-4" />
              Weight Logs
            </TabsTrigger>
          </TabsList>

          <TabsContent value="meals" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Meal History</h2>
              <button className="text-sm text-primary hover:underline">
                Add New Meal
              </button>
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

          <TabsContent value="weight" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Weight Progress</h2>
              <button className="text-sm text-primary hover:underline">
                Log Weight
              </button>
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

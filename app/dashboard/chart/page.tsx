"use client";

import { DashboardHeaderWithActions } from "@/components/dashboard-header-with-actions";
import {
  Activity,
  Calendar,
  Target,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Demo data for different timeframes
const chartDatasets = {
  "7days": [
    { date: "2024-11-10", calories: 1900, weight: 76.6, target: 70.0 },
    { date: "2024-11-11", calories: 2050, weight: 76.3, target: 70.0 },
    { date: "2024-11-12", calories: 2300, weight: 76.2, target: 70.0 },
    { date: "2024-11-13", calories: 1800, weight: 75.8, target: 70.0 },
    { date: "2024-11-14", calories: 2150, weight: 75.5, target: 70.0 },
    { date: "2024-11-15", calories: 2000, weight: 75.2, target: 70.0 },
    { date: "2024-11-16", calories: 1950, weight: 74.9, target: 70.0 },
  ],
  "30days": [
    { date: "2024-10-18", calories: 2300, weight: 79.5, target: 70.0 },
    { date: "2024-10-21", calories: 2100, weight: 79.2, target: 70.0 },
    { date: "2024-10-24", calories: 2050, weight: 78.9, target: 70.0 },
    { date: "2024-10-27", calories: 2200, weight: 78.6, target: 70.0 },
    { date: "2024-10-30", calories: 1900, weight: 78.3, target: 70.0 },
    { date: "2024-11-02", calories: 2150, weight: 78.0, target: 70.0 },
    { date: "2024-11-05", calories: 2000, weight: 77.6, target: 70.0 },
    { date: "2024-11-08", calories: 1950, weight: 77.1, target: 70.0 },
    { date: "2024-11-11", calories: 2100, weight: 76.3, target: 70.0 },
    { date: "2024-11-14", calories: 2050, weight: 75.5, target: 70.0 },
    { date: "2024-11-16", calories: 1950, weight: 74.9, target: 70.0 },
  ],
  "90days": [
    { date: "2024-08-18", calories: 2500, weight: 82.5, target: 70.0 },
    { date: "2024-08-28", calories: 2400, weight: 82.1, target: 70.0 },
    { date: "2024-09-07", calories: 2350, weight: 81.6, target: 70.0 },
    { date: "2024-09-17", calories: 2250, weight: 81.0, target: 70.0 },
    { date: "2024-09-27", calories: 2200, weight: 80.3, target: 70.0 },
    { date: "2024-10-07", calories: 2150, weight: 79.8, target: 70.0 },
    { date: "2024-10-17", calories: 2100, weight: 79.2, target: 70.0 },
    { date: "2024-10-27", calories: 2050, weight: 78.6, target: 70.0 },
    { date: "2024-11-06", calories: 2000, weight: 77.7, target: 70.0 },
    { date: "2024-11-16", calories: 1950, weight: 74.9, target: 70.0 },
  ],
  "1year": [
    { date: "2023-12-16", calories: 2600, weight: 85.0, target: 70.0 },
    { date: "2024-01-16", calories: 2550, weight: 84.2, target: 70.0 },
    { date: "2024-02-16", calories: 2500, weight: 83.5, target: 70.0 },
    { date: "2024-03-16", calories: 2450, weight: 82.8, target: 70.0 },
    { date: "2024-04-16", calories: 2400, weight: 82.0, target: 70.0 },
    { date: "2024-05-16", calories: 2350, weight: 81.2, target: 70.0 },
    { date: "2024-06-16", calories: 2300, weight: 80.5, target: 70.0 },
    { date: "2024-07-16", calories: 2250, weight: 79.8, target: 70.0 },
    { date: "2024-08-16", calories: 2200, weight: 79.0, target: 70.0 },
    { date: "2024-09-16", calories: 2150, weight: 78.2, target: 70.0 },
    { date: "2024-10-16", calories: 2100, weight: 77.0, target: 70.0 },
    { date: "2024-11-16", calories: 1950, weight: 74.9, target: 70.0 },
  ],
};

const timeframeLabels = {
  "7days": "Last 7 Days",
  "30days": "Last 30 Days",
  "90days": "Last 90 Days",
  "1year": "Last Year",
};

const combinedChartConfig = {
  weight: {
    label: "Current Weight (kg)",
    color: "hsl(var(--chart-1))",
  },
  target: {
    label: "Target Weight (kg)",
    color: "hsl(var(--chart-2))",
  },
  calories: {
    label: "Daily Calories",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig;

export default function ChartPage() {
  const [selectedTimeframe, setSelectedTimeframe] =
    useState<keyof typeof chartDatasets>("7days");

  // Get current dataset
  const chartData = chartDatasets[selectedTimeframe];

  // Calculate trends
  const latestWeight = chartData[chartData.length - 1].weight;
  const earliestWeight = chartData[0].weight;
  const weightChange = latestWeight - earliestWeight;
  const avgCalories = Math.round(
    chartData.reduce(
      (sum: number, day: { calories: number }) => sum + day.calories,
      0
    ) / chartData.length
  );
  const targetWeight = chartData[0].target;
  const weightToGo = latestWeight - targetWeight;

  return (
    <div className="h-full flex flex-col">
      {/* Header - fixed */}
      <div className="px-4 py-3 border-b bg-background/95 backdrop-blur">
        <DashboardHeaderWithActions 
          title="Analytics" 
          description="Progress insights and trends"
          actions={
            <>
              <Calendar className="h-3 w-3 text-muted-foreground" />
              <Select
                value={selectedTimeframe}
                onValueChange={(value: keyof typeof chartDatasets) =>
                  setSelectedTimeframe(value)
                }
              >
                <SelectTrigger className="w-24 h-7 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(timeframeLabels).map(([key, label]) => (
                    <SelectItem key={key} value={key} className="text-xs">
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </>
          }
        />
      </div>

      {/* Content - scrollable */}
      <div className="flex-1 overflow-auto p-4 space-y-4">

        {/* Summary Cards */}
        <div className="grid gap-3 grid-cols-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 px-3 pt-3">
              <CardTitle className="text-xs font-medium">
                Current
              </CardTitle>
              <Activity className="h-3 w-3 text-muted-foreground" />
            </CardHeader>
            <CardContent className="pb-2 px-3">
              <div className="text-lg font-bold">{latestWeight} kg</div>
              <p className="text-xs text-muted-foreground">
                {weightChange < 0 ? (
                  <span className="text-green-600 flex items-center gap-1">
                    <TrendingDown className="h-2 w-2" />
                    {Math.abs(weightChange).toFixed(1)} kg ↓
                  </span>
                ) : (
                  <span className="text-red-600 flex items-center gap-1">
                    <TrendingUp className="h-2 w-2" />
                    {weightChange.toFixed(1)} kg ↑
                  </span>
                )}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 px-3 pt-3">
              <CardTitle className="text-xs font-medium">
                Target
              </CardTitle>
              <Target className="h-3 w-3 text-muted-foreground" />
            </CardHeader>
            <CardContent className="pb-2 px-3">
              <div className="text-lg font-bold">{targetWeight} kg</div>
              <p className="text-xs text-muted-foreground">
                {weightToGo > 0
                  ? `${weightToGo.toFixed(1)} kg to go`
                  : "Target reached!"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 px-3 pt-3">
              <CardTitle className="text-xs font-medium">
                Avg Calories
              </CardTitle>
              <Activity className="h-3 w-3 text-muted-foreground" />
            </CardHeader>
            <CardContent className="pb-2 px-3">
              <div className="text-lg font-bold">{avgCalories}</div>
              <p className="text-xs text-muted-foreground">
                daily average
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 px-3 pt-3">
              <CardTitle className="text-xs font-medium">Progress</CardTitle>
              <TrendingDown className="h-3 w-3 text-muted-foreground" />
            </CardHeader>
            <CardContent className="pb-2 px-3">
              <div className="text-lg font-bold">
                {Math.round(
                  ((earliestWeight - latestWeight) /
                    (earliestWeight - targetWeight)) *
                    100
                )}
                %
              </div>
              <p className="text-xs text-muted-foreground">
                to target
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Combined Progress Chart */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">
              Progress Overview
            </CardTitle>
            <CardDescription className="text-xs">
              Weight & calories for {timeframeLabels[selectedTimeframe].toLowerCase()}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-3">
            <ChartContainer config={combinedChartConfig} className="h-52 w-full">
              <LineChart
                accessibilityLayer
                data={chartData}
                margin={{
                  left: 8,
                  right: 8,
                  top: 8,
                  bottom: 8,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={4}
                  fontSize={10}
                  height={40}
                  interval="preserveStartEnd"
                  tickFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                />
                <YAxis
                  yAxisId="weight"
                  orientation="left"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={4}
                  width={35}
                  domain={["dataMin - 2", "dataMax + 1"]}
                  fontSize={10}
                />
                <YAxis
                  yAxisId="calories"
                  orientation="right"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={4}
                  width={40}
                  domain={[1500, 2500]}
                  fontSize={10}
                />
                <ChartTooltip cursor={true} content={<ChartTooltipContent />} />

                {/* Target Weight Line (Dashed) */}
                <Line
                  yAxisId="weight"
                  type="monotone"
                  dataKey="target"
                  stroke="#ef4444"
                  strokeWidth={2}
                  strokeDasharray="8 4"
                  dot={false}
                  activeDot={{ r: 4, fill: "#ef4444" }}
                />

                {/* Current Weight Line */}
                <Line
                  yAxisId="weight"
                  type="monotone"
                  dataKey="weight"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ r: 4, fill: "#3b82f6" }}
                  activeDot={{ r: 6, fill: "#3b82f6" }}
                />

                {/* Calories Line */}
                <Line
                  yAxisId="calories"
                  type="monotone"
                  dataKey="calories"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={{ r: 3, fill: "#10b981" }}
                  activeDot={{ r: 5, fill: "#10b981" }}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
          <CardFooter>
            <div className="flex w-full items-start gap-4 text-sm">
              <div className="grid gap-2">
                <div className="flex items-center gap-2 font-medium leading-none">
                  Weight {weightChange < 0 ? "trending down" : "trending up"} by{" "}
                  {Math.abs(weightChange).toFixed(1)} kg
                  {weightChange < 0 ? (
                    <TrendingDown className="h-4 w-4" />
                  ) : (
                    <TrendingUp className="h-4 w-4" />
                  )}
                </div>
                <div className="leading-none text-muted-foreground">
                  {weightToGo > 0
                    ? `${weightToGo.toFixed(1)} kg to target`
                    : "Target weight reached!"}{" "}
                  • Avg {avgCalories} cal/day
                </div>
              </div>
              <div className="ml-auto flex items-center gap-4 text-xs">
                <div className="flex items-center gap-2">
                  <div
                    className="h-2 w-4 rounded"
                    style={{ backgroundColor: "#3b82f6" }}
                  ></div>
                  <span>Current Weight</span>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className="h-2 w-4 border-2 border-dashed rounded"
                    style={{ borderColor: "#ef4444" }}
                  ></div>
                  <span>Target Weight</span>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className="h-2 w-4 rounded"
                    style={{ backgroundColor: "#10b981" }}
                  ></div>
                  <span>Daily Calories</span>
                </div>
              </div>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

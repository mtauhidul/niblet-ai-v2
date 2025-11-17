"use client";

import { format, isAfter, startOfDay, subDays, subYears } from "date-fns";
import {
  Activity,
  Calendar,
  Target,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { useMemo, useState } from "react";
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
import { useAuth } from "@/contexts/AuthContext";
import { useUserData } from "@/contexts/UserContext";

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
    useState<keyof typeof timeframeLabels>("7days");
  const { userProfile } = useAuth();
  const { mealLogs, weightLogs } = useUserData();

  // Process data based on selected timeframe
  const chartData = useMemo(() => {
    if (!mealLogs.length && !weightLogs.length) return [];

    const now = new Date();
    let startDate: Date;

    switch (selectedTimeframe) {
      case "7days":
        startDate = subDays(now, 7);
        break;
      case "30days":
        startDate = subDays(now, 30);
        break;
      case "90days":
        startDate = subDays(now, 90);
        break;
      case "1year":
        startDate = subYears(now, 1);
        break;
      default:
        startDate = subDays(now, 7);
    }

    // Group data by date
    const dateMap = new Map<
      string,
      { weight?: number; calories: number; target: number }
    >();

    // Process weight logs
    weightLogs
      .filter((log) => isAfter(new Date(log.recordedAt), startDate))
      .forEach((log) => {
        const dateKey = format(
          startOfDay(new Date(log.recordedAt)),
          "yyyy-MM-dd"
        );
        const existing = dateMap.get(dateKey) || {
          calories: 0,
          target: userProfile?.targetWeight || 70,
        };
        dateMap.set(dateKey, { ...existing, weight: log.weight });
      });

    // Process meal logs (aggregate calories by date)
    mealLogs
      .filter((log) => isAfter(new Date(log.consumedAt), startDate))
      .forEach((log) => {
        const dateKey = format(
          startOfDay(new Date(log.consumedAt)),
          "yyyy-MM-dd"
        );
        const existing = dateMap.get(dateKey) || {
          calories: 0,
          target: userProfile?.targetWeight || 70,
        };
        dateMap.set(dateKey, {
          ...existing,
          calories: existing.calories + log.calories,
        });
      });

    // Convert to array and sort by date
    return Array.from(dateMap.entries())
      .map(([date, data]) => ({ date, ...data }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [mealLogs, weightLogs, selectedTimeframe, userProfile?.targetWeight]);

  // Calculate trends
  const latestWeight =
    chartData.length > 0 ? chartData[chartData.length - 1]?.weight : undefined;
  const earliestWeight =
    chartData.length > 0 ? chartData[0]?.weight : undefined;
  const weightChange =
    latestWeight && earliestWeight ? latestWeight - earliestWeight : 0;
  const avgCalories =
    chartData.length > 0
      ? Math.round(
          chartData.reduce(
            (sum: number, day: { calories: number }) => sum + day.calories,
            0
          ) / chartData.length
        )
      : 0;
  const targetWeight = userProfile?.targetWeight || 70;
  const weightToGo = latestWeight ? latestWeight - targetWeight : 0;

  return (
    <div className="h-full flex flex-col">
      {/* Header - fixed and mobile responsive */}
      <div className="px-3 sm:px-4 py-3 border-b bg-background/95 backdrop-blur">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h1 className="text-lg font-semibold">Analytics</h1>
            <p className="text-xs text-muted-foreground">
              Progress insights and trends
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-3 w-3 text-muted-foreground" />
            <Select
              value={selectedTimeframe}
              onValueChange={(value: keyof typeof timeframeLabels) =>
                setSelectedTimeframe(value)
              }
            >
              <SelectTrigger className="w-32 sm:w-32 h-7 text-xs">
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
          </div>
        </div>
      </div>

      {/* Content - scrollable */}
      <div className="flex-1 overflow-auto p-3 sm:p-4 space-y-3 sm:space-y-4">
        {/* Summary Cards - Responsive grid */}
        <div className="grid gap-2 sm:gap-3 grid-cols-2 sm:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 px-2 sm:px-3 pt-2 sm:pt-3">
              <CardTitle className="text-xs font-medium">Current</CardTitle>
              <Activity className="h-3 w-3 text-muted-foreground" />
            </CardHeader>
            <CardContent className="pb-2 px-2 sm:px-3">
              <div className="text-sm sm:text-lg font-bold">
                {latestWeight || "--"} kg
              </div>
              <p className="text-xs text-muted-foreground">
                {weightChange < 0 ? (
                  <span className="text-green-600 flex items-center gap-1">
                    <TrendingDown className="h-2 w-2" />
                    {Math.abs(weightChange).toFixed(1)} kg ↓
                  </span>
                ) : weightChange > 0 ? (
                  <span className="text-red-600 flex items-center gap-1">
                    <TrendingUp className="h-2 w-2" />
                    {weightChange.toFixed(1)} kg ↑
                  </span>
                ) : (
                  <span className="text-muted-foreground">No change</span>
                )}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 px-2 sm:px-3 pt-2 sm:pt-3">
              <CardTitle className="text-xs font-medium">Target</CardTitle>
              <Target className="h-3 w-3 text-muted-foreground" />
            </CardHeader>
            <CardContent className="pb-2 px-2 sm:px-3">
              <div className="text-sm sm:text-lg font-bold">
                {targetWeight} kg
              </div>
              <p className="text-xs text-muted-foreground">
                {weightToGo > 0
                  ? `${weightToGo.toFixed(1)} kg to go`
                  : "Target reached!"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 px-2 sm:px-3 pt-2 sm:pt-3">
              <CardTitle className="text-xs font-medium">
                Avg Calories
              </CardTitle>
              <Activity className="h-3 w-3 text-muted-foreground" />
            </CardHeader>
            <CardContent className="pb-2 px-2 sm:px-3">
              <div className="text-sm sm:text-lg font-bold">
                {avgCalories || 0}
              </div>
              <p className="text-xs text-muted-foreground">daily average</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 px-2 sm:px-3 pt-2 sm:pt-3">
              <CardTitle className="text-xs font-medium">Progress</CardTitle>
              <TrendingDown className="h-3 w-3 text-muted-foreground" />
            </CardHeader>
            <CardContent className="pb-2 px-2 sm:px-3">
              <div className="text-sm sm:text-lg font-bold">
                {earliestWeight && latestWeight && targetWeight
                  ? Math.round(
                      ((earliestWeight - latestWeight) /
                        (earliestWeight - targetWeight)) *
                        100
                    )
                  : 0}
                %
              </div>
              <p className="text-xs text-muted-foreground">to target</p>
            </CardContent>
          </Card>
        </div>

        {/* Combined Progress Chart */}
        <Card>
          <CardHeader className="pb-2 sm:pb-3 px-3 sm:px-6 pt-3 sm:pt-6">
            <CardTitle className="text-sm sm:text-base">
              Progress Overview
            </CardTitle>
            <CardDescription className="text-xs">
              Weight & calories for{" "}
              {timeframeLabels[
                selectedTimeframe as keyof typeof timeframeLabels
              ].toLowerCase()}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-2 sm:p-3">
            {chartData.length > 0 ? (
              <ChartContainer
                config={combinedChartConfig}
                className="h-48 sm:h-64 w-full"
              >
                <LineChart
                  accessibilityLayer
                  data={chartData}
                  margin={{
                    left: 4,
                    right: 4,
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
                    fontSize={9}
                    height={30}
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
                    tickMargin={2}
                    width={30}
                    domain={["dataMin - 2", "dataMax + 1"]}
                    fontSize={9}
                  />
                  <YAxis
                    yAxisId="calories"
                    orientation="right"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={2}
                    width={35}
                    domain={[0, "dataMax + 500"]}
                    fontSize={9}
                  />
                  <ChartTooltip
                    cursor={true}
                    content={<ChartTooltipContent />}
                  />

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
                    connectNulls={false}
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
                    connectNulls={false}
                  />
                </LineChart>
              </ChartContainer>
            ) : (
              <div className="h-48 sm:h-64 flex items-center justify-center bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  No data available for selected timeframe
                </p>
              </div>
            )}
          </CardContent>
          <CardFooter className="px-3 sm:px-6 pb-3 sm:pb-6">
            <div className="w-full space-y-3">
              {/* Summary text */}
              <div className="space-y-1">
                <div className="flex items-center gap-2 font-medium leading-none text-sm">
                  {weightChange !== 0 ? (
                    <>
                      Weight{" "}
                      {weightChange < 0 ? "trending down" : "trending up"} by{" "}
                      {Math.abs(weightChange).toFixed(1)} kg
                      {weightChange < 0 ? (
                        <TrendingDown className="h-4 w-4" />
                      ) : (
                        <TrendingUp className="h-4 w-4" />
                      )}
                    </>
                  ) : (
                    "Weight stable"
                  )}
                </div>
                <div className="leading-none text-muted-foreground text-xs">
                  {weightToGo > 0
                    ? `${weightToGo.toFixed(1)} kg to target`
                    : "Target weight reached!"}{" "}
                  • Avg {avgCalories || 0} cal/day
                </div>
              </div>

              {/* Legend - responsive layout */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 text-xs">
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

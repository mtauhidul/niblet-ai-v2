"use client";

import { format, isAfter, startOfDay, subDays, subYears } from "date-fns";
import { Activity, Target, TrendingDown, TrendingUp } from "lucide-react";
import { useMemo, useState } from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
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

const weightChartConfig = {
  weight: {
    label: "Current Weight (kg)",
    color: "#CAFF66",
  },
  target: {
    label: "Target Weight (kg)",
    color: "#6B7280",
  },
} satisfies ChartConfig;

const calorieChartConfig = {
  calories: {
    label: "Daily Calories",
    color: "#C8A8FF",
  },
  goal: {
    label: "Calorie Goal",
    color: "#FFE5A8",
  },
} satisfies ChartConfig;

export default function ChartPage() {
  const [selectedTimeframe, setSelectedTimeframe] =
    useState<keyof typeof timeframeLabels>("7days");
  const { userProfile } = useAuth();
  const { mealLogs, weightLogs } = useUserData();

  // Process weight data
  const weightData = useMemo(() => {
    if (!weightLogs.length) return [];

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

    return weightLogs
      .filter((log) => isAfter(new Date(log.recordedAt), startDate))
      .map((log) => ({
        date: format(startOfDay(new Date(log.recordedAt)), "yyyy-MM-dd"),
        weight: log.weight,
        target: userProfile?.targetWeight || 70,
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [weightLogs, selectedTimeframe, userProfile?.targetWeight]);

  // Process calorie data
  const calorieData = useMemo(() => {
    if (!mealLogs.length) return [];

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

    // Group by date and sum calories
    const dateMap = new Map<string, number>();
    
    mealLogs
      .filter((log) => isAfter(new Date(log.consumedAt), startDate))
      .forEach((log) => {
        const dateKey = format(startOfDay(new Date(log.consumedAt)), "yyyy-MM-dd");
        const existing = dateMap.get(dateKey) || 0;
        dateMap.set(dateKey, existing + log.calories);
      });

    return Array.from(dateMap.entries())
      .map(([date, calories]) => ({
        date,
        calories,
        goal: userProfile?.targetCalories || 2000,
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [mealLogs, selectedTimeframe, userProfile?.targetCalories]);

  // Calculate weight trends
  const latestWeight = weightData.length > 0 ? weightData[weightData.length - 1]?.weight : undefined;
  const earliestWeight = weightData.length > 0 ? weightData[0]?.weight : undefined;
  const weightChange = latestWeight && earliestWeight ? latestWeight - earliestWeight : 0;
  
  // Calculate weight change rate (kg per week)
  const weightChangeRate = (() => {
    if (!weightData.length || weightData.length < 2) return 0;
    const daysBetween = Math.abs(
      new Date(weightData[weightData.length - 1].date).getTime() - 
      new Date(weightData[0].date).getTime()
    ) / (1000 * 60 * 60 * 24);
    const weeks = daysBetween / 7;
    return weeks > 0 ? weightChange / weeks : 0;
  })();
  
  // Calculate average calories
  const avgCalories = calorieData.length > 0
    ? Math.round(calorieData.reduce((sum, day) => sum + day.calories, 0) / calorieData.length)
    : 0;
  
  // Calculate calorie goal and surplus/deficit
  const calorieGoal = userProfile?.targetCalories || 0;
  const calorieDeficitOrSurplus = calorieGoal > 0 ? avgCalories - calorieGoal : 0;
  
  // Calculate streak (consecutive days with meals logged)
  const streak = (() => {
    if (!calorieData.length) return 0;
    let count = 0;
    const now = new Date();
    for (let i = 0; i < 30; i++) {
      const checkDate = format(subDays(now, i), "yyyy-MM-dd");
      if (calorieData.some(d => d.date === checkDate)) {
        count++;
      } else {
        break;
      }
    }
    return count;
  })();
  
  const targetWeight = userProfile?.targetWeight || 70;
  const weightToGo = latestWeight ? latestWeight - targetWeight : 0;
  
  // Calculate progress percentage
  const progressPercent = (() => {
    if (!userProfile?.targetWeight || !userProfile?.currentWeight) return 0;
    const currentWeight = latestWeight || userProfile.currentWeight;
    const startWeight = earliestWeight || userProfile.currentWeight;
    const targetWeight = userProfile.targetWeight;
    if (Math.abs(startWeight - targetWeight) < 0.1) return 100;
    const progress = ((startWeight - currentWeight) / (startWeight - targetWeight)) * 100;
    return Math.max(0, Math.min(100, Math.round(progress)));
  })();

  // Calculate average macros from meal logs
  const avgMacros = useMemo(() => {
    if (!mealLogs.length) return { protein: 0, carbs: 0, fat: 0 };
    
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

    const filteredLogs = mealLogs.filter((log) => 
      isAfter(new Date(log.consumedAt), startDate)
    );

    if (!filteredLogs.length) return { protein: 0, carbs: 0, fat: 0 };

    const totalProtein = filteredLogs.reduce((sum, log) => sum + log.protein, 0);
    const totalCarbs = filteredLogs.reduce((sum, log) => sum + log.carbohydrates, 0);
    const totalFat = filteredLogs.reduce((sum, log) => sum + log.fat, 0);

    const daysCount = calorieData.length || 1;

    return {
      protein: Math.round(totalProtein / daysCount),
      carbs: Math.round(totalCarbs / daysCount),
      fat: Math.round(totalFat / daysCount),
    };
  }, [mealLogs, selectedTimeframe, calorieData.length]);

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="px-3 py-3 border-b border-white/5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-base font-semibold text-white">Analytics</h1>
          </div>
          <Select
            value={selectedTimeframe}
            onValueChange={(value: keyof typeof timeframeLabels) =>
              setSelectedTimeframe(value)
            }
          >
            <SelectTrigger className="w-30 h-8 text-xs bg-white/5 border-white/10 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-black/95 border-white/10">
              {Object.entries(timeframeLabels).map(([key, label]) => (
                <SelectItem
                  key={key}
                  value={key}
                  className="text-xs text-white focus:bg-white/10 focus:text-white"
                >
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Content - scrollable */}
      <div className="flex-1 overflow-auto p-3 space-y-3">
        {/* Getting Started Card - Show when no data */}
        {weightData.length === 0 && calorieData.length === 0 && (
          <Card className="border-dashed border-2 border-white/10 bg-transparent">
            <CardContent className="pt-6">
              <div className="text-center space-y-3">
                <div className="mx-auto w-12 h-12 bg-[#CAFF66]/10 rounded-full flex items-center justify-center">
                  <Activity className="h-6 w-6 text-[#CAFF66]" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-white">
                    Start Tracking
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">
                    Log meals and weight to see analytics
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Summary Cards - Improved with insights */}
        <div className="grid gap-2 grid-cols-2">
          {/* Current Weight */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 px-3 pt-2.5">
              <CardTitle className="text-[10px] font-medium text-gray-400 uppercase tracking-wide">
                Current Weight
              </CardTitle>
              <Activity className="h-3 w-3 text-[#CAFF66]" />
            </CardHeader>
            <CardContent className="pb-2 px-3">
              <div className="text-xl font-bold text-white">
                {latestWeight
                  ? `${latestWeight}`
                  : userProfile?.currentWeight
                  ? `${userProfile.currentWeight}`
                  : "--"}
                <span className="text-sm text-gray-400 ml-0.5">kg</span>
              </div>
              <p className="text-[9px] text-gray-500">
                {weightChangeRate !== 0 ? (
                  weightChangeRate < 0 ? (
                    <span className="text-[#CAFF66] flex items-center gap-0.5">
                      <TrendingDown className="h-2.5 w-2.5" />
                      {Math.abs(weightChangeRate).toFixed(2)}kg/week
                    </span>
                  ) : (
                    <span className="text-[#FFE5A8] flex items-center gap-0.5">
                      <TrendingUp className="h-2.5 w-2.5" />
                      {weightChangeRate.toFixed(2)}kg/week
                    </span>
                  )
                ) : (
                  <span>No change</span>
                )}
              </p>
            </CardContent>
          </Card>

          {/* Progress to Goal */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 px-3 pt-2.5">
              <CardTitle className="text-[10px] font-medium text-gray-400 uppercase tracking-wide">
                Progress
              </CardTitle>
              <Target className="h-3 w-3 text-[#FFE5A8]" />
            </CardHeader>
            <CardContent className="pb-2 px-3">
              <div className="text-xl font-bold text-white">
                {progressPercent > 0 ? progressPercent : "--"}
                <span className="text-sm text-gray-400">%</span>
              </div>
              <p className="text-[9px] text-gray-500">
                {Math.abs(weightToGo) > 0.1 ? (
                  <span>{Math.abs(weightToGo).toFixed(1)}kg to go</span>
                ) : progressPercent > 0 ? (
                  <span className="text-[#CAFF66]">Goal reached! 🎉</span>
                ) : (
                  <span>Set goal to track</span>
                )}
              </p>
            </CardContent>
          </Card>

          {/* Average Calories with Goal Comparison */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 px-3 pt-2.5">
              <CardTitle className="text-[10px] font-medium text-gray-400 uppercase tracking-wide">
                Daily Calories
              </CardTitle>
              <Activity className="h-3 w-3 text-[#C8A8FF]" />
            </CardHeader>
            <CardContent className="pb-2 px-3">
              <div className="text-xl font-bold text-white">
                {avgCalories > 0 ? avgCalories : "--"}
                {calorieGoal > 0 && (
                  <span className="text-xs text-gray-400 ml-1">
                    / {calorieGoal}
                  </span>
                )}
              </div>
              <p className="text-[9px] text-gray-500">
                {calorieGoal > 0 && avgCalories > 0 ? (
                  calorieDeficitOrSurplus > 0 ? (
                    <span className="text-[#FFE5A8]">
                      +{calorieDeficitOrSurplus} over goal
                    </span>
                  ) : calorieDeficitOrSurplus < 0 ? (
                    <span className="text-[#CAFF66]">
                      {Math.abs(calorieDeficitOrSurplus)} under goal
                    </span>
                  ) : (
                    <span className="text-[#CAFF66]">On target! 🎯</span>
                  )
                ) : (
                  <span>Daily average</span>
                )}
              </p>
            </CardContent>
          </Card>

          {/* Logging Streak */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 px-3 pt-2.5">
              <CardTitle className="text-[10px] font-medium text-gray-400 uppercase tracking-wide">
                Streak
              </CardTitle>
              <TrendingUp className="h-3 w-3 text-[#CAFF66]" />
            </CardHeader>
            <CardContent className="pb-2 px-3">
              <div className="text-xl font-bold text-white">
                {streak}
                <span className="text-sm text-gray-400 ml-0.5">days</span>
              </div>
              <p className="text-[9px] text-gray-500">
                {streak >= 7 ? (
                  <span className="text-[#CAFF66]">Keep it up! 🔥</span>
                ) : streak > 0 ? (
                  <span>Logging consistently</span>
                ) : (
                  <span>Start logging today</span>
                )}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Weight Progress Chart */}
        {weightData.length > 0 && (
          <Card>
            <CardHeader className="pb-2 px-3 pt-3">
              <CardTitle className="text-sm">Weight Progress</CardTitle>
              <CardDescription className="text-xs">
                {weightChange < 0
                  ? `Down ${Math.abs(weightChange).toFixed(1)}kg this period`
                  : weightChange > 0
                  ? `Up ${weightChange.toFixed(1)}kg this period`
                  : "Weight stable"}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-2">
              <ChartContainer
                config={weightChartConfig}
                className="h-40 sm:h-48 w-full"
              >
                <LineChart
                  accessibilityLayer
                  data={weightData}
                  margin={{
                    left: 4,
                    right: 4,
                    top: 8,
                    bottom: 8,
                  }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255,255,255,0.1)"
                  />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={4}
                    fontSize={9}
                    height={30}
                    interval="preserveStartEnd"
                    stroke="#6B7280"
                    tickFormatter={(value) => {
                      return new Date(value).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      });
                    }}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickMargin={2}
                    width={30}
                    domain={["dataMin - 2", "dataMax + 1"]}
                    fontSize={9}
                    stroke="#6B7280"
                  />
                  <ChartTooltip
                    cursor={true}
                    content={<ChartTooltipContent />}
                  />

                  {/* Target Weight Line (Dashed) */}
                  <Line
                    type="monotone"
                    dataKey="target"
                    stroke="#6B7280"
                    strokeWidth={2}
                    strokeDasharray="8 4"
                    dot={false}
                    activeDot={{ r: 4, fill: "#6B7280" }}
                  />

                  {/* Current Weight Line */}
                  <Line
                    type="monotone"
                    dataKey="weight"
                    stroke="#CAFF66"
                    strokeWidth={3}
                    dot={{ r: 4, fill: "#CAFF66" }}
                    activeDot={{ r: 6, fill: "#CAFF66" }}
                    connectNulls={false}
                  />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>
        )}

        {/* Calorie Tracking Chart */}
        {calorieData.length > 0 && (
          <Card>
            <CardHeader className="pb-2 px-3 pt-3">
              <CardTitle className="text-sm">Calorie Tracking</CardTitle>
              <CardDescription className="text-xs">
                {calorieGoal > 0
                  ? calorieDeficitOrSurplus > 0
                    ? `Avg ${calorieDeficitOrSurplus} cal over goal`
                    : calorieDeficitOrSurplus < 0
                    ? `Avg ${Math.abs(calorieDeficitOrSurplus)} cal under goal`
                    : "On target!"
                  : "Your daily calorie intake"}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-2">
              <ChartContainer
                config={calorieChartConfig}
                className="h-40 sm:h-48 w-full"
              >
                <LineChart
                  accessibilityLayer
                  data={calorieData}
                  margin={{
                    left: 4,
                    right: 4,
                    top: 8,
                    bottom: 8,
                  }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255,255,255,0.1)"
                  />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={4}
                    fontSize={9}
                    height={30}
                    interval="preserveStartEnd"
                    stroke="#6B7280"
                    tickFormatter={(value) => {
                      return new Date(value).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      });
                    }}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickMargin={2}
                    width={35}
                    domain={[0, "dataMax + 500"]}
                    fontSize={9}
                    stroke="#6B7280"
                  />
                  <ChartTooltip
                    cursor={true}
                    content={<ChartTooltipContent />}
                  />

                  {/* Goal Line (Dashed) */}
                  {calorieGoal > 0 && (
                    <Line
                      type="monotone"
                      dataKey="goal"
                      stroke="#FFE5A8"
                      strokeWidth={2}
                      strokeDasharray="8 4"
                      dot={false}
                      activeDot={{ r: 4, fill: "#FFE5A8" }}
                    />
                  )}

                  {/* Actual Calories */}
                  <Line
                    type="monotone"
                    dataKey="calories"
                    stroke="#C8A8FF"
                    strokeWidth={3}
                    dot={{ r: 4, fill: "#C8A8FF" }}
                    activeDot={{ r: 6, fill: "#C8A8FF" }}
                    connectNulls={false}
                  />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>
        )}

        {/* Macro Breakdown */}
        {calorieData.length > 0 && (
          <Card>
            <CardHeader className="pb-2 px-3 pt-3">
              <CardTitle className="text-sm">Daily Macro Breakdown</CardTitle>
              <CardDescription className="text-xs">
                Average macronutrient distribution
              </CardDescription>
            </CardHeader>
            <CardContent className="p-3 space-y-3">
              {/* Protein */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400">Protein</span>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-medium">{avgMacros.protein}g</span>
                    {userProfile?.targetProtein && (
                      <span className="text-gray-500">
                        / {userProfile.targetProtein}g
                      </span>
                    )}
                  </div>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#CAFF66] rounded-full transition-all"
                    style={{
                      width: userProfile?.targetProtein
                        ? `${Math.min(100, (avgMacros.protein / userProfile.targetProtein) * 100)}%`
                        : "100%",
                    }}
                  />
                </div>
              </div>

              {/* Carbs */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400">Carbs</span>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-medium">{avgMacros.carbs}g</span>
                    {userProfile?.targetCarbs && (
                      <span className="text-gray-500">
                        / {userProfile.targetCarbs}g
                      </span>
                    )}
                  </div>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#C8A8FF] rounded-full transition-all"
                    style={{
                      width: userProfile?.targetCarbs
                        ? `${Math.min(100, (avgMacros.carbs / userProfile.targetCarbs) * 100)}%`
                        : "100%",
                    }}
                  />
                </div>
              </div>

              {/* Fat */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400">Fat</span>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-medium">{avgMacros.fat}g</span>
                    {userProfile?.targetFat && (
                      <span className="text-gray-500">
                        / {userProfile.targetFat}g
                      </span>
                    )}
                  </div>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#FFE5A8] rounded-full transition-all"
                    style={{
                      width: userProfile?.targetFat
                        ? `${Math.min(100, (avgMacros.fat / userProfile.targetFat) * 100)}%`
                        : "100%",
                    }}
                  />
                </div>
              </div>

              {/* Summary */}
              <div className="pt-2 border-t border-white/10">
                <p className="text-xs text-gray-400 text-center">
                  {userProfile?.targetProtein && userProfile?.targetCarbs && userProfile?.targetFat ? (
                    <>
                      {avgMacros.protein >= userProfile.targetProtein &&
                      avgMacros.carbs <= userProfile.targetCarbs &&
                      avgMacros.fat <= userProfile.targetFat ? (
                        <span className="text-[#CAFF66]">Great macro balance! 💪</span>
                      ) : avgMacros.protein < userProfile.targetProtein ? (
                        <span className="text-[#FFE5A8]">Try to increase protein intake</span>
                      ) : (
                        <span>Track your macros consistently</span>
                      )}
                    </>
                  ) : (
                    <span>Set macro goals in your profile</span>
                  )}
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

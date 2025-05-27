"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { api } from "@/lib/api/client";
import { toast } from "sonner";
import { AuthDialog } from "@/components/auth-dialog";
import { isAuthenticated } from "@/lib/api/auth";
import { CHART_TOPICS } from "@/lib/constants/charts";
import { Question } from "@/lib/types";

// Define types for chart topics based on the constants
export type ChartTopic = keyof typeof CHART_TOPICS;

interface ChartDataPoint {
  option: string;
  count: number;
  percentage: number;
}

// Map of topic keys to user-friendly labels
const TOPIC_LABELS: Record<ChartTopic, string> = {
  LearnCode: "Learning Resources",
  Language: "Programming Languages",
  Database: "Databases",
  Webframe: "Web Frameworks",
  OpSys: "Operating Systems",
  AI: "AI & Machine Learning",
};

interface AnalysisTabProps {
  questions: Question[];
  answers: Record<number, string[]>;
}

export default function AnalysisTab({ questions, answers }: AnalysisTabProps) {
  const [selectedTopic, setSelectedTopic] = useState<ChartTopic>("LearnCode");
  const [chartData, setChartData] = useState<
    Record<string, [string, number][]>
  >({});
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(
    isAuthenticated()
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChartData = async () => {
      if (!isUserAuthenticated) {
        setIsAuthOpen(true);
        return;
      }

      // Validate topic before making API call
      if (!Object.keys(CHART_TOPICS).includes(selectedTopic)) {
        setError(`Invalid topic: ${selectedTopic}`);
        toast.error(`Invalid topic: ${selectedTopic}`);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        console.log("[DEBUG] Fetching chart data for topic:", selectedTopic);
        const data = await api.survey.getChartData(selectedTopic);
        console.log("[DEBUG] Received chart data:", data);
        setChartData(data);
      } catch (error: any) {
        console.error("[DEBUG] Failed to fetch chart data:", error);
        setError(error.message || "Failed to fetch analysis data");
        toast.error(error.message || "Failed to fetch analysis data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchChartData();
  }, [selectedTopic, isUserAuthenticated]);

  const formatChartData = (data: [string, number][]): ChartDataPoint[] => {
    return data.map(([option, value]) => ({
      option,
      count: value,
      percentage: value,
    }));
  };

  const handleAuthentication = () => {
    setIsUserAuthenticated(true);
    setIsAuthOpen(false);
  };

  // Handle topic selection with validation
  const handleTopicChange = (value: string) => {
    if (Object.keys(CHART_TOPICS).includes(value)) {
      setSelectedTopic(value as ChartTopic);
    } else {
      toast.error(`Invalid topic selected: ${value}`);
    }
  };

  if (!isUserAuthenticated) {
    return (
      <>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-lg text-muted-foreground">
            Please sign in to view analysis data
          </div>
        </div>
        <AuthDialog
          isOpen={isAuthOpen}
          onClose={() => setIsAuthOpen(false)}
          onAuthenticate={handleAuthentication}
          initialMode="signin"
        />
      </>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-lg text-muted-foreground">Loading analysis...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-lg text-red-600">{error}</div>
      </div>
    );
  }

  // Get all chart data for the selected topic
  const topicData = Object.entries(chartData).map(([key, data]) => ({
    title: key,
    data: formatChartData(data),
  }));

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Analysis</h2>
        <Select value={selectedTopic} onValueChange={handleTopicChange}>
          <SelectTrigger className="w-[280px]">
            <SelectValue placeholder="Select a topic to analyze" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(TOPIC_LABELS).map(([key, label]) => (
              <SelectItem key={key} value={key}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {topicData.map(({ title, data }) => (
        <Card key={title} className="overflow-hidden">
          <CardHeader>
            <CardTitle className="text-lg">{title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[500px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={data}
                  margin={{ top: 20, right: 30, left: 20, bottom: 100 }}
                  layout="vertical"
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 100]} />
                  <YAxis
                    dataKey="option"
                    type="category"
                    width={250}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip
                    formatter={(value: number) => [
                      `${value.toFixed(2)}%`,
                      "Percentage",
                    ]}
                  />
                  <Bar dataKey="percentage" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {data.slice(0, 8).map((item, index) => (
                <div
                  key={index}
                  className="text-center p-3 bg-muted rounded-lg"
                >
                  <div className="font-semibold text-lg">
                    {item.percentage.toFixed(2)}%
                  </div>
                  <div
                    className="text-sm text-muted-foreground truncate"
                    title={item.option}
                  >
                    {item.option}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

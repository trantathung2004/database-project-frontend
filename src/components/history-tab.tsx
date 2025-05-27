"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  LockIcon,
  Trash2Icon,
  XCircleIcon,
  ClipboardIcon,
  PencilIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api/client";
import { toast } from "sonner";
import type { HistoryResponse } from "@/lib/api/client";
import { Question } from "@/lib/types";

interface HistoryTabProps {
  questions: Question[];
  answers: Record<number, string[]>;
  isCompleted: boolean;
}

export default function HistoryTab({
  questions,
  answers,
  isCompleted,
}: HistoryTabProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [historyData, setHistoryData] = useState<HistoryResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.survey.getHistory();
      console.log("[DEBUG] Raw history data:", data);

      if (data && data.length > 0) {
        setHistoryData(data[0]); // Get the first response since we only have one per user
      } else {
        setHistoryData(null);
      }
    } catch (error: any) {
      console.error("[DEBUG] History fetch error:", error);
      setError(error.message || "Failed to fetch history");
      toast.error(error.message || "Failed to fetch history");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete your survey response?")) {
      return;
    }

    setIsDeleting(true);
    try {
      await api.survey.delete();
      toast.success("Survey response deleted successfully");
      setHistoryData(null);
    } catch (error: any) {
      toast.error(error.message || "Failed to delete survey response");
    } finally {
      setIsDeleting(false);
    }
  };

  const goToQuestion = (index: number) => {
    setCurrentQuestionIndex(index);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-lg text-muted-foreground">Loading history...</div>
      </div>
    );
  }

  if (error || !historyData) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Card className="overflow-hidden">
          <CardContent className="p-6">
            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-muted rounded-full mx-auto flex items-center justify-center">
                {error ? (
                  <XCircleIcon className="h-10 w-10 text-muted-foreground" />
                ) : (
                  <ClipboardIcon className="h-10 w-10 text-muted-foreground" />
                )}
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-semibold">
                  {error ? "Error Loading History" : "No Survey Response Yet"}
                </h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  {error
                    ? "There was an error loading your survey history. Please try again later."
                    : "Complete the survey to see your responses here. Your answers help us understand developer preferences and trends."}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getAnswerForQuestion = (question: Question): string | null => {
    const value = historyData[question.qname as keyof HistoryResponse];
    return value !== undefined && value !== null ? String(value) : null;
  };

  const answeredQuestionsCount = questions.reduce((count, question) => {
    return getAnswerForQuestion(question) !== null ? count + 1 : count;
  }, 0);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex flex-wrap gap-2">
          {questions.map((question, index) => {
            const isAnswered = getAnswerForQuestion(question) !== null;
            const isCurrent = index === currentQuestionIndex;

            return (
              <Button
                key={index}
                variant={isCurrent ? "default" : "outline"}
                size="sm"
                onClick={() => goToQuestion(index)}
                className={cn(
                  "min-w-[40px]",
                  isAnswered &&
                    !isCurrent &&
                    "bg-green-100 border-green-300 text-green-800 hover:bg-green-200"
                )}
              >
                {index + 1}
              </Button>
            );
          })}
        </div>
        <Button
          variant="destructive"
          size="sm"
          onClick={handleDelete}
          disabled={isDeleting}
        >
          <Trash2Icon className="h-4 w-4 mr-2" />
          {isDeleting ? "Deleting..." : "Delete Response"}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            Question {currentQuestionIndex + 1} of {questions.length}
          </CardTitle>
          <p className="text-xl font-medium">{currentQuestion.question}</p>
        </CardHeader>
        <CardContent className="space-y-4">
          {(() => {
            const answer = getAnswerForQuestion(currentQuestion);
            if (answer) {
              return (
                <div className="flex items-center justify-between p-3 rounded-lg border bg-blue-50 border-blue-200">
                  <span className="font-medium text-sm text-blue-900">
                    {answer}
                  </span>
                  <Badge
                    variant="secondary"
                    className="bg-blue-100 text-blue-800"
                  >
                    Your Answer
                  </Badge>
                </div>
              );
            }
            return (
              <div className="text-center py-8 text-muted-foreground">
                <p>No answer provided for this question</p>
              </div>
            );
          })()}
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={prevQuestion}
          disabled={currentQuestionIndex === 0}
        >
          Previous
        </Button>

        <div className="text-sm text-muted-foreground flex items-center">
          Viewing history: {answeredQuestionsCount} / {questions.length}{" "}
          answered
        </div>

        <Button
          variant="outline"
          onClick={nextQuestion}
          disabled={currentQuestionIndex === questions.length - 1}
        >
          Next
        </Button>
      </div>
    </div>
  );
}

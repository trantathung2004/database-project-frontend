"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";
import { countries } from "@/lib/countries";
import { api } from "@/lib/api/client";
import type { SurveyData } from "@/lib/api/client";
import { toast } from "sonner";

interface Question {
  id: number;
  question: string;
  qname: string;
  options: string[];
}

interface SurveyTabProps {
  questions: Question[];
  answers: Record<number, string[]>;
  onAnswer: (questionId: number, answer: string[]) => void;
}

export default function SurveyTab({
  questions,
  answers,
  onAnswer,
}: SurveyTabProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const currentQuestion = questions[currentQuestionIndex];
  const [countryOpen, setCountryOpen] = useState(false);

  const handleSingleAnswer = (value: string) => {
    onAnswer(currentQuestion.id, [value]);
  };

  const handleTextAnswer = (value: string) => {
    onAnswer(currentQuestion.id, [value]);
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

  const handleSubmit = async () => {
    // Log all questions and their answers for debugging
    console.log(
      "All questions:",
      questions.map((q) => ({
        id: q.id,
        qname: q.qname,
        answer: answers[q.id]?.[0],
      }))
    );

    // Check if all questions are answered
    const unansweredQuestions = questions.filter(
      (q) => !answers[q.id] || answers[q.id].length === 0
    );

    if (unansweredQuestions.length > 0) {
      console.log("Unanswered questions:", unansweredQuestions);
      toast.error("Please answer all questions before submitting");
      return;
    }

    setIsSubmitting(true);

    try {
      // Find the questions for required fields (case-insensitive search)
      const ageQuestion = questions.find(
        (q) => q.qname.toLowerCase() === "age"
      );
      const countryQuestion = questions.find(
        (q) => q.qname.toLowerCase() === "country"
      );
      const edLevelQuestion = questions.find(
        (q) => q.qname.toLowerCase() === "edlevel"
      );
      const employmentQuestion = questions.find(
        (q) => q.qname.toLowerCase() === "employment"
      );
      const mainBranchQuestion = questions.find(
        (q) => q.qname.toLowerCase() === "mainbranch"
      );

      console.log("Required field questions:", {
        ageQuestion,
        countryQuestion,
        edLevelQuestion,
        employmentQuestion,
        mainBranchQuestion,
      });

      if (
        !ageQuestion ||
        !countryQuestion ||
        !edLevelQuestion ||
        !employmentQuestion ||
        !mainBranchQuestion
      ) {
        console.error("Missing required question fields:", {
          age: !ageQuestion,
          country: !countryQuestion,
          edLevel: !edLevelQuestion,
          employment: !employmentQuestion,
          mainBranch: !mainBranchQuestion,
        });
        toast.error("Survey configuration error: Missing required questions");
        return;
      }

      // Initialize with actual answers if questions are found
      const surveyData: SurveyData = {
        // Required fields
        Age: answers[ageQuestion.id]?.[0] || "",
        Country: answers[countryQuestion.id]?.[0] || "",
        EdLevel: answers[edLevelQuestion.id]?.[0] || "",
        Employment: answers[employmentQuestion.id]?.[0] || "",
        MainBranch: answers[mainBranchQuestion.id]?.[0] || "",
      };

      // Add optional fields
      questions.forEach((question) => {
        const answer = answers[question.id]?.[0] || "";
        const qname = question.qname;

        // Skip required fields as they're already handled
        if (
          ["Age", "Country", "EdLevel", "Employment", "MainBranch"].includes(
            qname
          )
        ) {
          return;
        }

        // Handle fields with special mapping
        switch (qname) {
          case "LanguageHaveWorkedWith":
            surveyData.LanguageHaveWorkedWith = answer || undefined;
            break;
          case "LanguageWantToWorkWith":
            surveyData.LanguageWantToWorkWith = answer || undefined;
            break;
          case "DatabaseHaveWorkedWith":
            surveyData.DatabaseHaveWorkedWith = answer || undefined;
            break;
          case "DatabaseWantToWorkWith":
            surveyData.DatabaseWantToWorkWith = answer || undefined;
            break;
          case "WebframeHaveWorkedWith":
            surveyData.WebframeHaveWorkedWith = answer || undefined;
            break;
          case "WebframeWantToWorkWith":
            surveyData.WebframeWantToWorkWith = answer || undefined;
            break;
          case "LearnCode":
            surveyData.LearnCode = answer || undefined;
            break;
          case "LearnCodeOnline":
            surveyData.LearnCodeOnline = answer || undefined;
            break;
          case "AISelect":
            surveyData.AISelect = answer || undefined;
            break;
          case "AIThreat":
            surveyData.AIThreat = answer || undefined;
            break;
          case "AIToolCurrentlyUsing":
            surveyData.AIToolCurrentlyUsing = answer || undefined;
            break;
          case "OpSysPersonalUse":
            surveyData.OpSysPersonalUse = answer || undefined;
            break;
          case "OpSysProfessionalUse":
            surveyData.OpSysProfessionalUse = answer || undefined;
            break;
        }
      });

      console.log("Final survey data:", surveyData);

      // Check each required field individually for better error messages
      const missingFields = [];
      if (!surveyData.Age) missingFields.push("Age");
      if (!surveyData.Country) missingFields.push("Country");
      if (!surveyData.EdLevel) missingFields.push("EdLevel");
      if (!surveyData.Employment) missingFields.push("Employment");
      if (!surveyData.MainBranch) missingFields.push("MainBranch");

      if (missingFields.length > 0) {
        console.log("Missing fields:", missingFields);
        toast.error(`Missing required fields: ${missingFields.join(", ")}`);
        return;
      }

      // First, check if the user has a submission by trying to get their history
      try {
        const history = await api.survey.getHistory();
        const hasExistingSubmission = history && history.length > 0;

        if (hasExistingSubmission) {
          // Update each answer individually
          await Promise.all(
            Object.entries(surveyData).map(async ([qname, answer]) => {
              if (answer) {
                try {
                  await api.survey.update(qname, answer);
                } catch (error: any) {
                  console.error(`Failed to update ${qname}:`, error);
                  throw error;
                }
              }
            })
          );
          toast.success("Survey updated successfully!");
        } else {
          // Submit new survey
          await api.survey.submit(surveyData);
          localStorage.setItem("has_submitted", "true");
          toast.success("Survey submitted successfully!");
        }
      } catch (error: any) {
        // If we get a 404 or any other error when checking history, assume no submission exists
        if (error.status === 404 || !localStorage.getItem("has_submitted")) {
          await api.survey.submit(surveyData);
          localStorage.setItem("has_submitted", "true");
          toast.success("Survey submitted successfully!");
        } else {
          throw error;
        }
      }
    } catch (error: any) {
      console.error("Survey submission error:", error);
      toast.error(error.message || "Failed to submit survey");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!currentQuestion) return null;

  return (
    <div className="space-y-8">
      {/* Add question navigation buttons */}
      <div className="flex justify-between items-center">
        <div className="flex flex-wrap gap-2">
          {questions.map((question, index) => {
            const isAnswered = answers[question.id]?.length > 0;
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
        <div className="text-sm text-muted-foreground">
          {Object.keys(answers).length} / {questions.length} answered
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            Question {currentQuestionIndex + 1} of {questions.length}
          </CardTitle>
          <p className="text-xl font-medium">{currentQuestion.question}</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {currentQuestion.id === 5 ? (
              <div className="space-y-2">
                <Label htmlFor="country-select">Select your country:</Label>
                <Popover open={countryOpen} onOpenChange={setCountryOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={countryOpen}
                      className="w-full max-w-md justify-between"
                    >
                      {answers[currentQuestion.id]?.[0] || "Select country..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full max-w-md p-0">
                    <Command>
                      <CommandInput
                        placeholder="Search country..."
                        className="h-9"
                      />
                      <CommandList className="max-h-[300px] overflow-y-auto">
                        <CommandEmpty>No country found.</CommandEmpty>
                        <CommandGroup>
                          {countries.map((country) => (
                            <CommandItem
                              key={country}
                              value={country}
                              onSelect={(currentValue) => {
                                handleSingleAnswer(currentValue);
                                setCountryOpen(false);
                              }}
                              className="cursor-pointer py-3 px-4 hover:bg-accent hover:text-accent-foreground data-[selected]:bg-accent data-[selected]:text-accent-foreground"
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4 flex-shrink-0",
                                  answers[currentQuestion.id]?.[0] === country
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              <span className="flex-1">{country}</span>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
            ) : (
              <RadioGroup
                value={answers[currentQuestion.id]?.[0] || ""}
                onValueChange={handleSingleAnswer}
              >
                <div className="space-y-2">
                  {currentQuestion.options.map((option) => (
                    <div key={option} className="flex items-center space-x-2">
                      <RadioGroupItem value={option} id={option} />
                      <Label htmlFor={option}>{option}</Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            )}
          </div>
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

        {currentQuestionIndex === questions.length - 1 ? (
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Survey"}
          </Button>
        ) : (
          <Button onClick={nextQuestion}>Next</Button>
        )}
      </div>
    </div>
  );
}

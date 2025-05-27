"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { countries } from "@/lib/countries";
import { Question } from "@/lib/types";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { BarChart3, FileText, History, LogOut, ClipboardList } from "lucide-react";
import SurveyTab from "@/components/survey-tab";
import AnalysisTab from "@/components/analysis-tab";
import HistoryTab from "@/components/history-tab";
import AuditLogsTab from "@/components/audit-logs-tab";

const surveyQuestions: Question[] = [
  {
    id: 1,
    question:
      'Which of the following options best describes you today? For the purpose of this survey, a developer is "someone who writes code".',
    qname: "MainBranch",
    options: [
      "I am a developer by profession",
      "I am learning to code",
      "I code primarily as a hobby",
      "I am not primarily a developer, but I write code sometimes as part of my work/studies",
      "I used to be a developer by profession, but no longer am",
    ],
  },
  {
    id: 2,
    question: "What is your age?",
    qname: "Age",
    options: [
      "Under 18 years old",
      "18-24 years old",
      "25-34 years old",
      "35-44 years old",
      "45-54 years old",
      "55-64 years old",
      "65 years or older",
      "Prefer not to say",
    ],
  },
  {
    id: 3,
    question:
      "Which of the following best describes your current employment status?",
    qname: "Employment",
    options: [
      "Employed, full-time",
      "Employed, part-time",
      "Student, full-time",
      "Student, part-time",
      "Independent contractor, freelancer, or self-employed",
      "Not employed, but looking for work",
      "Not employed, and not looking for work",
      "Retired",
      "I prefer not to say",
    ],
  },
  {
    id: 4,
    question:
      "Which of the following best describes the highest level of formal education that you've completed?",
    qname: "EdLevel",
    options: [
      "Primary/elementary school",
      "Secondary school (e.g. American high school, German Realschule or Gymnasium, etc.)",
      "Some college/university study without earning a degree",
      "Associate degree (A.A., A.S., etc.)",
      "Bachelor's degree (B.A., B.S., B.Eng., etc.)",
      "Master's degree (M.A., M.S., M.Eng., MBA, etc.)",
      "Professional degree (JD, MD, Ph.D, Ed.D, etc.)",
      "Something else",
    ],
  },
  {
    id: 5,
    question: "Where do you live?",
    qname: "Country",
    options: countries,
  },
  {
    id: 6,
    question: "Do you currently use AI tools in your development process?",
    qname: "AISelect",
    options: ["Yes", "No, but I plan to soon", "No, and I don't plan to"],
  },
  {
    id: 7,
    question: "What is AI Tool Currently Using?",
    qname: "AIToolCurrentlyUsing",
    options: [
      "Learning about a codebase",
      "Project planning",
      "Writing code",
      "Documenting code",
      "Debugging and getting help",
      "Deployment and monitoring",
      "Search for answers",
      "Generating content or synthetic data",
      "Testing code",
      "Committing and reviewing code",
      "Predictive analytics",
    ],
  },
  {
    id: 8,
    question: "Do you believe AI is a threat to your current job?",
    qname: "AIThreat",
    options: ["Yes", "No", "I'm not sure"],
  },
  {
    id: 9,
    question: "How do you learn to code?",
    qname: "LearnCode",
    options: [
      "Books / Physical media",
      "Colleague",
      "On the job training",
      "Other online resources (e.g., videos, blogs, forum, online community)",
      "School (i.e., University, College, etc)",
      "Online Courses or Certification",
      "Coding Bootcamp",
      "Friend or family member",
      "Other (please specify):",
    ],
  },
  {
    id: 10,
    question: "What online resources do you use to learn to code?",
    qname: "LearnCodeOnline",
    options: [
      "Technical documentation",
      "Blogs",
      "Books",
      "Written Tutorials",
      "Stack Overflow",
      "Coding sessions (live or recorded)",
      "Social Media",
      "How-to videos",
      "Interactive tutorial",
      "Video-based Online Courses",
      "Written-based Online Courses",
      "AI",
      "Certification videos",
      "Online challenges (e.g., daily or weekly coding challenges)",
      "Programming Games",
      "Auditory material (e.g., podcasts)",
      "Other (Please specify):",
    ],
  },
  {
    id: 11,
    question: "What Languages Have You Worked With?",
    qname: "LanguageHaveWorkedWith",
    options: [
      "JavaScript",
      "Python",
      "TypeScript",
      "Java",
      "C#",
      "HTML/CSS",
      "SQL",
      "Bash/Shell (all shells)",
      "C++",
      "C",
      "PHP",
      "Go",
      "Rust",
      "Kotlin",
      "Swift",
      "Ruby",
      "PowerShell",
      "Dart",
      "Scala",
      "R",
      "Lua",
      "VBA",
      "Visual Basic (.Net)",
      "F#",
      "Clojure",
      "Perl",
      "MATLAB",
      "Assembly",
      "Fortran",
      "Julia",
      "Crystal",
      "Lisp",
      "Prolog",
      "Haskell",
      "Ada",
      "Elixir",
      "Erlang",
      "Groovy",
      "Zig",
      "GDScript",
      "MicroPython",
      "Objective-C",
      "Cobol",
      "Nim",
      "Apex",
      "Solidity",
      "Zephyr",
      "Delphi",
      "OCaml",
    ],
  },
  {
    id: 12,
    question: "What Languages Do You Want To Work With?",
    qname: "LanguageWantToWorkWith",
    options: [
      "Python",
      "JavaScript",
      "TypeScript",
      "Go",
      "Rust",
      "Java",
      "Kotlin",
      "C#",
      "Swift",
      "HTML/CSS",
      "SQL",
      "C++",
      "Bash/Shell (all shells)",
      "Ruby",
      "Crystal",
      "Lua",
      "R",
      "PowerShell",
      "C",
      "PHP",
      "Dart",
      "F#",
      "Clojure",
      "Julia",
      "Scala",
      "Zig",
      "Assembly",
      "Solidity",
      "Elixir",
      "Cobol",
      "Fortran",
      "Delphi",
      "OCaml",
      "Lisp",
      "Haskell",
      "Perl",
      "Erlang",
      "Groovy",
      "Visual Basic (.Net)",
      "GDScript",
      "MATLAB",
      "Prolog",
      "Objective-C",
      "Nim",
      "Apex",
      "MicroPython",
      "Zephyr",
      "Ada",
      "VBA",
    ],
  },
  {
    id: 13,
    question: "What Databases Have You Worked With?",
    qname: "DatabaseHaveWorkedWith",
    options: [
      "PostgreSQL",
      "MySQL",
      "SQLite",
      "MongoDB",
      "Redis",
      "Microsoft SQL Server",
      "Firebase Realtime Database",
      "Elasticsearch",
      "Oracle",
      "DynamoDB",
      "MariaDB",
      "Cloud Firestore",
      "Supabase",
      "Microsoft Access",
      "Snowflake",
      "Presto",
      "Databricks SQL",
      "DuckDB",
      "Cassandra",
      "H2",
      "Neo4J",
      "Cosmos DB",
      "BigQuery",
      "Firebird",
      "Clickhouse",
      "InfluxDB",
      "IBM DB2",
      "Solr",
      "EventStoreDB",
      "RavenDB",
      "Couch DB",
      "Cockroachdb",
      "Couchbase",
      "TiDB",
      "Datomic",
    ],
  },
  {
    id: 14,
    question: "What Databases Do You Want To Work With?",
    qname: "DatabaseWantToWorkWith",
    options: [
      "PostgreSQL",
      "MongoDB",
      "Redis",
      "MySQL",
      "SQLite",
      "Firebase Realtime Database",
      "Cloud Firestore",
      "Supabase",
      "Elasticsearch",
      "Microsoft SQL Server",
      "Oracle",
      "MariaDB",
      "Presto",
      "DynamoDB",
      "Cosmos DB",
      "Microsoft Access",
      "DuckDB",
      "Cassandra",
      "Clickhouse",
      "H2",
      "Neo4J",
      "Cockroachdb",
      "Couch DB",
      "RavenDB",
      "BigQuery",
      "Databricks SQL",
      "Firebird",
      "Snowflake",
      "Datomic",
      "IBM DB2",
      "InfluxDB",
      "EventStoreDB",
      "Couchbase",
      "Solr",
      "TiDB",
    ],
  },
  {
    id: 15,
    question: "What Web Frameworks Have You Worked With?",
    qname: "WebframeHaveWorkedWith",
    options: [
      "React",
      "Node.js",
      "Express",
      "Next.js",
      "jQuery",
      "Angular",
      "Vue.js",
      "ASP.NET CORE",
      "Django",
      "Flask",
      "Spring Boot",
      "Laravel",
      "Ruby on Rails",
      "FastAPI",
      "ASP.NET",
      "WordPress",
      "NestJS",
      "Blazor",
      "AngularJS",
      "CodeIgniter",
      "Fastify",
      "Solid.js",
      "Htmx",
      "Deno",
      "Phoenix",
      "Remix",
      "Svelte",
      "Symfony",
      "Play Framework",
      "Drupal",
      "Elm",
      "Gatsby",
      "Nuxt.js",
      "Strapi",
      "Yii 2",
      "Astro",
    ],
  },
  {
    id: 16,
    question: "What Web Frameworks Do You Want To Work With?",
    qname: "WebframeWantToWorkWith",
    options: [
      "React",
      "Next.js",
      "Node.js",
      "Express",
      "Vue.js",
      "Angular",
      "Django",
      "Svelte",
      "Remix",
      "Htmx",
      "ASP.NET CORE",
      "FastAPI",
      "Laravel",
      "Deno",
      "Solid.js",
      "Flask",
      "Spring Boot",
      "Astro",
      "Nuxt.js",
      "Phoenix",
      "jQuery",
      "Ruby on Rails",
      "ASP.NET",
      "Blazor",
      "WordPress",
      "AngularJS",
      "CodeIgniter",
      "Fastify",
      "NestJS",
      "Symfony",
      "Drupal",
      "Strapi",
      "Elm",
      "Play Framework",
      "Gatsby",
      "Yii 2",
    ],
  },
  {
    id: 17,
    question: "What Operating Systems Do You Use for Personal Use?",
    qname: "OpSysPersonalUse",
    options: [
      "Windows",
      "MacOS",
      "Ubuntu",
      "Other Linux-based",
      "Windows Subsystem for Linux (WSL)",
      "Android",
      "iOS",
      "iPadOS",
      "Debian",
      "Arch",
      "Fedora",
      "Red Hat",
      "ChromeOS",
      "BSD",
      "Cygwin",
      "Solaris",
      "AIX",
      "Haiku",
      "Other (please specify):",
    ],
  },
  {
    id: 18,
    question: "What Operating Systems Do You Use for Professional Use?",
    qname: "OpSysProfessionalUse",
    options: [
      "Windows",
      "MacOS",
      "Ubuntu",
      "Other Linux-based",
      "Windows Subsystem for Linux (WSL)",
      "Debian",
      "Red Hat",
      "Arch",
      "Fedora",
      "iOS",
      "iPadOS",
      "Android",
      "BSD",
      "Cygwin",
      "ChromeOS",
      "AIX",
      "Solaris",
      "Haiku",
    ],
  },
];

export function useQuestions() {
  const [answers, setAnswers] = useState<Record<number, string[]>>({});
  const [isCompleted, setIsCompleted] = useState(false);

  const handleAnswer = (questionId: number, answer: string[]) => {
    setAnswers((prev) => {
      const newAnswers = {
        ...prev,
        [questionId]: answer,
      };
      // Update isCompleted based on current answers
      setIsCompleted(Object.keys(newAnswers).length === surveyQuestions.length);
      return newAnswers;
    });
  };

  return {
    questions: surveyQuestions,
    answers,
    handleAnswer,
    isCompleted,
  };
}

export default function SurveyApp() {
  const [activeTab, setActiveTab] = useState("survey");
  const { answers, handleAnswer, isCompleted } = useQuestions();

  const handleSignOut = () => {
    window.location.reload();
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar>
          <SidebarHeader className="p-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-6 w-6 text-blue-600" />
              <span className="font-semibold">Survey Analysis</span>
            </div>
          </SidebarHeader>
          <SidebarContent className="p-2">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => setActiveTab("survey")}
                  isActive={activeTab === "survey"}
                >
                  <FileText className="h-4 w-4" />
                  <span>Survey</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => setActiveTab("analysis")}
                  isActive={activeTab === "analysis"}
                >
                  <BarChart3 className="h-4 w-4" />
                  <span>Analysis</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => setActiveTab("history")}
                  isActive={activeTab === "history"}
                >
                  <History className="h-4 w-4" />
                  <span>History</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => setActiveTab("logs")}
                  isActive={activeTab === "logs"}
                >
                  <ClipboardList className="h-4 w-4" />
                  <span>Audit Logs</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>

            <div className="mt-auto p-4">
              <Button
                variant="outline"
                className="w-full"
                onClick={handleSignOut}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </SidebarContent>
        </Sidebar>

        <main className="flex-1">
          <header className="bg-white p-4">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <h1 className="text-xl font-semibold">
                {activeTab === "survey" && "Developer Survey"}
                {activeTab === "analysis" && "Survey Analysis"}
                {activeTab === "history" && "Your Survey History"}
                {activeTab === "logs" && "Audit Logs"}
              </h1>
            </div>
          </header>

          <div className="p-6">
            {activeTab === "survey" && (
              <SurveyTab
                questions={surveyQuestions}
                answers={answers}
                onAnswer={handleAnswer}
              />
            )}
            {activeTab === "analysis" && (
              <AnalysisTab questions={surveyQuestions} answers={answers} />
            )}
            {activeTab === "history" && (
              <HistoryTab
                questions={surveyQuestions}
                answers={answers}
                isCompleted={isCompleted}
              />
            )}
            {activeTab === "logs" && <AuditLogsTab />}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}

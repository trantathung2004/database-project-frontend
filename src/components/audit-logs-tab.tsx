"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ClipboardList, XCircle, Lock } from "lucide-react";
import { api } from "@/lib/api/client";
import { toast } from "sonner";
import { format, parseISO } from "date-fns";
import { cn } from "@/lib/utils";

interface AuditLog {
  log_id: number;
  response_id: number;
  user_id: number;
  action_type: string;
  action_timestamp: string;
  old_value: string | null;
  new_value: string | null;
  question_id: number;
  username: string;
  question_name: string;
}

export default function AuditLogsTab() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUnauthorized, setIsUnauthorized] = useState(false);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    setIsLoading(true);
    setError(null);
    setIsUnauthorized(false);
    try {
      const data = await api.survey.getAuditLogs();
      console.log("[DEBUG] Raw audit logs data:", data);
      setLogs(data);
    } catch (error: any) {
      console.error("[DEBUG] Audit logs fetch error:", error);
      if (error.message?.includes("403") || error.message?.includes("Only administrators")) {
        setIsUnauthorized(true);
        setError("Only administrators can view audit logs");
      } else {
        setError(error.message || "Failed to fetch audit logs");
      }
      toast.error(error.message || "Failed to fetch audit logs");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-lg text-muted-foreground">Loading audit logs...</div>
      </div>
    );
  }

  if (error || logs.length === 0) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Card className="overflow-hidden">
          <CardContent className="p-6">
            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-muted rounded-full mx-auto flex items-center justify-center">
                {isUnauthorized ? (
                  <Lock className="h-10 w-10 text-muted-foreground" />
                ) : error ? (
                  <XCircle className="h-10 w-10 text-muted-foreground" />
                ) : (
                  <ClipboardList className="h-10 w-10 text-muted-foreground" />
                )}
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-semibold">
                  {isUnauthorized 
                    ? "Access Denied" 
                    : error 
                      ? "Error Loading Audit Logs" 
                      : "No Audit Logs Found"}
                </h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  {isUnauthorized
                    ? "Only administrators can view audit logs. Please contact your administrator for access."
                    : error
                      ? "There was an error loading the audit logs. Please try again later."
                      : "No audit logs have been recorded yet."}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {logs.map((log) => (
        <Card key={log.log_id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">
                {log.question_name}
              </CardTitle>
              <Badge
                variant="secondary"
                className={cn(
                  "ml-2",
                  log.action_type === "UPDATE" && "bg-blue-100 text-blue-800",
                  log.action_type === "DELETE" && "bg-red-100 text-red-800",
                  log.action_type === "INSERT" && "bg-green-100 text-green-800"
                )}
              >
                {log.action_type}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              {format(new Date(log.action_timestamp.replace(" ", "T")), "PPpp")}
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">User:</span>
              <span className="font-medium">{log.username}</span>
            </div>
            {log.old_value && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Old Value:</span>
                <span className="font-medium">{log.old_value}</span>
              </div>
            )}
            {log.new_value && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">New Value:</span>
                <span className="font-medium">{log.new_value}</span>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
} 
"use client";

import { getAuthHeaders, setToken, removeToken } from "./auth";

interface LoginCredentials {
  username: string;
  password: string;
}

interface RegisterCredentials extends LoginCredentials {}

export interface SurveyData {
  // Required fields
  Age: string;
  Country: string;
  EdLevel: string;
  Employment: string;
  MainBranch: string;

  // Optional fields
  LanguageHaveWorkedWith?: string;
  LanguageWantToWorkWith?: string;
  DatabaseHaveWorkedWith?: string;
  DatabaseWantToWorkWith?: string;
  WebframeHaveWorkedWith?: string;
  WebframeWantToWorkWith?: string;
  LearnCode?: string;
  LearnCodeOnline?: string;
  AISelect?: string;
  AIThreat?: string;
  AIToolCurrentlyUsing?: string;
  OpSysPersonalUse?: string;
  OpSysProfessionalUse?: string;

  // Response fields (only in history)
  ResponseID?: number;
  UID?: number;
}

export interface HistoryResponse extends SurveyData {
  ResponseID: number;
  UID: number;
}

export interface AuditLog {
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

export const api = {
  auth: {
    register: async (credentials: RegisterCredentials) => {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Registration failed");
      }

      return response.json();
    },

    login: async (credentials: LoginCredentials) => {
      // Convert credentials to form data
      const formData = new FormData();
      formData.append("username", credentials.username);
      formData.append("password", credentials.password);
      formData.append("grant_type", "password");

      const response = await fetch("/api/auth/token", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Login failed");
      }

      const data = await response.json();
      setToken(data.access_token);
      return data;
    },

    logout: () => {
      removeToken();
    },

    checkStatus: async () => {
      const response = await fetch("/api/auth", {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to check auth status");
      }
      return response.json();
    },
  },

  survey: {
    submit: async (data: SurveyData) => {
      console.log("[DEBUG] Submitting survey data:", data);
      const response = await fetch("/api/upload", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to submit survey");
      }

      return response.json();
    },

    update: async (qname: string, newAnswer: string) => {
      console.log("[DEBUG] Updating answer:", { qname, newAnswer });
      const response = await fetch("/api/history/update", {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          qname,
          new_answer: newAnswer,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update answer");
      }

      return response.json();
    },

    delete: async () => {
      const response = await fetch("/api/history/delete", {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to delete submission");
      }

      return response.json();
    },

    getChartData: async (topic: string) => {
      const response = await fetch(`/api/charts/${topic}`, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to fetch chart data");
      }

      return response.json();
    },

    getHistory: async (): Promise<HistoryResponse[]> => {
      const response = await fetch("/api/history", {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to fetch history");
      }

      return response.json();
    },

    getAuditLogs: async (): Promise<AuditLog[]> => {
      const response = await fetch("/api/audit-logs", {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || errorData.message || "Failed to fetch audit logs");
      }

      return response.json();
    },
  },
};

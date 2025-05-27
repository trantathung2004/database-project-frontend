"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { BarChart3, Users, TrendingUp } from "lucide-react";
import SurveyApp from "@/lib/survey-questions";
import { AuthDialog } from "@/components/auth-dialog";
import { verifyAuth } from "@/lib/api/auth";

export default function LandingPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isValid = await verifyAuth();
        setIsAuthenticated(isValid);
      } catch (error) {
        console.error("Auth check failed:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleOpenAuth = (mode: "signin" | "signup") => {
    setAuthMode(mode);
    setIsAuthOpen(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <SurveyApp />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm fixed w-full z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">
              Stack Overflow Survey Analysis
            </h1>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => handleOpenAuth("signin")}>
              Sign In
            </Button>
            <Button variant="default" onClick={() => handleOpenAuth("signup")}>
              Sign Up
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 min-h-screen flex items-center justify-center">
        <div className="max-w-3xl mx-auto w-full pt-20">
          {/* Hero Section */}
          <div className="space-y-6 text-center">
            <h2 className="text-4xl font-bold text-gray-900 leading-tight">
              Participate in the Developer Survey <br />& Get instantly analyzed
              results
            </h2>
            <p className="text-xl text-gray-600">
              Share your insights as a developer and explore comprehensive
              analysis of the global developer community's trends, preferences,
              and technologies.
            </p>

            <div className="grid grid-cols-3 gap-4 pt-6">
              <div className="text-center">
                <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">50K+</div>
                <div className="text-sm text-gray-600">Participants</div>
              </div>
              <div className="text-center">
                <BarChart3 className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">25</div>
                <div className="text-sm text-gray-600">Questions</div>
              </div>
              <div className="text-center">
                <TrendingUp className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">
                  Real-time
                </div>
                <div className="text-sm text-gray-600">Analytics</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AuthDialog
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthenticate={() => setIsAuthenticated(true)}
        initialMode={authMode}
      />
    </div>
  );
}

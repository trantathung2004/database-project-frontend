import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api/client";
import { toast } from "sonner";
import { setToken } from "@/lib/api/auth";

interface AuthDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthenticate: () => void;
  initialMode?: "signin" | "signup";
}

export function AuthDialog({
  isOpen,
  onClose,
  onAuthenticate,
  initialMode = "signin",
}: AuthDialogProps) {
  const [mode, setMode] = useState<"signin" | "signup">(initialMode);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (mode === "signup") {
        await api.auth.register({ username, password });
        toast.success("Registration successful! Please sign in.");
        setMode("signin");
      } else {
        const response = await api.auth.login({ username, password });
        setToken(response.access_token);
        toast.success("Successfully signed in!");
        onAuthenticate();
        onClose();
      }
    } catch (error: any) {
      toast.error(
        error.message ||
          `Failed to ${mode === "signup" ? "register" : "sign in"}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setMode(mode === "signin" ? "signup" : "signin");
    setUsername("");
    setPassword("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "signin"
              ? "Sign in to your account"
              : "Create an account"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleAuth} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <Button type="submit" disabled={isLoading}>
              {isLoading
                ? "Loading..."
                : mode === "signin"
                ? "Sign in"
                : "Create account"}
            </Button>
            <Button type="button" variant="ghost" onClick={toggleMode}>
              {mode === "signin"
                ? "Don't have an account? Sign up"
                : "Already have an account? Sign in"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

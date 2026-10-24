"use client";

import React, { useState } from "react";
import { Shield, Lock, Eye, EyeOff, X, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (password: string) => Promise<{ success: boolean; error?: string }>;
  onSuccess: () => void;
}

export function AdminLoginModal({
  isOpen,
  onClose,
  onLogin,
  onSuccess,
}: AdminLoginModalProps) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setError("Παρακαλώ εισάγετε τον κωδικό διαχειριστή.");
      return;
    }

    setIsLoading(true);
    setError(null);

    const res = await onLogin(password);
    setIsLoading(false);

    if (res.success) {
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setPassword("");
        onSuccess();
        onClose();
      }, 800);
    } else {
      setError(res.error || "Λανθασμένος κωδικός πρόσβασης.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-background border border-border rounded-2xl shadow-2xl p-6 overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted/50 transition-colors"
        >
          <X className="size-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="size-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20 shrink-0">
            <Shield className="size-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-foreground">
              Σύνδεση Διαχειριστή (Admin)
            </h3>
            <p className="text-xs text-muted-foreground">
              Εισάγετε τον κωδικό για πρόσβαση στο Curation Studio.
            </p>
          </div>
        </div>

        {isSuccess ? (
          <div className="py-6 flex flex-col items-center justify-center gap-2 text-center text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="size-10 animate-in zoom-in" />
            <p className="font-bold text-sm">Επιτυχής ταυτοποίηση!</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">
                Κωδικός Πρόσβασης (Admin Secret)
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <input
                  id="admin-password-input"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="Εισαγωγή κωδικού..."
                  autoFocus
                  className="w-full pl-9 pr-10 py-2.5 text-sm rounded-xl border border-input bg-muted/30 focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-0.5"
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-2.5 rounded-xl bg-destructive/10 border border-destructive/20 text-xs text-destructive font-medium flex items-center gap-2 animate-in fade-in">
                <span>⚠️ {error}</span>
              </div>
            )}

            <div className="pt-2 flex items-center justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onClose}
                disabled={isLoading}
                className="rounded-xl"
              >
                Ακύρωση
              </Button>
              <Button
                id="admin-login-submit-btn"
                type="submit"
                size="sm"
                disabled={isLoading || !password.trim()}
                className="rounded-xl px-5"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="size-4 animate-spin mr-1.5" />
                    Επαλήθευση...
                  </>
                ) : (
                  "Είσοδος"
                )}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Shield, Lock, Eye, EyeOff, ArrowLeft, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AdminAuthGuardProps {
  title?: string;
  description?: string;
}

export function AdminAuthGuard({
  title = "Περιοχή Διαχειριστή (Admin Access)",
  description = "Απαιτείται σύνδεση διαχειριστή για πρόσβαση στον πίνακα ελέγχου, το QA Test Center και το εργαλείο Security Pentest.",
}: AdminAuthGuardProps) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setError("Παρακαλώ εισάγετε τον κωδικό διαχειριστή.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && data.success) {
        setIsSuccess(true);
        setTimeout(() => {
          // Refresh the current route so server components re-evaluate the session cookie
          router.refresh();
        }, 600);
      } else {
        setError(data.error || "Λανθασμένος κωδικός πρόσβασης.");
      }
    } catch {
      setError("Σφάλμα δικτύου. Παρακαλώ ελέγξτε τη σύνδεσή σας και δοκιμάστε ξανά.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-between text-foreground">
      {/* Top minimal header */}
      <div className="border-b bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Επιστροφή στην εφαρμογή (pioftina.gr)
          </Link>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Shield className="w-3.5 h-3.5 text-amber-500" />
            <span>Προστατευμένη Περιοχή</span>
          </div>
        </div>
      </div>

      {/* Main card */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-6 sm:p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="size-14 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center justify-center mx-auto shadow-inner">
              <Lock className="size-7" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-foreground">{title}</h1>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-sm mx-auto">
              {description}
            </p>
          </div>

          {isSuccess ? (
            <div className="py-8 flex flex-col items-center justify-center gap-3 text-center text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="size-12 animate-in zoom-in" />
              <div className="space-y-1">
                <p className="font-bold text-sm">Επιτυχής ταυτοποίηση!</p>
                <p className="text-xs text-muted-foreground">Φόρτωση πίνακα διαχείρισης...</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="admin-guard-password"
                  className="block text-xs font-semibold text-foreground mb-1.5"
                >
                  Κωδικός Πρόσβασης Διαχειριστή (Admin Secret)
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <input
                    id="admin-guard-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (error) setError(null);
                    }}
                    placeholder="Εισαγωγή secret key..."
                    autoFocus
                    required
                    className="w-full pl-10 pr-10 py-2.5 text-sm rounded-xl border border-input bg-muted/30 focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1 transition-colors"
                    aria-label={showPassword ? "Απόκρυψη κωδικού" : "Εμφάνιση κωδικού"}
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-xs text-destructive font-medium flex items-center gap-2 animate-in fade-in">
                  <AlertCircle className="size-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <Button
                id="admin-guard-submit-btn"
                type="submit"
                disabled={isLoading || !password.trim()}
                className="w-full rounded-xl py-2.5 font-semibold text-sm shadow-sm"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="size-4 animate-spin mr-2" />
                    Επαλήθευση κωδικού...
                  </>
                ) : (
                  "Ξεκλείδωμα Διαχείρισης"
                )}
              </Button>

              <div className="pt-2 text-center">
                <Link
                  href="/"
                  className="text-xs text-muted-foreground hover:text-foreground underline transition-colors"
                >
                  Επιστροφή στην αρχική σελίδα
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Footer minimal info */}
      <div className="py-4 text-center text-[11px] text-muted-foreground">
        <span>pioftina.gr &bull; Ασφαλές Σύστημα Διαχείρισης &bull; Session Exp: 24h</span>
      </div>
    </div>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import { Mail, Sparkles, CheckCircle2, Loader2, ArrowRight, ShieldCheck, Tag, Utensils, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NewsletterTopic } from "@/types/newsletter";

const LOCAL_STORAGE_KEY = "pioftina_newsletter_subscribed";
const LOCAL_STORAGE_EMAIL = "pioftina_newsletter_email";

interface NewsletterCardProps {
  source?: "footer" | "settings";
}

export function NewsletterCard({ source = "footer" }: NewsletterCardProps) {
  const [email, setEmail] = useState("");
  const [selectedTopics, setSelectedTopics] = useState<NewsletterTopic[]>([
    "deals",
    "recipes",
    "budget_tips",
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      const storedEmail = localStorage.getItem(LOCAL_STORAGE_EMAIL);
      if (stored === "true" && storedEmail) {
        setIsSubscribed(true);
        setEmail(storedEmail);
      }
    } catch (_) {}
  }, []);

  const toggleTopic = (topic: NewsletterTopic) => {
    setSelectedTopics((prev) =>
      prev.includes(topic)
        ? prev.length > 1
          ? prev.filter((t) => t !== topic)
          : prev
        : [...prev, topic]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) {
      setError("Παρακαλώ εισάγετε μια έγκυρη διεύθυνση email.");
      return;
    }

    if (email.trim().length > 255) {
      setError("Το email δεν μπορεί να υπερβαίνει τους 255 χαρακτήρες.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setMessage(null);

    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          topics: selectedTopics,
          source,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setIsSubscribed(true);
        setMessage(data.message || "Ευχαριστούμε για την εγγραφή σας!");
        try {
          localStorage.setItem(LOCAL_STORAGE_KEY, "true");
          localStorage.setItem(LOCAL_STORAGE_EMAIL, email.trim());
        } catch (_) {}
      } else {
        setError(data.error || "Αποτυχία εγγραφής. Παρακαλώ δοκιμάστε ξανά.");
      }
    } catch (_) {
      setError("Σφάλμα σύνδεσης με τον διακομιστή.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-card via-background to-primary/5 shadow-xl p-6 sm:p-8">
      {/* Background Accent Gradients */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 size-48 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-10 -ml-10 size-48 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

      <div className="relative max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-bold tracking-wide">
              <Sparkles className="size-3.5" />
              <span>ΕΝΗΜΕΡΩΣΕΙΣ &amp; ΠΡΟΣΦΟΡΕΣ</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black tracking-tight text-foreground font-heading">
              Μείνετε συντονισμένοι για νέα &amp; έξυπνες συνταγές
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-xl">
              Λάβετε εβδομαδιαία οικονομικά μενού, τις καλύτερες τιμές στα ελληνικά σούπερ μάρκετ (Σκλαβενίτης, ΑΒ, Lidl κ.α.) και συμβουλές αποταμίευσης απευθείας στο inbox σας.
            </p>
          </div>

          {isSubscribed && (
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-semibold shrink-0">
              <CheckCircle2 className="size-4" />
              <span>Είστε εγγεγραμμένος</span>
            </div>
          )}
        </div>

        {/* Topic Preference Pills */}
        <div className="space-y-2">
          <span className="text-xs font-semibold text-muted-foreground">
            Επιλέξτε τι σας ενδιαφέρει να λαμβάνετε:
          </span>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => toggleTopic("deals")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                selectedTopics.includes("deals")
                  ? "bg-primary/10 text-primary border-primary/40 shadow-xs"
                  : "bg-muted/40 text-muted-foreground border-border hover:border-primary/30"
              }`}
            >
              <Tag className="size-3.5" />
              <span>🏷️ Προσφορές Supermarket</span>
            </button>

            <button
              type="button"
              onClick={() => toggleTopic("recipes")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                selectedTopics.includes("recipes")
                  ? "bg-primary/10 text-primary border-primary/40 shadow-xs"
                  : "bg-muted/40 text-muted-foreground border-border hover:border-primary/30"
              }`}
            >
              <Utensils className="size-3.5" />
              <span>🍲 Οικονομικές Συνταγές</span>
            </button>

            <button
              type="button"
              onClick={() => toggleTopic("budget_tips")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                selectedTopics.includes("budget_tips")
                  ? "bg-primary/10 text-primary border-primary/40 shadow-xs"
                  : "bg-muted/40 text-muted-foreground border-border hover:border-primary/30"
              }`}
            >
              <Lightbulb className="size-3.5" />
              <span>💡 Tips Αποταμίευσης &amp; Bulk</span>
            </button>
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            <div className="relative flex-1">
              <label htmlFor="newsletter-email-input" className="sr-only">
                Διεύθυνση Email
              </label>
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" aria-hidden="true" />
              <input
                id="newsletter-email-input"
                name="email"
                type="email"
                autoComplete="email"
                maxLength={255}
                value={email}
                onChange={(e) => {
                  const val = e.target.value.slice(0, 255);
                  setEmail(val);
                  if (error) setError(null);
                }}
                placeholder="π.χ. maria.papadopoulou@example.gr"
                className="w-full pl-10 pr-4 py-3 text-sm bg-background border border-input rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary shadow-xs transition-all"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading || !email.trim()}
              className="py-3 px-6 h-auto font-bold rounded-2xl shadow-md shadow-primary/20 hover:shadow-lg transition-all"
            >
              {isLoading ? (
                <>
                  <Loader2 className="size-4 animate-spin mr-2" />
                  Εγγραφή...
                </>
              ) : isSubscribed ? (
                <>
                  Ενημέρωση
                  <ArrowRight className="size-4 ml-1.5" />
                </>
              ) : (
                <>
                  Εγγραφή στα Νέα
                  <ArrowRight className="size-4 ml-1.5" />
                </>
              )}
            </Button>
          </div>

          {/* Feedback Messages */}
          {error && (
            <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-xs text-destructive font-medium animate-in fade-in">
              ⚠️ {error}
            </div>
          )}

          {message && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-800 dark:text-emerald-300 font-medium flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
              <span>{message}</span>
            </div>
          )}

          {/* Privacy Footnote */}
          <div className="flex items-center gap-2 text-[11px] text-muted-foreground pt-1">
            <ShieldCheck className="size-3.5 text-primary shrink-0" />
            <span>
              Σεβόμαστε το απόρρητό σας. Κανένα spam, δυνατότητα διαγραφής ανά πάσα στιγμή με ένα κλικ.
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}

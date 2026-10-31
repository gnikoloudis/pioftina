import React from "react";
import Link from "next/link";
import {
  Shield,
  CheckCircle2,
  FileCheck,
  ChefHat,
  Layers,
  Terminal,
  Cpu,
  Lock,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Server,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminDashboardPage() {
  return (
    <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-indigo-500/10 to-transparent pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
              <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Συνδεδεμένος Διαχειριστής (Session Active)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Κονσόλα Διαχείρισης &amp; Ελέγχου
            </h1>
            <p className="text-slate-300 text-sm leading-relaxed">
              Κεντρική διαχείριση ποιότητας κώδικα (QA Regression Tests), ανάλυσης ασφαλείας OWASP Pentest, επιμέλειας συνταγών και πακέτων καταναλωτή.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link href="/admin/tests">
              <Button className="rounded-xl px-5 py-2.5 font-bold bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs shadow-lg shadow-emerald-500/20">
                <CheckCircle2 className="size-4 mr-1.5" />
                <span>Άνοιγμα Test Center</span>
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" className="rounded-xl px-4 py-2.5 text-xs text-white border-slate-700 hover:bg-slate-800">
                <span>Εφαρμογή (pioftina.gr)</span>
                <ArrowRight className="size-3.5 ml-1.5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Grid of Action Modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: QA Tests */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="size-11 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              <CheckCircle2 className="size-6" />
            </div>
            <div>
              <h2 className="font-bold text-base text-foreground">QA &amp; Regression Tests</h2>
              <p className="text-xs text-muted-foreground mt-1">
                46 αυτοματοποιημένα τεστ σε 9 σουίτες (Συνταγές, Optimizer, Supermarkets, Export, APIs).
              </p>
            </div>
          </div>
          <Link href="/admin/tests">
            <Button variant="secondary" size="sm" className="w-full text-xs rounded-xl font-semibold justify-between">
              <span>Εκτέλεση Δοκιμών</span>
              <ArrowRight className="size-3.5" />
            </Button>
          </Link>
        </div>

        {/* Card 2: Security & Pentest */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="size-11 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
              <ShieldCheck className="size-6" />
            </div>
            <div>
              <h2 className="font-bold text-base text-foreground">OWASP Pentest Audit</h2>
              <p className="text-xs text-muted-foreground mt-1">
                32 κανόνες ασφαλείας OWASP Top 10 (SSRF, HMAC Auth, Injection, Rate Limiting, Headers).
              </p>
            </div>
          </div>
          <Link href="/admin/tests">
            <Button variant="secondary" size="sm" className="w-full text-xs rounded-xl font-semibold justify-between">
              <span>Έλεγχος Ασφαλείας</span>
              <ArrowRight className="size-3.5" />
            </Button>
          </Link>
        </div>

        {/* Card 3: Recipe Curation */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="size-11 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
              <ChefHat className="size-6" />
            </div>
            <div>
              <h2 className="font-bold text-base text-foreground">Recipe Curation Studio</h2>
              <p className="text-xs text-muted-foreground mt-1">
                Επιμέλεια 80 βασικών συνταγών, αντιστοίχιση υλικών σε προϊόντα σούπερ μάρκετ και κοστολόγηση.
              </p>
            </div>
          </div>
          <Link href="/?section=planner">
            <Button variant="secondary" size="sm" className="w-full text-xs rounded-xl font-semibold justify-between">
              <span>Άνοιγμα Studio</span>
              <ExternalLink className="size-3.5" />
            </Button>
          </Link>
        </div>

        {/* Card 4: Bundle Studio */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="size-11 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
              <Layers className="size-6" />
            </div>
            <div>
              <h2 className="font-bold text-base text-foreground">Bundle Curation Studio</h2>
              <p className="text-xs text-muted-foreground mt-1">
                Διαχείριση πακέτων Clean Planner (καθαριότητα) και Baby Care (βρεφικά είδη).
              </p>
            </div>
          </div>
          <Link href="/?section=clean">
            <Button variant="secondary" size="sm" className="w-full text-xs rounded-xl font-semibold justify-between">
              <span>Άνοιγμα Πακέτων</span>
              <ExternalLink className="size-3.5" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Security Architecture & System Diagnostics */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300 font-bold">
            <Server className="size-4" />
          </div>
          <div>
            <h3 className="font-bold text-base text-foreground">Αρχιτεκτονική Ασφαλείας &amp; Προδιαγραφές</h3>
            <p className="text-xs text-muted-foreground">
              Επισκόπηση των μηχανισμών προστασίας που είναι ενεργοί στην εφαρμογή.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
          <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-xs text-foreground">
              <Lock className="size-3.5 text-amber-500" />
              <span>HMAC-SHA256 Token</span>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Session cookies με υπογραφή HMAC και διάρκεια 24 ωρών (`pioftina_admin_session`).
            </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-xs text-foreground">
              <Zap className="size-3.5 text-blue-500" />
              <span>Rate Limiter &amp; Cooldown</span>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Sliding-window προστασία ανά IP με cooldown 1s και μέγιστο 10 απόπειρες σύνδεσης ανά 5 λεπτά.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-xs text-foreground">
              <Shield className="size-3.5 text-emerald-500" />
              <span>SSRF &amp; Injection Defense</span>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Φραγή loopback (127.0.0.1), RFC1918 private IPs, AWS metadata και XSS/SQL sanitization.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-xs text-foreground">
              <Cpu className="size-3.5 text-purple-500" />
              <span>Search Cache TTL</span>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              In-memory cache 10 λεπτών για αποφυγή επαναλαμβανόμενων κλήσεων στο e-Καταναλωτής live API.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import {
  Play,
  RotateCw,
  CheckCircle2,
  XCircle,
  Clock,
  ShieldCheck,
  ShieldAlert,
  Search,
  Filter,
  FileText,
  Code2,
  Sparkles,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Info,
  Server,
  Terminal,
  Lock,
  ExternalLink,
  Shield,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { TestReport, TestResult, TestCategory } from "@/tests/core/types";
import {
  SecurityAuditReport,
  SecurityCheckResult,
  OwaspCategory,
  OWASP_CATEGORIES_META,
  SecuritySeverity,
} from "@/tests/security/types";

interface TestCenterViewProps {
  onBackToApp?: () => void;
}

export function TestCenterView({ onBackToApp }: TestCenterViewProps) {
  // Test Suite State
  const [report, setReport] = useState<TestReport | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<TestCategory | "all">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "passed" | "failed">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedTestId, setExpandedTestId] = useState<string | null>(null);

  // Security Audit State
  const [securityReport, setSecurityReport] = useState<SecurityAuditReport | null>(null);
  const [isScanningSecurity, setIsScanningSecurity] = useState(false);
  const [selectedOwaspCat, setSelectedOwaspCat] = useState<OwaspCategory | "all">("all");
  const [selectedSecuritySeverity, setSelectedSecuritySeverity] = useState<SecuritySeverity | "all">("all");
  const [securitySearchQuery, setSecuritySearchQuery] = useState("");
  const [expandedRuleId, setExpandedRuleId] = useState<string | null>(null);

  // Active Tab: "results" | "security" | "guide" | "docs"
  const [activeTab, setActiveTab] = useState<"results" | "security" | "guide" | "docs">("results");

  // Run tests on mount
  useEffect(() => {
    runAllTests();
    runSecurityScan();
  }, []);

  const runAllTests = async (category?: TestCategory | "all") => {
    setIsRunning(true);
    try {
      const catParam = category && category !== "all" ? `?category=${category}` : "";
      const res = await fetch(`/api/admin/tests${catParam}`);
      const data = await res.json();
      if (data.success && data.report) {
        setReport(data.report);
      }
    } catch (err) {
      console.error("Failed to run tests:", err);
    } finally {
      setIsRunning(false);
    }
  };

  const runSecurityScan = async () => {
    setIsScanningSecurity(true);
    try {
      const res = await fetch("/api/admin/security");
      const data = await res.json();
      if (data.success && data.report) {
        setSecurityReport(data.report);
      }
    } catch (err) {
      console.error("Failed to run security scan:", err);
    } finally {
      setIsScanningSecurity(false);
    }
  };

  const filteredResults = (report?.results || []).filter((r) => {
    if (selectedCategory !== "all" && r.category !== selectedCategory) return false;
    if (statusFilter === "passed" && !r.passed) return false;
    if (statusFilter === "failed" && r.passed) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        r.title.toLowerCase().includes(q) ||
        r.id.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.tags.some((t) => t.toLowerCase().includes(q));
      if (!match) return false;
    }
    return true;
  });

  const filteredSecurityRules = (securityReport?.results || []).filter((r) => {
    if (selectedOwaspCat !== "all" && r.owaspCategory !== selectedOwaspCat) return false;
    if (selectedSecuritySeverity !== "all" && r.severity !== selectedSecuritySeverity) return false;
    if (securitySearchQuery.trim()) {
      const q = securitySearchQuery.toLowerCase();
      const match =
        r.title.toLowerCase().includes(q) ||
        r.ruleId.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.cwe.toLowerCase().includes(q) ||
        r.threatImpact.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner & Header */}
      <div className="rounded-2xl border border-border bg-gradient-to-r from-blue-900/10 via-background to-indigo-900/10 p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="size-12 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-bold shadow-md shadow-primary/20">
              <ShieldCheck className="size-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-extrabold tracking-tight text-foreground">
                  Κέντρο Ελέγχων &amp; Ασφάλειας (Test &amp; Security Center)
                </h2>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                  OWASP &amp; ASVS Ready
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Αυτοματοποιημένη επαλήθευση 100% Curation, Optimizer, APIs και Penetration Testing.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onBackToApp && (
              <Button
                variant="outline"
                size="sm"
                onClick={onBackToApp}
                className="rounded-xl text-xs"
              >
                Επιστροφή
              </Button>
            )}

            {activeTab === "security" ? (
              <Button
                id="btn-run-pentest"
                onClick={runSecurityScan}
                disabled={isScanningSecurity}
                className="gap-2 rounded-xl text-xs font-semibold px-4 shadow-sm bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                {isScanningSecurity ? (
                  <>
                    <RotateCw className="size-3.5 animate-spin" />
                    <span>Έλεγχος Ασφαλείας...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="size-3.5" />
                    <span>Εκτέλεση Penetration Test</span>
                  </>
                )}
              </Button>
            ) : (
              <Button
                id="btn-run-all-tests"
                onClick={() => runAllTests(selectedCategory)}
                disabled={isRunning}
                className="gap-2 rounded-xl text-xs font-semibold px-4 shadow-sm"
              >
                {isRunning ? (
                  <>
                    <RotateCw className="size-3.5 animate-spin" />
                    <span>Εκτέλεση...</span>
                  </>
                ) : (
                  <>
                    <Play className="size-3.5 fill-current" />
                    <span>Εκτέλεση Ελέγχων</span>
                  </>
                )}
              </Button>
            )}
          </div>
        </div>

        {/* Global Key Stats Bar */}
        {activeTab === "security" ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
            <div className="p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10">
              <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">Βαθμός Ασφαλείας</span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                  {securityReport ? `GRADE ${securityReport.grade}` : "--"}
                </span>
                <span className="text-xs font-bold text-emerald-600/80">
                  ({securityReport ? `${securityReport.securityScore}/100` : "--"})
                </span>
              </div>
            </div>
            <div className="p-3.5 rounded-xl border border-border bg-card/60">
              <span className="text-[11px] font-medium text-muted-foreground">Κανόνες OWASP</span>
              <div className="text-2xl font-black text-foreground mt-0.5">
                {securityReport ? securityReport.summary.total : "--"}
              </div>
            </div>
            <div className="p-3.5 rounded-xl border border-rose-500/20 bg-rose-500/5">
              <span className="text-[11px] font-semibold text-rose-700 dark:text-rose-400 flex items-center gap-1">
                <ShieldAlert className="size-3.5" /> Ευπάθειες
              </span>
              <div className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-0.5">
                {securityReport ? securityReport.summary.failed : "--"}
              </div>
            </div>
            <div className="p-3.5 rounded-xl border border-border bg-card/60">
              <span className="text-[11px] font-medium text-muted-foreground flex items-center gap-1">
                <Clock className="size-3.5" /> Χρόνος Scan
              </span>
              <div className="text-2xl font-black text-foreground mt-0.5">
                {securityReport ? `${securityReport.summary.durationMs}ms` : "--"}
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
            <div className="p-3.5 rounded-xl border border-border bg-card/60">
              <span className="text-[11px] font-medium text-muted-foreground">Σύνολο Tests</span>
              <div className="text-2xl font-black text-foreground mt-0.5">
                {report ? report.total : "--"}
              </div>
            </div>
            <div className="p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5">
              <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="size-3.5" /> Επιτυχημένα
              </span>
              <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
                {report ? report.passed : "--"}
              </div>
            </div>
            <div className="p-3.5 rounded-xl border border-rose-500/20 bg-rose-500/5">
              <span className="text-[11px] font-semibold text-rose-700 dark:text-rose-400 flex items-center gap-1">
                <XCircle className="size-3.5" /> Αποτυχημένα
              </span>
              <div className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-0.5">
                {report ? report.failed : "--"}
              </div>
            </div>
            <div className="p-3.5 rounded-xl border border-border bg-card/60">
              <span className="text-[11px] font-medium text-muted-foreground flex items-center gap-1">
                <Clock className="size-3.5" /> Χρόνος
              </span>
              <div className="text-2xl font-black text-foreground mt-0.5">
                {report ? `${report.durationMs}ms` : "--"}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-border pb-1 overflow-x-auto text-xs font-semibold">
        <button
          onClick={() => setActiveTab("results")}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-colors ${
            activeTab === "results"
              ? "bg-primary text-primary-foreground shadow-xs"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
          }`}
        >
          <CheckCircle2 className="size-3.5" />
          <span>Λειτουργικά Tests ({report?.total || 0})</span>
        </button>

        <button
          onClick={() => setActiveTab("security")}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-colors ${
            activeTab === "security"
              ? "bg-emerald-600 text-white shadow-xs"
              : "text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/10"
          }`}
        >
          <Shield className="size-3.5" />
          <span>Security &amp; Pentest Audit ({securityReport?.summary.total || 0})</span>
          {securityReport && (
            <span className="ml-1 text-[10px] font-extrabold px-1.5 py-0.2 rounded-full bg-white/20">
              {securityReport.grade}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab("guide")}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-colors ${
            activeTab === "guide"
              ? "bg-primary text-primary-foreground shadow-xs"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
          }`}
        >
          <Code2 className="size-3.5" />
          <span>Οδηγός Προσθήκης Tests &amp; Rules</span>
        </button>

        <button
          onClick={() => setActiveTab("docs")}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-colors ${
            activeTab === "docs"
              ? "bg-primary text-primary-foreground shadow-xs"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
          }`}
        >
          <FileText className="size-3.5" />
          <span>Τεκμηρίωση</span>
        </button>
      </div>

      {/* TAB 1: FUNCTIONAL REGRESSION RESULTS */}
      {activeTab === "results" && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
              {[
                { id: "all", label: "Όλες οι Κατηγορίες" },
                { id: "recipes", label: "Συνταγές" },
                { id: "optimizer", label: "Optimizer" },
                { id: "security", label: "Ασφάλεια" },
                { id: "api", label: "APIs" },
                { id: "posokanei", label: "Supermarkets" },
                { id: "custom", label: "Custom Tests" },
              ].map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCategory(c.id as any)}
                  className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
                    selectedCategory === c.id
                      ? "bg-foreground text-background font-semibold"
                      : "bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative min-w-[200px]">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Αναζήτηση test..."
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <Search className="size-3.5 text-muted-foreground absolute left-2.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Results List */}
          <div className="space-y-2">
            {filteredResults.map((test) => {
              const isExpanded = expandedTestId === test.id;
              return (
                <div
                  key={test.id}
                  className={`rounded-xl border transition-all ${
                    test.passed
                      ? "border-border/80 bg-card hover:border-emerald-500/40"
                      : "border-rose-500/40 bg-rose-500/5 hover:border-rose-500/60"
                  }`}
                >
                  <div
                    onClick={() => setExpandedTestId(isExpanded ? null : test.id)}
                    className="p-3.5 flex items-center justify-between gap-3 cursor-pointer select-none"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {test.passed ? (
                        <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                      ) : (
                        <XCircle className="size-4 text-rose-500 shrink-0" />
                      )}
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-xs text-foreground truncate">
                            {test.title}
                          </span>
                          <span className="text-[10px] font-mono text-muted-foreground bg-muted/80 px-1.5 py-0.2 rounded">
                            {test.id}
                          </span>
                        </div>
                        <p className="text-[11px] text-muted-foreground truncate mt-0.5">
                          {test.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] font-mono text-muted-foreground">
                        {test.durationMs}ms
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="size-4 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="size-4 text-muted-foreground" />
                      )}
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="px-4 pb-4 pt-1 border-t border-border/50 text-xs space-y-3 bg-muted/10">
                      <div>
                        <span className="font-bold text-foreground text-[11px]">Τεκμηρίωση:</span>
                        <p className="text-muted-foreground text-[11px] mt-0.5">{test.documentation}</p>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap text-[10px]">
                        <span className="px-2 py-0.5 rounded-md bg-muted text-muted-foreground font-semibold">
                          Κατηγορία: {test.category}
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-muted text-muted-foreground font-semibold">
                          Σοβαρότητα: {test.severity}
                        </span>
                        {test.tags.map((tag) => (
                          <span key={tag} className="px-2 py-0.5 rounded-md bg-primary/10 text-primary font-mono">
                            #{tag}
                          </span>
                        ))}
                      </div>

                      {test.error && (
                        <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-300 font-mono text-[11px]">
                          <span className="font-bold block mb-1">Σφάλμα Assertion:</span>
                          {test.error}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: SECURITY & PENTEST AUDIT DASHBOARD */}
      {activeTab === "security" && (
        <div className="space-y-6">
          {/* OWASP Category Compliance Grid */}
          <div className="p-5 rounded-2xl border border-border bg-card space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <ShieldCheck className="size-4 text-emerald-500" />
                Συμμόρφωση Προτύπων OWASP Top 10 (2021/2025)
              </h3>
              <span className="text-[11px] text-muted-foreground font-mono">
                {securityReport ? `${securityReport.summary.passed} / ${securityReport.summary.total} κανόνες ενεργοί` : "Φόρτωση..."}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
              {securityReport &&
                Object.values(securityReport.categoryStats).map((stat) => (
                  <div
                    key={stat.category}
                    onClick={() =>
                      setSelectedOwaspCat(selectedOwaspCat === stat.category ? "all" : stat.category)
                    }
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      selectedOwaspCat === stat.category
                        ? "border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-500/5"
                        : "border-border/80 bg-background/50 hover:border-border"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold font-mono px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                        {stat.code}
                      </span>
                      <span
                        className={`text-xs font-black ${
                          stat.compliancePercent === 100
                            ? "text-emerald-600 dark:text-emerald-400"
                            : stat.compliancePercent >= 75
                            ? "text-amber-600 dark:text-amber-400"
                            : "text-rose-600 dark:text-rose-400"
                        }`}
                      >
                        {stat.compliancePercent}%
                      </span>
                    </div>

                    <div className="text-xs font-semibold text-foreground mt-2 truncate">
                      {stat.name.split("(")[0]}
                    </div>

                    <div className="w-full bg-muted/60 h-1.5 rounded-full mt-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          stat.compliancePercent === 100
                            ? "bg-emerald-500"
                            : stat.compliancePercent >= 75
                            ? "bg-amber-500"
                            : "bg-rose-500"
                        }`}
                        style={{ width: `${stat.compliancePercent}%` }}
                      />
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Security Rules Filter Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
              <button
                onClick={() => setSelectedOwaspCat("all")}
                className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  selectedOwaspCat === "all"
                    ? "bg-emerald-600 text-white font-semibold"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                Όλοι οι Κανόνες ({securityReport?.results.length || 0})
              </button>

              {(["critical", "high", "medium", "low"] as SecuritySeverity[]).map((sev) => (
                <button
                  key={sev}
                  onClick={() =>
                    setSelectedSecuritySeverity(selectedSecuritySeverity === sev ? "all" : sev)
                  }
                  className={`px-2.5 py-1.5 rounded-lg font-semibold text-[11px] uppercase transition-colors ${
                    selectedSecuritySeverity === sev
                      ? "bg-foreground text-background"
                      : "bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {sev}
                </button>
              ))}
            </div>

            <div className="relative min-w-[220px]">
              <input
                type="text"
                value={securitySearchQuery}
                onChange={(e) => setSecuritySearchQuery(e.target.value)}
                placeholder="Αναζήτηση κανόνα ή CWE..."
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
              <Search className="size-3.5 text-muted-foreground absolute left-2.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Security Rules List */}
          <div className="space-y-2.5">
            {filteredSecurityRules.map((rule) => {
              const isExpanded = expandedRuleId === rule.ruleId;
              const meta = OWASP_CATEGORIES_META[rule.owaspCategory];

              return (
                <div
                  key={rule.ruleId}
                  className={`rounded-xl border transition-all ${
                    rule.status === "pass"
                      ? "border-border/80 bg-card hover:border-emerald-500/40"
                      : rule.status === "warn"
                      ? "border-amber-500/40 bg-amber-500/5 hover:border-amber-500/60"
                      : "border-rose-500/40 bg-rose-500/5 hover:border-rose-500/60"
                  }`}
                >
                  <div
                    onClick={() => setExpandedRuleId(isExpanded ? null : rule.ruleId)}
                    className="p-3.5 flex items-center justify-between gap-3 cursor-pointer select-none"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {rule.status === "pass" ? (
                        <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                      ) : rule.status === "warn" ? (
                        <AlertTriangle className="size-4 text-amber-500 shrink-0" />
                      ) : (
                        <XCircle className="size-4 text-rose-500 shrink-0" />
                      )}

                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-xs text-foreground">
                            {rule.title}
                          </span>
                          <span className="text-[10px] font-mono text-muted-foreground bg-muted/80 px-1.5 py-0.2 rounded">
                            {rule.ruleId}
                          </span>
                          <span
                            className={`text-[9px] font-bold uppercase px-1.5 py-0.2 rounded ${
                              rule.severity === "critical"
                                ? "bg-rose-500/10 text-rose-600 border border-rose-500/20"
                                : rule.severity === "high"
                                ? "bg-amber-500/10 text-amber-600 border border-amber-500/20"
                                : rule.severity === "medium"
                                ? "bg-blue-500/10 text-blue-600 border border-blue-500/20"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {rule.severity}
                          </span>
                        </div>
                        <p className="text-[11px] text-muted-foreground truncate mt-0.5">
                          {rule.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] font-mono text-muted-foreground">
                        {rule.durationMs}ms
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="size-4 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="size-4 text-muted-foreground" />
                      )}
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="px-4 pb-4 pt-2 border-t border-border/50 text-xs space-y-3 bg-muted/10">
                      {/* Threat Impact */}
                      <div className="p-3 rounded-xl bg-background/80 border border-border/60 space-y-1">
                        <span className="font-bold text-foreground text-[11px] flex items-center gap-1.5">
                          <ShieldAlert className="size-3.5 text-amber-500" />
                          Μοντέλο Απειλής &amp; Επιπτώσεις (Threat Impact):
                        </span>
                        <p className="text-muted-foreground text-[11px] leading-relaxed">
                          {rule.threatImpact}
                        </p>
                      </div>

                      {/* Remediation */}
                      <div className="p-3 rounded-xl bg-background/80 border border-border/60 space-y-1">
                        <span className="font-bold text-foreground text-[11px] flex items-center gap-1.5">
                          <Lock className="size-3.5 text-primary" />
                          Οδηγίες Επίλυσης (Remediation):
                        </span>
                        <p className="text-muted-foreground text-[11px] leading-relaxed font-mono text-[10.5px]">
                          {rule.remediation}
                        </p>
                      </div>

                      {/* Evidence */}
                      {rule.evidence && (
                        <div className="p-2.5 rounded-lg bg-emerald-500/5 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300 font-mono text-[10.5px]">
                          <span className="font-bold block mb-0.5">Αποδεικτικά Στοιχεία (Evidence):</span>
                          {rule.evidence}
                        </div>
                      )}

                      {/* Details / Notes */}
                      {rule.details && (
                        <div className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                          <Info className="size-3.5 text-blue-500 shrink-0" />
                          <span>{rule.details}</span>
                        </div>
                      )}

                      {/* Error details if failed */}
                      {rule.error && (
                        <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-300 font-mono text-[11px]">
                          <span className="font-bold block mb-1">Σφάλμα Ευπάθειας:</span>
                          {rule.error}
                        </div>
                      )}

                      {/* Footer tags & CWE */}
                      <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-1 border-t border-border/40">
                        <div className="flex items-center gap-2">
                          <span>Κατηγορία: {meta?.name || rule.owaspCategory}</span>
                          <span>&bull;</span>
                          <a
                            href={`https://cwe.mitre.org/data/definitions/${rule.cwe.replace("CWE-", "")}.html`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline flex items-center gap-1 font-mono font-bold"
                          >
                            {rule.cwe}
                            <ExternalLink className="size-2.5" />
                          </a>
                        </div>
                        <span className="font-mono">Status: {rule.status.toUpperCase()}</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: USER AUTHORING GUIDE */}
      {activeTab === "guide" && (
        <div className="p-6 rounded-2xl border border-border bg-card space-y-5 text-xs">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
              <Code2 className="size-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">
                Πώς να Προσθέσετε Δικό σας Test ή Κανόνα Ασφαλείας
              </h3>
              <p className="text-muted-foreground">
                Απλό, plug-and-play σύστημα χωρίς περίπλοκες βιβλιοθήκες.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Guide A: Functional Tests */}
            <div className="p-4 rounded-xl border border-border bg-background space-y-3">
              <span className="font-bold text-sm text-foreground flex items-center gap-1.5">
                <CheckCircle2 className="size-4 text-emerald-500" />
                1. Προσθήκη Λειτουργικού Test
              </span>
              <p className="text-muted-foreground text-[11px]">
                Ανοίξτε το <code className="text-primary font-mono font-bold">src/tests/suites/custom-user-tests.ts</code>:
              </p>
              <pre className="p-3 rounded-lg bg-muted/60 font-mono text-[10px] overflow-x-auto text-foreground/90">{`defineTest({
  id: "my-custom-test",
  title: "Έλεγχος Νέας Συνταγής",
  category: "custom",
  description: "Σύντομη περιγραφή",
  documentation: "Αναλυτική εξήγηση",
  tags: ["custom"],
  severity: "medium",
  run: async ({ fetchApi, assertEquals }) => {
    const res = await fetchApi("/api/recipes");
    assertEquals(res.status, 200, "200 OK");
  },
})`}</pre>
              <div className="text-muted-foreground text-[11px]">
                Τρέξτε: <code className="font-mono font-bold text-foreground">npm test</code>
              </div>
            </div>

            {/* Guide B: Security Rules */}
            <div className="p-4 rounded-xl border border-border bg-background space-y-3">
              <span className="font-bold text-sm text-foreground flex items-center gap-1.5">
                <ShieldCheck className="size-4 text-emerald-500" />
                2. Προσθήκη Κανόνα Ασφαλείας / Pentest
              </span>
              <p className="text-muted-foreground text-[11px]">
                Ανοίξτε το <code className="text-primary font-mono font-bold">src/tests/security/custom-security-rules.ts</code>:
              </p>
              <pre className="p-3 rounded-lg bg-muted/60 font-mono text-[10px] overflow-x-auto text-foreground/90">{`defineSecurityRule({
  id: "SEC-CUST-AUTH-CHECK",
  title: "Έλεγχος Προστασίας Διαδρομής",
  owaspCategory: "A01_BROKEN_ACCESS_CONTROL",
  cwe: "CWE-285",
  severity: "high",
  description: "Περιγραφή ελέγχου",
  threatImpact: "Πιθανός κίνδυνος",
  remediation: "Οδηγίες επίλυσης",
  execute: async ({ fetchApi, assertEquals }) => {
    const res = await fetchApi("/api/admin/auth");
    assertEquals(res.status, 401, "401 Unauthorized");
  },
})`}</pre>
              <div className="text-muted-foreground text-[11px]">
                Τρέξτε: <code className="font-mono font-bold text-foreground">npm run pentest</code>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: COMPLETE DOCUMENTATION */}
      {activeTab === "docs" && (
        <div className="p-6 rounded-2xl border border-border bg-card space-y-4 text-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="size-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                <FileText className="size-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground">
                  Τεκμηρίωση Συστήματος Ελέγχων &amp; Ασφάλειας
                </h3>
                <p className="text-muted-foreground">
                  Αναλυτική λίστα αρχείων τεκμηρίωσης του συστήματος.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-xl border border-border bg-background space-y-2">
              <div className="flex items-center gap-2 font-bold text-foreground text-sm">
                <CheckCircle2 className="size-4 text-emerald-500" />
                TESTS_DOCUMENTATION.md
              </div>
              <p className="text-muted-foreground text-[11px]">
                Περιέχει αναλυτικά όλα τα 24 λειτουργικά tests (Συνταγές, Curation, Optimizer, APIs, Rate Limiter, Supermarkets).
              </p>
              <div className="font-mono text-[10px] text-primary">npm run test:docs</div>
            </div>

            <div className="p-4 rounded-xl border border-border bg-background space-y-2">
              <div className="flex items-center gap-2 font-bold text-foreground text-sm">
                <Shield className="size-4 text-emerald-500" />
                SECURITY_AUDIT_RULES.md
              </div>
              <p className="text-muted-foreground text-[11px]">
                Περιλαμβάνει το πλήρες μοντέλο απειλών OWASP Top 10, CWE codes, threat impacts και οδηγίες επίλυσης (remediation).
              </p>
              <div className="font-mono text-[10px] text-primary">npm run pentest:docs</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

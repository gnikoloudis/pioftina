import { Metadata } from "next";
import { TestCenterView } from "@/components/admin/test-center-view";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Test Center & Quality Assurance | pioftina.gr",
  description: "Automated regression testing tool and verification center for pioftina.gr",
};

export default function AdminTestsPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16">
      <div className="border-b bg-white border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Επιστροφή στην εφαρμογή (pioftina.gr)
          </Link>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Test Runner Ready (Local / Vercel Serverless)
          </div>
        </div>
      </div>
      <main className="max-w-7xl mx-auto px-4 pt-6">
        <TestCenterView />
      </main>
    </div>
  );
}

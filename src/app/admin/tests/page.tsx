import { Metadata } from "next";
import { TestCenterView } from "@/components/admin/test-center-view";

export const metadata: Metadata = {
  title: "Test Center & Quality Assurance | pioftina.gr",
  description: "Automated regression testing tool and verification center for pioftina.gr",
};

export default function AdminTestsPage() {
  return (
    <main className="max-w-7xl mx-auto px-4 py-6 pb-16">
      <TestCenterView />
    </main>
  );
}

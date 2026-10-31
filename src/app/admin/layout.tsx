import { Metadata } from "next";
import { cookies } from "next/headers";
import { ADMIN_COOKIE_NAME, verifyAdminToken } from "@/lib/security/admin-auth";
import { AdminAuthGuard } from "@/components/admin/admin-auth-guard";
import { AdminTopNav } from "@/components/admin/admin-top-nav";

export const metadata: Metadata = {
  title: "Administration Console | pioftina.gr",
  description: "Πίνακας ελέγχου διαχειριστή και κέντρο δοκιμών QA για το pioftina.gr",
  robots: "noindex, nofollow",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  const isAuthenticated = sessionToken ? verifyAdminToken(sessionToken) : false;

  if (!isAuthenticated) {
    return <AdminAuthGuard />;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans">
      <AdminTopNav />
      <div className="flex-1">{children}</div>
    </div>
  );
}

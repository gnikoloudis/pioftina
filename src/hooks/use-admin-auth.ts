"use client";

import { useState, useEffect, useCallback } from "react";

export function useAdminAuth() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check admin session on mount
  const checkStatus = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/auth");
      if (res.ok) {
        const data = await res.json();
        setIsAdmin(!!data.isAdmin);
      } else {
        setIsAdmin(false);
      }
    } catch {
      setIsAdmin(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkStatus();
  }, [checkStatus]);

  const login = async (password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (data.success) {
        setIsAdmin(true);
        return { success: true };
      }
      return { success: false, error: data.error || "Λανθασμένος κωδικός πρόσβασης." };
    } catch (err: any) {
      return { success: false, error: "Σφάλμα δικτύου. Παρακαλώ δοκιμάστε ξανά." };
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await fetch("/api/admin/auth", { method: "DELETE" });
    } catch (_) {}
    setIsAdmin(false);
  };

  return {
    isAdmin,
    isLoading,
    login,
    logout,
    checkStatus,
  };
}

"use client";
import { useEffect } from "react";

// Supabase falls back to Site URL when a redirect URL is not allowlisted.
export default function RecoveryRedirect() {
  useEffect(() => {
    const hash = new URLSearchParams(window.location.hash.slice(1));
    if (window.location.pathname !== "/auth/reset-password" &&
        (hash.get("type") === "recovery" || hash.has("error_code"))) {
      window.location.replace(`/auth/reset-password${window.location.hash}`);
    }
  }, []);
  return null;
}

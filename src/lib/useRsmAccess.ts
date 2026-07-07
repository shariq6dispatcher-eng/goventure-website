"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { RsmModule } from "@/types/rsm";

interface RsmMe {
  username: string;
  role: "admin" | "staff";
  allowedModules: RsmModule[] | null;
}

/**
 * Fetches the current staff session and enforces module-level access.
 * - Redirects to /RSM/login if not authenticated at all.
 * - Redirects to /RSM if authenticated but this module isn't in their
 *   allowedModules (admins always pass, since their allowedModules is null).
 * - Pass no module (undefined) for pages any logged-in staff can see,
 *   like the Dashboard itself.
 *
 * Returns `me` (null while loading or redirecting) so pages can gate
 * their render the same way they already do with the old fetchMe pattern.
 */
export function useRsmAccess(module?: RsmModule) {
  const router = useRouter();
  const [me, setMe] = useState<RsmMe | null>(null);

  useEffect(() => {
    fetch("/api/rsm/me")
      .then((r) => {
        if (!r.ok) throw new Error("not authed");
        return r.json();
      })
      .then((data: RsmMe) => {
        const hasAccess =
          data.role === "admin" ||
          !module ||
          (data.allowedModules && data.allowedModules.includes(module));

        if (!hasAccess) {
          router.push("/RSM");
          return;
        }
        setMe(data);
      })
      .catch(() => router.push("/RSM/login"));
  }, [module, router]);

  return me;
}

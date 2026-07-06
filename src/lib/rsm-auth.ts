import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export interface RsmAuthSession {
  username: string;
  role: "admin" | "staff";
}

/**
 * Reads the rsm-auth cookie, redirects to /RSM/login if missing or
 * malformed. Used by the protected layout (to gate access) and by
 * pages/components that need to display the logged-in staff's name/role.
 */
export async function getRsmAuth(): Promise<RsmAuthSession> {
  const raw = (await cookies()).get("rsm-auth")?.value;

  if (!raw) {
    redirect("/RSM/login");
  }

  try {
    return JSON.parse(raw) as RsmAuthSession;
  } catch {
    redirect("/RSM/login");
  }
}
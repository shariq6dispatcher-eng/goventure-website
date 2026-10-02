import { NextResponse } from "next/server";
import { mongo } from "@/lib/mongodb";
import { RSM_COLLECTIONS } from "@/types/constants";
import { getRsmAuth } from "@/lib/rsm-auth";
import type { RsmStaff } from "@/types/rsm";
 
/**
 * Returns true if the currently logged-in RSM user should have order
 * amounts / prices and customer contact details redacted from API
 * responses (used for digitizer-only accounts). Admins are never
 * redacted. Fails "safe" (redacts) if the staff lookup errors out, so a
 * DB hiccup can't accidentally leak financial data to a restricted account.
 */
export async function shouldHideFinancials(): Promise<boolean> {
  const auth = await getRsmAuth();
  if (auth.role === "admin") return false;

  try {
    const staffDoc = await mongo.findOne<RsmStaff>(RSM_COLLECTIONS.staff, {
      username: auth.username,
    });
    return !!staffDoc?.hideFinancials;
  } catch {
    return true;
  }
}

export interface RsmScope {
  username: string;
  isAdmin: boolean;
  /** true = this user may only see digitizing jobs assigned to them */
  onlyAssignedJobs: boolean;
}

/**
 * Resolves what the current RSM user is allowed to see. Admins are never
 * restricted. Fails closed (restricted) if the staff lookup errors, so a DB
 * hiccup can't expose every job to a digitizer account.
 */
export async function getRsmScope(): Promise<RsmScope> {
  const auth = await getRsmAuth();
  if (auth.role === "admin") {
    return { username: auth.username, isAdmin: true, onlyAssignedJobs: false };
  }

  try {
    const staffDoc = await mongo.findOne<RsmStaff>(RSM_COLLECTIONS.staff, {
      username: auth.username,
    });
    return {
      username: auth.username,
      isAdmin: false,
      onlyAssignedJobs: !!staffDoc?.onlyAssignedJobs,
    };
  } catch {
    return { username: auth.username, isAdmin: false, onlyAssignedJobs: true };
  }
}

/** Mongo filter that limits a digitizing-jobs query to what this scope may see. */
export function jobScopeFilter(scope: RsmScope): Record<string, unknown> {
  return scope.onlyAssignedJobs ? { assignedTo: scope.username } : {};
}

/** Single-record check, for GET/PUT/DELETE-by-id style routes. */
export function canAccessJob(
  scope: RsmScope,
  job: { assignedTo?: string }
): boolean {
  if (!scope.onlyAssignedJobs) return true;
  return !!job.assignedTo && job.assignedTo === scope.username;
}

/**
 * Guard for routes a restricted digitizer (onlyAssignedJobs) must never
 * reach: orders, customers, payments, expenses, ledger, reports, search,
 * leads, dashboard. Returns a 403 response to hand straight back, or null
 * if the caller may continue. Admins and normal staff are unaffected.
 * Fails closed: if the staff lookup errors, getRsmScope treats the user as
 * restricted.
 *
 * Usage (right after getRsmAuth):
 *   const denied = await denyRestricted();
 *   if (denied) return denied;
 */
export async function denyRestricted(): Promise<NextResponse | null> {
  const scope = await getRsmScope();
  if (scope.onlyAssignedJobs) {
    return NextResponse.json({ error: "Not allowed" }, { status: 403 });
  }
  return null;
}

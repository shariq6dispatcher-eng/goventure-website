import { NextResponse } from "next/server";
import { mongo } from "@/lib/mongodb";
import { RSM_COLLECTIONS } from "@/types/constants";
import { getRsmAuth } from "@/lib/rsm-auth";
import { getRsmScope } from "@/lib/rsm-perms";
import type { RsmStaff } from "@/types/rsm";

// GET: the list of staff who can be assigned digitizing jobs (used by the
// assignment dropdowns on the order form and the job form). Only username
// and display name are returned - never passwords or other staff details.
// A restricted "only assigned jobs" digitizer gets an empty list: they have
// no reason to see who else is on the team.
export async function GET() {
  await getRsmAuth();
  const scope = await getRsmScope();

  if (scope.onlyAssignedJobs) {
    return NextResponse.json({ digitizers: [] });
  }

  try {
    const staff = await mongo.find<RsmStaff>(
      RSM_COLLECTIONS.staff,
      {},
      { createdAt: -1 }
    );

    const digitizers = staff
      .filter(
        (s) =>
          s.role !== "admin" &&
          s.active !== false &&
          (s.onlyAssignedJobs ||
            (s.allowedModules || []).includes("digitizing") ||
            (s.allowedModules || []).includes("digitizing_work"))
      )
      .map((s) => ({ username: s.username, name: s.name }))
      .sort((a, b) => a.name.localeCompare(b.name));

    return NextResponse.json({ digitizers });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to load digitizers" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { mongo } from "@/lib/mongodb";
import { RSM_COLLECTIONS } from "@/types/constants";
import { getRsmAuth } from "@/lib/rsm-auth";
import type { RsmStaff } from "@/types/rsm";

// A staff member counts as "online" if they've pinged the heartbeat route
// within this window. RsmShell pings every 30s, so 2 minutes comfortably
// covers a slow network/tab-switch without flickering offline.
const ONLINE_THRESHOLD_MS = 2 * 60 * 1000;

/**
 * Presence list for the Dashboard's "who's online" strip. Any logged-in
 * staff member can see this (it's just names + a dot, not financials),
 * unlike /api/rsm/staff which is admin-only and returns full records.
 */
export async function GET() {
  await getRsmAuth();

  try {
    const staff = await mongo.find<RsmStaff>(
      RSM_COLLECTIONS.staff,
      { active: true },
      { name: 1 }
    );

    const now = Date.now();
    const list = staff.map((s) => {
      const lastActiveMs = s.lastActive ? new Date(s.lastActive).getTime() : 0;
      return {
        username: s.username,
        name: s.name,
        role: s.role,
        online: now - lastActiveMs < ONLINE_THRESHOLD_MS,
        lastActive: s.lastActive || null,
      };
    });

    // Online first, then alphabetical by name within each group.
    list.sort((a, b) => {
      if (a.online !== b.online) return a.online ? -1 : 1;
      return a.name.localeCompare(b.name);
    });

    return NextResponse.json({ staff: list });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to load staff status" },
      { status: 500 }
    );
  }
}

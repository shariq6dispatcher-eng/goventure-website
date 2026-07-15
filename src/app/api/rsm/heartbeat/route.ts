import { NextResponse } from "next/server";
import { mongo } from "@/lib/mongodb";
import { RSM_COLLECTIONS } from "@/types/constants";
import { getRsmAuth } from "@/lib/rsm-auth";

/**
 * Called periodically by RsmShell (every page render + on an interval)
 * while a staff member has the panel open, so `lastActive` stays fresh
 * and the "online/offline" indicator on the Dashboard reflects reality.
 * No response body needed — this is fire-and-forget from the client.
 */
export async function POST() {
  const auth = await getRsmAuth();

  try {
    await mongo.updateOne(
      RSM_COLLECTIONS.staff,
      { username: auth.username },
      { lastActive: new Date().toISOString() }
    );
    return NextResponse.json({ success: true });
  } catch (err) {
    // Non-critical — presence is best-effort, never break the page for it.
    return NextResponse.json({ success: false }, { status: 200 });
  }
}

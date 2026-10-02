import { NextResponse } from "next/server";
import { mongo, toObjectId } from "@/lib/mongodb";
import { RSM_COLLECTIONS } from "@/types/constants";
import { getRsmAuth } from "@/lib/rsm-auth";
import { getRsmScope } from "@/lib/rsm-perms";
import type { RsmNotification, DigitizingJob } from "@/types/rsm";

// GET: notifications for the current user (their username, or broadcast "all")
export async function GET() {
  const auth = await getRsmAuth();
  const scope = await getRsmScope();

  try {
    const notifications = await mongo.find<RsmNotification>(
      RSM_COLLECTIONS.notifications,
      {},
      { createdAt: -1 }
    );

    let mine: RsmNotification[];

    if (scope.onlyAssignedJobs) {
      // Restricted digitizer: only notifications addressed to them by
      // username, or broadcasts about a job that is assigned to them.
      // Everything else (other jobs, online orders, payments...) is hidden.
      const myJobs = await mongo.find<DigitizingJob>(
        RSM_COLLECTIONS.digitizingJobs,
        { assignedTo: scope.username },
        { createdAt: -1 }
      );
      const myJobIds = new Set(myJobs.map((j) => String(j._id)));

      mine = notifications.filter(
        (n) =>
          n.forUsername === auth.username ||
          (n.forUsername === "all" && !!n.jobId && myJobIds.has(String(n.jobId)))
      );
    } else {
      mine = notifications.filter(
        (n) => n.forUsername === auth.username || n.forUsername === "all"
      );
    }

    return NextResponse.json({ notifications: mine.slice(0, 50) });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to load notifications" },
      { status: 500 }
    );
  }
}

// PATCH: mark one notification as read, or all (body: { id } or { all: true })
export async function PATCH(req: Request) {
  await getRsmAuth();
  const body = (await req.json()) as { id?: string; all?: boolean };

  try {
    if (body.all) {
      await mongo.updateMany(
        RSM_COLLECTIONS.notifications,
        { read: false },
        { read: true }
      );
      return NextResponse.json({ success: true });
    }

    if (!body.id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    const result = await mongo.updateOne(
      RSM_COLLECTIONS.notifications,
      { _id: toObjectId(body.id) },
      { read: true }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: "Notification not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to update notification" },
      { status: 500 }
    );
  }
}

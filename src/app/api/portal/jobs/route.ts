import { NextResponse } from "next/server";
import { mongo } from "@/lib/mongodb";
import { RSM_COLLECTIONS } from "@/types/constants";
import { getCustomerPortalAuth } from "@/lib/customer-portal-auth";
import type { DigitizingJob } from "@/types/rsm";

export async function GET() {
  const session = await getCustomerPortalAuth();

  try {
    const jobs = await mongo.find<DigitizingJob>(
      RSM_COLLECTIONS.digitizingJobs,
      { customerId: session.customerId },
      { createdAt: -1 }
    );

    return NextResponse.json({ jobs });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to load your jobs" },
      { status: 500 }
    );
  }
}

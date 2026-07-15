import { NextResponse } from "next/server";
import { mongo } from "@/lib/mongodb";
import { RSM_COLLECTIONS } from "@/types/constants";
import { getRsmAuth } from "@/lib/rsm-auth";
import type { RsmStaff, RsmModule } from "@/types/rsm";

export async function GET() {
  const auth = await getRsmAuth();

  // Admins always see everything, so we skip the lookup and just say so —
  // no need to hit the database on every single page load for that case.
  if (auth.role === "admin") {
    return NextResponse.json({ ...auth, allowedModules: null, hideFinancials: false });
  }

  try {
    const staffDoc = await mongo.findOne<RsmStaff>(RSM_COLLECTIONS.staff, {
      username: auth.username,
    });

    const allowedModules: RsmModule[] = staffDoc?.allowedModules || [];
    return NextResponse.json({
      ...auth,
      allowedModules,
      hideFinancials: !!staffDoc?.hideFinancials,
    });
  } catch (err) {
    // If the lookup fails for any reason, fail closed (empty list, hide
    // financials) rather than accidentally granting a staff account
    // access to everything.
    return NextResponse.json({ ...auth, allowedModules: [], hideFinancials: true });
  }
}

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

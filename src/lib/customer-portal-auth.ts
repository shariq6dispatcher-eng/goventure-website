import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export interface CustomerPortalSession {
  customerId: string;
  username: string;
  name: string;
}

/**
 * Reads the customer-portal-auth cookie, redirects to /portal/login if
 * missing or malformed. Used by the protected layout (to gate access) and
 * by pages/components that need the logged-in customer's id/name.
 */
export async function getCustomerPortalAuth(): Promise<CustomerPortalSession> {
  const raw = (await cookies()).get("customer-portal-auth")?.value;

  if (!raw) {
    redirect("/portal/login");
  }

  try {
    return JSON.parse(raw) as CustomerPortalSession;
  } catch {
    redirect("/portal/login");
  }
}

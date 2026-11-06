import { redirect } from "next/navigation";
import { getRsmAuth } from "@/lib/rsm-auth";
import { shouldHideFinancials } from "@/lib/rsm-perms";
import { mongo } from "@/lib/mongodb";
import { RSM_COLLECTIONS } from "@/types/constants";
import RsmShell from "@/components/admin/rsm/RsmShell";
import RsmDashboardClient from "@/components/admin/rsm/RsmDashboardClient";
import type { Order, Payment, Customer, Expense, DigitizingJob, OnlineOrder } from "@/types/rsm";

// Unwrap one allSettled result. A failed query falls back to an empty list
// and is recorded so the page can warn that its numbers are incomplete.
function unwrap<T>(
  result: PromiseSettledResult<T[]>,
  label: string,
  failed: string[]
): T[] {
  if (result.status === "fulfilled") return result.value;
  console.error(`RSM dashboard: failed to load ${label}:`, result.reason);
  failed.push(label);
  return [];
}

export default async function RsmHomePage() {
  const auth = await getRsmAuth();

  // The Dashboard is entirely financial (revenue, receivables, expenses,
  // client names on active orders) — restricted (digitizer) accounts never
  // see it, so send them straight to the one module they do have.
  if (await shouldHideFinancials()) {
    redirect("/RSM/digitizing-jobs");
  }

  // allSettled: one slow or failing query no longer takes down the whole page.
  const results = await Promise.allSettled([
    mongo.find<Order>(RSM_COLLECTIONS.orders),
    mongo.find<Payment>(RSM_COLLECTIONS.payments),
    mongo.find<Customer>(RSM_COLLECTIONS.customers),
    mongo.find<Expense>(RSM_COLLECTIONS.expenses),
    mongo.find<DigitizingJob>(RSM_COLLECTIONS.digitizingJobs),
    mongo.find<OnlineOrder>(RSM_COLLECTIONS.onlineOrders),
  ]);

  const failed: string[] = [];
  const orders = unwrap(results[0], "orders", failed);
  const payments = unwrap(results[1], "payments", failed);
  const customers = unwrap(results[2], "customers", failed);
  const expenses = unwrap(results[3], "expenses", failed);
  const digitizingJobs = unwrap(results[4], "digitizing jobs", failed);
  const onlineOrders = unwrap(results[5], "online orders", failed);

  // Everything failed: show the full "database is busy" screen.
  if (failed.length === results.length) {
    return (
      <RsmShell
        staffName={auth.username}
        staffRole={auth.role}
        title="Dashboard"
        subtitle="Overview of your business at a glance"
      >
        <div className="bg-zinc-900/60 border border-zinc-900 rounded-2xl p-10 text-center">
          <p className="text-sm text-zinc-300 mb-1">
            The database is busy right now, so the dashboard couldn&apos;t load.
          </p>
          <p className="text-xs text-zinc-500 mb-5">
            Nothing is lost. Wait a few seconds and reload.
          </p>
          <a
            href="/RSM"
            className="inline-block px-5 py-2.5 rounded-xl text-sm font-medium bg-[#D4AF37] text-black hover:opacity-90 transition-opacity"
          >
            Reload
          </a>
        </div>
      </RsmShell>
    );
  }

  return (
    <RsmShell
      staffName={auth.username}
      staffRole={auth.role}
      title="Dashboard"
      subtitle="Overview of your business at a glance"
    >
      {failed.length > 0 && (
        <div className="mb-6 bg-amber-950/30 border border-amber-500/30 rounded-xl px-5 py-3 flex items-center justify-between gap-4">
          <p className="text-xs text-amber-300">
            Some data couldn&apos;t load ({failed.join(", ")}), so the figures
            below are incomplete. Nothing is lost.
          </p>
          <a
            href="/RSM"
            className="shrink-0 text-xs font-medium text-[#D4AF37] hover:underline"
          >
            Reload
          </a>
        </div>
      )}

      <RsmDashboardClient
        orders={orders}
        payments={payments}
        expenses={expenses}
        customers={customers}
        digitizingJobs={digitizingJobs}
        onlineOrders={onlineOrders}
        currentUser={auth.username}
      />
    </RsmShell>
  );
}

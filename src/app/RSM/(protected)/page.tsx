import { redirect } from "next/navigation";
import { getRsmAuth } from "@/lib/rsm-auth";
import { shouldHideFinancials } from "@/lib/rsm-perms";
import { mongo } from "@/lib/mongodb";
import { RSM_COLLECTIONS } from "@/types/constants";
import RsmShell from "@/components/admin/rsm/RsmShell";
import RsmDashboardClient from "@/components/admin/rsm/RsmDashboardClient";
import type { Order, Payment, Customer, Expense, DigitizingJob, OnlineOrder } from "@/types/rsm";

type DashboardData = [
  Order[],
  Payment[],
  Customer[],
  Expense[],
  DigitizingJob[],
  OnlineOrder[],
];

export default async function RsmHomePage() {
  const auth = await getRsmAuth();

  // The Dashboard is entirely financial (revenue, receivables, expenses,
  // client names on active orders) — restricted (digitizer) accounts never
  // see it, so send them straight to the one module they do have.
  if (await shouldHideFinancials()) {
    redirect("/RSM/digitizing-jobs");
  }

  let data: DashboardData | null = null;
  try {
    data = await Promise.all([
      mongo.find<Order>(RSM_COLLECTIONS.orders),
      mongo.find<Payment>(RSM_COLLECTIONS.payments),
      mongo.find<Customer>(RSM_COLLECTIONS.customers),
      mongo.find<Expense>(RSM_COLLECTIONS.expenses),
      mongo.find<DigitizingJob>(RSM_COLLECTIONS.digitizingJobs),
      mongo.find<OnlineOrder>(RSM_COLLECTIONS.onlineOrders),
    ]);
  } catch (err) {
    console.error("RSM dashboard load failed:", err);
  }

  if (!data) {
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

  const [orders, payments, customers, expenses, digitizingJobs, onlineOrders] = data;

  return (
    <RsmShell
      staffName={auth.username}
      staffRole={auth.role}
      title="Dashboard"
      subtitle="Overview of your business at a glance"
    >
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

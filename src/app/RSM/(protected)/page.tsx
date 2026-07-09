import { getRsmAuth } from "@/lib/rsm-auth";
import { mongo } from "@/lib/mongodb";
import { RSM_COLLECTIONS } from "@/types/constants";
import RsmShell from "@/components/admin/rsm/RsmShell";
import RsmDashboardClient from "@/components/admin/rsm/RsmDashboardClient";
import type { Order, Payment, Customer, Expense, DigitizingJob, OnlineOrder } from "@/types/rsm";

export default async function RsmHomePage() {
  const auth = await getRsmAuth();

 const [orders, payments, customers, expenses, digitizingJobs, onlineOrders] = await Promise.all([
    mongo.find<Order>(RSM_COLLECTIONS.orders),
    mongo.find<Payment>(RSM_COLLECTIONS.payments),
    mongo.find<Customer>(RSM_COLLECTIONS.customers),
    mongo.find<Expense>(RSM_COLLECTIONS.expenses),
    mongo.find<DigitizingJob>(RSM_COLLECTIONS.digitizingJobs),
    mongo.find<OnlineOrder>(RSM_COLLECTIONS.onlineOrders),
  ]);

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

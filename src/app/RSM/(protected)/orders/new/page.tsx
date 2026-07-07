"use client";

import RsmShell from "@/components/admin/rsm/RsmShell";
import OrderForm from "@/components/admin/rsm/OrderForm";
import { useRsmAccess } from "@/lib/useRsmAccess";

export default function NewOrderPage() {
  const me = useRsmAccess("orders");

  if (!me) return null;

  return (
    <RsmShell
      staffName={me.username}
      staffRole={me.role}
      title="New Order"
      subtitle="Create a new order for a customer"
    >
      <OrderForm order={null} />
    </RsmShell>
  );
}

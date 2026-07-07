"use client";

import RsmShell from "@/components/admin/rsm/RsmShell";
import PaymentForm from "@/components/admin/rsm/PaymentForm";
import { useRsmAccess } from "@/lib/useRsmAccess";

export default function NewPaymentPage() {
  const me = useRsmAccess("payments");

  if (!me) return null;

  return (
    <RsmShell
      staffName={me.username}
      staffRole={me.role}
      title="Record Payment"
      subtitle="Log a new payment from a customer"
    >
      <PaymentForm payment={null} />
    </RsmShell>
  );
}

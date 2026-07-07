"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import RsmShell from "@/components/admin/rsm/RsmShell";
import PaymentForm from "@/components/admin/rsm/PaymentForm";
import { useRsmAccess } from "@/lib/useRsmAccess";
import type { Payment } from "@/types/rsm";

export default function EditPaymentPage() {
  const params = useParams();
  const id = params.id as string;

  const me = useRsmAccess("payments");
  const [payment, setPayment] = useState<Payment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/rsm/payments/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setPayment(data.payment);
      })
     .catch((err) => setError(err.message || "Failed to load payment"))
      .finally(() => setLoading(false));
  }, [id]);

  if (!me) return null;

  return (
    <RsmShell
      staffName={me.username}
      staffRole={me.role}
      title="Edit Payment"
      subtitle={payment ? payment.paymentNo : ""}
    >
      {loading && (
        <div className="flex items-center justify-center py-20 text-zinc-500">
          <Loader2 size={20} className="animate-spin mr-2" />
          Loading payment…
        </div>
      )}

      {!loading && error && (
        <div className="bg-red-950/30 border border-red-900/50 text-red-400 text-sm rounded-xl p-4">
          {error}
        </div>
      )}

      {!loading && !error && payment && <PaymentForm payment={payment} />}
    </RsmShell>
  );
}

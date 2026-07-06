"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import RsmShell from "@/components/admin/rsm/RsmShell";
import OrderForm from "@/components/admin/rsm/OrderForm";

async function fetchMe(): Promise<{ username: string; role: "admin" | "staff" }> {
  const res = await fetch("/api/rsm/me");
  if (!res.ok) throw new Error("not authed");
  return res.json();
}

export default function NewOrderPage() {
  const router = useRouter();
  const [me, setMe] = useState<{ username: string; role: "admin" | "staff" } | null>(null);

  useEffect(() => {
    fetchMe()
      .then(setMe)
      .catch(() => router.push("/RSM/login"));
  }, [router]);

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

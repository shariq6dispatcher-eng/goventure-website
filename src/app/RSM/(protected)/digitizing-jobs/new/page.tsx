"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import RsmShell from "@/components/admin/rsm/RsmShell";
import DigitizingJobForm from "@/components/admin/rsm/DigitizingJobForm";

async function fetchMe(): Promise<{ username: string; role: "admin" | "staff" }> {
  const res = await fetch("/api/rsm/me");
  if (!res.ok) throw new Error("not authed");
  return res.json();
}

export default function NewDigitizingJobPage() {
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
      title="New Digitizing Job"
      subtitle="Create a new digitizing job for a customer"
    >
      <DigitizingJobForm job={null} />
    </RsmShell>
  );
}

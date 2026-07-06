"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import RsmShell from "@/components/admin/rsm/RsmShell";
import StaffForm from "@/components/admin/rsm/StaffForm";

async function fetchMe(): Promise<{ username: string; role: "admin" | "staff" }> {
  const res = await fetch("/api/rsm/me");
  if (!res.ok) throw new Error("not authed");
  return res.json();
}

export default function NewStaffPage() {
  const router = useRouter();
  const [me, setMe] = useState<{ username: string; role: "admin" | "staff" } | null>(null);

  useEffect(() => {
    fetchMe()
      .then((data) => {
        setMe(data);
        if (data.role !== "admin") router.push("/RSM");
      })
      .catch(() => router.push("/RSM/login"));
  }, [router]);

  if (!me || me.role !== "admin") return null;

  return (
    <RsmShell
      staffName={me.username}
      staffRole={me.role}
      title="Add Staff Account"
      subtitle="Create a new login for a team member"
    >
      <StaffForm staff={null} />
    </RsmShell>
  );
}

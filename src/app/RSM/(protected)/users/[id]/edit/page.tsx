"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import RsmShell from "@/components/admin/rsm/RsmShell";
import StaffForm from "@/components/admin/rsm/StaffForm";
import type { RsmStaff } from "@/types/rsm";

async function fetchMe(): Promise<{ username: string; role: "admin" | "staff" }> {
  const res = await fetch("/api/rsm/me");
  if (!res.ok) throw new Error("not authed");
  return res.json();
}

type SafeStaff = Omit<RsmStaff, "password">;

export default function EditStaffPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [me, setMe] = useState<{ username: string; role: "admin" | "staff" } | null>(null);
  const [staff, setStaff] = useState<SafeStaff | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchMe()
      .then((data) => {
        setMe(data);
        if (data.role !== "admin") router.push("/RSM");
      })
      .catch(() => router.push("/RSM/login"));
  }, [router]);

  useEffect(() => {
    if (!me || me.role !== "admin") return;
    fetch(`/api/rsm/staff/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setStaff(data.staff);
      })
      .catch((err) => setError(err.message || "Failed to load staff member"))
      .finally(() => setLoading(false));
  }, [id, me]);

  if (!me || me.role !== "admin") return null;

  return (
    <RsmShell
      staffName={me.username}
      staffRole={me.role}
      title="Edit Staff Account"
      subtitle={staff ? staff.name : ""}
    >
      {loading && (
        <div className="flex items-center justify-center py-20 text-zinc-500">
          <Loader2 size={20} className="animate-spin mr-2" />
          Loading account…
        </div>
      )}

      {!loading && error && (
        <div className="bg-red-950/30 border border-red-900/50 text-red-400 text-sm rounded-xl p-4">
          {error}
        </div>
      )}

      {!loading && !error && staff && <StaffForm staff={staff} />}
    </RsmShell>
  );
}

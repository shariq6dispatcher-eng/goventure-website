"use client";

import { useEffect, useState } from "react"; 
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Plus, Loader2, Pencil, Trash2, UserCog } from "lucide-react";
import RsmShell from "@/components/admin/rsm/RsmShell";
import RsmSkeleton from "@/components/admin/rsm/RsmSkeleton";
import RsmEmptyState from "@/components/admin/rsm/RsmEmptyState";
import type { RsmStaff } from "@/types/rsm";

async function fetchMe(): Promise<{ username: string; role: "admin" | "staff" }> {
  const res = await fetch("/api/rsm/me");
  if (!res.ok) throw new Error("not authed");
  return res.json();
}

type SafeStaff = Omit<RsmStaff, "password">;

export default function UsersPage() {
  const router = useRouter();
  const [me, setMe] = useState<{ username: string; role: "admin" | "staff" } | null>(null);
  const [staff, setStaff] = useState<SafeStaff[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchMe()
      .then((data) => {
        setMe(data);
        if (data.role !== "admin") {
          router.push("/RSM");
        }
      })
      .catch(() => router.push("/RSM/login"));
  }, [router]);

  useEffect(() => {
    if (!me || me.role !== "admin") return;
    fetch("/api/rsm/staff")
      .then((r) => r.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setStaff(data.staff || []);
      })
      .catch((err) => setError(err.message || "Failed to load staff"))
      .finally(() => setLoading(false));
  }, [me]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this staff account? This cannot be undone.")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/rsm/staff/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Delete failed");
      setStaff((prev) => prev.filter((s) => s._id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setDeletingId(null);
    }
  };

  if (!me || me.role !== "admin") return null;

  return (
    <RsmShell
      staffName={me.username}
      staffRole={me.role}
      title="Users"
      subtitle={`${staff.length} staff account${staff.length === 1 ? "" : "s"}`}
    >
      <div className="flex justify-end mb-6">
        <Link
          href="/RSM/users/new"
          className="flex items-center justify-center gap-2 bg-[#D4AF37] text-black font-medium text-sm px-4 py-2.5 rounded-xl hover:opacity-90 transition-opacity whitespace-nowrap"
        >
          <Plus size={16} />
          Add Staff Account
        </Link>
      </div>

     {loading && <RsmSkeleton rows={4} />}

      {!loading && error && (
        <div className="bg-red-950/30 border border-red-900/50 text-red-400 text-sm rounded-xl p-4">
          {error}
        </div>
      )}

      {!loading && !error && staff.length === 0 && (
        <RsmEmptyState
          icon={UserCog}
          title="No other staff accounts yet"
          description="Add a staff account to give teammates access to specific RSM modules."
          ctaLabel="Add Staff Account"
          ctaHref="/RSM/users/new"
        />
      )}
     {!loading && !error && staff.length > 0 && (
        <>
          {/* Mobile card list */}
          <div className="sm:hidden space-y-2.5">
            {staff.map((s) => (
              <div
                key={s._id}
                className="bg-zinc-900/60 border border-zinc-900 rounded-xl p-3.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-white truncate">{s.name}</p>
                    <p className="text-xs text-zinc-400 mt-0.5 truncate">{s.username}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Link
                      href={`/RSM/users/${s._id}/edit`}
                      className="p-2 text-zinc-400 active:text-[#D4AF37] active:bg-zinc-800 rounded-lg transition-colors"
                      aria-label="Edit"
                    >
                      <Pencil size={15} />
                    </Link>
                    <button
                      onClick={() => handleDelete(s._id)}
                      disabled={deletingId === s._id || s.username === me.username}
                      className="p-2 text-zinc-400 active:text-red-400 active:bg-red-950/30 rounded-lg transition-colors disabled:opacity-30"
                      aria-label="Delete"
                      title={s.username === me.username ? "You can't delete your own account" : "Delete"}
                    >
                      {deletingId === s._id ? (
                        <Loader2 size={15} className="animate-spin" />
                      ) : (
                        <Trash2 size={15} />
                      )}
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-zinc-900">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border whitespace-nowrap ${
                      s.role === "admin"
                        ? "bg-[#D4AF37]/10 text-[#D4AF37] border-[#D4AF37]/30"
                        : "bg-zinc-800 text-zinc-300 border-zinc-700"
                    }`}
                  >
                    {s.role === "admin" ? "Admin" : "Staff"}
                  </span>
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border whitespace-nowrap ${
                      s.active
                        ? "bg-emerald-950 text-emerald-300 border-emerald-900"
                        : "bg-zinc-900 text-zinc-500 border-zinc-800"
                    }`}
                  >
                    {s.active ? "Active" : "Disabled"}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop table */}
          <div className="hidden sm:block bg-zinc-900/60 border border-zinc-900 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-900 text-zinc-500 text-xs uppercase tracking-wide">
                    <th className="text-left px-5 py-3 font-medium">Name</th>
                    <th className="text-left px-5 py-3 font-medium">Username</th>
                    <th className="text-left px-5 py-3 font-medium">Role</th>
                    <th className="text-left px-5 py-3 font-medium">Status</th>
                    <th className="text-right px-5 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {staff.map((s) => (
                    <tr
                      key={s._id}
                      className="border-b border-zinc-900/60 last:border-0 hover:bg-zinc-900/40"
                    >
                      <td className="px-5 py-3 font-medium">{s.name}</td>
                      <td className="px-5 py-3 text-zinc-400">{s.username}</td>
                      <td className="px-5 py-3">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border whitespace-nowrap ${
                            s.role === "admin"
                              ? "bg-[#D4AF37]/10 text-[#D4AF37] border-[#D4AF37]/30"
                              : "bg-zinc-800 text-zinc-300 border-zinc-700"
                          }`}
                        >
                          {s.role === "admin" ? "Admin" : "Staff"}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border whitespace-nowrap ${
                            s.active
                              ? "bg-emerald-950 text-emerald-300 border-emerald-900"
                              : "bg-zinc-900 text-zinc-500 border-zinc-800"
                          }`}
                        >
                          {s.active ? "Active" : "Disabled"}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/RSM/users/${s._id}/edit`}
                            className="p-2 text-zinc-400 hover:text-[#D4AF37] hover:bg-zinc-800 rounded-lg transition-colors"
                            aria-label="Edit"
                          >
                            <Pencil size={15} />
                          </Link>
                          <button
                            onClick={() => handleDelete(s._id)}
                            disabled={deletingId === s._id || s.username === me.username}
                            className="p-2 text-zinc-400 hover:text-red-400 hover:bg-red-950/30 rounded-lg transition-colors disabled:opacity-30"
                            aria-label="Delete"
                            title={s.username === me.username ? "You can't delete your own account" : "Delete"}
                          >
                            {deletingId === s._id ? (
                              <Loader2 size={15} className="animate-spin" />
                            ) : (
                              <Trash2 size={15} />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </RsmShell>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import type { RsmStaff, RsmRole, RsmModule } from "@/types/rsm";

interface StaffFormProps {
  staff: Omit<RsmStaff, "password"> | null; // null = creating new
}

const MODULE_OPTIONS: { value: RsmModule; label: string }[] = [
  { value: "dashboard", label: "Dashboard" },
  { value: "orders", label: "Orders" },
  { value: "payments", label: "Payments" },
  { value: "ledgers", label: "Customer Ledger" },
  { value: "expenses", label: "Expenses" },
  { value: "customers", label: "Customers" },
  { value: "reports", label: "Reports" },
  { value: "digitizing", label: "Digitizing Jobs" },
  { value: "digitizing_work", label: "Work Vault" },
  { value: "online_orders", label: "Online Orders" },
];

export default function StaffForm({ staff }: StaffFormProps) {
  const router = useRouter();

  const [username, setUsername] = useState(staff?.username || "");
  const [password, setPassword] = useState("");
  const [name, setName] = useState(staff?.name || "");
  const [email, setEmail] = useState(staff?.email || "");
  const [role, setRole] = useState<RsmRole>(staff?.role || "staff");
  const [allowedModules, setAllowedModules] = useState<RsmModule[]>(
    staff?.allowedModules || []
  );
  const [active, setActive] = useState(staff?.active ?? true);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const toggleModule = (mod: RsmModule) => {
    setAllowedModules((prev) =>
      prev.includes(mod) ? prev.filter((m) => m !== mod) : [...prev, mod]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Please enter a name.");
      return;
    }
    if (!staff && (!username.trim() || !password.trim())) {
      setError("Username and password are required for a new account.");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        username: username.trim(),
        password: password.trim() || undefined, // blank on edit = keep existing
        name: name.trim(),
        email,
        role,
        allowedModules,
        active,
      };

      const url = staff ? `/api/rsm/staff/${staff._id}` : "/api/rsm/staff";
      const method = staff ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");

      router.push("/RSM/users");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <div className="bg-zinc-900/60 border border-zinc-900 rounded-2xl p-5 grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-zinc-500 mb-1.5">Full Name *</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#D4AF37]"
            placeholder="e.g. Ayesha Khan"
          />
        </div>

        <div>
          <label className="block text-xs text-zinc-500 mb-1.5">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#D4AF37]"
            placeholder="Optional"
          />
        </div>

        <div>
          <label className="block text-xs text-zinc-500 mb-1.5">
            Username {!staff && "*"}
          </label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={!!staff}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#D4AF37] disabled:opacity-50"
            placeholder="lowercase, no spaces"
          />
          {staff && (
            <p className="text-xs text-zinc-600 mt-1">Username can't be changed after creation.</p>
          )}
        </div>

        <div>
          <label className="block text-xs text-zinc-500 mb-1.5">
            {staff ? "New Password" : "Password *"}
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#D4AF37]"
            placeholder={staff ? "Leave blank to keep current password" : ""}
          />
        </div>

        <div>
          <label className="block text-xs text-zinc-500 mb-1.5">Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as RsmRole)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#D4AF37]"
          >
            <option value="staff">Staff</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <div className="flex items-center gap-3 pt-6">
          <button
            type="button"
            onClick={() => setActive((v) => !v)}
            className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${
              active ? "bg-[#D4AF37]" : "bg-zinc-700"
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                active ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
          <span className="text-sm">{active ? "Account Active" : "Account Disabled"}</span>
        </div>
      </div>

      {role === "staff" && (
        <div className="bg-zinc-900/60 border border-zinc-900 rounded-2xl p-5">
          <h3 className="text-sm font-semibold mb-1">Allowed Modules</h3>
          <p className="text-xs text-zinc-500 mb-4">
            Ignored for Admin accounts, which always see everything.
          </p>
          <div className="grid sm:grid-cols-2 gap-2">
            {MODULE_OPTIONS.map((mod) => (
              <label
                key={mod.value}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl border border-zinc-800 bg-zinc-900 cursor-pointer text-sm"
              >
                <input
                  type="checkbox"
                  checked={allowedModules.includes(mod.value)}
                  onChange={() => toggleModule(mod.value)}
                  className="accent-[#D4AF37]"
                />
                {mod.label}
              </label>
            ))}
          </div>
        </div>
      )}

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => router.push("/RSM/users")}
          className="px-5 py-2.5 rounded-xl text-sm font-medium text-zinc-400 border border-zinc-800 hover:bg-zinc-900 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="px-5 py-2.5 rounded-xl text-sm font-medium bg-[#D4AF37] text-black hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2"
        >
          {saving && <Loader2 size={15} className="animate-spin" />}
          {staff ? "Save Changes" : "Create Account"}
        </button>
      </div>
    </form>
  );
}

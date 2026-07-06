"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Search } from "lucide-react";
import RsmShell from "@/components/admin/rsm/RsmShell";
import type { Customer, LedgerEntry } from "@/types/rsm";

async function fetchMe(): Promise<{ username: string; role: "admin" | "staff" }> {
  const res = await fetch("/api/rsm/me");
  if (!res.ok) throw new Error("not authed");
  return res.json();
}

export default function LedgerPage() {
  const router = useRouter();
  const [me, setMe] = useState<{ username: string; role: "admin" | "staff" } | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [customerId, setCustomerId] = useState("");
  const [entries, setEntries] = useState<LedgerEntry[]>([]);
  const [loadingCustomers, setLoadingCustomers] = useState(true);
  const [loadingEntries, setLoadingEntries] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");

  useEffect(() => {
    fetchMe()
      .then(setMe)
      .catch(() => router.push("/RSM/login"));

    fetch("/api/rsm/customers")
      .then((r) => r.json())
      .then((data) => setCustomers(data.customers || []))
      .catch(() => setError("Failed to load customers"))
      .finally(() => setLoadingCustomers(false));
  }, [router]);

  useEffect(() => {
    if (!customerId) {
      setEntries([]);
      return;
    }
    setLoadingEntries(true);
    setError("");
    fetch(`/api/rsm/ledger?customerId=${customerId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setEntries(data.entries || []);
      })
      .catch((err) => setError(err.message || "Failed to load ledger"))
      .finally(() => setLoadingEntries(false));
  }, [customerId]);

  const filteredCustomers = customers.filter((c) =>
    c.name.toLowerCase().includes(query.toLowerCase())
  );

  // Entries come back newest-first (createdAt desc) since that's what the
  // API sorts by. For a ledger, oldest-first reads naturally top to bottom,
  // so flip it for display only.
  const displayEntries = [...entries].reverse();
  const currentBalance = entries[0]?.balance ?? 0;
  const selectedCustomer = customers.find((c) => c._id === customerId);

  if (!me) return null;

  return (
    <RsmShell
      staffName={me.username}
      staffRole={me.role}
      title="Customer Ledger"
      subtitle="Running balance per customer, from invoices and payments"
    >
      <div className="grid sm:grid-cols-[280px_1fr] gap-6">
        {/* Customer picker sidebar */}
        <div className="bg-zinc-900/60 border border-zinc-900 rounded-2xl p-4 h-fit">
          <div className="relative mb-3">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search customers…"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-8 pr-3 py-2 text-sm focus:outline-none focus:border-[#D4AF37]"
            />
          </div>

          {loadingCustomers && (
            <div className="flex items-center justify-center py-8 text-zinc-500">
              <Loader2 size={16} className="animate-spin" />
            </div>
          )}

          {!loadingCustomers && (
            <div className="space-y-1 max-h-[60vh] overflow-y-auto">
              {filteredCustomers.map((c) => (
                <button
                  key={c._id}
                  onClick={() => setCustomerId(c._id)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    customerId === c._id
                      ? "bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30"
                      : "text-zinc-300 hover:bg-zinc-800 border border-transparent"
                  }`}
                >
                  {c.name}
                </button>
              ))}
              {filteredCustomers.length === 0 && (
                <p className="text-xs text-zinc-500 px-3 py-2">No customers found.</p>
              )}
            </div>
          )}
        </div>

        {/* Ledger detail */}
        <div>
          {!customerId && (
            <div className="bg-zinc-900/60 border border-zinc-900 rounded-2xl p-10 text-center text-zinc-500 text-sm">
              Select a customer on the left to view their ledger.
            </div>
          )}

          {customerId && (
            <>
              <div className="bg-zinc-900/60 border border-zinc-900 rounded-2xl p-5 mb-5 flex items-center justify-between">
                <div>
                  <p className="text-xs text-zinc-500 mb-1">Customer</p>
                  <p className="font-medium">{selectedCustomer?.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-zinc-500 mb-1">Current Balance</p>
                  <p className={`text-lg font-bold ${currentBalance > 0 ? "text-amber-400" : "text-emerald-400"}`}>
                    ${currentBalance.toFixed(2)}
                  </p>
                </div>
              </div>

              {loadingEntries && (
                <div className="flex items-center justify-center py-16 text-zinc-500">
                  <Loader2 size={18} className="animate-spin mr-2" />
                  Loading ledger…
                </div>
              )}

              {!loadingEntries && error && (
                <div className="bg-red-950/30 border border-red-900/50 text-red-400 text-sm rounded-xl p-4">
                  {error}
                </div>
              )}

              {!loadingEntries && !error && displayEntries.length === 0 && (
                <div className="bg-zinc-900/60 border border-zinc-900 rounded-2xl p-10 text-center text-zinc-500 text-sm">
                  No invoices or payments recorded for this customer yet.
                </div>
              )}

              {!loadingEntries && !error && displayEntries.length > 0 && (
                <div className="bg-zinc-900/60 border border-zinc-900 rounded-2xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-zinc-900 text-zinc-500 text-xs uppercase tracking-wide">
                          <th className="text-left px-5 py-3 font-medium">Date</th>
                          <th className="text-left px-5 py-3 font-medium">Type</th>
                          <th className="text-left px-5 py-3 font-medium">Description</th>
                          <th className="text-right px-5 py-3 font-medium">Debit</th>
                          <th className="text-right px-5 py-3 font-medium">Credit</th>
                          <th className="text-right px-5 py-3 font-medium">Balance</th>
                        </tr>
                      </thead>
                      <tbody>
                        {displayEntries.map((entry) => (
                          <tr
                            key={entry._id}
                            className="border-b border-zinc-900/60 last:border-0"
                          >
                            <td className="px-5 py-3 text-zinc-400">{entry.date}</td>
                            <td className="px-5 py-3">
                              <span
                                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border whitespace-nowrap ${
                                  entry.type === "Invoice"
                                    ? "bg-amber-950 text-amber-300 border-amber-900"
                                    : "bg-emerald-950 text-emerald-300 border-emerald-900"
                                }`}
                              >
                                {entry.type}
                              </span>
                            </td>
                            <td className="px-5 py-3 text-zinc-400">{entry.description}</td>
                            <td className="px-5 py-3 text-right">
                              {entry.debit > 0 ? `$${entry.debit.toFixed(2)}` : "—"}
                            </td>
                            <td className="px-5 py-3 text-right">
                              {entry.credit > 0 ? `$${entry.credit.toFixed(2)}` : "—"}
                            </td>
                            <td className="px-5 py-3 text-right font-medium">
                              ${entry.balance.toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </RsmShell>
  );
}

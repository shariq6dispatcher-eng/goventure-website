"use client";

import { useEffect, useState } from "react";
import { Loader2, Search, BookOpen, FileQuestion } from "lucide-react";
import RsmShell from "@/components/admin/rsm/RsmShell";
import RsmEmptyState from "@/components/admin/rsm/RsmEmptyState";
import { useRsmAccess } from "@/lib/useRsmAccess";
import type { Customer, LedgerEntry } from "@/types/rsm";

export default function LedgerPage() {
  const me = useRsmAccess("ledgers");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [customerId, setCustomerId] = useState("");
  const [entries, setEntries] = useState<LedgerEntry[]>([]);
  const [loadingCustomers, setLoadingCustomers] = useState(true);
  const [loadingEntries, setLoadingEntries] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");

  useEffect(() => {
    fetch("/api/rsm/customers")
      .then((r) => r.json())
      .then((data) => setCustomers(data.customers || []))
      .catch(() => setError("Failed to load customers"))
      .finally(() => setLoadingCustomers(false));
  }, []);
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
     <div className="grid sm:grid-cols-[280px_1fr] gap-4 sm:gap-6">
        {/* Customer picker sidebar */}
        <div className="bg-zinc-900/60 border border-zinc-900 rounded-xl sm:rounded-2xl p-3.5 sm:p-4 h-fit">
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
          <div className="space-y-1 max-h-[45vh] sm:max-h-[60vh] overflow-y-auto">
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
            <RsmEmptyState
              icon={BookOpen}
              title="No customer selected"
              description="Choose a customer from the list on the left to view their invoice and payment history."
            />
          )}

          {customerId && (
            <>
              <div className="bg-zinc-900/60 border border-zinc-900 rounded-xl sm:rounded-2xl p-3.5 sm:p-5 mb-3.5 sm:mb-5 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[11px] sm:text-xs text-zinc-500 mb-1">Customer</p>
                  <p className="text-sm sm:text-base font-medium truncate">{selectedCustomer?.name}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[11px] sm:text-xs text-zinc-500 mb-1">Current Balance</p>
                  <p className={`text-base sm:text-lg font-bold ${currentBalance > 0 ? "text-amber-400" : "text-emerald-400"}`}>
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
                <RsmEmptyState
                  icon={FileQuestion}
                  title="No ledger activity yet"
                  description={`No invoices or payments recorded for ${selectedCustomer?.name || "this customer"} yet.`}
                />
              )}

              {!loadingEntries && !error && displayEntries.length > 0 && (
                <>
                  {/* Mobile card list */}
                  <div className="sm:hidden space-y-2.5">
                    {displayEntries.map((entry) => (
                      <div
                        key={entry._id}
                        className="bg-zinc-900/60 border border-zinc-900 rounded-xl p-3.5"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border whitespace-nowrap ${
                              entry.type === "Invoice"
                                ? "bg-amber-950 text-amber-300 border-amber-900"
                                : "bg-emerald-950 text-emerald-300 border-emerald-900"
                            }`}
                          >
                            {entry.type}
                          </span>
                          <span className="text-[11px] text-zinc-500">{entry.date}</span>
                        </div>
                        <p className="text-xs text-zinc-400 mt-2 truncate">{entry.description}</p>
                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-zinc-900 text-xs">
                          <div>
                            <span className="text-zinc-500">Debit: </span>
                            <span className="font-mono text-white">
                              {entry.debit > 0 ? `$${entry.debit.toFixed(2)}` : "—"}
                            </span>
                          </div>
                          <div>
                            <span className="text-zinc-500">Credit: </span>
                            <span className="font-mono text-white">
                              {entry.credit > 0 ? `$${entry.credit.toFixed(2)}` : "—"}
                            </span>
                          </div>
                          <div>
                            <span className="text-zinc-500">Bal: </span>
                            <span className="font-mono font-bold text-[#D4AF37]">
                              ${entry.balance.toFixed(2)}
                            </span>
                          </div>
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
                </>
              )}
                </>
              )}
        </div>
      </div>
    </RsmShell>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import RsmShell from "@/components/admin/rsm/RsmShell";
import ExpenseForm from "@/components/admin/rsm/ExpenseForm";
import { useRsmAccess } from "@/lib/useRsmAccess";
import type { Expense } from "@/types/rsm";

export default function EditExpensePage() {
  const params = useParams();
  const id = params.id as string;

  const me = useRsmAccess("expenses");
  const [expense, setExpense] = useState<Expense | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/rsm/expenses/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setExpense(data.expense);
      })
      .catch((err) => setError(err.message || "Failed to load expense"))
      .finally(() => setLoading(false));
  }, [id]);

  if (!me) return null;

  return (
    <RsmShell
      staffName={me.username}
      staffRole={me.role}
      title="Edit Expense"
      subtitle={expense ? expense.expenseNo : ""}
    >
      {loading && (
        <div className="flex items-center justify-center py-20 text-zinc-500">
          <Loader2 size={20} className="animate-spin mr-2" />
          Loading expense…
        </div>
      )}

      {!loading && error && (
        <div className="bg-red-950/30 border border-red-900/50 text-red-400 text-sm rounded-xl p-4">
          {error}
        </div>
      )}

      {!loading && !error && expense && <ExpenseForm expense={expense} />}
    </RsmShell>
  );
}

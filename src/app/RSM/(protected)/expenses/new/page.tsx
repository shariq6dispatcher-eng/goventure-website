"use client";

import RsmShell from "@/components/admin/rsm/RsmShell";
import ExpenseForm from "@/components/admin/rsm/ExpenseForm";
import { useRsmAccess } from "@/lib/useRsmAccess";

export default function NewExpensePage() {
  const me = useRsmAccess("expenses");

  if (!me) return null;

  return (
    <RsmShell
      staffName={me.username}
      staffRole={me.role}
      title="Add Expense"
      subtitle="Record a new business expense"
    >
      <ExpenseForm expense={null} />
    </RsmShell>
  );
}

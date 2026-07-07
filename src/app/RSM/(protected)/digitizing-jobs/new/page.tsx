"use client";

import RsmShell from "@/components/admin/rsm/RsmShell";
import DigitizingJobForm from "@/components/admin/rsm/DigitizingJobForm";
import { useRsmAccess } from "@/lib/useRsmAccess";

export default function NewDigitizingJobPage() {
  const me = useRsmAccess("digitizing");

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

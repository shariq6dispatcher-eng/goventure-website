"use client";

import RsmShell from "@/components/admin/rsm/RsmShell";
import LeadForm from "@/components/admin/rsm/LeadForm";
import { useRsmAccess } from "@/lib/useRsmAccess";

export default function NewLeadPage() {
  const me = useRsmAccess("leads");

  if (!me) return null;

  return (
    <RsmShell
      staffName={me.username}
      staffRole={me.role}
      title="Add Lead"
      subtitle="Record a new lead"
    >
      <LeadForm lead={null} />
    </RsmShell>
  );
}

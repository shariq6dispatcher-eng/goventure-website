import { getRsmAuth } from "@/lib/rsm-auth";
import RsmShell from "@/components/admin/rsm/RsmShell";
import RsmReportsClient from "@/components/admin/rsm/RsmReportsClient";

export default async function RsmReportsPage() {
  const auth = await getRsmAuth();

  return (
    <RsmShell
      staffName={auth.username}
      staffRole={auth.role}
      title="Reports"
      subtitle="Monthly business performance, section by section"
    >
      <RsmReportsClient />
    </RsmShell>
  );
}

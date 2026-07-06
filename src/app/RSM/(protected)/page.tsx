import { getRsmAuth } from "@/lib/rsm-auth";
import RsmShell from "@/components/admin/rsm/RsmShell";
import {
  ClipboardList,
  Wallet,
  Users,
  Sparkles,
} from "lucide-react";

const PLACEHOLDER_STATS = [
  { label: "Open Orders", value: "—", icon: ClipboardList },
  { label: "Pending Payments", value: "—", icon: Wallet },
  { label: "Active Customers", value: "—", icon: Users },
  { label: "Digitizing Jobs", value: "—", icon: Sparkles },
];

export default async function RsmHomePage() {
  const auth = await getRsmAuth();

  return (
    <RsmShell
      staffName={auth.username}
      staffRole={auth.role}
      title="Dashboard"
      subtitle="Overview of your business at a glance"
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {PLACEHOLDER_STATS.map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="bg-zinc-900/60 border border-zinc-900 rounded-2xl p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <Icon size={18} className="text-[#D4AF37]" />
            </div>
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-zinc-500 text-xs mt-1">{label}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-zinc-900/60 border border-zinc-900 rounded-2xl p-6">
        <p className="text-zinc-400 text-sm">
          Real numbers here will connect once the Orders, Payments, and
          Customers modules are built — coming up in the next phases.
        </p>
      </div>
    </RsmShell>
  );
}

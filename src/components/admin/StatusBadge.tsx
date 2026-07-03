const STATUS_STYLES: Record<string, string> = {
  New: "bg-blue-950 text-blue-300 border-blue-900",
  "In Progress": "bg-amber-950 text-amber-300 border-amber-900",
  Quoted: "bg-violet-950 text-violet-300 border-violet-900",
  Completed: "bg-emerald-950 text-emerald-300 border-emerald-900",
  Declined: "bg-red-950 text-red-300 border-red-900",
};

export default function StatusBadge({ status }: { status: string }) {
  const style =
    STATUS_STYLES[status] || "bg-zinc-900 text-zinc-300 border-zinc-800";

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${style}`}
    >
      {status}
    </span>
  );
}

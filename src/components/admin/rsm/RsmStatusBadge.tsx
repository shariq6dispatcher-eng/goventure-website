const ORDER_STATUS_STYLES: Record<string, string> = {
  Pending: "bg-zinc-800 text-zinc-300 border-zinc-700",
  "In Progress": "bg-amber-950 text-amber-300 border-amber-900",
  Completed: "bg-emerald-950 text-emerald-300 border-emerald-900",
  Delivered: "bg-blue-950 text-blue-300 border-blue-900",
  Cancelled: "bg-red-950 text-red-300 border-red-900",
};

export default function RsmStatusBadge({ status }: { status: string }) {
  const style =
    ORDER_STATUS_STYLES[status] || "bg-zinc-900 text-zinc-300 border-zinc-800";

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border whitespace-nowrap ${style}`}
    >
      {status}
    </span>
  );
}

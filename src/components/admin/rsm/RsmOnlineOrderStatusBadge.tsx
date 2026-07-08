const ONLINE_ORDER_STATUS_STYLES: Record<string, string> = {
  Requested: "bg-zinc-800 text-zinc-300 border-zinc-700",
  Quoted: "bg-amber-950 text-amber-300 border-amber-900",
  Approved: "bg-blue-950 text-blue-300 border-blue-900",
  "Files Ready": "bg-purple-950 text-purple-300 border-purple-900",
  "Payment Submitted": "bg-amber-950 text-amber-300 border-amber-900",
  "Payment Approved": "bg-teal-950 text-teal-300 border-teal-900",
  Completed: "bg-emerald-950 text-emerald-300 border-emerald-900",
  Rejected: "bg-red-950 text-red-300 border-red-900",
};

export default function RsmOnlineOrderStatusBadge({ status }: { status: string }) {
  const style =
    ONLINE_ORDER_STATUS_STYLES[status] || "bg-zinc-900 text-zinc-300 border-zinc-800";

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border whitespace-nowrap ${style}`}
    >
      {status}
    </span>
  );
}

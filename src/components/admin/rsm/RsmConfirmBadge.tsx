export default function RsmConfirmBadge({ confirmed }: { confirmed: boolean }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border whitespace-nowrap ${
        confirmed
          ? "bg-emerald-950 text-emerald-300 border-emerald-900"
          : "bg-amber-950 text-amber-300 border-amber-900"
      }`}
    >
      {confirmed ? "Confirmed" : "Pending"}
    </span>
  );
}

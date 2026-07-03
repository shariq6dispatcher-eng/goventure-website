interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: number | string;
  accent?: boolean;
}

export default function StatCard({
  icon: Icon,
  label,
  value,
  accent = false,
}: StatCardProps) {
  return (
    <div className="rounded-2xl bg-zinc-950 border border-zinc-800 p-6 flex items-center gap-4">
      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
          accent ? "bg-[#D4AF37] text-black" : "bg-zinc-900 text-[#D4AF37]"
        }`}
      >
        <Icon size={20} />
      </div>
      <div>
        <p className="text-2xl font-bold leading-none">{value}</p>
        <p className="text-sm text-zinc-500 mt-1.5">{label}</p>
      </div>
    </div>
  );
}

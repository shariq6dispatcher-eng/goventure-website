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
    <div className="rounded-xl sm:rounded-2xl bg-zinc-950 border border-zinc-800 p-4 sm:p-6 flex items-center gap-3 sm:gap-4">
      <div
        className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0 ${
          accent ? "bg-[#D4AF37] text-black" : "bg-zinc-900 text-[#D4AF37]"
        }`}
      >
        <Icon size={18} className="sm:hidden" />
        <Icon size={20} className="hidden sm:block" />
      </div>
      <div className="min-w-0">
        <p className="text-xl sm:text-2xl font-bold leading-none">{value}</p>
        <p className="text-xs sm:text-sm text-zinc-500 mt-1.5 truncate">{label}</p>
      </div>
    </div>
  );
}

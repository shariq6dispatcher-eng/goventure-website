import Link from "next/link";
import type { LucideIcon } from "lucide-react";

interface RsmEmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  ctaLabel?: string;
  ctaHref?: string;
}

/**
 * Reusable "nothing here yet" panel for RSM list pages. Used both for the
 * true-empty case (no records at all — shows a CTA) and the
 * no-results-match-filter case (no CTA, just a hint to adjust the search).
 */
export default function RsmEmptyState({
  icon: Icon,
  title,
  description,
  ctaLabel,
  ctaHref,
}: RsmEmptyStateProps) {
  return (
    <div className="bg-zinc-900/60 border border-dashed border-zinc-800 rounded-2xl p-10 sm:p-14 text-center">
      <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto mb-4">
        <Icon className="w-5 h-5 text-[#D4AF37]" />
      </div>
      <h3 className="text-sm font-bold text-white">{title}</h3>
      {description && (
        <p className="text-xs sm:text-sm text-zinc-500 mt-1.5 max-w-sm mx-auto">
          {description}
        </p>
      )}
      {ctaLabel && ctaHref && (
        <Link
          href={ctaHref}
          className="inline-flex items-center gap-2 mt-5 px-4 py-2.5 rounded-xl bg-[#D4AF37] text-black text-xs sm:text-sm font-bold hover:opacity-90 transition-opacity"
        >
          {ctaLabel}
        </Link>
      )}
    </div>
  );
}

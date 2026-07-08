/**
 * Reusable skeleton loader for RSM list pages. Renders a handful of
 * pulsing placeholder rows so pages don't just show plain "Loading…"
 * text while data fetches. Two shapes: table rows and card rows.
 */

export function RsmSkeletonRows({ rows = 5 }: { rows?: number }) {
  return (
    <div className="hidden sm:block bg-zinc-900/60 border border-zinc-900 rounded-2xl overflow-hidden">
      <div className="divide-y divide-zinc-900/60">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-5 py-4">
            <div className="h-3.5 w-20 bg-zinc-800 rounded animate-pulse" />
            <div className="h-3.5 w-32 bg-zinc-800 rounded animate-pulse" />
            <div className="h-3.5 w-16 bg-zinc-800 rounded animate-pulse ml-auto" />
            <div className="h-3.5 w-16 bg-zinc-800 rounded animate-pulse" />
            <div className="h-3.5 w-20 bg-zinc-800 rounded animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function RsmSkeletonCards({ rows = 4 }: { rows?: number }) {
  return (
    <div className="sm:hidden space-y-2.5">
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="bg-zinc-900/60 border border-zinc-900 rounded-xl p-3.5 space-y-2.5"
        >
          <div className="flex items-center justify-between">
            <div className="h-3.5 w-24 bg-zinc-800 rounded animate-pulse" />
            <div className="h-3.5 w-14 bg-zinc-800 rounded-full animate-pulse" />
          </div>
          <div className="h-3 w-36 bg-zinc-800 rounded animate-pulse" />
          <div className="flex items-center justify-between pt-2 border-t border-zinc-900">
            <div className="h-3 w-16 bg-zinc-800 rounded animate-pulse" />
            <div className="h-3 w-16 bg-zinc-800 rounded animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
}

/** Convenience wrapper: renders both the mobile card and desktop table
 * skeletons at once, matching how list pages render both breakpoints. */
export default function RsmSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <>
      <RsmSkeletonCards rows={Math.min(rows, 4)} />
      <RsmSkeletonRows rows={rows} />
    </>
  );
}

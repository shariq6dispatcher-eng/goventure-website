"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, X, Loader2, User, ClipboardList, Sparkles } from "lucide-react";
import type { SearchResultItem } from "@/app/api/rsm/search/route";

const TYPE_ICON: Record<SearchResultItem["type"], React.ElementType> = {
  customer: User,
  order: ClipboardList,
  digitizingJob: Sparkles,
};

const TYPE_LABEL: Record<SearchResultItem["type"], string> = {
  customer: "Customer",
  order: "Order",
  digitizingJob: "Digitizing Job",
};

export default function RsmGlobalSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounced fetch — waits 300ms after typing stops before hitting the API,
  // so we're not firing a request on every keystroke.
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (query.trim().length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/rsm/search?q=${encodeURIComponent(query.trim())}`);
        const data = await res.json();
        setResults(data.results || []);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  // Close dropdown on outside click
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const handleSelect = (item: SearchResultItem) => {
    setOpen(false);
    setQuery("");
    setResults([]);
    router.push(item.href);
  };

  const showDropdown = open && query.trim().length >= 2;

  return (
    <div ref={containerRef} className="relative w-full max-w-xs sm:max-w-sm">
      <div className="relative">
        <Search
          size={15}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none"
        />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="Search orders, customers, jobs…"
          className="w-full bg-zinc-950 border border-zinc-900 rounded-xl pl-9 pr-8 py-2 text-xs sm:text-sm text-zinc-200 placeholder:text-zinc-600 outline-none focus:border-[#D4AF37] transition"
        />
        {query && (
          <button
            onClick={() => {
              setQuery("");
              setResults([]);
            }}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
            aria-label="Clear search"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {showDropdown && (
        <div className="absolute z-50 mt-1.5 w-full bg-zinc-950 border border-zinc-800 rounded-xl shadow-xl max-h-80 overflow-y-auto">
          {loading && (
            <div className="flex items-center gap-2 px-4 py-3 text-xs text-zinc-500">
              <Loader2 size={13} className="animate-spin" />
              Searching…
            </div>
          )}

          {!loading && results.length === 0 && (
            <div className="px-4 py-3 text-xs text-zinc-500">
              No matches for &ldquo;{query}&rdquo;
            </div>
          )}

          {!loading &&
            results.map((item) => {
              const Icon = TYPE_ICON[item.type];
              return (
                <button
                  key={`${item.type}-${item.id}`}
                  onClick={() => handleSelect(item)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-zinc-900 transition border-b border-zinc-900 last:border-b-0"
                >
                  <span className="shrink-0 p-1.5 rounded-lg bg-zinc-900 text-[#D4AF37]">
                    <Icon size={14} />
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-white truncate">
                      {item.title}
                    </p>
                    <p className="text-[11px] text-zinc-500 truncate">
                      {TYPE_LABEL[item.type]} · {item.subtitle}
                    </p>
                  </div>
                </button>
              );
            })}
        </div>
      )}
    </div>
  );
}

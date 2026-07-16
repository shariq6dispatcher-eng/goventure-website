"use client";
import Image from "next/image";
import {
  LayoutDashboard,
  Images,
  ShoppingBag,
  FileText,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export type AdminTab = "overview" | "portfolio" | "products" | "quotes";

interface SidebarProps {
  activeTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
  newQuoteCount: number;
}

const NAV_ITEMS: { id: AdminTab; label: string; icon: React.ElementType }[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "portfolio", label: "Portfolio", icon: Images },
  { id: "products", label: "Shop Products", icon: ShoppingBag },
  { id: "quotes", label: "Quote Requests", icon: FileText },
];

export default function Sidebar({
  activeTab,
  onTabChange,
  newQuoteCount,
}: SidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } finally {
      router.push("/admin-login");
      router.refresh();
    }
  };

  const NavContent = (
    <>
     <div className="px-6 pt-8 pb-6 flex items-center gap-3">
        <Image
          src="/images/logo.png"
          alt="GoVenture logo"
          width={36}
          height={36}
        />
        <div>
          <p className="text-xs uppercase tracking-[3px] text-[#D4AF37]">
            GoVenture
          </p>
          <h1 className="text-xl font-bold mt-1">Admin Dashboard</h1>
        </div>
      </div>
      <nav className="flex-1 px-3 space-y-1">
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
          const active = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => {
                onTabChange(id);
                setMobileOpen(false);
              }}
              className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                active
                  ? "bg-[#D4AF37] text-black"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-900"
              }`}
            >
              <span className="flex items-center gap-3">
                <Icon size={17} />
                {label}
              </span>
              {id === "quotes" && newQuoteCount > 0 && (
                <span
                  className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                    active ? "bg-black/20 text-black" : "bg-[#D4AF37] text-black"
                  }`}
                >
                  {newQuoteCount}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-3 border-t border-zinc-900">
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-zinc-400 hover:text-red-400 hover:bg-red-950/30 transition-colors disabled:opacity-50"
        >
          <LogOut size={17} />
          {loggingOut ? "Logging out…" : "Log Out"}
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile top bar */}
      <div className="lg:hidden sticky top-0 z-40 flex items-center justify-between px-4 h-16 bg-zinc-950 border-b border-zinc-900">
        <span className="text-sm font-semibold">
          GoVenture <span className="text-[#D4AF37]">Admin</span>
        </span>
        <button
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
          className="text-zinc-300"
        >
          <Menu size={22} />
        </button>
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 shrink-0 h-screen sticky top-0 bg-zinc-950 border-r border-zinc-900">
        {NavContent}
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/80"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative flex flex-col w-72 h-full bg-zinc-950 border-r border-zinc-900">
            <button
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
              className="absolute top-6 right-4 text-zinc-400"
            >
              <X size={20} />
            </button>
            {NavContent}
          </aside>
        </div>
      )}
    </>
  );
}
